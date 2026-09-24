import { useState, useEffect } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  UserPlus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { weeklyRevenue, monthlyRevenue } from "../../data/dashboardStats";
import { useAuth } from "../../context/AuthContext";

const iconMap = {
  "Total Orders": ShoppingBag,
  Revenue: TrendingUp,
  "Pending Orders": Clock,
  "New Customers": UserPlus,
};

function Dashboard() {
  const [range, setRange] = useState("weekly");
  const [stats, setStats] = useState(null);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  const data = range === "weekly" ? weeklyRevenue : monthlyRevenue;

  const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
  const periodLabel = range === "weekly" ? "this week" : "this year";

  if (!stats)
    return (
      <div className="text-center  py-10 text-gray-400">
        Loading dashboard...
      </div>
    );

  const statCards = [
    {
      label: "Total Orders",
      value: stats.total_orders,
      trend: "",
      trendDirection: "up",
      note: "",
    },
    {
      label: "Revenue",
      value: `KSh ${stats.total_revenue.toLocaleString()}`,
      trend: "",
      trendDirection: "up",
      note: "",
    },
    {
      label: "Pending Orders",
      value: stats.pending_orders,
      trend: "",
      trendDirection: "down",
      note: "needs attention",
    },
    {
      label: "New Customers",
      value: stats.total_customers,
      trend: "",
      trendDirection: "up",
      note: "",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = iconMap[card.label];
          const isUp = card.trendDirection === "up";

          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
                  {card.label}
                </p>
                <div className="w-9 h-9 rounded-full bg-maroon-light/10 flex items-center justify-center">
                  <Icon size={18} className="text-maroon" />
                </div>
              </div>

              <p className="text-2xl sm:text-3xl font-serif text-maroon-dark">
                {card.value}
              </p>
              <div className="flex items-center gap-1 text-xs  sm:text-sm">
                <span
                  className={`flex items-center gap-0.5 font-semibold ${
                    isUp ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {card.trend}
                </span>
                <span className="text-gray-400">{card.note}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-serif text-lg text-maroon-dark">
                Revenue Overview
              </h2>
              <p className="text-sm text-maroon">
                KSH {total.toLocaleString()} {periodLabel}
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setRange("weekly")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  range === "weekly"
                    ? "bg-maroon-dark text-white"
                    : "text-gray-500 hover:text-maroon-dark"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setRange("monthly")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  range === "monthly"
                    ? "bg-maroon-dark text-white"
                    : "text-gray-500 hover:text-maroon-dark"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9971F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9971F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eee" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#6b5b5f" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b5b5f" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val / 1000}K`}
                />
                <Tooltip
                  formatter={(value) => [
                    `KSH ${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#C9971F"
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <TopSellingCakes cakes={stats.top_selling_cakes} />
      </div>
      <RecentOrders />
    </div>
  );
}

function TopSellingCakes({ cakes }) {
  if (!cakes || cakes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-serif text-lg text-maroon-dark mb-4">
          Top Selling Cakes
        </h2>
        <p className="text-gray-400 text-sm">No orders yet.</p>
      </div>
    );
  }
  const maxOrders = Math.max(...cakes.map((c) => c.orders));

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-serif text-lg text-maroon-dark mb-4">
        Top Selling Cakes
      </h2>
      <div className="space-y-4">
        {cakes.map((cake, i) => (
          <div key={cake.name}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-maroon-dark font-medium">
                {i + 1}. {cake.name}
              </span>
              <span className="text-gray-500">{cake.orders} orders</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-maroon to-gold rounded-full"
                style={{ width: `${(cake.orders / maxOrders) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const statusStyles = {
  Delivered: "bg-gold-light/30 text-gold-dark",
  Pending: "bg-maroon-light/20 text-maroon",
  Processing: "bg-blue-100 text-blue-600",
  Cancelled: "bg-red-100 text-red-600",
};

function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/orders/").then((res) => setOrders(res.data));
  }, []);

  const recent = orders.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg text-maroon-dark">Recent Orders</h2>
        <button className="text-sm border border-gold text-gold px-4 py-1.5 rounded-full hover:bg-gold hover:text-white transition">
          View all orders
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-maroon-dark uppercase text-xs bg-maroon-light/10">
              <th className="py-3 pb-3 font-bold">Order ID</th>
              <th className="py-3 pb-3 font-bold">Customer</th>
              <th className="py-3 pb-3 font-bold">Cake</th>
              <th className="py-3 pb-3 font-bold">Amount</th>
              <th className="py-3 pb-3 font-bold">Status</th>
              <th className="py-3 pb-3 font-bold">Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((order) => (
              <tr key={order.order_code} className="border-b last:border-0">
                <td className="py-3 font-medium text-maroon-dark">
                  {order.order_code}
                </td>
                <td className="py-3 text-gray-700">
                  Customer #{order.user_id}
                </td>
                <td className="py-3 text-gray-700">{order.cake}</td>
                <td className="py-3 text-gold font-medium">
                  KSH {order.amount.toLocaleString()}
                </td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Dashboard;
