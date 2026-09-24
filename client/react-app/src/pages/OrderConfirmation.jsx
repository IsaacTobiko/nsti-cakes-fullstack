import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) {
      navigate("/products", { replace: true });
      return;
    }
  }, []);

  if (!orderData) {
    return null;
  }

  return (
    <div className="bg-maroon-dark min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mb-6 animate-pop-in">
        <i className="fa-solid fa-check text-2xl text-white"></i>
      </div>

      <h1
        className="text-2xl md:text-3xl font-serif text-white mb-4 animate-slide-up"
        style={{ animationDelay: "0.2s", opacity: 0 }}
      >
        Order <span className="text-gold">Confirmed!</span>
      </h1>

      <p
        className="text-gray-300 max-w-md mb-10 animate-slide-up"
        style={{ animationDelay: "0.35s", opacity: 0 }}
      >
        Thank you for your order! Your cakes are being freshly prepared with
        love. We'll contact you to confirm delivery.
      </p>

      <div className="bg-white/10 rounded-full px-8 py-4 flex flex-wrap gap-2 justify-center">
        {orderData.cartItems.map((item) => (
          <span key={item.id} className="text-gold font-semibold">
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default OrderConfirmation;
