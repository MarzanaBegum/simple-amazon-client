import React, { useContext, useEffect } from "react";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import { useForm } from "react-hook-form";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

type InputFieldType = {
  fullName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
};

export default function ShippingScreen() {
  const { state, dispatch } = useContext(Store);
  const { shippingAddress } = state.cart;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("city", shippingAddress.city);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const onSubmit = async (formData: InputFieldType) => {
    dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: formData });
    Cookies.set(
      "cart",
      JSON.stringify({ ...state.cart, shippingAddress: formData })
    );
    router.push("/payment");
  };
  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-md mx-auto mb-[70px]"
      >
        <h2 className="mb-4 text-xl">Shipping Address</h2>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            {...register("fullName", {
              required: "Please Enter your fullName",
            })}
            id="fullName"
            className="w-full"
            autoFocus
          />
          {errors.fullName && (
            <span className="text-red-500">
              {errors.fullName.message.toString()}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            {...register("address", {
              required: "Please enter address",
              minLength: {
                value: 3,
                message: "Address is more than 3 characters",
              },
            })}
            id="address"
            className="w-full"
          />
          {errors.address && (
            <span className="text-red-500">
              {errors.address.message.toString()}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            {...register("city", {
              required: "Please enter city",
            })}
            id="city"
            className="w-full"
          />
          {errors.city && (
            <span className="text-red-500">
              {errors.city.message.toString()}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            {...register("postalCode", {
              required: "Please enter postalCode",
            })}
            id="postalCode"
            className="w-full"
          />
          {errors.postalCode && (
            <span className="text-red-500">
              {errors.postalCode.message.toString()}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            {...register("country", {
              required: "Please enter country name",
            })}
            id="country"
            className="w-full"
          />
          {errors.country && (
            <span className="text-red-500">
              {errors.country.message.toString()}
            </span>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button" type="submit">
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
