export const ERROR_MESSAGES = {
  AUTH: {
    EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
    TOKEN_NOT_FOUND: 'Không tìm thấy token. Vui lòng đăng nhập.',
    TOKEN_INVALID: 'Token không hợp lệ.',
    TOKEN_EXPIRED: 'Token đã hết hạn. Vui lòng đăng nhập lại.',
    TOKEN_INVALID_OR_EXPIRED: 'Token không hợp lệ hoặc đã hết hạn.',
    AUTH_ERROR: 'Lỗi xác thực token.',
    USER_ID_NOT_FOUND: 'Lỗi: User ID không tồn tại',
  },

  USER: {
    CREATE_FAILED: 'Lỗi khi tạo user',
    NOT_FOUND: 'Người dùng không tồn tại',
    UPDATE_FAILED: 'Lỗi khi cập nhật thông tin người dùng',
    DELETE_FAILED: 'Lỗi khi xóa người dùng',
  },

  GROUP: {
    NOT_FOUND: 'Nhóm không tồn tại',
    CREATE_FAILED: 'Lỗi khi tạo nhóm',
  },

  VALIDATION: {
    INVALID_EMAIL: 'Email không hợp lệ',
    INVALID_PASSWORD: 'Mật khẩu không hợp lệ',
    PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 6 ký tự',
    USERNAME_TOO_SHORT: 'Tên người dùng phải có ít nhất 3 ký tự',
    USERNAME_TOO_LONG: 'Tên người dùng không được vượt quá 50 ký tự',
    FIELD_REQUIRED: 'Trường này là bắt buộc',
    INVALID_INPUT: 'Dữ liệu đầu vào không hợp lệ',
  },

  SERVER: {
    INTERNAL_ERROR: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    ROUTE_NOT_FOUND: 'Route not found',
    DATABASE_ERROR: 'Lỗi kết nối database',
    UNAUTHORIZED: 'Bạn không có quyền truy cập',
    FORBIDDEN: 'Không có quyền thực hiện hành động này',
  },
} as const;
