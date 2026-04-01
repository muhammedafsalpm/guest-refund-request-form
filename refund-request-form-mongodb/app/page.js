'use client';

import { useState, useCallback } from 'react';
import { validateForm } from '@/lib/validation';
import { isOlderThan90Days, getDaysDifference } from '@/lib/dateUtils';
import WarningBanner from '@/components/WarningBanner';
import FileUpload from '@/components/FileUpload';
import SuccessSummary from '@/components/SuccessSummary';
import { Send, Loader2, Sparkles, ShieldCheck, Clock } from 'lucide-react';

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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleFileSelect = useCallback((fileInfo) => {
    setFileData(fileInfo);
  }, []);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed');
      
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
        fullName: '', email: '', bookingReference: '',
        bookingDate: '', refundReason: '', additionalDetails: '',
      });
      setFileData(null);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit request.');
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
    <div className="relative min-h-screen overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Blobs */}
      <div className="blob -left-20 -top-20 opacity-30"></div>
      <div className="blob -right-20 bottom-0 bg-purple-500/10 opacity-30"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles className="h-3 w-3 mr-2" /> Official Refund Portal
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            Guest Refund <span className="text-transparent bg-clip-text primary-gradient">Request</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
            Providing a seamless way to handle your concerns with transparency and care.
          </p>
        </div>
        
        {/* Main Card */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden animate-fade-in group hover:shadow-blue-500/5 transition-all duration-500">
          <div className="bg-slate-900/5 px-8 py-4 border-b border-white/40 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Step 01: Formulation</span>
            </div>
            <div className="flex items-center text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3 mr-1" /> Secure End-to-End
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            {submitError && (
              <div className="bg-red-50/50 backdrop-blur-md border border-red-100 p-4 rounded-2xl flex items-center animate-fade-in">
                 <div className="bg-red-100 p-2 rounded-xl mr-4 text-red-600">!</div>
                 <p className="text-sm font-bold text-red-700">{submitError}</p>
              </div>
            )}
            
            {showWarning && <WarningBanner daysOverdue={daysOverdue} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField 
                label="Full Name" name="fullName" value={formData.fullName} 
                onChange={handleInputChange} error={errors.fullName} placeholder="John Doe" 
                disabled={submitting}
              />
              <InputField 
                label="Email Address" name="email" type="email" value={formData.email} 
                onChange={handleInputChange} error={errors.email} placeholder="john@example.com" 
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField 
                label="Booking Reference" name="bookingReference" value={formData.bookingReference} 
                onChange={handleInputChange} error={errors.bookingReference} placeholder="REF-123456" 
                disabled={submitting}
              />
              <InputField 
                label="Booking Date" name="bookingDate" type="date" value={formData.bookingDate} 
                onChange={handleInputChange} error={errors.bookingDate} 
                disabled={submitting}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Refund Reason</label>
              <select
                name="refundReason"
                value={formData.refundReason}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 bg-white/50 rounded-2xl border transition-all appearance-none cursor-pointer
                  ${errors.refundReason ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-100 focus:border-blue-400'}`}
                disabled={submitting}
              >
                <option value="">Select your reason</option>
                <option value="Property Issue">🏠 Property Issue</option>
                <option value="Booking Error">📅 Booking Error</option>
                <option value="Personal Reasons">👤 Personal Reasons</option>
                <option value="Other">❓ Other</option>
              </select>
              {errors.refundReason && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{errors.refundReason}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Additional Context</label>
              <textarea
                name="additionalDetails"
                rows={4}
                value={formData.additionalDetails}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-white/50 rounded-2xl border border-slate-100 focus:border-blue-400"
                placeholder="How can we help make this right?"
                disabled={submitting}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Supporting Evidence</label>
              <FileUpload onFileSelect={handleFileSelect} accept="image/*,.pdf" maxSize={10 * 1024 * 1024} />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full relative group overflow-hidden"
            >
              <div className="absolute inset-0 primary-gradient transition-all duration-300 group-hover:scale-105"></div>
              <div className="relative flex items-center justify-center py-5 px-6 rounded-2xl text-white font-black uppercase tracking-[0.2em] transition-all">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Submit Request
                  </>
                )}
              </div>
            </button>
          </form>
          
          {/* Footer Badge */}
          <div className="p-6 bg-slate-50/50 border-t border-white/40 flex flex-wrap justify-between items-center gap-4">
             <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <Clock className="h-3 w-3 mr-2" /> Resp: ~48 Hours
             </div>
             <p className="text-[10px] text-slate-400 font-medium">By submitting, you agree to our Terms of Fair Usage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, type = 'text', value, onChange, error, placeholder, disabled }) {
  return (
    <div className="space-y-2 flex-1">
      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-5 py-4 bg-white/50 rounded-2xl border transition-all
          ${error ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-100 focus:border-blue-400'}`}
      />
      {error && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{error}</p>}
    </div>
  );
}
