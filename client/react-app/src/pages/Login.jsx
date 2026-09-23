import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function isEmailValid() {
    if (email.length === 0) return true;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validEmail.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/products");
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <main className="min-h-screen flex">
      {/*Left Side*/}

      <div className="hidden md:flex w-1/2 bg-maroon-dark  flex-col justify-center px-12 ">
        <div className="animate-slide-left">
          <h1 className="font-instrument text-4xl md:text-5xl lg:text-6xl xl:text-7xl  text-white leading-tight">
            Baked with <br />
            <span className="text-gold">Love & Care</span>
          </h1>

          <p className="mt-6 font-inria text-lg md:text-2xl lg:text-3xl text-gray-300 leading-relaxed ">
            Join the Nairobi South Training Institute Bakery family and
            experience the art of exceptional baking. From elegant wedding cakes
            and delightful birthday treats to custom creations for every special
            occasion, we craft each cake with love, care, and attention to
            detail, ensuring every slice becomes a cherished memory.
          </p>
        </div>
      </div>
      {/*Right Side*/}

      <div className="w-full md:w-1/2 bg-gray-300 flex flex-col justify-center px-8 md:px-16 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg mx-auto bg-white px-6 md:px-8 py-10 rounded-md flex flex-col gap-5 animate-pop-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="text-sm md:text-base  text-gray-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-gold font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm md:text-base font-semibold text-gray-900">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-white border border-gray-300 px-3 py-3 rounded-sm focus-within:border-maroon  transition-colors duration-200">
                <i className="fas fa-envelope text-gray-900"></i>
                <input
                  placeholder="email@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-sm md:text-base outline-none bg-white "
                />
              </div>
            </div>
            {!isEmailValid() && (
              <p className="text-sm text-red-500">
                Please enter a valid email address
              </p>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-sm md:text-base font-semibold text-gray-900">
                Password
              </label>
              <div className="flex items-center gap-3 bg-white border border-gray-300 px-3 py-3 rounded-sm focus-within:border-maroon  transition-colors duration-200">
                <i className="fas fa-lock text-gray-900"></i>
                <input
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 text-sm md:text-base outline-none bg-white"
                />
                <i
                  className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}  text-gray-500 cursor-pointer`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm md:text-base">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="accent-maroon cursor-pointer"
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a
              href="/forgot-password"
              className="text-gold text-sm font-semibold hover:underline"
            >
              Forgot password?
            </a>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full bg-maroon hover:bg-maroon-dark text-white text-sm md:text-base font-semibold py-3 rounded-sm transition-colors duration-200 cursor-pointer"
            >
              Login to your account
            </button>
            <div className="flex items-center gap-4 my-2">
              <hr className="flex-1 border-gray-300 " />
              <p className="text-xs text-gray-500 tracking-widest font-semibold">
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
          </div>
          <div>
            <p className="text-sm md:text-base text-gray-500 text-center mt-2">
              New here?{" "}
              <a
                href="/signup"
                className="text-gold font-semibold hover:underline"
              >
                Create a new account
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
export default Login;
