/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate full name
 */
export const validateFullName = (name) => {
  if (!name || !name.trim()) {
    return 'Full name is required';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters';
  }
  if (name.trim().length > 100) {
    return 'Full name must be less than 100 characters';
  }
  return null;
};

/**
 * Validate email
 */
export const validateEmailField = (email) => {
  if (!email || !email.trim()) {
    return 'Email address is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address (e.g., name@example.com)';
  }
  return null;
};

/**
 * Validate booking reference
 */
export const validateBookingReference = (reference) => {
  if (!reference || !reference.trim()) {
    return 'Booking reference is required';
  }
  if (reference.trim().length < 3) {
    return 'Booking reference must be at least 3 characters';
  }
  return null;
};

/**
 * Validate booking date
 */
export const validateBookingDate = (date) => {
  if (!date) {
    return 'Booking date is required';
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate > today) {
    return 'Booking date cannot be in the future';
  }
  return null;
};

/**
 * Validate refund reason
 */
export const validateRefundReason = (reason) => {
  if (!reason) {
    return 'Please select a refund reason';
  }
  const validReasons = ['Property Issue', 'Booking Error', 'Personal Reasons', 'Other'];
  if (!validReasons.includes(reason)) {
    return 'Invalid refund reason selected';
  }
  return null;
};

/**
 * Validate entire form
 */
export const validateForm = (data) => {
  const errors = {};
  
  const fullNameError = validateFullName(data.fullName);
  if (fullNameError) errors.fullName = fullNameError;
  
  const emailError = validateEmailField(data.email);
  if (emailError) errors.email = emailError;
  
  const bookingRefError = validateBookingReference(data.bookingReference);
  if (bookingRefError) errors.bookingReference = bookingRefError;
  
  const bookingDateError = validateBookingDate(data.bookingDate);
  if (bookingDateError) errors.bookingDate = bookingDateError;
  
  const refundReasonError = validateRefundReason(data.refundReason);
  if (refundReasonError) errors.refundReason = refundReasonError;
  
  return errors;
};
