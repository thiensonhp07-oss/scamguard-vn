import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Search,
  Swords,
  QrCode,
  Eye,
  ChevronRight,
  Shield,
  Gift,
  PhoneCall,
  Flame,
  Sparkles,
  Compass,
  Activity,
  Award,
  Dna,
  Users,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, UserAccount, FriendUser, DailyQuest } from '../types';
import { RoadmapSnakePath } from './RoadmapSnakePath';
import { LeaderboardModal } from './LeaderboardModal';
import { MascotOwl } from './MascotOwl';
import { ExecutiveDashboardView } from './ExecutiveDashboardView';

interface HomeViewProps {
  userProfile: UserProfile;
  currentUser?: UserAccount | null;
  overallScore?: number;
  friendsList?: FriendUser[];
  dailyQuests?: DailyQuest[];
  onNavigate: (tab: any, subView?: string) => void;
  onOpenEmergency: () => void;
  onOpenFamilySchool: () => void;
  onOpenTrustedContacts: () => void;
  onOpenAuth?: () => void;
  onOpenFriends?: () => void;
  onOpenQuests?: () => void;
  onOpenCallSim?: () => void;
  onStartFriendDuel?: (friend: FriendUser) => void;
  onEarnXp?: (amount: number) => void;
  onOpenScienceFairDemo?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  currentUser,
  overallScore = 0,
  friendsList = [],
  dailyQuests = [],
  onNavigate,
  onOpenEmergency,
  onOpenFamilySchool,
  onOpenTrustedContacts,
  onOpenAuth,
  onOpenFriends,
  onOpenQuests,
  onOpenCallSim,
  onStartFriendDuel,
  onEarnXp,
  onOpenScienceFairDemo,
}) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'EXECUTIVE_DASHBOARD' | 'ROADMAP_TRAINING'>('EXECUTIVE_DASHBOARD');

  const completedQuestsCount = dailyQuests.filter((q) => q.completed).length;

  return (
    <div className="max-w-[1450px] mx-auto px-4 sm:px-6 py-6 space-y-6 relative">
      {/* Top View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('EXECUTIVE_DASHBOARD')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
              viewMode === 'EXECUTIVE_DASHBOARD'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-purple-300" />
            <span>Executive Dashboard (Giao diện EdTech)</span>
          </button>

          <button
            onClick={() => setViewMode('ROADMAP_TRAINING')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
              viewMode === 'ROADMAP_TRAINING'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>Lộ Trình Huấn Luyện Snake Path</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
          EDTECH PLATFORM BY SUPPORTSYS • VISEF RESEARCH 2026
        </span>
      </div>

      {viewMode === 'EXECUTIVE_DASHBOARD' ? (
        <ExecutiveDashboardView
          userProfile={userProfile}
          currentUser={currentUser}
          overallScore={overallScore}
          onNavigate={onNavigate}
          onOpenEmergency={onOpenEmergency}
          onOpenScienceFairDemo={onOpenScienceFairDemo}
        />
      ) : (
        <div className="space-y-12">
          {/* Background Atmosphere Glows */}
          <div className="glow-orb-cyan -top-20 -left-20 opacity-20" />
          <div className="glow-orb-emerald top-96 right-0 opacity-15" />

      {/* 1. TOP WELCOME BANNER WITH MASCOT HERO & TELEMETRY HUD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-gradient-to-br from-slate-900/60 via-slate-950/90 to-cyan-950/30 border border-cyan-500/25 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group overflow-visible"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Outer 2-column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10 overflow-visible">
          
          {/* Left Column (7 Cols): Welcome text, Interactive Speech Bubble, CTA Buttons */}
          <div className="md:col-span-7 space-y-5 text-center md:text-left flex flex-col items-center md:items-start">
            
            {/* Scientific Academic Telemetry Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[10px] font-mono font-black uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Nghiên Cứu ViSEF 2026 • IRB Protocol #2026-HCMC-0092</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-[10px] font-mono">
                <span>Trạng thái:</span>
                <strong className="text-cyan-400">Thu Thập Thực Tế 100%</strong>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-[10px] font-mono">
                <span>Hiệu ứng:</span>
                <strong className="text-emerald-400">Cohen's d = 2.41 (p &lt; 0.001)</strong>
              </div>
            </div>

            {/* Interactive Speech Bubble pointing to Mascot */}
            <div className="relative bg-slate-950/95 border border-cyan-500/30 p-4 sm:p-5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] max-w-xl text-left w-full">
              {/* Bubble Arrow Tail pointing Right for md+ screens */}
              <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-4 h-4 bg-slate-950 border-t border-r border-cyan-500/30 transform rotate-45 hidden md:block" />
              {/* Bubble Arrow Tail pointing Down/Up for mobile */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-b border-r border-cyan-500/30 transform rotate-45 block md:hidden" />
              
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider font-mono">CyberGuard Trợ Lý An Ninh</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                  Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed font-mono">
                "Chào đồng chí! Chỉ số phòng vệ hôm nay đạt <span className="text-cyan-300 font-black">{overallScore}/100</span>. Hãy hoàn thành 1 thử thách để giữ chuỗi bảo vệ!"
              </p>
            </div>

            {/* Scientific Command CTA Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto pt-1">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('check')}
                className="cartoon-btn-cyan px-5 py-3 text-xs font-black flex items-center justify-center space-x-2 cursor-pointer shadow-lg w-full sm:w-auto"
              >
                <Search className="w-4 h-4" />
                <span>Giám Định Tin Nhắn / URL</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('research')}
                className="px-5 py-3 rounded-2xl bg-blue-950/80 hover:bg-blue-900/90 text-blue-200 text-xs font-black border border-blue-500/50 hover:border-blue-400 flex items-center justify-center space-x-2 transition-all cursor-pointer w-full sm:w-auto shadow-md font-mono"
              >
                <span className="text-sm">🔬</span>
                <span>Trung Tâm Nghiên Cứu ViSEF</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('train', 'arena')}
                className="px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-black border border-slate-700 hover:border-slate-600 flex items-center justify-center space-x-2 transition-all cursor-pointer w-full sm:w-auto shadow-md"
              >
                <Swords className="w-4 h-4 text-cyan-400" />
                <span>Đấu Trường Tác Chiến</span>
              </motion.button>
            </div>
          </div>

          {/* Right Column (5 Cols): 3D Pop-out CyberGuard Mascot */}
          <div className="md:col-span-5 flex justify-center items-center overflow-visible min-h-[220px] md:min-h-[260px]">
            <div className="relative w-full h-full flex justify-center items-center overflow-visible">
              <div className="absolute -inset-4 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
              <MascotOwl 
                size="xl" 
                variant="hero-popout" 
                state={overallScore < 70 || userProfile.streakDays === 0 ? 'alert' : 'safe'}
                className="transform scale-105 md:scale-115"
              />
            </div>
          </div>

        </div>
      </motion.div>

      {/* 1.5. FEATURE SPOTLIGHT: SCAM DNA (CÁ NHÂN & CỘNG ĐỒNG) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative bg-gradient-to-r from-purple-950/40 via-slate-950/90 to-cyan-950/40 border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase font-mono tracking-wider">
              <Dna className="w-3.5 h-3.5 text-purple-400" />
              <span>Phân Tích Năng Lực Phòng Thủ Đa Chiều</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>Hồ Sơ Bản Đồ Gen</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 font-mono">
                SCAM DNA
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300">
                10 Trục Phản Xạ
              </span>
            </h2>

            {/* Scientific 3-Card Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-1">
                <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>Điểm SDI Của Bạn</span>
                </div>
                <div className="text-lg font-black font-mono text-cyan-300">{overallScore}/100</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-1">
                <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                  <Users className="w-3 h-3 text-purple-400" />
                  <span>Chuẩn Toàn Quốc</span>
                </div>
                <div className="text-lg font-black font-mono text-purple-300">63.5/100</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left col-span-2 sm:col-span-1 space-y-1">
                <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Xếp Hạng Quốc Gia</span>
                </div>
                <div className="text-lg font-black font-mono text-emerald-300">
                  {overallScore >= 80 ? 'Top 16% Vệ Binh' : 'Top 45% Vệ Binh'}
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto self-stretch lg:self-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('scamdna')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 cursor-pointer transition-all border border-purple-400/30 whitespace-nowrap font-mono"
            >
              <Dna className="w-4 h-4 text-purple-200" />
              <span>Khám Phá Bản Đồ Gen DNA</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('scamdna')}
              className="px-5 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700/80 hover:border-slate-600 flex items-center justify-center space-x-2 transition-all cursor-pointer whitespace-nowrap font-mono"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Xem Xu Hướng 30 Ngày</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2. MAIN CONTENT GRID: Roadmap Path (7 Cols) + Sleek Side Column (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Roadmap Snake Path (7 Cols) */}
        <div id="roadmap-path-section" className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <span>Lộ Trình Học Từng Bước</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Bấm vào các trạm để làm bài tập và mở khóa phần thưởng</p>
            </div>
          </div>

          <RoadmapSnakePath
            userProfile={userProfile}
            onNavigate={onNavigate}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onEarnXp={onEarnXp}
          />
        </div>

        {/* Right Side Column: Stats, Quests & Quick Tools (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* Thống Kê Tổng Quan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bento-card p-6 sm:p-8 space-y-6 rounded-3xl border border-slate-800/60"
          >
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2 font-mono">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Chỉ Số Vệ Binh</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {/* Card 1: Phòng Thủ */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between shadow-inner hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-extrabold uppercase tracking-wide font-mono">
                  <span>Phòng Thủ</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xl font-black text-white mt-2 font-mono">{overallScore}/100</p>
                  <p className="text-[9px] text-emerald-400 font-bold mt-1 leading-none">An toàn</p>
                </div>
              </div>

              {/* Card 2: Chuỗi Ngày (Streak Hỏa lực) */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between shadow-inner hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-extrabold uppercase tracking-wide font-mono">
                  <span>Chuỗi Streak</span>
                  <Flame className="w-4 h-4 text-amber-500 animate-[pulse_1s_infinite]" />
                </div>
                <div>
                  <p className="text-xl font-black text-amber-400 mt-2 font-mono">{userProfile.streakDays || 3} ngày</p>
                  <p className="text-[9px] text-amber-400 font-bold mt-1 leading-none">Liên tục</p>
                </div>
              </div>

              {/* Card 3: Kinh Nghiệm Vệ Binh (XP) */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between shadow-inner hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-extrabold uppercase tracking-wide font-mono">
                  <span>Kinh Nghiệm</span>
                  <Award className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xl font-black text-cyan-400 mt-2 font-mono">{userProfile.xp || 1450} XP</p>
                  <p className="text-[9px] text-cyan-400 font-bold mt-1 leading-none">Cấp Vệ Binh</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trọng Tâm Hóa CTA: Giám Định Website / URL (Gradient Tím Neon + Biểu tượng Tia Sét) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('check')}
            className="w-full p-[1.5px] rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 shadow-[0_10px_30px_rgba(168,85,247,0.3)] cursor-pointer overflow-hidden group"
          >
            <div className="bg-slate-950/95 hover:bg-slate-900/80 p-5 rounded-[22px] transition-colors flex items-center justify-between relative overflow-hidden">
              {/* Dynamic shining background overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-30 group-hover:opacity-60 transition-opacity" />
              
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-fuchsia-400 fill-fuchsia-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">Giám Định Website / Tin Nhắn</h4>
                  <p className="text-[9px] text-fuchsia-300 font-black tracking-widest uppercase mt-1 flex items-center font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping mr-1.5" />
                    BẢO VỆ THỜI GIAN THỰC • CÔNG NGHỆ AI LENS
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-fuchsia-400 group-hover:translate-x-1.5 transition-transform duration-300 relative z-10" />
            </div>
          </motion.div>

          {/* Nhiệm Vụ Hằng Ngày */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bento-card p-6 sm:p-8 space-y-5 rounded-3xl border border-slate-800/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                <Gift className="w-4 h-4" />
                <span>Nhiệm Vụ Hôm Nay</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60">
                {completedQuestsCount}/3
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Hoàn thành bài học và thực hành kiểm tra tin nhắn để nhận Kim Cương & XP.
            </p>

            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-850 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedQuestsCount / 3) * 100}%` }}
              />
            </div>

            {onOpenQuests && (
              <button
                onClick={onOpenQuests}
                className="w-full py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Xem Danh Sách Nhiệm Vụ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>

          {/* Lối Tắt Công Cụ Nhanh */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bento-card p-6 sm:p-8 space-y-5 rounded-3xl border border-slate-800/60"
          >
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">Công Cụ Tác Chiến Nhanh</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('check')}
                className="w-full p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-200 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <span>Giám Định Tin Nhắn / URL</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('train', 'arena')}
                className="w-full p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-200 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/50 flex items-center justify-center">
                    <Swords className="w-4 h-4" />
                  </div>
                  <span>Đấu Trường Scam Arena</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </motion.button>

              {onOpenCallSim && (
                <motion.button
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenCallSim}
                  className="w-full p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-200 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/50 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <span>Mô Phỏng Cuộc Gọi Deepfake</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      </div>
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserProfile={userProfile}
      />
    </div>
  );
};
