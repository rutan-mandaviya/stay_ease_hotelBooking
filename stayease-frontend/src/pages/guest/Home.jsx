import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncFetchHotels } from "../../store/actions/hotelActions";
import { updateFilters } from "../../store/reducers/hotelSlice";
import Navbar from "../../components/layout/Navbar";
import FilterBar from "../../components/home/FilterBar";
import HotelCard from "../../components/hotel/HotelCard";
import { Sparkles } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { hotels, loading, filters } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(asyncFetchHotels(filters));
  }, [dispatch]);

  const handleFilterUpdate = (newFilters) => {
    dispatch(updateFilters(newFilters));
  };

  const handleSearch = () => {
    dispatch(asyncFetchHotels(filters));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-secondary pt-24 pb-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Luxury for everyone
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Find your perfect{" "}
            <span className="text-primary italic">StayEase</span> home
          </h1>
          <p className="text-gray-400 font-medium text-lg">
            Make every trip memorable with the right hotel.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterUpdate}
        onSearch={handleSearch}
      />

      {/* Hotel Listing Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-secondary">
              Explore Hotels
            </h2>
            <p className="text-gray-400 font-medium">
              Top picks for your next destination
            </p>
          </div>
          <p className="text-sm font-bold text-primary">
            {hotels?.length || 0} Hotels found
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hotels?.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}

        {!loading && hotels?.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold text-xl">
              No hotels found matching your criteria.
            </p>
            <p className="text-gray-400">
              Try adjusting your filters to find more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
