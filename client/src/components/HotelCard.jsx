import React from 'react';
import {Link} from 'react-router-dom';
import {assets} from '../assets/assets';

const HotelCard = ({room, index}) => {
  return (
    <Link
      to={'/rooms/' + room._id}
      onClick={() => scrollTo(0, 0)}
      key={room._id}
      className="group relative block h-full w-full overflow-hidden rounded-3xl bg-white text-gray-600 shadow-[0px_18px_50px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0px_28px_70px_rgba(15,23,42,0.14)]">
      <div className="relative overflow-hidden">
        <img
          src={room.images[0]}
          alt="hotel-image"
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {index % 2 === 0 && (
          <p className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-800 shadow">
            Best Seller
          </p>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <p className="font-playfair text-2xl font-semibold text-gray-900">
            {room.hotel.name}
          </p>
          <div className="flex items-center gap-1.5 text-base font-medium text-gray-700">
            <img
              src={assets.starIconFilled}
              alt="star-icon"
              className="h-5 w-5"
            />
            <span>4.5</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <img
            src={assets.locationIcon}
            alt="location-icon"
            className="h-4 w-4"
          />
          <span className="text-gray-500">{room.hotel.address}</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-base">
            <span className="text-2xl font-semibold text-gray-900">
              ${room.pricePerNight}
            </span>
            <span className="text-gray-500"> / night</span>
          </p>
          <button className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
