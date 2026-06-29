import React from 'react';
import { Icon } from '@iconify/react';
import { Contact } from '../data/crmData';

interface CRMTableProps {
  contacts: Contact[];
  onCallContact: (phone: string) => void;
  onAddPerson: () => void;
}

export const CRMTable: React.FC<CRMTableProps> = ({
  contacts,
  onCallContact,
  onAddPerson
}) => {
  return (
    <main className="max-w-[1400px] w-full mx-auto px-8 py-7 flex flex-col gap-5">
      {/* Page Title & Main Header */}
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">Danh bạ & Khách hàng (VBot CRM)</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            id="guide-add-person-btn"
            onClick={onAddPerson}
            className="bg-white hover:bg-slate-50 text-sky-600 border border-slate-200 py-1.5 px-4 rounded text-sm font-semibold cursor-pointer transition flex items-center gap-1.5"
          >
            <Icon icon="solar:user-plus-bold" className="text-sm text-sky-600" />
            Thêm liên hệ
          </button>
        </div>
      </section>

      {/* Filters Horizontal Row */}
      <section className="flex justify-between items-center bg-slate-105/80 py-2.5 px-5 rounded-lg border border-slate-200">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            Phân loại: <span className="font-semibold text-slate-800">Doanh nghiệp</span>
            <Icon icon="solar:alt-arrow-down-bold" className="text-xs" />
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            Có email: <span className="font-semibold text-slate-800">Có</span>
            <Icon icon="solar:alt-arrow-down-bold" className="text-xs" />
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            Nhãn
            <Icon icon="solar:alt-arrow-down-bold" className="text-xs" />
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            Họ tên
            <Icon icon="solar:alt-arrow-down-bold" className="text-xs" />
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            Bộ lọc khác
            <Icon icon="solar:alt-arrow-down-bold" className="text-xs" />
          </div>
        </div>
        <button className="bg-none border-none text-xs font-semibold text-slate-500 hover:text-red-500 cursor-pointer flex items-center gap-1 transition">
          Xóa bộ lọc <Icon icon="solar:close-circle-bold" className="text-sm" />
        </button>
      </section>

      {/* Table Toolbar Controls */}
      <section className="flex justify-between items-center py-1">
        <div className="text-sm text-slate-500">Hiển thị 1 - {contacts.length} trong {contacts.length}</div>
      </section>

      {/* CRM Contact Table */}
      <section className="bg-white border border-slate-200 rounded overflow-hidden shadow-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-555 font-semibold text-sm">
              <th className="w-10 text-center py-3.5 px-4"><input type="checkbox" className="cursor-pointer w-3.5 h-3.5 border border-slate-200 rounded-sm" /></th>
              <th className="py-3.5 px-4 text-left font-semibold">Thông tin chung</th>
              <th className="py-3.5 px-4 text-left font-semibold">Địa chỉ email</th>
              <th className="py-3.5 px-4 text-left font-semibold">Số điện thoại</th>
              <th className="py-3.5 px-4 text-center font-semibold w-24">Gọi điện</th>
              <th className="py-3.5 px-4 text-left font-semibold">Địa chỉ</th>
              <th className="py-3.5 px-4 text-left font-semibold">Nhãn</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.id} className="border-b border-slate-200 hover:bg-slate-50/50 transition">
                <td className="w-10 text-center py-3 px-4"><input type="checkbox" className="cursor-pointer w-3.5 h-3.5 border border-slate-200 rounded-sm" /></td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: contact.bgColor }}
                    >
                      {contact.initials}
                    </div>
                    <a className="text-sky-600 hover:underline font-medium text-sm cursor-pointer">{contact.name}</a>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-slate-800">
                  {contact.email}
                  {contact.emailLabel && <span className="text-xs text-slate-400 ml-1.5">{contact.emailLabel}</span>}
                </td>
                <td className="py-3 px-4 text-sm text-slate-800 font-medium">
                  {contact.phone ? (
                    <div className="inline-flex items-center gap-1.5">
                      <span>{formatPhone(contact.phone, contact.isMock)}</span>
                      {contact.phoneLabel && <span className="text-xs text-slate-400">{contact.phoneLabel}</span>}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {contact.phone ? (
                    <button 
                      id={index === 0 ? "guide-click-to-call" : undefined}
                      onClick={() => onCallContact(contact.phone)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-full cursor-pointer transition shadow-[0_2px_4px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_8px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 inline-flex items-center justify-center"
                      title={`Gọi tới ${contact.name}`}
                    >
                      <Icon icon="solar:phone-bold" className="text-xs" />
                    </button>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-slate-800">{contact.location}</td>
                <td className="py-3 px-4 text-sm">
                  {contact.tags.length > 0 ? (
                    <div className="flex gap-1.5">
                      {contact.tags.map(tag => (
                        <span key={tag} className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200/50 text-xs font-semibold text-slate-600 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

// Helper function to format phone numbers nicely (with xxxx mask for mocks)
const formatPhone = (phone: string, isMock?: boolean) => {
  if (!phone) return '';
  
  let displayPhone = phone;
  if (isMock) {
    // Mask 4 digits in the middle
    if (phone.length >= 7) {
      const midStart = Math.floor((phone.length - 4) / 2);
      displayPhone = phone.slice(0, midStart) + 'xxxx' + phone.slice(midStart + 4);
    } else {
      displayPhone = 'xxxx';
    }
  }

  if (displayPhone.length === 12) {
    return `${displayPhone.slice(0, 3)} ${displayPhone.slice(3, 6)} ${displayPhone.slice(6, 9)} ${displayPhone.slice(9)}`;
  }
  if (displayPhone.length === 10) {
    return `${displayPhone.slice(0, 3)}-${displayPhone.slice(3, 6)}-${displayPhone.slice(6)}`;
  }
  return displayPhone;
};
