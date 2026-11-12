export function toWhatsAppDigits(rawNumber: string): string {
  const digits = rawNumber.replace(/[^0-9]/g, '');
  if (!digits) return '2348122039882';
  // Convert Nigerian 11-digit local number (e.g. 08122039882) to international 234 format
  if (digits.startsWith('0') && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }
  return digits;
}

export function buildWhatsAppUrl(rawNumber: string, message: string): string {
  const digits = toWhatsAppDigits(rawNumber);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
