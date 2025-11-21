import React, {useState} from 'react';
import {assets, cities} from '../assets/assets';
import {useAppContext} from '../context/AppContext';

const Hero = () => {
  const {navigate, getToken, axios, setSearchedCities} = useAppContext();
  const [destination, setDestination] = useState('');

  const onSearch = async e => {
    e.preventDefault();
    if (!destination.trim()) return;
    
    navigate(`/rooms?destination=${destination}`);

    // Update local state immediately
    setSearchedCities(prevSearchedCities => {
      const city = destination.trim();
      if (prevSearchedCities.includes(city)) return prevSearchedCities;
      const updated = [...prevSearchedCities, city];
      if (updated.length > 3) updated.shift();
      return updated;
    });

    // Try to save to backend (non-blocking)
    try {
      const token = await getToken();
      if (token) {
        await axios.post(
          '/api/user/store-recent-search',
          {recentSearchedCity: destination},
          {headers: {Authorization: `Bearer ${token}`}},
        );
      }
    } catch (error) {
      // Silently fail - local state already updated
      console.error('Failed to save search:', error);
    }
  };

  return (
    <div className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/src/assets/heroImage1.png')] bg-no-repeat bg-cover bg-center h-screen">
      <p className="bg-[#49b9ff] text-black px-5 py-1 rounded-full mt-20 font-medium font-weight-500">
        The Ultimate Destination for Your Next Stay
      </p>

      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Discover the Best Hotels in the World
      </h1>

      <p className="max-w-130 mt-2 text-lg font-light">
        Luxurious Hotels, Affordable Prices & Exceptional Service for Your Next
        Vacation. Then start planning your next getaway with us.
      </p>

      <form
        onSubmit={onSearch}
        className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto">
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="calender" className="w-4 h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>

          <input
            onChange={e => setDestination(e.target.value)}
            value={destination}
            list="destinations"
            id="destinationInput"
            type="text"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Type here"
            required
          />

          <datalist id="destinations">
            {cities.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
        </div>

        {/* CHECK-IN */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="calender" className="w-4 h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* CHECK-OUT */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={assets.calenderIcon}
              alt="check out"
              className="w-4 h-4"
            />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* GUESTS */}
        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={4}
            id="guests"
            type="number"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
            placeholder="0"
          />
        </div>

        {/* BTN */}
        <button className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1">
          <img src={assets.searchIcon} alt="search" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
