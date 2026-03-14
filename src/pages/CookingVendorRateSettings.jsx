import React, { useEffect } from "react";
import Layout from "./Layout";
import FormCookingRateSettings from "../components/FormCookingRateSettings";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const CookingVendorRateSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "vendor") {
        navigate("/vendor");
      } else {
        navigate("/");
      }
    }
    if (user && user.role !== "vendor") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <FormCookingRateSettings />
    </Layout>
  );
};

export default CookingVendorRateSettings;

