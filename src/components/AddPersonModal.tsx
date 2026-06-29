import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Contact } from '../data/crmData';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: Contact) => void;
}

export const AddPersonModal: React.FC<AddPersonModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Vui lòng nhập tên khách hàng!');
      return;
    }
    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại!');
      return;
    }

    // Generate initials
    const nameParts = name.trim().split(' ');
    let initials = 'KH';
    if (nameParts.length > 0) {
      const first = nameParts[0]?.charAt(0) || '';
      const last = nameParts[nameParts.length - 1]?.charAt(0) || '';
      initials = (first + last).toUpperCase();
    }

    // Random pastel bg color
    const colors = ['#0284c7', '#f59e0b', '#e11d48', '#0d9488', '#6366f1', '#ea580c', '#84cc16', '#d946ef', '#2563eb'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)] || '#0284c7';

    const newContact: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      initials,
      bgColor: randomColor,
      email: email.trim() || 'chua_co_email@domain.vn',
      phone: phone.trim(),
      phoneLabel: 'Di động',
      location: location.trim() || 'Chưa cập nhật',
      tags: tag.trim() ? [tag.trim()] : [],
      isMock: false // Mark as real contact (not mock)
    };

    onAdd(newContact);
    
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setTag('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[1000] transition-opacity duration-200">
      <div 
        className="bg-white rounded-lg border border-slate-200 shadow-2xl w-[560px] max-w-[90%] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Icon icon="solar:user-plus-bold" className="text-emerald-500 text-xl" />
            Thêm khách hàng dùng thử
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-medium cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-sky-500 outline-none transition"
              placeholder="Ví dụ: Nguyễn Văn A"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Số điện thoại thật <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-sky-500 outline-none transition font-semibold"
              placeholder="Nhập số điện thoại để gọi thử (ví dụ: 0901234567)"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Địa chỉ Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-sky-500 outline-none transition"
              placeholder="Ví dụ: anguyen@gmail.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Khu vực / Tỉnh thành
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-sky-500 outline-none transition"
              placeholder="Ví dụ: Hà Nội, Việt Nam"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nhãn / Tag
            </label>
            <input 
              type="text" 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-sky-500 outline-none transition"
              placeholder="Ví dụ: Khách hàng, Quan trọng"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm font-semibold transition cursor-pointer shadow-md shadow-emerald-500/10"
            >
              Thêm & Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
