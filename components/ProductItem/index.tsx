/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

export default function ProductItem({ product,handleAddToCart }) {
  return (
    <div className="card">
      <Link href={`product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5 text-center">
        <Link href={`product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p className="mb-2">${product.price}</p>
        <button
          className="primary-button"
          onClick={() => handleAddToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
