import React, {useState} from 'react';
import Title from '../../components/Title';
import {assets} from '../../assets/assets';
import {useAppContext} from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const AddRoom = () => {
  const {axios, getToken} = useAppContext();
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: '',
    amenities: {
      freeWifi: false,
      freeBreakfast: false,
      roomService: false,
      mountainView: false,
      poolAccess: false,
    },
  });
  const formatAmenityLabel = label =>
    label.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase());

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async e => {
    e.preventDefault();
    // check if all inputs are filled
    if (
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !inputs.amenities ||
      !Object.values(images).some(image => image)
    ) {
      toast.error('Please, fill in all the details');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('roomType', inputs.roomType);
      formData.append('pricePerNight', inputs.pricePerNight);
      // converting Amenities to Array & keep only enabled Amenities
      const amenities = Object.keys(inputs.amenities).filter(
        key => inputs.amenities[key],
      );
      formData.append('amenities', JSON.stringify(amenities));

      // then, add images to formData
      Object.keys(images).forEach(key => {
        images[key] && formData.append('images', images[key]);
      });

      const {data} = await axios.post('/api/rooms', formData, {
        headers: {authorization: `Bearer ${await getToken()}`},
      });
      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: '',
          pricePerNight: '',
          amenities: {
            freeWifi: false,
            freeBreakfast: false,
            roomService: false,
            mountainView: false,
            poolAccess: false,
          },
        });
        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="mx-auto max-w-5xl space-y-10">
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Create a new room listing for your hotel. This will help you to attract more guests and increase your revenue."
      />

      <section className="space-y-8 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_35px_80px_-50px_rgba(15,23,42,0.55)] backdrop-blur">
        <div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500/80">
              Media
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Room Imagery
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Upload up to four highlights. The first image appears as the
              primary thumbnail on listings.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.keys(images).map(key => (
              <label
                htmlFor={`roomImage${key}`}
                key={key}
                className="group flex h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center transition hover:border-blue-200 hover:bg-blue-50/70">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-inner ring-1 ring-slate-100">
                  <img
                    className="h-12 w-12 object-contain opacity-80 transition group-hover:opacity-100"
                    src={
                      images[key]
                        ? URL.createObjectURL(images[key])
                        : assets.uploadArea
                    }
                    alt="upload-area"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">
                    {images[key] ? images[key].name : 'Upload image'}
                  </p>
                  <span className="text-xs text-slate-400">
                    JPG or PNG, max 4MB
                  </span>
                </div>
                <input
                  type="file"
                  id={`roomImage${key}`}
                  accept="image/*"
                  hidden
                  onChange={e =>
                    setImages(prev => ({...prev, [key]: e.target.files[0]}))
                  }
                />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500/80">
              Details
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Stay Information
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Configure the essentials for this room category. Pricing is shown
              to guests exactly as listed here.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-[1.3fr_1fr]">
            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Room Type</span>
              <select
                value={inputs.roomType}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                onChange={e =>
                  setInputs(prev => ({...prev, roomType: e.target.value}))
                }>
                <option value="">Select Room Type</option>
                <option value="single">Single Bed</option>
                <option value="double">Double Bed</option>
                <option value="luxury">Luxury Bed</option>
                <option value="family">Family Suite</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>
                Price
                <span className="ml-1 text-xs font-normal uppercase tracking-wide text-slate-400">
                  / Night
                </span>
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  step="1"
                  placeholder="0"
                  value={inputs.pricePerNight}
                  onChange={e =>
                    setInputs(prev => ({
                      ...prev,
                      pricePerNight: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500/80">
              Amenities
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Included Services
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Highlight the perks that differentiate this room. Guests see these
              on the listing card and the booking flow.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.keys(inputs.amenities).map((amenity, index) => (
              <label
                key={index}
                htmlFor={`amenity-${amenity}`}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/70">
                <input
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  checked={inputs.amenities[amenity]}
                  onChange={() =>
                    setInputs(prev => ({
                      ...prev,
                      amenities: {
                        ...prev.amenities,
                        [amenity]: !prev.amenities[amenity],
                      },
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-200"
                />
                <span className="font-medium text-slate-700">
                  {formatAmenityLabel(amenity)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-blue-500 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-600"
          disabled={loading}>
          {loading ? 'Loading....' : 'Add Room'}
        </button>
      </div>
    </form>
  );
};

export default AddRoom;
