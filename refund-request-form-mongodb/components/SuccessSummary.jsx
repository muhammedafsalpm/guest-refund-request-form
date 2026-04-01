'use client';

import { CheckCircle, Download, Printer, Copy, FileText, Calendar, Hash, User, Mail, Tag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';

export default function SuccessSummary({ submission, onReset }) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => window.print();
  
  const handleCopy = () => {
    const content = `
REFUND REQUEST SUMMARY
Ticket: ${submission.ticketNumber}
Submitted: ${submission.submittedAt}
Name: ${submission.fullName}
Email: ${submission.email}
Booking: ${submission.bookingReference}
Date: ${submission.bookingDate}
Reason: ${submission.refundReason}
    `;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add branding
    doc.setFillColor(0, 43, 92); // Deluxe Navy
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('DELUXE HOLIDAY HOMES', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('REFUND REQUEST SUMMARY', 105, 30, { align: 'center' });
    
    // Body Text
    doc.setTextColor(0, 43, 92);
    doc.setFontSize(12);
    
    let y = 60;
    const addLine = (label, value) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${value}`, 80, y);
      y += 10;
    };
    
    addLine('Ticket Number', submission.ticketNumber);
    addLine('Submission Date', submission.submittedAt);
    y += 5;
    addLine('Guest Name', submission.fullName);
    addLine('Email Address', submission.email);
    y += 5;
    addLine('Booking Ref', submission.bookingReference);
    addLine('Booking Date', submission.bookingDate);
    addLine('Refund Reason', submission.refundReason);
    
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Context:', 20, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(submission.additionalDetails || 'No additional details provided.', 170);
    doc.text(splitText, 20, y);
    
    y += (splitText.length * 7) + 10;
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    doc.text('Thank you for choosing Deluxe Homes. We will review your request shortly.', 105, 280, { align: 'center' });
    
    doc.save(`refund-${submission.ticketNumber}.pdf`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=2070")',
          filter: 'brightness(0.7)'
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-deluxe-navy/90 via-deluxe-navy/70 to-transparent" />

      <div className="relative z-20 w-full max-w-2xl mx-auto animate-fade-up">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Header Section */}
          <div className="bg-deluxe-navy px-8 py-12 text-center relative overflow-hidden">
            {/* Animated background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-deluxe-blue/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white shadow-lg mb-6 ring-4 ring-deluxe-blue/20">
                <CheckCircle className="h-10 w-10 text-deluxe-blue animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Request Received Successfully
              </h2>
              <p className="text-blue-100/80 text-lg font-light">
                Our experience team is now reviewing your request.
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-full">
                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Reference No.</span>
                <span className="text-white font-mono font-bold">{submission.ticketNumber}</span>
              </div>
            </div>
          </div>
          
          {/* Content Body */}
          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-deluxe-navy uppercase tracking-wider flex items-center">
                <FileText className="h-5 w-5 mr-3 text-deluxe-blue" />
                Submission Summary
              </h3>
              <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-green-100">
                Processed
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guest Name</p>
                <p className="text-gray-800 font-semibold flex items-center">
                  <User className="h-4 w-4 mr-2 text-deluxe-blue/60" />
                  {submission.fullName}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                <p className="text-gray-800 font-semibold flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-deluxe-blue/60" />
                  {submission.email}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking Ref</p>
                <p className="text-gray-900 font-mono font-bold flex items-center">
                  <Hash className="h-4 w-4 mr-2 text-deluxe-blue/60" />
                  {submission.bookingReference}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking Date</p>
                <p className="text-gray-800 font-semibold flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-deluxe-blue/60" />
                  {submission.bookingDate}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Refund Reason</p>
                <div className="flex items-center mt-1">
                  <Tag className="h-4 w-4 mr-2 text-deluxe-blue/60" />
                  <span className="bg-blue-50 text-deluxe-navy text-xs font-bold px-4 py-1.5 rounded-lg border border-blue-100 uppercase tracking-tight">
                    {submission.refundReason}
                  </span>
                </div>
              </div>
            </div>

            {submission.additionalDetails && (
              <div className="mt-6 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 italic text-sm text-gray-600 line-clamp-3">
                "{submission.additionalDetails}"
              </div>
            )}

            {/* Action Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
              <button
                onClick={handleDownloadPDF}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-white hover:bg-deluxe-blue hover:text-white transition-all duration-300 group shadow-sm"
              >
                <Download className="h-6 w-6 mb-2 text-deluxe-blue group-hover:text-white transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Save PDF</span>
              </button>
              
              <button
                onClick={handlePrint}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-white hover:bg-deluxe-blue hover:text-white transition-all duration-300 group shadow-sm"
              >
                <Printer className="h-6 w-6 mb-2 text-deluxe-blue group-hover:text-white transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Print</span>
              </button>
              
              <button
                onClick={handleCopy}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-white hover:bg-deluxe-blue hover:text-white transition-all duration-300 group shadow-sm col-span-2 sm:col-span-1"
              >
                <Copy className="h-6 w-6 mb-2 text-deluxe-blue group-hover:text-white transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {copied ? 'Copied!' : 'Copy Info'}
                </span>
              </button>
            </div>
            
            <button
              onClick={onReset}
              className="w-full mt-8 bg-deluxe-navy text-white py-5 rounded-2xl font-bold uppercase tracking-[0.25em] hover:bg-deluxe-blue transition-all duration-500 shadow-xl flex items-center justify-center group"
            >
              <ArrowLeft className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              Return Result Dashboard
            </button>
          </div>
          
          {/* Footer Timeline */}
          <div className="bg-gray-50/80 px-8 py-6 border-t border-gray-100">
             <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Estimated Review: 2-3 Business Days
                </div>
                <span>© Deluxe Homes</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
