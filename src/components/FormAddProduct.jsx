import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const FormAddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState({ errorName: null, errorPrice: null })
  const saveProduct = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      if (!name) {
        setLoading(false)
        setError({ errorName: "Please Enter the Product Name" })
      } else if (!price) {
        setLoading(false)
        setError({ errorPrice: "Please Enter the Product Price" })
      } else {
        await axios.post("http://localhost:5000/products", {
          name: name,
          price: price,
        }).then((res) => {
          setLoading(false)
          if (user?.role === "admin") {
            navigate("/admin/products");
          } else {
            navigate("/products");
          }
          toast.success("Successfully Added", {
            position: toast.POSITION.TOP_RIGHT,
          })
        }).catch((err) => {
          setLoading(false)
          toast.error(err?.response?.data?.msg, {
            position: toast.POSITION.TOP_RIGHT,
          })
        });

      }
    } catch (error) {
      if (error.response) {
        setLoading(false)
        setMsg(error.response.data.msg);
      }
    }
  };
  const onChangeProductName = (e) => {
    setName(e.target.value)
    setError({ errorName: null })
  }
  const onChangeProductPrice = (e) => {
    setPrice(e.target.value)
    setError({ errorPrice: null })
  }
  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">Add New Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }
            <form onSubmit={saveProduct}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => onChangeProductName(e)}
                    placeholder="Product Name"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorName}</p>
              </div>
              <div className="field">
                <label className="label">Price</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={price}
                    onChange={(e) => onChangeProductPrice(e)}
                    placeholder="Price"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorPrice}</p>
              </div>

              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddProduct;
