'use client';

import { AlertTriangle } from 'lucide-react';

export default function WarningBanner({ daysOverdue }) {
  return (
    <div className="mb-6 p-5 bg-blue-50 border-l-4 border-deluxe-blue rounded-lg animate-fade-up">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-deluxe-blue" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-deluxe-navy">
            Refund Window Policy
          </h3>
          <p className="mt-1 text-sm text-gray-700">
            This booking is <strong className="font-bold">{daysOverdue} days</strong> past the standard 90-day window. 
            The request will be reviewed manually by our guest experience team.
          </p>
        </div>
      </div>
    </div>
  );
}
