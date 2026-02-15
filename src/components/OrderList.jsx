import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import moment from "moment";

const getTodayStr = () => moment().format("YYYY-MM-DD");

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(getTodayStr);
  const [toDate, setToDate] = useState(getTodayStr);

  useEffect(() => {
    getOrders();
  }, [fromDate, toDate]);

  const getOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ fromDate, toDate });
      const response = await axios.get(constants.API_BASE_URL + constants.ORDER_LIST + "?" + params.toString());
      setOrders(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err?.response?.data?.msg || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <h1 className="title">Orders</h1>
      <h2 className="subtitle">List of Orders</h2>
      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <label className="d-flex align-items-center gap-1">
          <span className="fs-14">From</span>
          <input
            type="date"
            className="form-control form-control-sm"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate}
          />
        </label>
        <label className="d-flex align-items-center gap-1">
          <span className="fs-14">To</span>
          <input
            type="date"
            className="form-control form-control-sm"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
          />
        </label>
      </div>
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
