import React, {useState} from 'react';
import Title from '../../components/Title';
import {dashboardDummyData} from '../../assets/assets';
import {assets} from '../../assets/assets';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(dashboardDummyData);
  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Welcome to your hotel dashboard. Manage your hotel bookings, rooms, and more."
      />
      <div className="flex gap-4 my-8">
        {/* total bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
          <img src={assets.totalBookingIcon} alt="total-bookings" />
          <div>
            <h3 className="text-lg font-medium text-gray-800">
              Total Bookings
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardDummyData.totalBookings}
            </p>
          </div>
        </div>
        {/* total revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
          <img src={assets.totalRevenueIcon} alt="total-revenue" />
          <h3 className="text-lg font-medium text-gray-800">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">
            {dashboardDummyData.totalRevenue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
