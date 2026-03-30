import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import hotelReducer from "./reducers/hotelSlice"; 
import bookingReducer from "./reducers/bookingSlice"; 
import analyticsReducer from "./reducers/analyticsSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer, 
    booking: bookingReducer, 
    analytics: analyticsReducer, 
  },
});
