import prisma from "../configs/prismaClient.js";
import {   buildCursorClause   } from "../utils/cursor-pagination.js";

// ─── Include mặc định ─────────────────────────────────────────────────────────
const defaultInclude = {
    user: { select: { id: true, email: true, profile: true } },
    job: { select: { id: true, title: true } },
    approver: { select: { id: true, email: true, profile: true } },
};

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findById = (id) =>
    prisma.overtimeRequest.findUnique({
        where: { id },
        include: defaultInclude,
    });

// ─── Lấy danh sách OT của một user (offset) ──────────────────────────────────
const findByUserId = ({
    userId,
    skip = 0,
    take = 20,
    status,
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.overtimeRequest.findMany({
        where: { userId, ...(status ? { status } : {}) },
        include: defaultInclude,
        skip,
        take,
        orderBy,
    });

// ─── Cursor-based pagination theo userId (dùng cho mobile) ─────────────────────
const findByUserIdCursor = ({
    userId,
    cursor,
    take = 20,
    status,
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.overtimeRequest.findMany({
        where: { userId, ...(status ? { status } : {}) },
        include: defaultInclude,
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy,
    });

// ─── Lấy danh sách OT của một job (offset) ───────────────────────────────────
const findByJobId = ({
    jobId,
    skip = 0,
    take = 20,
    status,
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.overtimeRequest.findMany({
        where: { jobId, ...(status ? { status } : {}) },
        include: defaultInclude,
        skip,
        take,
        orderBy,
    });

// ─── Cursor-based pagination theo jobId (dùng cho mobile) ──────────────────────
const findByJobIdCursor = ({
    jobId,
    cursor,
    take = 20,
    status,
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.overtimeRequest.findMany({
        where: { jobId, ...(status ? { status } : {}) },
        include: defaultInclude,
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy,
    });

// ─── Lấy tất cả đơn OT (admin) ───────────────────────────────────────────────
const findMany = ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.overtimeRequest.findMany({
        where,
        include: defaultInclude,
        skip,
        take,
        orderBy,
    });

// ─── Lấy danh sách OT theo ngày ──────────────────────────────────────────────
const findByDate = (date, where = {}) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma.overtimeRequest.findMany({
        where: {
            date: { gte: start, lte: end },
            ...where,
        },
        include: defaultInclude,
    });
};

// ─── Tổng số bản ghi ──────────────────────────────────────────────────────────
const count = (where = {}) => prisma.overtimeRequest.count({ where });

// ─── Tạo mới ─────────────────────────────────────────────────────────────────
const create = (data) =>
    prisma.overtimeRequest.create({
        data,
        include: defaultInclude,
    });

// ─── Cập nhật ─────────────────────────────────────────────────────────────────
const update = (id, data) =>
    prisma.overtimeRequest.update({
        where: { id },
        data,
        include: defaultInclude,
    });

// ─── Duyệt / Từ chối đơn OT ──────────────────────────────────────────────────
const review = (id, { status, reply, approvedBy }) =>
    prisma.overtimeRequest.update({
        where: { id },
        data: {
            status,
            reply,
            approvedBy,
            approverAt: new Date(),
        },
        include: defaultInclude,
    });

// ─── Xóa ──────────────────────────────────────────────────────────────────────
const remove = (id) => prisma.overtimeRequest.delete({ where: { id } });

export const overtimeRequestRepository = {
    findById,
    findByUserId,
    findByUserIdCursor,
    findByJobId,
    findByJobIdCursor,
    findByDate,
    findMany,
    count,
    create,
    update,
    review,
    remove,
};

