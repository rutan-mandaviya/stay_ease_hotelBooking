import React, { useState } from "react";
import { BedDouble, Users, CheckCircle2, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { asyncInitiateBooking } from "../../store/actions/bookingActions";
import Button from "../common/Button";

const RoomCard = ({ room, hotelId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: bookingLoading } = useSelector((state) => state.booking);

  // Default Dates logic
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(new Date().getTime() + 86400000)
    .toISOString()
    .split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

  const handleBookNow = async () => {
    if (!isAuthenticated) return navigate("/login");

    const bookingData = {
      room_id: room.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
    };

    const success = await dispatch(asyncInitiateBooking(bookingData));
    if (success) navigate("/checkout");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col xl:flex-row gap-6 hover:shadow-lg transition-all">
      {/* 1. Room Info Section */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
            {room.room_type}
          </span>
          <h4 className="text-xl font-bold text-secondary">
            Room #{room.room_number}
          </h4>
        </div>

        <div className="flex gap-4 text-gray-500 text-sm mb-4">
          <span className="flex items-center gap-1">
            <BedDouble size={16} /> King Bed
          </span>
          <span className="flex items-center gap-1">
            <Users size={16} /> Max {room.capacity} Guests
          </span>
        </div>

        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 size={14} className="text-green-500" />
            Free {room.amenities?.[0] || "WiFi"}
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 size={14} className="text-green-500" />
            {room.amenities?.[1] || "Air Conditioning"}
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 size={14} className="text-green-500" />
            {room.amenities?.[2] || "Swimming Pool"}
          </li>
        </ul>
      </div>

      {/* 2. Compact Date Selection Section */}
      <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 self-center">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Check In
          </p>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
              size={14}
            />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Check Out
          </p>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
              size={14}
            />
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* 3. Pricing & Action */}
      <div className="xl:w-48 flex flex-col justify-center items-center xl:items-end gap-3 border-t xl:border-t-0 xl:border-l border-gray-100 pt-4 xl:pt-0 xl:pl-6">
        <div className="text-center xl:text-right">
          <p className="text-2xl font-black text-secondary">
            ₹{room.price_per_night}
          </p>
          <p className="text-xs text-gray-400">per night + taxes</p>
        </div>
        <Button
          onClick={handleBookNow}
          className="w-full shadow-lg shadow-primary/20"
          disabled={bookingLoading}
        >
          {bookingLoading ? "Processing..." : "Book Now"}
        </Button>
      </div>
    </div>
  );
};

export default RoomCard;
