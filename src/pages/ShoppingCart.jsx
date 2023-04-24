import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
// import image from '../asset/img/imagePlaceholder.png'
// import { CartPopup } from "../components/HOC/CartPopup"
import { startSocketConnect } from "../socket"
import moment from "moment"
// import DeleteCartPopup from "../components/DeleteCartPopup"
import { toast } from "react-toastify"
import Loader from "../util/Loader/Loader"
import constants from "../util/Constants/constants"
import axios from "axios"

const ShoppingCart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [cartDetails, setCartDetails] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [cartId, setCartId] = useState(1)
    const [isPolicy, setPolicy] = useState(false)
    const [cartObj, setCartObj] = useState({})
    const [removePopup, setRemovePopuop] = useState(false)
    const [showCartPopup, setShowCartPopup] = useState(false)


    useEffect(() => {
        if (cartId) {
            getCartDetails(cartId)
        }
        startSocketConnect()
    }, [cartId, dispatch])
    const getCartDetails = async (id) => {
        setLoading(true)
        const response = await axios.get(constants.API_BASE_URL + constants.CART_DETAILS + `/${id}`);
        setCartDetails(response.data);
        setLoading(false)
    };
    const addProduct = (params) => {
        const callback = (response) => {
            setLoading(false)
            if (response?.response_code !== 0) {
                toast.error(response?.response_message)
            } else {
                const { cart } = response?.response
                if (cart?.id) {
                    let params = {
                        cartId: cart?.id
                    }
                }
            }
        }
        setLoading(true)
    }

    const deleteCart = (obj) => {
        setRemovePopuop(true)
        setCartObj(obj)
    }


    const quantityIncreament = (obj) => {
        let { quantity, productId, cartId } = obj || {};
        if (quantity) {
            let params = {
                productId: productId,
                quantity: quantity + 1,
                cartId: cartId,
            };
            if (obj?.availableDayId === 8) {
                params.availableDayId = obj?.productAvailableDayId
                params.availableDate = obj?.availableDate
            } else {
                params.availableDayId = obj?.productAvailableDayId
            }
            addProduct(params);
        } else {
            let params = {
                productId: obj?.id,
                quantity: quantity,
            };
            addProduct(params);
        }
    }
    const quantityDecrement = (obj) => {
        let { quantity, productId, cartId } = obj || {};
        if (quantity) {
            let params = {
                productId: productId,
                quantity: quantity - 1,
                cartId: cartId,
            };
            if (obj?.availableDayId === 8) {
                params.availableDayId = obj?.productAvailableDayId
                params.availableDate = obj?.availableDate
            } else {
                params.availableDayId = obj?.productAvailableDayId
            }
            addProduct(params);
        } else {
            let params = {
                productId: obj?.id,
                quantity: quantity,
            };
            addProduct(params);
        }
    }

    const checkPolicy = (event) => {
        setPolicy(event?.target?.checked)
    }
    const checkDeliveryDate = (item) => {
        const deliveryDate = new Date(item?.deliveryDate);
        const currentDate = new Date(Date.now() + (3600 * 1000 * 48));
        return (deliveryDate >= currentDate)
    }
    const checkout = () => {
        if (cartDetails?.CartItems.every(checkDeliveryDate)) {
            setShowCartPopup(true)
        } else {
            toast.warn("Order cannot be processed due to delivery date is expired.")
        }
    }
    return (
        <>
            {isLoading && <Loader />}
            <div className="between_content mt-5">
                <h5 className="section_heading text-start m-0">Shopping cart</h5>
                <button className="continue_shopping_btn" onClick={() => navigate('/')}><span className="fs-13 pickup_part f-med">Continue shopping</span></button>
            </div>
            <div className="row cart_border p-0 mt-3 mx-0">

                <div className={`${cartDetails?.CartItems?.length > 0 ? 'col-lg-7' : 'col-lg-12'} px-lg-4 px-sm-2 py-lg-4 pt-3 pb-0`}>
                    {cartDetails?.CartItems?.length > 0 && <p className="text-end fs-13">{cartDetails?.totalItems > 1 ? 'Total items' : 'Total item'} : <span className="ms-2 fs-15 f-sbold">{cartDetails?.totalItems}</span></p>}
                    {cartDetails?.CartItems?.length > 0 ? cartDetails?.CartItems?.map((obj, index) => {
                        let expired = checkDeliveryDate(cartDetails?.CartItems[index])
                        return (
                            <>
                                <div key={index} className="cart_scroll mt-3">
                                    <div className="row shopping_cart_row pb-3 m-0">
                                        {/* <div className="between_content pb-2 px-0">
                                            <p className="fs-13 f-sbold">Order for {moment(cartDetails?.CartItems[index].deliveryDate).format("MMM Do")}</p>
                                        </div> */}
                                        <div className="col-2 cart_align p-0 d-flex justify-content-center align-items-center">
                                            <img src={"https://leelakitchen.s3.amazonaws.com/" + obj?.Product?.productImage} className="img-fluid cart_product_img" alt="products" />
                                        </div>
                                        <div className="col-5 cart_products ps-lg-0 ps-2">
                                            <p className="fs-13 f-bold pe-4">{obj?.Product?.productName}</p>
                                            <p className="cart_category fs-12 f-med">{obj?.Product?.categoryId === 1 ? "Dessert" : obj?.Product?.categoryId === 2 ? "Bowls" : "Rice/Breads"}</p>
                                            <p className={`fs-12 f-med ${!expired && 'expiredOrder'}`}>Order for {moment(cartDetails?.CartItems[index].deliveryDate).format("MMM Do")}</p>
                                        </div>
                                        <div className="col-2 cart_align">
                                            <p className="quantity_increase"><i className="bi bi-dash" style={{ cursor: "pointer" }} onClick={() => quantityDecrement(obj)}></i></p>
                                            <p className="fs-15 f-med mx-lg-2 shopping_quantity">{obj?.quantity}</p>
                                            <p className="quantity_increase"><i className="bi bi-plus" style={{ cursor: "pointer" }}
                                                onClick={() => quantityIncreament(obj)}></i></p>
                                        </div>
                                        <div className="col-2 cart_align cart_total_price">
                                            <p className="f-sbold fs-15">${(obj?.quantity * obj?.Product?.productPrice)?.toFixed(2)}</p>
                                        </div>
                                        <div className="col-1 cart_align shopping_cart_close">
                                            <p style={{ cursor: 'pointer' }} onClick={() => deleteCart(obj)}><i className="bi bi-x fs-20"></i></p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }) : <div className="h-100 d-flex align-items-center">
                        <div className="p-lg-5 p-3">
                            <img src={require(`../../src/asset/image/empty_cart.png`)} className="img-fluid empty_card" alt="" />
                            <p className="text-center fs-17 f-sbold py-md-3 py-2">Your cart is empty</p>
                            <p className="text-center fs-15">You can go to menu to view more</p>
                        </div>
                    </div>
                    }

                </div>
                {cartDetails?.CartItems?.length > 0 && <div className="col-lg-5 cart_checkout_part px-lg-4 px-3 pt-lg-4 pt-4 pb-5">
                    <p className="fs-15 f-sbold pickup_part">Pickup address</p>
                    <p className="pickup_address px-3 py-2 mt-3 fs-13">3728 Turetella Drive Round Rock, TX 78681</p>
                    <div className="form-check mt-3">
                        <input className="form-check-input check_input_cart cursor-pointer" checked={isPolicy} onChange={(event) => checkPolicy(event)} type="checkbox" />
                        <label className="form-check-label fs-13 f-sbold">Cancellation Policy</label>
                    </div>
                    <p className={`fs-11 mt-3 ${isPolicy ? "cancelationPolicy" : "cancelationPolicyView"}`}>An order is considered as confirmed by the customer once full payment has been made. If order is cancelled not less than 8 days before date of delivery, 50% of amount paid will be refunded. If order is cancelled thereafter, there is no refund.</p>
                    <p className={`fs-11 mt-3 ${isPolicy ? "cancelationPolicy" : "cancelationPolicyView"}`}>An order can be postponed upto 3 days before the date of delivery. In that case, there is no refund, but the order amount can be applied to a delivery at a later date. This credit can be applied for upto two separate orders and cannot be applied over more than two deliveries on two dates. Postponement less than 3 days before date of delivery will have a charge of 40% of the order amount</p>
                    <div className="checkout_border mb-3 mt-4"></div>
                    <div className="d-flex justify-content-between">
                        <p className="fs-14 f-med pickup_part">Sub Total</p>
                        <p className="fs-15 f-bold">${cartDetails?.subTotal?.toFixed(2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fs-14 f-med pickup_part">Tax</p>
                        <p className="fs-15 f-bold">${cartDetails?.tax?.toFixed(2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fs-14 f-med pickup_part">Total price</p>
                        <p className="fs-15 f-bold">${cartDetails?.totalAmount?.toFixed(2)}</p>
                    </div>
                    <button disabled={isPolicy === false ? true : false} className={`${isPolicy ? 'common_btn mt-4' : 'common_btn mt-4 disabled-btn'}`} onClick={() => checkout()}><span className="fs-14 pickup_part f-med">Checkout</span></button>
                </div>}
            </div>
            {/* {
                showCartPopup && <CartPopup cartId={cartId} setShowCartPopup={setShowCartPopup} />
            }
            {
                removePopup && <DeleteCartPopup setRemovePopuop={setRemovePopuop} setLoading={setLoading} cartObj={cartObj} />
            } */}
        </>
    )
}
export default ShoppingCart

