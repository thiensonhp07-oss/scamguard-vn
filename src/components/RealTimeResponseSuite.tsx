import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Shield,
  FileText,
  UserCheck,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
  Lock,
  Cpu,
  Share2,
  RefreshCw,
  Video,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playRewardTrophy } from '../utils/audioEffects';

interface ScriptLine {
  id: number;
  speaker: 'Caller' | 'Coach';
  text: string;
  tactic?: string;
}

const CALL_SCENARIOS = {
  congan: {
    title: 'Giả danh Cơ quan CSĐT Công An Hà Nội',
    callerName: 'Đại úy Trần Văn Quyết',
    initialSpeech: 'Alô, đây có phải số của anh/chị? Chúng tôi phát hiện tài khoản ngân hàng của anh/chị liên quan đến vụ án rửa tiền xuyên quốc gia trị giá 12 tỷ đồng. Đề nghị anh/chị giữ máy để chuyển mạng bảo mật của Bộ Công An.',
    microTactics: [
      { text: '⏱️ Trì hoãn thời gian (Dùng lý do bận họp/lái xe)', reply: 'Tôi hiểu anh/chị bận, nhưng đây là lệnh khẩn từ VKSND tối cao. Nếu cúp máy, chúng tôi sẽ cưỡng chế áp giải sau 2 giờ nữa. (Đòn tâm lý áp đặt gấp gáp)', score: 95 },
      { text: '🎙️ Yêu cầu giấy tờ / Triệu tập bằng văn bản giấy', reply: 'Lệnh triệu tập đã được niêm phong, gửi về chính quyền địa phương. Nhưng để kịp thời hỗ trợ đóng băng tài khoản cứu hộ, anh/chị phải phối hợp khai báo mã số bảo mật ngay lập tức trên điện thoại.', score: 90 },
      { text: '❌ Tuyệt đối không đọc OTP / Không cài app lạ', reply: 'Nếu anh/chị không tự hợp tác kích hoạt ứng dụng VNeID định danh thứ cấp để quét sinh trắc học, chúng tôi buộc phải đình chỉ mọi giao dịch ngân hàng của anh/chị.', score: 100 }
    ]
  },
  viethan: {
    title: 'Giả danh Cục Viễn thông khóa đầu số điện thoại',
    callerName: 'Tổng đài viên số 408',
    initialSpeech: 'Cục Viễn thông xin thông báo: Thuê bao của quý khách sẽ bị khóa sau 2 giờ vì chưa chuẩn hóa sinh trắc học và bị phát hiện phát tán tin nhắn rác. Vui lòng bấm phím 9 để gặp điện thoại viên giải quyết.',
    microTactics: [
      { text: '⏱️ Trì hoãn thời gian & Tự cúp máy chủ động', reply: 'Quý khách cúp máy sẽ mất quyền tự giải trình trực tuyến và thuê bao bị hủy vĩnh viễn trên kho số quốc gia.', score: 95 },
      { text: '📞 Gọi lên hotline 18001091 (Nhà mạng thật)', reply: 'Hotline nhà mạng đang bảo trì hệ thống chuẩn hóa. Chỉ có tổng đài viên phòng hỗ trợ đặc biệt này mới có thể mở khóa nóng cho số của quý khách.', score: 100 },
      { text: '💳 Không cung cấp số CMND/CCCD qua điện thoại', reply: 'Nếu không đọc số CCCD để đối chiếu trên hệ thống cơ sở dữ liệu quốc gia, chúng tôi không thể giúp quý khách xác minh chủ sở hữu hợp pháp.', score: 95 }
    ]
  }
};

