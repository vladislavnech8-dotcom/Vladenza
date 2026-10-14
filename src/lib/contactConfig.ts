export const CONTACT_CONFIG = {
  EMAIL: 'info@vladenza.com',
  TELEGRAM_URL: 'https://t.me/vladenza',
  TELEGRAM_HANDLE: '@vladenza',
  LINKEDIN_URL: 'https://www.linkedin.com/company/vladenza',
  BOOKING_URL: 'https://koalendar.com/e/meet-with-vladenza-agency',
  WHATSAPP_URL: 'https://wa.me/message/KJI2Y7J4CAXGC1',
};

export function getBookingUrl(): string {
  return CONTACT_CONFIG.BOOKING_URL;
}

export function getWhatsappUrl(): string {
  return CONTACT_CONFIG.WHATSAPP_URL;
}
