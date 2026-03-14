import {   notificationService   } from "../services/index.js";

export const list = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, isRead, cursor, mode = "offset" } = req.query;
        if (mode === "cursor") {
            const result = await notificationService.getNotificationsCursor({
                userId: req.user.id,
                cursor,
                limit: Number(limit),
                isRead: isRead !== undefined ? isRead === "true" : undefined,
            });
            return res.json({ success: true, ...result });
        }
        const result = await notificationService.getNotifications({
            userId: req.user.id,
            page: Number(page),
            limit: Number(limit),
            isRead: isRead !== undefined ? isRead === "true" : undefined,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const countUnread = async (req, res, next) => {
    try {
        const count = await notificationService.countUnread(req.user.id);
        res.json({ success: true, data: { count } });
    } catch (err) { next(err); }
};

export const markAsRead = async (req, res, next) => {
    try {
        const { notificationIds } = req.body;
        const result = await notificationService.markAsRead(req.user.id, notificationIds);
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
};

export const markAllAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAllAsRead(req.user.id);
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
    try {
        await notificationService.remove(req.user.id, req.params.id);
        res.json({ success: true, message: "Đã xóa thông báo" });
    } catch (err) { next(err); }
};

export const removeAllRead = async (req, res, next) => {
    try {
        const result = await notificationService.removeAllRead(req.user.id);
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
};

