import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
const Userlist = () => {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.ADD_USER);
    setUsers(response.data);
    setLoading(false)
  };

  const deleteUser = async (userId) => {
    setLoading(true)
    await axios.delete(constants.API_BASE_URL + constants.DELETE_USER + `${userId}`).then((res) => {
      setLoading(false)
      toast.success("Successfully Deleted", {
        position: toast.POSITION.TOP_RIGHT,
      })
      getUsers();
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      toast.error(err?.response?.data?.msg, {
        position: toast.POSITION.TOP_RIGHT,
      })
    });
  };
  const updateActive = async (e, obj) => {
    setLoading(true)
    await axios.patch(constants.API_BASE_URL + constants.UPDATE_USER + `/${obj?.id}`, {
      id: obj.id,
      isActive: e
    }).then((res) => {
      setLoading(false)
      toast.success("Successfully Updated", {
        position: toast.POSITION.TOP_RIGHT,
      })
      getUsers()
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
      <h1 className="title">Users</h1>
      <h2 className="subtitle">List of Users</h2>
      <Link to={user?.role === "admin" ? "/admin/users/add" : "/users/add"} className="button is-dark mb-2">
        Add New
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((i, index) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.name}</td>
              <td>{i.email}</td>
              <td>{i.role}</td>
              <td>
                <Link
                  to={user?.role === "admin" ? `/admin/users/edit/${i.id}` : `/users/edit/${i.id}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                &nbsp;&nbsp;
                <label className="switch">
                  <input className="switch-input" type="checkbox"
                    checked={i?.isActive && i?.isActive === 1 ? true : false}
                    onChange={(e) => updateActive(i?.isActive && i?.isActive === 1 ? 0 : 1, i)} />
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </label>
                {/* <button
                  onClick={() => deleteUser(i.id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
          {users?.length === 0 && (
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

export default Userlist;
