import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncFetchOwnerHotels } from "../../store/actions/hotelActions";
import { Plus, MapPin, Star, BedDouble } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

const MyHotels = () => {
  const dispatch = useDispatch();
  const { ownerHotels, loading } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(asyncFetchOwnerHotels());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-secondary">My Properties</h1>
          <Link
            to="/owner/add-hotel"
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> Add New Hotel
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 animate-pulse rounded-[2.5rem]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ownerHotels?.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500"
              >
                {}
                <div className="relative h-56">
                  <img
                    src={
                      hotel.cover_image
                        ? `http://localhost:3000/uploads/hotels/${hotel.cover_image}`
                        : "https://placehold.co/600x400?text=No+Image"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={hotel.name}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-secondary flex items-center gap-1">
                    <Star
                      size={12}
                      className="text-yellow-500 fill-yellow-500"
                    />{" "}
                    {parseFloat(hotel.avg_rating).toFixed(1)}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black text-secondary mb-1">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-6">
                    <MapPin size={14} /> {hotel.city}
                  </p>

                  <div className="flex gap-4">
                    <Link
                      to={`/owner/hotel/${hotel.id}/manage`}
                      className="flex-[2] bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary transition-colors text-sm"
                    >
                      <Plus size={18} /> Manage Inventory
                    </Link>
                    <button className="px-6 py-4 bg-gray-50 rounded-2xl text-secondary font-bold hover:bg-gray-100 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHotels;
