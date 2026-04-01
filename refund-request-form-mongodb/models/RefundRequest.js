import { ObjectId } from 'mongodb';

class RefundRequest {
  constructor(data) {
    this.fullName = data.fullName;
    this.email = data.email;
    this.bookingReference = data.bookingReference;
    this.bookingDate = new Date(data.bookingDate);
    this.refundReason = data.refundReason;
    this.additionalDetails = data.additionalDetails || '';
    this.evidenceUrl = data.evidenceUrl || null;
    this.status = data.status || 'pending';
    this.ipAddress = data.ipAddress || null;
    this.userAgent = data.userAgent || null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Generate ticket number
  static generateTicketNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REF-${year}${month}${day}-${random}`;
  }

  // Validate booking date
  static isValidBookingDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  }

  // Check if booking is older than 90 days
  static isOlderThan90Days(dateString) {
    const bookingDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - bookingDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 90;
  }

  toJSON() {
    return {
      fullName: this.fullName,
      email: this.email,
      bookingReference: this.bookingReference,
      bookingDate: this.bookingDate,
      refundReason: this.refundReason,
      additionalDetails: this.additionalDetails,
      evidenceUrl: this.evidenceUrl,
      status: this.status,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default RefundRequest;
