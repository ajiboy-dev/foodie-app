const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST place a new order
// Body: { customerName, customerPhone, deliveryAddress, items: [...] }
router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, deliveryAddress, items } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order must have at least one item" });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const deliveryFee = 500;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      subtotal,
      deliveryFee,
      total,
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update order status
// Body: { status: "confirmed" | "preparing" | "delivered" | "cancelled" }
router.patch("/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
