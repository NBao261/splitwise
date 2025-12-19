/**
 * Loại bỏ khoảng trắng thừa và trim
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Chuyển đổi string thành lowercase và loại bỏ khoảng trắng
 */
export const normalizeString = (str: string): string => {
  return str.toLowerCase().trim();
};

/**
 * Kiểm tra string có rỗng không (bao gồm null, undefined, empty string, chỉ có khoảng trắng)
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Format số tiền theo định dạng Việt Nam
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format số tiền không có ký hiệu currency
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};
