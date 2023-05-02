import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import PlaceHolderImage from '../asset/image/no_image.png'
import { convertToBase64 } from "../util";
const FormEditCategory = () => {
  const [name, setName] = useState("");
  const [image, setCategoryImage] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState({ errorName: null, errorImage: null })

  useEffect(() => {
    const getCategoryById = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          constants.API_BASE_URL + constants.CATEGORY_DETAILS + `/${id}`
        );
        setName(response?.data?.name);
        setCategoryImage(response?.data?.image);
        setLoading(false)
      } catch (error) {
        if (error?.response) {
          setLoading(false)
          setMsg(error?.response?.data?.msg);
        }
      }
    };
    getCategoryById();
  }, [id]);

  const updateProduct = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      if (!name) {
        setLoading(false)
        setError({ errorName: "Please Enter the Category Name" })
      } else if (!image) {
        setLoading(false)
        setError({ errorImage: "Please Select Category Image" })
      } else {
        await axios.patch(constants.API_BASE_URL + constants.UPDATE_CATEGORY + `/${id}`, {
          name: name,
          image: image,
        }).then((res) => {
          setLoading(false)
          toast.success("Successfully Updated", {
            position: toast.POSITION.TOP_RIGHT,
          })
          if (user?.role === "admin") {
            navigate("/admin/category");
          } else {
            navigate("/category");
          }
        }).catch((err) => {
          setLoading(false)
          toast.error(err?.response?.data?.msg, {
            position: toast.POSITION.TOP_RIGHT,
          })
        });
      }
    } catch (error) {
      if (error?.response) {
        setLoading(false)
        setMsg(error?.response?.data?.msg);
      }
    }
  };
  const onChangeCategoryName = (e) => {
    setName(e.target.value)
    setError({ errorName: null })
  }
  const uploadProductImage = async (e) => {
    setLoading(true)
    setError({ errorImage: null })
    e.preventDefault();
    let file = e.target.files[0];
    if (typeof file !== "undefined") {
      let imageBase64 = await convertToBase64(file)
      setCategoryImage(imageBase64)
      setLoading(false)
    } else {
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
      <h1 className="title">Category</h1>
      <h2 className="subtitle">Edit Category</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }
            <form onSubmit={updateProduct}>
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
                        Update
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

export default FormEditCategory;
