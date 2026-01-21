import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  CardElementProps,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import {
  StripeCardElementOptions,
  StripeCardElementChangeEvent,
} from "@stripe/stripe-js";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  //   const handleSubmit = async (event: React.FormEvent) => {
  //     event.preventDefault();

  //     if (!stripe || !elements) {
  //       return;
  //     }

  //     setIsProcessing(true);

  //     const cardElement = elements.getElement(CardElement);

  //     if (!cardElement) {
  //       return;
  //     }

  //     const { error, paymentIntent } = await stripe.confirmCardPayment(
  //       "your-client-secret-from-server",
  //       {
  //         payment_method: {
  //           card: cardElement,
  //           billing_details: {
  //             name: name,
  //             email: email,
  //           },
  //         },
  //       }
  //     );

  //     if (error) {
  //       setErrorMessage(error.message || "Payment failed");
  //       setIsProcessing(false);
  //     } else {
  //       setErrorMessage(null);
  //       // Handle successful payment here (e.g., display confirmation message)
  //       console.log("PaymentIntent:", paymentIntent);
  //       setIsProcessing(false);
  //     }
  //   };

  const cardStyle: StripeCardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setErrorMessage(event.error ? event.error.message : "");
  };

  return (
    <form>
      <div className="col-4">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="col-4">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div className="col-4">
        <label htmlFor="cardElement">Card Details</label>
        <CardElement
          id="cardElement"
          options={cardStyle}
          onChange={handleCardChange}
          className="form-control"
        />
      </div>

      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      <button
        className="btn btn-sm btn-primary"
        type="submit"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing…" : "Pay"}
      </button>
    </form>
  );
};

export default CheckoutForm;
