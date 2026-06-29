import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface DialerDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onCall: (phone: string) => void;
  placement?: 'top' | 'bottom';
}

export const DialerDropdown: React.FC<DialerDropdownProps> = ({
  isOpen,
  onClose,
  onCall,
  placement = 'top'
}) => {
  const [phoneInput, setPhoneInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleKeyClick = (val: string) => {
    setPhoneInput(prev => prev + val);
  };

  const handleBackspace = () => {
    setPhoneInput(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (phoneInput.trim()) {
      onCall(phoneInput.trim());
      setPhoneInput('');
      onClose();
    } else {
      alert('Vui lòng nhập số điện thoại cần gọi!');
    }
  };

  const dialKeys = [
    { num: '1', letters: '\u00A0' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '\u00A0' },
    { num: '0', letters: '+' },
    { num: '#', letters: '\u00A0' },
  ];

  return (
    <div 
      ref={dropdownRef}
      className={`${
        placement === 'bottom' 
          ? 'fixed bottom-22 right-6 animate-in slide-in-from-bottom-5' 
          : 'absolute top-[62px] right-[280px] animate-in slide-in-from-top-2'
      } bg-white border border-slate-200 rounded-lg shadow-2xl w-[290px] p-5 z-[100] flex flex-col gap-4 duration-150`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative flex items-center">
        <input 
          type="tel" 
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          className="w-full py-2.5 pl-3 pr-9 border border-slate-200 rounded text-xl font-semibold text-center tracking-wider bg-slate-50 outline-none"
          placeholder="Số điện thoại..."
        />
        {phoneInput.length > 0 && (
          <button 
            onClick={handleBackspace}
            className="absolute right-2.5 text-slate-400 hover:text-red-500 font-medium text-lg cursor-pointer transition flex items-center"
          >
            <Icon icon="solar:backspace-bold" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 justify-items-center">
        {dialKeys.map((key) => (
          <button 
            key={key.num}
            onClick={() => handleKeyClick(key.num)}
            className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 flex flex-col items-center justify-center cursor-pointer transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span className="text-lg font-semibold leading-none">{key.num}</span>
            <span className="text-[8px] text-slate-400 uppercase font-medium mt-0.5">{key.letters}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={handleCall}
        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded text-sm flex items-center justify-center gap-2 cursor-pointer transition"
      >
        <Icon icon="solar:phone-bold" className="text-base" /> Gọi điện
      </button>
    </div>
  );
};
