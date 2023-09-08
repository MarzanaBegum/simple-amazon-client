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
  email: string;
  password: string;
};
const LoginScreen = () => {
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
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user && user?.email) {
      router.push(redirect || "/");
    }
  }, [router, redirect, user]);

  const onSubmit = async (signinData: InputFieldType) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.post("/auth/signin", signinData);
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
      toast.success("User signin successfully");
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };
  return (
    <Layout title="Login">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-md mx-auto"
      >
        <h2 className="mb-4 text-xl">Login</h2>
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
          <button className="primary-button" type="submit">
            Login
          </button>
        </div>
        <div>
          Don&apos;t have an account? &nbsp;{" "}
          <Link href={`/register?redirect=${redirect || "/"}`}>Register</Link>
        </div>
      </form>
    </Layout>
  );
};

export default LoginScreen;
