import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import hotelReducer from "./reducers/hotelSlice"; // Import naya reducer
import bookingReducer from "./reducers/bookingSlice"; // Import booking reducer
import analyticsReducer from "./reducers/analyticsSlice"; // Import analytics reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer, // Add here
    booking: bookingReducer, // Add booking reducer
    analytics: analyticsReducer, // Add analytics reducer
  },
});
