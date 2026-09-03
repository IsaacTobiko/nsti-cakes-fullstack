import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { productsData } from "../../data/productsData";

const stockStyles = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-gold-light/40 text-gold-dark",
  "Out of Stock": "bg-red-100 text-red-600",
};

function AdminProducts() {
  const [search, setSearch] = useState("");

  const filtered = productsData.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-serif text-2xl text-maroon-dark">Products</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-gold text-maroon-dark font-semibold px-4 py-2 rounded-lg hover:bg-gold-light transition text-sm whitespace-nowrap">
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-40 bg-maroon-light/10 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-maroon-dark text-sm leading-snug">
                    {product.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${stockStyles[product.stock]}`}
                  >
                    {product.stock}
                  </span>
                </div>
                <p className="text-xs text-maroon">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gold font-serif text-lg">
                    KSH {product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{product.sold} sold</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AdminProducts;
