// ─── Base Application Error ───────────────────────────────────────────────────
/**
 * Lớp lỗi cơ sở cho toàn bộ ứng dụng.
 * Tất cả custom error đều kế thừa từ lớp này.
 *
 * @extends Error
 * @property {number}  status     - HTTP status code
 * @property {boolean} isAppError - Dấu hiệu nhận diện đây là AppError (dùng cho error handler)
 * @property {*}       [details]  - Thông tin bổ sung (ví dụ: lỗi validation fields)
 */
export class AppError extends Error {
    /**
     * @param {string} message  - Thông báo lỗi
     * @param {number} status   - HTTP status code
     * @param {*}      [details] - Dữ liệu bổ sung (optional)
     */
    constructor(message, status = 500, details = null) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.isAppError = true;
        this.details = details;

        // Giữ stack trace chuẩn với V8
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// ─── 400 Bad Request ──────────────────────────────────────────────────────────
/**
 * Dữ liệu đầu vào không hợp lệ (validation fail, thiếu trường, sai định dạng...)
 *
 * @example
 * throw new BadRequestError("Email không hợp lệ");
 * throw new BadRequestError("Validation thất bại", zodIssues);
 */
export class BadRequestError extends AppError {
    constructor(message = "Yêu cầu không hợp lệ", details = null) {
        super(message, 400, details);
    }
}

// ─── 401 Unauthorized ────────────────────────────────────────────────────────
/**
 * Chưa xác thực hoặc token không hợp lệ / hết hạn.
 *
 * @example
 * throw new UnauthorizedError("Token hết hạn, vui lòng đăng nhập lại");
 */
export class UnauthorizedError extends AppError {
    constructor(message = "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn") {
        super(message, 401);
    }
}

// ─── 403 Forbidden ───────────────────────────────────────────────────────────
/**
 * Đã xác thực nhưng không có quyền thực hiện hành động này.
 *
 * @example
 * throw new ForbiddenError("Bạn không có quyền xóa ngày lễ");
 */
export class ForbiddenError extends AppError {
    constructor(message = "Bạn không có quyền thực hiện hành động này") {
        super(message, 403);
    }
}

// ─── 404 Not Found ───────────────────────────────────────────────────────────
/**
 * Không tìm thấy tài nguyên được yêu cầu.
 *
 * @example
 * throw new NotFoundError("Không tìm thấy người dùng");
 */
export class NotFoundError extends AppError {
    constructor(message = "Không tìm thấy tài nguyên") {
        super(message, 404);
    }
}

// ─── 409 Conflict ────────────────────────────────────────────────────────────
/**
 * Xung đột dữ liệu (trùng lặp, vi phạm ràng buộc unique...)
 *
 * @example
 * throw new ConflictError("Email đã được đăng ký");
 */
export class ConflictError extends AppError {
    constructor(message = "Dữ liệu đã tồn tại hoặc xung đột") {
        super(message, 409);
    }
}

// ─── 422 Unprocessable Entity ────────────────────────────────────────────────
/**
 * Dữ liệu hợp lệ về cú pháp nhưng không thể xử lý được về mặt nghiệp vụ.
 *
 * @example
 * throw new UnprocessableError("Ngày kết thúc phải sau ngày bắt đầu");
 */
export class UnprocessableError extends AppError {
    constructor(message = "Không thể xử lý yêu cầu", details = null) {
        super(message, 422, details);
    }
}

// ─── 429 Too Many Requests ───────────────────────────────────────────────────
/**
 * Người dùng gửi quá nhiều request trong một khoảng thời gian ngắn.
 *
 * @example
 * throw new TooManyRequestsError();
 */
export class TooManyRequestsError extends AppError {
    constructor(message = "Quá nhiều yêu cầu, vui lòng thử lại sau") {
        super(message, 429);
    }
}

// ─── 500 Internal Server Error ───────────────────────────────────────────────
/**
 * Lỗi nội bộ không xác định của server.
 * Thường dùng khi catch được một lỗi không mong muốn.
 *
 * @example
 * throw new InternalError("Lỗi kết nối database");
 */
export class InternalError extends AppError {
    constructor(message = "Đã xảy ra lỗi, vui lòng thử lại sau") {
        super(message, 500);
    }
}

