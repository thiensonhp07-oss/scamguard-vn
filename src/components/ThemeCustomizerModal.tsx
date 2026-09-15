/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  Eye,
  Sun,
  Moon,
  Zap,
  Grid,
  Maximize2,
  Shield,
  Layers,
  Circle,
  X,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ThemeConfig,
  ThemePresetId,
  THEME_PRESETS,
  QUICK_ACCENT_COLORS,
  QUICK_BG_COLORS,
  GlowIntensity,
  BgPatternStyle,
  BorderRadiusStyle,
  UiDensity,
  ColorBlindMode,
  DEFAULT_THEME_CONFIG,
  applyThemePreset,
  saveThemeConfig,
} from '../utils/themeManager';
import { playSuccessChime } from '../utils/audioEffects';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: ThemeConfig;
  onConfigChange: (newConfig: ThemeConfig) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onConfigChange,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom_color' | 'effects' | 'accessibility'>('presets');
  const [presetCategory, setPresetCategory] = useState<'all' | 'cyber' | 'tactical' | 'natural' | 'minimal'>('all');

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: ThemePresetId) => {
    playSuccessChime();
    const updated = applyThemePreset(presetId, currentConfig);
    onConfigChange(updated);
  };

  const handleUpdateConfig = (updates: Partial<ThemeConfig>) => {
    const updated = {
      ...currentConfig,
      ...updates,
      customMode: updates.accentColor || updates.bgBase ? true : currentConfig.customMode,
    };
    saveThemeConfig(updated);
    onConfigChange(updated);
  };

  const handleReset = () => {
    playSuccessChime();
    saveThemeConfig(DEFAULT_THEME_CONFIG);
    onConfigChange(DEFAULT_THEME_CONFIG);
  };

  const presetsList = Object.values(THEME_PRESETS).filter(
    (p) => presetCategory === 'all' || p.category === presetCategory
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          style={{
            borderColor: `rgba(var(--theme-accent-rgb), 0.4)`,
            boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(var(--theme-accent-rgb), 0.25)`,
          }}
        >
          {/* Header Bar */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center space-x-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${currentConfig.accentColor} 0%, ${currentConfig.accentSecondary} 100%)`,
                  boxShadow: `0 0 16px rgba(var(--theme-accent-rgb), 0.5)`,
                }}
              >
                <Palette className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-black text-white tracking-tight">Tùy Biến Giao Diện & Màu Sắc</h2>
                  <span
                    className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono"
                    style={{
                      backgroundColor: `rgba(var(--theme-accent-rgb), 0.15)`,
                      color: currentConfig.accentColor,
                      border: `1px solid rgba(var(--theme-accent-rgb), 0.4)`,
                    }}
                  >
                    {THEME_PRESETS[currentConfig.preset]?.name || 'Tùy chỉnh'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Tùy biến bảng màu, hiệu ứng ánh sáng neon, họa tiết nền và độ tương phản trợ năng theo sở thích.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer border border-slate-700"
                title="Khôi phục về mặc định Cyberpunk 2026"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mặc Định</span>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer border border-slate-700/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800/80 flex flex-wrap gap-2">
            {[
              { id: 'presets', label: '🎨 10+ CHỦ ĐỀ SẮC MÀU', icon: Sparkles },
              { id: 'custom_color', label: '🖌️ PHỐI MÀU TỰ DO', icon: Sliders },
              { id: 'effects', label: '⚡ HIỆU ỨNG & NỀN', icon: Zap },
              { id: 'accessibility', label: '👁️ TRỢ NĂNG & MẮT', icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  style={
                    isActive
                      ? {
                          borderBottom: `2px solid ${currentConfig.accentColor}`,
                          color: currentConfig.accentColor,
                        }
                      : {}
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {/* Live Interactive Preview Card */}
            <div
              className="p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: currentConfig.bgSurface,
                borderColor: `rgba(var(--theme-accent-rgb), 0.35)`,
                borderRadius:
                  currentConfig.borderRadius === 'sharp'
                    ? '6px'
                    : currentConfig.borderRadius === 'pill'
                    ? '28px'
                    : '16px',
                boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 25px -5px rgba(var(--theme-accent-rgb), ${
                  currentConfig.glowIntensity === 'none'
                    ? '0'
                    : currentConfig.glowIntensity === 'subtle'
                    ? '0.15'
                    : currentConfig.glowIntensity === 'ultra'
                    ? '0.5'
                    : '0.3'
                })`,
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" style={{ color: currentConfig.accentColor }} />
                    Xem Trước Trực Tiếp (Live Real-Time Preview)
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    Lá Chắn An Ninh ScamGuard
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{
                        backgroundColor: `rgba(var(--theme-accent-rgb), 0.18)`,
                        color: currentConfig.accentColor,
                        border: `1px solid rgba(var(--theme-accent-rgb), 0.5)`,
                      }}
                    >
                      Bảo Vệ Chủ Động
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 font-medium max-w-xl">
                    Hệ thống phản xạ AI phát hiện 99.8% mã độc, bóc tách kịch bản dọa nạt và bảo vệ dữ liệu cá nhân.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => playSuccessChime()}
                    className="flex-1 sm:flex-initial px-4 py-2.5 font-black text-xs uppercase tracking-wider text-slate-950 transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${currentConfig.accentColor} 0%, ${currentConfig.accentSecondary} 100%)`,
                      borderRadius:
                        currentConfig.borderRadius === 'sharp'
                          ? '4px'
                          : currentConfig.borderRadius === 'pill'
                          ? '9999px'
                          : '12px',
                      boxShadow: `0 4px 15px rgba(var(--theme-accent-rgb), 0.4)`,
                    }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Nút Thử Nghiệm</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TAB 1: 10+ CURATED PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-4">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {[
                    { id: 'all', label: 'Tất Cả (10)' },
                    { id: 'cyber', label: '⚡ Cyber & Neon' },
                    { id: 'tactical', label: '🛡️ Tác Chiến & Báo Động' },
                    { id: 'minimal', label: '✨ Tối Giản & Sáng' },
                    { id: 'natural', label: '🌿 Sinh Thái Dịu Mắt' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPresetCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        presetCategory === cat.id
                          ? 'bg-slate-700 text-white border border-slate-600 shadow'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Preset Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {presetsList.map((preset) => {
                    const isSelected = currentConfig.preset === preset.id && !currentConfig.customMode;
                    return (
                      <motion.div
                        key={preset.id}
                        whileHover={{ scale: 1.015, y: -2 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-800/90 shadow-xl'
                            : 'bg-slate-950/70 hover:bg-slate-900/90 border-slate-800'
                        }`}
                        style={{
                          borderColor: isSelected ? preset.accentColor : undefined,
                          boxShadow: isSelected
                            ? `0 8px 25px -4px rgba(0, 0, 0, 0.7), 0 0 20px -3px ${preset.accentColor}55`
                            : undefined,
                        }}
                      >
                        {/* Top Info */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-black text-white">{preset.nameVi}</span>
                              {preset.isLight && (
                                <Sun className="w-3.5 h-3.5 text-amber-400" title="Chế độ sáng" />
                              )}
                            </div>
                            {isSelected ? (
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                                style={{ backgroundColor: preset.accentColor }}
                              >
                                <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                                {preset.badge}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">{preset.descriptionVi}</p>
                        </div>

                        {/* Palette Color Swatches Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <div
                              className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                              style={{ backgroundColor: preset.accentColor }}
                              title={`Màu chính: ${preset.accentColor}`}
                            />
                            <div
                              className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                              style={{ backgroundColor: preset.accentSecondary }}
                              title={`Màu phụ: ${preset.accentSecondary}`}
                            />
                            <div
                              className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                              style={{ backgroundColor: preset.bgSurface }}
                              title={`Nền card: ${preset.bgSurface}`}
                            />
                            <div
                              className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                              style={{ backgroundColor: preset.bgBase }}
                              title={`Nền sâu: ${preset.bgBase}`}
                            />
                          </div>

                          <span
                            className="text-[11px] font-bold"
                            style={{ color: preset.accentColor }}
                          >
                            {isSelected ? 'Đang kích hoạt ✓' : 'Bấm để áp dụng'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM COLOR STUDIO */}
            {activeTab === 'custom_color' && (
              <div className="space-y-6">
                {/* Accent Color Picker */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: currentConfig.accentColor }}
                        />
                        Màu Chủ Đạo Giao Diện (Primary Accent Color)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Áp dụng cho tiêu đề phát sáng, đường viền neon, nút bấm chính và biểu tượng cấp cao.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="custom-accent-picker"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer border border-slate-700"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Mã Màu Tự Do</span>
                        <input
                          id="custom-accent-picker"
                          type="color"
                          value={currentConfig.accentColor}
                          onChange={(e) => handleUpdateConfig({ accentColor: e.target.value })}
                          className="w-0 h-0 opacity-0 absolute"
                        />
                      </label>
                      <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        {currentConfig.accentColor}
                      </span>
                    </div>
                  </div>

                  {/* 16 Quick Accent Swatches */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                    {QUICK_ACCENT_COLORS.map((item) => {
                      const isMatch = currentConfig.accentColor.toLowerCase() === item.hex.toLowerCase();
                      return (
                        <button
                          key={item.hex}
                          onClick={() => handleUpdateConfig({ accentColor: item.hex })}
                          className={`group flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer ${
                            isMatch
                              ? 'bg-slate-800 border-white/60 shadow-lg'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                            style={{
                              backgroundColor: item.hex,
                              boxShadow: `0 0 10px ${item.hex}60`,
                            }}
                          >
                            {isMatch && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 mt-1.5 truncate max-w-full">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Color Picker */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: currentConfig.accentSecondary }}
                        />
                        Màu Phụ Gradient (Secondary Accent Color)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Tạo dải chuyển màu mượt mà khi kết hợp cùng màu chủ đạo trên các nút bấm 3D.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="custom-secondary-picker"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer border border-slate-700"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Chọn Màu Phụ</span>
                        <input
                          id="custom-secondary-picker"
                          type="color"
                          value={currentConfig.accentSecondary}
                          onChange={(e) => handleUpdateConfig({ accentSecondary: e.target.value })}
                          className="w-0 h-0 opacity-0 absolute"
                        />
                      </label>
                      <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        {currentConfig.accentSecondary}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Background Base Tone Picker */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <Moon className="w-4 h-4 text-cyan-400" />
                        Tông Màu Nền Toàn Trang (Background Atmosphere)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Chọn không gian nền tối chuyên sâu hoặc giao diện nền sáng làm việc.
                      </p>
                    </div>

                    <label
                      htmlFor="custom-bg-picker"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer border border-slate-700"
                    >
                      <span>Mã Nền</span>
                      <input
                        id="custom-bg-picker"
                        type="color"
                        value={currentConfig.bgBase}
                        onChange={(e) => handleUpdateConfig({ bgBase: e.target.value })}
                        className="w-0 h-0 opacity-0 absolute"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {QUICK_BG_COLORS.map((bg) => {
                      const isMatch = currentConfig.bgBase.toLowerCase() === bg.hex.toLowerCase();
                      return (
                        <button
                          key={bg.hex}
                          onClick={() =>
                            handleUpdateConfig({
                              bgBase: bg.hex,
                              bgSurface: bg.isLight ? '#ffffff' : '#0f172a',
                            })
                          }
                          className={`p-3 rounded-xl border flex items-center space-x-3 transition-all cursor-pointer ${
                            isMatch
                              ? 'border-cyan-400 bg-slate-800 shadow-md'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-lg border border-slate-700 shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: bg.hex }}
                          >
                            {isMatch && (
                              <Check
                                className={`w-3.5 h-3.5 ${
                                  bg.isLight ? 'text-slate-950' : 'text-cyan-400'
                                } stroke-[3]`}
                              />
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-300 truncate">{bg.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VISUAL FX, GLOW & PATTERNS */}
            {activeTab === 'effects' && (
              <div className="space-y-6">
                {/* Glow Intensity */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Cường Độ Ánh Sáng Neon (Glow & Aura Intensity)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Điều chỉnh độ rực rỡ của hào quang ánh sáng bao quanh các thành phần bảo mật.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'none', label: '🚫 Tắt Glow', desc: 'Giao diện phẳng hoàn toàn' },
                      { id: 'subtle', label: '🌙 Dịu Nhẹ', desc: 'Ánh sáng êm 25%' },
                      { id: 'normal', label: '⚡ Chuẩn Cyber', desc: 'Rực rỡ tiêu chuẩn 60%' },
                      { id: 'ultra', label: '🌟 Siêu Rực Rỡ', desc: 'Hiệu ứng tối đa 100%' },
                    ].map((item) => {
                      const isMatch = currentConfig.glowIntensity === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleUpdateConfig({ glowIntensity: item.id as GlowIntensity })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isMatch
                              ? 'border-cyan-400 bg-slate-800 shadow-md'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-black text-white">{item.label}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background Pattern Style */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Grid className="w-4 h-4 text-cyan-400" />
                    Họa Tiết Nền Tương Tác (Background Pattern Texture)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Họa tiết phủ nền công nghệ cao chuyển động nhẹ nhàng theo không gian.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { id: 'grid', label: '📐 Lưới Tọa Độ', desc: 'Cyber Matrix Grid' },
                      { id: 'dots', label: '🔘 Hạt Tinh Thể', desc: 'Dense Nano Dots' },
                      { id: 'hex', label: '⬡ Tổ Ong Hex', desc: 'Bio-Shield Hexagon' },
                      { id: 'scanlines', label: '📺 Laser Scan', desc: 'CRT Scanlines' },
                      { id: 'none', label: '🔲 Trơn Tối Giản', desc: 'Không họa tiết' },
                    ].map((item) => {
                      const isMatch = currentConfig.bgPattern === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleUpdateConfig({ bgPattern: item.id as BgPatternStyle })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isMatch
                              ? 'border-cyan-400 bg-slate-800 shadow-md'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-black text-white">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Border Radius Style */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-purple-400" />
                    Độ Bo Góc Giao Diện (Corner Geometry)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Phong cách thiết kế góc cạnh vi mạch Cyber hoặc bo tròn mềm mại thân thiện.
                  </p>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'sharp', label: '📐 Vuông Cyber (4px)', desc: 'Góc cạnh vi mạch sắc nét' },
                      { id: 'standard', label: '🔲 Tiêu Chuẩn (16px)', desc: 'Hiện đại cân bằng hài hòa' },
                      { id: 'pill', label: '💊 Bo Tròn Tactile (28px)', desc: 'Duolingo 3D hữu cơ mềm mại' },
                    ].map((item) => {
                      const isMatch = currentConfig.borderRadius === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleUpdateConfig({ borderRadius: item.id as BorderRadiusStyle })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isMatch
                              ? 'border-cyan-400 bg-slate-800 shadow-md'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-black text-white">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ACCESSIBILITY & VISION MODES */}
            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                {/* Vision / Color Blindness Simulator */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    Chế Độ Hỗ Trợ Khiếm Thị Màu (Color Vision Accessibility)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Tối ưu hóa quang phổ màu sắc cho người dùng mắc các hội chứng mù màu quang học.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'none', label: '👁️ Thị Lực Bình Thường', desc: 'Hiển thị dải màu nguyên bản' },
                      { id: 'protanopia', label: '🔴 Chế độ Protanopia', desc: 'Hiệu chỉnh giảm nhạy cảm sắc đỏ' },
                      { id: 'deuteranopia', label: '🟢 Chế độ Deuteranopia', desc: 'Hiệu chỉnh giảm nhạy cảm sắc xanh lục' },
                      { id: 'tritanopia', label: '🔵 Chế độ Tritanopia', desc: 'Hiệu chỉnh giảm nhạy cảm sắc xanh lam' },
                      { id: 'high_contrast', label: '⚡ Siêu Tương Phản', desc: 'Tăng 135% tương phản sáng tối' },
                    ].map((item) => {
                      const isMatch = currentConfig.colorBlindMode === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleUpdateConfig({ colorBlindMode: item.id as ColorBlindMode })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isMatch
                              ? 'border-emerald-400 bg-slate-800 shadow-md'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-black text-white">{item.label}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* UI Density & Font Scale */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Mật Độ Hiển Thị & Kích Thước Chữ (UI Density)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Điều chỉnh cỡ chữ và khoảng cách các thành phần để đọc dễ dàng hơn.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'compact', label: '🔍 Nhỏ Gọn (Compact)', desc: 'Nhiều nội dung hơn trên màn hình' },
                      { id: 'comfortable', label: '📱 Tiêu Chuẩn (Comfortable)', desc: 'Kích thước chuẩn hài hòa' },
                      { id: 'accessible_large', label: '👓 To Rõ (Accessible Large)', desc: 'Chữ to rõ ràng, tối ưu cho người lớn tuổi' },
                    ].map((item) => {
                      const isMatch = currentConfig.uiDensity === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleUpdateConfig({ uiDensity: item.id as UiDensity })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isMatch
                              ? 'border-cyan-400 bg-slate-800 shadow-md'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-black text-white">{item.label}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Tự động lưu và đồng bộ trên mọi phiên học tập</span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 font-black text-xs uppercase tracking-wider text-slate-950 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${currentConfig.accentColor} 0%, ${currentConfig.accentSecondary} 100%)`,
                boxShadow: `0 4px 15px rgba(var(--theme-accent-rgb), 0.4)`,
              }}
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
