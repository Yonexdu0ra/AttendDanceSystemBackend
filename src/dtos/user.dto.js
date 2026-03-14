import {   z   } from "zod";

// ─── Enums ───────────────────────────────────────────────────────────────────
export const RoleEnum = z.enum(["EMPLOYEE", "MANAGER", "ADMIN", "SUPER_ADMIN"]);

// ─── Create User DTO ─────────────────────────────────────────────────────────
export const CreateUserDto = z.object({
    email: z
        .email({ message: "Email không hợp lệ" })
        .max(255, "Email tối đa 255 ký tự"),

    phone: z
        .string()
        .max(20, "Số điện thoại tối đa 20 ký tự")
        .regex(/^[0-9+\-\s()]*$/, "Số điện thoại không hợp lệ"),

    code: z
        .string()
        .max(20, "Mã nhân viên tối đa 20 ký tự"),

    password: z
        .string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự"),

    role: RoleEnum.optional().default("EMPLOYEE"),

    biometricEnabled: z.boolean().optional().default(false),
});

// ─── Update User DTO ─────────────────────────────────────────────────────────
export const UpdateUserDto = z.object({
    phone: z
        .string()
        .max(20, "Số điện thoại tối đa 20 ký tự")
        .regex(/^[0-9+\-\s()]*$/, "Số điện thoại không hợp lệ")
        .optional(),

    code: z
        .string()
        .max(20, "Mã nhân viên tối đa 20 ký tự")
        .optional(),

    role: RoleEnum.optional(),

    biometricEnabled: z.boolean().optional(),
});

// ─── Update Password DTO ─────────────────────────────────────────────────────
export const UpdatePasswordDto = z.object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại không được để trống"),

    newPassword: z
        .string()
        .min(6, "Mật khẩu mới tối thiểu 6 ký tự"),

    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

/**
 * @typedef {z.infer<typeof CreateUserDto>} CreateUserDtoType
 * @typedef {z.infer<typeof UpdateUserDto>} UpdateUserDtoType
 * @typedef {z.infer<typeof UpdatePasswordDto>} UpdatePasswordDtoType
 */

