import React, {useState, useEffect} from 'react';
import Title from '../components/Title';
import {assets} from '../assets/assets';
import {useAppContext} from '../context/AppContext';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const {axios, getToken, user} = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get('/api/bookings/user', {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message);
        setBookings([]);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch bookings',
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);
  return (
    <div className="py-28 md:py-35  md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Manage your bookings and reservations with ease. Plan your trips seamlessly with our booking management system."
        align="left"
      />

      <div className="max-w-7xl mt-8 w-full text-gray-800 mx-auto">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">
              Start booking rooms to see them here
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-[4fr_3fr_2fr] w-full border-b border-gray-300 font-medium text-base py-3">
              <div className="pr-6">Hotels</div>
              <div className="px-6">Date & Timings</div>
              <div className="pl-6">Payment</div>
            </div>
            {bookings.map(booking => {
              // Safety checks for populated data
              if (!booking.room || !booking.hotel) {
                return null;
              }
              return (
                <div
                  key={booking._id}
                  className="grid grid-cols-1 gap-6 md:grid-cols-[4fr_3fr_2fr] md:items-center w-full border-b border-gray-300 first-border-t py-6 md:gap-0">
                  {/* hotel detail */}

                  <div className="flex flex-col md:flex-row gap-6 md:pr-6">
                    <img
                      src={booking.room.images[0]}
                      alt="hotel-img"
                      className="md:w-44 rounded shadow object-cover"
                    />
                    <div>
                      <p className="font-playfair text-2xl ">
                        {booking.hotel.name}
                        <span className="font-inter text-sm ">
                          ({booking.room.roomType})
                        </span>
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                        <img src={assets.locationIcon} alt="location-icon" />
                        <span className="text-gray-500">
                          {' '}
                          {booking.hotel.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm mb-2">
                        <img src={assets.guestsIcon} alt="guests-icon" />
                        <span className="text-gray-500">
                          {' '}
                          {booking.guests} guests
                        </span>
                      </div>
                      <p className="text-base mb-2">
                        Total Price: ${booking.totalPrice}
                      </p>
                    </div>
                  </div>

                  {/* date & timings */}
                  <div className="flex flex-col gap-4 mt-2 md:mt-0 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                      <span className="font-medium text-sm md:text-base text-gray-700">
                        Check-In
                      </span>
                      <p className="text-gray-500 text-sm">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                      <span className="font-medium text-sm md:text-base text-gray-700">
                        Check-Out
                      </span>
                      <p className="text-gray-500 text-sm">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* payment status*/}
                  <div className="flex flex-col items-start justify-center gap-4 mt-2 md:mt-0 md:pl-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <p className="font-medium text-sm md:text-base">
                        {booking.isPaid ? 'Paid' : 'Unpaid'}
                      </p>
                    </div>
                    {!booking.isPaid && (
                      <button className="px-4 py-1.5 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
