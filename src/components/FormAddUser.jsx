import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../util/Loader/Loader";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
const FormAddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState({ errorName: null, errorEmail: null, errorRole: null, errorPassword: null, errorCnfPassword: null })

  const saveUser = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      if (!name) {
        setLoading(false)
        setError({ errorName: "Please Enter the Name" })
      } else if (!email) {
        setLoading(false)
        setError({ errorEmail: "Please Enter the Email" })
      } else if (!password) {
        setLoading(false)
        setError({ errorPassword: "Please Enter the Password" })
      } else if (!confPassword) {
        setLoading(false)
        setError({ errorCnfPassword: "Please Enter the Conform Password" })
      } else if (password !== confPassword) {
        setLoading(false)
        setError({ errorCnfPassword: "Password not match" })
      } else if (!role) {
        setLoading(false)
        setError({ errorRole: "Please Select the Role" })
      } else {
        await axios.post(constants.API_BASE_URL + constants.ADD_USER, {
          name: name,
          email: email,
          password: password,
          confPassword: confPassword,
          role: role,
        }).then((res) => {
          setLoading(false)
          toast.success("Successfully Added", {
            position: toast.POSITION.TOP_RIGHT,
          })
          setLoading(false)
          navigate("/admin/users");
        }).catch((err) => {
          setLoading(false)
          toast.error(err?.response?.data?.msg, {
            position: toast.POSITION.TOP_RIGHT,
          })
        });;

      }
    } catch (error) {
      if (error.response) {
        setLoading(false)
        setMsg(error.response.data.msg);
      }
    }
  };
  const onChangeName = (e) => {
    setName(e.target.value)
    setError({ errorName: null })
  }
  const onChangeEmail = (e) => {
    setEmail(e.target.value)
    setError({ errorEmail: null })
  }
  const onChangePassword = (e) => {
    setPassword(e.target.value)
    setError({ errorPassword: null })
  }
  const onChangeCnfPassword = (e) => {
    setConfPassword(e.target.value)
    setError({ errorCnfPassword: null })
  }
  const onchangeRole = (e) => {
    setRole(e.target.value)
    setError({ errorRole: null })
  }
  const goBack = () => {
    window.history.back()
  }
  return (
    <div>
      <h1 className="title">Users</h1>
      <h2 className="subtitle">Add New User</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }
            <form onSubmit={saveUser}>
              <p className="has-text-centered" style={{ color: "red" }}>{msg}</p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => onChangeName(e)}
                    placeholder="Name"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorName}</p>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={email}
                    onChange={(e) => onChangeEmail(e)}
                    placeholder="Email"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorEmail}</p>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => onChangePassword(e)}
                    placeholder="******"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorPassword}</p>
              </div>
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={confPassword}
                    onChange={(e) => onChangeCnfPassword(e)}
                    placeholder="******"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorCnfPassword}</p>
              </div>
              <div className="field">
                <label className="label">Role</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={role}
                      onChange={(e) => onchangeRole(e)}
                    >
                      <option value="admin">Admin</option>
                      <option value="vendor">Vendor</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                </div>
                <p style={{ color: "red" }}>{error.errorRole}</p>
              </div>
              <div className="row">
                <div className="col-sm-1">
                  <div className="flex-end">
                    <div className="control">
                      <button type="button" className="button is-dark" onClick={() => goBack()}>
                        Back
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="field">
                    <div className="control">
                      <button type="submit" className="button is-dark">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddUser;
