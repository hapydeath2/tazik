import { useState, useEffect } from "react";
import Products from "../products/Products";
import Cart from "../cart/Cart";
import Accounts from "../accounts/Accounts";
import "./ShopFrontend.css";

export default function ShopFrontend() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState("shop");
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const API = "https://localhost:7099/api";
  const FALLBACK_API = API.replace(/^https:/, "http:");
  useEffect(() => {
    async function fetchProducts() {
      try {
        let res;

        try {
          res = await fetch(`${API}/Products`);
        } catch {
          res = await fetch(`${FALLBACK_API}/Products`);
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProducts();
  }, [API, FALLBACK_API]);  

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }

  return (
    <div className="page">
      <div className="content">
        {page === "shop" && (
          <Products products={products} addToCart={addToCart} />
        )}

        {page === "cart" && (
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            authToken={authToken}
          />
        )}

        {page === "accounts" && (
          <Accounts
            authToken={authToken}
            setAuthToken={setAuthToken}
            accounts={accounts}
            setAccounts={setAccounts}
          />
        )}
      </div>

      <div className="navbar">
        <button
          className={`nav-button ${page === "shop" ? "active" : ""}`}
          onClick={() => setPage("shop")}
        >
          Shop
        </button>

        <button
          className={`nav-button ${page === "cart" ? "active" : ""}`}
          onClick={() => setPage("cart")}
        >
          Cart ({cart.length})
        </button>

        <button
          className={`nav-button ${page === "accounts" ? "active" : ""}`}
          onClick={() => setPage("accounts")}
        >
          Accounts
        </button>
      </div>
    </div>
  );
}
