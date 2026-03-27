import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store/store.jsx";
import { Provider } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BrowserRouter } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51TF8BQENLMZEEXmz7aLVxPb0Ckln19ArO9IrgtoGyqt3ub6J0j9iOPbsratbM2O6cs0OCylcm0uawg6UW0W1xYIq00thba3gsC",
);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </BrowserRouter>
  </Provider>,
);
