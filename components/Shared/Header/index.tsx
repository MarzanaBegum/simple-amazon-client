import Link from "next/link";
import { Menu } from "@headlessui/react";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../utils/Store";
import DropdownLink from "../../DropdownLink";
import Cookies from "js-cookie";
import { USER_STATE } from "../../../state";
import { useAtom } from "jotai";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [user, setUser] = useAtom(USER_STATE);

  const logoutClickHandler = async () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    deleteCookie("auth");
    setUser(undefined);
    await router.push("/login");
  };
  useEffect(() => {
    setCartItemCount(
      cart.cartItems.reduce((a: any, c: any) => a + c.quantity, 0)
    );
  }, [cart.cartItems]);
  return (
    <nav className="flex items-center justify-between h-16 px-4 shadow-md">
      <Link href="/">
        <span className="text-lg font-bold text-blue-900">simple amazon</span>
      </Link>
      <div className="flex gap-[20px]">
        <Link href="/cart">
          <div className="relative mr-[5px] flex items-center">
            <Image
              src="/images/cart-icon.svg"
              alt="cart icon"
              width={30}
              height={30}
            ></Image>
            <span className="px-2 py-1 absolute top-[-8px] left-[20px] text-xs font-bold text-white bg-red-500 rounded-full">
              {cartItemCount > 0 ? cartItemCount : 0}
            </span>
          </div>
        </Link>
        {user && user?.name ? (
          <Menu as="div" className="relative inline-block">
            <Menu.Button className="text-blue-500">
              {user.name.split(" ")[0]}
            </Menu.Button>
            <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
              <Menu.Item>
                <DropdownLink href="/profile" className="w-full dropdown-link">
                  Profile
                </DropdownLink>
              </Menu.Item>
              <Menu.Item>
                <DropdownLink
                  href="/order-history"
                  className="w-full dropdown-link"
                >
                  Order History
                </DropdownLink>
              </Menu.Item>
              <Menu.Item>
                <a
                  href="#"
                  onClick={logoutClickHandler}
                  className="w-full dropdown-link"
                >
                  Logout
                </a>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <Link href="/login">
            <span className="">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
