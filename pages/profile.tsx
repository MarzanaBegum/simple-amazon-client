import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { USER_STATE } from "../state";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { api } from "./api";
import ChangePassword from "../components/ChangePassword";

type InputFieldType = {
  name: string;
  email: string;
};

function Profile() {
  const [user, setUser] = useAtom(USER_STATE);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user && user !== undefined) {
      setValue("name", user?.name);
      setValue("email", user?.email);
    }
  }, [setValue, user, user?.email, user?.name]);

  const onSubmit = async (formData: InputFieldType) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.put(`/auth/${user._id}`, formData);
      const userData = {
        name: response?.data?.name,
        email: response?.data?.email,
        _id: response?.data?._id,
      };
      setUser(userData);
      setLoading(false);
      toast.success("Update successfully");
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };

  return (
    <Layout title="Profile">
      <div className="flex flex-col lg:flex-row gap-[40px] max-w-[1200px] mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <h1 className="text-xl my-[10px]">Update Profile</h1>
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
          <button className="primary-button mt-[20px]" type="submit">
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
        <ChangePassword />
      </div>
    </Layout>
  );
}
Profile.auth = true;
export default Profile;
