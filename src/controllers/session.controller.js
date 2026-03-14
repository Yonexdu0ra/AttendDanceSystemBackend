import {   sessionService   } from "../services/index.js";

// ─── GET /sessions ─────────────────────────────────────────────────────────────
export const list = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await sessionService.getSessionsByUserId({
            userId: req.user.id,
            page: Number(page),
            limit: Number(limit),
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

// ─── DELETE /sessions/logout ──────────────────────────────────────────────────
export const logout = async (req, res, next) => {
    try {
        const { deviceId } = req.body;
        await sessionService.logout({
            token: req.token,
            userId: req.user.id,
            deviceId,
        });
        res.json({ success: true, message: "Đăng xuất thành công" });
    } catch (err) { next(err); }
};

// ─── DELETE /sessions/logout-all ─────────────────────────────────────────────
export const logoutAll = async (req, res, next) => {
    try {
        const result = await sessionService.logoutAll(req.user.id);
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

