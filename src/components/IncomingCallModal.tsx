import React from 'react';
import { Icon } from '@iconify/react';

interface IncomingCallModalProps {
  isOpen: boolean;
  phoneNumber: string;
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  phoneNumber,
  onAccept,
  onReject
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[1000] transition-opacity duration-200">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl w-[320px] p-8 text-center flex flex-col items-center justify-center gap-5 animate-bounce-custom">
        <Icon icon="solar:bell-ring-bold" className="text-5xl text-amber-500 animate-bell-ring-custom" />
        <div>
          <h2 className="text-sm font-semibold text-slate-500">Cuộc gọi đến</h2>
          <div className="text-2xl font-bold text-slate-800 tracking-wider mt-1">
            {phoneNumber}
          </div>
        </div>
        <div className="flex gap-3 mt-2 w-full">
          <button 
            onClick={onReject}
            className="flex-1 py-2.5 bg-red-100 hover:bg-red-500 text-red-700 hover:text-white border border-red-200 hover:border-red-500 font-semibold rounded text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-1"
          >
            <Icon icon="solar:phone-bold" className="text-base [transform:rotate(135deg)]" />
            Từ chối
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-1"
          >
            <Icon icon="solar:phone-bold" className="text-base" />
            Trả lời
          </button>
        </div>
      </div>
      
      {/* Dynamic CSS animations */}
      <style>{`
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0); }
          15% { transform: rotate(10deg); }
          30% { transform: rotate(-10deg); }
          45% { transform: rotate(5deg); }
          60% { transform: rotate(-5deg); }
          75% { transform: rotate(2deg); }
          85% { transform: rotate(-2deg); }
        }
        .animate-bell-ring-custom {
          animation: bell-ring 1s ease-in-out infinite;
        }
        @keyframes bounce-subtle {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }
        .animate-bounce-custom {
          animation: bounce-subtle 0.5s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};
