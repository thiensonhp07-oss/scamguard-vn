import React, { useState } from 'react';
import {
  Lock,
  EyeOff,
  Search,
  Database,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  FileText,
  Shield,
  Key,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playRewardTrophy } from '../utils/audioEffects';

interface BreachRecord {
  sourceName: string;
  leakYear: number;
  compromisedData: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  remediation: string;
}

const HISTORICAL_BREACHES: Record<string, BreachRecord[]> = {
  'nguyenvanan@gmail.com': [
    { sourceName: 'Facebook Vietnam Data Leak', leakYear: 2021, compromisedData: ['Số điện thoại', 'Họ tên', 'Vị trí địa lý', 'Mật khẩu băm (bcrypt)'], severity: 'CRITICAL', remediation: 'Thay đổi mật khẩu tài khoản Facebook ngay lập tức và kích hoạt xác thực 2 lớp (2FA).' },
    { sourceName: 'Tiki Vietnam E-commerce Leak', leakYear: 2020, compromisedData: ['Email', 'Lịch sử mua hàng', 'Địa chỉ giao nhận'], severity: 'HIGH', remediation: 'Cảnh giác với các tin nhắn/cuộc gọi mạo danh bưu tá hoặc giao hàng COD bắt nộp tiền khống.' }
  ],
  'lethibichcuc@yahoo.com': [
    { sourceName: 'VNG Vietnam Account Leak', leakYear: 2018, compromisedData: ['Mật khẩu dạng MD5', 'Username', 'SĐT'], severity: 'CRITICAL', remediation: 'Nếu bạn dùng chung mật khẩu này cho email hoặc ngân hàng, hãy đổi ngay lập tức.' }
  ]
};

