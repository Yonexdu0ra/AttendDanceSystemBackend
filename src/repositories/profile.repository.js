import prisma from "../configs/prismaClient.js";

// ─── Tìm theo userId ──────────────────────────────────────────────────────────
const findByUserId = (userId) =>
    prisma.profile.findUnique({ where: { userId } });

// ─── Tìm theo profileId ───────────────────────────────────────────────────────
const findById = (id) =>
    prisma.profile.findUnique({ where: { id } });

// ─── Tạo mới ─────────────────────────────────────────────────────────────────
const create = (data) =>
    prisma.profile.create({ data });

// ─── Cập nhật theo userId ─────────────────────────────────────────────────────
const updateByUserId = (userId, data) =>
    prisma.profile.update({
        where: { userId },
        data,
    });

// ─── Xóa theo userId ──────────────────────────────────────────────────────────
const deleteByUserId = (userId) =>
    prisma.profile.delete({ where: { userId } });

export const profileRepository = {
    findById,
    findByUserId,
    create,
    updateByUserId,
    deleteByUserId,
};

