import { listOrdersByUser } from "../models/orderModel.js";

export async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const orders = await listOrdersByUser(userId);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}
