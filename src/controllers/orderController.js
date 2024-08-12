const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Payment = require("../models/Payment");
const OrderItem = require("../models/OrderItem");
const BookCopy = require("../models/BookCopy");
const Book = require("../models/Book");

// Create a new order
exports.createOrder = (req, res) => {
  const userId = req.user.id;

  Cart.getByUserId(userId, async (err, items) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve cart items", details: err });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    try {
      let totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create new Payment
      const newPayment = {
        user_id: userId,
        payment_method: "card",
        amount: totalPrice,
      };

      Payment.create(newPayment, async (paymentErr, paymentId) => {
        if (paymentErr) {
          return res
            .status(500)
            .json({ error: "Failed to add payment", details: paymentErr });
        }

        // Create new Order
        const newOrder = {
          user_id: userId,
          totalPrice: totalPrice,
          payment_id: paymentId,
          status_id: 1, // 1 is for pending order
        };

        Order.create(newOrder, async (orderErr, orderId) => {
          if (orderErr) {
            return res
              .status(500)
              .json({ error: "Failed to create order", details: orderErr });
          }

          try {
            // Create order items and update book copies status
            for (const item of items) {
              // Create new Order Item
              await createOrderItem(item, orderId);
              // Update Book Copy Status
              await updateBookCopiesStatus(item);
              // Clear Cart
              await clearCart(userId, item.book_id);
              // Increment purchase count
              Book.incrementPurchaseCount(
                item.book_id,
                (incremErr, incremRes) => {
                  if (incremErr) {
                    reject({
                      error: "Failed to increment purchase count",
                      details: incremErr,
                    });
                  }
                }
              );
            }

            res.status(200).json({ success: true, orderId: orderId });
          } catch (error) {
            console.error("Error processing order:", error);
            res.status(500).json({
              error: "An error occurred while processing the order",
              details: error,
            });
          }
        });
      });
    } catch (error) {
      console.error("Error calculating total price:", error);
      res
        .status(500)
        .json({ error: "An error occurred while calculating total price" });
    }
  });
};

function createOrderItem(item, orderId) {
  return new Promise((resolve, reject) => {
    const newOrderItem = {
      order_id: orderId,
      book_id: item.book_id,
      quantity: item.quantity,
      price: item.price * item.quantity,
    };

    OrderItem.create(newOrderItem, (orderItemErr) => {
      if (orderItemErr) {
        reject({ error: "Failed to create order item", details: orderItemErr });
      } else {
        resolve();
      }
    });
  });
}

function updateBookCopiesStatus(item) {
  return new Promise((resolve, reject) => {
    BookCopy.getAvailableCopies(
      item.book_id,
      item.quantity,
      (availableErr, availableCopies) => {
        if (availableErr) {
          return reject({
            error: "Failed to get available copies",
            details: availableErr,
          });
        }

        let updatePromises = availableCopies.map(
          (copy) =>
            new Promise((resolve, reject) => {
              BookCopy.updateStatus(copy.id, 12, (err) => {
                if (err)
                  return reject({
                    error: "Failed to update book copy status",
                    details: err,
                  });

                Book.updateStock(copy.book_id, -1, 0, (stockErr) => {
                  if (stockErr)
                    return reject({
                      error: "Failed to update stock",
                      details: stockErr,
                    });

                  Book.getById(copy.book_id, (bookErr, book) => {
                    if (bookErr)
                      return reject({
                        error: "Failed to get book details",
                        details: bookErr,
                      });

                    if (
                      book.stock === 0 &&
                      book.stock_rent === 0 &&
                      book.status_id !== 13
                    ) {
                      Book.updateStatus(copy.book_id, 13, (statusErr) => {
                        if (statusErr)
                          return reject({
                            error:
                              "Failed to update book status to Out-of-Stock",
                            details: statusErr,
                          });
                        resolve();
                      });
                    } else if (
                      (book.stock > 0 || book.stock_rent > 0) &&
                      book.status_id === 13
                    ) {
                      Book.updateStatus(copy.book_id, 2, (statusErr) => {
                        if (statusErr)
                          return reject({
                            error: "Failed to update book status to Approved",
                            details: statusErr,
                          });
                        resolve();
                      });
                    } else {
                      resolve();
                    }
                  });
                });
              });
            })
        );

        Promise.all(updatePromises)
          .then(() => resolve())
          .catch((error) => reject(error));
      }
    );
  });
}

function clearCart(userId, bookId) {
  return new Promise((resolve, reject) => {
    Cart.remove(userId, bookId, (removeErr) => {
      if (removeErr) {
        reject({
          error: "Failed to remove items from the cart",
          details: removeErr,
        });
      } else {
        resolve();
      }
    });
  });
}

// Update an order
exports.updateOrder = (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  const { order_date, totalPrice, payment_id, status } = req.body;

  // Create an updated order object
  const updatedOrder = {
    user_id: userId,
    order_date, // Make sure this is a valid date format
    totalPrice,
    payment_id,
    status,
  };

  // Call the update method from the Order model
  Order.update(orderId, updatedOrder, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to update order", details: err });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(200).json({ message: "Order updated successfully" });
    }
  });
};

// Delete an order
exports.deleteOrder = (req, res) => {
  const orderId = req.params.id;

  // Call the delete method from the Order model
  Order.delete(orderId, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete order", details: err });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(200).json({ message: "Order deleted successfully" });
    }
  });
};

// Get all orders
exports.getAllOrders = (req, res) => {
  // Call the getAll method from the Order model
  Order.getAll((err, orders) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to retrieve orders", details: err });
    } else {
      res.status(200).json(orders);
    }
  });
};

// Get a specific order by ID
exports.getOrderById = (req, res) => {
  const orderId = req.params.id;

  // Call the getById method from the Order model
  Order.getById(orderId, (err, order) => {
    if (err) {
      res.status(500).json({ error: "Failed to retrieve order", details: err });
    } else {
      res.status(200).json(order);
    }
  });
};

// Get orders by user ID
exports.getOrdersByUserId = (req, res) => {
  const userId = req.user.id;
  const { statusId } = req.body;

  Order.getByUserId(userId, statusId, (err, orders) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to retrieve orders", details: err });
    } else {
      res.status(200).json(orders);
    }
  });
};
