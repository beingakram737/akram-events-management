import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false); // ✅ VERY IMPORTANT
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* ✅ LOGOUT CONFIRM MODAL */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />

      <nav className="bg-indigo-600 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <span className="text-xl font-bold select-none">
              CampusBuzz
            </span>

            <div className="flex items-center gap-4">
              {user && <Link to="/">Events</Link>}

              {user?.role === "admin" && (
                <Link to="/admin/dashboard">
                  Admin Dashboard
                </Link>
              )}

              {!user ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign Up</Link>
                </>
              ) : (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="rounded bg-red-500 px-3 py-1.5"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
