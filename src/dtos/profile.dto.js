import {   z   } from "zod";

// ─── Create Profile DTO ───────────────────────────────────────────────────────
export const CreateProfileDto = z.object({
    userId: z.uuid({ message: "userId không hợp lệ" }),

    fullName: z
        .string()
        .min(1, "Họ tên không được để trống")
        .max(255, "Họ tên tối đa 255 ký tự"),

    address: z.string().min(1, "Địa chỉ không được để trống"),

    bio: z.string().optional(),
});

// ─── Update Profile DTO ───────────────────────────────────────────────────────
export const UpdateProfileDto = z.object({
    fullName: z
        .string()
        .min(1, "Họ tên không được để trống")
        .max(255, "Họ tên tối đa 255 ký tự")
        .optional(),

    address: z.string().min(1, "Địa chỉ không được để trống").optional(),

    bio: z.string().optional(),
});

/**
 * @typedef {z.infer<typeof CreateProfileDto>} CreateProfileDtoType
 * @typedef {z.infer<typeof UpdateProfileDto>} UpdateProfileDtoType
 */

