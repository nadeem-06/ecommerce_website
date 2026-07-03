import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const emptyForm = {
  name: "", price: "", description: "",
  category: "", stock: "", imageUrl: ""
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products").then(({ data }) => {
      setProducts(data.products ?? data);
    });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      });
      setProducts(prev => [...prev, data]);
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">📦 Manage Products</h2>
            <p className="text-gray-600 mt-1">Add, edit, and manage your product inventory</p>
          </div>
          <Link
            to="/admin"
            className="text-primary hover:text-secondary transition font-semibold flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Add product form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ➕ Add New Product
          </h3>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Product Name", placeholder: "Enter product name" },
              { key: "price", label: "Price (₹)", type: "number", placeholder: "999" },
              { key: "category", label: "Category", placeholder: "Electronics, Fashion, etc" },
              { key: "stock", label: "Stock Quantity", type: "number", placeholder: "100" },
              { key: "imageUrl", label: "Image URL (optional)", placeholder: "https://...", required: false }
            ].map(({ key, label, type = "text", placeholder, required = true }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                <input
                  type={type}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition bg-gray-50 hover:bg-white"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  required={required}
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition bg-gray-50 hover:bg-white resize-none"
                placeholder="Describe your product..."
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-gradient-primary hover:shadow-lg text-white py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Adding..." : "✨ Add Product"}
            </button>
          </form>
        </div>

        {/* Products list */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Products ({products.length})
            </h3>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No products yet. Add your first product above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                            <img
                              src={product.imageUrl || "https://placehold.co/40x40?text=?"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.description.substring(0, 30)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-primary">₹{product.price}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                          product.stock > 0 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {product.stock > 0 ? `${product.stock}` : "Out"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;