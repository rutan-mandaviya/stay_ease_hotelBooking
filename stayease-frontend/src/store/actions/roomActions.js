import API from "../../api/api.config";

export const asyncAddRoom = (hotelId, roomData) => async () => {
  try {
    
    const response = await API.post(`/hotels/${hotelId}/rooms`, {
      room_number: roomData.room_number,
      room_type: roomData.room_type,
      capacity: Number(roomData.capacity),
      price_per_night: Number(roomData.price),
      amenities: roomData.amenities || [],
    });
    console.log("Full Axios Response:", response);
    const roomId = response.data?.data?.id || response.data?.id;

    if (!roomId) {
      throw new Error("Backend ne Room ID nahi bheji!");
    }

    console.log("Room created! ID is:", roomId);

    if (roomData.images && roomData.images.length > 0) {
      const formData = new FormData();
      roomData.images.forEach((file) => {
        formData.append("images", file);
      });

      await API.post(`/uploads/rooms/${roomId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Images uploaded successfully!");
    }

    return { success: true };
  } catch (error) {
    
    console.error("🚩 API ERROR:", error.message);
    if (error.response) {
      console.error("Backend Error Data:", error.response.data);
    }

    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Action failed",
    };
  }
};


export const asyncDeleteRoom = (roomId) => async (dispatch) => {
  try {
    if (!window.confirm("Bhai, pakka delete karna hai? Ye wapas nahi aayega!"))
      return;
    console.log("room id", roomId);
    await API.delete(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Delete fail ho gaya!" };
  }
};
