'use client';

import { AlertTriangle } from 'lucide-react';

export default function WarningBanner({ daysOverdue }) {
  if (!daysOverdue || daysOverdue <= 90) return null;

  return (
    <div className="animate-fade-in mb-6">
      <div className="glass-card bg-amber-50/50 rounded-xl p-4 border-amber-200/50 flex items-start gap-4">
        <div className="flex-shrink-0 p-2 bg-amber-100 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">
            Refund Window Notice
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            Your booking is outside the standard refund window (booked {daysOverdue} days ago). 
            Manual review by our senior management team will be required for this request.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-amber-700">Priority: Manual Review Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
