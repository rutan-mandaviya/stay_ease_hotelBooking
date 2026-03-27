import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  ChevronLeft,
  Wifi,
  Coffee,
  Car,
  ShieldCheck,
  Star,
  Info,
} from "lucide-react";
import { asyncFetchHotelById } from "../../store/actions/hotelActions";
import Navbar from "../../components/layout/Navbar";
import RoomCard from "../../components/hotel/RoomCard";

const HotelDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedHotel, loading, error } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(asyncFetchHotelById(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500 font-black animate-pulse uppercase tracking-tighter">
          Fetching Luxury...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-10 md:p-20 text-center">
        <div className="bg-red-50 text-red-500 p-8 rounded-[2rem] inline-block border border-red-100 max-w-md">
          <p className="font-black text-2xl mb-2 italic underline">Error!</p>
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );

  if (!selectedHotel) return null;

  const activeRooms =
    selectedHotel.rooms?.filter((room) => room.is_active !== false) || [];
  const firstRoomImages = selectedHotel.rooms?.[0]?.images || [];

  const getImageUrl = (img) =>
    img
      ? `http://localhost:3000${img.image_url}`
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-primary mb-8 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all group"
        >
          <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronLeft size={16} />
          </div>
          Back to Explore
        </button>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column (8 Columns) */}
          <div className="lg:col-span-8 space-y-10 md:space-y-14">
            {/* ✨ FIXED HEIGHT GALLERY (Using Aspect Ratio) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto">
              {/* Main Image (Takes 3/4 space on Desktop) */}
              <div className="md:col-span-3 aspect-[4/3] md:aspect-auto md:h-[500px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-xl border-4 border-white">
                <img
                  src={getImageUrl(firstRoomImages[0])}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Main"
                />
              </div>

              {/* Sub Images (Stack on Desktop, Hidden on Mobile for better flow) */}
              <div className="hidden md:flex flex-col gap-4 md:col-span-1 h-[500px]">
                <div className="flex-1 rounded-[2rem] overflow-hidden shadow-md border-4 border-white">
                  <img
                    src={getImageUrl(firstRoomImages[1])}
                    className="w-full h-full object-cover"
                    alt="Sub 1"
                  />
                </div>
                <div className="flex-1 rounded-[2rem] overflow-hidden relative shadow-md border-4 border-white">
                  <img
                    src={getImageUrl(firstRoomImages[2])}
                    className="w-full h-full object-cover"
                    alt="Sub 2"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest">
                      More
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <h2 className="text-2xl md:text-3xl font-black text-secondary mb-6 flex items-center gap-3 italic tracking-tight">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Info className="text-primary" size={24} />
                </div>
                Property Story
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-lg">
                {selectedHotel.description ||
                  "Bhai, ye hotel ekdum lajawab hai! Saari suvidhayein aur world-class service ke saath, aapka stay yaadgaar banne wala hai."}
              </p>
            </section>

            {/* Room Listings */}
            <section className="space-y-8">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl md:text-4xl font-black text-secondary italic tracking-tighter">
                  Select Your Stay
                </h2>
                <div className="h-[2px] flex-1 mx-6 bg-gray-100 hidden md:block" />
                <span className="bg-secondary text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  {activeRooms.length} Types
                </span>
              </div>

              <div className="space-y-6">
                {activeRooms.length > 0 ? (
                  activeRooms.map((room) => (
                    <RoomCard key={room.id} room={room} hotel={selectedHotel} />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-black italic">
                      No rooms active right now, bhai!
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (4 Columns) - Responsive Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-primary/5 lg:sticky lg:top-24 transition-all overflow-hidden">
              {/* Hotel Intro */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-black text-secondary leading-[1.1] mb-3 uppercase tracking-tighter">
                    {selectedHotel.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                    <MapPin size={14} className="text-primary" />
                    <span>{selectedHotel.city}</span>
                  </div>
                </div>
                <div className="bg-primary text-secondary p-4 rounded-[1.5rem] flex flex-col items-center shadow-lg border-2 border-white">
                  <Star className="fill-secondary" size={16} />
                  <span className="text-sm font-black mt-1">4.8</span>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-8 py-8 border-y border-gray-50">
                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                  Core Amenities
                </h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <Amenity icon={<Wifi />} label="WiFi" />
                  <Amenity icon={<Coffee />} label="Food" />
                  <Amenity icon={<Car />} label="Parking" />
                  <Amenity icon={<ShieldCheck />} label="Safe" />
                </div>
              </div>

              {/* Trust Section */}
              <div className="mt-10 p-6 bg-secondary rounded-[2rem] text-white relative group overflow-hidden">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mb-10 group-hover:scale-150 transition-transform duration-700" />
                <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest">
                  StayEase Verified
                </p>
                <p className="text-[11px] font-medium text-gray-300 leading-relaxed">
                  Bhai, tension mat lo! StayEase har booking par best price aur
                  top quality ki guarantee deta hai.
                </p>
              </div>

              {/* Sticky Footer Info (Mobile Only) */}
              <div className="mt-8 pt-6 lg:hidden border-t border-gray-100">
                <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                  Scroll down to see rooms & book
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Amenity = ({ icon, label }) => (
  <div className="flex items-center gap-3 text-xs font-black text-secondary group">
    <div className="text-primary bg-primary/5 p-2.5 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <span className="uppercase tracking-tighter">{label}</span>
  </div>
);

export default HotelDetails;
