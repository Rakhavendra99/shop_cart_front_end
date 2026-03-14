import React, { useEffect } from "react";
import Layout from "./Layout";
import FormAddCookingVendor from "../components/FormAddCookingVendor";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const AddCookingVendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError || (user && user.role !== "admin")) {
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "vendor") {
        navigate("/vendor");
      } else {
        navigate("/");
      }
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <FormAddCookingVendor />
    </Layout>
  );
};

export default AddCookingVendor;

