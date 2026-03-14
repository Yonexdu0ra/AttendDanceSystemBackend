import { attendanceService } from "../services/index.js";

// ─── GET /attendances/my ────────────────────────────────────────────────────
export const getMyAttendances = async (req, res, next) => {
    try {
        const { page, limit, type, status, cursor } = req.query;
        if (cursor) {
            const result = await attendanceService.getAttendancesByUserIdCursor({
                userId: req.user.id,
                cursor,
                limit: limit ? Number(limit) : undefined,
                type,
                status,
            });
            return res.json({ success: true, ...result });
        }
        const result = await attendanceService.getAttendancesByUserId({
            userId: req.user.id,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            type,
            status,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

// ─── GET /attendances/:id ───────────────────────────────────────────────────
export const getById = async (req, res, next) => {
    try {
        const record = await attendanceService.getAttendanceById(req.params.id);
        res.json({ success: true, data: record });
    } catch (err) { next(err); }
};

// ─── GET /attendances/job/:jobId ────────────────────────────────────────────
export const getByJobId = async (req, res, next) => {
    try {
        const { page, limit, type, status, cursor } = req.query;
        if (cursor) {
            const result = await attendanceService.getAttendancesByJobIdCursor({
                jobId: req.params.jobId,
                cursor,
                limit: limit ? Number(limit) : undefined,
                type,
                status,
            });
            return res.json({ success: true, ...result });
        }
        const result = await attendanceService.getAttendancesByJobId({
            jobId: req.params.jobId,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            type,
            status,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

// ─── GET /attendances/date-range ────────────────────────────────────────────
export const getByDateRange = async (req, res, next) => {
    try {
        const { userId, jobId, startDate, endDate, type, status } = req.query;
        const data = await attendanceService.getAttendancesByDateRange({
            userId,
            jobId,
            startDate,
            endDate,
            type,
            status,
        });
        res.json({ success: true, data });
    } catch (err) { next(err); }
};

// ─── GET /attendances/fraudulent ────────────────────────────────────────────
export const getFraudulent = async (req, res, next) => {
    try {
        const { jobId, page, limit } = req.query;
        const result = await attendanceService.getFraudulentAttendances({
            jobId,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

// ─── POST /attendances/check ────────────────────────────────────────────────
// Gộp check-in và check-out thành 1 endpoint duy nhất.
// Tự động xác định: chưa có bản ghi hôm nay → check-in, đã có → check-out.
export const checkInOut = async (req, res, next) => {
    try {
        const result = await attendanceService.checkInOut({
            userId: req.user.id,
            dto: req.body,
            ipAddress: req.ip,
        });
        const statusCode = result.action === "CHECK_IN" ? 201 : 200;
        res.status(statusCode).json({ success: true, ...result });
    } catch (err) { next(err); }
};

// ─── POST /attendances (admin tạo thủ công) ────────────────────────────────
export const create = async (req, res, next) => {
    try {
        const record = await attendanceService.createAttendanceManual(req.body);
        res.status(201).json({ success: true, data: record });
    } catch (err) { next(err); }
};

// ─── PUT /attendances/:id ───────────────────────────────────────────────────
export const update = async (req, res, next) => {
    try {
        const record = await attendanceService.updateAttendance({
            id: req.params.id,
            dto: req.body,
        });
        res.json({ success: true, data: record });
    } catch (err) { next(err); }
};

// ─── PATCH /attendances/:id/review ──────────────────────────────────────────
export const review = async (req, res, next) => {
    try {
        const record = await attendanceService.reviewAttendance({
            id: req.params.id,
            status: req.body.status,
        });
        res.json({ success: true, data: record });
    } catch (err) { next(err); }
};

// ─── PATCH /attendances/:id/fraud ───────────────────────────────────────────
export const markFraud = async (req, res, next) => {
    try {
        const record = await attendanceService.markFraud({
            id: req.params.id,
            isFraud: req.body.isFraud,
            fraudReason: req.body.fraudReason,
        });
        res.json({ success: true, data: record });
    } catch (err) { next(err); }
};

// ─── DELETE /attendances/:id ────────────────────────────────────────────────
export const remove = async (req, res, next) => {
    try {
        await attendanceService.deleteAttendance(req.params.id);
        res.json({ success: true, message: "Xóa bản ghi chấm công thành công" });
    } catch (err) { next(err); }
};

// ─── POST /attendances/qr-code/:jobId ───────────────────────────────────────
export const generateQRCode = async (req, res, next) => {
    try {
        const expiresInMs = req.body.expiresInMs ? Number(req.body.expiresInMs) : undefined;
        const data = await attendanceService.generateJobQRCode(req.params.jobId, expiresInMs);
        res.json({ success: true, data });
    } catch (err) { next(err); }
};
