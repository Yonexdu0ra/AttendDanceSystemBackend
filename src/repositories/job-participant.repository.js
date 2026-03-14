import prisma from "../configs/prismaClient.js";

// ═══════════════════════════════════════════════════════════════════════════════
// JOB MANAGER REPOSITORY
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findManagerById = (id) =>
    prisma.jobManager.findUnique({ where: { id }, include: { user: true, job: true } });

// ─── Lấy tất cả manager của một job ─────────────────────────────────────────
const findManagersByJobId = ({ jobId, skip = 0, take = 50 } = {}) =>
    prisma.jobManager.findMany({
        where: { jobId },
        include: {
            user: { select: { id: true, email: true, profile: true } },
        },
        skip,
        take,
        orderBy: { createdAt: "asc" },
    });

// ─── Tổng số manager của một job ────────────────────────────────────────────────
const countManagers = (jobId) =>
    prisma.jobManager.count({ where: { jobId } });

// ─── Lấy tất cả jobs mà user đang quản lý ───────────────────────────────
const findJobsByManagerId = ({ userId, skip = 0, take = 20 } = {}) =>
    prisma.jobManager.findMany({
        where: { userId },
        include: { job: true },
        skip,
        take,
        orderBy: { createdAt: "desc" },
    });

// ─── Thêm manager vào job ─────────────────────────────────────────────────────
const createManager = (data) =>
    prisma.jobManager.create({ data, include: { user: true, job: true } });

// ─── Xóa manager khỏi job ────────────────────────────────────────────────────
const deleteManager = (id) =>
    prisma.jobManager.delete({ where: { id } });

// ─── Kiểm tra user có phải manager của job không ─────────────────────────────
const isManager = (userId, jobId) =>
    prisma.jobManager.findFirst({ where: { userId, jobId } });

export const jobManagerRepository = {
    findManagerById,
    findManagersByJobId,
    countManagers,
    findJobsByManagerId,
    createManager,
    deleteManager,
    isManager,
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER JOINED JOB REPOSITORY
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Tìm theo ID ──────────────────────────────────────────────────────────────
const findJoinById = (id) =>
    prisma.userJoinedJob.findUnique({ where: { id }, include: { user: true, job: true } });

// ─── Tìm theo userId + jobId (unique) ────────────────────────────────────────
const findJoin = (userId, jobId) =>
    prisma.userJoinedJob.findUnique({
        where: { idx_user_job: { userId, jobId } },
    });

// ─── Lấy danh sách participants của một job (offset) ───────────────────────────
const findParticipantsByJobId = ({ jobId, skip = 0, take = 20, status, orderBy = { createdAt: "asc" } } = {}) =>
    prisma.userJoinedJob.findMany({
        where: { jobId, ...(status ? { status } : {}) },
        include: {
            user: { select: { id: true, email: true, profile: true } },
        },
        skip,
        take,
        orderBy,
    });

// ─── Lấy danh sách jobs mà user đã tham gia (offset) ─────────────────────────
const findJobsByUserId = ({ userId, skip = 0, take = 20, status, orderBy = { createdAt: "desc" } } = {}) =>
    prisma.userJoinedJob.findMany({
        where: { userId, ...(status ? { status } : {}) },
        include: { job: true },
        skip,
        take,
        orderBy,
    });

// ─── Tổng số participants của một job ────────────────────────────────────────
const countParticipants = (jobId, status) =>
    prisma.userJoinedJob.count({
        where: { jobId, ...(status ? { status } : {}) },
    });

// ─── Thêm user vào job ────────────────────────────────────────────────────────
const createJoin = (data) =>
    prisma.userJoinedJob.create({ data, include: { user: true, job: true } });

// ─── Cập nhật trạng thái tham gia ────────────────────────────────────────────
const updateJoinStatus = (userId, jobId, status) =>
    prisma.userJoinedJob.update({
        where: { idx_user_job: { userId, jobId } },
        data: { status },
    });

// ─── Xóa user khỏi job ────────────────────────────────────────────────────────
const deleteJoin = (userId, jobId) =>
    prisma.userJoinedJob.delete({
        where: { idx_user_job: { userId, jobId } },
    });

export const userJoinedJobRepository = {
    findJoinById,
    findJoin,
    findParticipantsByJobId,
    findJobsByUserId,
    countParticipants,
    createJoin,
    updateJoinStatus,
    deleteJoin,
};

