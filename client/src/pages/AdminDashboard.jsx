import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const statusColors = {
  placed: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200"
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    setOrders(prev =>
      prev.map(o => o._id === orderId ? { ...o, status } : o)
    );
  };

  const stats = {
    total: orders.length,
    placed: orders.filter(o => o.status === "placed").length,
    revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Loading dashboard...</p>
          <div className="animate-spin text-2xl">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">⚙️ Admin Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage orders and track business metrics</p>
          </div>
          <Link
            to="/admin/products"
            className="bg-gradient-primary hover:shadow-lg text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
          >
            📦 Manage Products
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Orders", value: stats.total, icon: "📋", color: "from-blue-500 to-blue-600" },
            { label: "Pending Orders", value: stats.placed, icon: "⏳", color: "from-yellow-500 to-yellow-600" },
            { label: "Total Revenue", value: `₹${stats.revenue}`, icon: "💰", color: "from-primary to-secondary" }
          ].map((stat, idx) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <span className="text-5xl opacity-20">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{order.userId?.name}</p>
                          <p className="text-xs text-gray-500">{order.userId?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold border ${statusColors[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition"
                        >
                          <option value="placed">📋 Placed</option>
                          <option value="confirmed">✓ Confirmed</option>
                          <option value="shipped">🚚 Shipped</option>
                          <option value="delivered">✓✓ Delivered</option>
                        </select>
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

export default AdminDashboard;