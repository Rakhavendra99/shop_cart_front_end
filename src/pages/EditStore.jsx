import React, { useEffect } from "react";
import Layout from "./Layout";
import FormEditStore from "../components/FormEditStore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      if (user?.role === "admin") {
        navigate('/admin')
      } else if (user?.role === "vendor") {
        navigate("/vendor");
      } else {
        navigate("/")
      }
    }
  }, [isError, navigate]);
  return (
    <Layout>
      <FormEditStore />
    </Layout>
  );
};

export default EditStore;
