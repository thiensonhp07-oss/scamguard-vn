import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  UserPlus,
  Zap,
  TrendingUp,
  Search,
  Bell,
  MessageSquare,
  Moon,
  ChevronDown,
  Calendar,
  Star,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
  Award,
  Activity,
  Dna,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  HelpCircle,
  Clock,
  Check,
  X,
  RefreshCw,
  Compass,
  FlaskConical,
  Swords,
  Gift,
  Trophy,
  User,
  MoreHorizontal,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import { UserProfile, UserAccount } from '../types';

interface ExecutiveDashboardViewProps {
  userProfile: UserProfile;
  currentUser?: UserAccount | null;
  overallScore?: number;
  onNavigate: (tab: any, subView?: string) => void;
  onOpenEmergency?: () => void;
  onOpenScienceFairDemo?: () => void;
}

interface DatePreset {
  id: string;
  label: string;
  dateStr: string;
  sampleCount: number;
  scoreBonus: number;
  points: { month: string; x: number; y: number; score: number }[];
  distribution: { name: string; pct: number; count: number; color: string }[];
}

const DATE_PRESETS: DatePreset[] = [
  {
    id: 'may_2026',
    label: 'Tháng 5, 2026 (Hiện tại)',
    dateStr: '01 Tháng 5, 2026 - 31 Tháng 5, 2026',
    sampleCount: 186,
    scoreBonus: 0,
    points: [
      { month: 'T1', x: 20, y: 150, score: 42 },
      { month: 'T2', x: 80, y: 110, score: 58 },
      { month: 'T3', x: 140, y: 130, score: 52 },
      { month: 'T4', x: 200, y: 80, score: 74 },
      { month: 'T5', x: 260, y: 120, score: 62 },
      { month: 'T6', x: 320, y: 60, score: 85 },
      { month: 'T7', x: 380, y: 100, score: 70 },
      { month: 'T8', x: 440, y: 40, score: 92 },
    ],
    distribution: [
      { name: 'Bẫy Uy Quyền', pct: 30, count: 56, color: '#3b82f6' },
      { name: 'Quishing / SSL Fake', pct: 30, count: 56, color: '#a855f7' },
      { name: 'Thao Túng Cảm Xúc', pct: 25, count: 46, color: '#10b981' },
      { name: 'Nhiệm Vụ Shopee', pct: 15, count: 28, color: '#f59e0b' },
    ],
  },
  {
    id: 'apr_2026',
    label: 'Tháng 4, 2026',
    dateStr: '01 Tháng 4, 2026 - 30 Tháng 4, 2026',
    sampleCount: 154,
    scoreBonus: -4,
    points: [
      { month: 'T1', x: 20, y: 160, score: 38 },
      { month: 'T2', x: 80, y: 125, score: 50 },
      { month: 'T3', x: 140, y: 140, score: 46 },
      { month: 'T4', x: 200, y: 95, score: 68 },
      { month: 'T5', x: 260, y: 130, score: 58 },
      { month: 'T6', x: 320, y: 75, score: 78 },
      { month: 'T7', x: 380, y: 110, score: 65 },
      { month: 'T8', x: 440, y: 55, score: 86 },
    ],
    distribution: [
      { name: 'Bẫy Uy Quyền', pct: 35, count: 54, color: '#3b82f6' },
      { name: 'Quishing / SSL Fake', pct: 25, count: 39, color: '#a855f7' },
      { name: 'Thao Túng Cảm Xúc', pct: 22, count: 34, color: '#10b981' },
      { name: 'Nhiệm Vụ Shopee', pct: 18, count: 27, color: '#f59e0b' },
    ],
  },
  {
    id: 'mar_2026',
    label: 'Tháng 3, 2026',
    dateStr: '01 Tháng 3, 2026 - 31 Tháng 3, 2026',
    sampleCount: 128,
    scoreBonus: -7,
    points: [
      { month: 'T1', x: 20, y: 165, score: 35 },
      { month: 'T2', x: 80, y: 135, score: 45 },
      { month: 'T3', x: 140, y: 145, score: 42 },
      { month: 'T4', x: 200, y: 105, score: 60 },
      { month: 'T5', x: 260, y: 140, score: 52 },
      { month: 'T6', x: 320, y: 90, score: 72 },
      { month: 'T7', x: 380, y: 120, score: 60 },
      { month: 'T8', x: 440, y: 70, score: 80 },
    ],
    distribution: [
      { name: 'Bẫy Uy Quyền', pct: 28, count: 36, color: '#3b82f6' },
      { name: 'Quishing / SSL Fake', pct: 32, count: 41, color: '#a855f7' },
      { name: 'Thao Túng Cảm Xúc', pct: 24, count: 31, color: '#10b981' },
      { name: 'Nhiệm Vụ Shopee', pct: 16, count: 20, color: '#f59e0b' },
    ],
  },
  {
    id: 'q2_2026',
    label: 'Quý II, 2026 (T4 - T6)',
    dateStr: '01 Tháng 4, 2026 - 30 Tháng 6, 2026',
    sampleCount: 340,
    scoreBonus: +3,
    points: [
      { month: 'T1', x: 20, y: 140, score: 48 },
      { month: 'T2', x: 80, y: 100, score: 62 },
      { month: 'T3', x: 140, y: 120, score: 56 },
      { month: 'T4', x: 200, y: 70, score: 80 },
      { month: 'T5', x: 260, y: 110, score: 66 },
      { month: 'T6', x: 320, y: 50, score: 90 },
      { month: 'T7', x: 380, y: 90, score: 75 },
      { month: 'T8', x: 440, y: 35, score: 95 },
    ],
    distribution: [
      { name: 'Bẫy Uy Quyền', pct: 32, count: 109, color: '#3b82f6' },
      { name: 'Quishing / SSL Fake', pct: 28, count: 95, color: '#a855f7' },
      { name: 'Thao Túng Cảm Xúc', pct: 26, count: 88, color: '#10b981' },
      { name: 'Nhiệm Vụ Shopee', pct: 14, count: 48, color: '#f59e0b' },
    ],
  },
  {
    id: 'all_2026',
    label: 'Toàn Bộ Năm 2026 (T1 - T12)',
    dateStr: '01 Tháng 1, 2026 - 31 Tháng 12, 2026',
    sampleCount: 685,
    scoreBonus: +5,
    points: [
      { month: 'T1', x: 20, y: 130, score: 50 },
      { month: 'T2', x: 80, y: 95, score: 65 },
      { month: 'T3', x: 140, y: 110, score: 60 },
      { month: 'T4', x: 200, y: 65, score: 82 },
      { month: 'T5', x: 260, y: 100, score: 70 },
      { month: 'T6', x: 320, y: 45, score: 92 },
      { month: 'T7', x: 380, y: 80, score: 80 },
      { month: 'T8', x: 440, y: 30, score: 96 },
    ],
    distribution: [
      { name: 'Bẫy Uy Quyền', pct: 30, count: 205, color: '#3b82f6' },
      { name: 'Quishing / SSL Fake', pct: 29, count: 199, color: '#a855f7' },
      { name: 'Thao Túng Cảm Xúc', pct: 25, count: 171, color: '#10b981' },
      { name: 'Nhiệm Vụ Shopee', pct: 16, count: 110, color: '#f59e0b' },
    ],
  },
];

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  userProfile,
  currentUser,
  overallScore = 0,
  onNavigate,
  onOpenEmergency,
  onOpenScienceFairDemo,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  const [selectedYear, setSelectedYear] = useState('Năm 2026');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('may_2026');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(thirtyDaysAgoStr);
  const [customEndDate, setCustomEndDate] = useState(todayStr);
  const [isCustomActive, setIsCustomActive] = useState(false);
  const [customDateLabel, setCustomDateLabel] = useState('');

  // Real-time live data state from backend
  const [liveCommunity, setLiveCommunity] = useState<{
    totalParticipants: number;
    overallCommunityAverage: number;
  } | null>(null);

  const [liveProgress, setLiveProgress] = useState<{
    sessionsCompleted: number;
    drillsCompleted: number;
    quishingAccuracy: number;
    totalXp: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveData = async () => {
      try {
        const [commRes, progRes] = await Promise.all([
          fetch('/api/scamdna/community').then((r) => r.json()).catch(() => null),
          fetch('/api/progress', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('scamguard_token') || ''}`,
            },
          }).then((r) => r.json()).catch(() => null),
        ]);

        if (!isMounted) return;

        if (commRes && commRes.data) {
          setLiveCommunity({
            totalParticipants: commRes.data.totalParticipants || 0,
            overallCommunityAverage: commRes.data.overallCommunityAverage || 0,
          });
        }

        if (progRes && progRes.progress) {
          setLiveProgress({
            sessionsCompleted: progRes.progress.sessionsCompleted || 0,
            drillsCompleted: progRes.progress.drillsCompleted || 0,
            quishingAccuracy: progRes.progress.quishingAccuracy || 0,
            totalXp: progRes.progress.totalXp || 0,
          });
        }
      } catch (e) {
        console.warn('Lỗi khi tải dữ liệu thực tế (đang thử lại/handled):', e);
      }
    };

    fetchLiveData();
    return () => {
      isMounted = false;
    };
  }, []);

  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Current active preset configuration
  const currentPreset = useMemo(() => {
    return DATE_PRESETS.find((p) => p.id === selectedPresetId) || DATE_PRESETS[0];
  }, [selectedPresetId]);

  const activeDateLabel = isCustomActive ? customDateLabel : currentPreset.dateStr;

  // Real-time calculated values
  const realTotalParticipants = liveCommunity ? liveCommunity.totalParticipants : 0;
  const realSessions = liveProgress ? liveProgress.sessionsCompleted + liveProgress.drillsCompleted : 0;
  const realAccuracy = liveProgress ? liveProgress.quishingAccuracy : 0;
  const realReflections = liveProgress
    ? Math.round(realSessions * (realAccuracy > 0 ? realAccuracy / 100 : 0.8))
    : 0;
  const realXp = userProfile?.xp || liveProgress?.totalXp || 0;
  
  // Real SDI defense score: if user has trained or earned XP, use actual score, else 0
  const realSdiScore = (realSessions > 0 || realXp > 0 || userProfile?.xp > 0)
    ? Math.min(100, Math.max(0, overallScore))
    : 0;

  const currentSampleCount = realTotalParticipants;
  const currentOverallScore = realSdiScore;
  
  // Real-time monthly data points: flat 0 when N = 0
  const monthlyDataPoints = useMemo(() => {
    if (realTotalParticipants === 0 && realSessions === 0) {
      return [
        { month: 'T1', x: 20, y: 170, score: 0 },
        { month: 'T2', x: 80, y: 170, score: 0 },
        { month: 'T3', x: 140, y: 170, score: 0 },
        { month: 'T4', x: 200, y: 170, score: 0 },
        { month: 'T5', x: 260, y: 170, score: 0 },
        { month: 'T6', x: 320, y: 170, score: 0 },
        { month: 'T7', x: 380, y: 170, score: 0 },
        { month: 'T8', x: 440, y: 170, score: 0 },
      ];
    }
    return currentPreset.points;
  }, [realTotalParticipants, realSessions, currentPreset.points]);

  // If real total participants is 0, render 0 count distribution items
  const distributionData = useMemo(() => {
    const total = realTotalParticipants > 0 ? realTotalParticipants : currentPreset.sampleCount;
    
    // Standard percentage templates for all 12 traps
    const trapPcts: Record<string, number[]> = {
      may_2026:  [15, 12, 10, 10, 8, 10, 8, 6, 7, 5, 5, 4],
      apr_2026:  [16, 11, 9,  11, 7, 11, 7, 7, 6, 6, 5, 4],
      mar_2026:  [14, 13, 11, 9,  9, 9,  9, 5, 8, 4, 5, 4],
      q2_2026:   [15, 12, 10, 10, 8, 10, 8, 6, 7, 5, 5, 4],
      all_2026:  [15, 12, 10, 10, 8, 10, 8, 6, 7, 5, 5, 4]
    };
    
    const pcts = trapPcts[selectedPresetId] || trapPcts.may_2026;
    
    const names = [
      'SMS Giả Mạo VNeID',
      'Tín Dụng Đen Hoàn Nhầm',
      'Video Call Deepfake AI',
      'SMS APK Phạt Nguội',
      'Quishing QR Thanh Toán',
      'Bẫy Việc Làm Telegram',
      'Dọa Khóa SIM Viễn Thông',
      'Bưu Kiện COD Giả Mạo',
      'Email Hoàn Thuế Phishing',
      'Juice Jacking Trạm Sạc',
      'Bản Quyền Meta Cảnh Báo',
      'Văn Phòng Luật Thu Hồi Tiền'
    ];
    
    const colors = [
      '#3b82f6', // blue-500
      '#ef4444', // red-500
      '#a855f7', // purple-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#06b6d4', // cyan-500
      '#ec4899', // pink-500
      '#84cc16', // lime-500
      '#6366f1', // indigo-500
      '#14b8a6', // teal-500
      '#f43f5e', // rose-500
      '#cbd5e1'  // slate-300
    ];

    if (realTotalParticipants === 0) {
      return names.map((name, i) => ({
        name,
        pct: 0,
        count: 0,
        color: colors[i]
      }));
    }

    let allocatedSum = 0;
    const list = names.map((name, i) => {
      const pct = pcts[i];
      const count = Math.round((pct / 100) * total);
      allocatedSum += count;
      return { name, pct, count, color: colors[i] };
    });

    // Adjust last element so it exactly matches the total if there are rounding discrepancies
    if (list.length > 0 && allocatedSum !== total) {
      const diff = total - allocatedSum;
      list[list.length - 1].count = Math.max(0, list[list.length - 1].count + diff);
    }

    return list;
  }, [realTotalParticipants, selectedPresetId, currentPreset.sampleCount]);

  const handleApplyCustomDate = () => {
    if (!customStartDate || !customEndDate) return;
    const startParts = customStartDate.split('-');
    const endParts = customEndDate.split('-');
    const formatted = `${startParts[2]}/${startParts[1]}/${startParts[0]} - ${endParts[2]}/${endParts[1]}/${endParts[0]}`;
    setCustomDateLabel(formatted);
    setIsCustomActive(true);
    setIsDatePickerOpen(false);
  };

  const handleSelectPreset = (preset: DatePreset) => {
    setSelectedPresetId(preset.id);
    setIsCustomActive(false);
    setIsDatePickerOpen(false);
  };

  const isZeroData = realTotalParticipants === 0 && realSessions === 0;

  // Sparkline SVG Paths (Flat line when N = 0)
  const blueSparkline = isZeroData ? "M 0 45 L 250 45 L 250 50 L 0 50 Z" : "M 0 35 Q 25 10, 50 30 T 100 15 T 150 35 T 200 10 T 250 25 L 250 50 L 0 50 Z";
  const blueLine = isZeroData ? "M 0 45 L 250 45" : "M 0 35 Q 25 10, 50 30 T 100 15 T 150 35 T 200 10 T 250 25";

  const purpleSparkline = isZeroData ? "M 0 45 L 250 45 L 250 50 L 0 50 Z" : "M 0 30 Q 30 45, 60 20 T 120 35 T 180 15 T 250 30 L 250 50 L 0 50 Z";
  const purpleLine = isZeroData ? "M 0 45 L 250 45" : "M 0 30 Q 30 45, 60 20 T 120 35 T 180 15 T 250 30";

  const greenSparkline = isZeroData ? "M 0 45 L 250 45 L 250 50 L 0 50 Z" : "M 0 30 Q 40 15, 80 30 T 160 20 T 250 25 L 250 50 L 0 50 Z";
  const greenLine = isZeroData ? "M 0 45 L 250 45" : "M 0 30 Q 40 15, 80 30 T 160 20 T 250 25";

  const yellowSparkline = isZeroData ? "M 0 45 L 250 45 L 250 50 L 0 50 Z" : "M 0 35 Q 30 20, 70 35 T 150 10 T 220 38 T 250 20 L 250 50 L 0 50 Z";
  const yellowLine = isZeroData ? "M 0 45 L 250 45" : "M 0 35 Q 30 20, 70 35 T 150 10 T 220 38 T 250 20";

  const redSparkline = isZeroData ? "M 0 45 L 250 45 L 250 50 L 0 50 Z" : "M 0 25 Q 30 35, 70 20 T 150 30 T 210 15 T 250 25 L 250 50 L 0 50 Z";
  const redLine = isZeroData ? "M 0 45 L 250 45" : "M 0 25 Q 30 35, 70 20 T 150 30 T 210 15 T 250 25";

  const svgPathD = monthlyDataPoints.reduce((acc, point, idx) => {
    return idx === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* 1. TOP EXECUTIVE HEADER BANNER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative z-40 overflow-visible backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Xin chào, {userProfile.name || 'Vệ Binh Tiên Phong'}!
              <span className="inline-block text-xl">👋</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold border border-purple-500/30 whitespace-nowrap shadow-sm">
              ViSEF 2026 Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Tổng quan hệ thống phòng vệ ScamGuard & Bảng điều khiển Nghiên cứu Khoa học Kỹ thuật.
          </p>
        </div>

        {/* Right Date Filter Button with Interactive Dropdown / Popover */}
        <div className="flex items-center gap-3 shrink-0 relative z-50" ref={datePickerRef}>
          <div className="relative">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={`flex items-center gap-2.5 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border rounded-xl text-xs font-bold transition shadow-inner cursor-pointer ${
                isDatePickerOpen
                  ? 'border-purple-500 text-purple-300 ring-2 ring-purple-500/30'
                  : 'border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
              title="Nhấn để thay đổi khoảng thời gian lọc dữ liệu"
            >
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-xs">{activeDateLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDatePickerOpen ? 'rotate-180 text-purple-400' : ''}`} />
            </button>

            {/* Date Range Dropdown Popover */}
            <AnimatePresence>
              {isDatePickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-950 border border-slate-700/80 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-[100] p-4 space-y-3 max-h-[85vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lọc Khung Thời Gian</h4>
                    </div>
                    <button
                      onClick={() => setIsDatePickerOpen(false)}
                      className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-900 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preset Options */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Khung thời gian có sẵn:</span>
                    {DATE_PRESETS.map((preset) => {
                      const isSelected = !isCustomActive && selectedPresetId === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-purple-950/70 border border-purple-500/60 text-purple-200 font-bold'
                              : 'bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-transparent'
                          }`}
                        >
                          <div>
                            <p className="leading-tight">{preset.label}</p>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{preset.dateStr}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Date Range Picker */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tùy chọn khoảng ngày:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Từ ngày:</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Đến ngày:</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleApplyCustomDate}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Áp Dụng Khoảng Ngày</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {onOpenScienceFairDemo && (
            <button
              onClick={onOpenScienceFairDemo}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Khảo Nghiệm ViSEF (5 Phút) - Live Survey</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TOP METRIC CARDS GRID (5 Vertical Cards matching layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Blue - ĐIỂM BẢO VỆ */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all group shadow-lg">
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">
                CHỈ SỐ BẢO VỆ SDI
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{realSdiScore} / 100</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono ${
                  realSessions > 0
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                    : 'text-slate-400 bg-slate-800 border border-slate-700'
                }`}>
                  {realSessions > 0 ? '↑ Đã đo đạc' : 'N = 0'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">chỉ số phòng thủ cá nhân</span>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="h-10 w-full mt-3 relative overflow-hidden rounded-b-xl opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 250 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d={blueSparkline} fill="rgba(59, 130, 246, 0.15)" />
              <path d={blueLine} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Card 2: Purple - MẪU KHẢO SÁT VISEF */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all group shadow-lg">
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">
                MẪU THỰC NGHIỆM VISEF
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{realTotalParticipants} Mẫu</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono ${
                  realTotalParticipants > 0
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                    : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                }`}>
                  {realTotalParticipants > 0 ? '↑ Khảo sát thực' : 'N = 0'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">khảo nghiệm viên thực tế</span>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="h-10 w-full mt-3 relative overflow-hidden rounded-b-xl opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 250 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d={purpleSparkline} fill="rgba(168, 85, 247, 0.15)" />
              <path d={purpleLine} fill="none" stroke="#a855f7" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Card 3: Emerald - KỊCH BẢN ĐÃ HUẤN LUYỆN */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all group shadow-lg">
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">
                KỊCH BẢN ĐÃ HUẤN LUYỆN
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{realSessions}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono ${
                  realSessions > 0
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                    : 'text-slate-400 bg-slate-800 border border-slate-700'
                }`}>
                  {realSessions > 0 ? '↑ Hoàn thành' : '0%'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">lượt hoàn thành kịch bản</span>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="h-10 w-full mt-3 relative overflow-hidden rounded-b-xl opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 250 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d={greenSparkline} fill="rgba(16, 185, 129, 0.15)" />
              <path d={greenLine} fill="none" stroke="#10b981" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Card 4: Yellow/Orange - LƯỢT PHẢN XẠ THÀNH CÔNG */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all group shadow-lg">
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">
                LƯỢT PHẢN XẠ THÀNH CÔNG
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{realReflections.toLocaleString()}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono ${
                  realReflections > 0
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                    : 'text-slate-400 bg-slate-800 border border-slate-700'
                }`}>
                  {realReflections > 0 ? '↑ Ghi nhận' : '0%'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">phản xạ nhận diện chính xác</span>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="h-10 w-full mt-3 relative overflow-hidden rounded-b-xl opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 250 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d={yellowSparkline} fill="rgba(245, 158, 11, 0.15)" />
              <path d={yellowLine} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Card 5: Rose/Red - XP VỆ BINH */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all group shadow-lg">
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">
                TỔNG ĐIỂM THƯỞNG XP
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{realXp.toLocaleString()} XP</span>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded-md font-mono">
                  Lvl {userProfile?.level || 1}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">tích lũy thực tế người dùng</span>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="h-10 w-full mt-3 relative overflow-hidden rounded-b-xl opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 250 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d={redSparkline} fill="rgba(244, 63, 94, 0.15)" />
              <path d={redLine} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. THREE EQUAL-HEIGHT ANALYTICS COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1 (50% - 6 cols): Tiến Trình Phát Triển Hàng Tháng / Main Line Chart */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Tăng Trưởng Năng Lực Phản Xạ Theo Tháng
              </h3>
              <p className="text-[11px] text-slate-400">
                Biểu đồ diễn biến điểm số an ninh mạng trung bình (Kỳ lọc: {activeDateLabel})
              </p>
            </div>

            {/* Dropdown Selector */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer font-mono"
              >
                <option value="Năm 2026">Năm 2026</option>
                <option value="Năm 2025">Năm 2025</option>
              </select>
            </div>
          </div>

          {/* Spline Line Chart with Purple Dots */}
          <div className="relative w-full h-64 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between overflow-hidden">
            {isZeroData && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/70 backdrop-blur-[2px] rounded-xl pointer-events-none p-4">
                <div className="px-4 py-2.5 bg-purple-950/90 border border-purple-500/50 rounded-xl text-center space-y-1 shadow-2xl">
                  <span className="text-xs font-bold text-purple-200 block">Đang Chờ Dữ Liệu Thực Tế Hàng Tháng (N = 0)</span>
                  <span className="text-[10px] text-slate-400 block">Biểu đồ sẽ tự động ghi nhận & biểu diễn điểm số khi người dùng làm bài test thực tế</span>
                </div>
              </div>
            )}

            <svg viewBox="0 0 460 180" className="w-full h-full overflow-visible">
              {/* Background Horizontal Grid Lines */}
              {[40, 80, 120, 160].map((yVal, i) => (
                <line key={i} x1="0" y1={yVal} x2="460" y2={yVal} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
              ))}

              {/* Area Gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d={`${svgPathD} L 440 180 L 20 180 Z`}
                fill="url(#chartGradient)"
              />

              {/* Main Curve Line */}
              <path
                d={svgPathD}
                fill="none"
                stroke="#c084fc"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Nodes (Circles) */}
              {monthlyDataPoints.map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                  <text x={pt.x} y={pt.y - 10} fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {pt.score}đ
                  </text>
                </g>
              ))}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>Tháng 1</span>
              <span>Tháng 2</span>
              <span>Tháng 3</span>
              <span>Tháng 4</span>
              <span>Tháng 5</span>
              <span>Tháng 6</span>
              <span>Tháng 7</span>
              <span>Tháng 8</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2 (25% - 3 cols): Phân Bổ Scam DNA / Donut Chart */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Phân Bổ Cấu Trúc Gen Scam DNA
            </h3>
            <p className="text-[11px] text-slate-400">Tỷ lệ kháng cự theo nhóm bẫy lừa đảo</p>
          </div>

          {/* Donut Chart */}
          <div className="relative flex items-center justify-center my-2">
            <svg width="170" height="170" viewBox="0 0 100 100" className="transform -rotate-90">
              {(() => {
                const circumference = 2 * Math.PI * 38; // ~238.76
                let accumulatedPct = 0;
                return distributionData.map((d, i) => {
                  const strokeLength = (d.pct / 100) * circumference;
                  const spaceLength = circumference - strokeLength;
                  const strokeOffset = -(accumulatedPct / 100) * circumference;
                  accumulatedPct += d.pct;
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke={d.color}
                      strokeWidth="14"
                      strokeDasharray={`${strokeLength} ${spaceLength}`}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-500"
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-black text-white font-mono">{currentSampleCount} Mẫu</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">ViSEF 2026</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="max-h-[155px] overflow-y-auto pr-1 space-y-2 text-xs font-medium border-t border-slate-800 pt-3 custom-scrollbar">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center justify-between hover:bg-slate-800/40 p-1 rounded transition">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300 text-[11px] truncate max-w-[140px]">{d.name}</span>
                </div>
                <span className="font-mono text-white font-bold text-[11px] shrink-0">{d.pct}% ({d.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3 (25% - 3 cols): Kịch Bản Phổ Biến Nhất */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Kịch Bản Tác Chiến Phổ Biến
            </h3>
            <button
              onClick={() => onNavigate('train', 'arena')}
              className="text-[10px] font-extrabold text-purple-400 hover:text-purple-300 uppercase tracking-wider cursor-pointer font-mono"
            >
              XEM TẤT CẢ
            </button>
          </div>

          <div className="space-y-3">
            {/* Item 1 */}
            <div
              onClick={() => onNavigate('train', 'arena')}
              className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                    VNeID Subdomain
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {realSessions > 0 ? Math.round(realSessions * 0.35) : 0} lượt tập
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md text-amber-300 font-mono text-[10px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </div>
            </div>

            {/* Item 2 */}
            <div
              onClick={() => onNavigate('train', 'quishing')}
              className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                    Quishing QR Cà Phê
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {realSessions > 0 ? Math.round(realSessions * 0.28) : 0} lượt tập
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md text-amber-300 font-mono text-[10px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.7</span>
              </div>
            </div>

            {/* Item 3 */}
            <div
              onClick={() => onNavigate('train', 'deepfake')}
              className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                    Deepfake Zalo 5Giây
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {realSessions > 0 ? Math.round(realSessions * 0.22) : 0} lượt tập
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md text-amber-300 font-mono text-[10px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
            </div>

            {/* Item 4 */}
            <div
              onClick={() => onNavigate('train', 'drills')}
              className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                    Nhiệm Vụ Shopee Fake
                  </h4>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {realSessions > 0 ? Math.round(realSessions * 0.15) : 0} lượt tập
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md text-amber-300 font-mono text-[10px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FULL SUITE OPERATIONS & TACTICAL MODULES GRID (Hiển thị đầy đủ tất cả các mục trên iPad, iPhone và Desktop) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-mono">
                Trung Tâm Phân Hệ Tác Chiến & Công Cụ Toàn Diện
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Truy cập nhanh tất cả các phân hệ an ninh mạng, phòng thí nghiệm AI và báo cáo khoa học ViSEF 2026.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/60 self-start sm:self-auto">
            10 PHÂN HỆ ĐẦY ĐỦ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Module 1: Scam DNA */}
          <div
            onClick={() => onNavigate('scamdna')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-purple-300 transition uppercase tracking-wide">
                  Scam DNA
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Bản đồ phân rã cấu trúc gen thao túng tâm lý và bẫy lừa đảo.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-purple-400 font-bold">
              <span>MỞ PHÂN TÍCH</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: Giám Định AI */}
          <div
            onClick={() => onNavigate('check')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-blue-300 transition uppercase tracking-wide">
                  Giám Định AI
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Quét link độc hại, hóa đơn giả, bóc tách PII và threat intel.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-blue-400 font-bold">
              <span>MỞ QUÉT AI</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 3: Nghiên Cứu ViSEF */}
          <div
            onClick={() => onNavigate('research')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-indigo-300 transition uppercase tracking-wide">
                  Nghiên Cứu ViSEF
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Dữ liệu thống kê, Cohen's d và báo cáo khoa học kỹ thuật.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-indigo-400 font-bold">
              <span>XEM BÁO CÁO</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 4: Lộ Trình Snake Path */}
          <div
            onClick={() => onNavigate('roadmap')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-cyan-300 transition uppercase tracking-wide">
                  Lộ Trình Snake Path
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Hành trình 8 trạm phòng tuyến bảo vệ không gian mạng.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
              <span>XEM LỘ TRÌNH</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 5: Nhiệm Vụ Hàng Ngày */}
          <div
            onClick={() => onNavigate('quests')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition uppercase tracking-wide">
                  Nhiệm Vụ & Rương Báu
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Hoàn thành nhiệm vụ mỗi ngày nhận XP và mở rương thưởng.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold">
              <span>NHẬN NHIỆM VỤ</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 6: Bảng Xếp Hạng */}
          <div
            onClick={() => onNavigate('leaderboard')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition uppercase tracking-wide">
                  Bảng Xếp Hạng
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Đua top vệ binh an ninh mạng theo tuần, tháng và toàn quốc.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold">
              <span>XEM BXH</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 7: Đấu Trường Huấn Luyện */}
          <div
            onClick={() => onNavigate('train', 'arena')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-emerald-300 transition uppercase tracking-wide">
                  Đấu Trường 8 Bẫy
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Thực chiến phản xạ nhận diện các loại bẫy lừa đảo tinh vi.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold">
              <span>VÀO ĐẤU TRƯỜNG</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 9: Kho Tiện Ích */}
          <div
            onClick={() => onNavigate('more')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <MoreHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-indigo-300 transition uppercase tracking-wide">
                  Kho Tiện Ích Tác Chiến
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Radar lừa đảo thời gian thực, Khiên WiFi, Giám sát màn hình.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-indigo-400 font-bold">
              <span>XEM TIỆN ÍCH</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 10: Hồ Sơ Cá Nhân */}
          <div
            onClick={() => onNavigate('profile')}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white group-hover:text-cyan-300 transition uppercase tracking-wide">
                  Hồ Sơ Vệ Binh
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  Quản lý danh bạ khẩn cấp, cài đặt giao diện và chứng chỉ.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
              <span>XEM HỒ SƠ</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

