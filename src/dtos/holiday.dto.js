import {   z   } from "zod";

// ─── Enums ───────────────────────────────────────────────────────────────────
export const HolidayTypeEnum = z.enum([
    "NATIONAL",
    "RELIGIOUS",
    "CULTURAL",
    "COMPANY",
    "OTHER",
]);

// ─── Create Holiday DTO ───────────────────────────────────────────────────────
export const CreateHolidayDto = z.object({
    name: z
        .string()
        .min(1, "Tên ngày lễ không được để trống")
        .max(255, "Tên ngày lễ tối đa 255 ký tự"),

    date: z.coerce.date({ message: "Ngày lễ không hợp lệ" }),

    isPaid: z.boolean().optional().default(false),

    type: HolidayTypeEnum.optional().default("OTHER"),

    description: z.string().optional(),
});

// ─── Update Holiday DTO ───────────────────────────────────────────────────────
export const UpdateHolidayDto = z.object({
    name: z
        .string()
        .min(1, "Tên ngày lễ không được để trống")
        .max(255, "Tên ngày lễ tối đa 255 ký tự")
        .optional(),

    date: z.coerce.date({ message: "Ngày lễ không hợp lệ" }).optional(),

    isPaid: z.boolean().optional(),

    type: HolidayTypeEnum.optional(),

    description: z.string().optional(),
});

/**
 * @typedef {z.infer<typeof CreateHolidayDto>} CreateHolidayDtoType
 * @typedef {z.infer<typeof UpdateHolidayDto>} UpdateHolidayDtoType
 */

