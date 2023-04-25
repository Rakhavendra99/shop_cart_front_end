import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoPricetag, IoHome, IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import { stopSocketConnect } from '../socket'
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    stopSocketConnect()
    if (user?.role === "admin") {
      navigate('/admin')
      window.location.reload()
    } else if (user?.role === "vendor") {
      navigate("/");
      window.location.reload()
    } else {
      navigate("/")
      window.location.reload()
    }
  };

  return (
    <div>
      {user && user.role === "vendor" && (
        <aside className="menu pl-2 has-shadow">
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li>
              <NavLink to={"/dashboard"}>
                <IoHome /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"/category"}>
                <IoPricetag /> Category
              </NavLink>
            </li>
            <li>
              <NavLink to={"/products"}>
                <IoPricetag /> Products
              </NavLink>
            </li>
          </ul>
          <p className="menu-label">Settings</p>
          <ul className="menu-list">
            <li>
              <button onClick={logout} className="button is-white">
                <IoLogOut /> Logout
              </button>
            </li>
          </ul>
        </aside>
      )}
      {user && user.role === "admin" && (
        <aside className="menu pl-2 has-shadow">
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li>
              <NavLink to={"/admin/dashboard"}>
                <IoHome /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to={"/admin/products"}>
                <IoPricetag /> Products
              </NavLink>
            </li>
            <li>
              <NavLink to={"/admin/stores"}>
                <IoPricetag /> Stores
              </NavLink>
            </li>
          </ul>
          <div>
            <p className="menu-label">Admin</p>
            <ul className="menu-list">
              <li>
                <NavLink to={"/admin/users"}>
                  <IoPerson /> Users
                </NavLink>
              </li>
            </ul>
          </div>
          <p className="menu-label">Settings</p>
          <ul className="menu-list">
            <li>
              <button onClick={logout} className="button is-white">
                <IoLogOut /> Logout
              </button>
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
};

export default Sidebar;
