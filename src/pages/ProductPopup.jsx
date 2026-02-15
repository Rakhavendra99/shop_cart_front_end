import image from '../asset/image/imagePlaceholder.png'
import PlaceHolderImage from '../asset/image/no_image.png'
const ProductPopup = ({ setshowProduct, popupDetails }) => {
    return (
        <>
            <div className="modal cartPopup" id="exampleModal" aria-modal="true" role="dialog">
                <div className="product_popup_wrapper d-flex justify-content-center align-items-start p-0">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content productPopup py-3 px-3 px-sm-2">
                            <div className="modal-header border-0 d-block position-relative">
                                <h5 className="sub_heading mb-0 mt-1">Product details</h5>
                                <button type="button" className="close_part border-0 bg-transparent" onClick={() => setshowProduct(false)} aria-label="Close">
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body pb-4 pt-0 overflow-auto">
                                <div className="w-100 d-flex justify-content-center">
                                    <div className="card popup_product_card imageProduct mt-2">
                                        <div className="card-body p-2 p-sm-3">
                                            <img src={popupDetails?.data?.image ? popupDetails?.data?.image : image} className="card-img-top product_size" alt="products" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="row productRow g-2">
                                        <div className="col-12 col-sm-4">
                                            <p className="heading">Product Name:</p>
                                        </div>
                                        <div className="col-12 col-sm-8">
                                            <p className="customer_info productWrap">{popupDetails?.data?.name}</p>
                                        </div>
                                    </div>
                                    <div className="row productRow g-2">
                                        <div className="col-12 col-sm-4">
                                            <p className="heading">Price:</p>
                                        </div>
                                        <div className="col-12 col-sm-8">
                                            <p className="customer_info productWrap">₹ {popupDetails?.data?.price}</p>
                                        </div>
                                    </div>
                                    <div className="row productRow g-2">
                                        <div className="col-12 col-sm-4">
                                            <p className="heading">Category Image:</p>
                                        </div>
                                        <div className="col-12 col-sm-8">
                                            <img className="customer_info productWrap"
                                                style={{ width: '70px', height: '70px' }} alt="Category"
                                                src={popupDetails?.data?.category?.image ? popupDetails?.data?.category?.image : PlaceHolderImage}
                                            />
                                        </div>
                                    </div>
                                    <div className="row productRow g-2">
                                        <div className="col-12 col-sm-4">
                                            <p className="heading">Description:</p>
                                        </div>
                                        <div className="col-12 col-sm-8">
                                            <p className="customer_info productWrap">{popupDetails?.data?.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="modal-backdrop show loaderBackGround apploaderBackground"></div> */}
        </>
    )
}
export default ProductPopup