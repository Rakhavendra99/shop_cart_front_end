import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import PlaceHolderImage from '../asset/image/no_image.png'
const CategoryList = () => {
  const [category, setCategory] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.CATEGORY_LIST);
    setCategory(response.data);
    setLoading(false)
  };

  const deleteCategory = async (categoryId) => {
    await axios.delete(constants.API_BASE_URL + constants.DELETE_CATEGORY + `/${categoryId}`).then((res) => {
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
    await axios.patch(constants.API_BASE_URL + constants.UPDATE_CATEGORY + `/${obj?.id}`, {
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
      <h1 className="title">Categorys</h1>
      <h2 className="subtitle">List of Categorys</h2>
      <Link to={user?.role === "admin" ? "/admin/category/add" : "/category/add"} className="button is-dark mb-2">
        Add New
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Id</th>
            <th>Category Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {category?.map((category, index) => (
            <tr key={category?.id}>
              <td>{category?.id}</td>
              <td>{category?.name}</td>
              <td><img
                style={{ width: '48px', height: '48px' }} alt="Category"
                src={category?.image ? category?.image : PlaceHolderImage}
                onLoad={(e) => onloadImage(e)}
              /></td>
              <td>
                <Link
                  to={user?.role === "admin" ? `/admin/category/edit/${category.id}` : `/category/edit/${category.id}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                &nbsp;&nbsp;
                <label className="switch">
                  <input className="switch-input" type="checkbox"
                    checked={category?.isActive && category?.isActive === 1 ? true : false}
                    onChange={(e) => updateActive(category?.isActive && category?.isActive === 1 ? 0 : 1, category)} />
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </label>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {category?.length === 0 && (
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

export default CategoryList;
