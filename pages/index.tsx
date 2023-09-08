import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem/index";
import { useContext } from "react";
import { Store } from "../utils/Store";
import { toast } from "react-toastify";
import { api } from "./api";

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const handleAddToCart = async (product) => {
    const existingItem = cart.cartItems.find(
      (item) => item.name === product.name
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await api.get(`/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry,Product is out of stock!");
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
  };
  return (
    <>
      <Layout title="Home page">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem
              key={product.slug}
              product={product}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const { data } = await api.get("/products");
  return {
    props: {
      products: data,
    },
  };
}
