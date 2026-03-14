import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../util/Loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constants from "../util/Constants/constants";

const FormCookingRateSettings = () => {
  const [rateType, setRateType] = useState("per_order");
  const [rateAmount, setRateAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [msg, setMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    errorRateType: null,
    errorRateAmount: null,
  });

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          constants.API_BASE_URL + constants.COOKING_VENDOR_RATE
        );
        if (res.data) {
          if (res.data.rateType) setRateType(res.data.rateType);
          if (res.data.rateAmount) setRateAmount(res.data.rateAmount);
          if (res.data.currency) setCurrency(res.data.currency);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        // if no existing rate, ignore
      }
    };
    fetchRate();
  }, []);

  const resetError = (field) => {
    setError((prev) => ({ ...prev, [field]: null }));
  };

  const saveRate = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!rateType) {
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
          .post(constants.API_BASE_URL + constants.COOKING_VENDOR_RATE, {
            rateType,
            rateAmount,
            currency,
          })
          .then((res) => {
            setLoading(false);
            toast.success("Cooking rate saved", {
              position: toast.POSITION.TOP_RIGHT,
            });
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

  return (
    <div>
      <h1 className="title">Cooking Vendor</h1>
      <h2 className="subtitle">Rate Settings</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {isLoading && <Loader />}
            <form onSubmit={saveRate}>
              <p className="has-text-centered" style={{ color: "red" }}>
                {msg}
              </p>
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
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-dark">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCookingRateSettings;

