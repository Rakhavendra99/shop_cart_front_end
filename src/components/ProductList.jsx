import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import PlaceHolderImage from '../asset/image/no_image.png'
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.PRODUCT_LIST);
    setProducts(response.data);
    setLoading(false)
  };

  const deleteProduct = async (productId) => {
    await axios.delete(constants.API_BASE_URL + constants.DELETE_PRODUCT + `/${productId}`).then((res) => {
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
  const onloadImage = (e) => {
    setLoading(false)
  }
  const updateActive = async (e, obj) => {
    setLoading(true)
    await axios.patch(constants.API_BASE_URL + constants.UPDATE_PRODUCT + `/${obj?.id}`, {
      id: obj.id,
      isActive: e
    }).then((res) => {
      setLoading(false)
      toast.success("Successfully Updated", {
        position: toast.POSITION.TOP_RIGHT,
      })
      getProducts()
    }).catch((err) => {
      setLoading(false)
      toast.error(err?.response?.data?.msg, {
        position: toast.POSITION.TOP_RIGHT,
      })
    });
  }
  return (
    <div>
      {
        isLoading && (<Loader />)
      }
      <h1 className="title">Products</h1>
      <h2 className="subtitle">List of Products</h2>
      <Link to={user?.role === "admin" ? "/admin/products/add" : "/products/add"} className="button is-dark mb-2">
        Add New
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Id</th>
            <th>Product Name</th>
            {user?.role === "admin" && <th>Store Name</th>}
            <th>Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => (
            <tr key={product.id}>
              <td>{product?.id}</td>
              <td>{product?.name}</td>
              {user?.role === "admin" && <td>{product?.store?.name}</td>}
              <td>{product?.price}</td>
              <img
                style={{ width: '48px', height: '48px' }} alt="Category"
                src={product?.image ? product?.image : PlaceHolderImage}
                onLoad={(e) => onloadImage(e)}
              />
              <td>
                <Link
                  to={user?.role === "admin" ? `/admin/products/edit/${product.id}` : `/products/edit/${product.id}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                &nbsp;&nbsp;
                <label className="switch">
                  <input className="switch-input" type="checkbox"
                    checked={product?.isActive && product?.isActive === 1 ? true : false}
                    onChange={(e) => updateActive(product?.isActive && product?.isActive === 1 ? 0 : 1, product)} />
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </label>
                {/* <button
                  onClick={() => deleteProduct(product.id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
          {products?.length === 0 && (
            <tr className="tr-shadow">
              <td colSpan="6" className="text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
