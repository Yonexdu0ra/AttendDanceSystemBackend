import {   userDeviceRepository   } from "../repositories/index.js";
import {   buildOffsetClause, parseOffsetResult   } from "../utils/offset-pagination.js";
import {   NotFoundError, ForbiddenError   } from "../utils/errors.js";

// ─── Lấy danh sách thiết bị của user (offset pagination) ─────────────────────
/**
 * Lấy danh sách tất cả thiết bị đã đăng ký của một người dùng.
 *
 * @param {object} params
 * @param {string}  params.userId     - ID người dùng
 * @param {number}  [params.page=1]
 * @param {number}  [params.limit=20]
 * @returns {Promise<object>} Danh sách thiết bị kèm metadata phân trang
 */
const getDevicesByUserId = async ({ userId, page = 1, limit = 20 }) => {
    const { skip, take } = buildOffsetClause(page, limit);

    const [data, total] = await Promise.all([
        userDeviceRepository.findByUserId({ userId, skip, take }),
        userDeviceRepository.countByUserId(userId),
    ]);

    return parseOffsetResult(data, total, page, limit);
};

// ─── Lấy danh sách thiết bị (admin, offset pagination) ───────────────────────
/**
 * Lấy danh sách thiết bị toàn hệ thống (dành cho admin).
 *
 * @param {object} params
 * @param {number}  [params.page=1]
 * @param {number}  [params.limit=20]
 * @param {string}  [params.userId]   - Lọc theo userId nếu cần
 * @param {string}  [params.platform] - Lọc theo platform (iOS / Android / Web)
 * @returns {Promise<object>} Danh sách thiết bị kèm metadata phân trang
 */
const getAllDevices = async ({ page = 1, limit = 20, userId, platform } = {}) => {
    const where = {};
    if (userId) where.userId = userId;
    if (platform) where.platform = platform;

    const { skip, take } = buildOffsetClause(page, limit);

    const [data, total] = await Promise.all([
        userDeviceRepository.findMany({ skip, take, where }),
        userDeviceRepository.count(where),
    ]);

    return parseOffsetResult(data, total, page, limit);
};

// ─── Lấy chi tiết một thiết bị theo ID ───────────────────────────────────────
/**
 * Lấy thông tin chi tiết một thiết bị theo ID.
 *
 * @param {string} id - ID của thiết bị
 * @returns {Promise<object>} Thông tin thiết bị
 * @throws {NotFoundError} Nếu không tìm thấy
 */
const getDeviceById = async (id) => {
    const device = await userDeviceRepository.findById(id);
    if (!device) {
        throw new NotFoundError("Không tìm thấy thiết bị");
    }
    return device;
};

// ─── Đăng ký / cập nhật thiết bị (upsert) ────────────────────────────────────
/**
 * Đăng ký thiết bị mới hoặc cập nhật thông tin nếu đã tồn tại.
 * Được gọi khi người dùng đăng nhập từ một thiết bị.
 *
 * @param {object} params
 * @param {string}  params.userId     - ID người dùng
 * @param {string}  params.deviceId   - ID thiết bị (từ app / browser fingerprint)
 * @param {string}  params.platform   - Nền tảng: "iOS" | "Android" | "Web"
 * @param {string}  [params.deviceName] - Tên thiết bị
 * @param {string}  [params.fcmToken]   - Token push notification
 * @param {string}  params.ipAddress  - Địa chỉ IP khi đăng nhập
 * @returns {Promise<object>} Thiết bị sau khi upsert
 */
const registerDevice = async ({ userId, deviceId, platform, deviceName, fcmToken, ipAddress }) => {
    return userDeviceRepository.upsert(userId, deviceId, {
        platform,
        deviceName: deviceName ?? "Unknown Device",
        fcmToken: fcmToken ?? null,
        ipAddress,
    });
};

// ─── Cập nhật FCM token ───────────────────────────────────────────────────────
/**
 * Cập nhật FCM token cho một thiết bị cụ thể của người dùng.
 * Thường gọi khi Firebase cấp lại token mới cho app.
 *
 * @param {string} userId   - ID người dùng (kiểm tra quyền sở hữu)
 * @param {string} deviceId - ID thiết bị
 * @param {string} fcmToken - FCM token mới
 * @returns {Promise<object>} Thiết bị sau khi cập nhật
 * @throws {NotFoundError} Nếu thiết bị không tồn tại hoặc không thuộc user
 */
