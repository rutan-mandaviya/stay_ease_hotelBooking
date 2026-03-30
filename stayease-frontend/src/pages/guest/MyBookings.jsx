import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncFetchMyBookings,
  asyncDownloadInvoice,
} from "../../store/actions/bookingActions";
import Navbar from "../../components/layout/Navbar";
import {
  Calendar,
  MapPin,
  Download,
  FileText,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { myBookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(asyncFetchMyBookings());
    window.scrollTo(0, 0);
  }, [dispatch]);

  const bookingsList = Array.isArray(myBookings) ? myBookings : [];

  const getBookingImage = (booking) => {
    const hotel = booking?.room?.hotel;
    const room = booking?.room;

    if (hotel?.cover_image) {
      return `http://localhost:3000/uploads/hotels/${hotel.cover_image}`;
    }

    if (room?.images?.[0]?.image_url) {
      return `http://localhost:3000${room.images[0].image_url}`;
    }

    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-secondary tracking-tight italic">
              My Stays
            </h1>
            <p className="text-gray-400 font-medium mt-1">
              Manage your upcoming and past adventures
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 hidden md:block">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Total Bookings:
            </span>
            <span className="ml-2 text-lg font-black text-primary">
              {bookingsList.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 bg-white animate-pulse rounded-[3rem] border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-8">
            {bookingsList.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row overflow-hidden hover:shadow-xl transition-all duration-500 group"
              >
                {/* Image Section */}
                <div className="w-full lg:w-80 h-64 lg:h-auto relative overflow-hidden">
                  <img
                    src={getBookingImage(booking)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Stay"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-secondary shadow-lg">
                    ID: {booking.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-secondary mb-2 group-hover:text-primary transition-colors italic uppercase tracking-tight">
                          {booking.room?.hotel?.name || "The StayEase Property"}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                          <MapPin size={14} className="text-primary" />
                          {booking.room?.hotel?.city},{" "}
                          {booking.room?.hotel?.address}
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                          booking.status === "confirmed"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${booking.status === "confirmed" ? "bg-green-500" : "bg-amber-500"}`}
                        />
                        {booking.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100/50">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={12} /> Timeline
                        </p>
                        <p className="text-xs font-black text-secondary">
                          {formatDate(booking.check_in_date)} —{" "}
                          {formatDate(booking.check_out_date)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <FileText size={12} /> Room Detail
                        </p>
                        <p className="text-xs font-black text-primary italic">
                          {booking.room?.room_type} (#
                          {booking.room?.room_number})
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Total Investment
                        </p>
                        <p className="text-lg font-black text-secondary italic">
                          ₹{booking.total_price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      to={`/hotel/${booking.room?.hotel?.id}`}
                      className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-1 uppercase tracking-widest transition-colors"
                    >
                      View Property Details <ChevronRight size={14} />
                    </Link>

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() =>
                          dispatch(asyncDownloadInvoice(booking.id))
                        }
                        className="flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-[1.5rem] text-xs font-black hover:bg-primary transition-all shadow-xl shadow-secondary/10 group/btn"
                      >
                        <Download
                          size={16}
                          className="group-hover:btn-animate"
                        />
                        Download Invoice (PDF)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {bookingsList.length === 0 && !loading && (
              <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 shadow-inner">
                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <FileText className="text-gray-200" size={40} />
                </div>
                <h3 className="text-2xl font-black text-secondary mb-2 italic">
                  No Bookings Found!
                </h3>
                <p className="text-gray-400 font-medium mb-10">
                  You haven't planned any stays yet. Ready for your next trip?
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-3 bg-primary text-secondary px-12 py-5 rounded-[2rem] font-black text-sm hover:scale-105 transition-all shadow-2xl shadow-primary/20"
                >
                  Start Exploring Hotels
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
