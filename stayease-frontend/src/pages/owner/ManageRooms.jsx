import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncFetchHotelById } from "../../store/actions/hotelActions";
import { asyncDeleteRoom } from "../../store/actions/roomActions";
import { Trash2, Users, Bed, Plus, ArrowLeft } from "lucide-react";
import Navbar from "../../components/layout/Navbar";

const ManageRooms = () => {
  const { hotelId } = useParams();
  const dispatch = useDispatch();
  const { selectedHotel, loading } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(asyncFetchHotelById(hotelId));
  }, [dispatch, hotelId]);

  const handleDelete = async (roomId) => {
    const res = await dispatch(asyncDeleteRoom(roomId));
    if (res.success) {
      // Data refresh hone par inactive rooms filter ho jayenge
      dispatch(asyncFetchHotelById(hotelId));
    }
  };

  // ✨ Logic: Sirf wahi rooms dikhayenge jo delete (inactive) nahi huye hain
  const activeRooms = selectedHotel?.rooms?.filter(
    (room) => room.is_active !== false,
  );

  if (loading && !selectedHotel) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Link
              to="/owner/my-hotels"
              className="p-3 bg-white rounded-2xl shadow-sm hover:bg-primary hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-secondary">
                {selectedHotel?.name || "Loading Hotel..."}
              </h1>
              <p className="text-gray-400 font-medium">
                Manage your room inventory
              </p>
            </div>
          </div>
          <Link
            to={`/owner/hotel/${hotelId}/add-room`}
            className="bg-primary text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Add More Rooms
          </Link>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeRooms?.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500"
            >
              {/* Room Image Display */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={`http://localhost:3000${room.images[0].image_url}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="room"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                    No Images
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase">
                  {room.room_type}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-secondary">
                    Room #{room.room_number}
                  </h3>
                  <p className="text-lg font-black text-primary">
                    ₹{room.price_per_night}
                    <span className="text-[10px] text-gray-400">/night</span>
                  </p>
                </div>

                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
                    <Users size={14} /> {room.capacity} Guests
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
                    <Bed size={14} /> {room.room_type}
                  </div>
                </div>

                {/* Amenities Tags */}
                <div className="flex flex-wrap gap-2 mb-6 min-h-[32px]">
                  {room.amenities?.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md border border-gray-200 shadow-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleDelete(room.id)}
                  className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm"
                >
                  <Trash2 size={18} /> Remove Room
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Check */}
        {(!activeRooms || activeRooms.length === 0) && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bed className="text-gray-300" size={40} />
            </div>
            <p className="text-gray-400 font-bold text-xl mb-2">
              Inventory Khaali Hai!
            </p>
            <p className="text-gray-400 font-medium italic">
              Bhai, is hotel mein abhi tak koi active room nahi hai. Ek naya
              room add kijiye!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRooms;
