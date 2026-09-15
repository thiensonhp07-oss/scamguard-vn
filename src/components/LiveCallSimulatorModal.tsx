import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Mic,
  ShieldCheck,
  AlertOctagon,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '../types';
import { playPhoneRingPattern, playSuccessChime, playAlertWarning, speakText, stopSpeaking } from '../utils/audioEffects';
import { handleAvatarError } from '../utils/avatarFallback';
import confetti from 'canvas-confetti';

interface LiveCallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onEarnXp: (amount: number) => void;
}

interface CallScenario {
  id: string;
  callerName: string;
  callerNumber: string;
  callerAvatar: string;
  agencyBadge: string;
  initialTranscript: string;
  threatLevel: 'RẤT NGUY HIỂM' | 'TRUNG BÌNH';
  tactics: string[];
  options: {
    label: string;
    action: string;
    isSafe: boolean;
    feedback: string;
    earnedScore: number;
  }[];
  forensicAnalysis: {
    aiVoiceModel: string;
    deepfakeClues: string[];
    safeRule: string;
  };
}

const CALL_SCENARIOS: CallScenario[] = [
  {
    id: 'call_police_fake',
    callerName: 'Đại Úy Hoàng Minh - Cục CSĐT Tội Phạm',
    callerNumber: '+84 (024) 3825 xxxx (Số rác mạo danh)',
    callerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    agencyBadge: '👮 CẢNH SÁT ĐIỀU TRA GIẢ MẠO',
    initialTranscript:
      'Alo! Tôi là Đại úy Hoàng Minh, Cục Cảnh sát Điều tra Bộ Công An. Chúng tôi phát hiện số CCCD của anh/chị liên quan trực tiếp đến đường dây rửa tiền xuyên quốc gia 38 tỷ đồng. Lệnh bắt tạm giam đã được Viện Kiểm Sát phê chuẩn. Anh/chị phải giữ tuyệt đối bí mật, không được nói với người thân và chuyển toàn bộ tiền trong tài khoản vào tài khoản tạm giữ thanh tra để chứng minh trong sạch!',
    threatLevel: 'RẤT NGUY HIỂM',
    tactics: ['Mạo danh công an', 'Tâm lý hoảng sợ', 'Đe dọa bắt giam', 'Cô lập nạn nhân'],
    options: [
      {
        label: 'Cúp máy ngay lập tức, khẳng định Công An không làm việc qua điện thoại và liên hệ Công An Phường',
        action: 'hangup_verify',
        isSafe: true,
        feedback: 'Xử lý xuất sắc! Tuyệt đối không hoang mang. Công an Việt Nam KHÔNG BAO GIỜ làm việc, điều tra hoặc yêu cầu chuyển tiền qua điện thoại.',
        earnedScore: 100,
      },
      {
        label: 'Hỏi xin số tài khoản tạm giữ của cán bộ để chuyển 10 triệu trước chứng minh trong sạch',
        action: 'transfer_bribe',
        isSafe: false,
        feedback: 'Rất nguy hiểm! Đây là tài khoản rác của kẻ lừa đảo. Bạn sẽ bị mất trắng tiền và tiếp tục bị tống tiền.',
        earnedScore: 0,
      },
      {
        label: 'Hỏi tên lãnh đạo công an và yêu cầu gửi giấy triệu tập hợp pháp về địa chỉ cư trú',
        action: 'demand_summons',
        isSafe: true,
        feedback: 'Rất chuẩn mực! Mọi yêu cầu làm việc đều phải có giấy mời/giấy triệu tập chính thức gửi về địa phương.',
        earnedScore: 90,
      },
      {
        label: 'Đọc mã OTP ngân hàng để cán bộ kiểm tra dòng tiền từ xa',
        action: 'give_otp',
        isSafe: false,
        feedback: 'Mất toàn bộ tiền! Kẻ xấu sẽ đăng nhập app ngân hàng của bạn và vét sạch tài khoản.',
        earnedScore: 0,
      },
    ],
    forensicAnalysis: {
      aiVoiceModel: 'Voice Cloning VALL-E / ElevenLabs mô phỏng giọng đanh thép miền Bắc',
      deepfakeClues: [
        'Giọng nói có tiếng ồn nền phòng thu nhân tạo (fake background office noise)',
        'Yêu cầu giữ bí mật tuyệt đối với người thân trong nhà',
        'Tạo áp lực thời gian: "trong vòng 30 phút phải chuyển tiền"',
      ],
      safeRule: 'Quy tắc 3 KHÔNG: Không nghe - Không làm theo - Không chuyển tiền/OTP cho bất kỳ ai qua điện thoại.',
    },
  },
  {
    id: 'call_family_kidnap',
    callerName: 'Giọng con gái khóc nức nở / Bác sĩ cấp cứu',
    callerNumber: '+84 (0912) xxx xxx',
    callerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face',
    agencyBadge: '🚨 BẪY CẤP CỨU / BẮT CÓC GIẢ MẠO',
    initialTranscript:
      'Bố ơi... mẹ ơi cứu con với... con bị tai nạn giao thông xe tải đâm đang cấp cứu ở Bệnh viện Chợ Rẫy, bác sĩ bảo phải nộp 20 triệu tiền viện phí mổ gấp ngay trong 10 phút mới giữ được tính mạng, bố chuyển vào số tài khoản viện trưởng này giúp con với...',
    threatLevel: 'RẤT NGUY HIỂM',
    tactics: ['Đánh vào tình mẫu tử', 'Tiếng khóc giả mạo', 'Khẩn cấp đếm ngược'],
    options: [
      {
        label: 'Hỏi câu hỏi bảo mật gia đình đã thống nhất từ trước (hoặc hỏi tên thú cưng / chi tiết bí mật)',
        action: 'ask_secret_word',
        isSafe: true,
        feedback: 'Chiến thuật phòng thủ đỉnh cao! Kẻ gian dùng AI clone giọng không thể trả lời mật khẩu gia đình.',
        earnedScore: 100,
      },
      {
        label: 'Cúp máy, lấy máy khác gọi trực tiếp cho con gái hoặc gọi điện cho thầy cô/đồng nghiệp con để kiểm tra',
        action: 'call_alternative',
        isSafe: true,
        feedback: 'Chính xác! Luôn xác minh qua kênh liên lạc độc lập trước khi tin vào bất kỳ tin tức tai nạn nào.',
        earnedScore: 100,
      },
      {
        label: 'Hoảng sợ chuyển ngay 20 triệu vào số tài khoản lạ được cung cấp',
        action: 'panic_transfer',
        isSafe: false,
        feedback: 'Rơi vào bẫy tâm lý! Kẻ gian lợi dụng sự hoảng loạn của phụ huynh để chiếm đoạt tài sản.',
        earnedScore: 0,
      },
    ],
    forensicAnalysis: {
      aiVoiceModel: 'AI Voice Cloning trích xuất từ 3 giây video TikTok/Facebook của con',
      deepfakeClues: [
        'Tiếng khóc bị rè méo ở tần số cao, ngắt nhịp bất thường',
        'Số tài khoản nhận tiền mang tên cá nhân lạ, không phải Bệnh Viện',
        'Thúc giục chuyển tiền nhanh để không cho phụ huynh kịp suy nghĩ',
      ],
      safeRule: 'Thiết lập MẬT KHẨU GIA ĐÌNH riêng biệt giữa cha mẹ và con cái để xác thực trong tình huống khẩn cấp.',
    },
  },
  {
    id: 'call_etax_fake',
    callerName: 'Cán Bộ Cục Thuế TP.HCM (Mạo Danh)',
    callerNumber: '+84 (028) 3930 xxxx',
    callerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    agencyBadge: '🏛️ GIẢ MẠO CÁN BỘ THUẾ ETAX MOBILE',
    initialTranscript:
      'Chào anh/chị, tôi là cán bộ Chi cục Thuế. Hồ sơ thuế cá nhân của anh/chị bị lệch chuẩn mã định danh 0.2%, nếu không kê khai bổ sung qua ứng dụng eTax Mobile phiên bản mới trong hôm nay sẽ bị khóa mã số thuế và phạt hành chính 15 triệu. Tôi gửi link zalo Tải app eTax_Mobile_v2.apk, anh/chị bấm cài đặt ngay nhé!',
    threatLevel: 'RẤT NGUY HIỂM',
    tactics: ['Mạo danh cán bộ thuế', 'Ép cài file APK độc hại', 'Đe dọa phạt tiền'],
    options: [
      {
        label: 'Cúp máy ngay, tự vào Google Play / App Store tìm eTax Mobile chính thức hoặc ra trực tiếp Chi cục Thuế',
        action: 'app_store_only',
        isSafe: true,
        feedback: 'Tuyệt đối chính xác! Ngành thuế KHÔNG BAO GIỜ gửi đường link APK qua Zalo/SMS hoặc yêu cầu cài phần mềm ngoài App Store.',
        earnedScore: 100,
      },
      {
        label: 'Tải tệp eTax_Mobile_v2.apk từ Zalo và cấp quyền Accessibility (Truy cập màn hình)',
        action: 'install_apk',
        isSafe: false,
        feedback: 'Thảm họa bảo mật! Tệp APK độc hại này sẽ âm thầm đọc tin nhắn OTP và chiếm quyền điều khiển tài khoản ngân hàng của bạn.',
        earnedScore: 0,
      },
      {
        label: 'Yêu cầu Cán bộ Thuế đọc mã căn cước công dân và gửi giấy báo nộp thuế bằng văn bản về địa chỉ',
        action: 'request_tax_document',
        isSafe: true,
        feedback: 'Rất cảnh giác! Cơ quan thuế làm việc bằng văn bản thông báo chính thức có dấu đỏ.',
        earnedScore: 90,
      },
    ],
    forensicAnalysis: {
      aiVoiceModel: 'AI Voice Synthesis tổng hợp giọng nữ miền Nam nhẹ nhàng truyền cảm',
      deepfakeClues: [
        'Ép cài đặt ứng dụng qua tệp APK gửi ngoài CH Play/App Store',
        'Yêu cầu cấp quyền Accessibility / Đọc thông báo trên điện thoại',
        'Sử dụng thuật ngữ "đồng bộ mã số thuế" gây hoang mang',
      ],
      safeRule: 'Chỉ cài đặt ứng dụng chính chủ từ Google Play Store và App Store. Không mở tệp có đuôi .APK.',
    },
  },
];

