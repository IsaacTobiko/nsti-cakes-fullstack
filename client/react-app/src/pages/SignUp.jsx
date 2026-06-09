import { useState } from "react";

function SignUp() {
  //input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength
  function getPasswordStrength() {
    if (password.length === 0) return null;
    if (password.length < 6)
      return { text: "Weak password", color: "text-red-500" };
    if (password.length < 10)
      return { text: "Medium password", color: "text-yellow-500" };
    return { text: "Strong password", color: "text-green-500" };
  }
  //Email validation
  function isEmailValid() {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length === 0 || validEmail.test(email);
  }

  // Password match check
  function passwordsMatch() {
    return confirmPassword.length === 0 || password === confirmPassword;
  }
  // Form submit
  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) return;
    console.log("Form submitted!", { email, password });
  }

  const strength = getPasswordStrength();

  return (
    <main className="bg-gray-300 flex items-center justify-center min-h-screen px-4">
      <div className="bg-white w-full max-w-sm md:max-w-md lg:max-w-lg px-6 md:px-8 lg:px-10 py-10 md:py-12 flex flex-col gap-5">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm md:text-base font-semibold text-gray-900">
              Email Address
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 px-3 py-3 rounded-sm">
              <i className="fas fa-envelope text-gray-900"></i>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 text-sm md:text-base outline-none bg-white"
              />
            </div>
            {!isEmailValid() && (
              <p className="text-sm text-red-500 ">
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm md:text-base font-semibold text-gray-900">
              Create password
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 px-3 py-3 rounded-sm">
              <i className="fas fa-lock text-gray-900"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 text-sm md:text-base outline-none bg-white"
              />
              <i
                className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}   text-gray-500 cursor-pointer`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            {strength && (
              <p className={`text-sm ${strength.color}`}>{strength.text}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirm-password"
              className="text-sm md:text-base font-semibold text-gray-900"
            >
              Confirm password
            </label>
            <div className="flex items-center gap-3 bg-white border border-gray-300 px-3 py-3 rounded-sm">
              <i className="fas fa-lock text-gray-900"></i>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="flex-1 text-sm md:text-base outline-none bg-white"
              />

              <i
                className={`fas ${showConfirm ? "fa-eye" : "fa-eye-slash"} text-gray-500 cursor-pointer`}
                onClick={() => setShowConfirm(!showConfirm)}
              ></i>
            </div>
            {!passwordsMatch() && (
              <p className="text-red-500 text-sm md:text-base ">
                Passwords do not match!
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-maroon hover:bg-maroon-dark text-white text-sm md:text-base font-semibold py-3 rounded-sm transition-colors duration-200 cursor-pointer"
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center gap-4 my-2">
          <hr className="flex-1 border-gray-300" />
          <p className="text-xs text-gray-500 tracking-widest font-semibold uppercase">
            OR CONTINUE WITH
          </p>
          <hr className="flex-1 border-gray-300" />
        </div>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-900 text-sm md:text-base font-semibold py-3 rounded-sm transition-colors duration-200 cursor-pointer"
        >
          <i className="fab fa-google"></i>
          Continue with Google
        </button>
        <p className="text-sm md:text-base text-gray-500 text-center mt-2">
          Already have an account?
          <a href="/login" className="text-gold font-semibold">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}

export default SignUp;
