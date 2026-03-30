import API from "../../api/api.config";
import {
  setBooking,
  setClientSecret,
  setLoading,
  setBookingError,
  setMyBookings,
} from "../reducers/bookingSlice";


export const asyncInitiateBooking = (bookingData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    
    const bookingRes = await API.post("/bookings", bookingData);
    const booking = bookingRes.data;
    dispatch(setBooking(booking));

    
    const intentRes = await API.post(`/payments/create-intent/${booking.id}`);

    
    const clientSecret = intentRes.data?.clientSecret || intentRes.clientSecret;

    if (clientSecret) {
      dispatch(setClientSecret(clientSecret));
      return true;
    } else {
      throw new Error("Stripe Client Secret not received");
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "Booking initiation failed";
    dispatch(setBookingError(errorMsg));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};


export const asyncConfirmPayment = (bookingId) => async (dispatch) => {
  try {
    
    await API.patch(`/payments/booking/${bookingId}/mark-paid`);
    return true;
  } catch (error) {
    console.error("Payment Confirmation Error", error);
    return false;
  }
};


export const asyncFetchMyBookings = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await API.get("/bookings");
    dispatch(setMyBookings(data?.items || []));
  } catch (error) {
    dispatch(
      setBookingError(
        error.response?.data?.message || "Failed to load bookings",
      ),
    );
  } finally {
    dispatch(setLoading(false));
  }
};



export const asyncDownloadInvoice = (bookingId) => async () => {
  try {
    const response = await API.get(`/bookings/${bookingId}/invoice`, {
      responseType: "blob", 
    });

    
    const url = window.URL.createObjectURL(new Blob([response.data]));

    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();

    
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Invoice Download Error:", error);
    alert("Could not download invoice. Please try again later.");
  }
};
