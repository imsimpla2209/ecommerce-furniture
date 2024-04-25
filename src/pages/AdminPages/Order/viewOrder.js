/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getOrder } from "../../../features/auth/authSlice";
import { authService } from "features/customer/user/authService";
import { formatCurrencyVND } from "utils/formator";

const ViewOrder = () => {
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];
  const [ordersState, setOrdersState] = useState([]);
  const [orderState, setOrderState] = useState({});
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const order = await authService.getFullOrder()
        setOrdersState(order)
        const orderState = order?.find((item) => item.orderId === Number(orderId));
        setOrderState(orderState);
      } catch (error) {

      }
    })()
  }, []);
  return (
    <div>
      <h3 className="mb-4 title">Đơn Hàng</h3>

      <div className="table-order-detail">
        <table className="m-0 table table-sm">
          <thead>
            <tr className="text-center">
              <th className="w-10 text-start align-middle">Product</th>
              <th className="w-15   align-middle">Unit Price</th>
              <th className="  align-middle">Quantity</th>
              <th className="w-20  align-middle">Total</th>
            </tr>
          </thead>
          <tbody className=" position-relative">
            {orderState?.orderIems?.map((item, index) => {
              return (
                <tr className="" key={index}>
                  <td className="cursor w-50 py-3">
                    <div>
                      <div className="row">
                        <div className="d-flex flex-column align-content-center mt-2 col-10">
                          <div>Model {item?.model}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="align-middle text-center p-2">{formatCurrencyVND(item?.cost || 0)}</td>
                  <td className="align-middle text-center p-2 ">
                    {item?.quanty}
                  </td>
                  <td className="align-middle text-center p-2">
                    {formatCurrencyVND(item?.cost * item?.quanty) || 0}
                  </td>
                </tr>
              );
            })}
            <tr className="">
              <td className="cursor w-50 py-3"></td>
              <td className="align-middle text-center p-2">
                <div className="d-flex flex-column gap-3 text-end text-size-15 fw-light">
                  <span>Total Amount</span>
                  <span>Shipping Fee </span>
                  <span>Status</span>
                </div>
              </td>
              <td className="align-middle text-end p-2 " colSpan="2">
                <div className="d-flex flex-column gap-3">
                  <span>{orderState?.total}</span>
                  <span>5$ (Home Delivery)</span>
                  <span className="text-danger text-size-20 fw-bold">
                    {orderState?.orderStatus}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrder;
