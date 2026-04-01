'use client';

import { CheckCircle, Download, Printer, Copy } from 'lucide-react';
import { useState } from 'react';

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

  const handleDownload = () => {
    const content = `DELUXE HOMES - REFUND REQUEST SUMMARY
=========================================
Ticket Number: ${submission.ticketNumber}
Submitted: ${submission.submittedAt}

GUEST INFORMATION
-----------------
Full Name: ${submission.fullName}
Email: ${submission.email}

BOOKING DETAILS
---------------
Reference: ${submission.bookingReference}
Booking Date: ${submission.bookingDate}

REFUND DETAILS
--------------
Reason: ${submission.refundReason}
Additional Details: ${submission.additionalDetails || 'None provided'}

EVIDENCE
--------
${submission.evidenceUrl ? '✓ Evidence uploaded' : '✗ No evidence provided'}

STATUS: Pending Review
=========================================
Thank you for choosing Deluxe Homes. We'll review your request within 2-3 business days.
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `refund-${submission.ticketNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-up">
          {/* Success Header */}
          <div className="relative bg-deluxe-navy px-6 py-12 text-center">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white mb-4">
                <CheckCircle className="h-10 w-10 text-deluxe-blue" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Refund Request Submitted
              </h2>
              <p className="text-blue-100">
                We've received your request and will review it promptly
              </p>
              <p className="text-white text-sm mt-3 font-mono bg-blue-900/50 inline-block px-4 py-2 rounded-lg">
                Reference: {submission.ticketNumber}
              </p>
            </div>
          </div>
          
          {/* Submission Details */}
          <div className="px-6 py-8">
            <h3 className="text-lg font-display font-bold text-deluxe-navy mb-4">
              Submission Summary
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <dt className="font-bold text-gray-600 font-sans uppercase text-[10px] tracking-wider">Ticket Number</dt>
                <dd className="col-span-2 font-mono text-deluxe-blue font-bold">{submission.ticketNumber}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <dt className="font-bold text-gray-600 font-sans uppercase text-[10px] tracking-wider">Submitted</dt>
                <dd className="col-span-2 text-gray-900">{submission.submittedAt}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <dt className="font-bold text-gray-600 font-sans uppercase text-[10px] tracking-wider">Guest Name</dt>
                <dd className="col-span-2 text-gray-900">{submission.fullName}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <dt className="font-bold text-gray-600 font-sans uppercase text-[10px] tracking-wider">Email</dt>
                <dd className="col-span-2 text-gray-900">{submission.email}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <dt className="font-bold text-gray-600 font-sans uppercase text-[10px] tracking-wider">Booking Reference</dt>
                <dd className="col-span-2 font-mono text-gray-900">{submission.bookingReference}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <dt className="font-bold text-gray-600 font-sans uppercase text-[10px] tracking-wider">Booking Date</dt>
                <dd className="col-span-2 text-gray-900">{submission.bookingDate}</dd>
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
                <dt className="font-bold text-gray-600 font-sans uppercase text-[10px] tracking-wider">Refund Reason</dt>
                <dd className="col-span-2">
                  <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-deluxe-blue uppercase tracking-wider">
                    {submission.refundReason}
                  </span>
                </dd>
              </div>
              
              {submission.additionalDetails && (
                <div className="py-2">
                  <dt className="font-bold text-gray-600 font-sans uppercase text-[10px] tracking-wider mb-2">Additional Details</dt>
                  <dd className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm italic">
                    "{submission.additionalDetails}"
                  </dd>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex justify-center items-center px-4 py-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition uppercase tracking-wider"
                >
                  <Download className="h-4 w-4 mr-2 text-deluxe-blue" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex justify-center items-center px-4 py-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition uppercase tracking-wider"
                >
                  <Printer className="h-4 w-4 mr-2 text-deluxe-blue" />
                  Print
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex justify-center items-center px-4 py-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition uppercase tracking-wider"
                >
                  <Copy className="h-4 w-4 mr-2 text-deluxe-blue" />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              
              <button
                onClick={onReset}
                className="btn-primary"
              >
                Submit Another Request
              </button>
            </div>
            
            {/* Next Steps */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <p className="font-bold text-deluxe-navy mb-4 uppercase text-xs tracking-widest">Next Steps</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-6 text-deluxe-blue font-bold">01</span>
                  <span>Our guest experience team will review your request within <strong>2-3 business days</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 text-deluxe-blue font-bold">02</span>
                  <span>You will receive updates via email at <strong>{submission.email}</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 text-deluxe-blue font-bold">03</span>
                  <span>For urgent inquiries, reference ticket <strong className="font-mono">{submission.ticketNumber}</strong>.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
