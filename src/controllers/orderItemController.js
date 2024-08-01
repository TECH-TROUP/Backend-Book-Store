const OrderItem = require("../models/OrderItem");

exports.createOrderItem = (req, res) => {
  const { order_id, book_id, quantity, price } = req.body;

  if (!order_id || !book_id || !quantity || !price) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  const newOrderItem = {
    order_id,
    book_id,
    quantity,
    price,
  };

  OrderItem.create(newOrderItem, (err, orderItemId) => {
    if (err) res.status(500).send(err);
    else res.status(201).send({ id: orderItemId });
  });
};

exports.updateOrderItem = (req, res) => {
  const orderItemId = req.params.id;
  const { order_id, book_id, quantity, price } = req.body;

  const updatedOrderItem = {
    order_id,
    book_id,
    quantity,
    price,
  };

  OrderItem.update(orderItemId, updatedOrderItem, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Order item not found" });
    } else {
      res.status(200).send({ message: "Order item updated successfully" });
    }
  });
};

exports.deleteOrderItem = (req, res) => {
  const orderItemId = req.params.id;

  OrderItem.delete(orderItemId, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Order item not found" });
    } else {
      res.status(200).send({ message: "Order item deleted successfully" });
    }
  });
};

exports.getAllOrderItems = (req, res) => {
  OrderItem.getAll((err, orderItems) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(orderItems);
  });
};

exports.getOrderItemById = (req, res) => {
  const orderItemId = req.params.id;

  OrderItem.getById(orderItemId, (err, orderItem) => {
    if (err) res.status(500).send(err);
    else if (!orderItem) {
      res.status(404).send({ error: "Order item not found" });
    } else {
      res.status(200).send(orderItem);
    }
  });
};

exports.getOrderItemsByOrderId = (req, res) => {
  const orderId = req.params.orderId;

  OrderItem.getByOrderId(orderId, (err, orderItems) => {
    if (err) res.status(500).send(err);
    else if (orderItems.length === 0) {
      res.status(404).send({ error: "No order items found for this order ID" });
    } else {
      res.status(200).send(orderItems);
    }
  });
};
