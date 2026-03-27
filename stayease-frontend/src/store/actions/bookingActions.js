import API from "../../api/api.config";
import {
  setBooking,
  setClientSecret,
  setLoading,
  setBookingError,
  setMyBookings,
} from "../reducers/bookingSlice";

// 1. Create Booking & Get Payment Intent
export const asyncInitiateBooking = (bookingData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    // A. Create Booking in DB
    const bookingRes = await API.post("/bookings", bookingData);
    const booking = bookingRes.data;
    dispatch(setBooking(booking));

    // B. Create Stripe Payment Intent (Returns clientSecret)
    const intentRes = await API.post(`/payments/create-intent/${booking.id}`);

    // Yahan .data check zaroori hai based on your backend response
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

// 2. Mark as Paid (Using Option B: Booking ID)
export const asyncConfirmPayment = (bookingId) => async (dispatch) => {
  try {
    // Backend endpoint: PATCH /payments/booking/:id/mark-paid
    await API.patch(`/payments/booking/${bookingId}/mark-paid`);
    return true;
  } catch (error) {
    console.error("Payment Confirmation Error", error);
    return false;
  }
};

// 3. Fetch My Bookings
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

// bookingActions.js

export const asyncDownloadInvoice = (bookingId) => async () => {
  try {
    const response = await API.get(`/bookings/${bookingId}/invoice`, {
      responseType: "blob", // 👈 Ye sabse important line hai
    });

    // 1. Create a Blob from the response
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // 2. Create a temporary 'a' tag to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // 3. Clean up
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Invoice Download Error:", error);
    alert("Could not download invoice. Please try again later.");
  }
};
