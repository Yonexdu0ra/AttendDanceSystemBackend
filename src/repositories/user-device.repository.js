import prisma from "../configs/prismaClient.js";

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findById = (id) =>
    prisma.userDevice.findUnique({ where: { id } });

// ─── Tìm theo userId + deviceId ───────────────────────────────────────────────
const findByUserAndDevice = (userId, deviceId) =>
    prisma.userDevice.findFirst({ where: { userId, deviceId } });

// ─── Lấy tất cả thiết bị của user ──────────────────────────────────────────────────
const findByUserId = ({ userId, skip = 0, take = 20 } = {}) =>
    prisma.userDevice.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
    });

// ─── Tổng số thiết bị của user ──────────────────────────────────────────────────
const countByUserId = (userId) =>
    prisma.userDevice.count({ where: { userId } });

// ─── Lấy tất cả thiết bị (admin) ──────────────────────────────────────────────────
const findMany = ({ skip = 0, take = 20, where = {}, orderBy = { createdAt: "desc" } } = {}) =>
    prisma.userDevice.findMany({ where, skip, take, orderBy });

// ─── Tổng số thiết bị ───────────────────────────────────────────────────────────────
const count = (where = {}) => prisma.userDevice.count({ where });

// ─── Lấy FCM tokens của nhiều user (dùng để gửi push notification) ───────────
const findFcmTokensByUserIds = (userIds) =>
    prisma.userDevice.findMany({
        where: {
            userId: { in: userIds },
            fcmToken: { not: null },
        },
        select: { userId: true, fcmToken: true, platform: true },
    });

// ─── Tạo mới ─────────────────────────────────────────────────────────────────
const create = (data) => prisma.userDevice.create({ data });

// ─── Cập nhật ─────────────────────────────────────────────────────────────────
const update = (id, data) =>
    prisma.userDevice.update({ where: { id }, data });

// ─── Upsert (cập nhật hoặc tạo mới thiết bị) ─────────────────────────────────
const upsert = (userId, deviceId, data) =>
    prisma.userDevice.upsert({
        where: {
            // upsert bằng unique index userId+deviceId
            idx_user_device: { userId, deviceId },
        },
        update: data,
        create: { userId, deviceId, ...data },
    });

// ─── Xóa theo ID ──────────────────────────────────────────────────────────────
const remove = (id) => prisma.userDevice.delete({ where: { id } });

// ─── Xóa tất cả thiết bị của user ────────────────────────────────────────────
const removeAllByUserId = (userId) =>
    prisma.userDevice.deleteMany({ where: { userId } });

export const userDeviceRepository = {
    findById,
    findByUserAndDevice,
    findByUserId,
    countByUserId,
    findMany,
    count,
    findFcmTokensByUserIds,
    create,
    update,
    upsert,
    remove,
    removeAllByUserId,
};

