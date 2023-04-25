import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import PlaceHolderImage from '../asset/image/no_image.png'
const StoreList = () => {
  const [stores, setStores] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getStores();
  }, []);

  const getStores = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.STORE_LIST);
    setStores(response.data);
    setLoading(false)
  };

  const deleteStore = async (storeId) => {
    await axios.delete(constants.API_BASE_URL + constants.DELETE_PRODUCT + `/${storeId}`).then((res) => {
      setLoading(false)
      toast.success("Successfully Deleted", {
        position: toast.POSITION.TOP_RIGHT,
      })
      getStores();
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
      getStores()
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
      <h1 className="title">Stores</h1>
      <h2 className="subtitle">List of Stores</h2>
      <Link to={user?.role === "admin" ? "/admin/stores/add" : "/stores/add"} className="button is-primary mb-2">
        Add New
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Id</th>
            <th>Store Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores?.map((store, index) => (
            <tr key={store.id}>
              <td>{store?.id}</td>
              <td>{store?.name}</td>
              <img
                style={{ width: '48px', height: '48px' }} alt="Category"
                src={store?.image ? store?.image : PlaceHolderImage}
                onLoad={(e) => onloadImage(e)}
              />
              <td>
                <Link
                  to={user?.role === "admin" ? `/admin/stores/edit/${store.id}` : `/stores/edit/${store.id}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                &nbsp;&nbsp;
                <label className="switch">
                  <input className="switch-input" type="checkbox"
                    checked={store?.isActive && store?.isActive === 1 ? true : false}
                    onChange={(e) => updateActive(store?.isActive && store?.isActive === 1 ? 0 : 1, store)} />
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </label>
                <button
                  onClick={() => deleteStore(store.id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {stores?.length === 0 && (
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

export default StoreList;
