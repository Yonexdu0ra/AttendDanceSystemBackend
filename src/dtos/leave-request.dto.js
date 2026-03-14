import {   z   } from "zod";

// ─── Enums ───────────────────────────────────────────────────────────────────
export const LeaveTypeEnum = z.enum(["SICK", "VACATION", "PERSONAL", "OTHER"]);

// ─── Create Leave Request DTO ─────────────────────────────────────────────────
export const CreateLeaveRequestDto = z
    .object({
        jobId: z.uuid({ message: "jobId không hợp lệ" }).optional(),

        startDate: z.coerce.date({ message: "startDate không hợp lệ" }),

        endDate: z.coerce.date({ message: "endDate không hợp lệ" }),

        leaveType: LeaveTypeEnum.optional().default("OTHER"),

        reason: z.string().optional(),
    })
    .refine((data) => data.endDate >= data.startDate, {
        message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
        path: ["endDate"],
    });

// ─── Update Leave Request DTO ─────────────────────────────────────────────────
// Người dùng chỉ có thể cập nhật khi đơn đang ở trạng thái PENDING
export const UpdateLeaveRequestDto = z
    .object({
        startDate: z.coerce.date({ message: "startDate không hợp lệ" }).optional(),

        endDate: z.coerce.date({ message: "endDate không hợp lệ" }).optional(),

        leaveType: LeaveTypeEnum.optional(),

        reason: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return data.endDate >= data.startDate;
            }
            return true;
        },
        {
            message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
            path: ["endDate"],
        }
    );

// ─── Approve / Reject Leave Request DTO ──────────────────────────────────────
export const ReviewLeaveRequestDto = z.object({
    status: z.enum(["APPROVED", "REJECTED"], {
        message: "Trạng thái phải là APPROVED hoặc REJECTED",
    }),

    reply: z.string().optional(),
});

/**
 * @typedef {z.infer<typeof CreateLeaveRequestDto>} CreateLeaveRequestDtoType
 * @typedef {z.infer<typeof UpdateLeaveRequestDto>} UpdateLeaveRequestDtoType
 * @typedef {z.infer<typeof ReviewLeaveRequestDto>} ReviewLeaveRequestDtoType
 */

