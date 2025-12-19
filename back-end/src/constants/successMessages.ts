/**
 * Tất cả success messages trong hệ thống
 */

export const SUCCESS_MESSAGES = {
  // Authentication success
  AUTH: {
    REGISTER_SUCCESS: 'Đăng ký thành công',
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
  },

  // User success
  USER: {
    CREATED: 'Tạo người dùng thành công',
    UPDATED: 'Cập nhật thông tin thành công',
    DELETED: 'Xóa người dùng thành công',
    RETRIEVED: 'Lấy thông tin người dùng thành công',
  },

  // General success
  GENERAL: {
    OPERATION_SUCCESS: 'Thao tác thành công',
    DATA_RETRIEVED: 'Lấy dữ liệu thành công',
  },
} as const;

