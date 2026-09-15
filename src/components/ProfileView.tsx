import React, { useState } from 'react';
import { User, Shield, Flame, Sparkles, LogOut, Key, Mail, CheckCircle2, Palette, Check, Sliders } from 'lucide-react';
import { UserProfile, UserAccount } from '../types';
import { THEME_PRESETS, ThemePresetId, ThemeConfig, applyThemePreset } from '../utils/themeManager';

interface ProfileViewProps {
  userProfile: UserProfile;
  currentUser: UserAccount | null;
  currentThemeConfig?: ThemeConfig;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenTheme?: () => void;
  onUpdateThemeConfig?: (config: ThemeConfig) => void;
  onNavigate?: (tab: string, sub?: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  currentUser,
  currentThemeConfig,
  onOpenAuth,
  onLogout,
  onOpenTheme,
  onUpdateThemeConfig,
  onNavigate,
}) => {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
        <div className="w-20 h-20 rounded-3xl bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center text-blue-400 text-3xl font-black shadow-xl shrink-0">
          <User className="w-10 h-10" />
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-white">{currentUser?.name || userProfile.name || 'Vệ Binh Khách'}</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              {currentUser ? 'Đã Đồng Bộ Đám Mây' : 'Chế Độ Khách'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {currentUser?.email || 'Đăng nhập tài khoản để đồng bộ tiến trình học tập và chuỗi ngày phòng thủ trên mọi thiết bị.'}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate?.('progress', 'milestones')}
          className={`glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/90 text-center space-y-1 shadow-md transition-all ${
            onNavigate ? 'cursor-pointer hover:border-cyan-500/50 hover:bg-slate-850 group' : ''
          }`}
          title="Xem Cột Mốc Danh Dự & Huy Hiệu Điểm Số"
        >
          <Shield className="w-5 h-5 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
          <div className="text-xl font-black text-white">{userProfile.overallScore ?? 0}%</div>
          <div className="text-[11px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
            <span>Điểm Phòng Thủ</span>
            {onNavigate && <span className="text-[10px] text-cyan-400">→</span>}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/90 text-center space-y-1 shadow-md">
          <Flame className="w-5 h-5 text-amber-400 mx-auto fill-amber-400" />
          <div className="text-xl font-black text-amber-400 font-mono">{userProfile.streakDays ?? 0}</div>
          <div className="text-[11px] text-slate-400 font-bold uppercase">Chuỗi Ngày</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/90 text-center space-y-1 shadow-md">
          <Sparkles className="w-5 h-5 text-cyan-400 mx-auto fill-cyan-400" />
          <div className="text-xl font-black text-cyan-300 font-mono">{userProfile.xp ?? 0}</div>
          <div className="text-[11px] text-slate-400 font-bold uppercase">Điểm XP</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/90 text-center space-y-1 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-purple-400 mx-auto" />
          <div className="text-xl font-black text-purple-300 font-mono">
            {userProfile.completedScenarios?.length ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 font-bold uppercase">Đòn Đã Giải Phẫu</div>
        </div>
      </div>

      {/* Theme & Visual Appearance Customization Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Tùy Biến Giao Diện & Màu Sắc</h3>
              <p className="text-xs text-slate-400">
                Lựa chọn giữa 10+ chủ đề tương lai, ánh sáng neon, chế độ sáng và hỗ trợ thị giác.
              </p>
            </div>
          </div>

          {onOpenTheme && (
            <button
              onClick={onOpenTheme}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Mở Studio Tùy Biến</span>
            </button>
          )}
        </div>

        {/* Quick 1-click preset switches */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          {(
            [
              'cyberpunk',
              'emerald_matrix',
              'synthwave_purple',
              'solar_amber',
              'crimson_alert',
              'ocean_sapphire',
              'sakura_cyber',
              'oled_black',
              'clean_light',
              'nordic_forest',
            ] as ThemePresetId[]
          ).map((presetId) => {
            const preset = THEME_PRESETS[presetId];
            const isSelected = currentThemeConfig?.preset === presetId && !currentThemeConfig?.customMode;

            return (
              <button
                key={presetId}
                onClick={() => {
                  if (currentThemeConfig && onUpdateThemeConfig) {
                    const updated = applyThemePreset(presetId, currentThemeConfig);
                    onUpdateThemeConfig(updated);
                  } else if (onOpenTheme) {
                    onOpenTheme();
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-800 shadow-md'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: preset.bgSurface }}
                    />
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                </div>
                <div className="text-xs font-bold text-slate-200 truncate">{preset.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auth Control Actions */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 space-y-5 shadow-xl">
        <h3 className="text-base font-black text-white">Quản Lý Tài Khoản Vệ Binh</h3>

        {!currentUser ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Tạo hồ sơ cá nhân ngay hôm nay để bảo vệ kết quả học tập và tham gia bảng xếp hạng toàn quốc.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenAuth}
                className="flex-1 py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer text-center"
              >
                Tạo Hồ Sơ Mới
              </button>
              <button
                onClick={onOpenAuth}
                className="flex-1 py-3 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer text-center"
              >
                Đăng Nhập Tài Khoản
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-white">{currentUser.email}</p>
                  <p className="text-[10px] text-emerald-400">Trạng thái: Hoạt động an toàn</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                Đã xác thực
              </span>
            </div>

            <button
              onClick={onLogout}
              className="py-3 px-6 rounded-2xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs uppercase tracking-wider border border-rose-800 shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất Tài Khoản</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
