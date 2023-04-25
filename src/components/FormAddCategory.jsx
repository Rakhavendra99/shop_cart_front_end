import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PlaceHolderImage from '../asset/image/no_image.png'
import { convertToBase64 } from "../util";
import constants from "../util/Constants/constants";
const FormAddCategory = () => {
  const [name, setName] = useState("");
  const [image, setCategoryImage] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false)
  const [isClickableImage, setClickImage] = useState(false)
  const [error, setError] = useState({ errorName: null, errorImage: null })
  const saveCategory = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      if (!name) {
        setLoading(false)
        setError({ errorName: "Please Enter the Category Name" })
      } else if (!image) {
        setLoading(false)
        setError({ errorImage: "Please Select the Category Image" })
      } else {
        await axios.post(constants.API_BASE_URL + constants.ADD_CATEGORY, {
          name: name,
          image: image,
        }).then((res) => {
          console.log("res", res)
          setLoading(false)
          if (user?.role === "admin") {
            navigate("/admin/category");
          } else {
            navigate("/category");
          }
          toast.success("Successfully Added", {
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
        setMsg(error?.response?.data?.msg);
      }
    }
  };
  const onChangeCategoryName = (e) => {
    setName(e?.target?.value)
    setError({ errorName: null })
  }
  const onChangeProductPrice = (e) => {
    setCategoryImage(e.target.value)
    setError({ errorImage: null })
  }
  const uploadProductImage = async (e) => {
    setLoading(true)
    setError({ errorImage: null })
    e.preventDefault();
    let file = e.target.files[0];
    if (typeof file !== "undefined") {
      let imageBase64 = await convertToBase64(file)
      setCategoryImage(imageBase64)
      setClickImage(true)
      setLoading(false)
    } else {
      setClickImage(true)
      setLoading(false)
    }
  }
  const removeCategoryImage = async (value) => {
    setLoading(true)
    setCategoryImage("")
    document.getElementById('exampleFormControlFile1').value = "";
    setLoading(false)
  }
  const goBack = () => {
    window.history.back()
  }
  return (
    <div>
      <h1 className="title">Categorys</h1>
      <h2 className="subtitle">Add New Category</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }

            <form onSubmit={saveCategory}>
              <p className="has-text-centered" style={{ color: "red" }}>{msg}</p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => onChangeCategoryName(e)}
                    placeholder="Category Name"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorName}</p>
              </div>
              <div className="field">
                <label className="label">Image</label>
                <div className="img-wraps">
                  <img style={{ width: '48px', height: '48px', marginBottom: '4px' }} alt="Product" src={image ? image : (PlaceHolderImage)} />
                  {image &&
                    <span className="closes" title="Delete"
                      onClick={() => removeCategoryImage()}
                    >×</span>
                  }
                </div>
                <input
                  type="file"
                  className="form-control-file"
                  onChange={(e) => uploadProductImage(e)}
                  placeholder="Select Category"
                  accept="image/*"
                  id="exampleFormControlFile1"
                />
                <p style={{ color: "red" }}>{error.errorImage}</p>
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

export default FormAddCategory;
