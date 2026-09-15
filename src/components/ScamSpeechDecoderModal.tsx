import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Brain,
  AlertTriangle,
  Shield,
  Sparkles,
  CheckCircle2,
  Copy,
  Zap,
  MessageSquare,
  Lock,
  PhoneCall,
  RotateCcw,
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/audioEffects';

interface ScamSpeechDecoderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergency?: () => void;
}

interface ScriptPreset {
  id: string;
  title: string;
  category: string;
  transcript: string;
  scamScore: number;
  tactics: {
    urgency: number; // 0-100
    panic: number;
    greed: number;
    authority: number;
    isolation: number;
  };
  keyRedFlags: string[];
  counterScript: string;
  recommendedAction: string;
}

const PRESET_SCRIPTS: ScriptPreset[] = [
  {
    id: 'police_investigation',
    title: 'Giả Danh Công An Điều Trả Rửa Tiền',
    category: 'Mạo Danh Cơ Quan Pháp Luật',
    transcript:
      'A lô! Tôi là Đại úy Nguyễn Văn Hùng thuộc Phòng Cảnh sát Điều tra C02 Bộ Công An. Số căn cước công dân của anh đang liên quan đến đường dây rửa tiền quốc tế 12 tỷ đồng. Anh phải tuyệt đối giữ bí mật, không được nói cho người thân. Bây giờ chuyển toàn bộ tiền vào Tài khoản Niêm phong của Bộ Công an tại ngân hàng VietinBank để giám định!',
    scamScore: 99,
    tactics: {
      urgency: 95,
      panic: 98,
      greed: 10,
      authority: 99,
      isolation: 95,
    },
    keyRedFlags: [
      'Công an KHÔNG BAO GIỜ làm việc hay tống đạt lệnh qua điện thoại/Zalo',
      'Yêu cầu chuyển tiền vào "Tài khoản niêm phong cá nhân"',
      'Ép buộc giữ bí mật với gia đình (chiêu bài cách ly thông tin)',
    ],
    counterScript:
      'Cảm ơn đồng chí Đại úy. Tôi đang ghi âm cuộc gọi này. Xin vui lòng gửi Giấy mời làm việc có dấu đỏ về Trụ sở Công an Phường địa phương tôi, tôi sẽ ra trực tiếp đối chứng.',
    recommendedAction: 'Cúp máy ngay lập tức, chặn số điện thoại và báo động cho người thân.',
  },
  {
    id: 'etax_mobile_apk',
    title: 'Giả Danh Cán Bộ Thuế Ép Cài File APK',
    category: 'Mã Độc Chiếm Quyền Điện Thoại',
    transcript:
      'Chào anh, tôi là Cán bộ Chi cục Thuế TP.HCM. Hồ sơ thuế của anh bị lệch chuẩn định danh 0.2%. Nếu không kê khai bổ sung qua eTax Mobile v2 trong hôm nay sẽ bị khóa mã số thuế và phạt 15 triệu. Anh kết bạn Zalo tôi gửi đường link tải tệp eTax_Mobile_v2.apk để cài đặt và cấp quyền Accessibility nhé!',
    scamScore: 98,
    tactics: {
      urgency: 92,
      panic: 88,
      greed: 15,
      authority: 95,
      isolation: 70,
    },
    keyRedFlags: [
      'Cơ quan Thuế KHÔNG gửi đường dẫn APK qua Zalo hoặc mạng xã hội',
      'Dùng thuật ngữ "đồng bộ định danh 0.2%" gây hoang mang',
      'Ép cấp quyền Accessibility (Cho phép đọc màn hình và tự động chuyển tiền)',
    ],
    counterScript:
      'Cơ quan Thuế làm việc qua văn bản hành chính chính thức. Tôi sẽ tự tải app eTax Mobile trên Google Play Store / App Store để tự kiểm tra.',
    recommendedAction: 'Không bấm vào link, không cài file .APK ngoài App Store.',
  },
  {
    id: 'tiktok_job_task',
    title: 'Tuyển CTV Làm Nhiệm Vụ Xem Video TikTok',
    category: 'Lừa Đảo Bẫy Nhiệm Vụ Nạp Tiền',
    transcript:
      'Xin chào! Công ty Truyền thông Media tuyển CTV làm việc tại nhà, công việc chỉ cần thả tim video TikTok nhận 30.000đ/video. Sau khi hoàn thành 3 bài test đầu nhận 90k, chị chuyển nạp 500k vào quỹ điểm để nâng cấp Thẻ VIP nhận hoa hồng 40% hàng ngày nhé!',
    scamScore: 96,
    tactics: {
      urgency: 80,
      panic: 10,
      greed: 95,
      authority: 60,
      isolation: 80,
    },
    keyRedFlags: [
      'Việc nhẹ lương cao (thả tim video nhận tiền khủng)',
      'Thả mồi nhử cho ăn tiền nhỏ vài chục nghìn ban đầu',
      'Ép nạp tiền vào quỹ / sàn lạ để "rút vốn"',
    ],
    counterScript:
      'Tôi không có nhu cầu làm việc nạp tiền chiết khấu. Vui lòng xóa thông tin của tôi khỏi danh sách.',
    recommendedAction: 'Ngừng nhắn tin, chặn tài khoản Telegram/Zalo tuyển dụng ngay.',
  },
  {
    id: 'family_accident_hospital',
    title: 'Con Cấp Cứu Bệnh Viện Cần Chuyển Tiền Khẩn',
    category: 'Lừa Đảo Báo Động Gia Đình',
    transcript:
      'Chị ơi! Con trai chị là cháu Minh đang đi học thì bị ngã gãy xương đùi mất máu cấp cứu tại Bệnh viện Chợ Rẫy! Bác sĩ yêu cầu nộp ngay 30 triệu tiền viện phí gấp để mổ trong 15 phút nữa, chị chuyển tiền vào số tài khoản của Y tá viện này ngay!',
    scamScore: 99,
    tactics: {
      urgency: 99,
      panic: 99,
      greed: 0,
      authority: 85,
      isolation: 90,
    },
    keyRedFlags: [
      'Đánh trực diện vào tình cảm gia đình gây hoảng loạn mất bình tĩnh',
      'Thúc ép chuyển tiền gấp trong 10-15 phút',
      'Số tài khoản thụ hưởng là tài khoản cá nhân thay vì tài khoản viện phí chính thức',
    ],
    counterScript:
      'Vui lòng giữ máy, tôi sẽ gọi điện trực tiếp cho Giáo viên chủ nhiệm và Hotline Bệnh viện để xác nhận vị trí phòng cấp cứu của con.',
    recommendedAction: 'Giữ bình tĩnh, lập tức gọi điện thoại cho giáo viên chủ nhiệm hoặc con.',
  },
];

