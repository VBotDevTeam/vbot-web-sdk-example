import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ActiveCallWidgetProps {
  isActive: boolean;
  phoneNumber: string;
  status: string;
  duration: number;
  mute: boolean;
  hold: boolean;
  onMuteToggle: () => void;
  onHoldToggle: () => void;
  onHangup: () => void;
  onSendDTMF: (key: string) => void;
}

export const ActiveCallWidget: React.FC<ActiveCallWidgetProps> = ({
  isActive,
  phoneNumber,
  status,
  duration,
  mute,
  hold,
  onMuteToggle,
  onHoldToggle,
  onHangup,
  onSendDTMF
}) => {
  const [showKeypad, setShowKeypad] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowKeypad(false);
    }
  }, [isActive]);

  if (!isActive) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const dtmfKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="fixed bottom-6 right-6 glassmorphism rounded-xl p-5 shadow-2xl w-[320px] z-[200] flex flex-col gap-4 animate-in slide-in-from-bottom-10 duration-300">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold uppercase text-sky-600 tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-ping" />
          {status}
        </span>
        <span className="text-sm font-bold text-slate-800 tabular-nums">
          {formatDuration(duration)}
        </span>
      </div>

      <div className="text-xl font-bold text-center text-slate-800 my-1">
        {phoneNumber}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onMuteToggle}
          className={`flex-1 py-2 border rounded text-xs font-medium cursor-pointer transition flex items-center justify-center gap-1 ${
            mute ? 'bg-slate-200 border-slate-300 font-semibold' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Icon icon={mute ? "solar:microphone-large-slash-bold" : "solar:microphone-large-bold"} className="text-sm" />
          {mute ? 'Mở mic' : 'Tắt mic'}
        </button>
        <button 
          onClick={onHoldToggle}
          className={`flex-1 py-2 border rounded text-xs font-medium cursor-pointer transition flex items-center justify-center gap-1 ${
            hold ? 'bg-slate-200 border-slate-300 font-semibold' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Icon icon={hold ? "solar:play-bold" : "solar:pause-bold"} className="text-sm" />
          {hold ? 'Tiếp tục' : 'Giữ cuộc'}
        </button>
        <button 
          onClick={() => setShowKeypad(!showKeypad)}
          className={`flex-1 py-2 border rounded text-xs font-medium cursor-pointer transition flex items-center justify-center gap-1 ${
            showKeypad ? 'bg-slate-200 border-slate-300 font-semibold' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Icon icon="solar:keypad-bold" className="text-sm" />
          Bàn phím
        </button>
      </div>

      {showKeypad && (
        <div className="grid grid-cols-3 gap-1.5 border-t border-slate-200/80 pt-3 animate-in fade-in duration-200">
          {dtmfKeys.map((key) => (
            <button 
              key={key}
              onClick={() => onSendDTMF(key)}
              className="py-1.5 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 rounded font-semibold text-sm cursor-pointer transition"
            >
              {key}
            </button>
          ))}
        </div>
      )}

      <button 
        onClick={onHangup}
        className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded text-sm flex items-center justify-center gap-2 cursor-pointer transition"
      >
        <Icon icon="solar:phone-bold" className="text-base [transform:rotate(135deg)]" /> Gác máy
      </button>
    </div>
  );
};
