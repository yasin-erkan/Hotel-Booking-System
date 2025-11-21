import React, {useState, useEffect} from 'react';
import HotelCard from './HotelCard';
import Title from './Title';
import {useAppContext} from '../context/AppContext.jsx';

const RecommendedHotels = () => {
  const {rooms, searchedCities} = useAppContext();
  const [recommended, setRecommended] = useState([]);

  const filterHotel = () => {
    // Only show recommended hotels if user has searched for cities
    if (searchedCities.length === 0) {
      setRecommended([]);
      return;
    }

    // Filter rooms based on recent searches (case-insensitive)
    const filteredHotels = rooms.slice().filter(room => {
      if (!room.hotel || !room.hotel.city) return false;
      return searchedCities.some(
        city => room.hotel.city.toLowerCase() === city.toLowerCase(),
      );
    });
    setRecommended(filteredHotels);
  };

  useEffect(() => {
    if (rooms.length > 0) {
      filterHotel();
    }
  }, [rooms, searchedCities]);

  // Don't show if no searches or no recommended hotels
  if (searchedCities.length === 0 || recommended.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-slate-50 px-4 py-20 sm:px-8 md:px-10 lg:px-12">
      <Title
        title="RecommendedHotels "
        subTitle="Discover hotels based on your recent searches. Handpicked accommodations tailored to your preferences."
      />

      <div className="mt-20 grid w-full max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4">
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedHotels;