export const RealTimeResponseSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sos' | 'coaching'>('sos');

  // 1. One-tap SOS States
  const [sosActive, setSosActive] = useState(false);
  const [sosXpEarned, setSosXpEarned] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportDoc, setReportDoc] = useState<any | null>(null);

  // 2. Call Coaching States
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<'congan' | 'viethan'>('congan');
  const [coachingActive, setCoachingActive] = useState(false);
  const [callerDialogue, setCallerDialogue] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [performanceScore, setPerformanceScore] = useState<number | null>(null);

  // Trigger SOS Broadcast
  const handleTriggerSOS = () => {
    setSosActive(true);
    playSuccessChime();

    // Trigger fake coordinates dispatch
    setTimeout(() => {
      setSosXpEarned(true);
      playRewardTrophy();
    }, 1500);
  };

  // Generate Forensic PDF Report
  const handleGeneratePDF = () => {
    setGeneratingReport(true);
    setReportDoc(null);

    setTimeout(() => {
      const randomHex = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
      setReportDoc({
        docId: `FORENSIC-SOS-${randomHex}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        gps: '10.762622, 106.660172 (Quận 10, TP. Hồ Chí Minh)',
        threatType: 'Banking Impersonation Phishing via SMS & Phone Call',
        evidenceSnippet: 'Đoạn tin nhắn dọa bắt tạm giam chuyển khoản, URL: vietcombank-verify-vcb.cc',
        safetyContactsAlerted: ['Con cả (Nam) - SĐT: 0912***345', 'Công an Phường Bến Thành - Hotline trực ban'],
        digitalSignature: 'SCAMGUARD VN AUTOMATED FORENSICS CO., LTD',
        verificationStatus: 'SIGNED_AND_STAMPED_SECURE'
      });
      setGeneratingReport(false);
      playSuccessChime();
    }, 1500);
  };

  // Start Call Coaching Simulation
  const handleStartCoaching = (key: 'congan' | 'viethan') => {
    setSelectedScenarioKey(key);
    setCoachingActive(true);
    setCallerDialogue(CALL_SCENARIOS[key].initialSpeech);
    setFeedbackMsg('');
    setPerformanceScore(null);
    playSuccessChime();
  };

  // Click on coaching tactic response
  const handleSelectCoachingTactic = (tacticText: string, reply: string, score: number) => {
    setCallerDialogue(reply);
    setFeedbackMsg(`Phản xạ của bạn: "${tacticText}".`);
    setPerformanceScore(score);
    playRewardTrophy();
  };

  const scenario = CALL_SCENARIOS[selectedScenarioKey];

  return (
    <div className="space-y-6">
      {/* Tab select header */}
      <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'sos', label: '🚨 One-Tap SOS Broadcast', icon: AlertTriangle },
          { id: 'coaching', label: '📞 Live Call Coaching Overlay', icon: PhoneCall }
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
        {activeTab === 'sos' && (
          <motion.div
            key="sos"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>ONE-TAP SOS BROADCAST (KÍCH HOẠT BÁO ĐỘNG KHẨN CẤP)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Khi nhận biết mình đang nằm trong vòng xoáy thao túng tâm lý dọa nạt chuyển tiền của kẻ gian. Hãy kích hoạt ngay SOS để gửi định vị, khóa máy tạm thời từ xa, nhắn tin cho người bảo hộ, và lập tức xuất báo cáo giám định pháp lý có dấu đỏ để gửi Cơ Quan Công An.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Massive Panic Button */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Nhấn giữ để kích hoạt báo động khẩn:</p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTriggerSOS}
                  className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 text-white shadow-2xl relative cursor-pointer ${
                    sosActive
                      ? 'bg-emerald-600 border-emerald-400 shadow-emerald-500/20'
                      : 'bg-red-600 border-red-400 shadow-red-500/30 animate-heartbeat'
                  }`}
                >
                  <AlertTriangle className="w-10 h-10 text-white animate-bounce-subtle" />
                  <span className="text-xs font-black uppercase tracking-widest mt-2 font-mono">
                    {sosActive ? 'ĐÃ PHÁT SOS' : 'KÍCH HOẠT SOS'}
                  </span>
                </motion.button>

                <p className="text-[10px] text-slate-400 font-mono text-center">
                  {sosActive 
                    ? '✓ Hệ thống đã khóa kênh nộp tiền ngầm, SMS khẩn cấp đã được gửi đến danh bạ liên hệ tin cậy.'
                    : 'Hệ thống tự động lưu vị trí GPS và thiết lập rào chắn bảo mật đóng băng tài khoản.'}
                </p>
              </div>

              {/* PDF Document Summary Mockup */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">FORENSIC REPORT GENERATOR (PDF):</span>
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-black">
                    COMPLIANT TO NCSC
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Khi bạn gặp lừa đảo, ScamGuard cho phép bạn tự động tổng hợp toàn bộ mốc thời gian, bằng chứng text, ảnh chụp màn hình bill nghi vấn, định vị GPS để kết xuất tệp PDF có dấu mộc bảo mật của chúng tôi gửi trình báo công an phường lập tức.
                </p>

                {reportDoc ? (
                  <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã văn bản:</span>
                      <span className="text-cyan-400 font-bold">{reportDoc.docId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mốc thời gian:</span>
                      <span className="text-slate-200">{reportDoc.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Định vị SOS:</span>
                      <span className="text-slate-200 text-right truncate max-w-[200px]">{reportDoc.gps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Loại đe dọa:</span>
                      <span className="text-rose-300 font-bold text-right truncate max-w-[200px]">{reportDoc.threatType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Liên hệ cấp báo:</span>
                      <span className="text-slate-200 text-right truncate max-w-[200px]">{reportDoc.safetyContactsAlerted.join(', ')}</span>
                    </div>

                    <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-[10px] text-slate-400 flex justify-between items-center">
                      <span>Mộc chứng minh: <strong className="text-emerald-400">{reportDoc.verificationStatus}</strong></span>
                      <span className="text-slate-500">SIGN: SCAMGUARD.VN</span>
                    </div>

                    <button
                      onClick={() => alert('Đang kết xuất và tải tệp PDF: ' + reportDoc.docId + '.pdf')}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>XUẤT FILE PDF TRÌNH BÁO</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGeneratePDF}
                    disabled={generatingReport}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 border border-slate-800 cursor-pointer"
                  >
                    {generatingReport ? (
                      <>
                        <Cpu className="w-4 h-4 animate-spin" />
                        <span>KẾT XUẤT CHỨNG CỨ...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>TẠO BÁO CÁO PHÁP LÝ KHẨN CẤP</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'coaching' && (
          <motion.div
            key="coaching"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <PhoneCall className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>LIVE CALL COACHING OVERLAY (GIÁM SÁT & DIỄN TẬP ĐIỆN THOẠI)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lớp phủ hỗ trợ thời gian thực! Khi bạn nhận cuộc gọi nghi ngờ lừa đảo (Giả danh công an, cơ quan nhà nước, bưu điện). Kích hoạt kịch bản diễn tập để học phản xạ bẻ gãy đòn thao túng tâm lý cực kỳ hiệu quả.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Select scenario list */}
              <div className="space-y-3.5">
                <p className="text-xs font-black text-white font-mono uppercase tracking-wider text-slate-300">Chọn kịch bản diễn tập phản xạ:</p>
                
                <div className="space-y-2">
                  {Object.entries(CALL_SCENARIOS).map(([key, value]) => (
                    <div
                      key={key}
                      onClick={() => handleStartCoaching(key as any)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        coachingActive && selectedScenarioKey === key
                          ? 'bg-cyan-950/40 border-cyan-500'
                          : 'bg-slate-950/60 border-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="text-xs font-black text-white flex items-center space-x-2">
                        <PhoneCall className="w-4 h-4 text-cyan-400" />
                        <span>{value.title}</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">Đối tượng giả danh: {value.callerName}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone overlay simulator mockup */}
              <div className="bg-slate-950 rounded-3xl border-4 border-slate-800 p-5 space-y-4 max-w-sm mx-auto relative overflow-hidden shadow-2xl">
                {/* Speaker pill */}
                <div className="w-16 h-4 bg-slate-800 rounded-full mx-auto" />

                <div className="text-center pt-3 border-b border-slate-900 pb-3">
                  <p className="text-[10px] text-rose-400 font-bold font-mono animate-pulse">📞 ĐANG TRONG CUỘC GỌI GIÁM SÁT</p>
                  <p className="text-xs font-black text-white mt-1 uppercase font-mono">{scenario.callerName}</p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 text-xs text-slate-300 leading-relaxed font-sans h-36 overflow-y-auto">
                  <p className="font-bold text-rose-300 mb-1 font-mono">Đối phương nói:</p>
                  <p>{callerDialogue}</p>
                </div>

                {feedbackMsg && (
                  <div className="p-2.5 bg-cyan-950/20 border border-cyan-500/20 rounded-lg text-[11px] text-cyan-300 font-sans">
                    {feedbackMsg}
                  </div>
                )}

                {performanceScore !== null && (
                  <div className="flex justify-between items-center text-xs font-mono font-bold bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg text-emerald-400">
                    <span>ĐIỂM SẢN XẠ PHÒNG THỦ:</span>
                    <span>{performanceScore}/100 - ĐẠT CHUẨN</span>
                  </div>
                )}

                <div className="space-y-1.5 pt-2">
                  <p className="text-[9px] text-slate-500 font-bold uppercase font-mono">• Kích hoạt mẹo bẻ gãy đòn tâm lý:</p>
                  <div className="space-y-1.5">
                    {scenario.microTactics.map((tac, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectCoachingTactic(tac.text, tac.reply, tac.score)}
                        className="w-full text-left p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] text-slate-200 font-mono flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="leading-tight">{tac.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
