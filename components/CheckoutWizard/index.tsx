import React from "react";

const TitleList = [
  "User Login",
  "Shipping Address",
  "Payment Method",
  "Place Order",
];
const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <div className="flex flex-wrap mb-9">
      {TitleList.map((step: string, i: number) => (
        <div
          key={i}
          className={`flex-1 border-b-2 text-center ${
            i <= activeStep ? "border-b-indigo-500 text-indigo-500" : "border-b-gray-300"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default CheckoutWizard;
