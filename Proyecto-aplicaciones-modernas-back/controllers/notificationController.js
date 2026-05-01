import {
  getNotificationsByUser,
  markNotificationAsRead,
} from "../models/notificationModel.js";

export async function listNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const notifications = await getNotificationsByUser(userId);
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    res.json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function readNotification(req, res, next) {
  try {
    const userId = req.user.id;
    const notificationId = Number(req.params.id);
    const updated = await markNotificationAsRead(userId, notificationId);
    if (!updated) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }
    res.json({ message: "Notificación marcada como leída", notification: updated });
  } catch (err) {
    next(err);
  }
}
