import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ContactValidation, isValidEmail, validatemaxLength, validateminLength, validateMobileNumnber } from "../util/Validations";
import Loader from "../util/Loader/Loader";
import constants from "../util/Constants/constants";
import axios from "axios";
import StripePaymentForm from "./StripePaymentForm";

const PAYMENT_METHODS = {
    STRIPE: "stripe",
    COD: "cod",
};

export const CartPopup = ({ setShowCartPopup, cartId, storeId }) => {
    const [formDetails, setFormDetails] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD);
    const [clientSecret, setClientSecret] = useState(null);
    const [showStripeForm, setShowStripeForm] = useState(false);
    const [cookingVendors, setCookingVendors] = useState([]);
    const [selectedCookingVendorId, setSelectedCookingVendorId] = useState(null);

    useEffect(() => {
        if (Object.keys(formDetails)?.length !== 0) {
            const validatedError = ContactValidation(formDetails, ["name", "email", "phone", "address"]);
            if (validatedError) setErrors(validatedError);
        }
    }, [formDetails]);

    useEffect(() => {
        const fetchCookingVendors = async () => {
            try {
                const res = await axios.get(constants.API_BASE_URL + constants.CUSTOMER_COOKING_VENDOR_LIST);
                const list = res.data || [];
                setCookingVendors(list);
                const savedId = localStorage.getItem("cookingVendorId");
                if (savedId) {
                    const found = list.find((v) => String(v.id) === String(savedId));
                    if (found) {
                        setSelectedCookingVendorId(found.id);
                    }
                }
            } catch {
                // non-blocking
            }
        };
        fetchCookingVendors();
    }, []);

    const handlechange = (e) => {
        setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formDetails?.name) {
            setErrors({ ...errors, name: "Please enter the name" });
            return false;
        }
        if (!formDetails?.email || !isValidEmail(formDetails?.email)) {
            setErrors({ ...errors, email: "Please enter a valid email" });
            return false;
        }
        if (!formDetails?.phone || !validateMobileNumnber(formDetails?.phone)) {
            setErrors({ ...errors, phone: "Please enter a valid phone number" });
            return false;
        }
        if (!formDetails?.address || !validateminLength(formDetails?.address) || validatemaxLength(formDetails?.address)) {
            setErrors({ ...errors, address: "Please enter the address" });
            return false;
        }
        return true;
    };

    const proceedPaymentCOD = async () => {
        setLoading(true);
        if (!validateForm()) {
            setLoading(false);
            return;
        }
        const params = {
            cartId,
            name: formDetails?.name,
            orderType: 1,
            phone: formDetails?.phone,
            email: formDetails?.email,
            storeId,
            address: formDetails?.address,
            payment_method: PAYMENT_METHODS.COD,
            cookingVendorId: selectedCookingVendorId || null,
        };
        try {
            const res = await axios.post(constants.API_BASE_URL + constants.PLACE_ORDER, params);
            if (res?.data?.msg?.id) {
                localStorage.setItem("cartId", null);
                toast.success("Order placed successfully. Pay on delivery.", { position: toast.POSITION.TOP_RIGHT });
                setShowCartPopup(false);
                window.location.reload();
            }
        } catch (err) {
            toast.error(err?.response?.data?.msg || "Failed to place order", { position: toast.POSITION.TOP_RIGHT });
        } finally {
            setLoading(false);
        }
    };

    const proceedPaymentStripe = async () => {
        setLoading(true);
        if (!validateForm()) {
            setLoading(false);
            return;
        }
        const params = {
            cartId,
            name: formDetails?.name,
            orderType: 1,
            phone: formDetails?.phone,
            email: formDetails?.email,
            storeId,
            address: formDetails?.address,
            cookingVendorId: selectedCookingVendorId || null,
        };
        try {
            const res = await axios.post(constants.API_BASE_URL + constants.CREATE_PAYMENT_INTENT, params);
            if (res?.data?.clientSecret) {
                setClientSecret(res.data.clientSecret);
                setShowStripeForm(true);
            } else {
                toast.error(res?.data?.msg || "Failed to initialize payment", { position: toast.POSITION.TOP_RIGHT });
            }
        } catch (err) {
            toast.error(err?.response?.data?.msg || "Failed to initialize payment", { position: toast.POSITION.TOP_RIGHT });
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = () => {
        if (paymentMethod === PAYMENT_METHODS.COD) {
            proceedPaymentCOD();
        } else {
            proceedPaymentStripe();
        }
    };

    const handleStripeCancel = () => {
        setClientSecret(null);
        setShowStripeForm(false);
    };

    const handleClose = () => {
        setShowStripeForm(false);
        setClientSecret(null);
        setShowCartPopup(false);
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className="modal cartPopup" id="exampleModal" aria-modal="true" role="dialog">
                <div className="customer_popup">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content customer_popup_content cartPopup-elevated">
                            <div className="modal-header border-0 d-block position-relative text-center">
                                <p className="modal-title fs-16 f-sbold mb-1" id="exampleModalLabel">
                                    {showStripeForm ? "Secure card payment" : "Checkout"}
                                </p>
                                <p className="fs-12 text-muted">
                                    {showStripeForm
                                        ? "Enter your card details below. Payments are processed securely by Stripe."
                                        : "Step 1: Fill your details • Step 2: Choose how you want to pay"}
                                </p>
                                <button
                                    type="button"
                                    className="close_part border-0 bg-transparent"
                                    onClick={handleClose}
                                    aria-label="Close"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body pb-0 pt-0 overflow-auto">
                                {showStripeForm ? (
                                    <StripePaymentForm clientSecret={clientSecret} onCancel={handleStripeCancel} />
                                ) : (
                                    <div className="checkout-layout">
                                        <div className="checkout-card">
                                            <p className="fs-14 f-sbold mb-2">Contact & delivery details</p>
                                            <p className="fs-12 text-muted mb-3">
                                                We&apos;ll use this information for order updates and delivery.
                                            </p>
                                            <div className="row g-2">
                                                <div className="col-12 col-md-6 mt-lg-2 mt-2">
                                                    <div className="mb-3">
                                                        <label className="form-label fs-14">Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="name"
                                                            placeholder="Please enter the name"
                                                            onChange={handlechange}
                                                            required
                                                        />
                                                        {errors?.name && <p className="errorMessage">{errors?.name}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 mt-lg-2 mt-2">
                                                    <div className="mb-3">
                                                        <label className="form-label fs-14">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            name="email"
                                                            placeholder="Please enter the email"
                                                            onChange={handlechange}
                                                            required
                                                        />
                                                        {errors?.email && <p className="errorMessage">{errors?.email}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 mt-lg-2 mt-2">
                                                    <div className="mb-3">
                                                        <label className="form-label fs-14">Mobile No</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="phone"
                                                            placeholder="Please enter the mobile number"
                                                            onChange={handlechange}
                                                            required
                                                        />
                                                        {errors?.phone && <p className="errorMessage">{errors?.phone}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 mt-lg-2 mt-2">
                                                    <div className="mb-3">
                                                        <label className="form-label fs-14">Address</label>
                                                        <textarea
                                                            className="form-control"
                                                            name="address"
                                                            placeholder="Please enter the address"
                                                            onChange={handlechange}
                                                        ></textarea>
                                                        {errors?.address && <p className="errorMessage">{errors?.address}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="checkout-card mt-3">
                                            <p className="fs-14 f-sbold mb-2">Choose your cooking partner (optional)</p>
                                            <p className="fs-12 text-muted mb-3">
                                                Select a cooking vendor to prepare your order, or leave it unselected to let us assign one.
                                            </p>
                                            <div className="mb-3">
                                                <select
                                                    className="form-select fs-13"
                                                    value={selectedCookingVendorId || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value || null;
                                                        setSelectedCookingVendorId(val ? Number(val) : null);
                                                        if (val) {
                                                            localStorage.setItem("cookingVendorId", val);
                                                        } else {
                                                            localStorage.removeItem("cookingVendorId");
                                                        }
                                                    }}
                                                >
                                                    <option value="">No preference</option>
                                                    {cookingVendors.map((v) => (
                                                        <option key={v.id} value={v.id}>
                                                            {v.name}
                                                            {v.rate && v.rate.rateAmount
                                                                ? ` – ₹${v.rate.rateAmount} (${v.rate.rateType})`
                                                                : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <p className="fs-14 f-sbold mb-2 mt-2">Payment method</p>
                                            <p className="fs-12 text-muted mb-3">
                                                Choose your preferred option. Online payments are handled securely via Stripe.
                                            </p>
                                            <div className="d-flex flex-column gap-2">
                                                <label
                                                    className={`payment-option-card ${
                                                        paymentMethod === PAYMENT_METHODS.STRIPE ? "selected" : ""
                                                    }`}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value={PAYMENT_METHODS.STRIPE}
                                                            checked={paymentMethod === PAYMENT_METHODS.STRIPE}
                                                            onChange={() => setPaymentMethod(PAYMENT_METHODS.STRIPE)}
                                                        />
                                                        <span className="payment-option-label">
                                                            <i className="bi bi-credit-card-2-front me-2" />
                                                            <span className="d-block">
                                                                <strong>Online Payment – Card / UPI</strong>
                                                            </span>
                                                            <small className="d-block text-muted mt-1">
                                                                Pay instantly with secure Stripe checkout.
                                                            </small>
                                                        </span>
                                                    </div>
                                                </label>
                                                <label
                                                    className={`payment-option-card ${
                                                        paymentMethod === PAYMENT_METHODS.COD ? "selected" : ""
                                                    }`}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value={PAYMENT_METHODS.COD}
                                                            checked={paymentMethod === PAYMENT_METHODS.COD}
                                                            onChange={() => setPaymentMethod(PAYMENT_METHODS.COD)}
                                                        />
                                                        <span className="payment-option-label">
                                                            <i className="bi bi-cash-coin me-2" />
                                                            <span className="d-block">
                                                                <strong>Cash on Delivery (COD)</strong>
                                                            </span>
                                                            <small className="d-block text-muted mt-1">
                                                                Pay in cash when your order is delivered.
                                                            </small>
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!showStripeForm && (
                                <div className="modal-footer justify-content-between border-0 pt-3 popup_footer flex-column flex-sm-row gap-2">
                                    <button
                                        type="button"
                                        className="common_btn popup_btn cancel_btn w-100 w-sm-auto"
                                        onClick={handleClose}
                                    >
                                        <span className="fs-13 pickup_part f-med">Back to cart</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="common_btn popup_btn w-100 w-sm-auto"
                                        onClick={handlePlaceOrder}
                                    >
                                        <span className="fs-13 pickup_part f-med">
                                            {paymentMethod === PAYMENT_METHODS.STRIPE ? "Continue to payment" : "Place order"}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
