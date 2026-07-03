require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const sampleProducts = [
  {
    name: "Wireless Headphones",
    price: 2999,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life",
    category: "Electronics",
    stock: 15,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
  },
  {
    name: "Smart Watch",
    price: 499,
    description: "Durable braided USB-C charging cable for phones and laptops",
    category: "Accessories",
    stock: 50,
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtYXJ0JTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D"
  },
  {
    name: "Laptop Stand",
    price: 1299,
    description: "Adjustable ergonomic aluminum laptop stand for better posture",
    category: "Office",
    stock: 20,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFwdG9wJTIwc3RhbmR8ZW58MHx8MHx8fDA%3D"
  },
  {
    name: "Wireless Mouse",
    price: 799,
    description: "Precision wireless mouse with 2.4GHz connectivity and silent clicks",
    category: "Electronics",
    stock: 30,
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop"
  },
  {
    name: "Mechanical Keyboard",
    price: 3499,
    description: "Premium mechanical keyboard with RGB backlighting and tactile switches",
    category: "Electronics",
    stock: 12,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&h=400&fit=crop"
  },
  {
    name: "Phone Case",
    price: 299,
    description: "Protective slim phone case with military-grade shock absorption",
    category: "Accessories",
    stock: 100,
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1678930427302-381e63fbe826?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHBob25lJTIwY2FzZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    name: "Bluetooth Speaker",
    price: 1599,
    description: "7-port USB 3.0 hub with fast data transfer and plug-and-play",
    category: "Accessories",
    stock: 25,
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    name: "Desk Lamp",
    price: 1899,
    description: "LED desk lamp with adjustable brightness and USB charging port",
    category: "Office",
    stock: 18,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1621177555452-bedbe4c28879?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVzayUyMGxhbXB8ZW58MHx8MHx8fDA%3D"
  },
  {
    name: "Webcam HD",
    price: 2499,
    description: "1080p HD webcam with built-in microphone for video calls",
    category: "Electronics",
    stock: 22,
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1623949556303-b0d17d198863?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViY2FtJTIwaGR8ZW58MHx8MHx8fDA%3D"
  },
  {
    name: "Monitor Light Bar",
    price: 1199,
    description: "Screen light bar with auto-dimming and no screen glare",
    category: "Office",
    stock: 35,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=400&fit=crop"
  },
  {
    name: "Bluetooth Speaker",
    price: 1799,
    description: "Portable waterproof Bluetooth speaker with 12-hour playtime",
    category: "Electronics",
    stock: 28,
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"
  },
  {
    name: "Cable Organizer",
    price: 349,
    description: "Magnetic cable organizer clips to keep your desk tidy",
    category: "Accessories",
    stock: 80,
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop"
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const result = await Product.insertMany(sampleProducts);
    console.log(`✅ ${result.length} products added successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedProducts();