import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";
import constants from "../util/Constants/constants";
import axios from "axios";
import moment from "moment";

const getTodayStr = () => moment().format("YYYY-MM-DD");

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [vendorDashboard, setVendorDashboard] = useState({});
  const [adminDashboard, setAdminDashboard] = useState({});
  const [fromDate, setFromDate] = useState(getTodayStr);
  const [toDate, setToDate] = useState(getTodayStr);

  useEffect(() => {
    if (user?.role === "vendor") getVendorDashboard();
    else if (user?.role === "admin") getAdmindashboard();
  }, [fromDate, toDate, user?.role]);

  const getVendorDashboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ fromDate, toDate });
      const response = await axios.get(constants.API_BASE_URL + constants.VENDOR_DASHBOARD + "?" + params.toString());
      setVendorDashboard(response.data || {});
    } finally {
      setLoading(false);
    }
  };

  const getAdmindashboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ fromDate, toDate });
      const response = await axios.get(constants.API_BASE_URL + constants.ADMIN_DASHBOARD + "?" + params.toString());
      setAdminDashboard(response.data || {});
    } finally {
      setLoading(false);
    }
  };

  const dateFilterUI = (
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
  );

  return (
    <div>
      {isLoading && <Loader />}
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">
        Welcome Back <strong>{user && user.name}</strong>
      </h2>
      {dateFilterUI}
      {user?.role === "vendor" ? (
        <div className="home-content">
          <div className="overview-boxes">
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Category</div>
                <div className="number">{vendorDashboard?.categoryCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Product</div>
                <div className="number">{vendorDashboard?.productCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Orders (period)</div>
                <div className="number">{vendorDashboard?.ordersCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Revenue (period)</div>
                <div className="number">₹{(vendorDashboard?.totalOrderAmount ?? 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="home-content">
          <div className="overview-boxes">
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Category</div>
                <div className="number">{adminDashboard?.categoryCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Product</div>
                <div className="number">{adminDashboard?.productCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Stores</div>
                <div className="number">{adminDashboard?.storesCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Vendor</div>
                <div className="number">{adminDashboard?.vendorCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Customer</div>
                <div className="number">{adminDashboard?.customerCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Orders (period)</div>
                <div className="number">{adminDashboard?.ordersCount ?? 0}</div>
              </div>
            </div>
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Revenue (period)</div>
                <div className="number">₹{(adminDashboard?.totalOrderAmount ?? 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
