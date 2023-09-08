import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import { Store } from "../../utils/Store";
import { toast } from "react-toastify";
import { api } from "../api";

export default function ProductDetails({ product }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  if (!product) {
    return <Layout title="Product not found">Product not found!</Layout>;
  }
  const handleAddToCart = async () => {
    const existingItem = state.cart.cartItems.find(
      (item) => item.name === product.name
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await api.get(`/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry,Product is out of stock!");
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
    await router.push("/cart");
  };
  return (
    <Layout title={product.name}>
      <Link href="/">back to products</Link>
      <div className="grid md:grid-cols-4 md:gap-3 py-[20px]">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
          ></Image>
        </div>
        <div>
          <ul className="flex flex-col gap-[5px] text-md">
            <li>
              <h2>{product.name}</h2>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="p-5 card">
            <div className="flex justify-between mb-2">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="flex justify-between mb-2">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In Stock" : "Unavailable"}</div>
            </div>
            <button className="w-full primary-button" onClick={handleAddToCart}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  const { data } = await api.get(`/products/slug/${slug}`);
  return {
    props: {
      product: data,
    },
  };
}
