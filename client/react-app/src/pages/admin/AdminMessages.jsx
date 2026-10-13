import { useState, useEffect } from "react";
import { Trash2, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { api } = useAuth();

  useEffect(() => {
    api
      .get("/contact/")
      .then((res) => setMessages(res.data))
      .catch(() => setError("Could not load messages."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError("Could not delete message");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-maroon-dark mb-6">Messages</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && messages.length === 0 && !error && (
        <div className="bg-white rounded-xl shadow-sm py-10 flex flex-col items-center text-gray-400">
          <Mail size={28} className="mb-2" />
          No messages yet.
        </div>
      )}

      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-maroon-dark break-words">
                  {m.name}
                </p>
                <a
                  href={`mailto:${encodeURIComponent(m.email)}`}
                  className="text-sm text-gold hover:text-gold-light break-all"
                >
                  {m.email}
                </a>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-400">
                  {new Date(m.created_at + "Z").toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  aria-label="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-maroon-dark whitespace-pre-wrap break-words">
              {m.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminMessages;
