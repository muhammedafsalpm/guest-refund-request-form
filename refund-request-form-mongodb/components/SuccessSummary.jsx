import { CheckCircle, Printer, Download, Copy, Mail, RefreshCcw, Calendar, User, FileText, Hash, Clock, ExternalLink } from 'lucide-react';

export default function SuccessSummary({ submission, onReset }) {
  const copyToClipboard = () => {
    const text = `Refund Request Summary\nTicket: ${submission.ticketNumber}\nName: ${submission.fullName}\nEmail: ${submission.email}\nReference: ${submission.bookingReference}`;
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  const handlePrint = () => window.print();

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 py-8">
      {/* Background Decor */}
      <div className="blob left-[-10%] top-[-10%] opacity-20"></div>
      <div className="blob right-[-10%] bottom-[-10%] bg-purple-500/10 opacity-20"></div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl bg-white/80 backdrop-blur-xl border border-white/50">
        {/* Header Section */}
        <div className="success-gradient p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mb-6 border border-white/30 animate-pulse-slow">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Request submitted!</h1>
            <p className="text-emerald-50/80 font-medium max-w-md mx-auto">
              Your refund request has been securely logged and is being reviewed by our team.
            </p>
            <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Hash className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-mono font-bold tracking-wider">{submission.ticketNumber}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-10">
          <div>
            <h2 className="flex items-center text-xl font-black text-slate-800 mb-6 group">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3 group-hover:scale-y-125 transition-transform"></span>
              Submission Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <SummaryItem icon={<User />} label="Full Name" value={submission.fullName} />
              <SummaryItem icon={<Mail />} label="Email Address" value={submission.email} />
              <SummaryItem icon={<Hash />} label="Booking Reference" value={submission.bookingReference} />
              <SummaryItem icon={<Calendar />} label="Booking Date" value={submission.bookingDate} />
              <SummaryItem icon={<FileText />} label="Refund Reason" value={submission.refundReason} isBadge />
              <SummaryItem icon={<Clock />} label="Submitted At" value={submission.submittedAt} />
            </div>

            {submission.additionalDetails && (
              <div className="mt-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 backdrop-blur-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Additional Details</p>
                <p className="text-slate-600 leading-relaxed italic">"{submission.additionalDetails}"</p>
              </div>
            )}

            {submission.evidenceUrl && (
              <div className="mt-6">
                <a 
                  href={submission.evidenceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Attached Evidence</span>
                </a>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          {/* Action Grid */}
          <div className="space-y-6">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Manage your request</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionButton icon={<Download />} label="Download" onClick={() => alert('Summary generated!')} />
              <ActionButton icon={<Printer />} label="Print" onClick={handlePrint} />
              <ActionButton icon={<Copy />} label="Copy Info" onClick={copyToClipboard} />
              <ActionButton icon={<Mail />} label="Email Me" onClick={() => alert('Confirmation email sent!')} />
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full flex items-center justify-center space-x-3 py-5 px-6 rounded-3xl bg-slate-900 text-white font-bold hover:bg-black transition-all hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98]"
          >
            <RefreshCcw className="h-5 w-5" />
            <span>Submit Another Request</span>
          </button>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-10 animate-fade-in delay-300">
        <div className="glass-card bg-white/40 rounded-[2rem] p-8 border-white/60 backdrop-blur-md">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-slate-800">What happens next?</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative p-6 bg-white/60 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
               <span className="absolute -top-3 -left-2 w-8 h-8 flex items-center justify-center bg-slate-900 text-white text-xs font-black rounded-xl">01</span>
               <p className="text-sm font-medium text-slate-600 leading-relaxed pt-2">
                 Our internal auditing team will verify your booking details and provided evidence within <strong className="text-blue-600">48 hours</strong>.
               </p>
            </div>
            <div className="relative p-6 bg-white/60 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
               <span className="absolute -top-3 -left-2 w-8 h-8 flex items-center justify-center bg-slate-900 text-white text-xs font-black rounded-xl">02</span>
               <p className="text-sm font-medium text-slate-600 leading-relaxed pt-2">
                 You'll receive a confirmation email at <strong className="text-blue-600">{submission.email}</strong> with a deep-link to track your refund status.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ icon, label, value, isBadge }) {
  return (
    <div className="flex items-start space-x-4 animate-slide-in group">
      <div className="p-3 bg-white text-slate-400 rounded-2xl border border-slate-100 group-hover:text-blue-500 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">{label}</p>
        {isBadge ? (
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black border border-blue-100">
            {value}
          </span>
        ) : (
          <p className="text-slate-800 font-bold tracking-tight">{value}</p>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 space-y-3 rounded-3xl bg-white/50 border border-white hover:border-blue-200 hover:bg-white hover:text-blue-600 group transition-all hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm"
    >
      <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-500 border border-transparent group-hover:border-blue-100 transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}
