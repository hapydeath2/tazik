import ShopFrontend from "./pages/shop/ShopFrontend";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accounts from "./pages/accounts/Accounts";
import Shop from "./pages/shop/ShopFrontend";
import Cart from "./pages/cart/Cart";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopFrontend />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
