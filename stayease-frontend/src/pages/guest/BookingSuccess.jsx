import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Download } from "lucide-react";
import Button from "../../components/common/Button";
import confetti from "canvas-confetti";

const BookingSuccess = () => {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8 animate-bounce">
          <CheckCircle className="text-green-500" size={48} />
        </div>

        <h1 className="text-4xl font-black text-secondary mb-4">
          Stay Confirmed!
        </h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Bhai, aapki booking confirm ho gayi hai. Invoice aapki email par bhej
          di gayi hai.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/my-bookings">
            <Button className="w-full py-4 text-lg">
              View My Bookings <ArrowRight size={20} />
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full py-4">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
