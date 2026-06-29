import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface SettingsPageProps {
  token: string;
  integrationMode: 'headless' | 'builtin';
  connectionStatus: 'offline' | 'connecting' | 'online';
  connectionText: string;
  onConnect: (token: string, mode: 'headless' | 'builtin') => void;
  onDisconnect: () => void;
}

interface HotlineItem {
  hotline_name: string;
  hotline_number: string;
  hotline_code: string;
  hotline_type?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  integrationMode: currentMode,
  connectionStatus,
  connectionText,
  onConnect,
  onDisconnect
}) => {
  const [modeInput, setModeInput] = useState(currentMode);

  // Partner Simulation Inputs
  const [partnerKeyInput, setPartnerKeyInput] = useState(() => {
    return localStorage.getItem('vbot_partner_key') || '';
  });
  const [memberNoInput, setMemberNoInput] = useState('agent_001');
  const [hotlinesInput, setHotlinesInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [showCodeDetails, setShowCodeDetails] = useState(true);

  // Dynamic Hotlines States
  const [availableHotlines, setAvailableHotlines] = useState<HotlineItem[]>(() => {
    try {
      const cached = localStorage.getItem('vbot_available_hotlines');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [selectedHotlines, setSelectedHotlines] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('vbot_selected_hotlines');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });

  const [isLoadingHotlines, setIsLoadingHotlines] = useState(false);

  // Billing states
  const [adminBalance, setAdminBalance] = useState<number | null>(null);
  const [memberBalance, setMemberBalance] = useState<number | null>(null);
  const [moneyToAdd, setMoneyToAdd] = useState('1000');
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [memberInfo, setMemberInfo] = useState<any>(null);

  useEffect(() => {
    setModeInput(currentMode);
  }, [currentMode]);

  useEffect(() => {
    localStorage.setItem('vbot_partner_key', partnerKeyInput);
  }, [partnerKeyInput]);

  useEffect(() => {
    localStorage.setItem('vbot_selected_hotlines', JSON.stringify(selectedHotlines));
  }, [selectedHotlines]);

  // Clean up selected hotlines that are no longer available in the project
  useEffect(() => {
    if (availableHotlines.length > 0) {
      const validCodes = availableHotlines.map(hl => hl.hotline_code);
      setSelectedHotlines(prev => {
        const filtered = prev.filter(code => validCodes.includes(code));
        if (filtered.length !== prev.length) {
          return filtered;
        }
        return prev;
      });
    }
  }, [availableHotlines]);

  // Auto fetch hotlines & balances on component mount
  useEffect(() => {
    if (partnerKeyInput.trim()) {
      if (availableHotlines.length === 0) {
        fetchHotlines(partnerKeyInput);
      }
      fetchBalances();
    }
  }, []);

  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return '---';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const fetchBalances = async () => {
    if (!partnerKeyInput.trim()) return;

    setIsLoadingBalances(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://open-api-staging.vbot.vn/v3.0';

    try {
      // 1. Fetch Admin Balance
      const adminRes = await fetch(`${baseUrl}/api/account/balance`, {
        headers: {
          'X-API-Key': partnerKeyInput.trim(),
          'Accept': 'application/json',
        },
      });
      const adminData = await adminRes.json();
      if (adminData.error === 0) {
        setAdminBalance(adminData.data);
      }

      // 2. Fetch Member Balance
      if (memberNoInput.trim()) {
        const memberRes = await fetch(`${baseUrl}/api/member/getByMemberNo?member_no=${memberNoInput.trim()}`, {
          headers: {
            'X-API-Key': partnerKeyInput.trim(),
            'Accept': 'application/json',
          },
        });
        const memberData = await memberRes.json();
        if (memberData.error === 0 && memberData.data) {
          setMemberBalance(memberData.data.member_money);
          setMemberInfo(memberData.data);
        } else {
          setMemberBalance(0);
          setMemberInfo(null);
        }
      }
    } catch (err) {
      console.error('[VBot-CRM] Lỗi tải số dư:', err);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  const handleAddMoney = async (isSubtraction: boolean = false) => {
    if (!partnerKeyInput.trim()) {
      alert('Vui lòng nhập VBot Partner API Key!');
      return;
    }
    if (!memberNoInput.trim()) {
      alert('Vui lòng nhập Member No!');
      return;
    }
    if (!moneyToAdd || isNaN(Number(moneyToAdd)) || Number(moneyToAdd) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    setIsAddingMoney(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://open-api-staging.vbot.vn/v3.0';
    const amount = Number(moneyToAdd) * (isSubtraction ? -1 : 1);

    try {
      const response = await fetch(`${baseUrl}/api/member/addMoney`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': partnerKeyInput.trim(),
        },
        body: JSON.stringify({
          member_no: memberNoInput.trim(),
          money: amount,
        }),
      });

      const result = await response.json();
      if (result.error === 0) {
        const actionText = isSubtraction ? 'Trừ' : 'Nạp';
        alert(`${actionText} thành công ${formatCurrency(Math.abs(amount))} cho thành viên ${memberNoInput.trim()}!`);
        fetchBalances(); // Refresh balances immediately
      } else {
        alert(`Lỗi thực hiện: ${result.message || 'Lỗi từ API'}`);
      }
    } catch (err) {
      console.error('[VBot-CRM] Lỗi điều chỉnh tiền:', err);
      alert('Không thể kết nối đến VBot API để điều chỉnh tiền. Vui lòng kiểm tra lại Key hoặc CORS.');
    } finally {
      setIsAddingMoney(false);
    }
  };

  const fetchHotlines = async (apiKey: string) => {
    if (!apiKey.trim()) {
      alert('Vui lòng nhập VBot Partner API Key trước!');
      return;
    }

    setIsLoadingHotlines(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://open-api-staging.vbot.vn/v3.0';
      const response = await fetch(`${baseUrl}/api/hotline/getAll`, {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey.trim(),
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      if (result.error === 0 && Array.isArray(result.data)) {
        setAvailableHotlines(result.data);
        localStorage.setItem('vbot_available_hotlines', JSON.stringify(result.data));
        
        console.log('[VBot-CRM] Đã tải danh sách hotline:', result.data);
      } else {
        alert(`Không thể tải danh sách hotline: ${result.message || 'Lỗi từ API'}`);
      }
    } catch (err: any) {
      console.error('[VBot-CRM] Lỗi tải hotline:', err);
      alert('Không thể kết nối đến VBot API để tải hotline. Vui lòng kiểm tra lại Key hoặc CORS.');
    } finally {
      setIsLoadingHotlines(false);
    }
  };

  const handlePartnerApiCall = async () => {
    if (!partnerKeyInput.trim()) {
      alert('Vui lòng nhập VBot Partner API Key!');
      return;
    }
    if (!memberNoInput.trim()) {
      alert('Vui lòng nhập Member No!');
      return;
    }

    setIsLoading(true);
    setApiResponse(null);

    // Get hotline codes from checkboxes or text input fallback
    const hotlineList = availableHotlines.length > 0
      ? selectedHotlines
      : hotlinesInput.split(',').map((h) => h.trim()).filter((h) => h.length > 0);

    const requestBody = {
      member_no: memberNoInput.trim(),
      hotline_codes: hotlineList,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://open-api-staging.vbot.vn/v3.0';
      const apiUrl = `${baseUrl}/api/sdk/tokenSdk`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': partnerKeyInput.trim(),
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      setApiResponse(result);
      setIsLoading(false);

      if (result.error === 0 && result.data) {
        onConnect(result.data, modeInput);
        console.log('[VBot-CRM] Lấy token & kết nối SDK thành công');
        // Refresh balance details right after successful provisioning/connection
        fetchBalances();
      } else {
        alert(`API lỗi: ${result.message || 'Lỗi không xác định'}`);
      }
    } catch (err: any) {
      console.error('[VBot-CRM] Lỗi API VBot:', err);
      setApiResponse({
        error: 500,
        message: err.message || 'Network Error / CORS Issue',
        data: null,
      });
      setIsLoading(false);
      alert('Không thể kết nối đến VBot API. Vui lòng kiểm tra lại CORS hoặc Network.');
    }
  };

  const getCurlSnippet = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://open-api-staging.vbot.vn/v3.0';
    const hotlineList = availableHotlines.length > 0
      ? selectedHotlines
      : hotlinesInput.split(',').map((h) => h.trim()).filter((h) => h.length > 0);
      
    return `curl -X POST "${baseUrl}/api/sdk/tokenSdk" \\
  -H "X-API-Key: <PARTNER_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "member_no": "${memberNoInput.trim()}",
    "hotline_codes": ${JSON.stringify(hotlineList)}
  }'`;
  };

  return (
    <div className="max-w-[1280px] mx-auto my-6 px-6 animate-in fade-in duration-300">
      {/* 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Configurations & Connection Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold">1. Cấu hình kết nối & Xác thực</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quy trình mô phỏng tích hợp SDK đối tác</p>
            </div>
          </div>
          
          {/* Form Body */}
          <div className="p-5 flex flex-col gap-4">
            
            {/* UI Integration Mode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                Cơ chế tích hợp giao diện (UI)
              </label>
              <select 
                value={modeInput}
                onChange={(e) => setModeInput(e.target.value as 'headless' | 'builtin')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:border-sky-500 outline-none cursor-pointer transition text-slate-800 font-semibold"
              >
                <option value="builtin">Built-in Native UI (Sử dụng widget mặc định)</option>
                <option value="headless">Headless Custom UI (Ẩn giao diện mặc định, tự build)</option>
              </select>
            </div>

            {/* Partner API Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                VBot Partner API Key
              </label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={partnerKeyInput}
                  onChange={(e) => setPartnerKeyInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:border-sky-500 outline-none transition font-mono text-slate-800"
                  placeholder="Nhập Key quản trị (Partner Token)..."
                />
                <button
                  type="button"
                  onClick={() => {
                    fetchHotlines(partnerKeyInput);
                    fetchBalances();
                  }}
                  disabled={isLoadingHotlines || isLoadingBalances}
                  className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold px-4 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                  title="Tải lại hotline và số dư"
                >
                  <Icon icon="solar:restart-bold" className={`text-xs ${isLoadingHotlines || isLoadingBalances ? 'animate-spin' : ''}`} />
                  Tải Dữ Liệu
                </button>
              </div>
            </div>

            {/* Minimised Info Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 leading-normal flex flex-col gap-1.5">
              <div className="flex gap-1.5 items-start">
                <Icon icon="solar:info-circle-bold" className="text-slate-500 text-sm shrink-0" />
                <span>Backend của bạn gọi API <code>POST /api/sdk/tokenSdk</code> phía Server để cấp JWT Token ngắn hạn kết nối SDK.</span>
              </div>
              <div className="flex gap-1.5 items-start pl-5 border-l border-slate-200 ml-1">
                <span>💡 Xem cách lấy danh sách hotline tại API <code>GET /api/hotline/getAll</code>.</span>
              </div>
            </div>

            {/* Member No & Hotline Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-555 uppercase tracking-wider">
                  Mã nhân viên (Member No)
                </label>
                <input 
                  type="text" 
                  value={memberNoInput}
                  onChange={(e) => setMemberNoInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:border-sky-500 outline-none transition text-slate-800 font-semibold"
                  placeholder="Ví dụ: nv001..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-555 uppercase tracking-wider">
                  Hotlines SDK
                </label>
                {availableHotlines.length > 0 ? (
                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-50/50 max-h-[150px] overflow-y-auto flex flex-col gap-1">
                    {availableHotlines.map((hl) => {
                      const isChecked = selectedHotlines.includes(hl.hotline_code);
                      return (
                        <label 
                          key={hl.hotline_code} 
                          className={`flex items-center gap-2.5 px-3 py-1.5 border rounded-lg cursor-pointer transition select-none ${
                            isChecked 
                              ? 'border-sky-500 bg-sky-50/55 text-sky-800 font-bold' 
                              : 'border-slate-150 bg-white text-slate-650 hover:border-slate-200'
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedHotlines(prev => [...prev, hl.hotline_code]);
                              } else {
                                setSelectedHotlines(prev => prev.filter(code => code !== hl.hotline_code));
                              }
                            }}
                            className="w-4 h-4 rounded text-sky-600 cursor-pointer accent-sky-600"
                          />
                          <div className="flex flex-col text-left min-w-0 flex-1">
                            <span className="text-xs font-bold leading-tight truncate text-slate-800" title={hl.hotline_name}>
                              {hl.hotline_name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono font-semibold">{hl.hotline_number}</span>
                              {hl.hotline_type && (
                                <span className={`text-[9px] font-extrabold px-1 py-0.2 rounded-xs uppercase ${
                                  hl.hotline_type === 'ALIAS'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200/40'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200/40'
                                }`}>
                                  {hl.hotline_type}
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <input 
                    type="text" 
                    value={hotlinesInput}
                    onChange={(e) => {
                      setHotlinesInput(e.target.value);
                      setSelectedHotlines(e.target.value.split(',').map(h => h.trim()).filter(h => h.length > 0));
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:border-sky-500 outline-none transition text-slate-800"
                    placeholder="Ví dụ: hotline_main..."
                  />
                )}
              </div>
            </div>

          </div>

          {/* Connection status footer in left block */}
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between rounded-b-xl">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <span className={`w-2 h-2 rounded-full inline-block ${
                connectionStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]' :
                connectionStatus === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span>{connectionText}</span>
            </div>

            <div className="flex gap-2">
              {connectionStatus !== 'offline' && (
                <button 
                  onClick={onDisconnect}
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition shadow-xs"
                >
                  Ngắt kết nối
                </button>
              )}
              <button 
                onClick={handlePartnerApiCall}
                disabled={isLoading}
                className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition shadow-md shadow-sky-500/10 flex items-center gap-1.5"
              >
                {isLoading ? 'Đang kết nối...' : 'Gọi API & Đồng bộ SDK'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Billing & API Code Blocks */}
        <div className="flex flex-col gap-4">
          
          {/* Simulated Billing Card */}
          {partnerKeyInput.trim() && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon icon="solar:wallet-money-bold" className="text-emerald-500 text-sm" />
                  2. Số dư & Nạp tiền (Simulated Billing)
                </h4>
                <button
                  type="button"
                  onClick={fetchBalances}
                  disabled={isLoadingBalances}
                  className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                >
                  <Icon icon="solar:restart-bold" className={`text-xs ${isLoadingBalances ? 'animate-spin' : ''}`} />
                  Cập nhật số dư
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 border border-slate-200 rounded-lg flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Số dư Admin</span>
                  <span className="text-sm font-extrabold text-slate-800">{formatCurrency(adminBalance)}</span>
                </div>
                <div className="bg-slate-50 p-3 border border-slate-200 rounded-lg flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Số dư Nhân viên</span>
                  <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    {formatCurrency(memberBalance)}
                    {memberBalance === 0 && (
                      <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-1 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                        Chưa có tiền
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 items-end pt-1 bg-slate-50/50 p-3 border border-slate-200 rounded-lg">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-550 uppercase">Số tiền cần nạp / trừ (VND)</label>
                  <input
                    type="number"
                    value={moneyToAdd}
                    onChange={(e) => setMoneyToAdd(e.target.value)}
                    placeholder="Nhập số tiền..."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md bg-white text-sm focus:border-sky-500 outline-none text-slate-800 font-bold"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddMoney(false)}
                    disabled={isAddingMoney}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold px-3.5 py-2 rounded h-[34px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Icon icon="solar:card-transfer-bold" className="text-sm" />
                    {isAddingMoney ? 'Nạp...' : 'Nạp tiền'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddMoney(true)}
                    disabled={isAddingMoney}
                    className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white text-xs font-bold px-3.5 py-2 rounded h-[34px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Icon icon="solar:card-transfer-bold" className="text-sm rotate-180" />
                    {isAddingMoney ? 'Trừ...' : 'Trừ tiền'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VBot Member Details Card */}
          {partnerKeyInput.trim() && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon icon="solar:user-id-bold" className="text-sky-500 text-sm" />
                  Chi tiết nhân viên (Member Details)
                </h4>
                {memberInfo ? (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    memberInfo.member_status === 1 || memberInfo.member_status === 6
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {memberInfo.member_status === 1 ? 'Đang hoạt động' : `Trạng thái: ${memberInfo.member_status}`}
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-400 rounded-full">
                    Chưa đồng bộ
                  </span>
                )}
              </div>

              {memberInfo ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="text-slate-500 text-xs">Tên nhân viên:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[120px]" title={memberInfo.member_name}>
                      {memberInfo.member_name}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="text-slate-500 text-xs">Số máy nhánh (Ext):</span>
                    <span className="font-mono font-extrabold text-slate-800">
                      {memberInfo.member_ext_number || '---'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="text-slate-500 text-xs">Mã định danh:</span>
                    <span className="font-mono text-slate-800 truncate max-w-[120px]" title={memberInfo.member_no}>
                      {memberInfo.member_no}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="text-slate-500 text-xs">Số dư nhân viên:</span>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(memberInfo.member_money)}
                    </span>
                  </div>

                  <div className="flex justify-between items-start py-0.5 border-b border-slate-100 col-span-2">
                    <span className="text-slate-500 text-xs shrink-0">Hotline liên kết:</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[240px]">
                      {selectedHotlines.length > 0 ? (
                        selectedHotlines.map(code => {
                          const hl = availableHotlines.find(h => h.hotline_code === code);
                          return (
                            <span key={code} className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200/50 px-1.5 py-0.5 rounded font-bold">
                              {hl ? `${hl.hotline_name} (${hl.hotline_number})` : code}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-405 text-xs italic">Chưa chọn hotline</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-0.5 border-b border-slate-100 col-span-2">
                    <span className="text-slate-500 text-xs">Ngày hết hạn:</span>
                    <span className="text-slate-800 font-bold">
                      {memberInfo.expiration_date ? new Date(memberInfo.expiration_date).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 flex flex-col items-center justify-center gap-1.5">
                  <Icon icon="solar:user-block-bold" className="text-slate-300 text-2xl" />
                  <span className="text-xs text-slate-400">Chưa đồng bộ thông tin nhân viên</span>
                </div>
              )}
            </div>
          )}

          {/* CURL Request & Response codebox */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={() => setShowCodeDetails(!showCodeDetails)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-left px-4 py-2.5 text-xs font-bold text-slate-700 border-b border-slate-200 flex justify-between items-center cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Icon icon="solar:code-bold" className="text-slate-500 text-sm" />
                3. Chi tiết API (CURL & Response)
              </span>
              <Icon icon={showCodeDetails ? "solar:alt-arrow-down-bold" : "solar:alt-arrow-right-bold"} className="text-slate-400 text-xs" />
            </button>
            
            {showCodeDetails && (
              <div className="bg-slate-900 text-slate-350 p-4 text-xs font-mono overflow-x-auto flex flex-col gap-2 max-h-[170px]">
                <div className="text-emerald-400">// Yêu cầu HTTP:</div>
                <pre className="text-sky-300 leading-normal select-all">{getCurlSnippet()}</pre>
                
                {apiResponse && (
                  <>
                    <div className="text-emerald-400 mt-1.5">// Phản hồi từ Server:</div>
                    <pre className="text-amber-300 select-all">{JSON.stringify(apiResponse, null, 2)}</pre>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
