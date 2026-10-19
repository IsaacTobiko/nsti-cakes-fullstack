import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError("");
    if (!token) {
      setError("Reset link is missing or invalid.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/reset-password`, {
        token,
        new_password: password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-maroon-dark flex flex-col items-center justify-center px-4 py-10">
      <h1 className="font-serif font-normal text-center text-white text-2xl sm:text-3xl md:text-4xl mb-1">
        Reset password
      </h1>
      <p className="text-white text-center text-sm sm:text-base mb-6">
        Enter your new password
      </p>

      <div className="bg-gray-300 rounded-xl p-5 flex flex-col gap-3 w-full sm:w-[90%] md:w-[480px] lg:w-[420px]">
        <div className="flex items-center bg-white rounded-lg px-3 h-11 gap-2">
          <i className="fa-solid fa-lock text-gray-700 text-lg" />
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 h-11 gap-2">
          <i className="fa-solid fa-lock text-gray-700 text-lg" />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
          />
        </div>

        {error && (
          <p className="text-red-700 bg-red-100 text-xs sm:text-sm rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-700 bg-green-100 text-xs sm:text-sm rounded-lg px-3 py-2">
            Password updated! Redirecting to login...
          </p>
        )}

        <button
          onClick={handleReset}
          disabled={loading || success}
          className="bg-[#3D0D1E] text-[#F5F0EB]
            rounded-lg h-11 w-full
            text-sm sm:text-base font-medium
            hover:bg-[#5a1530] active:scale-95
            transition-all duration-150 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Reset password"}
        </button>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center gap-1
            text-xs sm:text-sm text-gray-500
            hover:text-gray-800 transition-colors cursor-pointer
            w-full"
        >
          <i className="fa-solid fa-arrow-left" />
          Back to login
        </button>
      </div>
    </main>
  );
}
export default ResetPassword;
