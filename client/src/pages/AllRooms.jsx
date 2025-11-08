import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {roomsDummyData} from '../assets/assets';
import StarRating from '../components/StarRating';
import {assets} from '../assets/assets';
import {facilityIcons} from '../assets/assets';

const CheckBox = ({label, selected = false, onChange = () => {}}) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onchange={e => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({label, selected = false, onChange = () => {}}) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onchange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Bed', 'Family Suite'];
  const priceRanges = [
    '$100 - 500',
    '$500 - $1000',
    '$1000 - $1500',
    '$1500 - $2000',
  ];
  const sortOptions = [
    'Price Low to High',
    'Price High to Low',
    'Newest First',
  ];

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div className=" flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md: text-[  40px]">
            Hotel Rooms
          </h1>
          <p className="text-sm md:text-base text-gray-500/90  mt-2 max-w-174 ">
            Sunrise terraces, ambient lofts, and serene retreats—each room
            blends handcrafted comfort with modern ease for an effortless stay.
          </p>
        </div>

        {roomsDummyData.map(room => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-b-0 ">
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              title="View Room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer hover:text-gray-600 transition-all duration-300">
                {room.hotel.name}
              </p>
              <div className="flex items-center gap-2">
                <StarRating />
                <p className="ml-2">+200 reviews</p>
              </div>

              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
              </div>
              {/* room amenities */}
              <div className="flex flex-wrap items-center mt-3 mb-6  r gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70">
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs text-gray-500">{item}</p>
                  </div>
                ))}
              </div>
              {/* room price  per night*/}
              <p>
                ${room.pricePerNight}{' '}
                <span className="text-xl font-medium text-gray-700">
                  / night
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16 ">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min:lg:border-b border-gray-300 ${
            openFilters && 'border-b'
          }`}>
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden">
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span className="hidden lg:block">CLEAR</span>
          </div>
        </div>
        <div
          className={`${
            openFilters ? 'h-auto' : 'h-0 lg:h-auto'
          } overflow-hidden transition-all duration-700`}>
          <div className="px-5 pt-5">
            <p className="pb-2 font-medium text-gray-800">Popular Filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox key={index} label={room} />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="pb-2 font-medium text-gray-800">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox key={index} label={`$ ${range}`} />
            ))}
          </div>
          <div className="px-5 pt-5 pb-7">
            <p className="pb-2 font-medium text-gray-800">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton key={index} label={option} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
