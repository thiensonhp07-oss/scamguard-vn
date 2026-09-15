import React, { useState } from 'react';
import {
  X,
  Radar,
  MapPin,
  AlertOctagon,
  TrendingUp,
  ShieldAlert,
  Clock,
  Sparkles,
  Users,
  Search,
} from 'lucide-react';

interface LiveScamRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergency?: () => void;
}

interface HotThreatItem {
  id: string;
  location: string;
  title: string;
  method: string;
  victimCount: number;
  threatLevel: 'RẤT CAO' | 'NGUY HIỂM' | 'CẢNH BÁO';
  dateReported: string;
  summary: string;
}

const HOT_THREATS: HotThreatItem[] = [
  {
    id: 't1',
    location: 'TP. Hồ Chí Minh & Bình Dương',
    title: 'Bẫy Lừa Đảo "Giả Danh Cán Bộ Thuế eTax Mobile"',
    method: 'Gửi file .APK độc hại qua Zalo ép cài đặt',
    victimCount: 1420,
    threatLevel: 'RẤT CAO',
    dateReported: 'Vừa cập nhật 15 phút trước',
    summary:
      'Kẻ gian mạo danh Chi cục Thuế gọi điện thông báo chuẩn hóa mã số thuế cá nhân, ép tải file eTax_Mobile_v2.apk để trộm tiền ngân hàng.',
  },
  {
    id: 't2',
    location: 'Hà Nội & Quảng Ninh',
    title: 'Bẫy Cuộc Gọi "Con Cấp Cứu Viện Bệnh Viện Chợ Rẫy / Bạch Mai"',
    method: 'Deepfake Voice Call nhái giọng con trẻ',
    victimCount: 890,
    threatLevel: 'RẤT CAO',
    dateReported: '2 giờ trước',
    summary:
      'Tội phạm gọi điện cho phụ huynh thông báo con bị ngã mất máu cấp cứu, ép chuyển 30-50 triệu tiền viện phí gấp.',
  },
  {
    id: 't3',
    location: 'Đà Nẵng & Cần Thơ',
    title: 'Nhiệm Vụ Tuyển CTV Thả Tim TikTok / Shopee',
    method: 'Mồi nhử thưởng 30k rồi ép nạp quỹ điểm nâng VIP',
    victimCount: 2310,
    threatLevel: 'NGUY HIỂM',
    dateReported: 'Hôm nay',
    summary:
      'Quảng cáo việc nhẹ lương cao làm tại nhà, ban đầu cho rút vài chục nghìn rồi lừa nạp hàng trăm triệu không cho rút.',
  },
  {
    id: 't4',
    location: 'Toàn Quốc (Phát Hiện Trên MXH)',
    title: 'Dán Đè Mã QR Thanh Toán VietQR Tại Các Quán Ăn',
    method: 'Trộm tiền thanh toán hóa đơn quán ăn',
    victimCount: 650,
    threatLevel: 'CẢNH BÁO',
    dateReported: 'Hôm qua',
    summary:
      'Lợi dụng sơ hở dán đè mã QR tài khoản cá nhân lên biển QR ngân hàng của chủ quán.',
  },
];

export const LiveScamRadarModal: React.FC<LiveScamRadarModalProps> = ({
  isOpen,
  onClose,
  onOpenEmergency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  if (!isOpen) return null;

  const filteredThreats = HOT_THREATS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedRegion === 'all') return matchesSearch;
    if (selectedRegion === 'hcm') return matchesSearch && t.location.includes('Hồ Chí Minh');
    if (selectedRegion === 'hanoi') return matchesSearch && t.location.includes('Hà Nội');
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl w-full max-w-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg flex-shrink-0">
            <Radar className="w-6 h-6 animate-spin-slow text-rose-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                <span>LIVE THREAT RADAR 24/7</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Bản Đồ Cảnh Báo Lừa Đảo Nóng Theo Vùng
            </h2>
          </div>
        </div>

        {/* Search & Region Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm thủ đoạn hoặc địa phương (ví dụ: eTax, Hà Nội, Chợ Rẫy)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRegion === 'all'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Toàn Quốc
            </button>
            <button
              onClick={() => setSelectedRegion('hcm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRegion === 'hcm'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TP.HCM
            </button>
            <button
              onClick={() => setSelectedRegion('hanoi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRegion === 'hanoi'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hà Nội
            </button>
          </div>
        </div>

        {/* Threat Cards Stream */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredThreats.map((threat) => (
            <div
              key={threat.id}
              className="p-4 bg-slate-950/90 rounded-2xl border border-rose-500/30 hover:border-rose-500/70 transition-all space-y-2.5 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span className="text-xs font-black text-rose-300">{threat.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{threat.dateReported}</span>
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50">
                    {threat.threatLevel}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-black text-white">{threat.title}</h3>

              <p className="text-xs text-slate-300 leading-relaxed">{threat.summary}</p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-900">
                <span className="flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{threat.victimCount.toLocaleString()} trường hợp đã báo cáo</span>
                </span>
                <span className="text-amber-400 font-bold">Thủ đoạn: {threat.method}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-rose-600/30"
          >
            ĐÃ HIỂU CẢNH BÁO & ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
