import { useState } from "react";
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
import {
  statCards,
  weeklyRevenue,
  monthlyRevenue,
  topSellingCakes,
} from "../../data/dashboardStats";

const iconMap = {
  "Total Orders": ShoppingBag,
  Revenue: TrendingUp,
  "Pending Orders": Clock,
  "New Customers": UserPlus,
};

function Dashboard() {
  const [range, setRange] = useState("weekly");
  const data = range === "weekly" ? weeklyRevenue : monthlyRevenue;

  const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
  const periodLabel = range === "weekly" ? "this week" : "this year";

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
      <div className="bg-white rounded-xl shadow-sm p-5">
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
      <TopSellingCakes />
    </div>
  );
}

function TopSellingCakes() {
  const maxOrders = Math.max(...topSellingCakes.map((c) => c.orders));

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-serif text-lg text-maroon-dark mb-4">
        Top Selling Cakes
      </h2>
      <div className="space-y-4">
        {topSellingCakes.map((cake) => (
          <div key={cake.rank}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-maroon-dark font-medium">
                {cake.rank}. {cake.name}
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

export default Dashboard;
