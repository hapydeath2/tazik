import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src="https://res.cloudinary.com/dsypf2bkk/image/upload/q_auto/f_auto/v1778246200/megan_rexazin_conde-store-4156934_cxk2yr.svg" alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/profile" className="profile-link">
          <img src="https://res.cloudinary.com/dsypf2bkk/image/upload/q_auto/f_auto/v1778245771/avatar-empty_wmpn4b.png" alt="Profile" className="profile-icon" />
        </Link>
      </div>

      {/* <h1>My Shop</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/accounts">Accounts</Link>
      </div> */}
    </header>
  );
}
