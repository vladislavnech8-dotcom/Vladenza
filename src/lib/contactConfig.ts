/**
 * Centralized contact channel configuration.
 *
 * Update BOOKING_URL and WHATSAPP_URL here when the real links are available.
 * Until then, these remain as placeholder values that render the link visibly
 * but navigate to the contact form anchor instead of a broken destination.
 */

export const CONTACT_CONFIG = {
  EMAIL: 'info@vladenza.com',
  TELEGRAM_URL: 'https://t.me/vladenza',
  TELEGRAM_HANDLE: '@vladenza',
  LINKEDIN_URL: 'https://www.linkedin.com/company/vladenza',
  BOOKING_URL: '' as string,
  WHATSAPP_URL: '' as string,
};

/**
 * Returns the booking URL if configured, otherwise a safe fallback
 * that scrolls to the contact form instead of navigating to a broken link.
 */
export function getBookingUrl(): string {
  return CONTACT_CONFIG.BOOKING_URL || '#contact-form';
}

/**
 * Returns the WhatsApp URL if configured, otherwise a safe fallback.
 */
export function getWhatsappUrl(): string {
  return CONTACT_CONFIG.WHATSAPP_URL || '#contact-form';
}
