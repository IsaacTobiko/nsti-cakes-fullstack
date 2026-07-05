import { useState } from "react";
import { useNavigate } from "react-router-dom";
function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const handleSend = () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };
  const handleBack = () => {
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-maroon-dark flex flex-col items-center justify-center px-4 py-10">
      <h1 className="font-serif font-normal text-center text-white text-2xl sm:text-3xl md:text-4xl mb-1">
        Forgot password?
      </h1>
      <p className="text-white text-center text-sm sm:text-base mb-6">
        Enter your email to receive a reset link
      </p>

      <div className="bg-gray-300 rounded-xl p-5 flex flex-col gap-3 w-full sm:w-[90%] md:w-[480px] lg:w-[420px]">
        <div className="flex items-center bg-white rounded-lg px-3 h-11 gap-2">
          <i className="fa-regular fa-envelope text-gray-700 text-lg" />
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
          />
        </div>

        {status === "error" && (
          <p className="text-red-700 bg-red-100 text-xs sm:text-sm rounded-lg px-3 py-2">
            Please enter a valid email address
          </p>
        )}
        {status === "success" && (
          <p className="text-green-700 bg-green-100 text-xs sm:text-sm rounded-lg px-3 py-2">
            Reset link sent! Check your inbox
          </p>
        )}

        <button
          onClick={handleSend}
          className="bg-[#3D0D1E] text-[#F5F0EB]
            rounded-lg h-11 w-full
            text-sm sm:text-base font-medium
            hover:bg-[#5a1530] active:scale-95
            transition-all duration-150"
        >
          Send
        </button>
        <button
          onClick={handleBack}
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
export default ForgotPassword;
