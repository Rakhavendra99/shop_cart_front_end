import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import PlaceHolderImage from '../asset/image/no_image.png'
import moment from "moment";
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.ORDER_LIST);
    setOrders(response.data);
    setLoading(false)
  };

  return (
    <div>
      {
        isLoading && (<Loader />)
      }
      <h1 className="title">Orders</h1>
      <h2 className="subtitle">List of Orders</h2>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Customer Details</th>
            <th>Status</th>
            <th>Order Date & Time</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order, index) => (
            <tr key={order.id}>
              <td>{order?.id}</td>
              <td>
                Name: {order?.user?.name}
                <br />
                Mobile: {order?.user?.phone ? order?.user?.phone : "-"}
              </td>
              <td>
                <p className={`status_text ${order?.status === 1 ? "pending_status" : order?.status === 2 ? "accepted_status" : "rejected_status"}`}>{order?.status === 1 ? "Pending" : order?.status === 2 ? "Accepted" : "Rejected"}</p></td>
              <td>{moment(order?.createdAt).format("DD/MM/YYYY hh:mm:ss:A")}</td>
              <td>₹{order?.totalAmount?.toFixed(2)}</td>
              <td>
                <Link
                  to={user?.role === "admin" ? `/admin/orders/view/${order.id}` : `/orders/view/${order.id}`}
                  className="button is-small is-info"
                >
                  View
                </Link>
                &nbsp;&nbsp;
              </td>
            </tr>
          ))}
          {orders?.length === 0 && (
            <tr className="tr-shadow">
              <td colSpan="6" className="text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
