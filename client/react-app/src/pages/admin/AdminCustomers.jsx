import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const AdminCustomers = () => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/user/").then((res) => setCustomers(res.data));
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-maroon-dark">Customers</h1>
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon-light"
          />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="bg-[#faf5f0] text-maroon-dark uppercase text-xs tracking-wide">
              <th className="text-left font-semibold px-4 py-3">Customer</th>
              <th className="text-left font-semibold px-4 py-3">Email</th>
              <th className="text-left font-semibold px-4 py-3">Role</th>
              <th className="text-left font-semibold px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-gray-100 hover:bg-[#faf5f0] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-maroon text-gold flex items-center justify-center text-xs font-bold shrink-0">
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-maroon-dark">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-500">#{customer.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-maroon-dark">{customer.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      customer.is_admin
                        ? "bg-gold-light/40 text-gold-dark"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {customer.is_admin ? "Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 text-gold hover:text-gold-light font-medium text-sm">
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminCustomers;
