import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { orders } from "../../data/orders";
import { notifications } from "../../data/notifications";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Customers", path: "/admin/customers", icon: Users },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-maroon-dark flex-shrink-0 flex flex-col z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-serif text-maroon-dark">
              N
            </div>
            <div>
              <p className="text-white font-serif text-lg leading-tight">
                NSTI Cakes
              </p>
              <p className="text-gold-light text-xs">Admin Portal</p>
            </div>
          </div>
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-3 sm:px-4 mt-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 sm:px-4 py-3 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-maroon-light text-gold font-semibold"
                    : "text-gray-200 hover:bg-maroon-light/60"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </span>
              {label === "Orders" && pendingCount > 0 && (
                <span className="bg-gold text-maroon-dark text-xs font-bold px-2 py-0.5 rounded-full">
                  {orders.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="cursor-pointer flex items-center gap-3 px-4 sm:px-6 py-5 text-gray-300 hover:text-white text-sm border-t border-maroon-light/40 "
        >
          <LogOut size={18} />
          LogOut
        </button>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
        <footer className="bg-black text-gray-400 text-xs text-center py-3 px-4">
          © 2026 NSTI Cakes. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

const notificationIcons = {
  order: ShoppingBag,
  payment: CreditCard,
  stock: AlertCircle,
  customer: UserPlus,
};

const notificationIconStyles = {
  order: "bg-[#fbe9ec] text-maroon",
  payment: "bg-[#f6e9d2] text-gold",
  stock: "bg-[#fbe9ec] text-red-600",
  customer: "bg-green-100 text-green-600",
};

function AdminTopBar({ onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-maroon-dark px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="md:hidden text-gray-200 hover:text-gold flex-shrink-0"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-white font-serif text-lg sm:text-xl truncate">
            Dashboard
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm hidden sm:block truncate">
            Welcome back, Admin Isaac {today}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
        <div className="relative" ref={notifRef}>
          <button
            className="text-gray-200 hover:text-gold cursor-pointer"
            onClick={() => setNotifOpen((prev) => !prev)}
          >
            <Bell size={20} />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="font-serif text-lg text-maroon-dark">
                  {" "}
                  Notifications
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {notifications.map((n) => {
                  const Icon = notificationIcons[n.type];
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-5 py-4 hover:bg-[#faf5f0] transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notificationIconStyles[n.type]}`}
                      >
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-maroon-dark text-sm">
                          {n.title}
                        </p>
                        <p className="text-sm text-maroon-light">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="cursor-pointer w-full text-center py-3 text-sm font-semibold text-gold hover:bg-[#faf5f0] transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-bold text-maroon-dark flex-shrink-0">
            W
          </div>

          <div className="text-sm hidden sm:block">
            <p className="text-white font-medium leading-tight">Admin Isaac</p>
            <p className="text-gray-300 text-xs">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminLayout;
