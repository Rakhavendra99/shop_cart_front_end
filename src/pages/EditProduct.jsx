import React, { useEffect } from "react";
import Layout from "./Layout";
import FormEditProduct from "../components/FormEditProduct";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      if (user?.role === "vendor") {
        navigate("/");
      }
      else {
        navigate("/admin")
      }
    }
  }, [isError, navigate]);
  return (
    <Layout>
      <FormEditProduct />
    </Layout>
  );
};

export default EditProduct;
