import {   z   } from "zod";

// ─── Enums ───────────────────────────────────────────────────────────────────
export const NotificationTypeEnum = z.enum([
    "SYSTEM",
    "OVERTIME",
    "LEAVE",
    "APPROVAL",
]);

// ─── Create Notification DTO ──────────────────────────────────────────────────
export const CreateNotificationDto = z.object({
    userId: z.uuid({ message: "userId không hợp lệ" }),

    title: z
        .string()
        .min(1, "Tiêu đề không được để trống")
        .max(255, "Tiêu đề tối đa 255 ký tự"),

    content: z.string().min(1, "Nội dung không được để trống"),

    type: NotificationTypeEnum,

    // Dữ liệu để redirect tới đối tượng liên quan (e.g. OVERTIME, LEAVE, JOB)
    refType: z.string().optional(),

    refId: z.string().optional(),
});

// ─── Broadcast Notification DTO (gửi cho nhiều người) ────────────────────────
export const BroadcastNotificationDto = z.object({
    userIds: z
        .array(z.uuid({ message: "userId không hợp lệ" }))
        .min(1, "Phải có ít nhất 1 người nhận"),

    title: z
        .string()
        .min(1, "Tiêu đề không được để trống")
        .max(255, "Tiêu đề tối đa 255 ký tự"),

    content: z.string().min(1, "Nội dung không được để trống"),

    type: NotificationTypeEnum,

    refType: z.string().optional(),

    refId: z.string().optional(),
});

// ─── Mark Read Notification DTO ───────────────────────────────────────────────
export const MarkReadNotificationDto = z.object({
    notificationIds: z
        .array(z.uuid({ message: "notificationId không hợp lệ" }))
        .min(1, "Phải có ít nhất 1 thông báo"),
});

/**
 * @typedef {z.infer<typeof CreateNotificationDto>} CreateNotificationDtoType
 * @typedef {z.infer<typeof BroadcastNotificationDto>} BroadcastNotificationDtoType
 * @typedef {z.infer<typeof MarkReadNotificationDto>} MarkReadNotificationDtoType
 */

