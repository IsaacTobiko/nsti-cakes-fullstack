import { useState } from "react";
import { productsData, categories } from "../data/productsData";
import ProductCard from "../components/ProductCard";

function Products() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categoriesToShow =
    activeCategory === "All"
      ? categories.filter((cat) => cat !== "All")
      : [activeCategory];

  const handleAdd = (product) => {
    console.log("Added:", product);
  };
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base  rounded-full border ${
              activeCategory === cat
                ? "bg-maroon text-white"
                : "bg-white text-maroon-dark"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
export default Products;
