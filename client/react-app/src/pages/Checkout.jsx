import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useContext(CartContext);

  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [area, setArea] = useState("");
  const [town, setTown] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");

  const deliveryFee = deliveryMethod === "home" ? 300 : 0;
  const grandTotal = cartTotal + deliveryFee;

  return <div>Checkout Page</div>;
}

export default Checkout;
