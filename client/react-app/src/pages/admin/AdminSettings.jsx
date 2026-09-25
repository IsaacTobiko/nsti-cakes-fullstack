import { useState, useEffect } from "react";
import { User, Mail, Lock, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const initialToggles = {
  newOrders: true,
  payments: true,
  lowStock: false,
  newCustomers: true,
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${
      checked ? "bg-gold justify-end" : "bg-gray-300 justify-start"
    }`}
  >
    <span className="w-5 h-5 rounded-full bg-white shadow-sm"></span>
  </button>
);

const AdminSettings = () => {
  const { api } = useAuth();
  const [profile, setProfile] = useState({ fullName: "", email: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [toggles, setToggles] = useState(initialToggles);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    api.get("/user/me/notifications").then((res) => {
      setToggles({
        newOrders: res.data.new_orders,
        payments: res.data.payments,
        lowStock: res.data.low_stock,
        newCustomers: res.data.new_customers,
      });
    });
  }, []);

  const handleProfileChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswords({ ...passwords, [field]: e.target.value });
  };

  const handleToggle = async (field) => {
    const updated = { ...toggles, [field]: !toggles[field] };
    setToggles(updated);
    await api.put("/user/me/notifications", {
      new_orders: updated.newOrders,
      payments: updated.payments,
      low_stock: updated.lowStock,
      new_customers: updated.newCustomers,
    });
  };

  const notificationItems = [
    {
      key: "newOrders",
      title: "New Orders",
      description: "Alert when a new order is placed",
    },
    {
      key: "payments",
      title: "Payments",
      description: "Alert on payment success or failure",
    },
    {
      key: "lowStock",
      title: "Low Stock Alerts",
      description: "Notify when product stock is low",
    },
    {
      key: "newCustomers",
      title: "New Customers",
      description: "Alert when a new customer registers",
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-maroon-dark mb-6">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-maroon-dark border-b border-gray-200 pb-3 mb-5">
            Profile Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-maroon mb-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon-light"
                />
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={handleProfileChange("fullName")}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-[#faf5f0] text-sm text-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-maroon mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon-light"
                />
                <input
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange("email")}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-[#faf5f0] text-sm text-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <button
              onClick={async () => {
                await api.put("/user/me", {
                  name: profile.fullName,
                  email: profile.email,
                });
                setSavedMsg("Profile updated!");
                setTimeout(() => setSavedMsg(""), 2000);
              }}
              className="flex items-center gap-2 bg-maroon-dark hover:bg-maroon text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
            {savedMsg && (
              <p className="text-green-600 text-sm mt-2">{savedMsg}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-maroon-dark border-b border-gray-200 pb-3 mb-5">
            Security
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-maroon mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon-light"
                />
                <input
                  type="password"
                  value={passwords.current}
                  onChange={handlePasswordChange("current")}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-[#faf5f0] text-sm text-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-maroon mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon-light"
                />
                <input
                  type="password"
                  value={passwords.new}
                  onChange={handlePasswordChange("new")}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-[#faf5f0] text-sm text-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-maroon mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon-light"
                />
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange("confirm")}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-[#faf5f0] text-sm text-maroon-dark focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <button
              onClick={async () => {
                try {
                  await api.put("/user/me/password", {
                    current_password: passwords.current,
                    new_password: passwords.new,
                  });
                  setPasswords({ current: "", new: "", confirm: "" });
                  alert("Password updated!");
                } catch (err) {
                  alert(
                    "Failed to update password. Check your current password.",
                  );
                }
              }}
              className="flex items-center gap-2 bg-maroon-dark hover:bg-maroon text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              <Lock size={16} />
              Update Password
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-maroon-dark border-b border-gray-200 pb-3 mb-5">
            Notification Preferences
          </h2>
          <div className="divide-y divide-gray-100">
            {notificationItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-semibold text-maroon-dark">{item.title}</p>
                  <p className="text-sm text-maroon-light">
                    {item.description}
                  </p>
                </div>
                <Toggle
                  checked={toggles[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;
