import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const cookingStepLabel = (s) => {
  if (s === 10) return "Waiting for cooking partner to accept";
  if (s === 11) return "Cooking partner accepted";
  if (s === 12) return "Cooking in progress";
  if (s === 13) return "Cooking finished — you can accept this order";
  return null;
};
import Loader from "../util/Loader/Loader";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import constants from "../util/Constants/constants";
import PlaceHolderImage from '../asset/image/no_image.png'
import image from '../asset/image/imagePlaceholder.png'
import moment from "moment";

const header = [
  "Product Image",
  "Product Name",
  "Quantity",
  "Order Date & Time",
  "Total Price",
]
const FormViewOrder = () => {
  const [orderListData, setOrderList] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [showDeclinePopup, setShowDeclinePopup] = useState(false)
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getOrders();
  }, []);
  const getOrders = async () => {
    setLoading(true)
    const response = await axios.get(constants.API_BASE_URL + constants.ORDER_DETAILS + `/${id}`);
    setOrderList(response.data);
    setLoading(false)
  };
  const updateOrder = async (status) => {
    let params = {
      status: status
    }
    await axios.patch(constants.API_BASE_URL + constants.UPDATE_ORDER + `/${id}`, params
    ).then((res) => {
      setLoading(false)
      toast.success("Successfully Updated", {
        position: toast.POSITION.TOP_RIGHT,
      })
      setLoading(false)
      navigate(user?.role === "admin" ? "/admin/orders" : "/orders");
    }).catch((err) => {
      setLoading(false)
      toast.error(err?.response?.data?.msg, {
        position: toast.POSITION.TOP_RIGHT,
      })
    });
  };

  const markCookingFeeCollected = async () => {
    setLoading(true);
    try {
      await axios.patch(constants.API_BASE_URL + constants.UPDATE_ORDER + `/${id}`, {
        markCookingFeePaid: true,
      });
      toast.success("Cooking fee marked as collected", { position: toast.POSITION.TOP_RIGHT });
      await getOrders();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to update", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  const decline = () => {
    setShowDeclinePopup(true)
  }
  const goBack = () => {
    window.history.back()
  }

  const cookingBlocksAccept =
    orderListData?.cookingVendorId &&
    orderListData?.cookingWorkflowStatus != null &&
    orderListData?.cookingWorkflowStatus !== 13;

  const isStoreFacingVendor =
    user?.role === "admin" ||
    (user?.role === "vendor" && user?.vendorType !== "cooking_vendor");

  const canRecordCookingPayment =
    isStoreFacingVendor && orderListData?.invoice?.balanceDueCooking > 0;

  const escapeHtml = (s) => {
    if (s == null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const downloadInvoice = () => {
    const o = orderListData;
    if (!o?.id) return;
    const inv = o.invoice || {};
    const rows = (o.OrderItems || [])
      .map((item) => {
        const p = item.product || {};
        const name = escapeHtml(p.name || "—");
        const qty = escapeHtml(item.quantity);
        const price = Number(p.price || 0).toFixed(2);
        return `<tr><td>${name}</td><td>${qty}</td><td>₹${price}</td></tr>`;
      })
      .join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Invoice #${escapeHtml(o.id)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;text-align:left}.tot{margin-top:20px}</style></head><body>
<h1>Invoice #${escapeHtml(o.id)}</h1>
<p><strong>Date:</strong> ${escapeHtml(moment(o.createdAt).format("DD/MM/YYYY HH:mm"))}</p>
<p><strong>Customer:</strong> ${escapeHtml(o.user?.name)}<br/>Email: ${escapeHtml(o.user?.email)}<br/>Phone: ${escapeHtml(o.user?.phone || "—")}</p>
<p><strong>Address:</strong> ${escapeHtml(o.address)}</p>
${o.cookingVendor ? `<p><strong>Cooking partner:</strong> ${escapeHtml(o.cookingVendor.name)}</p>` : ""}
<h2>Line items</h2>
<table><thead><tr><th>Product</th><th>Qty</th><th>Unit price</th></tr></thead><tbody>${rows || "<tr><td colspan='3'>No items</td></tr>"}</tbody></table>
<div class="tot">
<p>Product subtotal (ex. tax): ₹${Number(inv.productSubtotalExTax || 0).toFixed(2)}</p>
<p>Tax: ₹${Number(inv.taxAmount || 0).toFixed(2)}</p>
<p><strong>Products total:</strong> ₹${Number(inv.productsAndTaxTotal || 0).toFixed(2)}</p>
<p>Cooking service fee: ₹${Number(inv.cookingServiceFee || 0).toFixed(2)}</p>
<p>Cooking fee status: ${inv.cookingFeePaid ? "Paid" : "Due when food is ready"}</p>
<p><strong>Grand total:</strong> ₹${Number(inv.grandTotal || 0).toFixed(2)}</p>
</div>
</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-order-${o.id}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded (open in browser or print to PDF)", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <div>
      <h1 className="title">Orders</h1>
      <h2 className="subtitle">Update Order</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            {
              isLoading && (<Loader />)
            }
            <div className="row">
              <div className="col-md-12 col-lg-4 popup_left">
                <div className="card popup_left_card">
                  <p className="">Customer Name:<label className="customer_info">{orderListData?.user?.name ? orderListData?.user?.name : "-"}</label></p>
                  <p className="">Phone:<label className="customer_info">{orderListData?.user?.phone ? orderListData?.user?.phone : "-"}</label></p>
                  <p className="">Email:<label className="customer_info">{orderListData?.user?.email ? orderListData?.user?.email : "-"}</label></p>
                  <p className="">Address:<label className="customer_info">{orderListData?.address ? orderListData?.address : "-"}</label></p>
                  {orderListData?.cookingVendor && (
                    <p className="">
                      Cooking partner:
                      <label className="customer_info d-block">{orderListData.cookingVendor.name}</label>
                      {orderListData.cookingVendor.cookingDescription && (
                        <span className="is-size-7">{orderListData.cookingVendor.cookingDescription}</span>
                      )}
                    </p>
                  )}
                  {cookingStepLabel(orderListData?.cookingWorkflowStatus) && (
                    <p className="notification is-info is-light mt-2">
                      {cookingStepLabel(orderListData?.cookingWorkflowStatus)}
                    </p>
                  )}
                </div>
                <br />
                {isStoreFacingVendor && (
                <div className="">
                  <div className="d-flex">
                    {orderListData?.status === 1 ?
                      <>
                        <div className="">
                          <button className="decline_btn" disabled={orderListData?.status == 2 || orderListData?.status == 3} onClick={() => updateOrder(3)}><i className="bi bi-x decline_icon"></i>Decline</button>
                        </div>
                        <div className="">
                          <button
                            className="accept_btn ms-3"
                            disabled={
                              orderListData?.status == 2 ||
                              orderListData?.status == 3 ||
                              cookingBlocksAccept
                            }
                            onClick={() => updateOrder(2)}
                            title={cookingBlocksAccept ? "Wait for cooking partner to complete" : ""}
                          >
                            <i className="bi bi-check-lg accept_icon"></i>Accept
                          </button>
                        </div>
                      </> : orderListData?.status === 2 ?
                        <div className="">
                          <button className="accept_btn ms-3" disabled={orderListData?.status == 2 || orderListData?.status == 3} onClick={() => updateOrder(2)}><i className="bi bi-check-lg accept_icon"></i>Accepted</button>
                        </div> :
                        <div className="">
                          <button className="decline_btn" disabled={orderListData?.status == 2 || orderListData?.status == 3} onClick={() => updateOrder(3)}><i className="bi bi-x decline_icon"></i>Declined</button>
                        </div>
                    }
                  </div>
                  <br />
                  <>
                    <div className="d-flex">
                      <button className="button is-dark" onClick={() => goBack()}>
                        Back
                      </button>
                    </div>
                  </>
                  {canRecordCookingPayment && (
                    <div className="mt-3">
                      <button type="button" className="button is-warning is-small" onClick={markCookingFeeCollected}>
                        Record cooking fee collected (COD / cash)
                      </button>
                      <p className="is-size-7 mt-1">Customer pays the cooking balance when food is ready; use this after you collect it.</p>
                    </div>
                  )}
                </div>
                )}
              </div>
              <div className="col-md-12 col-lg-8 popup_right">
                {orderListData?.invoice && (
                  <div className="card mb-3">
                    <div className="card-content">
                      <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
                        <p className="title is-6 mb-0">Invoice</p>
                        <button type="button" className="button is-small is-link" onClick={downloadInvoice}>
                          Download invoice
                        </button>
                      </div>
                      <p>Product subtotal (ex. tax): ₹{Number(orderListData.invoice.productSubtotalExTax || 0).toFixed(2)}</p>
                      <p>Tax: ₹{Number(orderListData.invoice.taxAmount || 0).toFixed(2)}</p>
                      <p>
                        <strong>Products total (paid at checkout / COD for products):</strong> ₹
                        {Number(orderListData.invoice.productsAndTaxTotal || 0).toFixed(2)}
                      </p>
                      <p>Cooking service fee: ₹{Number(orderListData.invoice.cookingServiceFee || 0).toFixed(2)}</p>
                      <p>
                        Cooking fee status:{" "}
                        {orderListData.invoice.cookingFeePaid ? (
                          <span className="has-text-success">Paid</span>
                        ) : (
                          <span className="has-text-warning">Due when food is ready</span>
                        )}
                      </p>
                      <p>
                        <strong>Grand total:</strong> ₹{Number(orderListData.invoice.grandTotal || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="card">
                  <div className="card-body">
                    <div className="table_contents popup_table">
                      <table className="table table-responsive table-condensed">
                        <thead>
                          <tr>
                            {header &&
                              header?.map((elements, index) => (
                                <th key={index} scope="col" >
                                  {elements}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (orderListData?.OrderItems && orderListData?.OrderItems?.length > 0) ? orderListData?.OrderItems?.map((obj, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <img style={{ width: '88px', height: '88px' }} src={obj?.product?.image ? obj?.product?.image : image} alt="Product" />
                                  </td>
                                  <td>{obj?.product?.name}</td>
                                  <td>{obj?.quantity}</td>
                                  <td>{moment(obj?.createdAt).format("DD/MM/YYYY hh:mm:ss:A")}</td>
                                  <td>₹{obj?.product?.price?.toFixed(2)}</td>
                                </tr>
                              )
                            }) : ""
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer-item item_total_tax">
                    <div className="popup_footer_content">
                      <p className="popup_footer_text">Items Total: <span className="popup_footer_subtext">₹{orderListData?.totalAmount?.toFixed(2)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormViewOrder;
