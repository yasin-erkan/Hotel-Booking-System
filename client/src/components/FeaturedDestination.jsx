import React from 'react';
import {roomsDummyData} from '../assets/assets';
import HotelCard from './HotelCard';
import Title from './Title';
import {useNavigate} from 'react-router-dom';

const FeaturedDestination = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center bg-slate-50 px-4 py-20 sm:px-8 md:px-10 lg:px-12">
      <Title
        title="Featured Destination"
        subTitle=" Explore our handpicked selection of the most popular and stunning destinations around the world. Perfect for your next adventure."
      />

      <div className="mt-20 grid w-full max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4">
        {roomsDummyData.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      <button
        onClick={() => {
          navigate('/rooms');
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
        className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer mt-10">
        <span>View All Destinations</span>
      </button>
    </div>
  );
};

export default FeaturedDestination;
