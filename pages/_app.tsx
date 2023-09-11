import { useRouter } from "next/router";
import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";
import { useAtom } from "jotai";
import { USER_STATE } from "../state";
import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { api } from "./api";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps: { ...pageProps } }) {
  const [user, setUser] = useAtom(USER_STATE);
  const token = getCookie("auth");

  useEffect(() => {
    (async () => {
      if (user && user?._id && token) {
        const response = await api.get(`/user/${user._id}`);
        const userData = {
          name: response?.data?.name,
          email: response?.data?.email,
          _id: response?.data?._id,
        };
        setUser(userData);
      }
    })();
  }, []);
  return (
    <StoreProvider>
      <PayPalScriptProvider
        deferLoading={true}
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          // "disable-funding": "credit,card,p24,venmo",
        }}
      >
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </PayPalScriptProvider>
    </StoreProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const [user, setUser] = useAtom(USER_STATE);
  const token = getCookie("auth");

  useEffect(() => {
    if (!token) {
      setUser(undefined);
      router.push("/login");
    }
  }, [token, router, setUser]);

  return children;
}
export default MyApp;
