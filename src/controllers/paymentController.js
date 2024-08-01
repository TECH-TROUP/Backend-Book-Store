const Payment = require("../models/Payment");

exports.createPayment = (req, res) => {
  const { user_id, payment_method, payment_date, amount } = req.body;

  if (!user_id || !payment_method || !payment_date || !amount) {
    return res.status(400).json({ error: "Please provide required fields" });
  }

  const newPayment = {
    user_id,
    payment_method,
    payment_date,
    amount,
  };

  Payment.create(newPayment, (err, paymentId) => {
    if (err) res.status(500).send(err);
    else res.status(201).send({ id: paymentId });
  });
};

exports.updatePayment = (req, res) => {
  const paymentId = req.params.id;
  const { user_id, payment_method, payment_date, amount } = req.body;

  const updatedPayment = {
    user_id,
    payment_method,
    payment_date,
    amount,
  };

  Payment.update(paymentId, updatedPayment, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Payment not found" });
    } else {
      res.status(200).send({ message: "Payment updated successfully" });
    }
  });
};

exports.deletePayment = (req, res) => {
  const paymentId = req.params.id;

  Payment.delete(paymentId, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Payment not found" });
    } else {
      res.status(200).send({ message: "Payment deleted successfully" });
    }
  });
};

exports.getAllPayments = (req, res) => {
  Payment.getAll((err, payments) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(payments);
  });
};

exports.getPaymentById = (req, res) => {
  const paymentId = req.params.id;

  Payment.getById(paymentId, (err, payment) => {
    if (err) res.status(500).send(err);
    else if (!payment) {
      res.status(404).send({ error: "Payment not found" });
    } else {
      res.status(200).send(payment);
    }
  });
};

exports.getPaymentsByUserId = (req, res) => {
  const userId = req.params.userId;

  Payment.getByUserId(userId, (err, payments) => {
    if (err) res.status(500).send(err);
    else if (payments.length === 0) {
      res.status(404).send({ error: "No payments found for this user ID" });
    } else {
      res.status(200).send(payments);
    }
  });
};
