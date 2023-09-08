import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const paymentMethods = ["Paypal", "Stripe", "CashOnDelivery"];

export default function PaymentScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { shippingAddress, paymentMethod } = state.cart;
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<String>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!selectPaymentMethod) {
      return toast.error("Payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({ ...state.cart, paymentMethod: selectPaymentMethod })
    );
    router.push("/place-order");
  };

  useEffect(() => {
    (() => {
      if (!shippingAddress.address) {
        return router.push("/shipping");
      }
    })();
    setSelectPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="max-w-screen-md mx-auto" onSubmit={handleSubmit}>
        <h2 className="mb-4 text-xl">Payment Method</h2>
        {paymentMethods.map((payment: string) => (
          <div key={payment} className="flex items-center gap-2 mb-4">
            <input
              type="radio"
              name="paymentMethod"
              id={payment}
              className="p-2 outline-none focus:ring-0"
              checked={selectPaymentMethod === payment}
              onChange={() => setSelectPaymentMethod(payment)}
            />
            <label htmlFor={payment}>{payment}</label>
          </div>
        ))}
        <div className="flex justify-between mt-6 mb-4">
          <button
            type="button"
            onClick={() => router.push("/shipping")}
            className="default-btn"
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true;
