import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncFetchOwnerDashboard } from "../../store/actions/analyticsActions";
import {
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Clock,
  Plus,
  Building2,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";
import { asyncFetchOwnerHotels } from "../../store/actions/hotelActions";

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentBookings, loading } = useSelector(
    (state) => state.analytics,
  );
  const { ownerHotels } = useSelector((state) => state.hotel);
  console.log("owner hotels", ownerHotels);

  useEffect(() => {
    dispatch(asyncFetchOwnerDashboard());
    dispatch(asyncFetchOwnerHotels());
  }, [dispatch]);

  if (loading)
    return (
      <div className="p-20 text-center font-bold">Analysing Business...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-secondary">
              Owner Dashboard
            </h1>
            <p className="text-gray-400 text-sm font-medium mt-1">
              Manage your properties and track earnings.
            </p>
          </div>

          <Link
            to="/owner/add-hotel"
            className="bg-primary text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
          >
            <Plus size={20} /> List New Hotel
          </Link>
        </div>{" "}
        {/* 1. Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue}`}
            icon={<DollarSign className="text-green-600" />}
            color="bg-green-50"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<ShoppingBag className="text-blue-600" />}
            color="bg-blue-50"
          />
          <StatCard
            title="Active Guests"
            value="12"
            icon={<Users className="text-purple-600" />}
            color="bg-purple-50"
          />
          <Link
            to="/owner/my-hotels"
            className="block transform hover:scale-105 transition-transform"
          >
            <StatCard
              title="My Hotels"
              value={ownerHotels?.length || 0}
              icon={<Building2 className="text-orange-600" />}
              color="bg-orange-50"
            />
          </Link>
        </div>
        {/* 2. Recent Bookings Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-secondary">
              Recent Bookings
            </h2>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Hotel / Room</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-secondary text-sm">
                      {booking.user?.name}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {booking.user?.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.room?.hotel?.name}
                      <span className="block text-[10px] italic">
                        Room #{booking.room?.room_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-bold uppercase">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-secondary">
                      ₹{booking.total_price}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium flex items-center gap-1 mt-2">
                      <Clock size={12} />{" "}
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({ title, value, icon, color }) => (
  <div
    className={`p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 bg-white`}
  >
    <div
      className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-2xl`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-black text-secondary">{value}</h3>
    </div>
  </div>
);

export default OwnerDashboard;
