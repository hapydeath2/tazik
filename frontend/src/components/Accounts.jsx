import { useState } from "react";

export default function Accounts({ authToken, setAuthToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false); // false = login, true = register

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain number";
    }
    return null;
  }

  function validateForm() {
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return false;
    }
    if (isRegister) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return false;
      }
    }
    setError("");
    return true;
  }

  async function login() {
    if (!validateForm()) return;

    try {
      const res = await fetch("https://localhost:7099/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
    } catch (err) {
      console.error(err);
      setError("Server connection error");
    }
  }

  async function register() {
    if (!validateForm()) return;

    try {
      const res = await fetch("https://localhost:7099/api/Accounts/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
    } catch {
      setError("Server connection error");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setAuthToken(null);
  }

  return (
    <div className="accounts-container">
      <h2 className="title">{isRegister ? "Create Account" : "Login"}</h2>

      {error && <div className="error">{error}</div>}

      {authToken ? (
        <button className="button button-red" onClick={logout}>
          Logout
        </button>
      ) : (
        <>
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" onClick={isRegister ? register : login}>
            {isRegister ? "Register" : "Login"}
          </button>

          <button
            className="button button-green"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Switch to Login" : "Switch to Register"}
          </button>
        </>
      )}
    </div>
  );
}
