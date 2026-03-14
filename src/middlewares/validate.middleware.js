import {   BadRequestError   } from "../utils/errors.js";

/**
 * Middleware validate dữ liệu request bằng Zod schema.
 *
 * @param {import("zod").ZodSchema} schema - Zod schema dùng để validate
 * @param {"body" | "query" | "params"} source - Nguồn dữ liệu cần validate
 *
 * @example
 * router.post("/", validate(CreateJobDto), controller.create)
 * router.get("/", validate(QueryDto, "query"), controller.list)
 */
export const validate = (schema, source = "body") => (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        const details = result.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
        }));
        return next(new BadRequestError("Dữ liệu đầu vào không hợp lệ", details));
    }
    req[source] = result.data;
    next();
};

