import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from "axios";
import constants from "../util/Constants/constants";
import { toast } from "react-toastify";
import Loader from "../util/Loader/Loader";
import moment from "moment";

const isCookingVendorUser = (user) =>
  user?.role === "cooking_vendor" ||
  (user?.role === "vendor" && user?.vendorType === "cooking_vendor");

const CookingVendorRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/vendor");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (user && !isCookingVendorUser(user)) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(constants.API_BASE_URL + constants.COOKING_VENDOR_ORDERS);
      setOrders(res.data || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isCookingVendorUser(user)) {
      load();
    }
  }, [user]);

  const workflow = async (orderId, action) => {
    try {
      await axios.patch(
        `${constants.API_BASE_URL}${constants.COOKING_VENDOR_ORDERS}/${orderId}/workflow`,
        { action }
      );
      toast.success(`Updated: ${action}`);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Update failed");
    }
  };

  const statusLabel = (s) => {
    if (s === 10) return "Awaiting your accept";
    if (s === 11) return "Accepted — start when you begin cooking";
    if (s === 12) return "In progress";
    if (s === 13) return "Completed — store vendor can accept order";
    return "—";
  };

  if (!user || !isCookingVendorUser(user)) {
    return null;
  }

  return (
    <Layout>
      <h1 className="title">Cooking requests</h1>
      <p className="subtitle">
        Accept a request, press Start when cooking begins, then Complete when food is ready. The store
        vendor is notified to accept the order and contact the customer.
      </p>
      {loading && <Loader />}
      {!loading && (
        <div className="table-container">
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Placed</th>
                <th>Products total</th>
                <th>Cooking fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7}>No cooking requests yet.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.user?.name || "—"}</td>
                    <td>{o.createdAt ? moment(o.createdAt).format("DD/MM/YYYY HH:mm") : "—"}</td>
                    <td>₹{Number(o.totalAmount || 0).toFixed(2)}</td>
                    <td>₹{Number(o.cookingServiceFee || 0).toFixed(2)}</td>
                    <td>{statusLabel(o.cookingWorkflowStatus)}</td>
                    <td>
                      {o.cookingWorkflowStatus === 10 && (
                        <button type="button" className="button is-small is-success" onClick={() => workflow(o.id, "accept")}>
                          Accept
                        </button>
                      )}
                      {o.cookingWorkflowStatus === 11 && (
                        <button type="button" className="button is-small is-info" onClick={() => workflow(o.id, "start")}>
                          Start cooking
                        </button>
                      )}
                      {o.cookingWorkflowStatus === 12 && (
                        <button type="button" className="button is-small is-primary" onClick={() => workflow(o.id, "complete")}>
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default CookingVendorRequests;
