import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = async (overrides = {}) => {
    const params = {};
    const nextSearch = overrides.search ?? search;
    const nextCategory = overrides.category ?? category;
    const nextMinPrice = overrides.minPrice ?? minPrice;
    const nextMaxPrice = overrides.maxPrice ?? maxPrice;

    if (nextSearch) params.search = nextSearch;
    if (nextCategory) params.category = nextCategory;
    if (nextMinPrice) params.minPrice = nextMinPrice;
    if (nextMaxPrice) params.maxPrice = nextMaxPrice;

    const { data } = await api.get("/products", { params });
    // Handle both paginated { products: [] } and plain array response
    setProducts(data.products ?? data);
  };

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      const { data } = await api.get("/products");
      if (!ignore) {
        setProducts(data.products ?? data);
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search and filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          className="border rounded px-3 py-2 text-sm flex-1"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-sm w-32"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-sm w-24"
          placeholder="Min ₹"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-sm w-24"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
        <button
          onClick={() => fetchProducts()}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          Search
        </button>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="border rounded-lg p-3 hover:shadow transition"
          >
            <img
              src={product.imageUrl || "https://placehold.co/200x160?text=No+Image"}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <p className="font-medium text-sm">{product.name}</p>
            <p className="text-gray-500 text-sm">₹{product.price}</p>
            <p className="text-xs text-gray-400">{product.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;