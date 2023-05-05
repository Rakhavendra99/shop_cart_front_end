import axios from 'axios'
import { useDispatch } from 'react-redux'
import constants from '../util/Constants/constants'
import { toast } from 'react-toastify'
const DeleteCartPopup = ({ setRemovePopuop, setLoading, cartObj }) => {
    const dispatch = useDispatch()
    const cartId = localStorage.getItem("cartId")

    const OnProceed = async () => {
        let params = {
            productId: cartObj.productId,
            quantity: 0,
            cartId: cartId,
            storeId: cartObj?.product?.storeId
        };
        setLoading(true)
        await axios.post(constants.API_BASE_URL + constants.CART_ADD, params).then((res) => {
            if (res?.data?.msg?.cart?.id) {
                // if (params?.quantity === 0) {
                //     localStorage.setItem("cartId", null);
                // } else {
                //     localStorage.setItem("cartId", res?.data?.msg?.cart?.id);
                // }
                setLoading(false)
                toast.success("Successfully Removed", {
                    position: toast.POSITION.TOP_RIGHT,
                })
                setRemovePopuop(false)
                window.location.reload()
            }
        }).catch((err) => {
            setLoading(false)
            toast.error(err?.response?.data?.msg, {
                position: toast.POSITION.TOP_RIGHT,
            })
            setRemovePopuop(false)
        });
    }
    return (
        <>
            <div className="modal cartPopup" id="exampleModal">
                <div className="cartRemovePopup">
                    <div className="modal-dialog">
                        <div className="modal-content customer_popup_content py-3 px-2">
                            <div className="modal-header border-0 d-block">
                                <p className="modal-title text-center fs-16 f-sbold" id="exampleModalLabel">Do you want to remove the product from the cart?</p>
                                <div className="close_part" onClick={() => setRemovePopuop(false)}>
                                    <i className="bi bi-x-lg"></i>
                                </div>
                            </div>
                            <div className="modal-body pb-0 pt-0">
                            </div>
                            <div className='d-flex'>
                                <button className="common_btn mt-3 cartCanel popup_btn cancel_btn" onClick={() => setRemovePopuop(false)}><span className="fs-13 pickup_part f-med">Cancel</span></button>
                                <button className="common_btn mt-3 cartCanel popup_btn" onClick={() => OnProceed()}><span className="fs-13 pickup_part f-med">Proceed</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="modal-backdrop show loaderBackGround apploaderBackground"></div> */}
        </>
    )
}
export default DeleteCartPopup