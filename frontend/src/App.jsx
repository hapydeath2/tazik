import ShopFrontend from "./pages/shop/ShopFrontend";
import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accounts from "./components/Accounts";
import Shop from "./pages/shop/ShopFrontend";
import Cart from "./pages/cart/Cart";
import Navbar from "./components/Navbar";
import Profile from "./pages/profile/Profile";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Navbar authToken={authToken} />
      <Routes>
        <Route path="/" element={<ShopFrontend />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/profile"
          element={
            <Profile authToken={authToken} setAuthToken={setAuthToken} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
