import React, {useState} from 'react';
import {assets} from '../assets/assets';
import {cities} from '../assets/assets';
import {useAppContext} from '../context/AppContext';
import {toast} from 'react-hot-toast';

const HotelReg = () => {
  const {setShowHotelReg, axios, getToken, setIsOwner} = useAppContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const onSubmitHandler = async event => {
    try {
      event.preventDefault();
      const {data} = await axios.post(
        '/api/hotels/',
        {
          name,
          contact,
          address,
          city,
        },
        {headers: {authorization: `Bearer ${await getToken()}`}},
      );
      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowHotelReg(false);
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70">
      <form
        onSubmit={onSubmitHandler}
        onClick={e => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2">
        <img
          src={assets.regImage}
          alt="reg-image"
          className="w-1/2 rounded-xl hidden md:block"
        />
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={() => setShowHotelReg(false)}
          />
          <p className="text-2xl font-semibold mt-6">Hotel Registration</p>

          {/* Hotel Name */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              type="text"
              id="name"
              onChange={event => setName(event.target.value)}
              value={name}
              placeholder="Enter hotel name"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>
          {/* Contact Number */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              onChange={event => setContact(event.target.value)}
              value={contact}
              placeholder="Enter contact number"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>
          {/* Address */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              type="text"
              id="address"
              onChange={event => setAddress(event.target.value)}
              value={address}
              placeholder="Enter address"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>
          {/* Select City dropdown */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">
              Select City
            </label>
            <select
              id="city"
              onChange={event => setCity(event.target.value)}
              value={city}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required>
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <button className="w-full py-2.5 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-300 mt-6">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
