import React, { useEffect } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import FormAddCategory from "../components/FormAddCategory";

const AddCategory = () => {
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
      <FormAddCategory />
    </Layout>
  );
};

export default AddCategory;
