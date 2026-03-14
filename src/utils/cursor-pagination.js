/**
 * Xử lý kết quả cursor-based pagination theo pattern "take + 1".
 *
 * Repository query với `take + 1` bản ghi để kiểm tra còn dữ liệu tiếp không.
 * Hàm này cắt kết quả về đúng `take` bản ghi và tính `nextCursor`, `hasMore`.
 *
 * @template T
 * @param {T[]} items - Mảng kết quả trả về từ Prisma (có thể dài hơn take 1 phần tử)
 * @param {number} take - Số bản ghi mỗi trang
 * @param {keyof T} [cursorField="id"] - Trường dùng làm cursor (mặc định: "id")
 * @returns {{ data: T[], hasMore: boolean, nextCursor: string | null }}
 *
 * @example
 * const raw = await prisma.notification.findMany({ take: take + 1, ... });
 * const result = parseCursorResult(raw, take);
 * // result = { data: [...], hasMore: true, nextCursor: "abc123" }
 */
export const parseCursorResult = (items, take, cursorField = "id") => {
    const hasMore = items.length > take;
    const data = hasMore ? items.slice(0, take) : items;
    const nextCursor = hasMore ? data[data.length - 1][cursorField] : null;
    return { data, hasMore, nextCursor };
};

/**
 * Tạo phần cursor clause cho Prisma query.
 *
 * @param {string | undefined} cursor - Giá trị cursor hiện tại (id của bản ghi cuối)
 * @param {string} [cursorField="id"] - Tên trường cursor
 * @returns {object} Prisma cursor + skip clause
 *
 * @example
 * prisma.job.findMany({
 *   take: take + 1,
 *   ...buildCursorClause(cursor),
 *   orderBy: { createdAt: "desc" },
 * });
 */
export const buildCursorClause = (cursor, cursorField = "id") =>
    cursor ? { cursor: { [cursorField]: cursor }, skip: 1 } : {};

