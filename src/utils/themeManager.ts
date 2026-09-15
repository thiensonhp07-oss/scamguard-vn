/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemePresetId =
  | 'cyberpunk'
  | 'emerald_matrix'
  | 'synthwave_purple'
  | 'solar_amber'
  | 'crimson_alert'
  | 'ocean_sapphire'
  | 'sakura_cyber'
  | 'clean_light'
  | 'oled_black'
  | 'nordic_forest';

export type GlowIntensity = 'none' | 'subtle' | 'normal' | 'ultra';
export type BgPatternStyle = 'grid' | 'dots' | 'hex' | 'scanlines' | 'none';
export type CardGlassStyle = 'glass' | 'solid' | 'neon_glow';
export type BorderRadiusStyle = 'sharp' | 'standard' | 'pill';
export type UiDensity = 'compact' | 'comfortable' | 'accessible_large';
export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high_contrast';

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  nameVi: string;
  category: 'cyber' | 'tactical' | 'natural' | 'minimal';
  accentColor: string;
  accentSecondary: string;
  bgBase: string;
  bgSurface: string;
  textBase: string;
  textMuted: string;
  descriptionVi: string;
  badge: string;
  isLight?: boolean;
}

export interface ThemeConfig {
  preset: ThemePresetId;
  accentColor: string;
  accentSecondary: string;
  bgBase: string;
  bgSurface: string;
  glowIntensity: GlowIntensity;
  bgPattern: BgPatternStyle;
  cardGlass: CardGlassStyle;
  borderRadius: BorderRadiusStyle;
  uiDensity: UiDensity;
  colorBlindMode: ColorBlindMode;
  customMode: boolean; // if true, user customized individual colors
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk 2026',
    nameVi: 'Cyberpunk 2026 (Neon Cyan)',
    category: 'cyber',
    accentColor: '#00f3ff',
    accentSecondary: '#0284c7',
    bgBase: '#050811',
    bgSurface: '#0f172a',
    textBase: '#f1f5f9',
    textMuted: '#94a3b8',
    descriptionVi: 'Màu xanh Cyan điện quang tương lai trên nền vũ trụ mạng huyền bí.',
    badge: 'Mặc Định Tinh Nhuệ',
  },
  emerald_matrix: {
    id: 'emerald_matrix',
    name: 'Emerald Matrix',
    nameVi: 'Ma Trận Lục Bảo (Matrix Sentinel)',
    category: 'tactical',
    accentColor: '#10b981',
    accentSecondary: '#047857',
    bgBase: '#03140e',
    bgSurface: '#072419',
    textBase: '#ecfdf5',
    textMuted: '#6ee7b7',
    descriptionVi: 'Lấy cảm hứng từ hệ thống mã hóa ma trận phòng vệ sinh học và blockchain.',
    badge: 'An Toàn Sinh Học',
  },
  synthwave_purple: {
    id: 'synthwave_purple',
    name: 'Synthwave Tokyo',
    nameVi: 'Tím Neon Tokyo (Synthwave 80s)',
    category: 'cyber',
    accentColor: '#d946ef',
    accentSecondary: '#8b5cf6',
    bgBase: '#12071f',
    bgSurface: '#240f3b',
    textBase: '#fae8ff',
    textMuted: '#d8b4fe',
    descriptionVi: 'Ánh sáng neon tím - hồng Retro-Wave huyền ảo, rực rỡ và đầy cuốn hút.',
    badge: 'Retro Tương Lai',
  },
  solar_amber: {
    id: 'solar_amber',
    name: 'Solar Flare Amber',
    nameVi: 'Hổ Phách Hoàng Kim (Solar Guard)',
    category: 'tactical',
    accentColor: '#f59e0b',
    accentSecondary: '#d97706',
    bgBase: '#170e03',
    bgSurface: '#2b1a07',
    textBase: '#fffbeb',
    textMuted: '#fcd34d',
    descriptionVi: 'Màu vàng kim ấm áp, thể hiện sự uy nghiêm, vững chãi của lá chắn bảo mật.',
    badge: 'Hoàng Gia Bảo Vệ',
  },
  crimson_alert: {
    id: 'crimson_alert',
    name: 'Crimson Alert',
    nameVi: 'Huyết Hồng Tác Chiến (Crimson Alert)',
    category: 'tactical',
    accentColor: '#ef4444',
    accentSecondary: '#b91c1c',
    bgBase: '#170505',
    bgSurface: '#2e0b0b',
    textBase: '#fef2f2',
    textMuted: '#fca5a5',
    descriptionVi: 'Chế độ tác chiến phòng không khẩn cấp, kích thích tập trung cao độ.',
    badge: 'Báo Động Đỏ',
  },
  ocean_sapphire: {
    id: 'ocean_sapphire',
    name: 'Ocean Sapphire',
    nameVi: 'Hải Lam Thẳm Sâu (Deep Sapphire)',
    category: 'minimal',
    accentColor: '#38bdf8',
    accentSecondary: '#2563eb',
    bgBase: '#040d21',
    bgSurface: '#091c44',
    textBase: '#f0f9ff',
    textMuted: '#7dd3fc',
    descriptionVi: 'Màu xanh đại dương thâm trầm, phong thái chuẩn mực của tập đoàn an ninh.',
    badge: 'Chuyên Nghiệp',
  },
  sakura_cyber: {
    id: 'sakura_cyber',
    name: 'Sakura Cyber',
    nameVi: 'Anh Đào Công Nghệ (Cyber Sakura)',
    category: 'cyber',
    accentColor: '#fb7185',
    accentSecondary: '#e11d48',
    bgBase: '#190610',
    bgSurface: '#2e0e1e',
    textBase: '#fff1f2',
    textMuted: '#fda4af',
    descriptionVi: 'Sắc hồng hoa anh đào kết hợp kỹ thuật số tinh tế, êm dịu và hiện đại.',
    badge: 'Tinh Tế & Nhẹ Nhàng',
  },
  oled_black: {
    id: 'oled_black',
    name: 'OLED True Black',
    nameVi: 'Đen Tuyệt Đối OLED (True Black)',
    category: 'minimal',
    accentColor: '#22d3ee',
    accentSecondary: '#64748b',
    bgBase: '#000000',
    bgSurface: '#0a0a0a',
    textBase: '#ffffff',
    textMuted: '#94a3b8',
    descriptionVi: 'Nền đen thuần khiết 100%, tắt hoàn toàn điểm ảnh OLED để tiết kiệm pin tối đa.',
    badge: 'Siêu Tiết Kiệm Pin',
  },
  clean_light: {
    id: 'clean_light',
    name: 'Clean Light Slate',
    nameVi: 'Giao Diện Sáng Sang Trọng (Clean Light)',
    category: 'minimal',
    accentColor: '#2563eb',
    accentSecondary: '#1d4ed8',
    bgBase: '#f1f5f9',
    bgSurface: '#ffffff',
    textBase: '#0f172a',
    textMuted: '#64748b',
    descriptionVi: 'Giao diện nền sáng Slate dịu mắt, sang trọng với sắc xanh Sapphire & độ tương phản chuẩn mực.',
    badge: 'Sáng Thanh Lịch & Dịu Mắt',
    isLight: true,
  },
  nordic_forest: {
    id: 'nordic_forest',
    name: 'Nordic Forest',
    nameVi: 'Rừng Rậm Bắc Âu (Bio-Shield)',
    category: 'natural',
    accentColor: '#84cc16',
    accentSecondary: '#4d7c0f',
    bgBase: '#091305',
    bgSurface: '#15260c',
    textBase: '#f7fee7',
    textMuted: '#bef264',
    descriptionVi: 'Tông màu rêu rừng rậm thanh bình, làm dịu mắt khi sử dụng thời gian dài.',
    badge: 'Thư Giãn Mắt',
  },
};

