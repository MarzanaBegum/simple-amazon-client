import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem/index";
import { useContext, useEffect, useReducer } from "react";
import { Store } from "../utils/Store";
import { toast } from "react-toastify";
import { api } from "./api";
import { getError } from "../utils/error";

const reducer = (state, actions) => {
  switch (actions.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: actions.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: actions.payload };
    default:
      return state;
  }
};

export default function Home() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [{ loading, error, products }, productDispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        productDispatch({ type: "FETCH_REQUEST" });
        const { data } = await api.get("/products");
        productDispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        productDispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchProducts();
  }, []);

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
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-700">{error}</div>
          ) : (
            products.map((product) => (
              <ProductItem
                key={product.slug}
                product={product}
                handleAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>
      </Layout>
    </>
  );
}