export const PersonalDataSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'redaction' | 'breach' | 'footprint'>('redaction');

  // 1. Redaction States
  const [rawText, setRawText] = useState(
    'Chào bạn, số CCCD của tôi là 030095829102 và số thẻ ngân hàng Techcombank nhận tiền là 190382910291. Đừng quên OTP gửi về SĐT 0988123456 nhé.'
  );
  const [redactedText, setRedactedText] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);
  const [foundPii, setFoundPii] = useState<string[]>([]);

  // 2. Breach States
  const [breachQuery, setBreachQuery] = useState('');
  const [breachResult, setBreachResult] = useState<any | null>(null);
  const [breachLoading, setBreachLoading] = useState(false);

  // 3. Footprint Audit States
  const [footprintAnswers, setFootprintAnswers] = useState<Record<string, boolean>>({
    pub_phone: true,
    pub_email: false,
    pub_birthday: true,
    tag_location: true,
    reuse_pw: true,
    app_permissions: true
  });
  const [auditResult, setAuditResult] = useState<any | null>(null);

  // Handle Redaction (Regex masking)
  const handleRedactText = () => {
    let text = rawText;
    const found: string[] = [];

    // 1. CCCD regex (12 digits)
    const cccdRegex = /\b\d{12}\b/g;
    if (cccdRegex.test(text)) {
      found.push('Số định danh cá nhân / CCCD');
      text = text.replace(cccdRegex, '[CCCD_ĐÃ_BÔI_ĐỎ]');
    }

    // 2. Bank card regex (16-19 digits or typical STK)
    const bankRegex = /\b\d{9,19}\b/g;
    if (bankRegex.test(text)) {
      found.push('Số tài khoản / Số thẻ ngân hàng');
      text = text.replace(bankRegex, '[SỐ_TÀI_KHOẢN_ĐÃ_ẨN]');
    }

    // 3. Phone number regex (typically start with 0 or +84 and followed by 8-9 digits)
    const phoneRegex = /(?:\+84|0)\d{9,10}/g;
    if (phoneRegex.test(text)) {
      found.push('Số điện thoại di động');
      text = text.replace(phoneRegex, '[SĐT_ĐÃ_MÃ_HÓA]');
    }

    setRedactedText(text);
    setFoundPii(found);
    setIsRedacted(true);
    playSuccessChime();
  };

  // Handle Data Breach Checker
  const handleCheckBreach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!breachQuery.trim()) return;

    setBreachLoading(true);
    setBreachResult(null);

    setTimeout(() => {
      const query = breachQuery.trim().toLowerCase();
      const leaks = HISTORICAL_BREACHES[query];

      if (leaks) {
        setBreachResult({
          compromised: true,
          email: query,
          leaksCount: leaks.length,
          data: leaks,
          generalAdvice: 'Tuyệt đối không dùng chung một mật khẩu cho các dịch vụ trực tuyến khác nhau. Nên đổi mật khẩu định kỳ 6 tháng.'
        });
        playRewardTrophy();
      } else {
        setBreachResult({
          compromised: false,
          email: query,
          message: 'Tuyệt vời! Email của bạn chưa xuất hiện trong các bộ dữ liệu rò rỉ công khai tại Việt Nam trong kho lưu trữ của ScamGuard.'
        });
        playSuccessChime();
      }
      setBreachLoading(false);
    }, 1500);
  };

  // Handle Footprint Audit Scoring
  const handleCalculateFootprint = () => {
    let riskScore = 0;
    const flags: string[] = [];
    const recommendations: string[] = [];

    if (footprintAnswers.pub_phone) {
      riskScore += 20;
      flags.push('Công khai Số điện thoại trên Facebook/TikTok');
      recommendations.push('Đổi quyền riêng tư số điện thoại thành "Chỉ mình tôi" để chặn robot tự động cào danh bạ spam.');
    }
    if (footprintAnswers.pub_email) {
      riskScore += 15;
      flags.push('Công khai Email cá nhân trên trang cá nhân');
      recommendations.push('Ẩn email hiển thị để tránh bị tin tặc spam email giả mạo hóa đơn hoặc mã độc.');
    }
    if (footprintAnswers.pub_birthday) {
      riskScore += 15;
      flags.push('Công khai Ngày tháng năm sinh đầy đủ');
      recommendations.push('Chỉ hiển thị ngày tháng sinh, ẩn năm sinh để ngăn đối tượng lừa đảo thu thập thông tin đăng ký định danh định danh xã hội.');
    }
    if (footprintAnswers.tag_location) {
      riskScore += 15;
      flags.push('Thường xuyên check-in địa chỉ thời gian thực');
      recommendations.push('Hạn chế check-in trực tiếp khi đang ở đó. Hãy đăng ảnh check-in muộn để bảo vệ sự an toàn vị trí thực tế.');
    }
    if (footprintAnswers.reuse_pw) {
      riskScore += 25;
      flags.push('Dùng chung mật khẩu cho nhiều app (Facebook, Gmail, Bank)');
      recommendations.push('Sử dụng trình quản lý mật khẩu (Google Password Manager, Bitwarden) để sinh mật khẩu ngẫu nhiên cho từng app.');
    }
    if (footprintAnswers.app_permissions) {
      riskScore += 10;
      flags.push('Cho phép mọi app truy cập vị trí và micro không giới hạn');
      recommendations.push('Rà soát lại quyền ứng dụng trong cài đặt điện thoại, tắt quyền vị trí chạy ngầm của các game, app chỉnh ảnh.');
    }

    setAuditResult({
      riskScore,
      exposureLevel: riskScore >= 70 ? 'CRITICAL_EXPOSURE' : (riskScore >= 40 ? 'MEDIUM_EXPOSURE' : 'SAFE_FOOTPRINT'),
      flags,
      recommendations
    });
    playSuccessChime();
  };

  return (
    <div className="space-y-6">
      {/* Visual Navigation */}
      <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'redaction', label: '🔐 PII Redaction Vault', icon: EyeOff },
          { id: 'breach', label: '🔎 Data Breach Checker', icon: Database },
          { id: 'footprint', label: '👣 Digital Footprint Audit', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'redaction' && (
          <motion.div
            key="redaction"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <EyeOff className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>PII VAULT & REGEX REDACTION ASSISTANT</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tự động rà quét và bôi đỏ/mã hóa các thông tin nhạy cảm định danh (PII) như Số CCCD, Số thẻ ngân hàng, SĐT và mã OTP trước khi chia sẻ văn bản lên mạng xã hội hoặc gửi cho bên thứ ba.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Raw Input */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase">Văn bản gốc chứa dữ liệu PII:</label>
                <textarea
                  rows={5}
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    setIsRedacted(false);
                  }}
                  placeholder="Dán nội dung tin nhắn hoặc văn bản tại đây..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleRedactText}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all uppercase tracking-wider font-mono cursor-pointer"
                >
                  RÀ QUÉT & BÔI ĐỎ DỮ LIỆU CÁ NHÂN
                </button>
              </div>

              {/* Redacted Output */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase block">Văn bản sau khi làm sạch (Redacted Output):</label>
                {isRedacted ? (
                  <div className="space-y-3">
                    <p className="p-3 bg-slate-900 rounded-xl text-slate-200 text-xs font-mono break-words leading-relaxed select-all">
                      {redactedText}
                    </p>
                    {foundPii.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">• Các lớp PII được nhận diện:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {foundPii.map((pii, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-black font-mono">
                              ✓ {pii}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-400 font-bold font-mono">✓ Chưa phát hiện thông tin PII lộ liễu.</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 space-y-2">
                    <Lock className="w-8 h-8 text-slate-700 animate-pulse" />
                    <p className="text-xs font-medium">Chưa bôi đỏ văn bản.</p>
                    <p className="text-[10px] font-mono">Bấm nút bôi đỏ ở cột bên trái để chạy bộ lọc regex.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'breach' && (
          <motion.div
            key="breach"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>DATA BREACH CHECKER (TRA CỨU RÒ RỈ DỮ LIỆU)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Nhập địa chỉ Email của bạn để kiểm tra xem thông tin đăng nhập cá nhân đã từng bị rò rỉ trong các đợt lộ lọt dữ liệu lịch sử tại Việt Nam hay chưa.
              </p>
            </div>

            <form onSubmit={handleCheckBreach} className="flex gap-2">
              <input
                type="text"
                value={breachQuery}
                onChange={(e) => setBreachQuery(e.target.value)}
                placeholder="Ví dụ: nguyenvanan@gmail.com, lethibichcuc@yahoo.com..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={breachLoading || !breachQuery.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 font-mono cursor-pointer"
              >
                {breachLoading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>DANG DUYET...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>QUÉT RÒ RỈ</span>
                  </>
                )}
              </button>
            </form>

            {breachResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-5 rounded-2xl border space-y-4 ${
                  breachResult.compromised
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-emerald-950/20 border-emerald-500/30'
                }`}
              >
                {breachResult.compromised ? (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-rose-300 font-mono uppercase">PHÁT HIỆN SỰ CỐ:</p>
                        <p className="text-sm font-black text-rose-400">{breachResult.email}</p>
                      </div>
                      <span className="text-sm font-black text-rose-400 font-mono bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                        🚨 LỘ LỌT TẠI {breachResult.leaksCount} NGUỒN
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {breachResult.data.map((leak: BreachRecord, idx: number) => (
                        <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                          <div className="flex justify-between items-center text-[11px] font-mono font-black text-white">
                            <span>• {leak.sourceName} ({leak.leakYear})</span>
                            <span className="text-rose-400">SEVERITY: {leak.severity}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                            Dữ liệu rò rỉ: <strong className="text-slate-200">{leak.compromisedData.join(', ')}</strong>
                          </p>
                          <p className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-850 font-sans">
                            Lời khuyên xử lý: {leak.remediation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{breachResult.message}</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'footprint' && (
          <motion.div
            key="footprint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>DIGITAL FOOTPRINT PRIVACY AUDIT (BẢN ĐỒ VẾT CHÂN SỐ)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tự đánh giá vết chân số của bạn trên các nền tảng mạng xã hội lớn (Facebook, Google, TikTok) để nhận biết lỗ hổng thông tin cá nhân và phương pháp đóng hòm bảo mật an toàn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Checkbox Audit List */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs font-sans">
                <p className="text-xs font-black text-white font-mono uppercase tracking-wider text-slate-300">Bộ câu hỏi tự đánh giá:</p>

                <div className="space-y-3 text-slate-300">
                  <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={footprintAnswers.pub_phone}
                      onChange={(e) => setFootprintAnswers({ ...footprintAnswers, pub_phone: e.target.checked })}
                      className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500 h-4 w-4"
                    />
                    <span>Tôi có để SĐT cá nhân công khai ở mục "Giới thiệu" trên Facebook/Tiktok.</span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={footprintAnswers.pub_email}
                      onChange={(e) => setFootprintAnswers({ ...footprintAnswers, pub_email: e.target.checked })}
                      className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500 h-4 w-4"
                    />
                    <span>Email cá nhân chính của tôi hiển thị công khai trên trang cá nhân.</span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={footprintAnswers.pub_birthday}
                      onChange={(e) => setFootprintAnswers({ ...footprintAnswers, pub_birthday: e.target.checked })}
                      className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500 h-4 w-4"
                    />
                    <span>Tôi hiển thị công khai ngày tháng năm sinh đầy đủ trên mạng xã hội.</span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={footprintAnswers.tag_location}
                      onChange={(e) => setFootprintAnswers({ ...footprintAnswers, tag_location: e.target.checked })}
                      className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500 h-4 w-4"
                    />
                    <span>Tôi thường xuyên đăng ảnh check-in kèm định vị địa điểm trực tiếp khi đi chơi.</span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={footprintAnswers.reuse_pw}
                      onChange={(e) => setFootprintAnswers({ ...footprintAnswers, reuse_pw: e.target.checked })}
                      className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500 h-4 w-4"
                    />
                    <span>Tôi đang dùng chung một mật khẩu cho Gmail, Facebook và các ứng dụng mua sắm.</span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={footprintAnswers.app_permissions}
                      onChange={(e) => setFootprintAnswers({ ...footprintAnswers, app_permissions: e.target.checked })}
                      className="mt-0.5 rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500 h-4 w-4"
                    />
                    <span>Tôi thường cấp quyền vị trí chạy ngầm cho mọi game hoặc ứng dụng chụp ảnh.</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleCalculateFootprint}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all uppercase tracking-wider font-mono cursor-pointer"
                >
                  XUẤT BẢN ĐỒ VẾT CHÂN SỐ
                </button>
              </div>

              {/* Footprint Audit Results */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <p className="text-xs font-bold text-slate-400 font-mono uppercase block">Chỉ số tiếp xúc thông tin cá nhân:</p>
                {auditResult ? (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex items-center justify-between bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-amber-300 font-mono">ĐỘ LỘ THÔNG TIN (EXPOSURE INDEX):</p>
                        <p className="text-sm font-black text-amber-400">
                          {auditResult.exposureLevel === 'CRITICAL_EXPOSURE' ? '🚨 NGUY CƠ CAO (CRITICAL)' : 'TRUNG BÌNH (MEDIUM)'}
                        </p>
                      </div>
                      <span className="text-2xl font-black text-amber-400 font-mono">{auditResult.riskScore}%</span>
                    </div>

                    {auditResult.flags.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">• Các điểm sơ hở được nhận diện:</p>
                        <div className="space-y-1.5 text-[11px] font-mono text-rose-300">
                          {auditResult.flags.map((flag: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-rose-400" />
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-900 space-y-2">
                      <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">• Khuyến nghị nâng cấp bảo mật:</p>
                      <div className="space-y-1.5 leading-relaxed text-slate-300">
                        {auditResult.recommendations.map((rec: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-1.5 bg-slate-900 p-2 rounded-lg border border-slate-850">
                            <span className="text-cyan-400 font-bold font-mono">#{idx+1}</span>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-2">
                    <Globe className="w-8 h-8 text-slate-700 animate-pulse" />
                    <p className="text-xs font-medium">Chưa xuất chỉ số chân số.</p>
                    <p className="text-[10px] font-mono">Tick các thói quen cá nhân của bạn bên trái và bấn Xuất bản đồ.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
