import image from '../asset/image/imagePlaceholder.png'
import PlaceHolderImage from '../asset/image/no_image.png'
const ProductPopup = ({ setshowProduct, popupDetails }) => {
    return (
        <>
            <div className="modal cartPopup" id="exampleModal">
                <div className="">
                    <div className="modal-dialog">
                        <div className="modal-content productPopup py-3 px-2">
                            <div className="modal-header border-0 d-block">
                                <div className="close_part" onClick={() => setshowProduct(false)} >
                                    <i className="bi bi-x-lg"></i>
                                </div>
                            </div>
                            <div className="modal-body pb-4 pt-0">
                                <div className="product_subhead_row mt-2">
                                    <h5 className="sub_heading">Product details</h5>
                                </div>
                                <div className="w-100 d-flex justify-content-center">
                                    <div className="card popup_product_card imageProduct mt-2">
                                        <div className="card-body">
                                            <img src={popupDetails?.data?.image ? popupDetails?.data?.image : image} className="card-img-top product_size" alt="products" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="row productRow">
                                        <div className="col-4">
                                            <p className="heading">Product Name:</p>
                                        </div>
                                        <div className="col-8">
                                            <p className="customer_info productWrap">{popupDetails?.data?.name}</p>
                                        </div>
                                    </div>
                                    <div className="row productRow">
                                        <div className="col-4">
                                            <p className="heading">Price:</p>
                                        </div>
                                        <div className="col-8">
                                            <p className="customer_info productWrap">₹ {popupDetails?.data?.price}</p>
                                        </div>
                                    </div>
                                    <div className="row productRow">
                                        <div className="col-4">
                                            <p className="heading">Category Image:</p>
                                        </div>
                                        <div className="col-8">
                                            <img className="customer_info productWrap"
                                                style={{ width: '70px', height: '70px' }} alt="Category"
                                                src={popupDetails?.data?.category?.image ? popupDetails?.data?.category?.image : PlaceHolderImage}
                                            />
                                        </div>
                                    </div>
                                    <div className="row productRow ">
                                        <div className="col-4">
                                            <p className="heading">Description:</p>
                                        </div>
                                        <div className="col-8">
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