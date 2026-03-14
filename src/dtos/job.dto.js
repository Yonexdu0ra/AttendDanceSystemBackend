import {   z   } from "zod";

// ─── Time string validator (HH:mm) ───────────────────────────────────────────
const TimeString = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Thời gian phải có định dạng HH:mm");

// ─── Create Job DTO ───────────────────────────────────────────────────────────
export const CreateJobDto = z
    .object({
        title: z
            .string()
            .min(1, "Tiêu đề không được để trống")
            .max(255, "Tiêu đề tối đa 255 ký tự"),

        description: z.string().optional(),

        address: z.string().max(255, "Địa chỉ tối đa 255 ký tự").optional(),

        // Thời gian bắt đầu làm việc (HH:mm)
        workStartTime: TimeString,

        // Phút cho phép check-in sớm so với giờ bắt đầu
        earlyCheckInMinutes: z
            .number()
            .int("Phải là số nguyên")
            .min(0, "Không thể âm")
            .optional()
            .default(15),

        // Phút cho phép check-in muộn so với giờ bắt đầu
        lateCheckInMinutes: z
            .number()
            .int("Phải là số nguyên")
            .min(0, "Không thể âm")
            .optional()
            .default(15),

        // Thời gian kết thúc làm việc (HH:mm)
        workEndTime: TimeString,

        // Phút cho phép check-out sớm so với giờ kết thúc
        earlyCheckOutMinutes: z
            .number()
            .int("Phải là số nguyên")
            .min(0, "Không thể âm")
            .optional()
            .default(15),

        // Phút cho phép check-out muộn so với giờ kết thúc
        lateCheckOutMinutes: z
            .number()
            .int("Phải là số nguyên")
            .min(0, "Không thể âm")
            .optional()
            .default(15),

        latitude: z
            .number()
            .min(-90, "Vĩ độ phải trong khoảng -90 đến 90")
            .max(90, "Vĩ độ phải trong khoảng -90 đến 90"),

        longitude: z
            .number()
            .min(-180, "Kinh độ phải trong khoảng -180 đến 180")
            .max(180, "Kinh độ phải trong khoảng -180 đến 180"),

        // Bán kính (mét) cho phép check-in
        radius: z
            .number()
            .min(10, "Bán kính tối thiểu 10 mét")
            .optional()
            .default(50),
    })
    .refine(
        (data) => {
            // Validate workStartTime < workEndTime
            const [sh, sm] = data.workStartTime.split(":").map(Number);
            const [eh, em] = data.workEndTime.split(":").map(Number);
            const start = sh * 60 + sm;
            const end = eh * 60 + em;
            return start < end;
        },
        {
            message: "Giờ bắt đầu phải trước giờ kết thúc",
            path: ["workEndTime"],
        }
    );

// ─── Update Job DTO ───────────────────────────────────────────────────────────
export const UpdateJobDto = z.object({
    title: z
        .string()
        .min(1, "Tiêu đề không được để trống")
        .max(255, "Tiêu đề tối đa 255 ký tự")
        .optional(),

    description: z.string().optional(),

    address: z.string().max(255, "Địa chỉ tối đa 255 ký tự").optional(),

    workStartTime: TimeString.optional(),

    earlyCheckInMinutes: z
        .number()
        .int("Phải là số nguyên")
        .min(0, "Không thể âm")
        .optional(),

    lateCheckInMinutes: z
        .number()
        .int("Phải là số nguyên")
        .min(0, "Không thể âm")
        .optional(),

    workEndTime: TimeString.optional(),

    earlyCheckOutMinutes: z
        .number()
        .int("Phải là số nguyên")
        .min(0, "Không thể âm")
        .optional(),

    lateCheckOutMinutes: z
        .number()
        .int("Phải là số nguyên")
        .min(0, "Không thể âm")
        .optional(),

    latitude: z
        .number()
        .min(-90, "Vĩ độ phải trong khoảng -90 đến 90")
        .max(90, "Vĩ độ phải trong khoảng -90 đến 90")
        .optional(),

    longitude: z
        .number()
        .min(-180, "Kinh độ phải trong khoảng -180 đến 180")
        .max(180, "Kinh độ phải trong khoảng -180 đến 180")
        .optional(),

    radius: z.number().min(10, "Bán kính tối thiểu 10 mét").optional(),
});

/**
 * @typedef {z.infer<typeof CreateJobDto>} CreateJobDtoType
 * @typedef {z.infer<typeof UpdateJobDto>} UpdateJobDtoType
 */

