import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { api } = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [area, setArea] = useState("");
  const [town, setTown] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");

  const deliveryFee = deliveryMethod === "home" ? 300 : 0;
  const grandTotal = cartTotal + deliveryFee;

  async function handleConfirmOrder() {
    if (!area.trim()) {
      alert("Please enter your Area/Estate.");
      return;
    }
    if (!town) {
      alert("Please select a Town/City");
      return;
    }
    if (!mpesaNumber.trim()) {
      alert("Please enter your M-Pesa number.");
      return;
    }
    if (!/^0[71]\d{8}$/.test(mpesaNumber.trim())) {
      alert("Enter a valid M-Pesa number, e.g. 0712345678.");
      return;
    }
    try {
      for (const item of cartItems) {
        await api.post("/orders/", {
          order_code: `ORD-${Date.now()}-${item.id}`,
          cake: item.name,
          amount: item.price * item.quantity,
          status: "Pending",
        });
      }

      const orderData = {
        cartItems,
        deliveryMethod,
        area,
        town,
        mpesaNumber,
        subtotal: cartTotal,
        deliveryFee,
        grandTotal,
      };
      clearCart();
      navigate("/order-confirmation", { state: { orderData } });
    } catch (err) {
      alert("Failed to place. Please try again.");
    }
  }

  return (
    <div className="bg-gray-200 px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-serif text-maroon-dark mb-1">
              Delivery details
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Where should we deliver your cakes?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() => setDeliveryMethod("home")}
                className={`text-left  border rounded-lg p-4 cursor-pointer transition-colors ${deliveryMethod === "home" ? "border-maroon-dark bg-maroon-dark/5" : "border-gray-300"}`}
              >
                <p className="font-semibold text-maroon-dark">Home Delivery</p>
                <p className="text-sm text-gray-600">Delivered to your door</p>
                <p className="text-sm text-gray-700 mt-1">KSH 300</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod("pickup")}
                className={`text-left border rounded-lg p-4 cursor-pointer transition-colors ${
                  deliveryMethod === "pickup"
                    ? "border-maroon-dark bg-maroon-dark/5"
                    : "border-gray-300"
                }`}
              >
                <p className="font-semibold text-maroon-dark">Pickup</p>
                <p className="text-sm text-gray-600">
                  Kaslee Centre, 2nd Floor, Room 203, Kitengela
                </p>
                <p className="text-sm text-gray-700 mt-1">Free</p>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Area/Estate
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-maroon-dark"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Town/City
                </label>
                <select
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-maroon-dark"
                >
                  <option value="">Select Town</option>
                  <option value="Kitengela">Kitengela</option>
                  <option value="Nairobi">Nairobi</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-serif text-maroon-dark mb-1">
              Payment Method
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose how you'd like to pay
            </p>
            <div className="border border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Enter your M-Pesa registered number. You'll receive a prompt to
                confirm payment.
              </p>
              <label className="block text-sm text-gray-700 mb-1">
                M-Pesa Number
              </label>
              <input
                type="text"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                placeholder="0712345678"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-maroon-dark"
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80">
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-4">
            <div className="bg-maroon-dark text-white px-4 py-3">
              <h2 className="font-serif">Your Order</h2>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-2 pb-3 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${item.image}`}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="text-gray-700">
                        {item.name} x{item.quantity}
                      </span>
                    </div>
                    <span className="text-gray-800">
                      {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-gray-800">
                  KSH {cartTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Delivery Fee</span>
                <span className="text-gray-800">KSH {deliveryFee}</span>
              </div>

              <div className="flex justify-between font-semibold text-maroon-dark border-t border-gray-200 pt-3">
                <span>Grand Total</span>
                <span>KSH {grandTotal.toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="bg-maroon-dark hover:bg-maroon text-white font-semibold py-3 rounded-full mt-2 cursor-pointer"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
