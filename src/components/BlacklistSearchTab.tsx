import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, PlusCircle, AlertTriangle } from 'lucide-react';

export const BlacklistSearchTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blacklistSearching, setBlacklistSearching] = useState(false);
  const [blacklistResult, setBlacklistResult] = useState<any | null>(null);

  // Community report form states
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState<'phone' | 'stk'>('phone');
  const [reportIdentifier, setReportIdentifier] = useState('');
  const [reportBank, setReportBank] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState('');
  const [reportErrorMsg, setReportErrorMsg] = useState('');

  // Handle blacklist query search
  const handleBlacklistSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setBlacklistSearching(true);
    setBlacklistResult(null);

    try {
      const res = await fetch(`/api/blacklist/search?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      setBlacklistResult(data);
    } catch (err) {
      console.error('Error querying blacklist:', err);
      setBlacklistResult({
        found: false,
        message: 'Lỗi hệ thống khi tra cứu dữ liệu. Vui lòng thử lại sau.'
      });
    } finally {
      setBlacklistSearching(false);
    }
  };

  // Handle crowd-sourced report submission
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportIdentifier.trim()) {
      setReportErrorMsg('Vui lòng nhập số điện thoại hoặc số tài khoản cần báo cáo!');
      return;
    }

    setReportSuccessMsg('');
    setReportErrorMsg('');

    try {
      const res = await fetch('/api/blacklist/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          identifier: reportIdentifier.trim(),
          bankName: reportType === 'stk' ? reportBank.trim() : undefined,
          description: reportDesc.trim() || 'Mạo danh lừa đảo qua tin nhắn / cuộc gọi.'
        })
      });

      const data = await res.json();
      if (data.success) {
        setReportSuccessMsg('✓ Gửi báo cáo thành công! Ban quản trị sẽ tiến hành thẩm định và đưa vào danh sách đen công đồng.');
        setReportIdentifier('');
        setReportBank('');
        setReportDesc('');
      } else {
        setReportErrorMsg(data.error || 'Đã có lỗi xảy ra.');
      }
    } catch (err) {
      console.error('Error reporting:', err);
      setReportErrorMsg('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="space-y-5 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Tra Cứu Danh Sách Đen SĐT & Số Tài Khoản Ngân Hàng:</span>
        </label>
        <p className="text-xs text-slate-400">
          Tổng hợp dữ liệu thời gian thực từ Bộ Công An, NCSC và phản ánh trực tiếp từ cộng đồng nạn nhân lừa đảo trực tuyến tại Việt Nam.
        </p>
      </div>

      <form onSubmit={handleBlacklistSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nhập SĐT (098...) hoặc STK Ngân hàng (190...)..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
        />
        <button
          type="submit"
          disabled={blacklistSearching || !searchQuery.trim()}
          className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1.5 font-mono"
        >
          <Search className="w-4 h-4" />
          <span>{blacklistSearching ? 'TRA...' : 'TRA CỨU'}</span>
        </button>
      </form>

      {/* Blacklist Search Results Render */}
      {blacklistResult && (
        <div className="p-4 rounded-2xl border bg-slate-900/40 border-slate-800 space-y-3">
          {blacklistResult.found ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-500/50 font-mono">
                  {blacklistResult.data.riskLevel === 'EXTREME'
                    ? '🚨 NGUY HIỂM CỰC ĐỘ'
                    : '⚠️ ĐÃ BỊ BÁO CÁO VI PHẠM'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium font-mono">
                  Nguồn: {blacklistResult.data.source}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white font-mono">
                {blacklistResult.data.identifier} {blacklistResult.data.bankName ? `(${blacklistResult.data.bankName})` : '(Số điện thoại)'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-sans">
                {blacklistResult.data.description}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Số lượt bị nạn nhân phản ánh: {blacklistResult.data.reportsCount} báo cáo
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{blacklistResult.message || 'Không phát hiện số tài khoản/số điện thoại này nằm trong danh sách đen quốc gia.'}</span>
            </div>
          )}
        </div>
      )}

      {/* Crowd-sourcing Report Form Toggle */}
      <div className="pt-2 border-t border-slate-800/60">
        <button
          type="button"
          onClick={() => setShowReportForm(!showReportForm)}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-cyan-400" />
          <span>
            {showReportForm ? 'Thu gọn biểu mẫu báo cáo' : 'Đóng góp Báo cáo SĐT / STK lừa đảo mới'}
          </span>
        </button>

        {showReportForm && (
          <form onSubmit={handleReportSubmit} className="mt-3 space-y-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs">
            <p className="text-xs font-black text-white font-mono uppercase tracking-wider text-slate-300">
              Báo Cáo SĐT / STK Lừa Đảo Cho Cộng Đồng:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'phone' | 'stk')}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500"
              >
                <option value="phone">Số điện thoại</option>
                <option value="stk">Số tài khoản ngân hàng</option>
              </select>
              <input
                type="text"
                value={reportIdentifier}
                onChange={(e) => setReportIdentifier(e.target.value)}
                placeholder={reportType === 'stk' ? "Số tài khoản ngân hàng..." : "Số điện thoại..."}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>
            {reportType === 'stk' && (
              <input
                type="text"
                value={reportBank}
                onChange={(e) => setReportBank(e.target.value)}
                placeholder="Tên ngân hàng phát hành (VD: Vietcombank, Techcombank)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            )}
            <textarea
              rows={2}
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              placeholder="Mô tả cụ thể hành vi hoặc kịch bản lừa đảo (VD: Nhắn tin đòi phạt nguội, giả mạo biên lai chuyển khoản ngân hàng)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500 font-sans"
            />
            
            {reportErrorMsg && (
              <div className="p-2.5 bg-rose-950/80 rounded-xl border border-rose-800 text-rose-300 flex items-start space-x-1 font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{reportErrorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-500 cursor-pointer font-mono shadow-md shadow-rose-950"
            >
              GỬI BÁO CÁO XÁC MINH PHÁP Y
            </button>
            {reportSuccessMsg && (
              <p className="text-xs text-emerald-400 font-bold leading-relaxed">{reportSuccessMsg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
