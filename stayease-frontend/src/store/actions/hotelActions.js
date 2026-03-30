import API from "../../api/api.config";
import {
  setHotels,
  setLoading,
  setHotelError,
  setSelectedHotel,
  setOwnerHotels,
} from "../reducers/hotelSlice";





export const asyncFetchHotels =
  (params = {}) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      
      
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const response = await API.get("/hotels", { params: cleanParams });

      console.log("Hotels API Full Response:", response.data);

      
      
      const finalData =
        response.data.data || response.data.hotels || response.data;

      dispatch(setHotels(finalData));
    } catch (error) {
      console.error("Fetch Hotels Error:", error.response?.data);
      dispatch(
        setHotelError(error.response?.data?.message || "Failed to load hotels"),
      );
    }
  };
export const asyncFetchHotelById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await API.get(`/hotels/${id}`);
    console.log("selected Hotels API Data:", data); 
    
    dispatch(setSelectedHotel(data));
  } catch (error) {
    dispatch(setHotelError(error.response?.data?.message || "Hotel not found"));
  }
};



export const asyncAddHotel = (hotelData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    
    const formData = new FormData();
    formData.append("name", hotelData.name);
    formData.append("city", hotelData.city);
    formData.append("address", hotelData.address);
    formData.append("description", hotelData.description);

    
    if (hotelData.image) {
      formData.append("image", hotelData.image);
    }

    const response = await API.post("/hotels", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, data: response.data };
  } catch (error) {
    const msg =
      error.response?.data?.message || "Property list karne mein error aayi!";
    return { success: false, message: msg };
  } finally {
    dispatch(setLoading(false));
  }
};
export const asyncFetchOwnerHotels = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await API.get("/hotels/owner/my-properties");

    
    dispatch(setOwnerHotels(response.data));
  } catch (error) {
    console.error("Fetch Hotels Error:", error);
  } finally {
    dispatch(setLoading(false));
  }
};
