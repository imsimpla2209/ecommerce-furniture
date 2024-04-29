/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, updateOrderStatus } from "../../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { authService } from "features/customer/user/authService";
import { formatCurrencyVND } from "utils/formator";
import authSlice from "features/customer/user/authSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Order By",
    dataIndex: "user",
    sorter: (a, b) => a.user.length - b.user.length,
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Date",
    dataIndex: "date",
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    sorter: (a, b) => a.total - b.total,

  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Order = () => {
  const dispatch = useDispatch();
  const [ordersState, setOrdersState] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const order = await authService.getFullOrder()
        setOrdersState(order)
      } catch (error) {

      }
    })()
  }, [refresh]);
  console.log(ordersState)
  const [selectedStatus, setSelectedStatus] = useState({});
  const updateOrder = async (orderId, selectedStatus) => {
    try {
      let isDeliveredValue = false;

      if (selectedStatus === "Delivered") {
        isDeliveredValue = true;
      }
      await authService.changeOrderStatus({
        orderId,
        status: selectedStatus,
      })
      setRefresh((prev) => !prev);
    } catch (error) {

    }
  };
  const data1 = [];
  for (let i = 0; i < ordersState?.length; i++) {
    const currentStatus = ordersState[i]?.orderStatus;

    data1.push({
      key: i + 1,
      product: (
        <Link to={`/admin/order/${ordersState[i].orderId}`}>View Orders</Link>
      ),
      amount: formatCurrencyVND(ordersState[i]?.total),
      date: new Date(ordersState[i]?.orderDate).toLocaleString(),
      ...ordersState[i],
      action: (
        <>
          <select
            name=""
            defaultValue={ordersState[i]?.orderStatus}
            onChange={(e) => {
              setSelectedStatus((prev) => ({
                ...prev,
                [ordersState[i]?.orderId]: e.target.value,
              }));
              updateOrder(ordersState[i]?.orderId, e.target.value);
            }}
            className="form-control form-select"
            disabled={currentStatus === 'Delivered' || currentStatus === 'Canceled'}
          >
            <option value="Pending" selected>Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivering">Delivering</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>

          </select>
        </>
      ),
    });
  }
  return (
    <div >
      <h3 className="mb-4 title">Orders List</h3>
      <Table columns={columns} dataSource={data1} />
    </div>
  );
};
export default Order;
