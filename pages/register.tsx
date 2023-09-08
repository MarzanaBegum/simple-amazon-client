import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { USER_STATE, UserStateType } from "../state";
import { api } from "./api";
import { setCookie } from "cookies-next";

type InputFieldType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const RegisterScreen = () => {
  const router = useRouter();
  const [user, setUser] = useAtom(USER_STATE) as [
    UserStateType | undefined,
    (newValue: UserStateType | undefined) => void
  ];
  const [loading, setLoading] = useState(false);
  const { redirect }: any = router.query;
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user && user?.email) {
      router.push(redirect || "/");
    }
  }, [router, redirect, user]);

  const onSubmit = async (signinData: InputFieldType) => {
    const { confirmPassword, ...rest } = signinData;
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.post("/auth/signup", { ...rest });
      const userData = {
        name: response?.data?.user?.name,
        email: response?.data?.user?.email,
        _id: response?.data?.user?._id,
      };
      setUser(userData);
      const token = response?.data?.token;
      const expires = new Date(Date.now() + 87400e6);
      setCookie("auth", token, { expires });
      setLoading(false);
      toast.success("User signup successfully");
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };
  return (
    <Layout title="Create account">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-md mx-auto"
      >
        <h2 className="mb-4 text-xl">Create Account</h2>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            {...register("name", {
              required: "Please Enter your name",
            })}
            id="name"
            className="w-full"
          />
          {errors.name && (
            <span className="text-red-500">
              {errors.name.message.toString()}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            {...register("email", {
              required: "Please Enter your email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter a valid email address",
              },
            })}
            id="email"
            className="w-full"
          />
          {errors.email && (
            <span className="text-red-500">
              {errors.email.message.toString()}
            </span>
          )}
        </div>
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
        <div className="mb-4">
          <button className="primary-button" type="submit">
            Register
          </button>
        </div>
        <div>
          Already have an account? &nbsp;{" "}
          <Link href={`/login?redirect=${redirect || "/"}`}>Login</Link>
        </div>
      </form>
    </Layout>
  );
};

export default RegisterScreen;
