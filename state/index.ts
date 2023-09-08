import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type UserStateType = {
  name: string;
  email: string;
  _id: string;
};

export const USER_STATE = atomWithStorage("user", {
  name: "",
  email: "",
  _id: "",
});
