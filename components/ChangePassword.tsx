import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { api } from "../pages/api";
import { useAtom } from "jotai";
import { USER_STATE } from "../state";

type PasswordType = {
  password: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useAtom(USER_STATE);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData: PasswordType) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.put("/auth/user", {
        password: formData.password,
        email: user.email,
      });
      setLoading(false);
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h1 className="text-xl my-[10px]">Change Password</h1>
      <div className="mb-4">
        <label htmlFor="password">Password</label>
        <input
          {...register("password", {
            required: "Enter password here",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          id="password"
          className="w-full"
        />
        {errors.password && (
          <span className="text-red-500">
            {errors.password.message.toString()}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          {...register("confirmPassword", {
            required: "Enter confirm password here",
            validate: (value) => value === getValues("password"),
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          id="confirmPassword"
          className="w-full"
        />
        {errors.confirmPassword && (
          <span className="text-red-500">
            {errors.confirmPassword.message.toString()}
          </span>
        )}
        {errors.confirmPassword &&
          errors.confirmPassword.type === "validate" && (
            <span className="text-red-500">Password not match</span>
          )}
      </div>
      <button className="primary-button my-[20px]" type="submit">
        {loading ? "Loading..." : "Update"}
      </button>
    </form>
  );
}
