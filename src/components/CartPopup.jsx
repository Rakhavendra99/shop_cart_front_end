import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ContactValidation, isValidEmail, validatemaxLength, validateminLength, validateMobileNumnber } from "../util/Validations";
import Loader from "../util/Loader/Loader";
import constants from "../util/Constants/constants";
import axios from "axios";

export const CartPopup = ({ setShowCartPopup, cartId }) => {
    const [formDetails, setFormDetails] = useState({});
    const [errors, setErrors] = useState();
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (Object.keys(formDetails)?.length !== 0) {
            let validatedError = ContactValidation(formDetails, ["name", "email", "phone", "address"])
            if (validatedError) {
                setErrors(validatedError)
            }
        }
    }, [formDetails])

    const handlechange = (e) => {
        setFormDetails({ ...formDetails, [e.target.name]: e.target.value })
    }
    const proceedPayment = async () => {
        setLoading(true)
        if (!formDetails?.name) {
            setLoading(false)
            setErrors({ ...errors, name: "Please enter the name" })
        } else if (!formDetails?.email || !isValidEmail(formDetails?.email)) {
            setLoading(false)
            setErrors({ ...errors, email: "Please enter the email" })
        } else if (!formDetails?.phone || !validateMobileNumnber(formDetails?.phone)) {
            setLoading(false)
            setErrors({ ...errors, phone: "Please enter the valid phone number" })
        } else if (!formDetails?.address || (!validateminLength(formDetails?.address) || validatemaxLength(formDetails?.address))) {
            setLoading(false)
            setErrors({ ...errors, address: "Please enter the address" })
        } else {
            setLoading(false)
            let params = {
                cartId: cartId,
                name: formDetails?.name,
                orderType: 1,
                phone: formDetails?.phone,
                email: formDetails?.email,
                storeId: 1,
                address: formDetails?.address,
            }
            await axios.post(constants.API_BASE_URL + constants.PLACE_ORDER, params).then((res) => {
                if (res?.data?.msg?.id) {
                    if (res?.data?.msg?.id) {
                        localStorage.setItem("cartId", null);
                    }
                    setLoading(false)
                    toast.success("Successfully Placed", {
                        position: toast.POSITION.TOP_RIGHT,
                    })
                    setShowCartPopup(false)
                }
            }).catch((err) => {
                setLoading(false)
                toast.error(err?.response?.data?.msg, {
                    position: toast.POSITION.TOP_RIGHT,
                })
            });
        }
    }
    return (
        <>
            {
                isLoading && <Loader />
            }
            <div className="modal cartPopup" id="exampleModal">
                <div className="customer_popup">
                    <div className="modal-dialog">
                        <div className="modal-content customer_popup_content py-3 px-2">
                            <div className="modal-header border-0 d-block">
                                <p className="modal-title text-center fs-16 f-sbold" id="exampleModalLabel">Please fill your details for
                                    checkout</p>
                                <div className="close_part" onClick={() => setShowCartPopup(false)}>
                                    <i className="bi bi-x-lg"></i>
                                </div>
                            </div>
                            <div className="modal-body pb-0 pt-0">
                                <div className="row">
                                    <div className="col-md-6 mt-lg-3 mt-2">
                                        <div className="mb-3">
                                            <label className="form-label fs-14">Name</label>
                                            <input type="text" className="form-control" name="name" placeholder="Please enter the name" onChange={handlechange} required />
                                            {
                                                errors?.name &&
                                                <p className="errorMessage">{errors?.name}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-lg-3 mt-2">
                                        <div className="mb-3">
                                            <label className="form-label fs-14">Email</label>
                                            <input type="email" className="form-control" name="email" placeholder="Please enter the email" onChange={handlechange} required />
                                            {
                                                errors?.email &&
                                                <p className="errorMessage">{errors?.email}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-lg-3 mt-2">
                                        <div className="mb-3">
                                            <label className="form-label fs-14">Mobile No</label>
                                            <input type="number" className="form-control" name="phone" placeholder="Please enter the mobile number" onChange={handlechange} required />
                                            {
                                                errors?.phone &&
                                                <p className="errorMessage">{errors?.phone}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-lg-3 mt-2">
                                        <div className="mb-3">
                                            <label className="form-label fs-14">Address</label>
                                            <textarea className="form-control" name="address" placeholder="Please enter the address" onChange={handlechange}></textarea>
                                            {
                                                errors?.address &&
                                                <p className="errorMessage">{errors?.address}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-center border-0 pt-0 popup_footer">
                                <button className="common_btn mt-3 popup_btn cancel_btn" onClick={() => setShowCartPopup(false)}><span className="fs-13 pickup_part f-med">Cancel</span></button>
                                <button className="common_btn mt-3 popup_btn" onClick={() => proceedPayment()}><span className="fs-13 pickup_part f-med">Proceed to payment</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="modal-backdrop show loaderBackGround apploaderBackground"></div> */}
        </>
    )
}