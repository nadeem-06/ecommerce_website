import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const statusColors = {
  placed: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200"
};

const statusIcons = {
  placed: "📋",
  confirmed: "✓",
  shipped: "🚚",
  delivered: "✓✓"
};

const statusSteps = ["placed", "confirmed", "shipped", "delivered"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/myorders")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Loading your orders...</p>
          <div className="animate-spin text-2xl">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">📦 My Orders</h2>
          <p className="text-gray-600 mt-1">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 text-lg mb-6">No orders yet</p>
            <Link to="/" className="bg-gradient-primary hover:shadow-lg text-white px-8 py-3 rounded-lg text-sm font-semibold transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const currentStatusIndex = statusSteps.indexOf(order.status);
              return (
                <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Order ID</p>
                      <p className="text-lg font-bold text-gray-900 font-mono">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block text-sm px-4 py-2 rounded-full font-bold border ${statusColors[order.status]}`}>
                        {statusIcons[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      {statusSteps.map((step, i) => (
                        <div key={step} className="flex flex-col items-center flex-1 relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            currentStatusIndex >= i
                              ? "bg-primary text-white shadow-md"
                              : "bg-gray-200 text-gray-600"
                          }`}>
                            {statusIcons[step]}
                          </div>
                          <p className={`text-xs font-semibold mt-2 text-center ${
                            currentStatusIndex >= i ? "text-primary" : "text-gray-500"
                          }`}>
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </p>
                          {i < statusSteps.length - 1 && (
                            <div className={`absolute top-5 left-1/2 w-full h-1 ${
                              currentStatusIndex > i ? "bg-primary" : "bg-gray-200"
                            }`}
                              style={{
                                width: "calc(100% - 40px)",
                                left: "50%",
                                transform: "translateX(0)"
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Order Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">{item.productId?.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-secondary/5 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                      <p className="text-sm text-gray-800 font-medium max-w-sm">{order.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;