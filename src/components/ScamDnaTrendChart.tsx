import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Target,
  Brain,
  Cpu,
  Wallet,
  Zap,
  Award,
  ChevronRight,
  CheckCircle2,
  Flame,
  ArrowUpRight,
  Sliders,
  Crosshair,
  Layers,
  BarChart2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScamDnaHistoryDataPoint, ScamDnaProfile } from '../types';

interface ScamDnaTrendChartProps {
  dnaProfile?: ScamDnaProfile | null;
  onNavigateToArena?: (scenarioId?: string) => void;
}

type MetricMode = 'all_sdi' | 'risk_index' | 'psychology' | 'technical' | 'financial' | 'compare_all';
type TimeframeMode = '30d' | '14d' | '7d';

export function generate30DayHistoricalData(currentScore: number = 82): ScamDnaHistoryDataPoint[] {
  const data: ScamDnaHistoryDataPoint[] = [];
  const today = new Date();

  const baseSdi = Math.max(35, currentScore - 18);
  const basePsy = Math.max(30, currentScore - 20);
  const baseTech = Math.max(30, currentScore - 22);
  const baseFin = Math.max(40, currentScore - 15);

  const milestones: Record<number, { title: string; description: string; xpEarned: number; category: 'drill' | 'arena' | 'quishing' | 'deepfake' | 'streak' }> = {
    4: {
      title: 'Khởi Động Đánh Giá DNA',
      description: 'Hoàn thành bài khảo sát ban đầu xác định hình mẫu phản xạ.',
      xpEarned: 100,
      category: 'drill',
    },
    10: {
      title: 'Hóa Giải Công An Giả Mạo',
      description: 'Phản xạ thành công trước cuộc gọi đe dọa rửa tiền trong Arena.',
      xpEarned: 250,
      category: 'arena',
    },
    17: {
      title: 'Quishing Lab Đạt 100%',
      description: 'Phát hiện chính xác 10/10 mã QR giả mạo dán đè tại nhà hàng.',
      xpEarned: 300,
      category: 'quishing',
    },
    23: {
      title: 'Đánh Bại Video Deepfake',
      description: 'Nhận diện video call clone người thân nhờ quy tắc quay góc 90°.',
      xpEarned: 350,
      category: 'deepfake',
    },
    28: {
      title: 'Bảo Vệ Smart OTP 7 Ngày',
      description: 'Bảo toàn mã OTP trước chiêu lừa nâng cấp Sim 5G.',
      xpEarned: 500,
      category: 'streak',
    },
  };

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayNumber = 30 - i;
    const progressFactor = (dayNumber - 1) / 29;

    const stepBonus = dayNumber > 23 ? 5 : dayNumber > 17 ? 4 : dayNumber > 10 ? 3 : dayNumber > 4 ? 2 : 0;
    const wave = Math.sin(dayNumber * 0.7) * 1.2;

    const sdi = Math.min(99, Math.max(30, Math.round(baseSdi + (currentScore - baseSdi) * progressFactor + wave * 0.5 + stepBonus * 0.3)));
    const psy = Math.min(99, Math.max(30, Math.round(basePsy + (currentScore - 4 - basePsy) * progressFactor + (dayNumber > 10 ? 3 : 0))));
    const tech = Math.min(99, Math.max(30, Math.round(baseTech + (currentScore - 7 - baseTech) * progressFactor + (dayNumber > 23 ? 5 : 0))));
    const fin = Math.min(99, Math.max(30, Math.round(baseFin + (currentScore - baseFin) * progressFactor + (dayNumber > 28 ? 4 : 0))));

    const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    const fullDateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;

    data.push({
      date: dateStr,
      fullDate: fullDateStr,
      dayIndex: dayNumber,
      overallScore: i === 0 ? currentScore : sdi,
      riskScore: 100 - (i === 0 ? currentScore : sdi),
      psychologyScore: psy,
      technicalScore: tech,
      financialScore: fin,
      communityAverage: 63.5 + Math.sin(dayNumber * 0.2) * 0.4,
      milestoneEvent: milestones[dayNumber],
    });
  }

  return data;
}

