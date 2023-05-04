import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";
import constants from "../util/Constants/constants";
import axios from "axios";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [vendorDashboard, setVendorDashboard] = useState([]);
  const [adminDashboard, setAdminDashboard] = useState([]);
  useEffect(() => {
    if (user?.role === "vendor") {
      getVendorDashboard();
    } else {
      getAdmindashboard();
    }
  }, []);
  const getVendorDashboard = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.VENDOR_DASHBOARD);
    setVendorDashboard(response.data);
    setLoading(false)
  };
  const getAdmindashboard = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.ADMIN_DASHBOARD);
    setAdminDashboard(response.data);
    setLoading(false)
  };
  return (
    <div>
      {
        isLoading && (<Loader />)
      }
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">
        Welcome Back <strong>{user && user.name}</strong>
      </h2>
      {user?.role === "vendor" ? <div className="home-content">
        <div className="overview-boxes">
          <div className="box">
            <div className="right-side">
              <div className="box-topic">Total Category</div>
              <div className="number">{vendorDashboard?.categoryCount}</div>
            </div>
          </div>
          &nbsp;
          &nbsp;
          <div className="box">
            <div className="right-side">
              <div className="box-topic">Total Product</div>
              <div className="number">{vendorDashboard?.productCount}</div>
            </div>
          </div>
          {/* <div className="box">
            <div className="right-side">
              <div className="box-topic">Total Profit</div>
              <div className="number">$12,876</div>
            </div>
          </div> */}
        </div>
      </div>
        :
        <div className="home-content">
          <div className="overview-boxes">
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Category</div>
                <div className="number">{adminDashboard?.categoryCount}</div>
              </div>
            </div>
            &nbsp;
            &nbsp;
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Product</div>
                <div className="number">{adminDashboard?.productCount}</div>
              </div>
            </div>
            &nbsp;
            &nbsp;
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Stores</div>
                <div className="number">{adminDashboard?.storesCount}</div>
              </div>
            </div>
            &nbsp;
            &nbsp;
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Vendor</div>
                <div className="number">{adminDashboard?.vendorCount}</div>
              </div>
            </div>
            &nbsp;
            &nbsp;
            <div className="box">
              <div className="right-side">
                <div className="box-topic">Total Customer</div>
                <div className="number">{adminDashboard?.customerCount}</div>
              </div>
            </div>
          </div>
        </div>}
    </div>
  );
};

export default Welcome;
