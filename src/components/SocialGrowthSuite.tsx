import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Heart,
  UserPlus,
  Share2,
  Gift,
  Award,
  Bell,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Sparkles,
  RefreshCw,
  Download,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playRewardTrophy } from '../utils/audioEffects';
import { SocialFeedView } from './SocialFeedView';
import { SocialPost, ReactionType } from '../types';

interface CircleMember {
  id: string;
  name: string;
  role: 'Trẻ nhỏ' | 'Người cao tuổi' | 'Người giám hộ';
  riskScore: number;
  lastActive: string;
  alertsCount: number;
  status: 'SAFE' | 'ALERT_TRIGGERED' | 'MONITORED';
}

const INITIAL_MEMBERS: CircleMember[] = [
  { id: 'm-1', name: 'Bà Nội (Cúc)', role: 'Người cao tuổi', riskScore: 82, lastActive: '2 phút trước', alertsCount: 3, status: 'ALERT_TRIGGERED' },
  { id: 'm-2', name: 'Bé Na (Con)', role: 'Trẻ nhỏ', riskScore: 15, lastActive: '1 giờ trước', alertsCount: 0, status: 'SAFE' },
  { id: 'm-3', name: 'Bố An', role: 'Người cao tuổi', riskScore: 45, lastActive: 'Khoảng 30 phút trước', alertsCount: 1, status: 'MONITORED' }
];

const INITIAL_ACTIONS = [
  'Bố An vừa chặn link lạ giả mạo Techcombank.',
  'Con Nam vừa báo cáo sđt rác mạo danh Công An Đà Nẵng.',
  'Chị Vân vừa định danh thành công SĐT shipper mạo danh.',
  'Bà Nội Cúc vừa kích hoạt Chế Độ Bảo Vệ Người Lớn Tuổi.',
  'Bạn Hà vừa hoàn thành Khóa Học Diệt Trừ Scam OTP.'
];

interface SocialGrowthSuiteProps {
  userProfile: any;
  onEarnXp: (xp: number) => void;
  posts?: SocialPost[];
  onAddPost?: (newPost: SocialPost) => void;
  onReactPost?: (postId: string, reaction: ReactionType) => void;
  onAddComment?: (postId: string, commentText: string) => void;
  onSharePost?: (postId: string) => void;
  onToggleFollowUser?: (userId: string) => void;
}

