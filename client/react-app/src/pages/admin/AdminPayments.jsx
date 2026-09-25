import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Smartphone,
  CreditCard,
  Landmark,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const methodIcons = {
  "M-Pesa": Smartphone,
  Card: CreditCard,
  "Bank Transfer": Landmark,
};

const statusStyles = {
  Completed: "text-gold",
  Pending: "text-maroon",
  Refunded: "text-purple-600",
  Failed: "text-red-600",
};

const statusDot = {
  Completed: "bg-gold",
  Pending: "bg-maroon",
  Refunded: "bg-purple-600",
  Failed: "bg-red-600",
};

const formatCurrency = (amount) => `KSH ${amount.toLocaleString()}`;

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const AdminPayments = () => {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/payments/").then((res) => setPayments(res.data));
  }, []);

  const totalCollected = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter((p) => p.status === "Pending").length;

  const failedRefundedCount = payments.filter(
    (p) => p.status === "Failed" || p.status === "Refunded",
  ).length;

  const filteredPayments = payments.filter(
    (p) =>
      p.txn_id.toLowerCase().includes(search.toLowerCase()) ||
      p.method.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-maroon-dark">Payments</h1>
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon-light"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Collected
            </p>
            <p className="text-xl font-bold text-maroon-dark">
              {formatCurrency(totalCollected)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <AlertCircle size={20} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Pending
            </p>
            <p className="text-xl font-bold text-maroon-dark">
              {pendingCount} txns
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <XCircle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Failed / Refunded
            </p>

            <p className="text-xl font-bold text-maroon-dark">
              {failedRefundedCount} txns
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="bg-[#faf5f0] text-maroon-dark uppercase text-xs tracking-wide">
              <th className="text-left font-semibold px-4 py-3">Txn ID</th>
              <th className="text-left font-semibold px-4 py-3">Order</th>
              <th className="text-left font-semibold px-4 py-3">Method</th>
              <th className="text-left font-semibold px-4 py-3">Amount</th>
              <th className="text-left font-semibold px-4 py-3">Status</th>
              <th className="text-left font-semibold px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => {
              const MethodIcon = methodIcons[payment.method] || Smartphone;
              return (
                <tr
                  key={payment.txn_id}
                  className="border-t border-gray-100 hover:bg-[#faf5f0] transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-maroon-dark">
                    {payment.txn_id}
                  </td>
                  <td className="px-4 py-3 text-maroon-light">
                    #{payment.order_id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-maroon-dark">
                      <MethodIcon size={14} />
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gold">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 font-semibold text-sm ${statusStyles[payment.status]}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDot[payment.status]}`}
                      ></span>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(payment.created_at)}
                  </td>
                </tr>
              );
            })}

            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminPayments;
