import React, {useState} from 'react';
import {roomsDummyData} from '../../assets/assets';
import Title from '../../components/Title';

const ListRoom = () => {
  const [rooms, setRooms] = useState(roomsDummyData);
  return (
    <section className="space-y-8">
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View and manage your room listings. Add, edit, or delete rooms as needed. You can also view the bookings for each room."
        className="mb-8"
      />
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500/80">
          Inventory
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            All Rooms: {rooms.length}
          </span>
          <button className="inline-flex items-center justify-center rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-500 transition hover:border-blue-300 hover:bg-blue-50">
            Export
          </button>
          <button className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-600">
            Add Room
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_35px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="hidden grid-cols-[0.5fr_1.6fr_1.2fr_0.9fr_0.8fr] items-center border-b border-slate-100/80 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid">
          <span className="flex items-center justify-center text-slate-400">
            #
          </span>
          <span className="text-slate-500">Room</span>
          <span className="text-center text-slate-500">Facilities</span>
          <span className="text-center text-slate-500">Price / Night</span>
          <span className="flex items-center justify-end text-slate-500">
            Status
          </span>
        </div>

        <ul className="divide-y divide-slate-100 text-sm text-slate-600">
          {rooms.map((room, index) => (
            <li
              key={room.id ?? index}
              className="grid grid-cols-1 gap-4 px-4 py-4 transition hover:bg-blue-50/60 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[0.5fr_1.6fr_1.2fr_0.9fr_0.8fr] md:items-center md:px-6 md:py-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-500 shadow-sm md:mx-auto">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900">
                  {room.roomType}
                </p>
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                  {room.beds ?? 'Available'}
                </span>
              </div>

              <div className="sm:col-span-2 md:col-span-1 md:justify-self-center">
                <div className="flex flex-wrap gap-2 md:justify-center">
                  {room.amenities.map(amenity => (
                    <span
                      key={amenity}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-start md:justify-center">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                  ${room.pricePerNight}
                </span>
              </div>

              <div className="flex items-center justify-start md:justify-end">
                <label
                  htmlFor={`toggle-room-${room.id ?? index}`}
                  className="inline-flex cursor-pointer items-center gap-3">
                  <input
                    id={`toggle-room-${room.id ?? index}`}
                    type="checkbox"
                    className="peer sr-only"
                    checked={room.isAvailable}
                    onChange={() =>
                      setRooms(prev =>
                        prev.map((item, itemIndex) =>
                          itemIndex === index
                            ? {...item, isAvailable: !item.isAvailable}
                            : item,
                        ),
                      )
                    }
                  />
                  <span className="relative inline-flex h-7 w-12 items-center rounded-full bg-slate-200 transition-colors duration-200 peer-checked:bg-blue-500">
                    <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {room.isAvailable ? 'Live' : 'Paused'}
                  </span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ListRoom;