export const SocialGrowthSuite: React.FC<SocialGrowthSuiteProps> = ({
  userProfile,
  onEarnXp,
  posts = [],
  onAddPost,
  onReactPost,
  onAddComment,
  onSharePost,
  onToggleFollowUser,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'family' | 'referral' | 'dna'>('feed');

  // 1. Family Circle States
  const [members, setMembers] = useState<CircleMember[]>(INITIAL_MEMBERS);
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Trẻ nhỏ' | 'Người cao tuổi' | 'Người giám hộ'>('Người cao tuổi');
  const [successMsg, setSuccessMsg] = useState('');

  // 2. Referral States
  const [refCode] = useState('SCAMGUARD-SHIELD-7799');
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([
    { email: 'hoangnam***@gmail.com', status: 'COMPLETED', date: 'Hôm qua', reward: '+250 XP, +1 Khiên bảo vệ' },
    { email: 'thicuc1950***@yahoo.com', status: 'PENDING', date: '3 ngày trước', reward: 'Đang đợi xác thực SĐT' }
  ]);

  // 3. Social Proof Stream
  const [liveActions, setLiveActions] = useState<string[]>(INITIAL_ACTIONS);

  useEffect(() => {
    const interval = setInterval(() => {
      // randomly append a new community action
      const names = ['Chú Minh', 'Mẹ Hoa', 'Bà Ngoại Lan', 'Bạn Kiên', 'Cậu Sơn', 'Bác Phương'];
      const actions = [
        'vừa hoàn thành bài thi Vượt Ải Phishing.',
        'vừa chặn cuộc gọi giả mạo dọa khóa SIM.',
        'vừa gỡ app lạ nghi dính mã độc VNeID giả.',
        'vừa kích hoạt lá chắn bảo mật QR ngân hàng.',
        'vừa chia sẻ Scam DNA đạt hạng Kim Cương.'
      ];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLiveActions(prev => [`${randomName} ${randomAction}`, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    playSuccessChime();
  };

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const newMember: CircleMember = {
      id: `m-${Date.now()}`,
      name: inviteName.trim(),
      role: inviteRole,
      riskScore: Math.floor(Math.random() * 50) + 15,
      lastActive: 'Vừa tham gia',
      alertsCount: 0,
      status: 'SAFE'
    };

    setMembers([...members, newMember]);
    setInviteName('');
    setSuccessMsg(`✓ Đã gửi tin nhắn mời ${newMember.name} tham gia Vòng Tròn Gia Đình An Toàn!`);
    setTimeout(() => setSuccessMsg(''), 4000);
    playRewardTrophy();
  };

  const handleTriggerFreezeAlert = (memberName: string) => {
    setSuccessMsg(`✓ Đã gửi kích hoạt LÁ CHẮN BẢO VỆ đóng băng giao dịch khẩn cấp từ xa gửi đến ứng dụng của ${memberName}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
    setMembers(prev => prev.map(m => m.name === memberName ? { ...m, status: 'SAFE', riskScore: 10 } : m));
    playSuccessChime();
  };

  return (
    <div className="space-y-6">
      {/* Social Proof Widget (Live Feed) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-3 px-4 flex items-center justify-between text-xs overflow-hidden">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold flex-shrink-0">
          <Bell className="w-4 h-4 animate-swing text-cyan-400" />
          <span className="uppercase font-mono text-[10px]">CỘNG ĐỒNG LIVE SHIELD:</span>
        </div>
        <div className="flex-1 ml-4 overflow-hidden relative h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={liveActions[0]}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-slate-300 font-medium font-sans truncate text-[11px]"
            >
              {liveActions[0]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Inside Social */}
      <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'feed', label: '🌐 Bảng Tin Mạng Xã Hội', icon: MessageSquare },
          { id: 'family', label: '👨‍👩‍👧‍👦 Family Safety Circle', icon: Users },
          { id: 'referral', label: '🎁 Referral Program', icon: Gift },
          { id: 'dna', label: '🏆 Shareable Scam DNA', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md font-black'
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
        {activeTab === 'feed' && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <SocialFeedView
              currentUserProfile={userProfile}
              posts={posts}
              onAddPost={onAddPost}
              onReactPost={onReactPost}
              onAddComment={onAddComment}
              onSharePost={onSharePost}
              onToggleFollowUser={onToggleFollowUser}
            />
          </motion.div>
        )}

        {activeTab === 'family' && (
          <motion.div
            key="family"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left side Circle lists */}
            <div className="lg:col-span-7 space-y-4">
              <div className="cartoon-card p-5 bg-slate-900/40 border-slate-800 space-y-2">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>VÒNG TRÒN GIA ĐÌNH (FAMILY SAFETY CIRCLE)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Người bảo hộ (Guardian Mode): Giám sát từ xa rủi ro an ninh mạng của người lớn tuổi (ông bà, bố mẹ) hoặc con trẻ. Nhận cảnh báo SOS lập tức khi họ tiếp xúc với SĐT lừa đảo hoặc truy cập link chứa mã độc độc hại.
                </p>
              </div>

              {members.map(member => (
                <div key={member.id} className="cartoon-card p-5 bg-slate-950/60 border-slate-800 space-y-3 relative overflow-hidden">
                  {member.status === 'ALERT_TRIGGERED' && (
                    <div className="absolute top-0 left-0 w-1 bg-red-500 h-full animate-pulse" />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        member.role === 'Người cao tuổi' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {member.role === 'Người cao tuổi' ? '👵' : '👶'}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">{member.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono uppercase">{member.role} • Hoạt động: {member.lastActive}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-mono font-bold">CHỈ SỐ TIẾP XÚC RỦI RO:</p>
                      <p className={`text-sm font-black font-mono ${
                        member.riskScore >= 70 ? 'text-rose-400 animate-pulse' : (member.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400')
                      }`}>
                        {member.riskScore}% {member.riskScore >= 70 ? '⚠️ NGUY HIỂM' : (member.riskScore >= 40 ? 'TRUNG BÌNH' : 'AN TOÀN')}
                      </p>
                    </div>
                  </div>

                  {member.status === 'ALERT_TRIGGERED' ? (
                    <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5 text-rose-300">
                        <p className="font-bold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 animate-bounce text-red-400" />
                          <span>CẢNH BÁO: PHÁT HIỆN GIAO DỊCH KHẢ NGHI</span>
                        </p>
                        <p className="text-[11px] text-slate-300">Bà vừa dán một liên kết giả mạo Vietcombank vào khung tin nhắn.</p>
                      </div>
                      <button
                        onClick={() => handleTriggerFreezeAlert(member.name)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] font-mono rounded-lg uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Shield className="w-3 h-3 text-white" />
                        <span>KÍCH HOẠT KHIÊN ĐÔNG BĂNG</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono bg-slate-900/50 p-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Trình giám sát Sentinel của thiết bị đang hoạt động bình thường. Không phát hiện mối nguy.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side Add member */}
            <div className="lg:col-span-5">
              <div className="cartoon-card p-6 bg-slate-900/60 border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <span>MỜI NGƯỜI THÂN VÀO VÒNG TRÒN</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Gửi mã mời cho bố mẹ hoặc con cái cài đặt ScamGuard VN để đồng bộ theo dõi rủi ro và nhận khiên bảo vệ đóng băng từ xa.
                </p>

                {successMsg && (
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 font-medium">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleAddFamilyMember} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Họ tên của người thân:</label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Ví dụ: Bà Ngoại (Lan), Bé Bi..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Vai trò:</label>
                    <div className="flex gap-2">
                      {['Trẻ nhỏ', 'Người cao tuổi', 'Người giám hộ'].map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setInviteRole(role as any)}
                          className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer transition-all uppercase font-mono text-[9px] ${
                            inviteRole === role
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!inviteName.trim()}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all uppercase tracking-wider font-mono cursor-pointer disabled:opacity-40"
                  >
                    GỬI LỜI MỜI KHẨN CẤP
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'referral' && (
          <motion.div
            key="referral"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Gift className="w-5 h-5 text-cyan-400" />
                <span>HỆ THỐNG GIỚI THIỆU LAN TRUYỀN (REFERRAL SYSTEM)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lan tỏa văn hóa an toàn không gian mạng! Cứ mỗi người thân bạn mời tham gia và định danh số điện thoại, bạn sẽ được thưởng ngay <strong className="text-cyan-300">250 XP</strong> và <strong className="text-amber-300">1 lượt Khiên Bảo Vệ (Shield Freeze)</strong> đóng băng khẩn cấp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Share Code */}
              <div className="space-y-4">
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Mã giới thiệu của bạn:</p>
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-850">
                    <span className="text-sm font-black font-mono text-white select-all">{refCode}</span>
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] font-mono rounded-lg uppercase tracking-wider cursor-pointer"
                    >
                      {copied ? 'ĐÃ COPIED' : 'COPY MÃ'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl text-xs text-cyan-300 leading-relaxed font-sans">
                  <Gift className="w-5 h-5 text-cyan-400 flex-shrink-0 animate-pulse" />
                  <span>Bật mí: Mời 3 người lớn tuổi tham gia được nhận ngay Huy hiệu danh giá <strong>"Gia Đình Vững Chãi"</strong> + 500 XP!</span>
                </div>
              </div>

              {/* Right referrals table */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Lịch sử bạn bè tham gia:</p>
                <div className="space-y-2 text-xs">
                  {referrals.map((ref, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-850">
                      <div>
                        <p className="font-mono text-[11px] text-white font-bold">{ref.email}</p>
                        <p className="text-[9px] text-slate-500 font-mono">Đăng ký: {ref.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                          ref.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {ref.status}
                        </span>
                        <p className="text-[9px] text-cyan-400 font-mono mt-1">{ref.reward}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'dna' && (
          <motion.div
            key="dna"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>SHAREABLE SCAM DNA REPORT (CHỨNG CHỈ BẢN LĨNH PHÒNG THỦ)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Chứng nhận phản xạ không gian mạng số hóa được đồng tạo bởi ScamGuard VN. Thể hiện mức độ nhạy cảm của bạn trước các kịch bản lừa đảo và chia sẻ lên mạng xã hội để thể hiện bản lĩnh.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Report Mockup */}
              <div className="bg-slate-950 rounded-2xl border-2 border-cyan-500/40 p-6 space-y-4 relative overflow-hidden shadow-2xl">
                {/* Decorative border */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full filter blur-xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl" />

                <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                  <div>
                    <h4 className="text-xs font-black text-white font-mono uppercase tracking-widest text-cyan-400">SCAM DNA REFLEX REPORT</h4>
                    <p className="text-[10px] text-slate-500 font-mono">DATE: {new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                  <Shield className="w-6 h-6 text-cyan-400" />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Học viên an ninh:</span>
                    <span className="font-bold text-white uppercase font-mono">{userProfile.name || 'ANONYMOUS DEFENDER'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Xếp hạng phòng vệ:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black font-mono text-[9px]">
                      KIM CƯƠNG (DIAMOND)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Điểm phản xạ (Reflex Score):</span>
                    <span className="font-mono text-sm font-black text-cyan-300">{userProfile.overallScore || 85}/100</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 font-mono uppercase">• BẢN ĐỒ PHẢN XẠ GEN SCAM:</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chống Phishing:</span>
                        <span className="text-emerald-400 font-bold">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chống Fake Bill:</span>
                        <span className="text-emerald-400 font-bold">88%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nhận diện OTP Trap:</span>
                        <span className="text-emerald-400 font-bold">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Kháng Deepfake:</span>
                        <span className="text-amber-400 font-bold">75%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[9px] text-slate-500 font-mono flex items-center justify-between">
                  <span>ID: {userProfile.uid || 'SG-88992'}</span>
                  <span>VERIFIED BY SCAMGUARD ENGINE v2</span>
                </div>
              </div>

              {/* Action */}
              <div className="space-y-4 text-xs font-sans">
                <h4 className="text-sm font-black text-white">Xuất Báo Cáo Của Bạn</h4>
                <p className="text-slate-400 leading-relaxed">
                  Xuất chứng nhận DNA dưới dạng tệp tin ảnh hoặc PDF mã hóa cao để đính kèm vào hồ sơ cá nhân hoặc chia sẻ nhanh chóng lên các hội nhóm Facebook phòng chống lừa đảo.
                </p>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      alert('Tính năng tải ảnh đang kết xuất tệp PNG chất lượng cao...');
                      playSuccessChime();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>TẢI ẢNH CHỨNG CHỈ</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Đã tạo liên kết chia sẻ: https://scamguard.vn/share/dna-report-' + (userProfile.uid || 'guest'));
                      playSuccessChime();
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs font-mono transition-all flex items-center space-x-1.5 border border-slate-800 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>CHIA SẺ LINK</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
