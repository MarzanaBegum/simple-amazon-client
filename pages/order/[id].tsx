import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { api } from "../api";
import { getError } from "../../utils/error";
import Link from "next/link";
import Image from "next/image";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
} from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    default:
      return state;
  }
};
function OrderDetailScreen({ order, loading, error }) {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter();
  const orderId = query.id;
  const [
    {
      loading: fetchLoading,
      error: fetchError,
      order: fetchedOrder,
      loadingPay,
      successPay,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading,
    order,
    error,
  });
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = fetchedOrder;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await api.get(`/order/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay]);

  const createOrder = async (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await api.put(`/order/${orderId}/pay`, details);
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order paid successfully");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  };

  const onError = (error) => {
    toast.error(getError(error));
  };
  return (
    <Layout title={`Order ${orderId}`}>
      <h2 className="text-lg mb-[10px]">Order Details</h2>
      {fetchLoading ? (
        <div>Loading...</div>
      ) : fetchError ? (
        <div className="text-red-700">{fetchError}</div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="p-5 card">
              <h2 className="text-lg mb-[10px]">Shipping Address</h2>
              {shippingAddress?.fullName},{shippingAddress?.address},
              {shippingAddress?.postalCode},{shippingAddress?.city},
              {shippingAddress?.country}
              <div className="mt-[10px]"></div>
              {isDelivered ? (
                <div className="w-full p-3 text-green-700 bg-green-100 rounded-lg">
                  Delivered at {deliveredAt.substring(0,10)}
                </div>
              ) : (
                <div className="w-full p-3 text-red-700 bg-red-100 rounded-lg">
                  Not Delivered
                </div>
              )}
            </div>
            <div className="p-5 card">
              <h2 className="text-lg mb-[10px]">Payment Method</h2>
              <h3>{paymentMethod}</h3>
              <div className="mt-[10px]"></div>
              {isPaid ? (
                <div className="w-full p-3 text-green-700 bg-green-100 rounded-lg">
                  Paid at {paidAt.substring(0,10)}
                </div>
              ) : (
                <div className="w-full p-3 text-red-700 bg-red-100 rounded-lg">
                  Not paid
                </div>
              )}
            </div>
            <div className="p-5 overflow-x-auto card">
              <h2 className="text-lg mb-[10px]">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems?.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <div className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.name}
                          </div>
                        </Link>
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="p-5 card">
              <h2 className="text-lg mb-[10px]">Order Summary</h2>
              <ul>
                <li>
                  <div className="flex justify-between mb-2">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-2">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-2">
                    <div>Shipping Price</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-2">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="w-full">
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    )}
                    {loadingPay && <div>Loading...</div>}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderDetailScreen.auth = true;
export default OrderDetailScreen;

export async function getServerSideProps({ params }) {
  try {
    const { data } = await api.get(`/order/${params.id}`);
    return {
      props: {
        order: data,
        loading: false,
        error: "",
      },
    };
  } catch (err) {
    return {
      props: {
        order: {},
        loading: false,
        error: getError(err),
      },
    };
  }
}
