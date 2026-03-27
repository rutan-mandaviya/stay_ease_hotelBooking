import React from "react";
import { MapPin, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const HotelCard = ({ hotel }) => {
  // 1. Image logic: Pehle cover_image dekho, warna placeholder
  const mainImage = hotel.cover_image
    ? `http://localhost:3000/uploads/hotels/${hotel.cover_image}`
    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";

  // 2. Format Rating (Rounding to 1 decimal)
  const rating = Number(hotel.avg_rating || 0).toFixed(1);

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={mainImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Rating Badge - Dynamic from backend */}
        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg">
          <Star className="text-amber-400 fill-amber-400" size={14} />
          <span className="text-xs font-black text-secondary">{rating}</span>
          <span className="text-[10px] text-gray-400 font-bold border-l pl-1.5 border-gray-200">
            {hotel.total_reviews || 0}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-black text-secondary line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
            <MapPin size={12} className="text-primary" />
            <span className="truncate">
              {hotel.city}, {hotel.address}
            </span>
          </div>
        </div>

        {/* Room Status Badge */}
        <div className="mb-6">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
              hotel.rooms?.length > 0
                ? "bg-green-50 text-green-600 border-green-100"
                : "bg-red-50 text-red-500 border-red-100"
            }`}
          >
            {hotel.rooms?.length || 0} Types Available
          </span>
        </div>

        {/* Price & Action - Bottom Fixed */}
        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mb-1">
              Starts from
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-black text-primary">₹</span>
              {/* ✨ Yahan starting_price use kiya hai */}
              <span className="text-2xl font-black text-secondary">
                {hotel.starting_price
                  ? Math.floor(hotel.starting_price)
                  : "N/A"}
              </span>
              <span className="text-[10px] text-gray-400 font-bold">
                /night
              </span>
            </div>
          </div>

          <Link to={`/hotel/${hotel.id}`}>
            <Button
              variant="secondary"
              className="py-3 px-6 text-xs rounded-2xl font-black shadow-lg shadow-secondary/10"
            >
              View Stay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
