import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../asset/image/shop_cart.png";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import Loader from "../util/Loader/Loader";
import { stopSocketConnect } from '../socket'

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false)

  const logout = () => {
    setLoading(true)
    dispatch(LogOut());
    dispatch(reset());
    stopSocketConnect()
    if (user?.role === "admin") {
      setLoading(false)
      navigate('/admin')
    } else if (user?.role === "vendor") {
      setLoading(false)
      navigate("/vendor");
    } else {
      setLoading(false)
      navigate("/")
    }
  };

  return (
    <div>
      {
        isLoading && (<Loader />)
      }
      <nav
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <NavLink to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="navbar-item">
            <img src={logo} width="125" height="150" alt="logo" />
          </NavLink>
          <a
            href="!#"
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button onClick={logout} className="button is-light">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
