import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../util/Loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constants from "../util/Constants/constants";

const COOKING_VENDOR_CODE = "cooking_vendor";

const FormAddCookingVendor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [location, setLocation] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState("");
  const [cookingDescription, setCookingDescription] = useState("");
  const [rateType, setRateType] = useState("per_order");
  const [rateAmount, setRateAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [vendorTypeId, setVendorTypeId] = useState(null);
  const [vendorTypes, setVendorTypes] = useState([]);
  const [msg, setMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    errorName: null,
    errorEmail: null,
    errorPassword: null,
    errorCnfPassword: null,
    errorLocation: null,
    errorRateType: null,
    errorRateAmount: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorTypes = async () => {
      try {
        const res = await axios.get(
          constants.API_BASE_URL + constants.VENDOR_TYPES_LIST
        );
        setVendorTypes(res.data || []);
        const cookingType = (res.data || []).find(
          (t) => t.code === COOKING_VENDOR_CODE
        );
        if (cookingType) {
          setVendorTypeId(cookingType.id);
        }
      } catch (e) {
        // silently ignore; form can still submit with code
      }
    };
    fetchVendorTypes();
  }, []);

  const resetError = (field) => {
    setError((prev) => ({ ...prev, [field]: null }));
  };

  const saveVendor = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!name) {
        setLoading(false);
        setError((prev) => ({ ...prev, errorName: "Please enter the name" }));
      } else if (!email) {
        setLoading(false);
        setError((prev) => ({ ...prev, errorEmail: "Please enter the email" }));
      } else if (!password) {
        setLoading(false);
        setError((prev) => ({
          ...prev,
          errorPassword: "Please enter the password",
        }));
      } else if (!confPassword) {
        setLoading(false);
        setError((prev) => ({
          ...prev,
          errorCnfPassword: "Please enter the confirm password",
        }));
      } else if (password !== confPassword) {
        setLoading(false);
        setError((prev) => ({
          ...prev,
          errorCnfPassword: "Password not match",
        }));
      } else if (!location) {
        setLoading(false);
        setError((prev) => ({
          ...prev,
          errorLocation: "Please enter the location",
        }));
      } else if (!rateType) {
        setLoading(false);
        setError((prev) => ({
          ...prev,
          errorRateType: "Please select rate type",
        }));
      } else if (!rateAmount || Number(rateAmount) <= 0) {
        setLoading(false);
        setError((prev) => ({
          ...prev,
          errorRateAmount: "Please enter valid rate amount",
        }));
      } else {
        await axios
          .post(constants.API_BASE_URL + constants.VENDORS, {
            name,
            email,
            password,
            confPassword,
            vendorTypeCode: COOKING_VENDOR_CODE,
            vendorTypeId,
            location,
            availableTimeSlots,
            cookingDescription,
            rateType,
            rateAmount,
            currency,
          })
          .then((res) => {
            setLoading(false);
            toast.success("Cooking vendor created successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
            navigate("/admin/users");
          })
          .catch((err) => {
            setLoading(false);
            setMsg(err?.response?.data?.msg);
            toast.error(err?.response?.data?.msg, {
              position: toast.POSITION.TOP_RIGHT,
            });
          });
      }
    } catch (error) {
      if (error.response) {
        setLoading(false);
        setMsg(error.response.data.msg);
      }
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div>
      <h1 className="title">Vendors</h1>
      <h2 className="subtitle">Add Cooking Vendor</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {isLoading && <Loader />}
            <form onSubmit={saveVendor}>
              <p className="has-text-centered" style={{ color: "red" }}>
                {msg}
              </p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      resetError("errorName");
                    }}
                    placeholder="Vendor name"
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      resetError("errorEmail");
                    }}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      resetError("errorPassword");
                    }}
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
                    onChange={(e) => {
                      setConfPassword(e.target.value);
                      resetError("errorCnfPassword");
                    }}
                    placeholder="******"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorCnfPassword}</p>
              </div>
              <div className="field">
                <label className="label">Vendor Type</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value="Cooking Vendor"
                    // disabled
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Location</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      resetError("errorLocation");
                    }}
                    placeholder="Location"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorLocation}</p>
              </div>
              <div className="field">
                <label className="label">Available Time Slots</label>
                <div className="control">
                  <textarea
                    className="input"
                    value={availableTimeSlots}
                    onChange={(e) => setAvailableTimeSlots(e.target.value)}
                    placeholder="e.g. 09:00-12:00, 18:00-21:00"
                    style={{ height: "80px", overflow: "auto" }}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">What you cook (shown to customers)</label>
                <div className="control">
                  <textarea
                    className="input"
                    value={cookingDescription}
                    onChange={(e) => setCookingDescription(e.target.value)}
                    placeholder="Describe cuisines, dishes, or specialties"
                    style={{ height: "100px", overflow: "auto" }}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Rate Type</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={rateType}
                      onChange={(e) => {
                        setRateType(e.target.value);
                        resetError("errorRateType");
                      }}
                    >
                      <option value="per_hour">Per hour</option>
                      <option value="per_order">Per order</option>
                    </select>
                  </div>
                </div>
                <p style={{ color: "red" }}>{error.errorRateType}</p>
              </div>
              <div className="field">
                <label className="label">Rate Amount</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={rateAmount}
                    onChange={(e) => {
                      setRateAmount(e.target.value);
                      resetError("errorRateAmount");
                    }}
                    placeholder="Amount"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorRateAmount}</p>
              </div>
              <div className="field">
                <label className="label">Currency</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="Currency (e.g. INR)"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-1">
                  <div className="flex-end">
                    <div className="control">
                      <button
                        type="button"
                        className="button is-dark"
                        onClick={goBack}
                      >
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

export default FormAddCookingVendor;