const updateFcmToken = async (userId, deviceId, fcmToken) => {
    const device = await userDeviceRepository.findByUserAndDevice(userId, deviceId);
    if (!device) {
        throw new NotFoundError("Thiết bị không tồn tại hoặc không thuộc người dùng này");
    }

    return userDeviceRepository.update(device.id, { fcmToken });
};

// ─── Xóa FCM token (khi đăng xuất) ──────────────────────────────────────────
/**
 * Xóa FCM token của một thiết bị khi người dùng đăng xuất.
 * Đảm bảo không còn nhận push notification sau khi logout.
 *
 * @param {string} userId   - ID người dùng
 * @param {string} deviceId - ID thiết bị
 * @returns {Promise<void>}
 */
const clearFcmToken = async (userId, deviceId) => {
    const device = await userDeviceRepository.findByUserAndDevice(userId, deviceId);
    if (device?.fcmToken) {
        await userDeviceRepository.update(device.id, { fcmToken: null });
    }
};

// ─── Xóa toàn bộ FCM token của user (khi logout all) ─────────────────────────
/**
 * Xóa FCM token của tất cả thiết bị của người dùng.
 * Gọi khi logout tất cả thiết bị để ngừng nhận push notification.
 *
 * @param {string} userId - ID người dùng
 * @returns {Promise<void>}
 */
const clearAllFcmTokens = async (userId) => {
    const devices = await userDeviceRepository.findByUserId({ userId, take: 100 });
    await Promise.all(
        devices
            .filter((d) => d.fcmToken)
            .map((d) => userDeviceRepository.update(d.id, { fcmToken: null }))
    );
};

// ─── Xóa một thiết bị ────────────────────────────────────────────────────────
/**
 * Xóa một thiết bị đã đăng ký của người dùng.
 * Kiểm tra quyền sở hữu trước khi xóa.
 *
 * @param {string} userId   - ID người dùng thực hiện thao tác
 * @param {string} deviceId - ID thiết bị cần xóa
 * @returns {Promise<object>} Thiết bị vừa bị xóa
 * @throws {NotFoundError}  Nếu không tìm thấy thiết bị
 * @throws {ForbiddenError} Nếu thiết bị không thuộc người dùng này
 */
const removeDevice = async (userId, deviceId) => {
    const device = await userDeviceRepository.findByUserAndDevice(userId, deviceId);
    if (!device) {
        throw new NotFoundError("Không tìm thấy thiết bị");
    }
    if (device.userId !== userId) {
        throw new ForbiddenError("Bạn không có quyền xóa thiết bị này");
    }

    return userDeviceRepository.remove(device.id);
};

// ─── Xóa tất cả thiết bị của user ────────────────────────────────────────────
/**
 * Xóa toàn bộ thiết bị đã đăng ký của một người dùng.
 * Thường dùng khi xóa tài khoản hoặc reset thiết bị hàng loạt.
 *
 * @param {string} userId - ID người dùng
 * @returns {Promise<{ count: number }>} Số thiết bị đã xóa
 */
const removeAllDevices = async (userId) => {
    return userDeviceRepository.removeAllByUserId(userId);
};

// ─── Lấy FCM tokens để gửi push notification ──────────────────────────────────
/**
 * Lấy danh sách FCM token từ nhiều người dùng để gửi push notification hàng loạt.
 * Chỉ trả về các thiết bị có FCM token hợp lệ.
 *
 * @param {string[]} userIds - Danh sách ID người dùng
 * @returns {Promise<Array<{ userId: string, fcmToken: string, platform: string }>>}
 */
const getFcmTokensByUserIds = async (userIds) => {
    if (!userIds?.length) return [];
    return userDeviceRepository.findFcmTokensByUserIds(userIds);
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const userDeviceService = {
    getDevicesByUserId,
    getAllDevices,
    getDeviceById,
    registerDevice,
    updateFcmToken,
    clearFcmToken,
    clearAllFcmTokens,
    removeDevice,
    removeAllDevices,
    getFcmTokensByUserIds,
};

