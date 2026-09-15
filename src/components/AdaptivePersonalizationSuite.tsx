import React, { useState } from 'react';
import {
  Brain,
  Shield,
  Zap,
  HelpCircle,
  Award,
  RefreshCw,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playRewardTrophy } from '../utils/audioEffects';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
  intervalDays: number;
  lastReviewed: string;
}

const INITIAL_CARDS: Flashcard[] = [
  { id: 1, question: 'Làm thế nào để phát hiện một cuộc gọi Video Deepfake mạo danh người thân?', answer: 'Yêu cầu đối phương quay nghiêng mặt sang một bên. Deepfake thời gian thực thường bị lỗi khớp rìa xương quai hàm (Face-border Artifacts) khiến mặt mờ hạt hoặc biến mất.', category: 'Deepfake Defense', intervalDays: 1, lastReviewed: 'Chưa học' },
  { id: 2, question: 'Nhà mạng viễn thông có bao giờ gọi điện báo khóa SIM và bắt chuẩn hóa thông tin qua dán link lạ?', answer: 'Tuyệt đối không! Nhà mạng chỉ nhắn tin từ thương hiệu định danh (brandname) hoặc mời quý khách ra trực tiếp phòng giao dịch. Không có việc gọi điện ép thao tác gấp.', category: 'SIM/Telecom Scam', intervalDays: 3, lastReviewed: 'Chưa học' },
  { id: 3, question: 'Để bẻ gãy đòn áp lực thời gian (Urgency) của kẻ xưng danh shipper đòi nợ khống, ta làm gì?', answer: 'Dùng đòn trì hoãn thời gian: "Tôi đang lái xe trên cao tốc" hoặc "đang trong ca phẫu thuật", tắt máy khẩn cấp và chủ động liên hệ tổng đài hãng giao hàng để tra cứu mã vận đơn.', category: 'Anti-Urgency', intervalDays: 7, lastReviewed: 'Chưa học' }
];

