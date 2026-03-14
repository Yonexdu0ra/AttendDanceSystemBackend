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
    prisma.leaveRequest.findUnique({
        where: { id },
        include: defaultInclude,
    });

// ─── Lấy danh sách đơn nghỉ của một user (offset) ────────────────────────────
const findByUserId = ({
    userId,
    skip = 0,
    take = 20,
    status,
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.leaveRequest.findMany({
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
    prisma.leaveRequest.findMany({
        where: { userId, ...(status ? { status } : {}) },
        include: defaultInclude,
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy,
    });

// ─── Lấy danh sách đơn nghỉ của một job (offset) ─────────────────────────────
const findByJobId = ({
    jobId,
    skip = 0,
    take = 20,
    status,
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.leaveRequest.findMany({
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
    prisma.leaveRequest.findMany({
        where: { jobId, ...(status ? { status } : {}) },
        include: defaultInclude,
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy,
    });

// ─── Lấy tất cả đơn (admin) ───────────────────────────────────────────────────
const findMany = ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.leaveRequest.findMany({
        where,
        include: defaultInclude,
        skip,
        take,
        orderBy,
    });

// ─── Tổng số bản ghi ──────────────────────────────────────────────────────────
const count = (where = {}) => prisma.leaveRequest.count({ where });

// ─── Tạo mới ─────────────────────────────────────────────────────────────────
const create = (data) =>
    prisma.leaveRequest.create({
        data,
        include: defaultInclude,
    });

// ─── Cập nhật ─────────────────────────────────────────────────────────────────
const update = (id, data) =>
    prisma.leaveRequest.update({
        where: { id },
        data,
        include: defaultInclude,
    });

// ─── Duyệt / Từ chối đơn ─────────────────────────────────────────────────────
const review = (id, { status, reply, approvedBy }) =>
    prisma.leaveRequest.update({
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
const remove = (id) => prisma.leaveRequest.delete({ where: { id } });

export const leaveRequestRepository = {
    findById,
    findByUserId,
    findByUserIdCursor,
    findByJobId,
    findByJobIdCursor,
    findMany,
    count,
    create,
    update,
    review,
    remove,
};

