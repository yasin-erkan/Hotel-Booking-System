import React from 'react';
import Title from './Title';
import {assets} from '../assets/assets';
import {exclusiveOffers} from '../assets/assets';
const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="ExclusiveOffers"
          subTitle=" Take advantage of our exclusive offers and special packages to enhance your stay and create unforgettable memories."
        />
        <button
          className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12 hover:text-lg text-gray-600 transition-all duration-300"
          onClick={() => {}}>
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="group-hover:transition-x-1 transition-all w-4 h-4"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {exclusiveOffers.map(item => (
          <div
            key={item._id}
            className="group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center "
            style={{backgroundImage: `url(${item.image})`}}>
            <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">
              {item.priceOff}% OFF
            </p>
            <div>
              <p className="text-2xl font-medium font-playfair">{item.title}</p>
              <p className="text-base font-medium">{item.description}</p>
              <p className=" text-orange-400 text-sm mt-3 ">
                Expires on{' '}
                <span className="font-medium">{item.expiryDate}</span>
              </p>
            </div>
            <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5">
              View Offers
              <img
                className="invert group-hover:translate-x-1 transition-all"
                src={assets.arrowIcon}
                alt="arrow-icon"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
