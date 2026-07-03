import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-purple-500 to-primary p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">✨</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Join ShopHub</h2>
            <p className="text-gray-600">Create your account to start shopping</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6 flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary transition bg-gray-50 hover:bg-white"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary transition bg-gray-50 hover:bg-white"
                placeholder="you@example.com"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary transition bg-gray-50 hover:bg-white"
                placeholder="At least 6 characters"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-secondary to-primary hover:shadow-lg text-white py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Creating account..." : "🚀 Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
          </p>
        </div>

        {/* Security Features */}
        <div className="mt-8 bg-white/20 backdrop-blur rounded-xl p-6 text-white">
          <h3 className="font-bold mb-3">✓ Why Join Us?</h3>
          <ul className="text-sm space-y-2">
            <li>🛡️ Secure & encrypted payments</li>
            <li>📦 Fast delivery to your doorstep</li>
            <li>💰 Great deals & discounts</li>
            <li>⭐ Easy returns & refunds</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;