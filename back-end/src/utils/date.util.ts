/**
 * Format date thành string theo định dạng Việt Nam
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format date và time thành string
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Lấy timestamp hiện tại
 */
export const getCurrentTimestamp = (): Date => {
  return new Date();
};

/**
 * Kiểm tra date có hợp lệ không
 */
export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
