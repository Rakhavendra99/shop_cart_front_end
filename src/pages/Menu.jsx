import React, { useEffect, useState } from "react"
import image from '../asset/image/imagePlaceholder.png'
import Loader from "../util/Loader/Loader"
import constants from "../util/Constants/constants"
import axios from "axios"
import ProductPopup from "./ProductPopup"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

const Menu = () => {
    const [isLoading, setLoading] = useState(false)
    const [products, setProducts] = useState([]);
    const [showProduct, setshowProduct] = useState(false)
    const [carts, setCarts] = useState(false)
    const [popupDetails, setPopupDetails] = useState({})
    const cartId = localStorage.getItem("cartId");
    useEffect(() => {
        getCustomerProducts()
        if (cartId !== "null") {
            getCartDetails(cartId)
        }
    }, [])
    const getCustomerProducts = async () => {
        setLoading(true)
        const response = await axios.get(constants.API_BASE_URL + constants.CUSTOMER_PRODUCT_LIST);
        setProducts(response.data);
        setLoading(false)
    };
    const getCartDetails = async (cartId) => {
        setLoading(true)
        const response = await axios.get(constants.API_BASE_URL + constants.CART_DETAILS + `/${cartId}`);
        setCarts(response.data);
        setLoading(false)
    };
    const showProductDetails = (obj, data) => {
        let popupValue = { ...obj, data }
        setPopupDetails(popupValue)
        setshowProduct(true)
    }
    const addCart = async (productdata) => {
        let params = {
            productId: productdata?.id,
            quantity: 1,
            storeId: productdata?.storeId
        }
        if (cartId) {
            params.cartId = cartId
        }
        await axios.post(constants.API_BASE_URL + constants.CART_ADD, params).then((res) => {
            if (res?.data?.msg?.cart?.id) {
                localStorage.setItem("cartId", res?.data?.msg?.cart?.id);
                setLoading(false)
                toast.success("Successfully Added", {
                    position: toast.POSITION.TOP_RIGHT,
                })
                getCartDetails(res?.data?.msg?.cart?.id)
            }
        }).catch((err) => {
            setLoading(false)
            toast.error(err?.response?.data?.msg, {
                position: toast.POSITION.TOP_RIGHT,
            })
        });
    }
    const addProduct = async (params) => {
        setLoading(true)
        await axios.post(constants.API_BASE_URL + constants.CART_ADD, params).then((res) => {
            if (res?.data?.msg?.cart?.id) {
                if (params?.quantity === 0) {
                    localStorage.setItem("cartId", null);
                } else {
                    localStorage.setItem("cartId", res?.data?.msg?.cart?.id);
                }
                setLoading(false)
                toast.success("Successfully Added", {
                    position: toast.POSITION.TOP_RIGHT,
                })
                getCartDetails(res?.data?.msg?.cart?.id)
            }
        }).catch((err) => {
            setLoading(false)
            toast.error(err?.response?.data?.msg, {
                position: toast.POSITION.TOP_RIGHT,
            })
        });
    }
    const quantityIncreament = (obj, cartDetails) => {
        console.log("obj, cartDetails",obj, cartDetails);
        const { CartItems = [] } = cartDetails?.msg
        let getCart = CartItems && CartItems.find((o) => o?.productId === obj?.id);
        let params = {
            productId: obj?.id,
            quantity: getCart?.quantity + 1,
            cartId: getCart?.cartId,
            storeId: obj?.storeId
        };
        addProduct(params);
    }

    const quantityDecrement = (obj, cartDetails) => {
        const { CartItems = [] } = cartDetails?.msg
        let getCart = CartItems && CartItems.find((o) => o?.productId === obj?.id);

        let params = {
            productId: obj?.id,
            quantity: getCart?.quantity - 1,
            cartId: getCart?.cartId,
            storeId: obj?.storeId
        };
        addProduct(params);
    }
    return (
        <>
            {
                isLoading && <Loader />
            }
            <h5 className="section_heading">our day menu</h5>

            {products?.length === 0 ?
                <p className="order_date_show mt-lg-4 mt-3">No products found</p> : ''
            }
            <div className="row products_section px-lg-0 px-3">
                {
                    products?.length > 0 ? products?.map((obj, index) => {
                        let getCart = carts?.msg?.CartItems?.find((o) => o.productId === obj?.id);
                        return <React.Fragment key={index}>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mt-lg-5 mt-3 px-3">
                                <div className="card product_card">
                                    <img src={obj?.image ? obj?.image : image} className="card-img-top product_size cursor-pointer" alt="products" onClick={() => showProductDetails(obj, obj)} />
                                    <div className="card-body pb-0">
                                        <div className="d-flex justify-content-between mb-1">
                                            <p className="sku_id ">#{obj?.id}</p>
                                        </div>
                                        <div className="row">
                                            <p className="product_name col-7">{obj?.name}</p>
                                            <p className="product_description col-5 text-end">₹ {obj?.price?.toFixed(2)}</p>
                                        </div>
                                        <div className="row mt-1 mb-1">
                                            <div className="col-lg-5 col-6 pe-0">
                                                <p className="category_head fs-13">Category:</p>
                                            </div>
                                            <div className="col-lg-7 col-6 ps-0 text-start">
                                                <p className="category_name fs-13 ">{obj?.category?.name}</p>
                                            </div>
                                        </div>
                                        <p className="product_description menuProductDescription mt-1">{obj?.description}</p>
                                    </div>
                                    <div className="card-footer menu_cart_footer mb-2">
                                        <>
                                            {getCart?.quantity > 0 ?
                                                <button className="add_btn mt-2">
                                                    <div className="fs-12 d-flex justify-content-around">
                                                        <p><i className="bi bi-dash fs-14" onClick={() => quantityDecrement(obj, carts)}></i></p>
                                                        <p className="fs-13 f-med">{getCart?.quantity}</p>
                                                        <p><i className="bi bi-plus fs-14" onClick={() => quantityIncreament(obj, carts)}></i></p>
                                                    </div>
                                                </button>
                                                :
                                                <button className="add_btn mt-2 p-0" onClick={() => addCart(obj)}><span className="fs-12" >Add</span></button>
                                            }
                                        </>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    })
                        :
                        <div className="store_closed">
                            <div className="d-flex justify-content-center">
                                <img src={require(`../asset/image/search-not-found.gif`)} alt='No products' className="product_not_found" />
                            </div>
                        </div>
                }
            </div>
            <button className={`common_btn mt-3 cartCanel popup_btn d-block mx-auto ${(10 * 1) > 0 && ' DisbaleLoadMore'}`} onClick={() => ''}>load more</button>
            {
                showProduct && <ProductPopup popupDetails={popupDetails} setshowProduct={setshowProduct} />
            }
        </>
    )
}
export default Menu