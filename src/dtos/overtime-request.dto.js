import {   z   } from "zod";

// ─── Create Overtime Request DTO ──────────────────────────────────────────────
export const CreateOvertimeRequestDto = z
    .object({
        jobId: z.uuid({ message: "jobId không hợp lệ" }).optional(),

        // Ngày OT (chỉ lấy phần date, không cần giờ)
        date: z.coerce.date({ message: "date không hợp lệ" }),

        // Thời điểm bắt đầu OT (ISO datetime)
        startTime: z.coerce.date({ message: "startTime không hợp lệ" }),

        // Thời điểm kết thúc OT (ISO datetime)
        endTime: z.coerce.date({ message: "endTime không hợp lệ" }),

        reason: z.string().optional(),
    })
    .refine((data) => data.endTime > data.startTime, {
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
        path: ["endTime"],
    })
    .transform((data) => ({
        ...data,
        // Tự tính tổng số phút OT
        minutes: Math.round(
            (data.endTime.getTime() - data.startTime.getTime()) / 60000
        ),
    }));

// ─── Update Overtime Request DTO ──────────────────────────────────────────────
// Người dùng chỉ có thể cập nhật khi đơn đang ở trạng thái PENDING
export const UpdateOvertimeRequestDto = z
    .object({
        date: z.coerce.date({ message: "date không hợp lệ" }).optional(),

        startTime: z.coerce.date({ message: "startTime không hợp lệ" }).optional(),

        endTime: z.coerce.date({ message: "endTime không hợp lệ" }).optional(),

        reason: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.startTime && data.endTime) {
                return data.endTime > data.startTime;
            }
            return true;
        },
        {
            message: "Thời gian kết thúc phải sau thời gian bắt đầu",
            path: ["endTime"],
        }
    );

// ─── Approve / Reject Overtime Request DTO ────────────────────────────────────
export const ReviewOvertimeRequestDto = z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
        message: "Trạng thái phải là APPROVED hoặc REJECTED",
    }),

    reply: z.string().optional(),
});

/**
 * @typedef {z.infer<typeof CreateOvertimeRequestDto>} CreateOvertimeRequestDtoType
 * @typedef {z.infer<typeof UpdateOvertimeRequestDto>} UpdateOvertimeRequestDtoType
 * @typedef {z.infer<typeof ReviewOvertimeRequestDto>} ReviewOvertimeRequestDtoType
 */

