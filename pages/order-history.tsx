import React, { useEffect, useReducer } from "react";
import Layout from "../components/Layout";
import { api } from "./api";
import { getError } from "../utils/error";
import Link from "next/link";

const reducer = (state, actions) => {
  switch (actions.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: actions.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: actions.payload };
    default:
      return state;
  }
};

function OrderHistoryScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await api.get("/order/order-history");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title="Order History">
      <h2 className="text-lg">Order History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-700">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="p-5 text-left">DATE</th>
                <th className="p-5 text-left">TOTAL</th>
                <th className="p-5 text-left">PAID</th>
                <th className="p-5 text-left">DELIVERED</th>
                <th className="p-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id} className="border-b">
                  <td className="p-5 text-left">
                    {order._id.substring(20, 24)}
                  </td>
                  <td className="p-5 text-left">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-5 text-left">${order.totalPrice}</td>
                  <td className="p-5 text-left">
                    {order.isPaid ? (
                      <h3 className="text-green-700">
                        {order.paidAt.substring(0, 10)}
                      </h3>
                    ) : (
                      <h3 className="text-red-700">not paid</h3>
                    )}
                  </td>
                  <td className="p-5 text-left">
                    {order.isDelivered ? (
                      <h3>{order.deliveredAt.substring(0, 10)}</h3>
                    ) : (
                      <h3 className="text-red-700">not delivered</h3>
                    )}
                  </td>
                  <td className="p-5 text-left">
                    <Link href={`/order/${order._id}`}>Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
