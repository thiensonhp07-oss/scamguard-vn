import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  HelpCircle,
  Sparkles,
  Lock,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';
import { SCAM_TACTIC_TAXONOMY, TacticDefinition } from '../data/taxonomy';
import { ScamTactic } from '../types';

interface LearnViewProps {
  onNavigate?: (tab: string, subView?: string) => void;
  initialTactic?: ScamTactic | null;
}

export const LearnView: React.FC<LearnViewProps> = ({ onNavigate, initialTactic }) => {
  const { t } = useTranslation();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedTactic, setExpandedTactic] = useState<ScamTactic | null>(initialTactic || 'Authority');

  React.useEffect(() => {
    if (initialTactic) {
      setExpandedTactic(initialTactic);
    }
  }, [initialTactic]);

  const goldenRules = [
    {
      step: '1. DỪNG LẠI (STOP)',
      desc: 'Khi nhận được bất kỳ tin nhắn, cuộc gọi hoặc email nào có tính chất giục giã hoặc đe dọa, hãy hít thở sâu và dừng lại 30 giây. Kẻ lừa đảo luôn dựa vào sự hấp tấp để làm tê liệt tư duy phản biện.',
      icon: '🛑',
    },
    {
      step: '2. KIỂM TRA ĐƯỜNG LINK & TÊN MIỀN (CHECK)',
      desc: 'Nhìn kỹ địa chỉ web từ phải sang trái trước dấu gạch chéo đầu tiên. Cơ quan chính phủ Việt Nam độc quyền dùng đuôi ".gov.vn", trường học dùng ".edu.vn". Tuyệt đối không bấm link có đuôi lạ như .top, .xyz, .site.',
      icon: '🔍',
    },
    {
      step: '3. XÁC MINH ĐỘC LẬP (VERIFY)',
      desc: 'Áp dụng quy tắc "Mặt sau của thẻ": Luôn cúp máy và tự bấm số hotline in ở mặt sau thẻ ngân hàng hoặc đến trực tiếp trụ sở công an phường để hỏi, không làm việc qua số điện thoại lạ gọi đến.',
      icon: '🛡️',
    },
    {
      step: '4. HỎI NGƯỜI THÂN & Ý KIẾN THỨ HAI (ASK)',
      desc: 'Trước khi chuyển tiền hoặc nhập thông tin, hãy hỏi một người thân trong gia đình hoặc bạn bè đáng tin cậy. Góc nhìn của người thứ hai sẽ lập tức phát hiện ra bẫy mà bạn đang bị cuốn vào.',
      icon: '👨‍👩‍👧‍👦',
    },
    {
      step: '5. NÓI "KHÔNG" & BẢO VỆ MẬT KHẨU (SECURE)',
      desc: 'Tuyệt đối KHÔNG BAO GIỜ chia sẻ mã OTP, mật khẩu Internet Banking, mã PIN hoặc chụp ảnh CCCD 2 mặt gửi cho bất kỳ ai trên mạng xã hội.',
      icon: '🔒',
    },
  ];

  const counterScripts = [
    {
      situation: 'Giả danh Công An / Viện Kiểm Sát dọa có lệnh bắt qua điện thoại',
      script: 'Tôi xin phép dừng cuộc gọi tại đây. Mời cơ quan gửi giấy triệu tập chính thức về Công an phường nơi tôi cư trú, tôi sẽ cùng luật sư đến làm việc trực tiếp.',
      tip: 'Đập tan hoàn toàn đòn uy hiếp qua mạng và tuân thủ chuẩn quy trình tố tụng pháp luật.',
    },
    {
      situation: 'Giả danh Ngân Hàng giục bấm link hủy giao dịch lạ trong 5 phút',
      script: 'Tôi sẽ cúp máy ngay bây giờ và tự gọi vào số hotline in ở mặt sau thẻ ngân hàng của tôi để kiểm tra vụ việc này.',
      tip: 'Chặn đứng bẫy smishing đoạt thẻ tín dụng và chuyển hướng xác minh qua kênh ngân hàng chính thức.',
    },
    {
      situation: 'Giọng nói khóc lóc báo tin con/cháu gặp tai nạn giao thông cần viện phí',
      script: 'Gia đình ta có quy tắc an toàn: con hãy đọc đúng "Mật khẩu an toàn gia đình" trước, hoặc mẹ sẽ cúp máy gọi lại vào số điện thoại thường ngày của con ngay bây giờ.',
      tip: 'Vạch trần công nghệ Deepfake clone giọng nói AI chỉ trong 3 giây.',
    },
    {
      situation: 'Mời làm nhiệm vụ Telegram / TikTok nạp tiền nhận hoa hồng 30%',
      script: 'Doanh nghiệp chân chính sẽ chi trả lương từ quỹ công ty chứ không bắt ứng viên nạp tiền cá nhân. Tôi từ chối nạp tiền và dừng hợp tác tại đây.',
      tip: 'Dứt khoát không để kẻ gian dẫn dụ vào bẫy chi phí chìm nạp tiền phân cấp.',
    },
    {
      situation: 'Người quen qua mạng rủ đầu tư sàn tiền ảo / vàng quốc tế',
      script: 'Tôi chỉ đầu tư qua các tổ chức tài chính được nhà nước cấp phép và không bao giờ chia sẻ tài chính cá nhân trên mạng xã hội.',
      tip: 'Lịch sự nhưng kiên quyết từ chối bẫy tình cảm đầu tư "Mổ heo" (Sha Zhu Pan).',
    },
  ];

  const officialChannels = [
    {
      name: 'Tổng đài 156 (Miễn phí)',
      org: 'Cục An toàn thông tin - Bộ Thông tin & Truyền thông',
      desc: 'Tiếp nhận phản ánh cuộc gọi rác, tin nhắn rác và dấu hiệu lừa đảo trực tuyến.',
      phone: '156',
    },
    {
      name: 'Cảnh sát phản ứng nhanh 113',
      org: 'Bộ Công an Việt Nam',
      desc: 'Hỗ trợ can thiệp khẩn cấp khi phát hiện đối tượng dàn cảnh hoặc đe dọa tống tiền trực tiếp.',
      phone: '113',
    },
    {
      name: 'Cổng Cảnh Báo An Toàn Thông Tin',
      org: 'Trung tâm Giám sát an toàn không gian mạng quốc gia (NCSC)',
      desc: 'Tra cứu website lừa đảo, báo cáo địa chỉ URL giả mạo và tài khoản lừa đảo.',
      url: 'https://canhbao.ncsc.gov.vn',
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 cyber-grid relative">
      {/* Background Glows */}
      <div className="glow-orb-cyan top-0 left-1/3 opacity-15" />

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-xs font-bold shadow-sm">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span>CẨM NANG PHÒNG THỦ AN NINH MẠNG</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Thư viện Tri Thức & Kịch Bản Phản Kháng
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Nắm vững 5 Quy tắc Vàng, 12 Đòn thao túng tâm lý điển hình và bộ câu thoại phản ứng tức thì khi bị kẻ gian tấn công.
        </p>
      </motion.div>

      {/* 5 Golden Rules Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800/80 shadow-2xl"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">5 Quy Tắc Vàng An Toàn Mạng</h2>
            <p className="text-xs text-slate-400">
              Khung phòng vệ 5 bước giúp bạn không bao giờ trở thành nạn nhân
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goldenRules.map((rule, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-5 glass-card rounded-2xl border border-slate-800 space-y-2.5 hover:border-cyan-500/40 transition-all shadow-md"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{rule.icon}</span>
                <h3 className="text-sm font-bold text-white">{rule.step}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{rule.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Taxonomy of 12 Psychological Tactics */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800/80 shadow-2xl"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Bách Khoa 12 Đòn Thao Túng Tâm Lý</h2>
            <p className="text-xs text-slate-400">
              Phân loại giải phẫu các thủ thuật tâm lý tinh vi mà tội phạm mạng thường dùng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.values(SCAM_TACTIC_TAXONOMY) as TacticDefinition[]).map((tacticDef) => {
            const isExpanded = expandedTactic === tacticDef.tactic;
            return (
              <div
                key={tacticDef.tactic}
                className="glass-card rounded-2xl border border-slate-800 p-4 space-y-3 transition-all hover:border-slate-700"
              >
                <div
                  onClick={() => setExpandedTactic(isExpanded ? null : tacticDef.tactic)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {tacticDef.tactic}
                      </span>
                      <h3 className="text-sm font-bold text-white">{tacticDef.nameVi}</h3>
                    </div>
                    <p className="text-xs text-slate-400">{tacticDef.shortDescription}</p>
                  </div>
                  <button className="text-slate-500 hover:text-white p-1 cursor-pointer">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs animate-fadeIn">
                    <div>
                      <span className="font-bold text-slate-400 block mb-1">Cách Kẻ Gian Khai Thác:</span>
                      <p className="text-slate-300 leading-relaxed font-medium">{tacticDef.howScammersExploit}</p>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
                      <span className="font-bold text-emerald-400 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Biện Pháp Phòng Thủ Chuẩn:</span>
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {tacticDef.counterMeasures.map((cm, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{cm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-1">
                      <span className="font-bold text-rose-300">Ví Dụ Câu Thoại Kẻ Gian Hay Dùng:</span>
                      {tacticDef.examplePhrases.map((phrase, idx) => (
                        <p key={idx} className="text-slate-300 italic font-mono text-[11px]">
                          "{phrase}"
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Ready-Made Verbal Counter-Scripts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800/80 shadow-2xl"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Kịch Bản Phản Kháng Nói Thẳng Bẻ Bẫy</h2>
            <p className="text-xs text-slate-400">Các câu nói chuẩn giúp bạn cúp máy tự tin và hóa giải lập tức áp lực tâm lý</p>
          </div>
        </div>

        <div className="space-y-4">
          {counterScripts.map((cs, idx) => (
            <div
              key={idx}
              className="p-5 glass-card rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
            >
              <div className="space-y-1.5 flex-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  📌 {cs.situation}
                </span>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  "{cs.script}"
                </p>
                <span className="text-xs text-slate-400 block font-medium">💡 Ý nghĩa: {cs.tip}</span>
              </div>

              <button
                onClick={() => handleCopy(cs.script, idx)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-cyan-600 text-slate-200 hover:text-slate-950 font-bold text-xs border border-slate-800 flex items-center space-x-1.5 transition-colors self-start md:self-center whitespace-nowrap cursor-pointer shadow-sm"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép kịch bản</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Official Reporting Channels Guide */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800/80 shadow-2xl"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Đường Dây Nóng & Kênh Báo Cáo Chính Thống</h2>
            <p className="text-xs text-slate-400">
              Các đầu mối chính thống tại Việt Nam để phản ánh và ngăn chặn lừa đảo kịp thời
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {officialChannels.map((oc, idx) => (
            <div
              key={idx}
              className="p-5 glass-card rounded-2xl border border-slate-800 space-y-2.5 flex flex-col justify-between shadow-md"
            >
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">{oc.name}</h3>
                <span className="text-[11px] font-semibold text-emerald-400 block">{oc.org}</span>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{oc.desc}</p>
              </div>

              {oc.phone ? (
                <a
                  href={`tel:${oc.phone}`}
                  className="mt-3 py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Gọi {oc.phone}</span>
                </a>
              ) : (
                <a
                  href={oc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 py-2 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 font-bold text-xs border border-cyan-500/40 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Truy cập Cổng NCSC</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
