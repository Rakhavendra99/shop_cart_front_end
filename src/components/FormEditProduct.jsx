import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";

const FormEditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState({ errorName: null, errorPrice: null })

  useEffect(() => {
    const getProductById = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:5000/products/${id}`
        );
        setName(response.data.name);
        setPrice(response.data.price);
        setLoading(false)
      } catch (error) {
        if (error.response) {
          setLoading(false)
          setMsg(error.response.data.msg);
        }
      }
    };
    getProductById();
  }, [id]);

  const updateProduct = async (e) => {
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
        await axios.patch(`http://localhost:5000/products/${id}`, {
          name: name,
          price: price,
        });
        if (user?.role === "admin") {
          navigate("/admin/products");
        } else {
          navigate("/products");
        }
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
      <h2 className="subtitle">Edit Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }
            <form onSubmit={updateProduct}>
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
                    Update
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

export default FormEditProduct;
