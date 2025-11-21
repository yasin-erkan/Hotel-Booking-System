import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import StarRating from '../components/StarRating';
import {assets, facilityIcons, roomCommonData} from '../assets/assets';
import {useAppContext} from '../context/AppContext';

const RoomDetails = () => {
  const {id} = useParams();
  const {rooms, getToken, axios, navigate} = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const room = rooms.find(room => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
    
  }, [rooms]);
  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* room details */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-playfair">
                  {room.hotel.name}
                </h1>
                <span className="font-inter text-sm text-gray-500">
                  {room.roomType}
                </span>
              </div>
              <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                20% OFF
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-gray-600">
              <div className="flex items-center gap-2">
                <StarRating />
                <p className="font-medium">+200 reviews</p>
              </div>
              <span className="hidden h-4 w-px bg-gray-300 md:block" />
              <div className="flex items-center gap-2 text-gray-500">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <p className="text-3xl font-semibold text-gray-800">
                ${room.pricePerNight}
                <span className="text-base font-medium text-gray-500">
                  {' '}
                  / night
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Taxes and basic amenities are included. More options coming
                soon.
              </p>
              <button className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-primary/50">
                Reserve Now
              </button>
              <p className="mt-3 text-xs text-gray-400">
                Free cancellation up to 48 hours before check-in.
              </p>
            </div>
          </div>
        </div>

        {/* room images */}

        <div className="flex flex-col md:flex-row lg:flex-row gap-6 mt-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="room-image"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="room-image"
                  className={`w-full rounded-xl shadow-lg object-cover cursor-pointer  ${
                    mainImage === image && 'outline-3 outline-orange-500'
                  }`}
                />
              ))}
          </div>
        </div>

        {/* room highlights & booking */}
        <section className="mt-16 rounded-3xl border border-gray-200 bg-white shadow-xl transition-shadow hover:shadow-2xl">
          <div className="grid gap-10 p-8 lg:grid-cols-[3fr_2fr]">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-playfair">
                  Experience The Best Stay
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Thoughtfully curated rooms designed for long weekends,
                  business trips, and everything in between.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <img
                        src={facilityIcons[item]}
                        alt={item}
                        className="h-5 w-5"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {item}
                      </p>
                      <p className="text-xs text-gray-400">Included</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-linear-to-br from-primary/10 via-white to-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">
                Stay benefits
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Every reservation unlocks perks tailored for premium stays.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>24/7 concierge and room service support</li>
                <li>Complimentary welcome refreshments on arrival</li>
                <li>Priority upgrade eligibility for longer stays</li>
              </ul>
              <p className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Custom add-ons can be configured after selecting your dates.
              </p>
            </div>
          </div>

          <form
            aria-label="Check availability form"
            className="border-t border-gray-100 bg-slate-50/60 p-6 lg:p-8">
            <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="checkInDate"
                  className="text-sm font-medium text-gray-700">
                  Check-in
                </label>
                <input
                  onChange={e => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  type="date"
                  id="checkInDate"
                  placeholder="Select check-in date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="checkOutDate"
                  className="text-sm font-medium text-gray-700">
                  Check-out
                </label>
                <input
                  onChange={e => setCheckOutDate(e.target.value)}
                  min={checkInDate}
                  disabled={!checkInDate}
                  type="date"
                  id="checkOutDate"
                  placeholder="Select check-out date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="guests"
                  className="text-sm font-medium text-gray-700">
                  Guests
                </label>
                <input
                  onChange={e => setGuests(e.target.value)}
                  value={guests}
                  type="number"
                  id="guests"
                  min={1}
                  placeholder="1"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="promo"
                  className="text-sm font-medium text-gray-700">
                  Promo code
                </label>
                <input
                  type="text"
                  id="promo"
                  placeholder="Optional"
                  className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-primary/40 lg:mt-0">
                {isAvailable ? 'Book Now' : 'Check Availability'}
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              You won&#39;t be charged yet. Pricing breakdown will appear once
              dates are selected.
            </p>
          </form>
        </section>

        {/* Common Specifications  */}
        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {roomCommonData.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <img
                  src={item.icon}
                  alt={`${item.title}-icon`}
                  className="h-6 w-6"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium text-gray-800">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">{item.description}</p>
                <button
                  type="button"
                  className="mt-2 w-fit text-xs font-semibold text-primary hover:underline">
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Room Description */}
        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p className="text-lg font-medium">
            Guests will be allocated on the ground floor according to
            availability. You get a confirmation email with all the details of
            your booking. The price quoted is for two guests, at the guest slot
            please mark at the number of guests to get the exact price for
            groups. You will get the comfortable stay at the venue as it is
            according to our government safety guidelines.
          </p>
        </div>
        {/* Hosted by */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="overflow-hidden rounded-full border border-gray-100 bg-white p-1 shadow-inner">
                <img
                  src={assets.image_host}
                  alt="Host"
                  className="h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
                />
              </div>
              <div>
                <p className="text-lg font-semibold md:text-xl">
                  Hosted by {room.hotel.name}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <StarRating />
                    <span>+200 reviews</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Superhost
                  </span>
                  <span className="text-xs text-gray-500">
                    Responds within 2 hours
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <button className="w-full rounded-lg border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 md:w-auto">
                Message Host
              </button>
              <button className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dull md:w-auto">
                Contact Host
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
