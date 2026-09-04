import { useState } from "react";
import { Search, Plus, Eye } from "lucide-react";
import { customers } from "../../data/customers";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const formatCurrency = (amount) => {
  return `KSH ${amount.toLocaleString()}`;
};

const AdminCustomers = () => {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(
    (customers) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()),
  );
};
export default AdminCustomers;
