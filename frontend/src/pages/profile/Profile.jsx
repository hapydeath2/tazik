import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile({ authToken, setAuthToken }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function logout() {
    localStorage.removeItem("token");
    setAuthToken(null);
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("https://localhost:7099/api/Accounts/me", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();

        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (authToken) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [authToken]);

  if (!authToken) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>Please login</h1>
          <p>You need an account to access your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          className="profile-avatar"
          src={
            user?.avatarUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Avatar"
        />

        <h1 className="profile-name">{user?.username || "Unknown User"}</h1>

        <div className="profile-info">
          <div className="profile-row">
            <span>Email</span>
            <span>{user?.email}</span>
          </div>

          <div className="profile-row">
            <span>Balance</span>
            <span>${user?.balance || 0}</span>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <span>{user?.role || "User"}</span>
          </div>

          <div className="profile-row">
            <span>Joined</span>
            <span>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>
        </div>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