export const ScamDnaTrendChart: React.FC<ScamDnaTrendChartProps> = ({
  dnaProfile,
  onNavigateToArena,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeMode>('30d');
  const [selectedMetric, setSelectedMetric] = useState<MetricMode>('all_sdi');
  const [showCommunityBenchmark, setShowCommunityBenchmark] = useState<boolean>(true);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const rawHistory = useMemo(() => {
    if (dnaProfile?.historicalTrend30Days && dnaProfile.historicalTrend30Days.length > 0) {
      return dnaProfile.historicalTrend30Days;
    }
    return generate30DayHistoricalData(dnaProfile?.overallScore || 82);
  }, [dnaProfile]);

  const displayedHistory = useMemo(() => {
    if (timeframe === '7d') return rawHistory.slice(-7);
    if (timeframe === '14d') return rawHistory.slice(-14);
    return rawHistory;
  }, [rawHistory, timeframe]);

  const activePoint = useMemo(() => {
    if (hoveredPointIndex !== null && displayedHistory[hoveredPointIndex]) {
      return displayedHistory[hoveredPointIndex];
    }
    return displayedHistory[displayedHistory.length - 1];
  }, [displayedHistory, hoveredPointIndex]);

  const trendStats = useMemo(() => {
    if (displayedHistory.length < 2) {
      return {
        initialScore: 64,
        currentScore: 82,
        sdiDelta: 18,
        sdiPercentChange: 28.1,
        initialRisk: 36,
        currentRisk: 18,
        riskReductionPercent: 50.0,
        milestonesCount: 5,
        dailyVelocity: 0.62,
        status: 'UPWARD' as const,
      };
    }

    const first = displayedHistory[0];
    const last = displayedHistory[displayedHistory.length - 1];
    const sdiDelta = last.overallScore - first.overallScore;
    const sdiPercentChange = first.overallScore > 0 ? (sdiDelta / first.overallScore) * 100 : 0;
    const riskDelta = first.riskScore - last.riskScore;
    const riskReductionPercent = first.riskScore > 0 ? (riskDelta / first.riskScore) * 100 : 0;
    const milestonesCount = displayedHistory.filter((p) => !!p.milestoneEvent).length;
    const dailyVelocity = Number((sdiDelta / displayedHistory.length).toFixed(2));

    return {
      initialScore: first.overallScore,
      currentScore: last.overallScore,
      sdiDelta,
      sdiPercentChange: Number(sdiPercentChange.toFixed(1)),
      initialRisk: first.riskScore,
      currentRisk: last.riskScore,
      riskReductionPercent: Number(riskReductionPercent.toFixed(1)),
      milestonesCount,
      dailyVelocity,
      status: sdiDelta >= 0 ? ('UPWARD' as const) : ('DOWNWARD' as const),
    };
  }, [displayedHistory]);

  // SVG Chart Geometry
  const chartConfig = useMemo(() => {
    const width = 840;
    const height = 300;
    const padding = { top: 25, right: 35, bottom: 40, left: 45 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const count = displayedHistory.length;

    const getX = (index: number) => padding.left + (index / (count - 1)) * innerWidth;
    const getY = (val: number) => padding.top + innerHeight - (val / 100) * innerHeight;

    const buildSmoothPath = (getValue: (p: ScamDnaHistoryDataPoint) => number) => {
      if (count === 0) return '';
      const pts = displayedHistory.map((p, i) => ({ x: getX(i), y: getY(getValue(p)) }));
      if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      return d;
    };

    const sdiPath = buildSmoothPath((p) => p.overallScore);
    const riskPath = buildSmoothPath((p) => p.riskScore);
    const psyPath = buildSmoothPath((p) => p.psychologyScore);
    const techPath = buildSmoothPath((p) => p.technicalScore);
    const finPath = buildSmoothPath((p) => p.financialScore);
    const commPath = buildSmoothPath((p) => p.communityAverage);

    const firstX = getX(0);
    const lastX = getX(count - 1);
    const bottomY = getY(0);

    const sdiAreaPath = `${sdiPath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
    const riskAreaPath = `${riskPath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

    return {
      width,
      height,
      padding,
      innerWidth,
      innerHeight,
      getX,
      getY,
      sdiPath,
      riskPath,
      psyPath,
      techPath,
      finPath,
      commPath,
      sdiAreaPath,
      riskAreaPath,
    };
  }, [displayedHistory]);

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-slate-950/95 p-5 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.06)] relative overflow-hidden space-y-6 backdrop-blur-xl">
      {/* High-Tech Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Toolbar & Quick Stats Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-[11px] font-mono font-black text-cyan-400 uppercase tracking-wider">
              Scam DNA Telemetry • 30-Day Evolution
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2.5">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>Biểu Đồ Xu Hướng Rủi Ro & Phòng Vệ</span>
          </h2>
        </div>

        {/* Timeframe & Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-inner">
            {(['7d', '14d', '30d'] as TimeframeMode[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === '7d' ? '7 Ngày' : tf === '14d' ? '14 Ngày' : '30 Ngày'}
              </button>
            ))}
          </div>

          {/* Benchmark Toggle */}
          <button
            onClick={() => setShowCommunityBenchmark(!showCommunityBenchmark)}
            className={`px-3 py-2 rounded-2xl text-xs font-mono font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
              showCommunityBenchmark
                ? 'bg-purple-950/50 border-purple-500/40 text-purple-300 shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-purple-400 inline-block border-t border-dashed" />
            <span>Đường Chuẩn QG (63.5)</span>
          </button>
        </div>
      </div>

      {/* 2. Sleek Telemetry KPI Grid (4 Visual Metric Gauges) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
        {/* Metric 1: Defense SDI */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-cyan-950/30 to-slate-900/80 border border-cyan-500/30 space-y-1 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-300/80 uppercase font-black tracking-wider">Chỉ Số Phòng Vệ</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-black">
              +{trendStats.sdiDelta} đ
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">{trendStats.currentScore}</span>
            <span className="text-xs font-mono text-slate-400">/100</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" style={{ width: `${trendStats.currentScore}%` }} />
          </div>
        </div>

        {/* Metric 2: Risk Mitigation */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-900/80 border border-emerald-500/30 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-300/80 uppercase font-black tracking-wider">Rủi Ro Hiện Tại</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-black">
              -{trendStats.riskReductionPercent}%
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">{trendStats.currentRisk}%</span>
            <span className="text-[10px] font-mono text-slate-400">vùng an toàn</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${100 - trendStats.currentRisk}%` }} />
          </div>
        </div>

        {/* Metric 3: Milestones */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-purple-950/30 to-slate-900/80 border border-purple-500/30 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-300/80 uppercase font-black tracking-wider">Cột Mốc Thực Chiến</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-purple-300 tracking-tight">{trendStats.milestonesCount}</span>
            <span className="text-xs font-mono text-slate-400">cột mốc</span>
          </div>
          <div className="text-[10px] font-mono text-purple-300 flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Tiến bộ vững chắc</span>
          </div>
        </div>

        {/* Metric 4: Growth Velocity */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-900/80 border border-amber-500/30 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-300/80 uppercase font-black tracking-wider">Tốc Độ Tăng Điểm</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-tight">+{trendStats.dailyVelocity}</span>
            <span className="text-[10px] font-mono text-slate-400">điểm / ngày</span>
          </div>
          <div className="text-[10px] font-mono text-amber-300/90">
            Cao gấp 2.4x trung bình
          </div>
        </div>
      </div>

      {/* 3. Metric Filter Tabs (Clean Pills) */}
      <div className="flex flex-wrap items-center gap-1.5 relative z-10 pt-1">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1">Trục đường:</span>

        <button
          onClick={() => setSelectedMetric('all_sdi')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
            selectedMetric === 'all_sdi'
              ? 'bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-400/20'
              : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Điểm SDI</span>
        </button>

        <button
          onClick={() => setSelectedMetric('risk_index')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
            selectedMetric === 'risk_index'
              ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
              : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Tỷ Lệ Rủi Ro (%)</span>
        </button>

        <button
          onClick={() => setSelectedMetric('psychology')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
            selectedMetric === 'psychology'
              ? 'bg-purple-500 text-slate-950 font-black shadow-lg shadow-purple-500/20'
              : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Tâm Lý</span>
        </button>

        <button
          onClick={() => setSelectedMetric('technical')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
            selectedMetric === 'technical'
              ? 'bg-sky-400 text-slate-950 font-black shadow-lg shadow-sky-400/20'
              : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Kỹ Thuật & AI</span>
        </button>

        <button
          onClick={() => setSelectedMetric('financial')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
            selectedMetric === 'financial'
              ? 'bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-400/20'
              : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Tài Chính</span>
        </button>

        <button
          onClick={() => setSelectedMetric('compare_all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
            selectedMetric === 'compare_all'
              ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
              : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Xem Cả 3 Trụ Cột</span>
        </button>
      </div>

      {/* 4. Interactive Vector Telemetry Graph */}
      <div className="relative p-2 sm:p-4 rounded-3xl bg-slate-950/80 border border-slate-800/80 overflow-hidden shadow-2xl">
        {/* Glow grid background */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
            className="w-full min-w-[620px] h-auto select-none overflow-visible"
            onMouseLeave={() => setHoveredPointIndex(null)}
          >
            <defs>
              {/* SDI Area Gradient */}
              <linearGradient id="neonSdiArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#10b981" stopOpacity="0.20" />
                <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
              </linearGradient>

              {/* Risk Area Gradient */}
              <linearGradient id="neonRiskArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#fb7185" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
              </linearGradient>

              {/* Psychology Area Gradient */}
              <linearGradient id="neonPsyArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#a855f7" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
              </linearGradient>

              {/* Technical Area Gradient */}
              <linearGradient id="neonTechArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
              </linearGradient>

              {/* Financial Area Gradient */}
              <linearGradient id="neonFinArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
              </linearGradient>

              {/* Glowing Stroke Filters */}
              <filter id="neonGlowCyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#22d3ee" floodOpacity="0.8" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="neonGlowRose" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#f43f5e" floodOpacity="0.8" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="neonGlowPurple" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#c084fc" floodOpacity="0.75" />
              </filter>
              <filter id="neonGlowSky" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.75" />
              </filter>
              <filter id="neonGlowEmerald" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#34d399" floodOpacity="0.75" />
              </filter>
            </defs>

            {/* Grid Lines & Labels */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = chartConfig.getY(val);
              return (
                <g key={`grid-line-${val}`}>
                  <line
                    x1={chartConfig.padding.left}
                    y1={y}
                    x2={chartConfig.width - chartConfig.padding.right}
                    y2={y}
                    stroke="rgba(148, 163, 184, 0.10)"
                    strokeWidth="1"
                    strokeDasharray={val === 0 || val === 100 ? 'none' : '4 4'}
                  />
                  <text
                    x={chartConfig.padding.left - 10}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="central"
                    className="text-[10px] font-mono fill-slate-500 font-bold"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* National Benchmark Line */}
            {showCommunityBenchmark && (
              <g>
                <path
                  d={chartConfig.commPath}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-75"
                />
                <text
                  x={chartConfig.width - chartConfig.padding.right}
                  y={chartConfig.getY(63.5) - 6}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-purple-400 font-black"
                >
                  Chuẩn QG (63.5)
                </text>
              </g>
            )}

            {/* Area Fills */}
            {selectedMetric === 'all_sdi' && (
              <path d={chartConfig.sdiAreaPath} fill="url(#neonSdiArea)" />
            )}
            {selectedMetric === 'risk_index' && (
              <path d={chartConfig.riskAreaPath} fill="url(#neonRiskArea)" />
            )}

            {/* Compare All Lines */}
            {selectedMetric === 'compare_all' && (
              <>
                <path d={chartConfig.psyPath} fill="none" stroke="#c084fc" strokeWidth="2.5" filter="url(#neonGlowPurple)" />
                <path d={chartConfig.techPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" filter="url(#neonGlowSky)" />
                <path d={chartConfig.finPath} fill="none" stroke="#34d399" strokeWidth="2.5" filter="url(#neonGlowEmerald)" />
              </>
            )}

            {/* Single Metric Lines */}
            {selectedMetric === 'all_sdi' && (
              <path
                d={chartConfig.sdiPath}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonGlowCyan)"
              />
            )}

            {selectedMetric === 'risk_index' && (
              <path
                d={chartConfig.riskPath}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonGlowRose)"
              />
            )}

            {selectedMetric === 'psychology' && (
              <path
                d={chartConfig.psyPath}
                fill="none"
                stroke="#c084fc"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonGlowPurple)"
              />
            )}

            {selectedMetric === 'technical' && (
              <path
                d={chartConfig.techPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonGlowSky)"
              />
            )}

            {selectedMetric === 'financial' && (
              <path
                d={chartConfig.finPath}
                fill="none"
                stroke="#34d399"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonGlowEmerald)"
              />
            )}

            {/* Vertical HUD Guide Line on hover */}
            {hoveredPointIndex !== null && displayedHistory[hoveredPointIndex] && (
              <g>
                <line
                  x1={chartConfig.getX(hoveredPointIndex)}
                  y1={chartConfig.padding.top}
                  x2={chartConfig.getX(hoveredPointIndex)}
                  y2={chartConfig.height - chartConfig.padding.bottom}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              </g>
            )}

            {/* Point Nodes */}
            {displayedHistory.map((point, idx) => {
              const x = chartConfig.getX(idx);
              const curVal =
                selectedMetric === 'all_sdi'
                  ? point.overallScore
                  : selectedMetric === 'risk_index'
                  ? point.riskScore
                  : selectedMetric === 'psychology'
                  ? point.psychologyScore
                  : selectedMetric === 'technical'
                  ? point.technicalScore
                  : selectedMetric === 'financial'
                  ? point.financialScore
                  : point.overallScore;

              const y = chartConfig.getY(curVal);
              const isHovered = hoveredPointIndex === idx;
              const hasMilestone = !!point.milestoneEvent;

              return (
                <g key={`data-node-${idx}`} className="cursor-pointer">
                  {/* Broad hover target */}
                  <rect
                    x={x - (chartConfig.innerWidth / (displayedHistory.length - 1)) / 2}
                    y={chartConfig.padding.top}
                    width={chartConfig.innerWidth / (displayedHistory.length - 1)}
                    height={chartConfig.innerHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onClick={() => setHoveredPointIndex(idx)}
                  />

                  {/* Milestone Pulse Halo */}
                  {hasMilestone && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 12 : 8}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      className="animate-ping opacity-70"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6.5 : hasMilestone ? 5 : 3.5}
                    fill={
                      hasMilestone
                        ? '#f59e0b'
                        : selectedMetric === 'risk_index'
                        ? '#f43f5e'
                        : selectedMetric === 'psychology'
                        ? '#c084fc'
                        : selectedMetric === 'technical'
                        ? '#38bdf8'
                        : '#22d3ee'
                    }
                    stroke="#020617"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}

            {/* X-Axis Date Labels */}
            {displayedHistory.map((point, idx) => {
              const shouldShowLabel =
                timeframe === '7d' ||
                (timeframe === '14d' && idx % 2 === 0) ||
                (timeframe === '30d' && (idx % 4 === 0 || idx === displayedHistory.length - 1));

              if (!shouldShowLabel) return null;

              const x = chartConfig.getX(idx);
              const y = chartConfig.height - chartConfig.padding.bottom + 16;

              return (
                <text
                  key={`xaxis-label-${idx}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className={`text-[9px] font-mono transition-colors ${
                    hoveredPointIndex === idx ? 'fill-cyan-300 font-black' : 'fill-slate-500'
                  }`}
                >
                  {point.date}
                </text>
              );
            })}
          </svg>
        </div>

        {/* 5. Sleek Cyber HUD Inspector Pill (Compact & Fast) */}
        {activePoint && (
          <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
            {/* Left: Snapshot date and core SDI score */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-black text-white">{activePoint.fullDate}</span>
                <span className="text-slate-500">• Ngày {activePoint.dayIndex}/30</span>
              </div>

              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
                <span className="text-slate-400">SDI:</span>
                <strong className="text-cyan-300 font-black text-sm">{activePoint.overallScore}</strong>
              </div>

              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Rủi ro:</span>
                <strong className={activePoint.riskScore <= 20 ? 'text-emerald-400' : 'text-amber-400'}>
                  {activePoint.riskScore}%
                </strong>
              </div>
            </div>

            {/* Middle: 3 Pillars Compact Spark Meters */}
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="px-2 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300">
                Tâm lý: <strong className="text-white">{activePoint.psychologyScore}</strong>
              </span>
              <span className="px-2 py-1 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300">
                Kỹ thuật: <strong className="text-white">{activePoint.technicalScore}</strong>
              </span>
              <span className="px-2 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                Tài chính: <strong className="text-white">{activePoint.financialScore}</strong>
              </span>
            </div>

            {/* Right: Milestone highlight if any */}
            {activePoint.milestoneEvent && (
              <div className="flex items-center space-x-1.5 text-amber-300 text-[11px] bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-500/30 font-bold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[200px]">{activePoint.milestoneEvent.title}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. Milestone Breakthrough Strip (Clean Horizontal Chips) */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>5 Cột Mốc Phòng Thủ Đã Chinh Phục:</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">Chạm để soi lại mốc điểm</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {displayedHistory
            .filter((p) => !!p.milestoneEvent)
            .map((milestonePoint) => {
              const evt = milestonePoint.milestoneEvent!;
              const isSelected = activePoint?.dayIndex === milestonePoint.dayIndex;

              return (
                <button
                  key={`ms-chip-${milestonePoint.dayIndex}`}
                  onClick={() => {
                    const idx = displayedHistory.findIndex((p) => p.dayIndex === milestonePoint.dayIndex);
                    if (idx !== -1) setHoveredPointIndex(idx);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-amber-950/50 border-amber-500 shadow-md shadow-amber-500/10 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-amber-400 mb-1">
                    <span>{milestonePoint.date}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300 font-bold">
                      {milestonePoint.overallScore} đ
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{evt.title}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+{evt.xpEarned} XP</div>
                </button>
              );
            })}
        </div>
      </div>

      {/* 7. Action CTA Footer */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-3 text-xs text-slate-300">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Tiến độ ổn định. Hoàn thành thêm 2 bài tập trong Arena để đẩy điểm SDI vượt <strong>90/100</strong>.</span>
        </div>

        <button
          onClick={() => onNavigateToArena?.()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-black flex items-center space-x-1.5 shadow-md cursor-pointer whitespace-nowrap transition-all"
        >
          <Target className="w-4 h-4" />
          <span>Vào Arena</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
