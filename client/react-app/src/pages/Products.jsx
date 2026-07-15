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
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 justify-center items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base cursor-pointer rounded-full border whitespace-nowrap ${
              activeCategory === cat
                ? "bg-maroon text-white"
                : "bg-white text-maroon-dark"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {categoriesToShow.map((cat) => {
        const productsInCategory = productsData.filter(
          (p) => p.category === cat,
        );
        return (
          <div key={cat} className="mb-10 max-w-6xl mx-auto">
            <div className="inline-block bg-maroon-dark text-white px-3 py-1 text-sm sm:px-4 sm:py-1 sm:text-base rounded mb-4">
              {cat} cakes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
              {productsInCategory.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAdd}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default Products;
