import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GoogleButton({ text = "continue_with" }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSuccess(credentialResponse) {
    try {
      const data = await googleLogin(credentialResponse.credential);
      if (data.is_admin) {
        navigate("/admin", { replace: true });
        return;
      }
      navigate(location.state?.from || "/products", { replace: true });
    } catch (err) {
      alert("Google sign in failed. Please try again");
    }
  }
  return (
    <div className="flex justify-center">
      <GoogleLogin
        text={text}
        onSuccess={handleSuccess}
        onError={() => alert("Google sign in failed.")}
      />
    </div>
  );
}

export default GoogleButton;
