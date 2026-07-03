import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [address, setAddress] = useState(""); // replaced hardcoded address
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cart").then(({ data }) => setCart(data));
  }, []);

  const removeItem = async (productId) => {
    await api.delete(`/cart/${productId}`);
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(i => i.productId._id !== productId)
    }));
  };

  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity, 0
  );

  const handleCheckout = async () => {
    // Validate address before proceeding
    if (!address.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    try {
      // Step 1: Create Razorpay order
      const { data } = await api.post("/payment/create-order", {
        amount: total
      });

      // Step 2: Place order in our DB first
      const orderItems = cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      }));

      const { data: order } = await api.post("/orders", {
        items: orderItems,
        totalAmount: total,
        address: address.trim() // use real address from input
      });

      // Step 3: Open Razorpay popup
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        order_id: data.orderId,
        name: "ShopApp",
        handler: async (response) => {
          // Step 4: Verify payment on backend
          await api.post("/payment/verify", {
            ...response,
            orderId: order._id
          });
          alert("Payment successful!");
          navigate("/orders");
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Checkout failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      {cart.items.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.productId._id}
              className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-medium text-sm">{item.productId.name}</p>
                <p className="text-xs text-gray-500">
                  ₹{item.productId.price} x {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.productId._id)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-4 mb-3">
            <p className="font-semibold mb-3">Total: ₹{total}</p>
            {/* Delivery address input */}
            <input
              className="w-full border rounded px-3 py-2 text-sm mb-3"
              placeholder="Enter delivery address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white px-6 py-2 rounded text-sm"
            >
              Pay with Razorpay
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;