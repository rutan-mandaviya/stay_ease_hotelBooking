import React from "react";
import { Search, MapPin, IndianRupee, SlidersHorizontal } from "lucide-react";

const FilterBar = ({ filters, onFilterChange, onSearch }) => {
  return (
    <div className="w-full max-w-6xl mx-auto -mt-12 mb-12 px-4 relative z-10">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
        {}
        <div className="flex-1 w-full relative">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
            size={20}
          />
          <input
            type="text"
            placeholder="Kahan jaana hai? (City)"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none font-bold text-secondary focus:ring-2 focus:ring-primary/20"
            value={filters.city}
            onChange={(e) => onFilterChange({ city: e.target.value })}
          />
        </div>

        {}
        <div className="flex-1 w-full relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
            size={20}
          />
          <input
            type="text"
            placeholder="Hotel ka naam..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none font-bold text-secondary focus:ring-2 focus:ring-primary/20"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        {}
        <div className="flex-[0.8] w-full flex gap-2">
          <div className="relative flex-1">
            <IndianRupee
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="number"
              placeholder="Min"
              className="w-full pl-8 pr-2 py-4 bg-gray-50 rounded-2xl border-none font-bold text-xs"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            />
          </div>
          <div className="relative flex-1">
            <IndianRupee
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full pl-8 pr-2 py-4 bg-gray-50 rounded-2xl border-none font-bold text-xs"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        {}
        <button
          onClick={onSearch}
          className="w-full lg:w-auto px-10 py-4 bg-secondary text-white rounded-2xl font-black hover:bg-primary transition-all shadow-lg shadow-primary/20"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
