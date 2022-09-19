import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true)
    const response = await axios.get("http://localhost:5000/users");
    setUsers(response.data);
    setLoading(false)
  };

  const deleteUser = async (userId) => {
    setLoading(true)
    await axios.delete(`http://localhost:5000/users/${userId}`);
    getUsers();
    setLoading(false)
  };

  return (
    <div>
      {
        isLoading && (<Loader />)
      }
      <h1 className="title">Users</h1>
      <h2 className="subtitle">List of Users</h2>
      <Link to={user?.role === "admin" ? "/admin/users/add" : "/users/add"} className="button is-primary mb-2">
        Add New
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((i, index) => (
            <tr key={i.uuid}>
              <td>{index + 1}</td>
              <td>{i.name}</td>
              <td>{i.email}</td>
              <td>{i.role}</td>
              <td>
                <Link
                  to={user?.role === "admin" ? `/admin/users/edit/${i.uuid}` : `/users/edit/${i.uuid}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteUser(i.uuid)}
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

export default Userlist;
