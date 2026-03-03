import { useState, useEffect } from "react";

export default function ShopFrontend() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [page, setPage] = useState("shop");
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API = "https://localhost:7099/api";
  const FALLBACK_API = API.replace(/^https:/, "http:");

  async function loadProducts() {
    try {
      let res;
      try {
        res = await fetch(`${API}/Products`);
      } catch {
        res = await fetch(`${FALLBACK_API}/Products`);
      }
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error loading products: " + err.message);
    }
  }

  async function loadAccounts() {
    try {
      if (!authToken) return;
      let res;
      try {
        res = await fetch(`${API}/Auth/accounts`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {
        res = await fetch(`${FALLBACK_API}/Auth/accounts`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }

      if (res.ok) {
        const data = await res.json();
        setAccounts(Array.isArray(data) ? data : []);
      } else {
        const err = await res.text();
        setError(err || "Failed to load accounts");
      }
    } catch (err) {
      setError("Error loading accounts: " + err.message);
    }
  }

  useEffect(() => {
    loadProducts();
    loadAccounts();
  }, [authToken]);

  async function createAccount() {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch(`${API}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSuccess("Account created successfully!");
        setEmail("");
        setPassword("");
        setTimeout(() => setSuccess(""), 2000);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to create account");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  }

  async function login() {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch(`${API}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        setAuthToken(data.token);
        setEmail("");
        setPassword("");
        setError("");
        setSuccess("Logged in successfully!");
        setTimeout(() => setSuccess(""), 2000);
        loadAccounts();
      } else {
        const err = await res.json();
        setError(err.message || "Login failed");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  }

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
    setSuccess("Added to cart!");
    setTimeout(() => setSuccess(""), 1500);
  }

  function removeFromCart(productId) {
    setCart(cart.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  }

  const totalPrice = cart.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);


function ethToWeiSafe(eth) {
  return BigInt(Math.round(Number(eth) * 1e18));
}

  async function processPayment() {
    console.log(
      "Processing payment for cart:",
      cart,
      "Total price:",
      totalPrice,
    );
    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }
    if (!authToken) {
      setError("Please login to proceed with payment");
      return;
    }
    try {
      if (!window.ethereum) {
        setError("MetaMask not found. Please install MetaMask.");
        return;
      }

      const walletaccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const valueWei = ethToWeiSafe(totalPrice);

      const txData = {
        from: walletaccounts[0],
        to: "0x353021d198c0267716EC9Dc7271c80c049F5C8EB", // Replace with your wallet address
        value: "0x" + valueWei.toString(16),
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txData],
      });

      const res = await fetch(`${API}/Orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          items: cart,
          totalPrice,
          transactionHash: txHash,
        }),
      });

      if (res.ok) {
        setSuccess("Payment successful! Transaction: " + txHash);
        setCart([]);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Payment recorded but order creation failed");
      }
    } catch (err) {
      setError("Payment error: " + err.message);
    }
  }

  function renderProducts() {
    return (
      <div style={{ padding: "24px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Shop - {products.length} products
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "16px",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {p.name}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                {p.description || "No description"}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                {p.price} ETH
              </p>
              <button
                onClick={() => addToCart(p)}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#0066cc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderCart() {
    return (
      <div style={{ padding: "24px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Shopping Cart ({cart.length} items)
        </h2>

        {cart.length === 0 ? (
          <p style={{ color: "#666", fontSize: "16px" }}>Your cart is empty</p>
        ) : (
          <>
            <div style={{ marginBottom: "20px" }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 4px 0" }}>{item.name}</h4>
                    <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                      {item.price} ETH each
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      style={{
                        width: "60px",
                        padding: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <span
                      style={{
                        minWidth: "80px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {(item.price * item.quantity).toFixed(4)} ETH
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#ff4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: "0 0 12px 0" }}>
                Total: {totalPrice.toFixed(4)} ETH
              </h3>
              <button
                onClick={processPayment}
                disabled={!authToken}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: authToken ? "#00aa00" : "#cccccc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: authToken ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {authToken ? "Pay with MetaMask" : "Login to pay"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  function renderAccounts() {
    return (
      <div style={{ padding: "24px", maxWidth: "600px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Accounts
        </h2>

        {error && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#ffe6e6",
              color: "#cc0000",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e6ffe6",
              color: "#00cc00",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          >
            {success}
          </div>
        )}

        {authToken && (
          <>
            <h3 style={{ marginTop: "20px", marginBottom: "12px" }}>
              Logged in as:
            </h3>
            <div style={{ marginBottom: "12px" }}>
              <strong>Token:</strong> {authToken.slice(0, 20)}...
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setAuthToken(null);
                setEmail("");
                setPassword("");
                setAccounts([]);
              }}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#ff6666",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Logout
            </button>

            {accounts && accounts.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ marginBottom: "8px" }}>Accounts from backend</h4>
                {accounts.map((acc) => (
                  <div
                    key={acc.id || acc._id || acc.email}
                    onClick={() => setSelectedAccount(acc)}
                    style={{
                      padding: "8px",
                      border: "1px solid #eee",
                      borderRadius: "6px",
                      marginBottom: "6px",
                      cursor: "pointer",
                    }}
                  >
                    {acc.email}
                  </div>
                ))}
              </div>
            )}
            {selectedAccount && (
              <div
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              >
                <h4 style={{ marginTop: 0 }}>Selected Account</h4>
                <div>Email: {selectedAccount.email}</div>
                <div>ID: {selectedAccount.id || selectedAccount._id}</div>
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "12px" }}>
            {authToken
              ? "Create another account or login as different user"
              : "Login or Create Account"}
          </h3>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#0066cc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Login
          </button>

          <button
            onClick={createAccount}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#009900",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ flex: 1, overflowY: "auto" }}>
        {page === "shop" && renderProducts()}
        {page === "cart" && renderCart()}
        {page === "accounts" && renderAccounts()}
      </div>

      <div
        style={{
          borderTop: "1px solid #ddd",
          padding: "12px",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "white",
          boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => setPage("shop")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "shop" ? "#0066cc" : "#f0f0f0",
            color: page === "shop" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Shop
        </button>
        <button
          onClick={() => setPage("cart")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "cart" ? "#0066cc" : "#f0f0f0",
            color: page === "cart" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Cart ({cart.length})
        </button>
        <button
          onClick={() => setPage("accounts")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "accounts" ? "#0066cc" : "#f0f0f0",
            color: page === "accounts" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Accounts
        </button>
      </div>
    </div>
  );
}
