'use client';

import { AlertCircle } from 'lucide-react';

export default function WarningBanner({ daysOverdue }) {
  return (
    <div className="mb-8 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-2xl animate-fade-up shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          <AlertCircle className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">
            Policy Notice: Extended Review Required
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            Your booking is <strong className="font-bold underline decoration-amber-300 decoration-2">{daysOverdue} days</strong> old, which is outside our standard 90-day refund window. 
            <span className="block mt-2 font-medium bg-amber-100/50 p-2 rounded-lg border border-amber-200">
              "Your booking is outside the standard refund window. Your request will be reviewed on a case-by-case basis."
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
