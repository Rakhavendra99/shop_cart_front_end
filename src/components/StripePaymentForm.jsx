import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
    : null;

function CheckoutForm({ clientSecret, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setIsProcessing(true);
        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/?payment=success`,
                    receipt_email: undefined,
                },
            });
            if (error) {
                toast.error(error.message || "Payment failed", { position: toast.POSITION.TOP_RIGHT });
                setIsProcessing(false);
            }
        } catch (err) {
            toast.error(err?.message || "Payment failed", { position: toast.POSITION.TOP_RIGHT });
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stripe-payment-form">
            <div className="stripe-payment-shell">
                <div className="stripe-payment-header d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <p className="fs-14 f-sbold mb-1">Card payment</p>
                        <p className="fs-12 text-muted mb-0">Enter your card / UPI details to complete the order.</p>
                    </div>
                    <span className="badge bg-light text-dark fs-11 border">
                        <span className="me-1">🔒</span>
                        Powered by Stripe
                    </span>
                </div>
                <div className="stripe-payment-element-wrapper mb-3">
                    <PaymentElement />
                </div>
                <div className="d-flex gap-2 mt-2 justify-content-end">
                    <button
                        type="button"
                        className="common_btn popup_btn cancel_btn"
                        onClick={onCancel}
                        disabled={isProcessing}
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="common_btn popup_btn"
                        disabled={!stripe || isProcessing}
                    >
                        {isProcessing ? "Processing…" : "Pay securely"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default function StripePaymentForm({ clientSecret, onSuccess, onCancel }) {
    if (!clientSecret) return null;
    const pk = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
        return (
            <div className="alert alert-warning">
                Stripe is not configured. Add REACT_APP_STRIPE_PUBLISHABLE_KEY to your .env file.
            </div>
        );
    }
    const options = { clientSecret, appearance: { theme: "stripe" } };
    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
    );
}
