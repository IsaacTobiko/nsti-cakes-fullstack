import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-200 px-4 py-16 flex flex-col items-center justify-center text-center min-h-[50vh]">
        <i className="fa-solid fa-cart-shopping text-5xl text-maroon-dark mb-4"></i>
        <h2 className="text-xl font-serif text-maroon-dark mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any cakes yet.
        </p>
        <Link
          to="/products"
          className="bg-maroon-dark hover:bg-maroon text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Order Cakes
        </Link>
      </div>
    );
  }

  const subtotal = cartTotal;
  const deliveryFee = 300;
  const total = subtotal + deliveryFee;

  return (
    <div>
      <div className="bg-gray-200 px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-xl font-serif text-maroon-dark">
              Cart({cartItems.length})
            </h2>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-28 h-28 object-cover rounded"
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-maroon-dark">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 bg-gray-200 rounded cursor-pointer"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 bg-gray-200 rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end justify-between">
                    <p className="text-sm text-gray-700">
                      KSH {item.price.toLocaleString()}
                      <br />
                      per cake
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gold border border-gold text-sm px-1 py-0.5 rounded mt-2 cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow overflow-hidden sticky top-4">
              <div className="bg-maroon-dark text-white px-4 py-3">
                <h2 className="font-serif">Order Summary</h2>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>KSH {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>KSh {deliveryFee}</span>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-maroon-dark hover:bg-maroon text-white font-semibold py-3 rounded-full mt-2 cursor-pointer"
                >
                  Checkout (KSH {total.toLocaleString()})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
