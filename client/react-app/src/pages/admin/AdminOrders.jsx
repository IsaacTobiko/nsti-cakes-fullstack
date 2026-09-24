import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const statusStyles = {
  Delivered: "bg-gold-light/30 text-gold-dark",
  Pending: "bg-maroon-light/20 text-maroon",
  Processing: "bg-blue-100 text-blue-600",
  Cancelled: "bg-red-100 text-red-600",
};

const tabs = ["All", "Pending", "Processing", "Delivered", "Cancelled"];

function AdminOrders() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/orders/").then((res) => setOrders(res.data));
  }, []);

  const counts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "Pending").length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };
  const filtered = orders
    .filter((o) => activeTab === "All" || o.status === activeTab)
    .filter(
      (o) =>
        o.order_code.toLowerCase().includes(search.toLowerCase()) ||
        o.cake.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-maroon-dark">Orders</h1>
        <button className="flex items-center gap-2 bg-gold text-maroon-dark font-semibold px-4 py-2 rounded-lg hover:bg-gold-light transition text-sm">
          <Plus size={16} />
          New Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? "bg-maroon-dark text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {tab}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab
                      ? "bg-gold text-maroon-dark"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-maroon-dark uppercase text-xs bg-maroon-light/10">
                <th className="py-3 px-3 font-bold rounded-l-lg">Order ID</th>
                <th className="py-3 px-3 font-bold">Customer</th>
                <th className="py-3 px-3 font-bold">Cake</th>
                <th className="py-3 px-3 font-bold">Amount</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-3 font-bold rounded-r-lg">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.order_code}
                    className="border-b border-gray-200 last:border-0"
                  >
                    <td className="py-3 px-3 font-medium text-maroon-dark">
                      {order.order_code}
                    </td>
                    <td className="py-3 px-3 text-gray-700">
                      Customer #{order.user_id}
                    </td>
                    <td className="py-3 px-3 text-gray-700">{order.cake}</td>
                    <td className="py-3 px-3 text-gold font-medium">
                      KSh {order.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default AdminOrders;
