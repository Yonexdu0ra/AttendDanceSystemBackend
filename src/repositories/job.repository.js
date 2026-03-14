import prisma from "../configs/prismaClient.js";

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findById = (id) =>
    prisma.job.findUnique({
        where: { id },
        include: { manager: { include: { user: true } } },
    });

// ─── Lấy danh sách (offset pagination) ───────────────────────────────────────
const findMany = ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.job.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
            manager: {
                select: {
                    id: true,
                    user: { select: { id: true, email: true, profile: true } },
                },
            },
            _count: { select: { userJoinedJobs: true } },
        },
    });

// ─── Cursor-based pagination (dùng cho mobile) ───────────────────────────────
const findManyCursor = ({ cursor, take = 20, where = {} } = {}) =>
    prisma.job.findMany({
        where,
        take: take + 1, // lấy thêm 1 để xác định hasMore
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
    });

// ─── Tổng số bản ghi ──────────────────────────────────────────────────────────
const count = (where = {}) => prisma.job.count({ where });

// ─── Tạo mới ─────────────────────────────────────────────────────────────────
const create = (data) => prisma.job.create({ data });

// ─── Cập nhật ─────────────────────────────────────────────────────────────────
const update = (id, data) =>
    prisma.job.update({ where: { id }, data });

// ─── Xóa ──────────────────────────────────────────────────────────────────────
const remove = (id) => prisma.job.delete({ where: { id } });

// ─── Lấy các jobs mà một user đang tham gia ──────────────────────────────────
const findByUserId = (userId) =>
    prisma.job.findMany({
        where: {
            userJoinedJobs: {
                some: { userId, status: "APPROVED" },
            },
        },
    });

export const jobRepository = {
    findById,
    findMany,
    findManyCursor,
    count,
    create,
    update,
    remove,
    findByUserId,
};

