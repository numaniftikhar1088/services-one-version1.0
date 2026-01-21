import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./PaymentForm";

// Your Stripe public key
const stripePromise = loadStripe("your-publishable-key-here");

const StripeIntegeration: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <h1>Stripe Payment Integeration Testing</h1>
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default StripeIntegeration;
