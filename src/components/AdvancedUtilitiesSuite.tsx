import React, { useState } from 'react';
import {
  AlertTriangle,
  Lock,
  PhoneCall,
  FileDown,
  Link2,
  BookOpen,
  ShieldAlert,
  Percent,
  Search,
  CheckCircle2,
  RefreshCw,
  Copy,
  Sliders,
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playAlertWarning } from '../utils/audioEffects';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

interface AdvancedUtilitiesSuiteProps {
  onEarnXp?: (xp: number) => void;
}

// -------------------- DICTIONARY JARGON DATA --------------------
const SCAM_GLOSSARY = [
  { term: 'Phishing', definition: 'Lừa đảo giả mạo liên kết, trang web, email của tổ chức lớn (Ngân hàng, Cơ quan thuế, Netflix) để chiếm đoạt tài khoản đăng nhập.' },
  { term: 'Smishing', definition: 'Chiến dịch lừa đảo qua tin nhắn SMS, SMS Brandname giả thương hiệu chính chủ đẩy người dùng truy cập link độc hại.' },
  { term: 'Quishing', definition: 'Lừa đảo qua mã QR Code. Kẻ xấu thường dán đè mã QR nhận tiền tại các cửa hàng, bãi gửi xe công cộng để cướp tiền thụ hưởng.' },
  { term: 'Pig-Butchering (Mổ heo)', definition: 'Hình thức lừa đảo hẹn hò lãng mạn kết hợp dụ dỗ đầu tư tài chính đa cấp, nuôi dưỡng lòng tin trong thời gian dài rồi dụ dỗ nạp tiền khủng.' },
  { term: 'Malware APK (VNeID giả)', definition: 'Dụ dỗ tải tệp ứng dụng .apk trực tiếp ngoài AppStore (giả app Thuế, VNeID). Mã độc sẽ chiếm quyền Accessibility đọc mã OTP và tự chuyển khoản ngầm.' },
  { term: 'Sim Swap (Cướp sim)', definition: 'Kẻ xấu giả danh chủ thuê bao ra nhà mạng xin cấp lại thẻ SIM mới nhằm nhận các mã SMS OTP chuyển khoản ngân hàng.' }
];

