import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentBooking: null,
  myBookings: [],
  clientSecret: null,
  loading: false,
  error: null,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action) => {
      state.currentBooking = action.payload;
      state.error = null;
    },
    setMyBookings: (state, action) => {
      state.myBookings = action.payload;
      state.error = null;
    },
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBookingError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearBooking: (state) => {
      state.currentBooking = null;
      state.clientSecret = null;
      state.error = null;
    },
  },
});

export const {
  setBooking,
  setMyBookings,
  setClientSecret,
  setLoading,
  setBookingError,
  clearBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
