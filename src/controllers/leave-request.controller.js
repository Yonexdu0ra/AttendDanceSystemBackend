import {   leaveRequestService   } from "../services/index.js";

export const list = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status, cursor, mode = "offset" } = req.query;
        if (mode === "cursor") {
            const result = await leaveRequestService.getLeaveRequestsByUserIdCursor({
                userId: req.user.id, cursor, limit: Number(limit), status,
            });
            return res.json({ success: true, ...result });
        }
        const result = await leaveRequestService.getLeaveRequestsByUserId({
            userId: req.user.id, page: Number(page), limit: Number(limit), status,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const listByJob = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const result = await leaveRequestService.getLeaveRequestsByJobId({
            jobId: req.params.jobId, page: Number(page), limit: Number(limit), status,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const listAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status, userId, jobId, leaveType } = req.query;
        const result = await leaveRequestService.getAllLeaveRequests({
            page: Number(page), limit: Number(limit), status, userId, jobId, leaveType,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
    try {
        const data = await leaveRequestService.getLeaveRequestById(req.params.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
    try {
        const data = await leaveRequestService.createLeaveRequest({
            userId: req.user.id, dto: req.body,
        });
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
    try {
        const data = await leaveRequestService.updateLeaveRequest({
            id: req.params.id, userId: req.user.id, dto: req.body,
        });
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const cancel = async (req, res, next) => {
    try {
        const data = await leaveRequestService.cancelLeaveRequest({
            id: req.params.id, userId: req.user.id,
        });
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
    try {
        await leaveRequestService.deleteLeaveRequest(req.params.id);
        res.json({ success: true, message: "Đã xóa đơn xin nghỉ" });
    } catch (err) { next(err); }
};

export const review = async (req, res, next) => {
    try {
        const { status, reply } = req.body;
        const data = await leaveRequestService.reviewLeaveRequest({
            id: req.params.id, approverId: req.user.id, status, reply,
        });
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

