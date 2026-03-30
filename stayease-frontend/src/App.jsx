import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import { asyncLoadUser } from "./store/actions/authActions";
import { setLoading } from "./store/reducers/authSlice";

import ProtectedRoute from "./routes/ProtectedRoute";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/guest/Home";
import HotelDetails from "./pages/guest/HotelDetails";
import Checkout from "./pages/guest/Checkout"; 
import BookingSuccess from "./pages/guest/BookingSuccess";
import MyBookings from "./pages/guest/MyBookings";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AddHotel from "./pages/owner/AddHotel";
import MyHotels from "./pages/owner/MyHotels";
import AddRoom from "./pages/owner/AddRoom";
import ManageRooms from "./pages/owner/ManageRooms";

const NotFound = () => (
  <div className="h-screen flex items-center justify-center text-xl font-bold">
    404 - Page Not Found
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { loading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      dispatch(asyncLoadUser());
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  if (loading && token) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          StayEase is waking up...
        </p>
      </div>
    );
  }

  return (
    <Routes>
      {}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/hotel/:id" element={<HotelDetails />} />

      {}
      <Route
        element={
          <ProtectedRoute allowedRoles={["guest", "hotel_owner", "admin"]} />
        }
      >
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["hotel_owner"]} />}>
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/add-hotel" element={<AddHotel />} />
        <Route path="/owner/my-hotels" element={<MyHotels />} />
        {}
        <Route path="/owner/hotel/:hotelId/add-room" element={<AddRoom />} />
        <Route path="/owner/hotel/:hotelId/manage" element={<ManageRooms />} />
      </Route>
      {}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="/admin"
          element={<div className="p-10">Admin Control Panel</div>}
        />
      </Route>

      {}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
