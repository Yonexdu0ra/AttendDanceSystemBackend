import prisma from "../configs/prismaClient.js";

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findById = (id) =>
    prisma.session.findUnique({ where: { id } });

// ─── Tìm theo token ───────────────────────────────────────────────────────────
const findByToken = (token) =>
    prisma.session.findUnique({ where: { token }, include: { user: true } });

// ─── Lấy tất cả phiên của một user ─────────────────────────────────────────────────
const findByUserId = ({ userId, skip = 0, take = 20 } = {}) =>
    prisma.session.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
    });

// ─── Tổng số phiên của một user ───────────────────────────────────────────────
const countByUserId = (userId) =>
    prisma.session.count({ where: { userId } });

// ─── Lấy tất cả phiên (ảnh quản lý phương tiện admin) ──────────────────────────────
const findMany = ({ skip = 0, take = 20, where = {}, orderBy = { createdAt: "desc" } } = {}) =>
    prisma.session.findMany({ where, skip, take, orderBy, include: { user: { select: { id: true, email: true } } } });

// ─── Tổng số phiên ─────────────────────────────────────────────────────────────
const count = (where = {}) => prisma.session.count({ where });

// ─── Tạo mới ─────────────────────────────────────────────────────────────────
const create = (data) => prisma.session.create({ data });

// ─── Xóa theo token (logout) ──────────────────────────────────────────────────
const deleteByToken = (token) =>
    prisma.session.delete({ where: { token } });

// ─── Xóa tất cả session của user (logout tất cả thiết bị) ────────────────────
const deleteAllByUserId = (userId) =>
    prisma.session.deleteMany({ where: { userId } });

// ─── Xóa các session đã hết hạn ──────────────────────────────────────────────
const deleteExpired = () =>
    prisma.session.deleteMany({
        where: { expiresAt: { lt: new Date() } },
    });

export const sessionRepository = {
    findById,
    findByToken,
    findByUserId,
    countByUserId,
    findMany,
    count,
    create,
    deleteByToken,
    deleteAllByUserId,
    deleteExpired,
};