export const QUICK_ACCENT_COLORS = [
  { hex: '#00f3ff', name: 'Cyber Cyan' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#d946ef', name: 'Synth Fuchsia' },
  { hex: '#f59e0b', name: 'Amber Gold' },
  { hex: '#ef4444', name: 'Crimson Red' },
  { hex: '#3b82f6', name: 'Royal Blue' },
  { hex: '#ec4899', name: 'Hot Pink' },
  { hex: '#8b5cf6', name: 'Ultra Violet' },
  { hex: '#06b6d4', name: 'Aqua Blue' },
  { hex: '#14b8a6', name: 'Teal Surge' },
  { hex: '#84cc16', name: 'Lime Venom' },
  { hex: '#f97316', name: 'Coral Orange' },
  { hex: '#a855f7', name: 'Cosmic Purple' },
  { hex: '#fb7185', name: 'Sakura Rose' },
  { hex: '#e2e8f0', name: 'Titanium' },
  { hex: '#eab308', name: 'Cyber Yellow' },
];

export const QUICK_BG_COLORS = [
  { hex: '#050811', name: 'Cyber Void', isLight: false },
  { hex: '#000000', name: 'AMOLED Black', isLight: false },
  { hex: '#03140e', name: 'Matrix Green', isLight: false },
  { hex: '#12071f', name: 'Tokyo Violet', isLight: false },
  { hex: '#170e03', name: 'Solar Hearth', isLight: false },
  { hex: '#170505', name: 'Crimson Base', isLight: false },
  { hex: '#040d21', name: 'Abyssal Navy', isLight: false },
  { hex: '#190610', name: 'Dark Sakura', isLight: false },
  { hex: '#091305', name: 'Nordic Moss', isLight: false },
  { hex: '#0f172a', name: 'Slate Night', isLight: false },
  { hex: '#f8fafc', name: 'Pure White Light', isLight: true },
  { hex: '#f1f5f9', name: 'Muted Platinum', isLight: true },
];

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  preset: 'cyberpunk',
  accentColor: '#00f3ff',
  accentSecondary: '#0284c7',
  bgBase: '#050811',
  bgSurface: '#0f172a',
  glowIntensity: 'normal',
  bgPattern: 'grid',
  cardGlass: 'glass',
  borderRadius: 'standard',
  uiDensity: 'comfortable',
  colorBlindMode: 'none',
  customMode: false,
};

