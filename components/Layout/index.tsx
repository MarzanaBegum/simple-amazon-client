import React from "react";
import Footer from "../Shared/Footer";
import Header from "../Shared/Header";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " - Amazon" : "Amazon"}</title>
        <meta name="description" content="E-commerce website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="top-right" limit={1} />
      <div className="flex flex-col justify-between min-h-screen">
        <header>
          <Header />
        </header>
        <main className="container px-4 m-auto mt-4">{children}</main>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}
