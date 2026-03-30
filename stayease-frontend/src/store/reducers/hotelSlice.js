import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hotels: [], 
  ownerHotels: [], 
  selectedHotel: null,
  loading: false,
  error: null,
  filters: {
    city: "",
    search: "",
    minPrice: "",
    maxPrice: "",
  },
};

export const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    setOwnerHotels: (state, action) => {
      state.ownerHotels = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedHotel: (state, action) => {
      state.selectedHotel = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHotelError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});


export const {
  setHotels,
  setOwnerHotels,
  setSelectedHotel,
  setLoading,
  setHotelError,
  updateFilters,
} = hotelSlice.actions;

export default hotelSlice.reducer;
