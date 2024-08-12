const db = require("../config/db");

const Order = {};

// Add a new order
Order.create = (order, callback) => {
  const query =
    "INSERT INTO orders (user_id, order_date, total_price, payment_id, status_id) VALUES (?, NOW(), ?, ?, ?)";
  db.query(
    query,
    [order.user_id, order.totalPrice, order.payment_id, order.status_id],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

// Update an order
Order.update = (orderId, updatedOrder, callback) => {
  const query =
    "UPDATE orders SET user_id = ?, order_date = ?, total_price = ?, payment_id = ?, status = ? WHERE id = ?";
  db.query(
    query,
    [
      updatedOrder.user_id,
      updatedOrder.order_date,
      updatedOrder.totalPrice,
      updatedOrder.payment_id,
      updatedOrder.status,
      orderId,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res);
    }
  );
};

// Delete an order
Order.delete = (orderId, callback) => {
  const query = "DELETE FROM orders WHERE id = ?";
  db.query(query, [orderId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get all orders
Order.getAll = (callback) => {
  const query = "SELECT * FROM orders";
  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

Order.getById = (orderId, callback) => {
  const query = `
    SELECT o.id AS order_id, o.user_id, o.total_price, o.status_id AS order_status_id, p.id AS payment_id, p.payment_method, p.amount AS payment_amount,
           oi.id AS order_item_id, oi.book_id, oi.quantity, oi.price AS order_item_price, b.title AS book_title, b.author AS book_author, b.image_url as book_image_url
    FROM orders o
    LEFT JOIN payments p ON o.payment_id = p.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN books b ON oi.book_id = b.id
    WHERE o.id = ?;
  `;

  db.query(query, [orderId], (err, rows) => {
    if (err) callback(err, null);
    else {
      // Process the rows to structure the data
      const order = {
        id: rows[0]?.order_id,
        user_id: rows[0]?.user_id,
        totalPrice: rows[0]?.total_price,
        status_id: rows[0]?.order_status_id,
        payment: {
          id: rows[0]?.payment_id,
          method: rows[0]?.payment_method,
          amount: rows[0]?.payment_amount,
        },
        items: rows.map((row) => ({
          id: row.order_item_id,
          book_id: row.book_id,
          quantity: row.quantity,
          price: row.order_item_price,
          book: {
            title: row.book_title,
            author: row.book_author,
            image_url: row.book_image_url,
          },
        })),
      };

      callback(null, order);
    }
  });
};

Order.getByUserId = (userId, statusId, callback) => {
  let query = `
    SELECT o.id AS order_id, o.user_id, o.total_price, o.status_id AS order_status_id, 
           os.label AS order_status_label, 
           p.id AS payment_id, p.payment_method, p.amount AS payment_amount,
           oi.id AS order_item_id, oi.book_id, oi.quantity, oi.price AS order_item_price, 
           b.title AS book_title, b.author AS book_author, b.image_url as book_image_url
    FROM orders o
    LEFT JOIN payments p ON o.payment_id = p.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN books b ON oi.book_id = b.id
    LEFT JOIN order_statuses os ON o.status_id = os.id
    WHERE o.user_id = ?`;

  const params = [userId];

  if (statusId) {
    query += " AND o.status_id = ?";
    params.push(statusId);
  }

  db.query(query, params, (err, rows) => {
    if (err) callback(err, null);
    else {
      // Group orders by order ID
      const orders = {};
      rows.forEach((row) => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            id: row.order_id,
            user_id: row.user_id,
            totalPrice: row.total_price,
            status: {
              id: row.order_status_id,
              label: row.order_status_label,
            },
            payment: {
              id: row.payment_id,
              method: row.payment_method,
              amount: row.payment_amount,
            },
            items: [],
          };
        }

        orders[row.order_id].items.push({
          id: row.order_item_id,
          book_id: row.book_id,
          quantity: row.quantity,
          price: row.order_item_price,
          book: {
            title: row.book_title,
            author: row.book_author,
            image_url: row.book_image_url,
          },
        });
      });

      // Convert orders object to an array
      const ordersArray = Object.values(orders);
      callback(null, ordersArray);
    }
  });
};

module.exports = Order;
