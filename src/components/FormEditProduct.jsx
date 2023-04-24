import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../util/Loader/Loader";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import { convertToBase64 } from "../util";
import PlaceHolderImage from '../asset/image/no_image.png'
const FormEditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [GST, setGST] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [image, setProductImage] = useState("");
  const [description, setDescription] = useState("");
  const [productCategory, setProductCategory] = useState(false)
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState({ errorCategory: null, errorName: null, errorPrice: null, errorGST: null, errorAvailableQuantity: null, errorImage: null, errorDescription: null })

  useEffect(() => {
    const getProductById = async () => {
      setLoading(true)
      try {
        const response = await axios.get(constants.API_BASE_URL + constants.PRODUCT_DETAILS + `/${id}`);
        setName(response?.data?.name);
        setPrice(response?.data?.price);
        setAvailableQuantity(response?.data?.availableQuantity)
        setCategoryId(response?.data?.categoryId)
        setDescription(response?.data?.description)
        setProductImage(response?.data?.image)
        setGST(response?.data?.gst)
        setLoading(false)
      } catch (error) {
        if (error.response) {
          setLoading(false)
          setMsg(error.response.data.msg);
        }
      }
    };
    getProductById();
    getProductCategoryList()
  }, [id]);
  const getProductCategoryList = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.PRODUCT_CATEGORY_LIST);
    setProductCategory(response.data);
    setLoading(false)
  };
  const updateProduct = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      if (!categoryId) {
        setLoading(false)
        setError({ errorCategory: "Please Select Category" })
      } else if (!name) {
        setLoading(false)
        setError({ errorName: "Please Enter the Product Name" })
      } else if (!price) {
        setLoading(false)
        setError({ errorPrice: "Please Enter the Product Price" })
      } else if (!GST) {
        setLoading(false)
        setError({ errorGST: "Please Enter the GST" })
      } else if (!availableQuantity) {
        setLoading(false)
        setError({ errorAvailableQuantity: "Please Enter the available quantity" })
      } else if (!image) {
        setLoading(false)
        setError({ errorImage: "Please Select the product Image" })
      } else if (!description) {
        setLoading(false)
        setError({ errorDescription: "Please Enter description" })
      } else {
        await axios.patch(constants.API_BASE_URL + constants.UPDATE_PRODUCT + `/${id}`, {
          name: name,
          price: price,
          gst: GST,
          image: image,
          availableQuantity: availableQuantity,
          description: description,
          categoryId: categoryId
        }).then((res) => {
          setLoading(false)
          toast.success("Successfully Updated", {
            position: toast.POSITION.TOP_RIGHT,
          })
          if (user?.role === "admin") {
            navigate("/admin/products");
          } else {
            navigate("/products");
          }
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
  const handleProductCategoryChange = (e) => {
    setCategoryId(e.target.value)
    setError({ errorCategory: null })
  }
  const onChangeProductName = (e) => {
    setName(e.target.value)
    setError({ errorName: null })
  }
  const onChangeProductPrice = (e) => {
    setPrice(e.target.value)
    setError({ errorPrice: null })
  }
  const onChangeGST = (e) => {
    setGST(e.target.value)
    setError({ errorGST: null })
  }
  const onChangeAvailableQuantity = (e) => {
    setAvailableQuantity(e.target.value)
    setError({ errorAvailableQuantity: null })
  }
  const onChangeDescription = (e) => {
    setDescription(e.target.value)
    setError({ errorDescription: null })
  }
  const uploadProductImage = async (e) => {
    setLoading(true)
    setError({ errorImage: null })
    e.preventDefault();
    let file = e.target.files[0];
    if (typeof file !== "undefined") {
      let imageBase64 = await convertToBase64(file)
      setProductImage(imageBase64)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }
  const removeCategoryImage = async (value) => {
    setLoading(true)
    setProductImage("")
    document.getElementById('exampleFormControlFile1').value = "";
    setLoading(false)
  }
  const goBack = () => {
    window.history.back()
  }
  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">Edit Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }
            <form onSubmit={updateProduct}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Category</label>
                <div className="control">
                  <select className="custom-select pointer-hover" id="inputGroupSelect01"
                    value={categoryId}
                    onChange={(event) => { handleProductCategoryChange(event) }}
                    disabled={id ? true : false}
                  >
                    <option hidden>Select Category</option>
                    {productCategory && productCategory?.map((category, index) => {
                      return (
                        <option key={index}
                          value={category?.id}
                        >#{category?.id} - {category?.name}</option>
                      )
                    })}
                  </select>
                </div>
                <p style={{ color: "red" }}>{error.errorCategory}</p>
              </div>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => onChangeProductName(e)}
                    placeholder="Enter Product Name"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorName}</p>
              </div>
              <div className="field">
                <label className="label">Price</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={price}
                    maxLength="7"
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    onChange={(e) => onChangeProductPrice(e)}
                    placeholder="Enter Product Price"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorPrice}</p>
              </div>
              <div className="field">
                <label className="label">GST (%)</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={GST}
                    maxLength='5'
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    onChange={(e) => onChangeGST(e)}
                    placeholder="Enter Product GST"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorGST}</p>
              </div>
              <div className="field">
                <label className="label">Available Quantity</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={availableQuantity}
                    maxLength="7"
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    onChange={(e) => onChangeAvailableQuantity(e)}
                    placeholder="Enter Available Quantity"
                  />
                </div>
                <p style={{ color: "red" }}>{error.errorAvailableQuantity}</p>
              </div>
              <div className="field">
                <label className="label">Product Image</label>
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
                  placeholder="Select Product"
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

export default FormEditProduct;
