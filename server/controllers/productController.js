const Product = require("../models/Product");

// GET /api/products — with search and filters
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, rating } = req.query;

    // Build query dynamically based on what filters are passed
    // Interview point: "I build the query object conditionally
    // so one API handles all filter combinations"
    let query = {};

    if (search) {
      query.$text = { $search: search }; // Uses text index
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Pagination — never load all products at once
    // Interview point: "skip + limit ensures only current page
    // loads — essential for large catalogs"
    const currentPage = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;
    const skip = (currentPage - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(pageSize);

    res.json({
      products,
      page: currentPage,
      totalPages: Math.ceil(total / pageSize),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products — admin only
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id — admin only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated document
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id — admin only
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};