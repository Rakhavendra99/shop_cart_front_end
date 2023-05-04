import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import PlaceHolderImage from '../asset/image/no_image.png'
import image from '../asset/image/imagePlaceholder.png'
import moment from "moment";
const header = [
  "Product Image",
  "Product Name",
  "Quantity",
  "Order Date & Time",
  "Total Price",
]
const FormViewOrder = () => {
  const [orderListData, setOrderList] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [showDeclinePopup, setShowDeclinePopup] = useState(false)
  const { id } = useParams();
  useEffect(() => {
    getOrders();
  }, []);
  const getOrders = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.ORDER_DETAILS + `/${id}`);
    setOrderList(response.data);
    setLoading(false)
  };
  const decline = () => {
    setShowDeclinePopup(true)
  }
  const goBack = () => {
    window.history.back()
  }
  return (
    <div>
      <h1 className="title">Orders</h1>
      <h2 className="subtitle">Update Order</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }
            <div className="row">
              <div className="col-md-12 col-lg-4 popup_left">
                <div className="card popup_left_card">
                  <p className="">Customer Name:<label className="customer_info">{orderListData?.user?.name ? orderListData?.user?.name : "-"}</label></p>
                  <p className="">Phone:<label className="customer_info">{orderListData?.user?.phone ? orderListData?.user?.phone : "-"}</label></p>
                  <p className="">Email:<label className="customer_info">{orderListData?.user?.email ? orderListData?.user?.email : "-"}</label></p>
                  <p className="">Address:<label className="customer_info">{orderListData?.user?.address ? orderListData?.user?.address : "-"}</label></p>
                </div>
                <br />
                <div className="">
                  <div className="d-flex">
                    <>
                      <button className="button is-dark" onClick={() => goBack()}>
                        Back
                      </button>
                    </>
                    &nbsp;&nbsp;
                    <div className="">
                      <button className="decline_btn" onClick={() => "decline()"}><i className="bi bi-x decline_icon"></i>Decline</button>
                    </div>
                    <div className="">
                      <button className="accept_btn ms-3" onClick={() => "updateOrder(true)"}><i className="bi bi-check-lg accept_icon"></i>Accept</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-8 popup_right">
                <div className="card">
                  <div className="card-body">
                    <div className="table_contents popup_table">
                      <table className="table table-responsive table-condensed">
                        <thead>
                          <tr>
                            {header &&
                              header?.map((elements, index) => (
                                <th key={index} scope="col" >
                                  {elements}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (orderListData?.OrderItems && orderListData?.OrderItems?.length > 0) ? orderListData?.OrderItems?.map((obj, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <img style={{ width: '88px', height: '88px' }} src={obj?.product?.image ? obj?.product?.image : image} alt="Product" />
                                  </td>
                                  <td>{obj?.product?.name}</td>
                                  <td>{obj?.quantity}</td>
                                  <td>{moment(obj?.createdAt).format("DD/MM/YYYY hh:mm:ss:A")}</td>
                                  <td>₹{obj?.product?.price?.toFixed(2)}</td>
                                </tr>
                              )
                            }) : ""
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer-item item_total_tax">
                    <div className="popup_footer_content">
                      <p className="popup_footer_text">Items Total: <span className="popup_footer_subtext">₹{orderListData?.totalAmount?.toFixed(2)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormViewOrder;
