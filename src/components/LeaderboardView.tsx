import React, { useState } from 'react';
import { Trophy, Globe, MapPin, Award, Flame, Zap, Shield, Sparkles, ChevronRight, Star, Share2, Heart, UserPlus, UserCheck, MessageSquare, Users } from 'lucide-react';
import { UserProfile } from '../types';
import { playSuccessChime } from '../utils/audioEffects';
import { handleAvatarError } from '../utils/avatarFallback';

interface LeaderboardViewProps {
  currentUserProfile: UserProfile;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  tier: 'Tập Sự' | 'Báo Động Đỏ' | 'Dân Chơi Không Bẫy' | 'Hiệp Sĩ An Ninh Mạng';
  streak: number;
  avatar: string;
  isCurrentUser?: boolean;
  followers?: number;
  likes?: number;
  shares?: number;
  socialBadge?: string;
  isFollowing?: boolean;
}

const HIEP_SI_RANKS = [
  { level: 1, name: 'Tập Sự', minXp: 0, maxXp: 500, badge: '🔰', color: 'text-slate-400 bg-slate-800/80 border-slate-700' },
  { level: 2, name: 'Báo Động Đỏ', minXp: 501, maxXp: 2000, badge: '🚨', color: 'text-amber-400 bg-amber-950/80 border-amber-500/50' },
  { level: 3, name: 'Dân Chơi Không Bẫy', minXp: 2001, maxXp: 5000, badge: '🛡️', color: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/50' },
  { level: 4, name: 'Hiệp Sĩ An Ninh Mạng', minXp: 5001, maxXp: 99999, badge: '⚔️', color: 'text-purple-300 bg-purple-950/80 border-purple-500/50' },
];

const GLOBAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Alexandre Vu', xp: 9420, tier: 'Hiệp Sĩ An Ninh Mạng', streak: 142, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Hoàng Minh Tuấn', xp: 8850, tier: 'Hiệp Sĩ An Ninh Mạng', streak: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Nguyễn Thị Mai', xp: 4640, tier: 'Dân Chơi Không Bẫy', streak: 75, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'David Smith', xp: 3920, tier: 'Dân Chơi Không Bẫy', streak: 64, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Trần Văn Hùng', xp: 1850, tier: 'Báo Động Đỏ', streak: 45, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
];

const NATIONAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Hoàng Minh Tuấn (Hà Nội)', xp: 8850, tier: 'Hiệp Sĩ An Ninh Mạng', streak: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Nguyễn Thị Mai (TP.HCM)', xp: 4640, tier: 'Dân Chơi Không Bẫy', streak: 75, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Trần Văn Hùng (Đà Nẵng)', xp: 1850, tier: 'Báo Động Đỏ', streak: 45, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Lê Minh Khôi (Hải Phòng)', xp: 1430, tier: 'Báo Động Đỏ', streak: 30, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Phạm Quỳnh Nga (Cần Thơ)', xp: 420, tier: 'Tập Sự', streak: 22, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
];

