const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat('vi-VN');
const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

export const formatCurrency = (value: number) => currencyFormatter.format(value);
export const formatNumber = (value: number) => numberFormatter.format(value);
export const formatDateTime = (value: string | Date) => dateTimeFormatter.format(new Date(value));
