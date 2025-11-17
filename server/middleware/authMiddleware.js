import User from '../models/User.js';
import {ensureConnection} from '../configs/db.js';

export const protect = async (req, res, next) => {
  try {
    const auth = req.auth ? await req.auth() : null;
    const userId = auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    await ensureConnection();

    let user = await User.findById(userId);

    if (!user) {
      // Auto-create user if webhook hasn't fired yet (fallback for local dev)
      try {
        user = await User.create({
          _id: userId,
          username: `user_${userId.slice(-8)}`,
          email: `${userId}@clerk.local`,
          image: '',
          role: 'user',
        });
      } catch (error) {
        // Race condition: retry find if another request created the user
        user = await User.findById(userId);
        if (!user) {
          throw error;
        }
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};
