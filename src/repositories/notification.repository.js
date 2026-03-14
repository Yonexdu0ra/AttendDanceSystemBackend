import prisma from "../configs/prismaClient.js";
import {   buildCursorClause   } from "../utils/cursor-pagination.js";

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findById = (id) =>
    prisma.notification.findUnique({ where: { id } });

// ─── Lấy danh sách thông báo của user (offset) ────────────────────────────────
const findByUserId = ({
    userId,
    skip = 0,
    take = 20,
    isRead,
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.notification.findMany({
        where: {
            userId,
            ...(isRead !== undefined ? { isRead } : {}),
        },
        skip,
        take,
        orderBy,
    });

// ─── Cursor-based pagination (dùng cho mobile) ───────────────────────────────
const findByUserIdCursor = ({ userId, cursor, take = 20, isRead } = {}) =>
    prisma.notification.findMany({
        where: {
            userId,
            ...(isRead !== undefined ? { isRead } : {}),
        },
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy: { createdAt: "desc" },
    });

// ─── Đếm thông báo chưa đọc ───────────────────────────────────────────────────
const countUnread = (userId) =>
    prisma.notification.count({ where: { userId, isRead: false } });

// ─── Tổng số bản ghi ──────────────────────────────────────────────────────────
const count = (where = {}) => prisma.notification.count({ where });

// ─── Tạo mới (gửi cho 1 người) ───────────────────────────────────────────────
const create = (data) => prisma.notification.create({ data });

// ─── Tạo nhiều (broadcast cho nhiều người) ────────────────────────────────────
const createMany = (data) => prisma.notification.createMany({ data });

// ─── Đánh dấu đã đọc nhiều thông báo ─────────────────────────────────────────
const markManyAsRead = (ids, userId) =>
    prisma.notification.updateMany({
        where: { id: { in: ids }, userId },
        data: { isRead: true, readAt: new Date() },
    });

// ─── Đánh dấu tất cả là đã đọc ───────────────────────────────────────────────
const markAllAsRead = (userId) =>
    prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
    });

// ─── Xóa ──────────────────────────────────────────────────────────────────────
const remove = (id) => prisma.notification.delete({ where: { id } });

// ─── Xóa tất cả thông báo đã đọc của user ────────────────────────────────────
const removeAllRead = (userId) =>
    prisma.notification.deleteMany({ where: { userId, isRead: true } });

export const notificationRepository = {
    findById,
    findByUserId,
    findByUserIdCursor,
    countUnread,
    count,
    create,
    createMany,
    markManyAsRead,
    markAllAsRead,
    remove,
    removeAllRead,
};

