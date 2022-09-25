import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true)
    const response = await axios.get("http://localhost:5000/products");
    setProducts(response.data);
    setLoading(false)
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:5000/products/${productId}`).then((res) => {
      setLoading(false)
      toast.success("Successfully Deleted", {
        position: toast.POSITION.TOP_RIGHT,
      })
      getProducts();
    }).catch((err) => {
      setLoading(false)
      toast.error(err?.response?.data?.msg, {
        position: toast.POSITION.TOP_RIGHT,
      })
    });;
  };

  return (
    <div>
      {
        isLoading && (<Loader />)
      }
      <h1 className="title">Products</h1>
      <h2 className="subtitle">List of Products</h2>
      <Link to={user?.role === "admin" ? "/admin/products/add" : "/products/add"} className="button is-primary mb-2">
        Add New
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.uuid}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.user.name}</td>
              <td>
                <Link
                  to={user?.role === "admin" ? `/admin/products/edit/${product.uuid}` : `/products/edit/${product.uuid}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(product.uuid)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