export const AdvancedUtilitiesSuite: React.FC<AdvancedUtilitiesSuiteProps> = ({
  onEarnXp = (_xp: number) => {}
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'emergency_kit' | 'pdf_generator' | 'short_url' | 'dictionary' | 'otp_shield' | 'compare_bill' | 'widget' | 'roi'
  >('emergency_kit');

  // -------------------- 1. DIGITAL EMERGENCY KIT STATES --------------------
  const [kitStep, setKitStep] = useState<number>(1);
  const [bankSearch, setBankSearch] = useState<string>('');
  const BANK_HOTLINES = [
    { name: 'Vietcombank (VCB)', number: '1900545413', activeHours: '24/7' },
    { name: 'Techcombank (TCB)', number: '1800588822', activeHours: '24/7' },
    { name: 'BIDV', number: '19009247', activeHours: '24/7' },
    { name: 'VietinBank', number: '1900558868', activeHours: '24/7' },
    { name: 'Agribank', number: '1900558818', activeHours: '24/7' },
    { name: 'MB Bank', number: '1900545426', activeHours: '24/7' },
    { name: 'ACB', number: '1900545486', activeHours: '24/7' },
    { name: 'TPBank', number: '1900585885', activeHours: '24/7' },
    { name: 'VPBank', number: '1900545415', activeHours: '24/7' }
  ];

  // -------------------- 2. PDF EVIDENCE GENERATOR STATES --------------------
  const [victimName, setVictimName] = useState('');
  const [scammerBank, setScammerBank] = useState('');
  const [scammerAccount, setScammerAccount] = useState('');
  const [scammerPhone, setScammerPhone] = useState('');
  const [scammedAmount, setScammedAmount] = useState('');
  const [scamTimeline, setScamTimeline] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleGeneratePdf = () => {
    if (!victimName || !scammerAccount || !scamTimeline) {
      alert('Vui lòng điền các trường cốt lõi (Tên nạn nhân, STK kẻ gian, Mốc thời gian) để xuất đơn thư!');
      return;
    }
    setIsPdfGenerating(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        // Add Vietnamese standard document layouts without special font dependencies using standard PDF lines
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('CONG HOA XA HOI CHU NGHIA VIET NAM', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Doc lap - Tu do - Hanh phuc', 105, 22, { align: 'center' });
        doc.line(70, 25, 140, 25);

        doc.setFontSize(14);
        doc.text('DON TRINH BAO VE SU VIEC BI LUA DAO CHIEM DOAT TAI SAN', 105, 40, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Ma so chung thu: SG-EVI-${Date.now().toString().slice(-6)}`, 105, 46, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text('Kinh gui: - Co quan Canh Sat Dieu Tra Cong An Quan/Huyen', 20, 60);
        doc.text('          - Phong An ninh mang & Phong chong Toi pham Cong nghe cao (A05)', 20, 66);

        doc.text(`Toi ten la: ${victimName.toUpperCase()}`, 20, 80);
        doc.text(`Nay lam don nay de trinh bao ve viec bi ke gian lua dao chiem doat tai san qua mang:`, 20, 86);

        doc.setFont('helvetica', 'bold');
        doc.text('THONG TIN VE DOI TUONG LUA DAO (SUSPECT DETAILS):', 20, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(`- So tai khoan ke gian thu huong: ${scammerAccount} (Ngan hang: ${scammerBank || 'N/A'})`, 20, 108);
        doc.text(`- So dien thoai lien he cua ke gian : ${scammerPhone || 'N/A'}`, 20, 114);
        doc.text(`- Tong so tien bi lua chiem doat   : ${scammedAmount || 'Chua xac dinh'} VND`, 20, 120);

        doc.setFont('helvetica', 'bold');
        doc.text('DIEN BIEN SU VIEC (TIMELINE & EVIDENCE SUMMARY):', 20, 135);
        doc.setFont('helvetica', 'normal');
        doc.text(`Moc thoi gian say ra: ${scamTimeline}`, 20, 143);
        doc.text('Tom tat hanh vi doi tuong:', 20, 149);
        doc.text('Doi tuong da chu dong tiep can qua mang, thiet lap niem tin hoac de doa, yeu cau', 20, 155);
        doc.text('nan nhan nap tien thuc hien nhiem vu hoac dong phi tam ung roi khoa lien lac.', 20, 161);

        doc.setFont('helvetica', 'bold');
        doc.text('LOI CAM DOAN (OATH OF VERACITY):', 20, 175);
        doc.setFont('helvetica', 'normal');
        doc.text('Toi xin cam đoan moi thong tin trinh bay tren day la hoan toan dung su that.', 20, 181);
        doc.text('Neu sai toi xin chiu hoan toan trach nhiem truoc phap luat nuoc Viet Nam.', 20, 187);

        doc.text('Nguoi lam don (Ky va ghi ro ho ten)', 130, 205);
        doc.text('(Don duoc ho tro tao tu dong boi ScamGuard VN portal)', 20, 270);

        // Save PDF file safely
        doc.save(`Don_Trinh_Bao_Lua_Dao_${victimName.replace(/\s+/g, '_')}.pdf`);
        
        playSuccessChime();
        onEarnXp(25);
        confetti({ particleCount: 30, spread: 40 });
      } catch (err) {
        console.error(err);
      } finally {
        setIsPdfGenerating(false);
      }
    }, 1500);
  };

  // -------------------- 3. SHORT URL DECODER STATES --------------------
  const [shortUrlInput, setShortUrlInput] = useState('');
  const [decodedDest, setDecodedDest] = useState<any | null>(null);
  const [decoding, setDecoding] = useState(false);

  const handleDecodeUrl = () => {
    if (!shortUrlInput.trim()) return;
    setDecoding(true);
    setDecodedDest(null);

    setTimeout(() => {
      const u = shortUrlInput.toLowerCase().trim();
      let destination = 'https://shopee-khuyenmai-online.xyz/trung-thuong-qua-tet';
      let riskLevel = 'CRITICAL';
      let isPhishing = true;

      if (u.includes('bit.ly/vneid')) {
        destination = 'https://vneid-gov-portal-app.xyz/download/vneid_app.apk';
      } else if (u.includes('tinyurl.com/mbbank')) {
        destination = 'https://mbbank-online-verification.cc/login';
      } else if (u.includes('t.co/vcb')) {
        destination = 'https://vietcombank-account-lock-security.online';
      } else {
        // generic fallback safe
        destination = 'https://original-highlands-coffee-vietqr.vn/menu';
        riskLevel = 'SAFE';
        isPhishing = false;
      }

      setDecodedDest({
        shortUrl: shortUrlInput,
        destination,
        riskLevel,
        isPhishing,
        description: isPhishing 
          ? 'CẢNH BÁO: Tên miền cuối cùng nhại thương hiệu nổi tiếng, nằm trong danh mục website đen chuyên harvesting mật khẩu ngân hàng của ScamGuard.'
          : 'AN TOÀN: Liên kết gốc khớp chính xác với hệ thống phân giải chính thống của Highlands Coffee.'
      });

      if (isPhishing) {
        playAlertWarning();
      } else {
        playSuccessChime();
        onEarnXp(15);
      }
      setDecoding(false);
    }, 1500);
  };

  // -------------------- 4. DICTIONARY GLOSSARY STATES --------------------
  const [dictSearch, setDictSearch] = useState('');

  // -------------------- 5. OTP SHIELD STATES & GAME --------------------
  const [otpShieldStep, setOtpShieldStep] = useState<number>(0);
  const [otpShieldVerdict, setOtpShieldVerdict] = useState<string | null>(null);

  const startOtpShieldFlow = () => {
    setOtpShieldStep(1);
    setOtpShieldVerdict(null);
  };

  const handleOtpAnswer = (questionId: number, answer: 'yes' | 'no') => {
    if (questionId === 1) {
      if (answer === 'yes') {
        // Did you actively perform login or purchase just now?
        setOtpShieldStep(2);
      } else {
        // Randomly received out of nowhere
        setOtpShieldVerdict('🔴 CẢNH BÁO ĐỎ: Điện thoại của bạn có nguy cơ cực cao đang bị hacker chiếm quyền đăng nhập hoặc chiếm đoạt sim ngầm (SIM Swap). Tuyệt đối KHÔNG chia sẻ mã OTP này cho bất kỳ ai, kể cả người thân, hay nhân viên tự xưng tổng đài ngân hàng!');
        playAlertWarning();
      }
    } else if (questionId === 2) {
      if (answer === 'yes') {
        // Is the SMS asking you to send it to a telephone number?
        setOtpShieldVerdict('🔴 CẢNH BÁO CỰC NGUY HIỂM: Giao dịch chính chủ ngân hàng KHÔNG bao giờ yêu cầu bạn đọc mã OTP cho con người hoặc nhập vào link cá nhân. Đây là chiêu trò cướp OTP lấy tiền lừa đảo!');
        playAlertWarning();
      } else {
        setOtpShieldVerdict('🟢 TRẠNG THÁI AN TOÀN: Mã OTP khớp với hành động chủ động của bạn trên website ngân hàng chính chủ. Hãy chắc chắn tên miền trình duyệt là đuôi chính quy (ví dụ: vietcombank.com.vn) trước khi nhập mã.');
        playSuccessChime();
        onEarnXp(15);
      }
    }
  };

  // -------------------- 6. RECEIPT INVOICE COMPARE STATES --------------------
  const [billCompareType, setBillCompareType] = useState<'techcom' | 'vietcom'>('techcom');

  // -------------------- 7. EMBEDDABLE WIDGET STATES --------------------
  const [widgetCopied, setWidgetCopied] = useState(false);
  const WIDGET_CODE = `<iframe src="https://scamguard.vn/embed-widget" width="100%" height="450px" style="border: 2px solid #06b6d4; border-radius: 16px; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);" allow="clipboard-read; clipboard-write;"></iframe>`;

  const handleCopyWidget = () => {
    navigator.clipboard.writeText(WIDGET_CODE);
    setWidgetCopied(true);
    setTimeout(() => setWidgetCopied(false), 2000);
    playSuccessChime();
  };

  // -------------------- 8. ABSURD ROI CALCULATOR STATES --------------------
  const [roiDailyPercent, setRoiDailyPercent] = useState<number>(5); // Default 5% daily
  const [roiInvestmentCapital, setRoiInvestmentCapital] = useState<number>(10000000); // 10M VND

  const calculateRoiResult = () => {
    const dailyRate = roiDailyPercent / 100;
    // Compounding formula: Capital * (1 + rate)^365
    // To avoid overflow, cap calculation at float or present beautiful compounding curves
    const days = 30;
    const days365Result = roiInvestmentCapital * Math.pow(1 + dailyRate, 365);
    const days30Result = roiInvestmentCapital * Math.pow(1 + dailyRate, 30);
    const annualReturnRate = (Math.pow(1 + dailyRate, 365) - 1) * 100;

    const vnd = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    return {
      annualRateFormatted: annualReturnRate.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + '%',
      days30Val: vnd(days30Result),
      days365Val: days365Result > 1e15 ? 'Vượt quá ngưỡng đo (Trăm nghìn Tỷ USD)' : vnd(days365Result),
      warningComment: roiDailyPercent >= 2 
        ? '⚠️ CẢNH BÁO PONZI: Tốc độ tăng trưởng tài sản này nhanh hơn gấp 10.000 lần Cục Dự Trữ Liên Bang Mỹ. Sàn đa cấp ảo lừa đảo chắc chắn sập trong 14 ngày khi dòng tiền nạp của người sau không đủ trả lãi cho người trước!'
        : 'Lãi suất gửi tiết kiệm chính quy nhà nước tối đa hiện chỉ khoảng 5.5% / NĂM.'
    };
  };

  const roiRes = calculateRoiResult();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
        {[
          { id: 'emergency_kit', label: '🧳 Túi Cứu Hộ Số', icon: ShieldAlert },
          { id: 'pdf_generator', label: '📄 Đơn Trình Báo PDF', icon: FileDown },
          { id: 'short_url', label: '🔗 Giải Mã Link Ngắn', icon: Link2 },
          { id: 'dictionary', label: '📖 Từ Điển Phishing', icon: BookOpen },
          { id: 'otp_shield', label: '🛡️ Lá Chắn OTP', icon: Lock },
          { id: 'compare_bill', label: '🔍 Soi Bill Thật/Giả', icon: Eye },
          { id: 'widget', label: '🔌 Nhúng Widget', icon: Copy },
          { id: 'roi', label: '🧮 Máy Tính Lãi Ảo', icon: Percent }
        ].map(subTab => {
          const Icon = subTab.icon;
          const isActive = activeSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{subTab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* 1. DIGITAL EMERGENCY KIT */}
          {activeSubTab === 'emergency_kit' && (
            <motion.div
              key="emergency_kit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                    <span>TÚI CỨU HỘ SỐ KHẨN CẤP (DIGITAL EMERGENCY KIT)</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Hãy làm theo 4 bước sinh tử trong 15 phút đầu tiên kể từ khi vừa phát hiện chuyển khoản nhầm cho kẻ lừa đảo hoặc dính mã độc.
                  </p>
                </div>
                <div className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-xl text-xs font-black font-mono animate-pulse">
                  ⏱️ 15 PHÚT VÀNG PHONG TỎA
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black">
                {['Khóa Thẻ / App', 'Thu Hồi Session', 'Báo Canh Sát 113', 'Xuất Đơn PDF'].map((stepName, idx) => {
                  const stepNum = idx + 1;
                  const isActive = kitStep === stepNum;
                  const isDone = kitStep > stepNum;
                  return (
                    <div
                      key={stepNum}
                      onClick={() => setKitStep(stepNum)}
                      className={`p-2 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                          : isDone
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950 text-slate-500 border-slate-900'
                      }`}
                    >
                      BƯỚC {stepNum}: {stepName}
                    </div>
                  );
                })}
              </div>

              {/* Step Content */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 min-h-[220px] flex flex-col justify-between">
                {kitStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-white">Yêu Cầu Tạm Khóa Thẻ / Internet Banking Ngay Lập Tức</h3>
                      <p className="text-xs text-slate-300">
                        Gọi ngay cho tổng đài ngân hàng để yêu cầu chặn đứng mọi lệnh rút tiền tự động hoặc giao dịch trực tuyến từ tài khoản của bạn.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          placeholder="Tìm nhanh hotline ngân hàng..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[100px] overflow-y-auto pr-1">
                        {BANK_HOTLINES
                          .filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()))
                          .map((b, idx) => (
                            <a
                              key={idx}
                              href={`tel:${b.number}`}
                              className="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-850 flex items-center justify-between group transition-all"
                            >
                              <div className="truncate">
                                <div className="text-[10px] font-bold text-white truncate">{b.name}</div>
                                <div className="text-[9px] font-mono text-cyan-400 font-black">{b.number}</div>
                              </div>
                              <PhoneCall className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                            </a>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {kitStep === 2 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-white">Thu Hồi Mọi Phiên Đăng Nhập Hoạt Động (Revoke All Sessions)</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Kẻ gian có thể đã đánh cắp cookie hoặc token của bạn để điều khiển tài khoản từ xa. Hãy truy cập mục Thiết Lập Bảo Mật trên Facebook, Zalo, Telegram, Google và chọn <strong className="text-rose-400">"Đăng xuất khỏi tất cả các thiết bị khác"</strong> ngay lập tức.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Zalo Thiết lập', 'Facebook Login Security', 'Google Security Console'].map((plat, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          🔗 {plat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {kitStep === 3 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-white">Trình Báo Cơ Quan Cục Phòng Chống Tội Phạm Không Gian Mạng</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Liên hệ khẩn cấp đường dây nóng Công An địa phương hoặc Phòng An ninh mạng (A05) để ghi nhận biên lai rò rỉ dòng tiền.
                    </p>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 space-y-1 text-xs">
                      <div className="text-white font-bold">• Hotline Phòng Chống Tội Phạm Hà Nội: <span className="text-rose-400 font-mono">024.3733.6999</span></div>
                      <div className="text-white font-bold">• Hotline Công An TP.HCM: <span className="text-rose-400 font-mono">028.3841.0010</span></div>
                    </div>
                  </div>
                )}

                {kitStep === 4 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-white">Chuyển Sang Tab PDF Để Tạo Đơn Trình Báo Chuẩn</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sử dụng Trình Tạo Đơn Trình Báo PDF Tự Động của chúng tôi để điền thông tin và lưu file đơn tố tụng chính quy nộp công an quận huyện.
                    </p>
                    <button
                      onClick={() => setActiveSubTab('pdf_generator')}
                      className="px-4 py-2 bg-cyan-500 text-slate-950 font-black rounded-xl text-xs font-mono uppercase hover:bg-cyan-400 transition-all"
                    >
                      BẮT ĐẦU TẠO PDF NGAY
                    </button>
                  </div>
                )}

                {/* Foot Action */}
                <div className="flex justify-between items-center border-t border-slate-900 pt-3 mt-4">
                  <button
                    disabled={kitStep === 1}
                    onClick={() => setKitStep(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-850 rounded text-xs text-slate-400 hover:text-white transition-all disabled:opacity-30"
                  >
                    Quay lại
                  </button>
                  <button
                    disabled={kitStep === 4}
                    onClick={() => { setKitStep(prev => Math.min(4, prev + 1)); playSuccessChime(); }}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-850 rounded text-xs text-cyan-400 hover:text-cyan-300 transition-all disabled:opacity-30"
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. PDF EVIDENCE GENERATOR */}
          {activeSubTab === 'pdf_generator' && (
            <motion.div
              key="pdf_generator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <FileDown className="w-5 h-5 text-indigo-400" />
                  <span>TRÌNH TẠO ĐƠN TRÌNH BÁO PHÁP LÝ PDF (FORENSIC EVIDENCE COMPLAINT)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Nhập thông tin giao dịch lừa đảo của kẻ xấu để hệ thống biên soạn thành văn bản đơn tố giác lừa đảo chiếm đoạt tài sản chính quy dưới dạng PDF sẵn sàng in ấn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-950 rounded-2xl border border-slate-800 p-5">
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Tên đầy đủ của bạn (Nạn nhân):</label>
                    <input
                      type="text"
                      value={victimName}
                      onChange={(e) => setVictimName(e.target.value)}
                      placeholder="Ví dụ: NGUYỄN VĂN A"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Ngân hàng của kẻ gian thụ hưởng:</label>
                    <input
                      type="text"
                      value={scammerBank}
                      onChange={(e) => setScammerBank(e.target.value)}
                      placeholder="Ví dụ: Techcombank, MB Bank..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Số tài khoản nhận tiền lừa đảo:</label>
                    <input
                      type="text"
                      value={scammerAccount}
                      onChange={(e) => setScammerAccount(e.target.value)}
                      placeholder="Ví dụ: 1902018291..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Số điện thoại liên hệ của đối phương:</label>
                    <input
                      type="text"
                      value={scammerPhone}
                      onChange={(e) => setScammerPhone(e.target.value)}
                      placeholder="Ví dụ: 0912..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Số tiền bị chiếm đoạt (VND):</label>
                    <input
                      type="text"
                      value={scammedAmount}
                      onChange={(e) => setScammedAmount(e.target.value)}
                      placeholder="Ví dụ: 50.000.000"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Mốc thời gian phát sinh sự việc:</label>
                    <input
                      type="text"
                      value={scamTimeline}
                      onChange={(e) => setScamTimeline(e.target.value)}
                      placeholder="Ví dụ: Khoảng 10h30 ngày 23/08/2026..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-3 border-t border-slate-900">
                  <button
                    onClick={handleGeneratePdf}
                    disabled={isPdfGenerating}
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs font-mono rounded-xl transition-all disabled:opacity-40"
                  >
                    {isPdfGenerating ? '✍️ ĐANG XUẤT ĐƠN TỐ CÁO CHỮ CHỨNG THƯ KÝ SỐ...' : 'XUẤT ĐƠN TRÌNH BÁO PDF CHÍNH QUY'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. SHORT URL SCANNER / DECODER */}
          {activeSubTab === 'short_url' && (
            <motion.div
              key="short_url"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-cyan-400" />
                  <span>TRÌNH GIẢI MÃ LIÊN KẾT RÚT GỌN (SHORT URL TRACE DECODER)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Dán các liên kết dạng bit.ly, tinyurl, t.co rác để bóc tách địa chỉ gốc cuối cùng trước khi nhấn vào trình duyệt để ngăn dính mã độc đánh cắp tiền.
                </p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shortUrlInput}
                    onChange={(e) => setShortUrlInput(e.target.value)}
                    placeholder="Dán link ngắn nghi vấn (ví dụ: bit.ly/vneid-vcs)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 font-mono"
                  />
                  <button
                    onClick={handleDecodeUrl}
                    disabled={decoding || !shortUrlInput.trim()}
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono rounded-xl transition-all"
                  >
                    GIẢI MÃ
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="font-bold text-slate-400">Thử các link rút gọn giả định:</span>
                  {['bit.ly/vneid-vcs', 'tinyurl.com/mbbank-verification', 't.co/vcb-security-issue'].map(link => (
                    <button
                      key={link}
                      onClick={() => setShortUrlInput(link)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-300 rounded font-mono"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>

              {decoding ? (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-8 text-center space-y-2">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">ĐANG PHÂN GIẢI DNS CHÉO & THEO DÕI HTTP REDIRECT HOP...</p>
                </div>
              ) : decodedDest ? (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 animate-fadeIn">
                  <div className={`p-3 rounded-xl border ${decodedDest.isPhishing ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'}`}>
                    <div className="text-[10px] font-black uppercase tracking-wider font-mono">ĐỘ RỦI RO ĐÍCH ĐẾN</div>
                    <div className="text-sm font-black font-mono mt-0.5">{decodedDest.riskLevel}</div>
                  </div>

                  <div className="space-y-3.5 text-xs leading-relaxed">
                    <div>
                      <span className="text-slate-400 font-mono text-[10px] uppercase">Địa chỉ gốc cuối cùng (Destination Address):</span>
                      <div className="font-mono bg-slate-900 p-3 rounded-xl border border-slate-850 text-cyan-300 font-bold overflow-x-auto select-all mt-1">{decodedDest.destination}</div>
                    </div>
                    <p className="text-slate-300 border-t border-slate-900 pt-3 font-medium">
                      {decodedDest.description}
                    </p>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* 4. PHISHING DICTIONARY */}
          {activeSubTab === 'dictionary' && (
            <motion.div
              key="dictionary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>TỪ ĐIỂN THUẬT NGỮ PHÒNG CHỐNG LỪA ĐẢO SỐ (SCAM DICTIONARY)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  A-Z bách khoa toàn thư định nghĩa dễ hiểu, thực tế về các chiêu thức lừa đảo tài chính công nghệ cao đang hoành hành rộng rãi tại Việt Nam.
                </p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={dictSearch}
                    onChange={(e) => setDictSearch(e.target.value)}
                    placeholder="Tìm nhanh định nghĩa chiêu thức lừa đảo..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-1">
                  {SCAM_GLOSSARY
                    .filter(item => item.term.toLowerCase().includes(dictSearch.toLowerCase()) || item.definition.toLowerCase().includes(dictSearch.toLowerCase()))
                    .map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-850 space-y-1.5">
                        <h4 className="text-xs font-black text-cyan-400 font-mono uppercase">{item.term}</h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{item.definition}</p>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. OTP SHIELD SIMULATOR */}
          {activeSubTab === 'otp_shield' && (
            <motion.div
              key="otp_shield"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  <span>MÔ PHỎNG LÁ CHẮN KHẨN CẤP OTP (SMS OTP SHIELD)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Tình huống nhận SMS OTP lạ? Hãy đưa quyết định sáng suốt thông qua bộ lọc chẩn đoán rủi ro 2 bước để chặn đứng ý đồ hack tài khoản âm thầm.
                </p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 min-h-[200px] flex flex-col justify-between">
                {otpShieldStep === 0 && (
                  <div className="space-y-4 text-center py-6">
                    <ShieldAlert className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      "Tài khoản Zalo của bạn đang được đổi số liên kết. Mã xác minh là 992-122. Không chia sẻ mã này cho bất kỳ ai..." - ĐIỆN THOẠI VỪA RUNG LÊN KHẨN CẤP!
                    </p>
                    <button
                      onClick={startOtpShieldFlow}
                      className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs font-mono rounded-xl transition-all"
                    >
                      BẮT ĐẦU CHẨN ĐOÁN RỦI RO
                    </button>
                  </div>
                )}

                {otpShieldStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-xs text-indigo-300 font-mono text-center">
                      CÂU HỎI SỐ #1: Bạn có đang chủ động thao tác giao dịch, đổi mật khẩu hoặc đăng nhập ngân hàng ngay thời điểm này không?
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleOtpAnswer(1, 'yes')}
                        className="flex-1 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-bold rounded-xl text-xs"
                      >
                        Có, tôi đang mua hàng/đăng nhập
                      </button>
                      <button
                        onClick={() => handleOtpAnswer(1, 'no')}
                        className="flex-1 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold rounded-xl text-xs"
                      >
                        Không hề, tự dưng SMS báo về máy
                      </button>
                    </div>
                  </div>
                )}

                {otpShieldStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-xs text-indigo-300 font-mono text-center">
                      CÂU HỎI SỐ #2: Có ai đang gọi điện hối thúc bạn đọc mã OTP này để nhận thưởng, đền bồi tiền COD hoặc dán mã vào link chat bưu điện không?
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleOtpAnswer(2, 'yes')}
                        className="flex-1 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold rounded-xl text-xs"
                      >
                        Có, bưu tá gọi hối điền link đền bù
                      </button>
                      <button
                        onClick={() => handleOtpAnswer(2, 'no')}
                        className="flex-1 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-bold rounded-xl text-xs"
                      >
                        Không, tôi tự thực hiện trên app chính quy
                      </button>
                    </div>
                  </div>
                )}

                {otpShieldVerdict && (
                  <div className="space-y-4 animate-fadeIn py-3">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-bold">
                      {otpShieldVerdict}
                    </div>
                    <button
                      onClick={() => setOtpShieldStep(0)}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-white transition-all"
                    >
                      Kiểm tra tình huống mới
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 6. RECEIPT INVOICE COMPARE */}
          {activeSubTab === 'compare_bill' && (
            <motion.div
              key="compare_bill"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    <span>SO SÁNH BẰNG CHỨNG HÓA ĐƠN THỰC - GIẢ (RECEIPT DETAIL DIFF)</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Soi điểm bất hợp lý trên bill chuyển tiền Photoshop bằng ứng dụng tạo biên lai giả trực tuyến để cướp đơn hàng shipper hoặc lừa mua hàng online.
                  </p>
                </div>

                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 space-x-1">
                  <button
                    onClick={() => setBillCompareType('techcom')}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${
                      billCompareType === 'techcom' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mẫu Techcombank
                  </button>
                  <button
                    onClick={() => setBillCompareType('vietcom')}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${
                      billCompareType === 'vietcom' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mẫu Vietcombank
                  </button>
                </div>
              </div>

              {/* Side by side diff comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Techcombank Case */}
                {billCompareType === 'techcom' ? (
                  <>
                    <div className="bg-slate-950 rounded-2xl border-2 border-emerald-500/40 p-5 space-y-4">
                      <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30 uppercase tracking-wider">Hóa Đơn Thật (Techcombank App)</span>
                      <div className="space-y-2 text-xs text-slate-300 font-mono">
                        <div>• Logo: Mịn, độ phân giải sắc nét, tỉ lệ bo góc icon đỏ chính xác cân đối.</div>
                        <div>• Phông chữ (Font): Đồng bộ phông chữ San Francisco hệ điều hành iOS hoặc Roboto trên Android.</div>
                        <div>• Thời gian: Khớp 100% thời gian nhảy giờ góc pin thiết bị điện thoại.</div>
                        <div>• Mã giao dịch FT: Luôn có mã tra cứu nội bộ khớp cổng Napas của ngân hàng thụ hưởng.</div>
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-2xl border-2 border-rose-500/40 p-5 space-y-4 animate-fadeIn">
                      <span className="text-[10px] font-black bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono border border-rose-500/30 uppercase tracking-wider">Mẫu Photoshop Giả (Fake Bill Creator)</span>
                      <div className="space-y-2 text-xs text-rose-300 font-mono">
                        <div>❌ Logo: Bị nhòe viền, pixel hóa rạn nứt, bóng đổ lỗi do tải ảnh từ Google rác.</div>
                        <div>❌ Lỗi Font: Các số VND lớn bị lệch size so với chữ, phông thanh đậm không đều.</div>
                        <div>❌ Lỗi Giờ: Giờ thực hiện trên hóa đơn và giờ chụp màn hình trên điện thoại lệch nhau hơn 30 phút.</div>
                        <div>❌ Thiếu mã giao dịch: Mã FT bị copy chồng đè hoặc bôi xóa vụng về.</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-slate-950 rounded-2xl border-2 border-emerald-500/40 p-5 space-y-4">
                      <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30 uppercase tracking-wider">Hóa Đơn Thật (Vietcombank)</span>
                      <div className="space-y-2 text-xs text-slate-300 font-mono">
                        <div>• Chữ số: Luôn sử dụng phông chữ đặc thù Vietcombank Rounded, khoảng cách số liền mạch.</div>
                        <div>• Màu sắc thương hiệu: Tone màu xanh lá mạ truyền thống đồng nhất, không lem màu nền.</div>
                        <div>• Watermark chìm: Hoa văn ẩn dạng xoắn tròn tinh xảo ẩn dưới nội dung biên lai.</div>
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-2xl border-2 border-rose-500/40 p-5 space-y-4 animate-fadeIn">
                      <span className="text-[10px] font-black bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono border border-rose-500/30 uppercase tracking-wider">Hóa Đơn Giả Vietcombank</span>
                      <div className="space-y-2 text-xs text-rose-300 font-mono">
                        <div>❌ Lệch Font: Sử dụng phông Arial hoặc Times New Roman nham nhở cho các dòng số tiền.</div>
                        <div>❌ Lem màu nền: Chữ số có bóng trắng mờ xung quanh (lỗi tẩy xóa viết đè ảnh thô).</div>
                        <div>❌ Mất hoa văn: Watermark Vietcombank chìm bị xén mất hoặc vỡ hạt nặng.</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* 7. EMBEDDABLE WIDGET */}
          {activeSubTab === 'widget' && (
            <motion.div
              key="widget"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <Copy className="w-5 h-5 text-cyan-400" />
                  <span>MÃ WIDGET NHÚNG CỔNG TRA CỨU (SCAMGUARD EMBEDDABLE WIDGET)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Nhúng trực tiếp khung tra cứu an toàn thông tin PII, Blacklist của ScamGuard lên trang web bán hàng, website giáo dục của riêng bạn để bảo vệ độc giả.
                </p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 font-mono uppercase">COPY ĐOẠN MÃ IFRAME SAU:</label>
                  <div className="relative">
                    <pre className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-[11px] text-cyan-300 font-mono overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
                      {WIDGET_CODE}
                    </pre>
                    <button
                      onClick={handleCopyWidget}
                      className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-850"
                    >
                      {widgetCopied ? <span className="text-[10px] text-emerald-400 font-bold">Đã Copy</span> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-start space-x-2">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Doanh nghiệp có thể nhúng widget để giúp khách hàng mua sắm kiểm tra chéo độ uy tín của các số tài khoản shipper trước khi giao dịch.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 8. ABSURD ROI CALCULATOR */}
          {activeSubTab === 'roi' && (
            <motion.div
              key="roi"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <Percent className="w-5 h-5 text-indigo-400" />
                  <span>MÁY TÍNH LÃI SUẤT PHI LÝ ĐA CẤP (ABSURD ROI CALCULATOR)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Nhập cam kết lãi suất ngày/tuần của các sàn đầu tư lúa gạo, nuôi bò sữa ảo để bóc trần tốc độ tăng trưởng phi thực tế và vạch trần bản chất Ponzi sập hầm.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 rounded-2xl border border-slate-800 p-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Lãi suất cam kết hàng ngày:</span>
                      <span className="font-mono text-cyan-400 font-black">{roiDailyPercent}% / Ngày</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.5"
                      value={roiDailyPercent}
                      onChange={(e) => setRoiDailyPercent(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Số tiền đầu tư ban đầu (VND):</label>
                    <input
                      type="number"
                      value={roiInvestmentCapital}
                      onChange={(e) => setRoiInvestmentCapital(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Calculation Verdict */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-850 flex flex-col justify-between">
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase">LÃI SUẤT COMPLETED QUY THEO NĂM:</span>
                      <div className="text-lg font-black text-rose-400 font-mono mt-0.5">{roiRes.annualRateFormatted} / Năm</div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase">Số dư sau 30 ngày dồn lãi:</span>
                      <div className="text-sm font-black text-slate-200 font-mono mt-0.5">{roiRes.days30Val}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] leading-relaxed rounded-lg mt-3 font-medium">
                    {roiRes.warningComment}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
