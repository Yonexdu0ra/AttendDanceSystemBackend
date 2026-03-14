import {   z   } from "zod";

// ─── Create JobManager DTO ────────────────────────────────────────────────────
export const CreateJobManagerDto = z.object({
    userId: z.uuid({ message: "userId không hợp lệ" }),
    jobId: z.uuid({ message: "jobId không hợp lệ" }).optional(),
});

// ─── Create UserJoinedJob DTO ─────────────────────────────────────────────────
export const CreateUserJoinedJobDto = z.object({
    userId: z.uuid({ message: "userId không hợp lệ" }),
    jobId: z.uuid({ message: "jobId không hợp lệ" }),
});

// ─── Update UserJoinedJob Status DTO ─────────────────────────────────────────
export const UpdateUserJoinedJobStatusDto = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELED"], {
        message: "Trạng thái không hợp lệ",
    }),
});

/**
 * @typedef {z.infer<typeof CreateJobManagerDto>} CreateJobManagerDtoType
 * @typedef {z.infer<typeof CreateUserJoinedJobDto>} CreateUserJoinedJobDtoType
 * @typedef {z.infer<typeof UpdateUserJoinedJobStatusDto>} UpdateUserJoinedJobStatusDtoType
 */

