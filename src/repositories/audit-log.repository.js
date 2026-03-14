import prisma from "../configs/prismaClient.js";
import {   buildCursorClause   } from "../utils/cursor-pagination.js";

// ─── Tạo mới log ─────────────────────────────────────────────────────────────
const create = (data) => prisma.auditLog.create({ data });

// ─── Lấy danh sách log (offset pagination) ────────────────────────────────────
const findMany = ({
    skip = 0,
    take = 50,
    where = {},
    orderBy = { createdAt: "desc" },
} = {}) =>
    prisma.auditLog.findMany({ where, skip, take, orderBy });

// ─── Lấy log theo userId ──────────────────────────────────────────────────────
const findByUserId = ({ userId, skip = 0, take = 50 } = {}) =>
    prisma.auditLog.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
    });

// ─── Cursor-based pagination theo userId (dùng cho mobile) ─────────────────────
const findByUserIdCursor = ({ userId, cursor, take = 50 } = {}) =>
    prisma.auditLog.findMany({
        where: { userId },
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy: { createdAt: "desc" },
    });

// ─── Cursor-based pagination toàn bộ (admin, dùng cho mobile) ────────────────
const findManyCursor = ({ cursor, take = 50, where = {} } = {}) =>
    prisma.auditLog.findMany({
        where,
        take: take + 1,
        ...buildCursorClause(cursor),
        orderBy: { createdAt: "desc" },
    });

// ─── Lấy log theo resource ────────────────────────────────────────────────────
const findByResource = (resource, resourceId) =>
    prisma.auditLog.findMany({
        where: { resource, ...(resourceId ? { resourceId } : {}) },
        orderBy: { createdAt: "desc" },
    });

// ─── Tổng số bản ghi ──────────────────────────────────────────────────────────
const count = (where = {}) => prisma.auditLog.count({ where });

export const auditLogRepository = {
    create,
    findMany,
    findManyCursor,
    findByUserId,
    findByUserIdCursor,
    findByResource,
    count,
};

