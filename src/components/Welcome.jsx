import React, { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false)
  
  return (
    <div>
      {
        isLoading && (<Loader />)
      }
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">
        Welcome Back <strong>{user && user.name}</strong>
      </h2>
    </div>
  );
};

export default Welcome;