const INITIAL_SOCIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Bác Nguyễn Văn Thành', xp: 11200, tier: 'Hiệp Sĩ An Ninh Mạng', streak: 120, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', followers: 2150, likes: 4820, shares: 340, socialBadge: '👵 Vệ Binh Cao Niên Mẫu', isFollowing: true },
  { rank: 2, name: 'Hoàng Minh Tuấn', xp: 9850, tier: 'Hiệp Sĩ An Ninh Mạng', streak: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', followers: 1420, likes: 3290, shares: 285, socialBadge: '🛡️ KOL Phân Tích Phishing', isFollowing: true },
  { rank: 3, name: 'Nguyễn Thị Mai Anh', xp: 7420, tier: 'Dân Chơi Không Bẫy', streak: 75, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', followers: 980, likes: 2150, shares: 190, socialBadge: '⚖️ Chuyên Gia Pháp Lý Scam', isFollowing: true },
  { rank: 4, name: 'Phạm Quỳnh Nga', xp: 4500, tier: 'Dân Chơi Không Bẫy', streak: 45, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', followers: 610, likes: 1420, shares: 95, socialBadge: '🌸 Vệ Binh Cần Thơ', isFollowing: false },
  { rank: 5, name: 'Lê Minh Khôi', xp: 3100, tier: 'Báo Động Đỏ', streak: 30, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', followers: 430, likes: 980, shares: 62, socialBadge: '⚡ Vệ Binh GenZ', isFollowing: false },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUserProfile }) => {
  const [tab, setTab] = useState<'national' | 'global' | 'social'>('national');
  const [socialList, setSocialList] = useState<LeaderboardUser[]>(INITIAL_SOCIAL_LEADERBOARD);

  const list = tab === 'national' ? NATIONAL_LEADERBOARD : (tab === 'global' ? GLOBAL_LEADERBOARD : socialList);

  const handleToggleFollow = (rank: number) => {
    setSocialList(prev => prev.map(item => {
      if (item.rank === rank) {
        const nextState = !item.isFollowing;
        const followerDelta = nextState ? 1 : -1;
        playSuccessChime();
        return {
          ...item,
          isFollowing: nextState,
          followers: (item.followers || 0) + followerDelta,
        };
      }
      return item;
    }));
  };

  const currentXp = currentUserProfile.xp || 1250;
  let currentRankTier = HIEP_SI_RANKS[0];
  if (currentXp >= 5001) currentRankTier = HIEP_SI_RANKS[3];
  else if (currentXp >= 2001) currentRankTier = HIEP_SI_RANKS[2];
  else if (currentXp >= 501) currentRankTier = HIEP_SI_RANKS[1];

  const currentUserEntry: LeaderboardUser = {
    rank: 8,
    name: currentUserProfile.name || 'Bạn',
    xp: currentXp,
    tier: currentRankTier.name as any,
    streak: currentUserProfile.streakDays || 3,
    avatar: currentUserProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    isCurrentUser: true,
    followers: 185,
    likes: 420,
    shares: 38,
    socialBadge: '🛡️ Vệ Binh Tiên Phong',
  };

  const top1 = list[0];
  const top2 = list[1];
  const top3 = list[2];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="cyber-card-neon p-6 sm:p-8 rounded-3xl border-2 border-cyan-500/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="glow-orb-cyan -top-10 -left-10 opacity-60" />
        <div className="glow-orb-pink -bottom-10 -right-10 opacity-50" />

        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(255,230,0,0.3)] flex-shrink-0">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full cyber-badge-gold text-[10px] font-extrabold uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>BẢNG XẾP HẠNG HIỆP SĨ SỐ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white text-glow-gold">Đua Top Hiệp Sĩ An Ninh Mạng</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Vinh danh các Vệ Binh có thành tích học tập & sức ảnh hưởng lan tỏa cộng đồng!
            </p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-cyan-500/40 shrink-0 relative z-10 shadow-lg flex-wrap gap-1">
          <button
            onClick={() => setTab('national')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              tab === 'national' ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Việt Nam</span>
          </button>
          <button
            onClick={() => setTab('global')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              tab === 'global' ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Toàn Cầu</span>
          </button>
          <button
            onClick={() => setTab('social')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              tab === 'social' ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-pink-300" />
            <span>📲 Mạng Xã Hội</span>
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM WIDGET */}
      {top1 && top2 && top3 && (
        <div className="cyber-card-neon p-6 sm:p-8 rounded-3xl border-2 border-cyan-500/40 relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 shadow-2xl">
          <div className="glow-orb-cyan -top-20 left-1/2 -translate-x-1/2 opacity-50" />
          <div className="glow-orb-pink -bottom-20 -right-20 opacity-40" />

          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 relative z-10 text-center sm:text-left">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>WIDGET TOP 3 HIỆP SĨ ({tab === 'national' ? 'VIỆT NAM' : 'TOÀN CẦU'})</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white text-glow-gold">
                Bệ Vinh Danh Tam Đại Hiệp Sĩ
              </h2>
            </div>
            <div className="bg-slate-900/90 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl flex items-center space-x-2 text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(255,230,0,0.15)]">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Thưởng Tuần: +1,000 Đá Quý & Huy Chương Vàng</span>
            </div>
          </div>

          {/* 3 PODIUM COLUMNS */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end justify-center pt-6 pb-2 relative z-10">
            {/* RANK 2 - SILVER */}
            <div className="flex flex-col items-center group">
              <div className="relative mb-3 flex flex-col items-center">
                <span className="text-xl sm:text-2xl mb-1 animate-bounce">🥈</span>
                <div className="relative">
                  <img
                    src={top2.avatar}
                    alt={top2.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleAvatarError(e, top2.name)}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-2 sm:border-4 border-slate-300 object-cover shadow-[0_0_20px_rgba(203,213,225,0.4)] group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-2 -right-1 bg-slate-300 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-white shadow">
                    #2
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-black text-white mt-3 text-center line-clamp-1 max-w-[100px] sm:max-w-[130px]">
                  {top2.name}
                </p>
                <p className="text-[10px] sm:text-xs font-extrabold text-slate-300 flex items-center space-x-1 mt-0.5">
                  <span>{top2.xp.toLocaleString()} XP</span>
                </p>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 mt-1 line-clamp-1">
                  {top2.tier}
                </span>
              </div>
              {/* Podium Base #2 */}
              <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-slate-800/90 via-slate-800/50 to-slate-700/30 rounded-t-2xl border-t-2 border-x border-slate-400/50 flex flex-col items-center justify-center p-2 shadow-lg">
                <span className="text-xl sm:text-3xl font-black text-slate-300">2</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-slate-400 mt-0.5">Á QUÂN 1</span>
              </div>
            </div>

            {/* RANK 1 - GOLD (ELEVATED) */}
            <div className="flex flex-col items-center group -mt-6">
              <div className="relative mb-3 flex flex-col items-center">
                <div className="relative">
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl animate-pulse">👑</span>
                  <img
                    src={top1.avatar}
                    alt={top1.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleAvatarError(e, top1.name)}
                    className="w-18 h-18 sm:w-26 sm:h-26 rounded-2xl border-3 sm:border-4 border-amber-400 object-cover shadow-[0_0_30px_rgba(255,230,0,0.6)] group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-2.5 -right-1 bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-2.5 py-0.5 rounded-full border border-white shadow-lg">
                    #1
                  </span>
                </div>
                <p className="text-sm sm:text-base font-black text-amber-300 mt-3 text-center line-clamp-1 max-w-[110px] sm:max-w-[150px] text-glow-gold">
                  {top1.name}
                </p>
                <p className="text-xs sm:text-sm font-black text-amber-400 flex items-center space-x-1 mt-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{top1.xp.toLocaleString()} XP</span>
                </p>
                <span className="text-[10px] sm:text-xs font-black text-amber-200 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/60 mt-1 shadow-sm line-clamp-1">
                  {top1.tier}
                </span>
              </div>
              {/* Podium Base #1 */}
              <div className="w-full h-32 sm:h-36 bg-gradient-to-t from-amber-950/90 via-amber-900/40 to-amber-500/20 rounded-t-2xl border-t-2 border-x border-amber-400/80 flex flex-col items-center justify-center p-2 shadow-[0_0_25px_rgba(255,230,0,0.2)]">
                <span className="text-2xl sm:text-4xl font-black text-amber-400 text-glow-gold">1</span>
                <span className="text-[10px] sm:text-xs uppercase font-black tracking-wider text-amber-300 mt-0.5">QUÁN QUÂN</span>
              </div>
            </div>

            {/* RANK 3 - BRONZE */}
            <div className="flex flex-col items-center group">
              <div className="relative mb-3 flex flex-col items-center">
                <span className="text-xl sm:text-2xl mb-1">🥉</span>
                <div className="relative">
                  <img
                    src={top3.avatar}
                    alt={top3.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleAvatarError(e, top3.name)}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-2 sm:border-4 border-amber-700 object-cover shadow-[0_0_20px_rgba(217,119,6,0.4)] group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-2 -right-1 bg-amber-700 text-white font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-white shadow">
                    #3
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-black text-white mt-3 text-center line-clamp-1 max-w-[100px] sm:max-w-[130px]">
                  {top3.name}
                </p>
                <p className="text-[10px] sm:text-xs font-extrabold text-amber-500 flex items-center space-x-1 mt-0.5">
                  <span>{top3.xp.toLocaleString()} XP</span>
                </p>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 mt-1 line-clamp-1">
                  {top3.tier}
                </span>
              </div>
              {/* Podium Base #3 */}
              <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-amber-950/80 via-slate-900 to-amber-900/20 rounded-t-2xl border-t-2 border-x border-amber-700/60 flex flex-col items-center justify-center p-2 shadow-lg">
                <span className="text-lg sm:text-2xl font-black text-amber-600">3</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-amber-600 mt-0.5">Á QUÂN 2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Rank Progression Map */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-2">
          <Star className="w-4 h-4 text-amber-400" />
          <span>Hệ Thống Bậc Rank "Hiệp Sĩ Số":</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HIEP_SI_RANKS.map((r) => {
            const isCurrent = currentRankTier.name === r.name;
            return (
              <div
                key={r.name}
                className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all ${r.color} ${
                  isCurrent ? 'ring-2 ring-cyan-400 scale-105 shadow-xl' : 'opacity-80'
                }`}
              >
                <div className="text-2xl">{r.badge}</div>
                <p className="text-xs font-black text-white">{r.name}</p>
                <p className="text-[10px] text-slate-400 font-bold">{r.minXp} - {r.maxXp} XP</p>
                {isCurrent && (
                  <span className="inline-block text-[9px] font-black px-2 py-0.5 rounded bg-cyan-500 text-slate-950 uppercase">
                    CẤP BẬC HIỆN TẠI
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current User Row Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-2 border-cyan-500/60 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-xs">
            #{currentUserEntry.rank}
          </div>
          <img
            src={currentUserEntry.avatar}
            alt={currentUserEntry.name}
            referrerPolicy="no-referrer"
            onError={(e) => handleAvatarError(e, currentUserEntry.name)}
            className="w-11 h-11 rounded-2xl border-2 border-cyan-400 object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-white">{currentUserEntry.name}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {currentRankTier.badge} {currentUserEntry.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400">Streak: {currentUserEntry.streak} Ngày An Toàn 🔥</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-amber-400">{currentUserEntry.xp} XP</p>
          <p className="text-[10px] text-slate-400">Xếp hạng hiện tại</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/90 shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Hạng & Tên Hiệp Sĩ</span>
          <span>{tab === 'social' ? 'Mạng Xã Hội & Followers' : 'Cấp Bậc & XP'}</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {list.map((u) => (
            <div
              key={u.rank}
              className={`flex items-center justify-between px-6 py-4 transition-colors ${
                u.rank <= 3 ? 'bg-slate-900/80' : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center ${
                    u.rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                      : u.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : u.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {u.rank}
                </div>
                <img
                  src={u.avatar}
                  alt={u.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleAvatarError(e, u.name)}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold text-white">{u.name}</p>
                    {u.socialBadge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950/80 text-cyan-300 border border-indigo-500/30">
                        {u.socialBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400 inline" />
                      <span>{u.streak}d Streak</span>
                    </span>
                    {tab === 'social' && (
                      <>
                        <span>•</span>
                        <span className="text-pink-300 font-bold flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                          <span>{u.likes?.toLocaleString()} Lượt thích</span>
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-right">
                {tab === 'social' ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs font-black text-cyan-300 block font-mono">
                        {u.followers?.toLocaleString()} Followers
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {u.shares} lượt chia sẻ
                      </span>
                    </div>
                    {!u.isCurrentUser && (
                      <button
                        onClick={() => handleToggleFollow(u.rank)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                          u.isFollowing
                            ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                            : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-sm font-black'
                        }`}
                      >
                        {u.isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Đang theo dõi</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Theo dõi</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-cyan-300 border border-slate-700 mb-1">
                      {u.tier}
                    </span>
                    <p className="text-sm font-black text-amber-400">{u.xp} XP</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
