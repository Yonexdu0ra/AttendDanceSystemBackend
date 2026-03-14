import prisma from "../configs/prismaClient.js";
import {   buildCursorClause   } from "../utils/cursor-pagination.js";

// ─── Include mặc định ─────────────────────────────────────────────────────────
const defaultInclude = {
    user: { select: { id: true, email: true, profile: true } },
    job: { select: { id: true, title: true } },
};

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findById = (id) =>
    prisma.attendance.findUnique({
        where: { id },
        include: defaultInclude,
    });

// ─── Tìm bản ghi chấm công của user trong một ngày ───────────────────────────
const findByUserAndDate = (userId, date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma.attendance.findFirst({
        where: {
            userId,
            date: { gte: start, lte: end },
        },
        include: defaultInclude,
    });
};

// ─── Lấy lịch sử chấm công của một user (offset) ────────────────────────────
const findByUserId = ({
    userId,
    skip = 0,
    take = 20,
    type,
    status,
    orderBy = { date: "desc" },
} = {}) =>
    prisma.attendance.findMany({
        where: {
            userId,
            ...(type ? { type } : {}),
            ...(status ? { status } : {}),
        },
        include: defaultInclude,
        skip,
        take,
        orderBy,
    });

// ─── Cursor-based pagination theo userId (dùng cho mobile) ────────────────────
const findByUserIdCursor = ({
    userId,
    cursor,
    take = 20,
    type,
    status,
    orderBy = { date: "desc" },
} = {}) =>
    prisma.attendance.findMany({
        where: {
            userId,
            ...(type ? { type } : {}),
            ...(status ? { status } : {}),
        },
        include: defaultInclude,
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy,
    });

// ─── Lấy danh sách chấm công của một job (offset) ────────────────────────────
const findByJobId = ({
    jobId,
    skip = 0,
    take = 20,
    type,
    status,
    orderBy = { date: "desc" },
} = {}) =>
    prisma.attendance.findMany({
        where: {
            jobId,
            ...(type ? { type } : {}),
            ...(status ? { status } : {}),
        },
        include: defaultInclude,
        skip,
        take,
        orderBy,
    });

// ─── Cursor-based pagination theo jobId (dùng cho mobile) ────────────────────
const findByJobIdCursor = ({
    jobId,
    cursor,
    take = 20,
    type,
    status,
    orderBy = { date: "desc" },
} = {}) =>
    prisma.attendance.findMany({
        where: {
            jobId,
            ...(type ? { type } : {}),
            ...(status ? { status } : {}),
        },
        include: defaultInclude,
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy,
    });

// ─── Lấy danh sách chấm công theo khoảng thời gian ───────────────────────────
const findByDateRange = ({
    userId,
    jobId,
    startDate,
    endDate,
    type,
    status,
} = {}) =>
    prisma.attendance.findMany({
        where: {
            ...(userId ? { userId } : {}),
            ...(jobId ? { jobId } : {}),
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
            ...(type ? { type } : {}),
            ...(status ? { status } : {}),
        },
        include: defaultInclude,
        orderBy: { date: "asc" },
    });

// ─── Lấy danh sách nghi ngờ gian lận ─────────────────────────────────────────
const findFraudulent = ({
    jobId,
    skip = 0,
    take = 20,
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.attendance.findMany({
        where: {
            isFraud: true,
            ...(jobId ? { jobId } : {}),
        },
        include: defaultInclude,
        skip,
        take,
        orderBy,
    });

// ─── Tổng số bản ghi ──────────────────────────────────────────────────────────
const count = (where = {}) => prisma.attendance.count({ where });

// ─── Tạo mới (check-in) ───────────────────────────────────────────────────────
const create = (data) =>
    prisma.attendance.create({
        data,
        include: defaultInclude,
    });

// ─── Cập nhật (check-out, sửa trạng thái…) ───────────────────────────────────
const update = (id, data) =>
    prisma.attendance.update({
        where: { id },
        data,
        include: defaultInclude,
    });

// ─── Duyệt / Từ chối chấm công ───────────────────────────────────────────────
const updateStatus = (id, status) =>
    prisma.attendance.update({
        where: { id },
        data: { status },
        include: defaultInclude,
    });

// ─── Cập nhật thông tin gian lận ──────────────────────────────────────────────
const markFraud = (id, isFraud, fraudReason = null) =>
    prisma.attendance.update({
        where: { id },
        data: { isFraud, fraudReason },
        select: { id: true, isFraud: true, fraudReason: true },
    });

// ─── Xóa ──────────────────────────────────────────────────────────────────────
const remove = (id) => prisma.attendance.delete({ where: { id } });

export const attendanceRepository = {
    findById,
    findByUserAndDate,
    findByUserId,
    findByUserIdCursor,
    findByJobId,
    findByJobIdCursor,
    findByDateRange,
    findFraudulent,
    count,
    create,
    update,
    updateStatus,
    markFraud,
    remove,
};

