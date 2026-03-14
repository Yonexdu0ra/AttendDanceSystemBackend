/**
 * Tính toán và chuẩn hoá response offset-based pagination cho web app.
 *
 * @template T
 * @param {T[]} data - Mảng dữ liệu đã query
 * @param {number} total - Tổng số bản ghi khớp điều kiện
 * @param {number} page - Trang hiện tại (bắt đầu từ 1)
 * @param {number} limit - Số bản ghi mỗi trang
 * @returns {{
 *   data: T[],
 *   meta: {
 *     total: number,
 *     page: number,
 *     limit: number,
 *     totalPages: number,
 *     hasNext: boolean,
 *     hasPrev: boolean
 *   }
 * }}
 *
 * @example
 * const [data, total] = await Promise.all([
 *   userRepository.findMany({ skip, take }),
 *   userRepository.count(where),
 * ]);
 * return parseOffsetResult(data, total, page, limit);
 */
export const parseOffsetResult = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit) || 1;
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
};

/**
 * Chuyển đổi page + limit sang skip + take cho Prisma.
 *
 * @param {number} [page=1] - Trang hiện tại (bắt đầu từ 1)
 * @param {number} [limit=20] - Số bản ghi mỗi trang
 * @returns {{ skip: number, take: number }}
 *
 * @example
 * const { skip, take } = buildOffsetClause(page, limit);
 * prisma.user.findMany({ skip, take });
 */
export const buildOffsetClause = (page = 1, limit = 20) => ({
    skip: (Math.max(1, page) - 1) * limit,
    take: limit,
});

