import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { asyncAddHotel } from "../../store/actions/hotelActions";
import { Camera, Building2, MapPin, AlignLeft, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";

const AddHotel = () => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { loading } = useSelector((state) => state.hotel);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      asyncAddHotel({ ...formData, image: imageFile }),
    );

    if (result.success) {
      alert("Mubarak ho! Hotel list ho gaya.");
      navigate("/owner/my-hotels");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
        {}
        <div className="bg-secondary p-10 text-white relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-10 right-10 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-black flex items-center gap-3 italic">
            <Building2 className="text-primary" /> Register Property
          </h2>
          <p className="text-gray-400 mt-2 font-medium">
            Apne hotel ka safar yahan se shuru karein.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {}
          <div className="relative group w-full h-64 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden">
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="text-primary" size={28} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Upload Cover Image
                </p>
              </div>
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Hotel Name"
              placeholder="The Grand Plaza"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />

            <CustomInput
              label="City"
              placeholder="Ahmedabad"
              value={formData.city}
              onChange={(v) => setFormData({ ...formData, city: v })}
            />
          </div>

          <CustomInput
            label="Full Address"
            placeholder="Nr. Parul University, Waghodia..."
            value={formData.address}
            onChange={(v) => setFormData({ ...formData, address: v })}
          />

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 px-1">
              <AlignLeft size={14} /> Description
            </label>
            <textarea
              className="w-full p-5 bg-gray-50 rounded-[1.5rem] border-none focus:ring-2 focus:ring-primary/20 text-sm h-32 resize-none"
              placeholder="Tell guests why your hotel is the best..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <Button
            className="w-full py-5 text-lg shadow-xl shadow-primary/20 rounded-[1.5rem]"
            disabled={loading}
          >
            {loading ? "Listing Property..." : "Create Property"}
          </Button>
        </form>
      </div>
    </div>
  );
};


const CustomInput = ({ label, placeholder, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-gray-400 uppercase px-1 tracking-widest">
      {label}
    </label>
    <input
      type="text"
      className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-secondary"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

export default AddHotel;