function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '0, 243, 255';
}

export function getStoredThemeConfig(): ThemeConfig {
  try {
    const raw = localStorage.getItem('scamguard_theme_config');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_THEME_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load stored theme config:', e);
  }
  return DEFAULT_THEME_CONFIG;
}

export function applyThemeToDom(config: ThemeConfig) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;

  const accentRgb = hexToRgb(config.accentColor);
  const secondaryRgb = hexToRgb(config.accentSecondary);
  const presetData = THEME_PRESETS[config.preset] || THEME_PRESETS.cyberpunk;
  const isLight = config.preset === 'clean_light' || config.bgBase === '#f8fafc' || config.bgBase === '#f1f5f9' || config.bgBase === '#ffffff' || config.bgBase.toLowerCase().startsWith('#f');

  // CSS Variables
  root.style.setProperty('--theme-accent', config.accentColor);
  root.style.setProperty('--theme-accent-rgb', accentRgb);
  root.style.setProperty('--theme-accent-secondary', config.accentSecondary);
  root.style.setProperty('--theme-accent-secondary-rgb', secondaryRgb);
  root.style.setProperty('--theme-bg-base', config.bgBase);
  root.style.setProperty('--theme-bg-surface', config.bgSurface);

  // Border Radius
  const radiusMap: Record<BorderRadiusStyle, string> = {
    sharp: '4px',
    standard: '16px',
    pill: '28px',
  };
  root.style.setProperty('--theme-border-radius', radiusMap[config.borderRadius] || '16px');

  // Text Color & Background
  if (isLight) {
    root.style.setProperty('--theme-text-base', '#0f172a');
    root.style.setProperty('--theme-text-muted', '#64748b');
    root.style.colorScheme = 'light';
    body.style.backgroundColor = config.bgBase;
    body.style.color = '#0f172a';
    root.classList.add('theme-mode-light');
    root.classList.remove('theme-mode-dark');
  } else {
    root.style.setProperty('--theme-text-base', '#f1f5f9');
    root.style.setProperty('--theme-text-muted', '#94a3b8');
    root.style.colorScheme = 'dark';
    body.style.backgroundColor = config.bgBase;
    body.style.color = '#f1f5f9';
    root.classList.add('theme-mode-dark');
    root.classList.remove('theme-mode-light');
  }

  // Set HTML Dataset Attributes for easy CSS targeting
  root.setAttribute('data-theme-preset', config.preset);
  root.setAttribute('data-theme-glow', config.glowIntensity);
  root.setAttribute('data-theme-pattern', config.bgPattern);
  root.setAttribute('data-theme-glass', config.cardGlass);
  root.setAttribute('data-theme-density', config.uiDensity);
  root.setAttribute('data-theme-radius', config.borderRadius);
  root.setAttribute('data-colorblind', config.colorBlindMode);

  // Glow filters based on intensity (subdued in light mode to avoid harsh screen glare)
  const glowOpacities: Record<GlowIntensity, number> = {
    none: 0,
    subtle: 0.15,
    normal: 0.4,
    ultra: 0.8,
  };
  const opacityVal = isLight ? Math.min(0.1, glowOpacities[config.glowIntensity]) : glowOpacities[config.glowIntensity];
  root.style.setProperty('--theme-glow-opacity', opacityVal.toString());
}

export function saveThemeConfig(config: ThemeConfig) {
  try {
    localStorage.setItem('scamguard_theme_config', JSON.stringify(config));
    applyThemeToDom(config);
  } catch (e) {
    console.error('Failed to save theme config:', e);
  }
}

export function applyThemePreset(presetId: ThemePresetId, current: ThemeConfig): ThemeConfig {
  const p = THEME_PRESETS[presetId] || THEME_PRESETS.cyberpunk;
  const updated: ThemeConfig = {
    ...current,
    preset: presetId,
    accentColor: p.accentColor,
    accentSecondary: p.accentSecondary,
    bgBase: p.bgBase,
    bgSurface: p.bgSurface,
    customMode: false,
  };
  saveThemeConfig(updated);
  return updated;
}