export const LiveCallSimulatorModal: React.FC<LiveCallSimulatorModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onEarnXp,
}) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [callState, setCallState] = useState<'incoming' | 'connected' | 'completed'>('incoming');
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const scenario = CALL_SCENARIOS[currentScenarioIndex];

  // Reset on open or scenario change & clean up voice on close/unmount
  useEffect(() => {
    if (isOpen) {
      setCallState('incoming');
      setSelectedChoiceIndex(null);
      setCallDuration(0);
    }
    return () => {
      stopSpeaking();
    };
  }, [isOpen, currentScenarioIndex]);

  // Ringing audio interval
  useEffect(() => {
    if (!isOpen || callState !== 'incoming') return;

    playPhoneRingPattern();
    const ringInterval = setInterval(() => {
      playPhoneRingPattern();
    }, 2000);

    return () => clearInterval(ringInterval);
  }, [isOpen, callState]);

  // Call timer
  useEffect(() => {
    if (callState !== 'connected') return;
    const timer = setInterval(() => setCallDuration((c) => c + 1), 1000);
    return () => clearInterval(timer);
  }, [callState]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    stopSpeaking();
    onClose();
  };

  const handleAnswerCall = () => {
    setCallState('connected');
    playSuccessChime();
    speakText(scenario.initialTranscript);
  };

  const handleDeclineCall = () => {
    stopSpeaking();
    setCallState('completed');
    setSelectedChoiceIndex(0); // Safe choice by default
    playSuccessChime();
    onEarnXp(80);
  };

  const handleChooseAction = (idx: number) => {
    stopSpeaking();
    setSelectedChoiceIndex(idx);
    setCallState('completed');
    const opt = scenario.options[idx];
    if (opt.isSafe) {
      playSuccessChime();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
      });
      onEarnXp(opt.earnedScore);
    } else {
      playAlertWarning();
    }
  };

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="live-call-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        id="live-call-modal-container"
        className="bg-slate-900 border-2 border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto flex flex-col relative"
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STATE 1: INCOMING CALL */}
        {callState === 'incoming' && (
          <div className="p-8 text-center space-y-8 py-10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            <div className="space-y-3">
              <span className="px-3 py-1 text-[11px] font-black uppercase tracking-widest bg-rose-950 text-rose-300 border border-rose-800 rounded-full animate-pulse">
                CUỘC GỌI ĐẾN ĐÁNG NGỜ
              </span>
              <div className="relative inline-block mt-4">
                <img
                  src={scenario.callerAvatar}
                  alt={scenario.callerName}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleAvatarError(e, scenario.callerName)}
                  className="w-24 h-24 rounded-full object-cover border-4 border-rose-500 shadow-2xl mx-auto animate-bounce-subtle"
                />
                <span className="absolute bottom-0 right-0 p-1.5 bg-rose-600 rounded-full text-white">
                  <PhoneCall className="w-4 h-4 animate-spin" />
                </span>
              </div>
              <h3 className="text-xl font-black text-white">{scenario.callerName}</h3>
              <p className="text-xs font-mono text-slate-400">{scenario.callerNumber}</p>
              <span className="text-xs font-bold text-amber-400 block">{scenario.agencyBadge}</span>
            </div>

            {/* Pulsing Answer/Decline buttons */}
            <div className="flex items-center justify-center gap-10 pt-4">
              <div className="text-center space-y-2">
                <button
                  onClick={handleDeclineCall}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 cursor-pointer transition-transform hover:scale-110"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <span className="text-xs font-bold text-slate-400 block">Từ Chối</span>
              </div>

              <div className="text-center space-y-2">
                <button
                  onClick={handleAnswerCall}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 cursor-pointer transition-transform hover:scale-110 animate-pulse"
                >
                  <Phone className="w-7 h-7" />
                </button>
                <span className="text-xs font-bold text-emerald-400 block">Nhấc Máy (Thử Thách)</span>
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: CALL CONNECTED & REAL-TIME TACTICS */}
        {callState === 'connected' && (
          <div className="p-6 space-y-6">
            {/* Header Call info */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={scenario.callerAvatar}
                  alt={scenario.callerName}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleAvatarError(e, scenario.callerName)}
                  className="w-11 h-11 rounded-full object-cover border-2 border-rose-500"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{scenario.callerName}</h4>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Đang gọi • {formatSeconds(callDuration)}
                  </span>
                </div>
              </div>

              {/* Sound visualizer wave */}
              <div className="flex items-center space-x-1">
                <span className="w-1 h-4 bg-rose-500 rounded-full animate-pulse" />
                <span className="w-1 h-7 bg-amber-500 rounded-full animate-pulse" />
                <span className="w-1 h-5 bg-cyan-500 rounded-full animate-pulse" />
                <span className="w-1 h-8 bg-rose-500 rounded-full animate-pulse" />
                <span className="w-1 h-3 bg-amber-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Live Audio Transcript & Voice TTS */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>Lời thoại cuộc gọi Deepfake (AI Voice):</span>
                </div>
                <button
                  onClick={() => speakText(scenario.initialTranscript)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold border border-rose-500/40 cursor-pointer flex items-center space-x-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Phát Giọng AI</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                "{scenario.initialTranscript}"
              </p>
            </div>

            {/* Real-time Psychological Pressure Gauge */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-amber-400 flex items-center space-x-1.5">
                  <AlertOctagon className="w-4 h-4" />
                  <span>PHÂN TÍCH ÁP LỰC TÂM LÝ THEO THỜI GIAN THỰC (REAL-TIME PSYCHOMETRICS):</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">
                  CỰC KỲ CĂNG THẲNG (88%)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Tạo Khẩn Cấp (Urgency):</span>
                  <span className="font-extrabold text-rose-400">92%</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Đe Dọa Pháp Lý (Fear):</span>
                  <span className="font-extrabold text-amber-400">95%</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Cô Lập Nạn Nhân:</span>
                  <span className="font-extrabold text-cyan-400">88%</span>
                </div>
              </div>

              <p className="text-[11px] text-amber-200/90 italic bg-amber-950/30 p-2 rounded-lg border border-amber-800/30">
                💡 <strong>CyberGuard Nhắc Nhở:</strong> Kẻ gian đang dồn ép thời gian đe dọa bắt giam để làm bạn hoảng loạn. Hãy hít thở sâu 5 giây và giữ bình tĩnh!
              </p>
            </div>

            {/* 4 Defensive Response Choices */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Phản Ứng Tác Chiến Của Bạn:
              </span>
              {scenario.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChooseAction(idx)}
                  className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500 text-xs sm:text-sm text-slate-200 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STATE 3: FORENSIC POST-CALL DEBRIEF */}
        {callState === 'completed' && selectedChoiceIndex !== null && (
          <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh] animate-scale-up">
            {(() => {
              const opt = scenario.options[selectedChoiceIndex];
              return (
                <>
                  <div className="text-center space-y-2">
                    <div
                      className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl ${
                        opt.isSafe
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                          : 'bg-rose-950 text-rose-400 border border-rose-700'
                      }`}
                    >
                      {opt.isSafe ? '🛡️' : '⚠️'}
                    </div>
                    <span
                      className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                        opt.isSafe
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {opt.isSafe ? 'XỬ LÝ AN TOÀN TUYỆT ĐỐI' : 'CẢNH BÁO NGUY HIỂM'}
                    </span>
                    <h3 className="text-lg font-black text-white">{opt.feedback}</h3>
                  </div>

                  {/* Forensic Deepfake Clues */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                      <FileText className="w-4 h-4" />
                      <span>BÁO CÁO PHÁP Y GIỌNG NÓI DEEPFAKE</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 block font-semibold">Mô hình AI nhận dạng:</span>
                      <p className="text-slate-200 font-mono bg-slate-900 p-2 rounded-lg border border-slate-800">
                        {scenario.forensicAnalysis.aiVoiceModel}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 block font-semibold">Dấu vết nhận diện lừa đảo:</span>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                        {scenario.forensicAnalysis.deepfakeClues.map((clue, i) => (
                          <li key={i}>{clue}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-200 font-medium">
                      🔑 <strong>Khuyến nghị an toàn:</strong> {scenario.forensicAnalysis.safeRule}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setCurrentScenarioIndex((prev) => (prev + 1) % CALL_SCENARIOS.length);
                        setCallState('incoming');
                        setSelectedChoiceIndex(null);
                      }}
                      className="flex-1 btn-tactile btn-tactile-slate py-3 text-xs font-bold flex items-center justify-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Thử Tình Huống Khác</span>
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 btn-tactile btn-tactile-cyan py-3 text-xs font-bold cursor-pointer"
                    >
                      Hoàn Tất & Đóng
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
