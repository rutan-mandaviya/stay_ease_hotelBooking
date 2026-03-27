import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Hotel,
  User,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Building2,
} from "lucide-react";
import { asyncLogout } from "../../store/actions/authActions";
import Button from "../common/Button";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(asyncLogout());
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2.5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary/20">
              <Hotel className="text-secondary" size={24} />
            </div>
            <span className="text-2xl font-black text-secondary tracking-tighter italic">
              StayEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-sm font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-all"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button className="py-3 px-8 text-xs font-black rounded-2xl shadow-xl shadow-primary/10 transition-all hover:scale-105">
                    Join Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                {/* ✨ NORMAL USER (GUEST) LINKS */}
                {user?.role === "guest" && (
                  <Link
                    to="/my-bookings"
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-all px-4 py-2 rounded-xl hover:bg-primary/5"
                  >
                    <CalendarDays size={18} className="text-primary" />
                    My Bookings
                  </Link>
                )}

                {/* 🏠 HOTEL OWNER LINKS */}
                {user?.role === "hotel_owner" && (
                  <div className="flex items-center gap-6">
                    <Link
                      to="/owner/dashboard"
                      className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-all"
                    >
                      <LayoutDashboard size={18} className="text-primary" />
                      Stats
                    </Link>
                    <Link
                      to="/owner/my-hotels"
                      className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-all"
                    >
                      <Building2 size={18} className="text-primary" />
                      My Properties
                    </Link>
                    <Link
                      to="/owner/add-hotel"
                      className="bg-secondary text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-secondary/10 flex items-center gap-2"
                    >
                      <PlusCircle size={14} /> Add Hotel
                    </Link>
                  </div>
                )}

                {/* Profile & Logout Section */}
                <div className="flex items-center gap-4 pl-6 border-l border-gray-100 ml-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-secondary uppercase tracking-tight leading-none mb-1">
                      {user?.name}
                    </p>
                    <p className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block uppercase tracking-tighter">
                      {user?.role?.replace("_", " ")}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="group p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 shadow-sm border border-gray-100"
                    title="Sign Out"
                  >
                    <LogOut
                      size={20}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
