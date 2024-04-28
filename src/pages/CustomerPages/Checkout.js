/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import { object, string } from "yup";
import * as authService from "../../features/customer/user/authService";
import {
  createAnOrder,
  emptyUserCart,
  getAUser,
  resetState,
} from "../../features/customer/user/authSlice";
import { formatCurrencyVND } from "utils/formator";
import { Button, Select } from "antd";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


const PAY_ON_DELIVERY = "Pay on delivery"
const PAYPAL = "PayPal"
const Checkout = () => {
  const shippingSchema = object({
    address: string().required("Address is required"),
    note: string().required("note is required"),
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.auth.cartProducts);
  const [payment, setPayment] = useState(PAY_ON_DELIVERY);
  const [sdkReady, setSdkReady] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [cartProduct, setCartProduct] = useState(null);
  const location = useLocation();
  const userState = useSelector((state) => state?.auth?.info?.getaUser);
  const getUsertId = location.pathname.split("/")[2];
  const totalAmountWithShipping = totalAmount !== null ? totalAmount + 5 : 5;
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getUser();
    (async () => {
      try {
        const order = await authService.getOrder()
        setOrder(order)
      } catch (error) {

      }
    })();
  }, []);
  const getUser = () => {
    dispatch(getAUser(getUsertId));
  };

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotalAmount(sum);
    }
  }, [cartState]);

  useEffect(() => {
    let items = [];
    for (let index = 0; index < cartState?.length; index++) {
      items.push({
        product: cartState[index].modelId.modelId,
        quantity: cartState[index].quantity,
        price: cartState[index]?.modelId?.price,
      });
    }
    setCartProduct(items);
  }, []);

  // useEffect(() => {
  //   if (!cartState || cartState.length === 0) {
  //     navigate("/product");
  //   }
  // }, [cartState, navigate]);

  const handleFormDisabled = () => {
    setIsFormDisabled(true);
  };

  const handleReset = () => {
    formik.setValues({
      ...formik.values,
      note: "",
      address: "",
    });
    setIsFormDisabled(false);
    setShippingInfo(null);
  };

  const addPaypalScript = async () => {
    try {
      const { data } = await authService.getConfig();
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.log('err', error)
    }
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: userState?.address || "",
      note: userState?.note || "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      handleFormDisabled();
    },
  });

  const handleDone = () => {
    navigate("/my-orders");
  }

  const onSuccess = (details, data) => {
    try {
      dispatch(
        createAnOrder({
          // totalPrice: totalAmount,
          // totalPriceAfterDiscount: totalAmountWithShipping,
          // orderItems: cartProduct,
          // paymentMethod: payment,
          // shippingInfo: shippingInfo,
          // isPaid: true,
          // cartItemIdList: cartState?.map((item) => item.cartItemId) || [],
          note: formik.values?.address,
          totalCost: order?.totalCost ,
          paymentMethod: payment,
          deliveryAddress: formik.values?.address,
          
        }, setTimeout(navigate("/my-orders"), 500))
      );
    } catch (error) {
      console.error("Error during PayPal success:", error);
    }
  };

  const onSuccessPaypal = async (details, data) => {
    try {
      onSuccess(details, data);
    } catch (error) {
      console.error("Error during PayPal success:", error);
    }
  };

  const handleChangePayMentMethod = (value) => {
    setPayment(value);
  };

  return (
    <>
      <div className="checkout-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-7">
              <div className="checkout-left-data">
                <h3 className="website-name">Đức Anh Store(Kính Nhà Làm)</h3>
                <nav
                  style={{ "--bs-breadcrumb-divider": ">" }}
                  aria-label="breadcrumb"
                >
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/cart" className="text-dark">
                        Cart
                      </Link>
                    </li>
                    &nbsp; /
                    <li className="breadcrumb-item active" arira-current="page">
                      Information
                    </li>
                    &nbsp; /
                    <li className="breadcrumb-item active" arira-current="page">
                      Shipping
                    </li>
                    &nbsp; /
                    <li className='breadcrumb-item active aria-current="page'>
                      Payment
                    </li>
                  </ol>
                </nav>
                <h4 className="title total">Contact Information</h4>
                <p className="user-details">Đức Anh (ducanh2002@gmail.com)</p>

                {/* <div className="w-100">
                  <div className="d-flex justify-content-between align-content-center">
                    <h4 className="mb-3">Shipping Address</h4>
                    <button
                      className="button"
                      type="button"
                      onClick={handleReset}
                    >
                      Reset shipping address
                    </button>
                  </div>
                </div> */}

                <form
                  onSubmit={formik.handleSubmit}
                  action=""
                  className="d-flex gap-15 flex-wrap justify-content-between"
                >

                  <div className="w-100">
                    <input
                      type="text"
                      placeholder="Address"
                      className="form-control"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange("address")}
                      onBlur={formik.handleBlur("address")}
                      disabled={isFormDisabled}
                    />
                    <div className="errors ">
                      {formik.touched.address && formik.errors.address}
                    </div>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      placeholder="note"
                      className="form-control"
                      name="note"
                      value={formik.values.note}
                      onChange={formik.handleChange("note")}
                      onBlur={formik.handleBlur("note")}
                      disabled={isFormDisabled}
                    />
                    <div className="errors ">
                      {formik.touched.note && formik.errors.note}
                    </div>
                  </div>

                  <div className="w-100">
                    <div className="d-flex justify-content-between align-content-center">
                      <Link to="/cart" className="text-dark">
                        <BiArrowBack className="me-2" />
                        Return to Cart
                      </Link>
                      <button className="button" type="submit">
                        Apply information
                      </button>
                    </div>
                  </div>
                  <div></div>
                  <div></div>
                </form>
              </div>
            </div>
            <div className="col-5">
              <div className="border-bottom py-4">
                {cartState &&
                  cartState?.map((items, index) => {
                    return (
                      <div
                        key={index}
                        className="d-flex gap-10 mb-3 align-items-center"
                      >
                        <div className="w-75 d-flex gap-10">
                          <div className="w-25 position-relative ">
                            <span
                              style={{ top: "-10px", right: "2px" }}
                              className="bagde bg-secondary text-white rounded-circle p-2 position-absolute"
                            >
                              {items?.quantity}
                            </span>
                            <img
                              src={items?.modelId?.images?.[0]?.path}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div>
                            <h5 className="title">{items?.modelId?.modelName}</h5>
                            <p></p>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="total-price">
                            {formatCurrencyVND(items?.modelId?.price * items?.quantity)}
                          </h5>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="border-bottom py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 total">SubTotal</p>
                  <p className="mb-0 total-price">
                  {" "}
                  {formatCurrencyVND((order?.totalCost || 0).toFixed(2))}
                  </p>
                </div>
                {/* <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 total">Shipping</p>
                  <p className="mb-0 total-price">50.000đ</p>
                </div> */}
              </div>
              <div className="d-flex justify-content-between align-items-center py-4">
                <h4 className="total">Total</h4>
                <h5 className="total-price">
                  {" "}
                  {formatCurrencyVND((order?.totalCost || 0).toFixed(2))}
                </h5>
              </div>

              {shippingInfo == null ? (
                shippingInfo == null
              ) : (
                <div style={{ width: "320px" }} className="d-flex gap-5">
                  <Select
                    defaultValue={PAY_ON_DELIVERY}
                    style={{ width: 180 }}
                    onChange={handleChangePayMentMethod}
                    options={[
                      { value: PAY_ON_DELIVERY, label: PAY_ON_DELIVERY },
                      { value: PAYPAL, label: PAYPAL },
                    ]}
                  />
                  {
                    payment === PAYPAL ? (
                      <PayPalButton
                        className="button"
                        type="submit"
                        amount={
                          (order?.totalCost || 0).toFixed(2)
                        }
                        onSuccess={onSuccessPaypal}
                      />
                    ) : <Button type="primary" onClick={onSuccess}>Order Now</Button>
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
