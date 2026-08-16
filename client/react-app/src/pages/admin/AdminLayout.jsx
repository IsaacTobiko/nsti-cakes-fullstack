import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
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
  SidebarOpen,
} from "lucide-react";
import { orders } from "../../data/orders";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Customers", path: "/admin/customers", icon: Users },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

function AdminLayout() {
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {SidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
export default AdminLayout;
