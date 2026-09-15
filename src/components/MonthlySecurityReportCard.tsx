import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Sparkles,
  Zap,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  FileText,
  Share2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  HelpCircle,
  Eye,
  Mail,
  Video,
  QrCode,
  HeartHandshake,
  Check,
  Printer,
} from 'lucide-react';
import { MonthlySecurityReport, UserProfile } from '../types';
import { calculateMonthlySecurityReport, MONTHLY_REPORTS_ARCHIVE } from '../data/monthlySecurityReports';
import { playSuccessChime, playChestFanfare, playButtonClick } from '../utils/audioEffects';

interface MonthlySecurityReportCardProps {
  userProfile?: UserProfile;
  onEarnXp?: (amount: number) => void;
  onNavigateToTrain?: () => void;
}

export const MonthlySecurityReportCard: React.FC<MonthlySecurityReportCardProps> = ({
  userProfile,
  onEarnXp,
  onNavigateToTrain,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [report, setReport] = useState<MonthlySecurityReport>(() =>
    calculateMonthlySecurityReport('2026-09', userProfile)
  );
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [isRefreshingAi, setIsRefreshingAi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleMonthChange = (monthCode: string) => {
    playButtonClick();
    setSelectedMonth(monthCode);
    setReport(calculateMonthlySecurityReport(monthCode, userProfile));
  };

  const handleRefreshAi = () => {
    playButtonClick();
    setIsRefreshingAi(true);
    setTimeout(() => {
      setIsRefreshingAi(false);
      playSuccessChime();
    }, 900);
  };

  const handleShareReport = () => {
    playChestFanfare();
    if (onEarnXp) {
      onEarnXp(50);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail':
        return <Mail className="w-4 h-4 text-cyan-400" />;
      case 'Video':
        return <Video className="w-4 h-4 text-pink-400" />;
      case 'QrCode':
        return <QrCode className="w-4 h-4 text-emerald-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-rose-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
    }
  };

  // SVG Chart calculation parameters
  const chartWidth = 600;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 30;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const minAccuracy = 40;
  const maxAccuracy = 100;

  const points = report.historicalAccuracy.map((pt, idx) => {
    const x = paddingX + (idx / Math.max(1, report.historicalAccuracy.length - 1)) * innerWidth;
    const y =
      chartHeight -
      paddingY -
      ((pt.accuracy - minAccuracy) / (maxAccuracy - minAccuracy)) * innerHeight;
    return { ...pt, x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    // Catmull-Rom or cubic curve
    const prev = points[idx - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-6 relative overflow-hidden bg-slate-900/90">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>BÁO CÁO AN NINH & TIẾN BỘ ĐỊNH KỲ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Báo Cáo An Ninh Hàng Tháng</span>
            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              Độ Chính Xác Nhận Diện
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Tổng hợp và đánh giá mức độ tiến bộ trong việc bóc trần thủ đoạn lừa đảo qua thời gian
          </p>
        </div>

        {/* Month Selector Tabs */}
        <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner flex-wrap gap-1">
          {Object.keys(MONTHLY_REPORTS_ARCHIVE).map((mCode) => {
            const isSelected = selectedMonth === mCode;
            const archiveInfo = MONTHLY_REPORTS_ARCHIVE[mCode];
            return (
              <button
                key={mCode}
                onClick={() => handleMonthChange(mCode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{mCode === '2026-09' ? 'T09/2026 (Hiện Tại)' : archiveInfo.name.split(' ')[0] + ' ' + archiveInfo.name.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Key Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Card 1: Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-2 relative overflow-hidden group hover:border-cyan-400/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Độ Chính Xác Tổng Thể</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{report.overallAccuracy}%</span>
            <span
              className={`inline-flex items-center text-xs font-black px-2 py-0.5 rounded-full ${
                report.accuracyDelta >= 0
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {report.accuracyDelta >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {report.accuracyDelta >= 0 ? `+${report.accuracyDelta}%` : `${report.accuracyDelta}%`}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Tháng trước: {report.previousMonthAccuracy}%</span>
            <span className="text-cyan-400 font-semibold">Mục tiêu: 95%</span>
          </div>
        </div>

        {/* Card 2: Threats Deflected */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2 relative overflow-hidden group hover:border-emerald-400/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kịch Bản Đã Bóc Trần</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400">
              {report.correctDetections}
              <span className="text-base font-bold text-slate-500"> / {report.totalThreatsAnalyzed}</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Tỉ lệ bảo toàn: {Math.round((report.correctDetections / report.totalThreatsAnalyzed) * 100)}%</span>
            <span className="text-emerald-400 font-semibold">An toàn 100%</span>
          </div>
        </div>

        {/* Card 3: Reaction Speed */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2 relative overflow-hidden group hover:border-amber-400/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tốc Độ Phản Xạ Nhận Diện</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400">{report.avgResponseTimeSec}s</span>
            <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Nhanh hơn -{report.responseTimeImprovementSec}s
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Chuẩn khuyến nghị: &lt; 5.0s</span>
            <span className="text-amber-400 font-semibold">Tối ưu xuất sắc</span>
          </div>
        </div>

        {/* Card 4: Defense Grade */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-purple-500/30 space-y-2 relative overflow-hidden group hover:border-purple-400/50 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Xếp Hạng Danh Dự</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-purple-300">{report.grade}</span>
            <span className="text-xs font-bold text-purple-200 truncate">{report.defenseRating.split('(')[0]}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Độ nhất quán: {report.streakConsistency}%</span>
            <span className="text-purple-400 font-semibold">Top 5% Vệ Binh</span>
          </div>
        </div>
      </div>

      {/* Main Section: Historical Accuracy Trend Chart */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 relative z-10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Biểu Đồ Xu Hướng Tăng Trưởng Độ Chính Xác (6 Tháng Gần Nhất)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Quan sát sự nâng cao nhận thức và phản xạ trước các kịch bản lừa đảo qua từng chu kỳ huấn luyện
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span>Độ chính xác (%)</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-bold">
              Tăng trưởng ròng: +{(report.historicalAccuracy[report.historicalAccuracy.length - 1].accuracy - report.historicalAccuracy[0].accuracy).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full overflow-x-auto py-2">
          <div className="min-w-[550px] relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[40, 60, 80, 100].map((val) => {
                const y =
                  chartHeight -
                  paddingY -
                  ((val - minAccuracy) / (maxAccuracy - minAccuracy)) * innerHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Stroke Line */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPointIndex === idx;
                const isLast = idx === points.length - 1;

                return (
                  <g
                    key={pt.month}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  >
                    {/* Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered || isLast ? 6 : 4.5}
                      fill={isLast ? '#10b981' : '#06b6d4'}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="filter drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                    />

                    {/* X-axis Label */}
                    <text
                      x={pt.x}
                      y={chartHeight - 8}
                      fill={isLast ? '#38bdf8' : '#94a3b8'}
                      fontSize="11"
                      textAnchor="middle"
                      fontWeight={isLast ? 'bold' : 'normal'}
                    >
                      {pt.label}
                    </text>

                    {/* Value label */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      fill={isLast ? '#34d399' : '#e2e8f0'}
                      fontSize="11"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {pt.accuracy}%
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip overlay */}
            {hoveredPointIndex !== null && points[hoveredPointIndex] && (
              <div
                className="absolute bg-slate-900 border border-cyan-500/50 p-2.5 rounded-xl shadow-2xl text-xs space-y-1 pointer-events-none z-30 transition-all"
                style={{
                  left: `${(points[hoveredPointIndex].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredPointIndex].y / chartHeight) * 100 - 30}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <div className="font-black text-cyan-300">{points[hoveredPointIndex].label}</div>
                <div className="text-white font-bold">
                  Độ chính xác: <span className="text-emerald-400">{points[hoveredPointIndex].accuracy}%</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Bóc trần: {points[hoveredPointIndex].scamsBlocked}/{points[hoveredPointIndex].scamsTested} kịch bản
                </div>
                {points[hoveredPointIndex].highlightMilestone && (
                  <div className="text-[10px] text-amber-300 font-semibold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                    ⭐ {points[hoveredPointIndex].highlightMilestone}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Evolution Breakdown (2 Columns) */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Chi Tiết Năng Lực & Tiến Bộ Theo Từng Loại Thủ Đoạn</span>
          </h3>
          <span className="text-xs text-slate-400">So sánh Tháng trước vs Tháng này</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {report.categoryBreakdown.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    {renderCategoryIcon(cat.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{cat.category}</h4>
                    <span className="text-[10px] text-slate-400">{cat.threatsEncountered} tình huống thử thách</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center space-x-1.5 justify-end">
                    <span className="text-xs text-slate-500 line-through">{cat.previousAccuracy}%</span>
                    <span className="text-xs font-black text-emerald-400">{cat.currentAccuracy}%</span>
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      cat.status === 'mastered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : cat.status === 'improving'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {cat.status === 'mastered'
                      ? '⭐ Đã Tinh Thông'
                      : cat.status === 'improving'
                      ? '📈 Tiến Bộ Vượt Bậc'
                      : '⚠️ Cần Thực Hành'}
                  </span>
                </div>
              </div>

              {/* Progress visual comparison bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex border border-slate-800">
                  <div
                    className="h-full bg-slate-600 transition-all"
                    style={{ width: `${cat.previousAccuracy}%` }}
                    title={`Tháng trước: ${cat.previousAccuracy}%`}
                  />
                  {cat.improvementDelta > 0 && (
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all animate-pulse"
                      style={{ width: `${cat.improvementDelta}%` }}
                      title={`Tăng thêm: +${cat.improvementDelta}%`}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Trước: {cat.previousAccuracy}%</span>
                  <span className="text-emerald-400 font-semibold">Tăng +{cat.improvementDelta}%</span>
                  <span>Hiện tại: {cat.currentAccuracy}%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug border-t border-slate-900 pt-2 font-medium">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Cyber Coach Assessment & Action Plan */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 space-y-4 relative z-10 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Huấn Luyện Viên AI: Nhận Định Chuyên Sâu Tháng {report.monthCode.split('-')[1]}/{report.monthCode.split('-')[0]}
              </h3>
              <p className="text-xs text-slate-400">Trí tuệ nhân tạo phân tích tiến trình hành vi</p>
            </div>
          </div>

          <button
            onClick={handleRefreshAi}
            disabled={isRefreshingAi}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingAi ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isRefreshingAi ? 'Đang phân tích...' : 'Phân Tích Lại'}</span>
          </button>
        </div>

        {/* AI Summary Quote */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          "{report.aiAnalysisSummary}"
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Highlights */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Điểm Tiến Bộ Nổi Bật Trong Tháng</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {report.keyHighlights.map((hl, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations for next month */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Lộ Trình Trọng Tâm Huấn Luyện Kỳ Tới</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {report.recommendedFocus.map((rec, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Footer: Certificate & Share */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800 relative z-10">
        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Mã báo cáo: <strong className="text-slate-300">SCAMGUARD-SEC-REP-{report.monthCode}</strong></span>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              playButtonClick();
              setShowCertificateModal(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md hover:text-white"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Xem Chứng Nhận Tháng</span>
          </button>

          <button
            onClick={handleShareReport}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Share2 className="w-4 h-4 text-slate-950" />}
            <span>{copiedLink ? 'Đã Sao Chép Link (+50 XP)' : 'Chia Sẻ Báo Cáo (+50 XP)'}</span>
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden text-center">
            <div className="glow-orb-cyan -top-12 -left-12 opacity-50" />
            <div className="glow-orb-pink -bottom-12 -right-12 opacity-50" />

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/20">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-extrabold tracking-wider uppercase text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full inline-block border border-amber-500/30">
                CHỨNG CHỈ AN NINH MẠNG SCAMGUARD
              </div>
              <h3 className="text-xl font-black text-white">Chứng Nhận Phòng Vệ Xuất Sắc</h3>
              <p className="text-xs text-slate-300">Kỳ Đánh Giá {report.reportMonth}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Vệ binh:</span>
                <strong className="text-white">{userProfile?.name || 'Hiệp Sĩ Số'}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Độ chính xác đạt:</span>
                <strong className="text-emerald-400 text-sm font-black">{report.overallAccuracy}%</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cấp bậc công nhận:</span>
                <strong className="text-purple-300 font-bold">{report.defenseRating}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Số thủ đoạn bóc trần:</span>
                <strong className="text-cyan-400">{report.correctDetections} kịch bản</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  playButtonClick();
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In / Tải PDF</span>
              </button>

              <button
                onClick={() => {
                  playButtonClick();
                  setShowCertificateModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black cursor-pointer shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
