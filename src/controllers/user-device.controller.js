import {   userDeviceService   } from "../services/index.js";

// ─── GET /devices ────────────────────────────────────────────────────────────
export const list = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await userDeviceService.getDevicesByUserId({
            userId: req.user.id,
            page: Number(page),
            limit: Number(limit),
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

// ─── PUT /devices/:deviceId/fcm-token ────────────────────────────────────────
export const updateFcmToken = async (req, res, next) => {
    try {
        const device = await userDeviceService.updateFcmToken(
            req.user.id,
            req.params.deviceId,
            req.body.fcmToken,
        );
        res.json({ success: true, data: device });
    } catch (err) { next(err); }
};

// ─── DELETE /devices/:deviceId ────────────────────────────────────────────────
export const remove = async (req, res, next) => {
    try {
        await userDeviceService.removeDevice(req.user.id, req.params.deviceId);
        res.json({ success: true, message: "Thiết bị đã được xóa" });
    } catch (err) { next(err); }
};