export const AdaptivePersonalizationSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'srs'>('profile');

  // 1. Profiling States
  const [profileAnswers, setProfileAnswers] = useState<Record<string, number>>({
    fomo: 2, // 1-4 scale
    authority: 2,
    urgency: 2,
    isolation: 2
  });
  const [profileResult, setProfileResult] = useState<any | null>(null);

  // 2. SRS States
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_CARDS);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [congrats, setCongrats] = useState(false);

  // Calculate Behavioral Risk Profile
  const handleCalculateProfile = () => {
    const f = profileAnswers.fomo;
    const a = profileAnswers.authority;
    const u = profileAnswers.urgency;
    const i = profileAnswers.isolation;

    let profileName = 'Người Phòng Thủ Thăng Bằng (Balanced Defender)';
    let vulnerability = 'Thấp';
    let details = 'Bạn có khả năng cân nhắc tốt, không dễ bị lay động bởi đòn áp lực tâm lý.';

    if (f >= 3 && u >= 3) {
      profileName = 'Chiến Sĩ Phản Phản Ứng Nhanh (Impulsive Practitioner)';
      vulnerability = 'Cao (Dễ bị dồn ép thời gian)';
      details = 'Bạn dễ bị bẫy bởi các kịch bản phần thưởng khẩn cấp, quà tặng tri ân hoặc dọa khóa SIM bắt thao tác gấp.';
    } else if (a >= 3 && i >= 3) {
      profileName = 'Học Viên Tôn Kính Quyền Lực (Authority-Obedient Shield)';
      vulnerability = 'Trung Bình - Cao (E ngại cơ quan công quyền)';
      details = 'Bạn có tâm lý e ngại và tôn trọng tuyệt đối luật pháp, dễ bị đối tượng giả danh Công an, Viện kiểm sát đe dọa lệnh bắt giam cô lập.';
    } else if (f >= 3 && i >= 3) {
      profileName = 'Học Viên Tâm Lý Riêng Lẻ (Social Isolated Inquirer)';
      vulnerability = 'Trung Bình';
      details = 'Bạn dễ bị lôi kéo vào các nhóm đầu tư Telegram khép kín không cho bàn bạc với người thân.';
    }

    setProfileResult({
      profileName,
      vulnerability,
      details,
      metrics: {
        fomoIndex: f * 25,
        authorityIndex: a * 25,
        urgencyIndex: u * 25,
        isolationIndex: i * 25
      }
    });
    playRewardTrophy();
  };

  // SRS Schedule interval click
  const handleScheduleSRS = (cardId: number, days: number) => {
    setCards(prev => prev.map(card => {
      if (card.id !== cardId) return card;
      return {
        ...card,
        intervalDays: days,
        lastReviewed: `Đã xếp lịch học sau ${days} ngày`
      };
    }));

    setShowAnswer(false);
    playSuccessChime();

    if (activeCardIdx < cards.length - 1) {
      setActiveCardIdx(activeCardIdx + 1);
    } else {
      setCongrats(true);
    }
  };

  const activeCard = cards[activeCardIdx];

  return (
    <div className="space-y-6">
      {/* Visual Navigation Header */}
      <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'profile', label: '🧠 Behavioral Risk Profiling', icon: Brain },
          { id: 'srs', label: '⏱️ Spaced Repetition (SRS)', icon: Clock }
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
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>BEHAVIORAL RISK PROFILING (ĐỊNH HÌNH TÂM LÝ RỦI RO)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kẻ gian không tấn công vào kỹ thuật bảo mật của bạn, họ tấn công vào lỗ hổng tâm lý. Thực hiện đánh giá trắc nghiệm 4 nhân tố hành vi để biết bản thân nhạy cảm nhất với đòn tâm lý nào.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Question Form */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs font-sans">
                <p className="text-xs font-black text-white font-mono uppercase tracking-wider text-slate-300">Độ nhạy tâm lý (Từ 1: Vững chãi đến 4: Cực kỳ nhạy cảm):</p>

                <div className="space-y-4">
                  {/* Q1 */}
                  <div className="space-y-1.5">
                    <p className="text-slate-300 font-medium">1. Tâm lý FOMO (Sợ bỏ lỡ cơ hội nhận quà, trúng thưởng tri ân miễn phí):</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setProfileAnswers({ ...profileAnswers, fomo: val })}
                          className={`flex-1 py-1.5 rounded-lg font-black font-mono border cursor-pointer transition-all ${
                            profileAnswers.fomo === val
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="space-y-1.5">
                    <p className="text-slate-300 font-medium">2. Sự tuân thủ Quyền lực (Lo sợ, hoảng loạn khi xưng danh Công An, Viện kiểm sát dọa bắt giam):</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setProfileAnswers({ ...profileAnswers, authority: val })}
                          className={`flex-1 py-1.5 rounded-lg font-black font-mono border cursor-pointer transition-all ${
                            profileAnswers.authority === val
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="space-y-1.5">
                    <p className="text-slate-300 font-medium">3. Sự phản ứng khẩn cấp (Thói quen vội vàng thao tác khi nghe thông báo dọa khóa SIM, mất tiền tài khoản):</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setProfileAnswers({ ...profileAnswers, urgency: val })}
                          className={`flex-1 py-1.5 rounded-lg font-black font-mono border cursor-pointer transition-all ${
                            profileAnswers.urgency === val
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q4 */}
                  <div className="space-y-1.5">
                    <p className="text-slate-300 font-medium">4. Tâm lý cô lập (E ngại không dám thảo luận, trao đổi các chuyện tiền bạc rắc rối với người thân):</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setProfileAnswers({ ...profileAnswers, isolation: val })}
                          className={`flex-1 py-1.5 rounded-lg font-black font-mono border cursor-pointer transition-all ${
                            profileAnswers.isolation === val
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCalculateProfile}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all uppercase tracking-wider font-mono cursor-pointer"
                >
                  XUẤT HỒ SƠ CHỈ SỐ LỖ HỔNG
                </button>
              </div>

              {/* Profile Results Screen */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <p className="text-xs font-bold text-slate-400 font-mono uppercase block">Chân dung tâm lý phòng thủ:</p>
                
                {profileResult ? (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="bg-cyan-500/10 p-3.5 border-2 border-cyan-500/30 rounded-2xl space-y-1">
                      <p className="text-[10px] text-cyan-300 font-mono uppercase font-black tracking-wider">HỒ SƠ CỦA BẠN:</p>
                      <h4 className="text-sm font-black text-white">{profileResult.profileName}</h4>
                      <p className="text-slate-300 mt-1.5 leading-relaxed">{profileResult.details}</p>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">• Chỉ số nhạy cảm tâm lý:</p>
                      
                      <div className="space-y-2 font-mono text-[11px]">
                        {/* Metric 1 */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Chỉ số FOMO:</span>
                            <span className="text-cyan-400">{profileResult.metrics.fomoIndex}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div className="bg-cyan-400 h-full" style={{ width: `${profileResult.metrics.fomoIndex}%` }} />
                          </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Chỉ số Tuân thủ Quyền Lực:</span>
                            <span className="text-cyan-400">{profileResult.metrics.authorityIndex}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div className="bg-cyan-400 h-full" style={{ width: `${profileResult.metrics.authorityIndex}%` }} />
                          </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Độ phản ứng khẩn cấp (Rush index):</span>
                            <span className="text-cyan-400">{profileResult.metrics.urgencyIndex}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div className="bg-cyan-400 h-full" style={{ width: `${profileResult.metrics.urgencyIndex}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-2">
                    <Brain className="w-8 h-8 text-slate-700 animate-pulse" />
                    <p className="text-xs font-medium">Chưa bóc tách hồ sơ.</p>
                    <p className="text-[10px] font-mono">Đánh giá các thói quen tâm lý bên trái và nhấn Xuất hồ sơ.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'srs' && (
          <motion.div
            key="srs"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6 max-w-2xl mx-auto"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>SPACED REPETITION SYSTEM (SRS DRILLS)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Luyện trí nhớ dài hạn! Ôn tập các tấm thẻ ghi nhớ (Flashcards) theo phương pháp lặp lại ngắt quãng để ghi nhớ mãi mãi các chỉ số phản xạ chống lừa đảo trực tuyến.
              </p>
            </div>

            {congrats ? (
              <div className="text-center py-12 space-y-4">
                <Award className="w-16 h-16 text-cyan-400 mx-auto animate-bounce-subtle" />
                <h4 className="text-base font-black text-white uppercase tracking-wider font-mono">XONG KỲ ÔN TẬP HÔM NAY!</h4>
                <p className="text-xs text-slate-300">Bạn đã rà soát toàn bộ các thẻ an ninh. Các thẻ sẽ được lên lịch xuất hiện trở lại dựa trên phản xạ của bạn.</p>
                <button
                  onClick={() => {
                    setCongrats(false);
                    setActiveCardIdx(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono tracking-wider uppercase cursor-pointer"
                >
                  LUYỆN LẠI TỪ ĐẦU
                </button>
              </div>
            ) : activeCard ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>THẺ ÔN TẬP: {activeCardIdx + 1} / {cards.length}</span>
                  <span className="uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{activeCard.category}</span>
                </div>

                {/* Main Card View */}
                <div
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 min-h-[160px] flex flex-col justify-between cursor-pointer hover:border-cyan-500/40 transition-all select-none"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">{showAnswer ? 'CHỈ SỐ ĐÁP ÁN:' : 'CÂU HỎI AN NINH:'}</p>
                    <p className="text-xs sm:text-sm font-black text-white leading-relaxed font-sans">
                      {showAnswer ? activeCard.answer : activeCard.question}
                    </p>
                  </div>

                  <p className="text-[9px] text-slate-500 text-center font-mono mt-4">
                    {showAnswer ? 'Nhấn tiếp một lần nữa để xem lại câu hỏi' : '👉 Nhấp chuột vào bất cứ đâu trên thẻ để bóc tách ĐÁP ÁN'}
                  </p>
                </div>

                {/* SRS Scheduling controls */}
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-[10px] font-mono font-bold text-slate-500 text-center uppercase tracking-wider">• Lên lịch chu kỳ ôn tập tiếp theo:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleScheduleSRS(activeCard.id, 1)}
                        className="flex-1 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-400 font-black border border-red-900 text-xs font-mono uppercase cursor-pointer"
                      >
                        🔴 Rất khó (Ôn lại sau 1 ngày)
                      </button>
                      <button
                        onClick={() => handleScheduleSRS(activeCard.id, 3)}
                        className="flex-1 py-2.5 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 text-amber-400 font-black border border-amber-900 text-xs font-mono uppercase cursor-pointer"
                      >
                        🟡 Bình thường (Ôn sau 3 ngày)
                      </button>
                      <button
                        onClick={() => handleScheduleSRS(activeCard.id, 7)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 font-black border border-emerald-900 text-xs font-mono uppercase cursor-pointer"
                      >
                        🟢 Dễ hiểu (Ôn sau 7 ngày)
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
