import React from 'react';
import {
  Flame,
  Sparkles,
  Heart,
  Lock,
  Gift,
  Shield,
  Award,
  User,
  Trophy,
} from 'lucide-react';
import { UserProfile, UserAccount } from '../types';
import { handleAvatarError } from '../utils/avatarFallback';

interface DuolingoRightSidebarProps {
  userProfile: UserProfile;
  currentUser?: UserAccount | null;
  onNavigate: (tab: 'home' | 'train' | 'leaderboard' | 'quests' | 'store' | 'profile' | 'more') => void;
  onOpenAuth: () => void;
  onOpenStreak?: () => void;
}

export const DuolingoRightSidebar: React.FC<DuolingoRightSidebarProps> = ({
  userProfile,
  currentUser,
  onNavigate,
  onOpenAuth,
  onOpenStreak,
}) => {
  return (
    <aside className="hidden lg:flex flex-col w-80 bg-slate-950 border-l border-slate-800/80 p-5 sticky top-0 h-screen select-none space-y-5 overflow-y-auto">
      {/* 1. Top Metrics Bar (Streak & XP) */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-sm">
        <button
          onClick={onOpenStreak}
          className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 font-bold text-xs p-1.5 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer flex-1 justify-center bg-amber-500/10 border border-amber-500/30"
          title="Chuỗi ngày rèn luyện liên tục - Bấm để xem chi tiết"
        >
          <Flame className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
          <span className="font-mono text-sm font-black">{userProfile.streakDays || 1} Ngày Streak</span>
        </button>

        <button
          onClick={() => onNavigate('leaderboard')}
          className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold text-xs p-1.5 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer ml-2 px-3"
          title="Cột mốc kinh nghiệm XP"
        >
          <Award className="w-4 h-4 text-cyan-400" />
          <span className="font-mono">{userProfile.xp || 1450} XP</span>
        </button>
      </div>

      {/* 2. Leaderboard Card (Navigates to standalone Leaderboard page) */}
      <div
        onClick={() => onNavigate('leaderboard')}
        className="cyber-card-neon rounded-2xl border border-cyan-500/40 p-4 space-y-3 cursor-pointer hover:border-cyan-400/80 transition-all shadow-md group relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
              Bảng Xếp Hạng Vệ Binh
            </h3>
          </div>
          <span className="text-[10px] font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
            TOP 3
          </span>
        </div>

        {/* Top 3 Avatars Mini Widget Preview */}
        <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center -space-x-2">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Top 1"
              referrerPolicy="no-referrer"
              onError={(e) => handleAvatarError(e, 'Hoàng Minh Tuấn')}
              className="w-8 h-8 rounded-full border-2 border-amber-400 object-cover z-30 shadow-[0_0_10px_rgba(255,230,0,0.5)]"
              title="#1 Hoàng Minh Tuấn (8,850 XP)"
            />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              alt="Top 2"
              referrerPolicy="no-referrer"
              onError={(e) => handleAvatarError(e, 'Nguyễn Thị Mai')}
              className="w-7 h-7 rounded-full border-2 border-slate-300 object-cover z-20 shadow"
              title="#2 Nguyễn Thị Mai (7,640 XP)"
            />
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
              alt="Top 3"
              referrerPolicy="no-referrer"
              onError={(e) => handleAvatarError(e, 'Trần Văn Hùng')}
              className="w-6 h-6 rounded-full border-2 border-amber-700 object-cover z-10 opacity-90"
              title="#3 Trần Văn Hùng (6,150 XP)"
            />
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Vị Trí Của Bạn</span>
            <span className="text-xs font-black text-cyan-300">#8 • {userProfile.xp || 1250} XP</span>
          </div>
        </div>
      </div>

      {/* 3. Daily Quests Card (Navigates to Quests page) */}
      <div
        onClick={() => onNavigate('quests')}
        className="glass-card rounded-2xl border border-slate-800 p-4 space-y-3 cursor-pointer hover:border-slate-700 transition-all shadow-md group"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">
            Nhiệm vụ hằng ngày
          </h3>
          <span className="text-xs font-bold text-cyan-400 hover:underline">XEM TẤT CẢ</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center space-x-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Kiếm 10 KN</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">10 / 10</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div className="h-full bg-amber-400 rounded-full w-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* 4. Auth / Profile Card */}
      {!currentUser ? (
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 space-y-3 shadow-md">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
              Đồng Bộ Tiến Trình
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Lưu chuỗi ngày an toàn, điểm SDI và huy hiệu bảo mật lên đám mây mã hóa.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md transition-all cursor-pointer text-center font-mono"
            >
              TẠO HỒ SƠ
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer text-center font-mono"
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => onNavigate('profile')}
          className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3.5 space-y-2 shadow-md cursor-pointer hover:border-cyan-500/40 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate font-mono">{currentUser.name || currentUser.username}</p>
              <p className="text-[10px] text-emerald-400 font-mono font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span>Đã Đồng Bộ Cloud</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Utility Footer Links */}
      <div className="pt-2 text-[10px] text-slate-500 space-y-1.5 font-mono">
        <div className="flex flex-wrap gap-x-2.5 gap-y-1 font-medium text-[11px]">
          <button onClick={() => onNavigate('learn')} className="hover:text-slate-300 transition-colors cursor-pointer">GIỚI THIỆU</button>
          <button onClick={() => onNavigate('train', 'arena')} className="hover:text-slate-300 transition-colors cursor-pointer">ĐẤU TRƯỜNG</button>
          <button onClick={() => onNavigate('more')} className="hover:text-slate-300 transition-colors cursor-pointer">CÔNG CỤ</button>
        </div>
        <p className="text-[10px] text-slate-600">ScamGuard Cyber Telemetry Engine © 2026</p>
      </div>
    </aside>
  );
};
