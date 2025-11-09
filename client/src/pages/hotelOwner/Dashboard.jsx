import React, {useMemo} from 'react';
import {dashboardDummyData, assets} from '../../assets/assets';

const Dashboard = () => {
  const overviewCards = useMemo(
    () => [
      {
        id: 'total-bookings',
        label: 'Total Bookings',
        value: dashboardDummyData.totalBookings,
        icon: assets.totalBookingIcon,
        description: 'Bookings confirmed this month',
      },
      {
        id: 'total-revenue',
        label: 'Total Revenue',
        value: `$ ${dashboardDummyData.totalRevenue}`,
        icon: assets.totalRevenueIcon,
        description: 'Gross revenue across all rooms',
      },
    ],
    [],
  );

  return (
    <section className="space-y-12 py-10">
      <header className="overflow-hidden rounded-3xl border border-blue-100/70 bg-gradient-to-r from-blue-50/80 via-white to-white/60 p-8 shadow-[0_30px_70px_-45px_rgba(37,99,235,0.55)] backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500/80">
              Owner Control Center
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Dashboard
            </h1>
            <p className="text-sm leading-relaxed text-slate-500 md:text-base">
              Monitor listings, track bookings and keep a pulse on revenue with
              a clean snapshot of everything that matters for your property
              portfolio.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-blue-200/80 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-blue-500 transition hover:border-blue-300 hover:bg-blue-50">
              Download Report
            </button>
            <button className="rounded-full bg-blue-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-600">
              Create Offer
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map(card => (
          <article
            key={card.id}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-blue-100/80 bg-white/95 px-6 py-5 shadow-[0_35px_60px_-32px_rgba(37,99,235,0.35)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_35px_55px_-30px_rgba(37,99,235,0.45)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent shadow-inner ring-1 ring-blue-100">
              <img
                src={card.icon}
                alt={card.label}
                className="h-7 w-7 object-contain"
              />
            </span>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                {card.label}
              </p>
              <p className="text-2xl font-semibold text-slate-900 md:text-3xl">
                {card.value}
              </p>
              <span className="text-xs font-medium text-slate-400">
                {card.description}
              </span>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_35px_60px_-38px_rgba(15,23,42,0.4)]">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Recent Bookings
            </h2>
            <p className="text-sm text-slate-500">
              Latest reservations placed across your listed rooms.
            </p>
          </div>
          <button className="hidden rounded-full border border-blue-200/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 sm:block">
            View All
          </button>
        </header>

        {dashboardDummyData.recentBookings?.length ? (
          <div className="overflow-hidden rounded-2xl border border-slate-100/80">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-3 pl-6 pr-6 font-semibold">Guest</th>
                  <th className="py-3 pr-6 font-semibold">Room</th>
                  <th className="py-3 pr-6 font-semibold">Check-in</th>
                  <th className="py-3 pr-6 font-semibold">Check-out</th>
                  <th className="py-3 pr-6 font-semibold text-right">Amount</th>
                  <th className="py-3 pr-6 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white text-slate-600">
                {dashboardDummyData.recentBookings.map(booking => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-blue-50/60">
                    <td className="whitespace-nowrap py-4 pl-6 pr-6 font-medium text-slate-900">
                      {booking.guestName}
                    </td>
                    <td className="whitespace-nowrap py-4 pr-6">
                      {booking.roomName}
                    </td>
                    <td className="whitespace-nowrap py-4 pr-6">
                      {booking.checkIn}
                    </td>
                    <td className="whitespace-nowrap py-4 pr-6">
                      {booking.checkOut}
                    </td>
                    <td className="whitespace-nowrap py-4 pr-6 text-right font-semibold text-slate-900">
                      ${booking.amount}
                    </td>
                    <td className="whitespace-nowrap py-4 pr-6 text-right">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          booking.status === 'Confirmed'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                            : booking.status === 'Pending'
                            ? 'border-amber-200 bg-amber-50 text-amber-600'
                            : 'border-slate-200 bg-slate-100 text-slate-500'
                        }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-center text-slate-400">
            <img
              src={assets.emptyStateIllustration}
              alt="No bookings"
              className="h-24 w-24 opacity-80"
            />
            <p className="text-sm font-medium">No recent bookings yet.</p>
            <span className="text-xs text-slate-400">
              New reservations will appear here as soon as they come in.
            </span>
          </div>
        )}
      </section>
    </section>
  );
};

export default Dashboard;
