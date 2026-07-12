function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 sm:h-48 lg:h-56 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-maroon-dark">
          {product.name} <span>KSH {product.price}</span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <button
          onClick={() => onAdd(product)}
          className="mt-3 bg-maroon text-white text-sm px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
