import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  const addToCart = async () => {
    if (!user) return navigate("/login");
    setLoading(true);
    try {
      await api.post("/cart", { productId: id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return (
    <div className="flex justify-center items-center h-96">
      <div className="text-center">
        <p className="text-gray-500 mb-2">Loading product details...</p>
        <div className="animate-spin text-2xl">⏳</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:text-secondary transition font-semibold mb-6 flex items-center gap-1"
        >
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Section */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-20">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden h-96">
                <img
                  src={product.imageUrl || "https://placehold.co/400x400?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-sm text-primary font-bold uppercase tracking-wider mb-2">
                📦 {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ₹{product.price}
                </span>
                {product.stock > 0 && (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
                    ✓ In Stock
                  </span>
                )}
              </div>

              <div className="border-t border-b py-4 mb-6">
                <p className={`text-lg font-semibold mb-2 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} items available` : "Out of stock"}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>✓ Fast Delivery</span>
                  <span>•</span>
                  <span>✓ Secure Payment</span>
                  <span>•</span>
                  <span>✓ Easy Returns</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {product.description || "This is a great product that you'll love!"}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={addToCart}
                  disabled={loading || product.stock === 0}
                  className={`px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-gradient-primary hover:shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {loading ? "Adding..." : added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 rounded-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;