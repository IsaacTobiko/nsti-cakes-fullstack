const NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

function WhatsAppButton() {
  if (!NUMBER) return null;
  const message = encodeURIComponent(
    "Hello NSTI Cakes, I would like to ask about a cake.",
  );
  return (
    <a
      href={`https://wa.me/${NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-colors"
    >
      <i className="fab fa-whatsapp text-3xl"></i>{" "}
    </a>
  );
}

export default WhatsAppButton;