export const ScamSpeechDecoderModal: React.FC<ScamSpeechDecoderModalProps> = ({
  isOpen,
  onClose,
  onOpenEmergency,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ScriptPreset>(PRESET_SCRIPTS[0]);
  const [customInput, setCustomInput] = useState<string>('');
  const [analyzedResult, setAnalyzedResult] = useState<ScriptPreset | null>(PRESET_SCRIPTS[0]);
  const [copiedCounter, setCopiedCounter] = useState(false);

  // Clean up synthetic speech on close or unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    stopSpeaking();
    onClose();
  };

  const handleSelectPreset = (preset: ScriptPreset) => {
    stopSpeaking();
    setSelectedPreset(preset);
    setCustomInput('');
    setAnalyzedResult(preset);
  };

  const handleRunCustomAnalysis = () => {
    if (!customInput.trim()) return;

    const lower = customInput.toLowerCase();
    let score = 75;
    let urg = 70;
    let pan = 60;
    let grd = 40;
    let aut = 50;
    let iso = 60;

    if (lower.includes('công an') || lower.includes('viện kiểm sát') || lower.includes('bộ công an')) {
      aut += 35;
      pan += 30;
      score += 15;
    }
    if (lower.includes('chuyển tiền') || lower.includes('nạp tiền') || lower.includes('tài khoản')) {
      urg += 20;
      score += 10;
    }
    if (lower.includes('apk') || lower.includes('link') || lower.includes('zalo')) {
      score += 10;
    }
    if (lower.includes('giữ bí mật') || lower.includes('không nói cho ai')) {
      iso += 35;
      score += 10;
    }

    const newResult: ScriptPreset = {
      id: 'custom_analysis',
      title: 'Kịch Bản Phân Tích Tùy Chỉnh',
      category: 'Phân Tích Bằng Thuật Toán CyberGuard AI',
      transcript: customInput,
      scamScore: Math.min(99, score),
      tactics: {
        urgency: Math.min(99, urg),
        panic: Math.min(99, pan),
        greed: Math.min(99, grd),
        authority: Math.min(99, aut),
        isolation: Math.min(99, iso),
      },
      keyRedFlags: [
        'Xuất hiện từ khóa dồn ép thời gian và chuyển tiền vào tài khoản lạ',
        'Có dấu hiệu sử dụng thủ đoạn tác động tâm lý gây hoảng loạn',
        'Cần xác minh độc lập qua đường dây nóng chính thức',
      ],
      counterScript:
        'Tôi đã ghi âm đoạn hội thoại này và gửi đến Cục An toàn thông tin. Vui lòng gửi văn bản làm việc chính thức.',
      recommendedAction: 'Cúp máy/dừng nhắn tin lập tức và báo động người thân.',
    };

    setAnalyzedResult(newResult);
  };

  const handleCopyCounterScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCounter(true);
    setTimeout(() => setCopiedCounter(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl w-full max-w-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg flex-shrink-0">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black uppercase tracking-wider">
                PRO SPEECH & SCRIPT DECODER
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Bóc Tách Kịch Bản & Phân Tích Tâm Lý Lừa Đảo
            </h2>
          </div>
        </div>

        {/* Presets Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Chọn kịch bản lừa đảo mẫu phổ biến:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_SCRIPTS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id && !customInput;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <p className="text-xs font-black flex items-center justify-between">
                    <span>{preset.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {preset.scamScore}% Scam
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{preset.category}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Option */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-slate-300 block">
            Hoặc dán đoạn hội thoại/tin nhắn nghi vấn của bạn vào đây:
          </label>
          <textarea
            rows={3}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ví dụ: 'A lô! Tôi là cán bộ Viện kiểm sát thông báo tài khoản ông đang bị niêm phong...'"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {customInput.trim() && (
            <button
              onClick={handleRunCustomAnalysis}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>CHẠY BÓC TÁCH KỊCH BẢN NÀY (CYBERGUARD AI)</span>
            </button>
          )}
        </div>

        {/* Analysis Output Results */}
        {analyzedResult && (
          <div className="p-5 bg-slate-950/90 rounded-2xl border-2 border-indigo-500/60 space-y-5 shadow-2xl">
            {/* Header Result */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                  KẾT QUẢ PHÂN TÍCH CHỈ SỐ LỪA ĐẢO
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">{analyzedResult.title}</h3>
              </div>
              <div className="p-2.5 px-4 rounded-2xl bg-rose-950 border border-rose-500/80 text-center">
                <span className="text-[10px] text-rose-300 uppercase font-black block">
                  ĐIỂM NGUY HẠI LỪA ĐẢO
                </span>
                <span className="text-xl font-black text-rose-400">{analyzedResult.scamScore}%</span>
              </div>
            </div>

            {/* Transcript & TTS */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Nội dung kịch bản lừa đảo:</span>
                <button
                  onClick={() => speakText(analyzedResult.transcript)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-bold border border-indigo-500/40 cursor-pointer flex items-center space-x-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Phát Giọng Đọc AI</span>
                </button>
              </div>
              <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
                "{analyzedResult.transcript}"
              </p>
            </div>

            {/* 5 Psychological Meters */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-indigo-300 block">
                🧠 5 Đòn Tác Động Tâm Lý Được Bóc Tách:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Tạo Hoảng Loạn:</span>
                  <span className="font-black text-rose-400 text-sm">
                    {analyzedResult.tactics.panic}%
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Ép Thời Gian:</span>
                  <span className="font-black text-amber-400 text-sm">
                    {analyzedResult.tactics.urgency}%
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Mạo Danh Quyền Lực:</span>
                  <span className="font-black text-cyan-400 text-sm">
                    {analyzedResult.tactics.authority}%
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Cô Lập Nạn Nhân:</span>
                  <span className="font-black text-purple-400 text-sm">
                    {analyzedResult.tactics.isolation}%
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Lòng Tham Mồi Nhử:</span>
                  <span className="font-black text-emerald-400 text-sm">
                    {analyzedResult.tactics.greed}%
                  </span>
                </div>
              </div>
            </div>

            {/* CyberGuard Counter-Script */}
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-300 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>KỊCH BẢN PHẢN ĐÒN (CYBERGUARD COUNTER-SCRIPT):</span>
                </span>
                <button
                  onClick={() => handleCopyCounterScript(analyzedResult.counterScript)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[11px] hover:bg-emerald-400 cursor-pointer flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCounter ? 'Đã sao chép!' : 'Sao chép'}</span>
                </button>
              </div>
              <p className="text-xs text-emerald-100 font-bold bg-slate-950/80 p-3 rounded-xl border border-emerald-800/60">
                "{analyzedResult.counterScript}"
              </p>
              <p className="text-[11px] text-emerald-300/80 italic">
                💡 Nói câu này khi nghe điện thoại sẽ khiến kẻ gian lập tức tịt ngòi và cúp máy!
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            ĐÃ HIỂU KỊCH BẢN & ĐÓNG TÙY CHỌN
          </button>
          {onOpenEmergency && (
            <button
              onClick={() => {
                onClose();
                onOpenEmergency();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>BÁO KHẨN NGƯỜI THÂN (24/7)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
