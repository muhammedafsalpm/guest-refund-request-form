import { differenceInDays, parseISO, isValid } from 'date-fns';

/**
 * Check if booking date is older than 90 days
 */
export const isOlderThan90Days = (dateString) => {
  if (!dateString) return false;
  
  const bookingDate = parseISO(dateString);
  if (!isValid(bookingDate)) return false;
  
  const currentDate = new Date();
  const daysDifference = differenceInDays(currentDate, bookingDate);
  
  return daysDifference > 90;
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Get days difference between today and booking date
 */
export const getDaysDifference = (dateString) => {
  if (!dateString) return 0;
  
  try {
    const bookingDate = parseISO(dateString);
    if (!isValid(bookingDate)) return 0;
    
    return differenceInDays(new Date(), bookingDate);
  } catch (error) {
    return 0;
  }
};

/**
 * Format ticket number
 */
export const formatTicketNumber = (ticketNumber) => {
  if (!ticketNumber) return 'Pending';
  return ticketNumber;
};

/**
 * Format currency (if needed)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
