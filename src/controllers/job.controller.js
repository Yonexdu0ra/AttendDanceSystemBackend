import {   jobService, jobParticipantService   } from "../services/index.js";

// ─── Job CRUD ─────────────────────────────────────────────────────────────────
export const list = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, cursor, mode = "offset" } = req.query;
        if (mode === "cursor") {
            const result = await jobService.getJobsCursor({ cursor, limit: Number(limit), search });
            return res.json({ success: true, ...result });
        }
        const result = await jobService.getJobs({ page: Number(page), limit: Number(limit), search });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
    try {
        const data = await jobService.getJobById(req.params.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
    try {
        const data = await jobService.createJob({
            creatorId: req.user.id,
            dto: req.body,
        });
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
    try {
        const data = await jobService.updateJob({
            id: req.params.id,
            requesterId: req.user.id,
            isAdmin: ["ADMIN", "SUPER_ADMIN"].includes(req.user.role),
            dto: req.body,
        });
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
    try {
        await jobService.deleteJob(req.params.id);
        res.json({ success: true, message: "Đã xóa công việc" });
    } catch (err) { next(err); }
};

// ─── Manager ─────────────────────────────────────────────────────────────────
export const getManagers = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const result = await jobService.getManagersByJobId({
            jobId: req.params.id, page: Number(page), limit: Number(limit),
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const addManager = async (req, res, next) => {
    try {
        const data = await jobService.addManager({
            jobId: req.params.id,
            userId: req.body.userId,
            addedBy: req.user.id,
            isAdmin: ["ADMIN", "SUPER_ADMIN"].includes(req.user.role),
        });
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
};

export const removeManager = async (req, res, next) => {
    try {
        await jobService.removeManager({
            jobId: req.params.id,
            managerId: req.params.managerId,
            removedBy: req.user.id,
            isAdmin: ["ADMIN", "SUPER_ADMIN"].includes(req.user.role),
        });
        res.json({ success: true, message: "Đã xóa manager" });
    } catch (err) { next(err); }
};

// ─── Participant ──────────────────────────────────────────────────────────────
export const getParticipants = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const result = await jobParticipantService.getParticipantsByJobId({
            jobId: req.params.id, page: Number(page), limit: Number(limit), status,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const requestJoin = async (req, res, next) => {
    try {
        const data = await jobParticipantService.requestJoinJob({
            userId: req.user.id, jobId: req.params.id,
        });
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
};

export const addParticipant = async (req, res, next) => {
    try {
        const data = await jobParticipantService.addParticipant({
            userId: req.body.userId,
            jobId: req.params.id,
            addedBy: req.user.id,
        });
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
};

export const reviewParticipation = async (req, res, next) => {
    try {
        const { userId, status } = req.body;
        const data = await jobParticipantService.reviewParticipation({
            userId, jobId: req.params.id, status, reviewedBy: req.user.id,
        });
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const leaveJob = async (req, res, next) => {
    try {
        await jobParticipantService.leaveJob({
            userId: req.user.id, jobId: req.params.id,
        });
        res.json({ success: true, message: "Đã rời khỏi công việc" });
    } catch (err) { next(err); }
};

export const removeParticipant = async (req, res, next) => {
    try {
        await jobParticipantService.removeParticipant({
            userId: req.params.userId,
            jobId: req.params.id,
            removedBy: req.user.id,
        });
        res.json({ success: true, message: "Đã xóa thành viên" });
    } catch (err) { next(err); }
};

