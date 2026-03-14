import prisma from "../configs/prismaClient.js";
import {   buildCursorClause   } from "../utils/cursor-pagination.js";

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findById = (id) => prisma.holiday.findUnique({ where: { id } });

// ─── Tìm theo ngày cụ thể ─────────────────────────────────────────────────────
const findByDate = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma.holiday.findFirst({
        where: { date: { gte: start, lte: end } },
    });
};

// ─── Tìm các ngày nghỉ trong một khoảng thời gian ────────────────────────────
const findByDateRange = (startDate, endDate) =>
    prisma.holiday.findMany({
        where: {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        },
        orderBy: { date: "asc" },
    });

// ─── Lấy danh sách (offset pagination) ───────────────────────────────────────
const findMany = ({
    skip = 0,
    take = 20,
    where = {},
    orderBy = { date: "asc" },
} = {}) =>
    prisma.holiday.findMany({ where, skip, take, orderBy });

// ─── Cursor-based pagination (dùng cho mobile) ───────────────────────────────
const findManyCursor = ({ cursor, take = 20, where = {}, orderBy = { date: "asc" } } = {}) =>
    prisma.holiday.findMany({
        where,
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy,
    });

// ─── Tổng số bản ghi ──────────────────────────────────────────────────────────
const count = (where = {}) => prisma.holiday.count({ where });

// ─── Tạo mới ─────────────────────────────────────────────────────────────────
const create = (data) => prisma.holiday.create({ data });

// ─── Tạo nhiều ngày nghỉ cùng lúc ────────────────────────────────────────────
const createMany = (data) => prisma.holiday.createMany({ data });

// ─── Cập nhật ─────────────────────────────────────────────────────────────────
const update = (id, data) =>
    prisma.holiday.update({ where: { id }, data });

// ─── Xóa ──────────────────────────────────────────────────────────────────────
const remove = (id) => prisma.holiday.delete({ where: { id } });

export const holidayRepository = {
    findById,
    findByDate,
    findByDateRange,
    findMany,
    findManyCursor,
    count,
    create,
    createMany,
    update,
    remove,
};

