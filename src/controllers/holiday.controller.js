import {   holidayService   } from "../services/index.js";
import {   CreateHolidayDto, UpdateHolidayDto   } from "../dtos/holiday.dto.js";
import {   validate   } from "../middlewares/validate.middleware.js";

// ─── GET /holidays ─────────────────────────────────────────────────────────────
export const list = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, year } = req.query;
        const result = await holidayService.getHolidays({
            page: Number(page),
            limit: Number(limit),
            year: year ? Number(year) : undefined,
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

// ─── GET /holidays/:id ────────────────────────────────────────────────────────
export const getById = async (req, res, next) => {
    try {
        const holiday = await holidayService.getHolidayById(req.params.id);
        res.json({ success: true, data: holiday });
    } catch (err) { next(err); }
};

// ─── POST /holidays ────────────────────────────────────────────────────────────
export const create = async (req, res, next) => {
    try {
        const holiday = await holidayService.createHoliday(req.body);
        res.status(201).json({ success: true, data: holiday });
    } catch (err) { next(err); }
};

// ─── PUT /holidays/:id ────────────────────────────────────────────────────────
export const update = async (req, res, next) => {
    try {
        const holiday = await holidayService.updateHoliday(req.params.id, req.body);
        res.json({ success: true, data: holiday });
    } catch (err) { next(err); }
};

// ─── DELETE /holidays/:id ─────────────────────────────────────────────────────
export const remove = async (req, res, next) => {
    try {
        await holidayService.deleteHoliday(req.params.id);
        res.json({ success: true, message: "Xóa ngày nghỉ thành công" });
    } catch (err) { next(err); }
};

// ─── GET /holidays/check?date=YYYY-MM-DD ──────────────────────────────────────
export const checkDate = async (req, res, next) => {
    try {
        const { date } = req.query;
        const isHoliday = await holidayService.isHoliday(new Date(date));
        res.json({ success: true, data: { isHoliday } });
    } catch (err) { next(err); }
};

