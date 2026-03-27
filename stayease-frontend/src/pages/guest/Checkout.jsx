import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import Button from "../../components/common/Button";
import { asyncConfirmPayment } from "../../store/actions/bookingActions";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentBooking, clientSecret } = useSelector(
    (state) => state.booking,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Security: Agar booking data nahi hai toh wapas bhej do
  useEffect(() => {
    if (!currentBooking || !clientSecret) {
      navigate("/");
    }
  }, [currentBooking, clientSecret, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    setPaymentError(null);

    // 1. Confirm Payment on Stripe Side
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      if (
        result.error.code === "payment_intent_unexpected_state" ||
        result.error.message.includes("already succeeded")
      ) {
        console.log(
          "Payment was already successful! Moving to backend confirmation...",
        );
        handleBackendUpdate(); // Naya function jo niche hai
      } else {
        setPaymentError(result.error.message);
        setIsProcessing(false);
      }
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Stripe Success! Confirming with backend...");

        // ✅ Option B: Use currentBooking.id directly
        const success = await dispatch(asyncConfirmPayment(currentBooking.id));

        if (success) {
          navigate("/booking-success");
        } else {
          setPaymentError(
            "Payment successful, but status update failed. Please contact support.",
          );
          setIsProcessing(false);
        }
      }
    }
    const handleBackendUpdate = async () => {
      const success = await dispatch(asyncConfirmPayment(currentBooking.id));
      if (success) {
        navigate("/booking-success");
      } else {
        setPaymentError(
          "Payment verified, but failed to update status. Please check 'My Bookings'.",
        );
        setIsProcessing(false);
      }
    };
  };

  if (!currentBooking) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Payment Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
            <CreditCard className="text-primary" /> Secure Payment
          </h2>

          <form onSubmit={handlePayment} className="space-y-6">
            {paymentError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {paymentError}
              </div>
            )}

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
              <CardElement
                options={{
                  style: { base: { fontSize: "16px", color: "#424770" } },
                }}
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" /> SSL Secure
              Payment
            </div>

            <Button
              className="w-full py-4 text-lg shadow-lg shadow-primary/20"
              disabled={isProcessing || !stripe || !clientSecret} // <--- 'isProcessing' check is crucial
            >
              {isProcessing
                ? "Processing..."
                : `Pay ₹${currentBooking.total_price}`}
            </Button>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="bg-secondary p-8 rounded-3xl text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span className="text-sm">Check-in</span>
                <span className="text-white font-medium">
                  {currentBooking.check_in_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Check-out</span>
                <span className="text-white font-medium">
                  {currentBooking.check_out_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Room Status</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-primary font-bold">
                  {currentBooking.status.toUpperCase()}
                </span>
              </div>
              <hr className="border-white/10" />
            </div>
          </div>

          <div className="flex justify-between text-3xl font-black text-white pt-6">
            <span>Total</span>
            <span className="text-primary">₹{currentBooking.total_price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
