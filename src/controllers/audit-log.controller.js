import {   auditLogService   } from "../services/index.js";

export const list = async (req, res, next) => {
    try {
        const { page = 1, limit = 50, userId, action, resource, resourceId, status, startDate, endDate } = req.query;
        const result = await auditLogService.getLogs({
            page: Number(page), limit: Number(limit),
            userId, action, resource, resourceId, status, startDate, endDate,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const getByUserId = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const result = await auditLogService.getLogsByUserId({
            userId: req.params.userId,
            page: Number(page),
            limit: Number(limit),
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const getByResource = async (req, res, next) => {
    try {
        const { resource, resourceId } = req.params;
        const data = await auditLogService.getLogsByResource(resource, resourceId);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

