import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import { convertToBase64, onlyNumbersRegex, validateEmail } from "../util";
import PlaceHolderImage from '../asset/image/no_image.png'
const FormEditStore = () => {
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [GSTIN, setGSTIN] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [image, setStoreImage] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState({ errorName: null, errorEmail: null, errorStoreAddress: null, errorGSTIN: null, errorRegisterNumber: null, errorImage: null, errorDescription: null })
  const { id } = useParams();

  useEffect(() => {
    const getStoreById = async () => {
      setLoading(true)
      try {
        const response = await axios.get(constants.API_BASE_URL + constants.STORE_DETAILS + `/${id}`);
        setStoreName(response?.data?.name);
        setAddress(response?.data?.address);
        setGSTIN(response?.data?.gstIn)
        setRegisterNumber(response?.data?.registerNumber)
        setDescription(response?.data?.description)
        setStoreImage(response?.data?.image)
        setEmail(response?.data?.email)
        setLoading(false)
      } catch (error) {
        if (error.response) {
          setLoading(false)
          setMsg(error.response.data.msg);
        }
      }
    };
    getStoreById();
  }, [id]);
  const updateStore = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      if (!storeName) {
        setLoading(false)
        setError({ errorName: "Please Enter the Store Name" })
      } else if (!email) {
        setLoading(false)
        setError({ errorEmail: "Please Enter the Store email" })
      } else if (!validateEmail(email)) {
        setLoading(false)
        setError({ errorEmail: "Please Enter the Valid Email" })
      } else if (!address) {
        setLoading(false)
        setError({ errorStoreAddress: "Please Enter the Store Address" })
      } else if (!GSTIN) {
        setLoading(false)
        setError({ errorGSTIN: "Please Enter the GST IN Number" })
      } else if (!onlyNumbersRegex.test(GSTIN)) {
        setLoading(false)
        setError({ errorGSTIN: "Accept only Number Fields." })
      } else if (!registerNumber) {
        setLoading(false)
        setError({ errorRegisterNumber: "Please Enter the register number" })
      } else if (!onlyNumbersRegex.test(registerNumber)) {
        setLoading(false)
        setError({ errorGSTIN: "Accept only Number Fields." })
      } else if (!image) {
        setLoading(false)
        setError({ errorImage: "Please Select the Store Image" })
      } else if (!description) {
        setLoading(false)
        setError({ errorDescription: "Please Enter description" })
      } else {
        await axios.patch(constants.API_BASE_URL + constants.UPDATE_STORE + `/${id}`, {
          name: storeName,
          address: address,
          image: image,
          email: email,
          gstIn: GSTIN,
          registerNumber: registerNumber,
          description: description,
          openTime: "09:00",
          closeTime: "20:00"
        }).then((res) => {
          setLoading(false)
          if (user?.role === "admin") {
            navigate("/admin/stores");
          } else {
            navigate("/stores");
          }
          toast.success("Successfully Updated", {
            position: toast.POSITION.TOP_RIGHT,
          })
        }).catch((err) => {
          setLoading(false)
          toast.error(err?.response?.data?.msg, {
            position: toast.POSITION.TOP_RIGHT,
          })
        });

      }
    } catch (error) {
      if (error.response) {
        setLoading(false)
        setMsg(error.response.data.msg);
      }
    }
  };
  const onChangeStoreName = (e) => {
    setStoreName(e.target.value)
    setError({ errorName: null })
  }
  const onChangeStoreEmail = (e) => {
    setEmail(e.target.value)
    setError({ errorEmail: null })
  }
  const onChangeStoreAddress = (e) => {
    setAddress(e.target.value)
    setError({ errorStoreAddress: null })
  }
  const onChangeGSTIN = (e) => {
    setGSTIN(e.target.value)
    setError({ errorGSTIN: null })
  }
  const onChangeRegisterNumber = (e) => {
    setRegisterNumber(e.target.value)
    setError({ errorRegisterNumber: null })
  }
  const onChangeDescription = (e) => {
    setDescription(e.target.value)
    setError({ errorDescription: null })
  }
  const uploadStoreImage = async (e) => {
    setLoading(true)
    setError({ errorImage: null })
    e.preventDefault();
    let file = e.target.files[0];
    if (typeof file !== "undefined") {
      let imageBase64 = await convertToBase64(file)
      setStoreImage(imageBase64)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }
  const removeStoreImage = async (value) => {
    setLoading(true)
    setStoreImage("")
    document.getElementById('exampleFormControlFile1').value = "";
    setLoading(false)
  }
  const goBack = () => {
    window.history.back()
  }
  return (
    <div>
      <h1 className="title">Stores</h1>
      <h2 className="subtitle">Edit Store</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }
            <form onSubmit={updateStore}>
              <p className="has-text-centered" style={{ color: "red" }}>{msg}</p>
              <div className="field">
                <label className="label">Store Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={storeName}
                    onChange={(e) => onChangeStoreName(e)}
                    placeholder="Enter Store Name"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorName}</p>
              </div>
              <div className="field">
                <label className="label">Store Email</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={email}
                    onChange={(e) => onChangeStoreEmail(e)}
                    placeholder="Enter Store email"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorEmail}</p>
              </div>
              <div className="field">
                <label className="label">Store Address</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={address}
                    onChange={(e) => onChangeStoreAddress(e)}
                    placeholder="Enter Store Address"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorStoreAddress}</p>
              </div>
              <div className="field">
                <label className="label">GST IN Number</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={GSTIN}
                    maxLength='12'
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    onChange={(e) => onChangeGSTIN(e)}
                    placeholder="Enter Store GST IN Number"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorGSTIN}</p>
              </div>
              <div className="field">
                <label className="label">Register Number</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={registerNumber}
                    maxLength="12"
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    onChange={(e) => onChangeRegisterNumber(e)}
                    placeholder="Enter Store Register Number"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorRegisterNumber}</p>
              </div>
              <div className="field">
                <label className="label">Store Image</label>
                <div className="img-wraps">
                  <img style={{ width: '48px', height: '48px', marginBottom: '4px' }} alt="Store" src={image ? image : (PlaceHolderImage)} />
                  {image &&
                    <span className="closes" title="Delete"
                      onClick={() => removeStoreImage()}
                    >×</span>
                  }
                </div>
                <input
                  type="file"
                  className="form-control-file"
                  onChange={(e) => uploadStoreImage(e)}
                  placeholder="Select Store image"
                  accept="image/*"
                  id="exampleFormControlFile1"
                />
                <p style={{ color: "red" }}>{error.errorImage}</p>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="input"
                    value={description}
                    onChange={(e) => onChangeDescription(e)}
                    placeholder="Enter Description"
                    style={{ height: "95px", overflow: "auto" }}
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorDescription}</p>
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
                      <button type="submit" className="button is-success">
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

export default FormEditStore;
