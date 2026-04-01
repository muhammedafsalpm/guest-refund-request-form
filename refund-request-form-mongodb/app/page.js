'use client';

import { useState } from 'react';
import { validateForm } from '@/lib/validation';
import { isOlderThan90Days, getDaysDifference } from '@/lib/dateUtils';
import WarningBanner from '@/components/WarningBanner';
import FileUpload from '@/components/FileUpload';
import SuccessSummary from '@/components/SuccessSummary';
import { 
  User, 
  Mail, 
  Hash, 
  Calendar, 
  Tag, 
  FileText, 
  Send,
  Shield,
  Star,
  Loader2
} from 'lucide-react';

export default function RefundForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bookingReference: '',
    bookingDate: '',
    refundReason: '',
    additionalDetails: '',
  });
  const [fileData, setFileData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileSelect = (fileInfo) => {
    setFileData(fileInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      const submissionData = {
        ...formData,
        evidenceUrl: fileData?.url || null,
      };
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }
      
      const summary = {
        ...formData,
        ticketNumber: result.data.ticketNumber,
        submittedAt: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'medium'
        }),
        evidenceUrl: fileData?.url || null,
      };
      
      setSubmission(summary);
      
      setFormData({
        fullName: '',
        email: '',
        bookingReference: '',
        bookingDate: '',
        refundReason: '',
        additionalDetails: '',
      });
      setFileData(null);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submission) {
    return <SuccessSummary submission={submission} onReset={() => setSubmission(null)} />;
  }

  const showWarning = formData.bookingDate && isOlderThan90Days(formData.bookingDate);
  const daysOverdue = formData.bookingDate ? getDaysDifference(formData.bookingDate) : 0;

  return (
    <div className="min-h-screen bg-deluxe-light font-sans">
      {/* Hero Section */}
      <div className="relative text-white overflow-hidden min-h-[60vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        ></div>
        {/* Overlay - Branded Navy with slight transparency */}
        <div className="absolute inset-0 bg-gradient-to-b from-deluxe-navy/80 via-deluxe-navy/70 to-deluxe-navy/90 backdrop-blur-[1px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center w-full">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/20 shadow-xl">
            <Star className="h-4 w-4 text-deluxe-blue fill-current animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">Guest First Commitment</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight drop-shadow-2xl">
            Guest Refund Request
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
            Submit your refund request and our dedicated experience team will review it promptly with full transparency.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-white/80">
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Shield className="h-4 w-4 text-deluxe-blue" />
              <span>Secure Portal</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-deluxe-blue rounded-full animate-ping"></div>
              <span>Fast Processing</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <span className="text-deluxe-blue font-black">24/7</span>
              <span>Priority Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-24 relative z-10 mb-20">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,43,92,0.15)] overflow-hidden border border-white/40 animate-fade-up">
          {/* Form Header */}
          <div className="bg-white px-8 py-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-1.5 h-12 bg-deluxe-blue rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-deluxe-navy uppercase tracking-widest">Refund Details</h2>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.3em] font-medium">Official Submission Portal • Step 1 of 1</p>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Reference number placeholder removed */}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10 bg-gradient-to-b from-white to-gray-50/30">
            {/* Error Alert */}
            {submitError && (
              <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg flex items-center space-x-4">
                <div className="bg-red-600 p-2 rounded-full text-white">!</div>
                <p className="text-sm font-bold text-red-700">{submitError}</p>
              </div>
            )}
            
            {/* Warning Banner */}
            {showWarning && <WarningBanner daysOverdue={daysOverdue} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="form-label">
                  Full Name *
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-deluxe-blue transition-colors duration-200" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`form-input pl-12 ${errors.fullName ? 'border-red-600 ring-1 ring-red-600' : ''}`}
                    placeholder="Omar Khalid Al-Farsi"
                    disabled={submitting}
                  />
                </div>
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-deluxe-blue transition-colors duration-200" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input pl-12 ${errors.email ? 'border-red-600 ring-1 ring-red-600' : ''}`}
                    placeholder="omar.farsi@email.com"
                    disabled={submitting}
                  />
                </div>
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Booking Reference */}
              <div>
                <label htmlFor="bookingReference" className="form-label">
                  Booking Reference *
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="bookingReference"
                    name="bookingReference"
                    value={formData.bookingReference}
                    onChange={handleInputChange}
                    className={`form-input focus:ring-deluxe-blue border-gray-200 ${errors.bookingReference ? 'border-red-600 ring-1 ring-red-600' : ''}`}
                    placeholder="REF-123456"
                    disabled={submitting}
                  />
                </div>
                {errors.bookingReference && <p className="error-text">{errors.bookingReference}</p>}
              </div>
              
              {/* Booking Date */}
              <div>
                <label htmlFor="bookingDate" className="form-label">
                  Booking Date *
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-deluxe-blue transition-colors duration-200" />
                  <input
                    type="date"
                    id="bookingDate"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleInputChange}
                    className={`form-input pl-12 ${errors.bookingDate ? 'border-red-600 ring-1 ring-red-600' : ''}`}
                    max={new Date().toISOString().split('T')[0]}
                    disabled={submitting}
                  />
                </div>
                {errors.bookingDate && <p className="error-text">{errors.bookingDate}</p>}
              </div>
            </div>
            
            {/* Refund Reason */}
            <div>
              <label htmlFor="refundReason" className="form-label">
                Refund Reason *
              </label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-deluxe-blue transition-colors duration-200" />
                <select
                  id="refundReason"
                  name="refundReason"
                  value={formData.refundReason}
                  onChange={handleInputChange}
                  className={`form-input pl-12 appearance-none ${errors.refundReason ? 'border-red-600 ring-1 ring-red-600' : ''}`}
                  disabled={submitting}
                >
                  <option value="">Select a reason</option>
                  <option value="Property Issue">Property Issue (Maintenance, Cleanliness, etc.)</option>
                  <option value="Booking Error">Booking Error (Wrong dates, duplicate, etc.)</option>
                  <option value="Personal Reasons">Personal Reasons (Change of plans, emergency)</option>
                  <option value="Other">Other (Please specify in details)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
              {errors.refundReason && <p className="error-text">{errors.refundReason}</p>}
            </div>
            
            {/* Additional Details */}
            <div>
              <label htmlFor="additionalDetails" className="form-label">
                Additional Context
              </label>
              <div className="relative group">
                <FileText className="absolute left-4 top-5 h-5 w-5 text-gray-400 group-focus-within:text-deluxe-blue transition-colors duration-200" />
                <textarea
                  id="additionalDetails"
                  name="additionalDetails"
                  rows={5}
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  className="form-input pl-12 h-40 resize-none"
                  placeholder="Tell us more about your request so we can assist you better..."
                  disabled={submitting}
                />
              </div>
            </div>
            
            {/* File Upload */}
            <div className="space-y-4">
              <label className="form-label">
                Supporting Evidence
              </label>
              <FileUpload 
                onFileSelect={handleFileSelect}
                accept="image/*,.pdf"
                maxSize={10 * 1024 * 1024}
              />
            </div>
            
            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    Processing...
                  </span>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </div>
            
            {/* Security Notice */}
            <div className="flex items-center justify-center space-x-8 pt-8 border-t border-gray-50">
              <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                <Shield className="h-4 w-4 text-deluxe-blue" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                <Star className="h-4 w-4 text-deluxe-blue" />
                <span>Verified Client</span>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] space-x-4">
          <span>© 2026 Deluxe Stays</span>
          <span className="text-gray-200">|</span>
          <a href="#" className="hover:text-deluxe-blue transition">Privacy Policy</a>
          <span className="text-gray-200">|</span>
          <a href="#" className="hover:text-deluxe-blue transition">Terms</a>
        </div>
      </div>
    </div>
  );
}
