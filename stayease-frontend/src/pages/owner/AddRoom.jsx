import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { asyncAddRoom } from "../../store/actions/roomActions";
import {
  BedDouble,
  Users,
  IndianRupee,
  Hash,
  ImagePlus,
  Check,
  Wifi,
  Wind,
  Tv,
  Coffee,
} from "lucide-react";
import Button from "../../components/common/Button";
import Navbar from "../../components/layout/Navbar";

const AMENITY_OPTIONS = [
  "WiFi",
  "AC",
  "TV",
  "Mini Bar",
  "Room Service",
  "Balcony",
];

const AddRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [roomData, setRoomData] = useState({
    room_number: "",
    room_type: "suite",
    price: "",
    capacity: "2",
    amenities: [],
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Toggle Amenity Logic
  const toggleAmenity = (name) => {
    setRoomData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      asyncAddRoom(hotelId, { ...roomData, images }),
    );
    if (result.success) {
      alert("Inventory Added Successfully!");
      navigate("/owner/my-hotels");
    } else {
      alert(
        "Error: " +
          (typeof result.message === "string"
            ? result.success
            : "Check console"),
      );
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-secondary p-8 text-white flex justify-between items-center">
            <h2 className="text-2xl font-black italic flex items-center gap-3">
              <BedDouble className="text-primary" /> Add Room Inventory
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Gallery
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative h-24 rounded-2xl overflow-hidden border border-gray-100"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary transition-all">
                    <ImagePlus className="text-gray-300" size={24} />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InputField
                label="Room No."
                icon={<Hash size={14} />}
                placeholder="101"
                value={roomData.room_number}
                onChange={(v) => setRoomData({ ...roomData, room_number: v })}
              />

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Type
                </label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm text-secondary focus:ring-2 focus:ring-primary/20 appearance-none"
                  value={roomData.room_type}
                  onChange={(e) =>
                    setRoomData({ ...roomData, room_type: e.target.value })
                  }
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <InputField
                label="Capacity"
                icon={<Users size={14} />}
                type="number"
                value={roomData.capacity}
                onChange={(v) => setRoomData({ ...roomData, capacity: v })}
              />

              <InputField
                label="Price / Night"
                icon={<IndianRupee size={14} />}
                placeholder="2500"
                value={roomData.price}
                onChange={(v) => setRoomData({ ...roomData, price: v })}
              />
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {AMENITY_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-[10px] font-bold transition-all border ${
                      roomData.amenities.includes(item)
                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                        : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {roomData.amenities.includes(item) && <Check size={12} />}
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full py-5 text-lg shadow-xl shadow-primary/20 rounded-2xl">
              Create Room Listing
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input
const InputField = ({
  label,
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
      {icon} {label}
    </label>
    <input
      type={type}
      className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm text-secondary focus:ring-2 focus:ring-primary/20"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

export default AddRoom;
