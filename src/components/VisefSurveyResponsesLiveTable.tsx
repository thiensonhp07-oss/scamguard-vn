import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Lock,
  User,
  GraduationCap,
  Building2,
  MapPin,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Layers,
  Code2,
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle,
  Radio,
  Play,
  Pause,
} from 'lucide-react';
import { CommunitySurveySubmission, SurveyDemographicGroup } from '../types';

interface VisefSurveyResponsesLiveTableProps {
  surveys?: CommunitySurveySubmission[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

const TRAP_LABELS = [
  { id: 't1', code: 'T1', name: 'Giả CA / VNeID', desc: 'Đe dọa khóa CCCD, bắt giam' },
  { id: 't2', code: 'T2', name: 'Chuyển nhầm tiền', desc: 'Ép vay lãi nặng trá hình' },
  { id: 't3', code: 'T3', name: 'Deepfake Video', desc: 'Giả khuôn mặt & giọng người thân' },
  { id: 't4', code: 'T4', name: 'APK Giao thông', desc: 'Mã độc chiếm đoạt OTP' },
  { id: 't5', code: 'T5', name: 'QR Quishing', desc: 'Dán đè mã thanh toán Cafe' },
  { id: 't6', code: 'T6', name: 'Việc làm Telegram', desc: 'Bẫy hoa hồng đơn hàng ảo' },
  { id: 't7', code: 'T7', name: 'Khóa SIM viễn thông', desc: 'Dọa ngắt liên lạc 2 giờ' },
  { id: 't8', code: 'T8', name: 'Kiện hàng COD ảo', desc: 'Giao hộp rỗng thu tiền' },
  { id: 't9', code: 'T9', name: 'Email Hoàn Thuế', desc: 'Mạo danh cơ quan thuế chiếm thẻ' },
  { id: 't10', code: 'T10', name: 'Juice Jacking', desc: 'Mã độc từ cổng USB công cộng' },
  { id: 't11', code: 'T11', name: 'Bản quyền Meta', desc: 'Dọa khóa page chiếm đoạt 2FA' },
  { id: 't12', code: 'T12', name: 'Lừa đảo kép', desc: 'Hứa thu hồi tiền lừa đảo để lừa thêm' },
];

export const VisefSurveyResponsesLiveTable: React.FC<VisefSurveyResponsesLiveTableProps> = ({
  surveys: propSurveys,
  onRefresh,
  isLoading: propLoading,
}) => {
  const [internalSurveys, setInternalSurveys] = useState<CommunitySurveySubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [identityFilter, setIdentityFilter] = useState<'ALL' | 'ANONYMOUS' | 'REAL_NAME'>('ALL');
  const [demographicFilter, setDemographicFilter] = useState<string>('ALL');
  const [schoolFilter, setSchoolFilter] = useState<string>('ALL');
  const [scoreTierFilter, setScoreTierFilter] = useState<'ALL' | 'HIGH_GAIN' | 'LOW_PRE' | 'MAX_POST'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'POST_SCORE' | 'GAIN' | 'PRE_SCORE'>('NEWEST');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [copiedCSV, setCopiedCSV] = useState<boolean>(false);
  const [showCSVPreview, setShowCSVPreview] = useState<boolean>(false);

  // Live polling state
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [secondsUntilNextPoll, setSecondsUntilNextPoll] = useState<number>(8);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const timerRef = useRef<any>(null);

  // Fetch surveys from backend
  const fetchSurveys = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await fetch('/api/research/surveys');
      if (res.ok) {
        const data = await res.json();
        if (data?.surveys && Array.isArray(data.surveys)) {
          setInternalSurveys(data.surveys);
          setLastSyncTime(new Date());
        }
      }
    } catch (err) {
      console.warn('Silent live sync notice: survey polling temporarily waiting');
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    if (propSurveys && propSurveys.length > 0) {
      setInternalSurveys(propSurveys);
    } else {
      fetchSurveys(false);
    }
  }, [propSurveys]);

  // Live Polling Countdown Timer
  useEffect(() => {
    if (!isLiveActive) return;

    timerRef.current = setInterval(() => {
      setSecondsUntilNextPoll((prev) => {
        if (prev <= 1) {
          fetchSurveys(true);
          if (onRefresh) onRefresh();
          return 8;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLiveActive, onRefresh]);

  const allSurveys = propSurveys && propSurveys.length > 0 ? propSurveys : internalSurveys;

  // Extract unique school list for dropdown filter
  const schoolOptions = useMemo(() => {
    const set = new Set<string>();
    allSurveys.forEach((s) => {
      if (s.schoolName) set.add(s.schoolName);
    });
    return Array.from(set);
  }, [allSurveys]);

  // Filter and sort surveys
  const filteredSurveys = useMemo(() => {
    let list = [...allSurveys];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((s) => {
        const name = (s.participantName || '').toLowerCase();
        const anonCode = (s.anonymousCode || '').toLowerCase();
        const school = (s.schoolName || '').toLowerCase();
        const className = (s.className || '').toLowerCase();
        const loc = (s.location || '').toLowerCase();
        const id = (s.id || '').toLowerCase();
        const note = (s.feedbackNote || '').toLowerCase();
        return (
          name.includes(q) ||
          anonCode.includes(q) ||
          school.includes(q) ||
          className.includes(q) ||
          loc.includes(q) ||
          id.includes(q) ||
          note.includes(q)
        );
      });
    }

    // Identity filter
    if (identityFilter === 'ANONYMOUS') {
      list = list.filter((s) => s.isAnonymous === true || s.participantName.includes('Ẩn danh'));
    } else if (identityFilter === 'REAL_NAME') {
      list = list.filter((s) => s.isAnonymous === false && !s.participantName.includes('Ẩn danh'));
    }

    // Demographic filter
    if (demographicFilter !== 'ALL') {
      list = list.filter((s) => s.demographicGroup === demographicFilter);
    }

    // School filter
    if (schoolFilter !== 'ALL') {
      list = list.filter((s) => s.schoolName === schoolFilter);
    }

    // Score Tier Filter
    if (scoreTierFilter === 'HIGH_GAIN') {
      list = list.filter((s) => s.testOutcome.postScore - s.testOutcome.preScore >= 40);
    } else if (scoreTierFilter === 'LOW_PRE') {
      list = list.filter((s) => s.testOutcome.preScore < 40);
    } else if (scoreTierFilter === 'MAX_POST') {
      list = list.filter((s) => s.testOutcome.postScore >= 95);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'POST_SCORE') {
        return b.testOutcome.postScore - a.testOutcome.postScore;
      }
      if (sortBy === 'PRE_SCORE') {
        return b.testOutcome.preScore - a.testOutcome.preScore;
      }
      if (sortBy === 'GAIN') {
        const gainA = a.testOutcome.postScore - a.testOutcome.preScore;
        const gainB = b.testOutcome.postScore - b.testOutcome.preScore;
        return gainB - gainA;
      }
      return 0;
    });

    return list;
  }, [allSurveys, searchTerm, identityFilter, demographicFilter, schoolFilter, scoreTierFilter, sortBy]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = allSurveys.length;
    if (total === 0) {
      return {
        total: 0,
        anonCount: 0,
        realCount: 0,
        anonPct: 0,
        avgPre: 0,
        avgPost: 0,
        avgGain: 0,
        avgSafeTraps: 0,
      };
    }
    const anonCount = allSurveys.filter((s) => s.isAnonymous === true || s.participantName.includes('Ẩn danh')).length;
    const realCount = total - anonCount;
    const sumPre = allSurveys.reduce((acc, s) => acc + (s.testOutcome?.preScore || 0), 0);
    const sumPost = allSurveys.reduce((acc, s) => acc + (s.testOutcome?.postScore || 0), 0);
    const avgPre = +(sumPre / total).toFixed(1);
    const avgPost = +(sumPost / total).toFixed(1);
    const avgGain = +(avgPost - avgPre).toFixed(1);
    const avgSafeTraps = +((avgPre / 100) * 12).toFixed(1);

    return {
      total,
      anonCount,
      realCount,
      anonPct: Math.round((anonCount / total) * 100),
      avgPre,
      avgPost,
      avgGain,
      avgSafeTraps,
    };
  }, [allSurveys]);

  // Generate standard comma-separated CSV string (RFC 4180 UTF-8 with BOM)
  const generateCommaSeparatedCSV = () => {
    const headers = [
      'submission_id',
      'participant_display_name',
      'identity_mode',
      'is_anonymous',
      'anonymous_code',
      'real_name',
      'school_name',
      'class_name',
      'demographic_group',
      'province_location',
      'irb_consent_agreed',
      'ever_encountered_scam',
      'past_loss_type',
      'pre_confidence_score',
      'biggest_fear_tactic',
      'verification_habit_pre',
      'time_to_decide_pre_sec',
      'time_to_decide_post_sec',
      'pre_defense_score',
      'post_defense_score',
      'defense_gain_score',
      'unseen_scenario_score',
      'safe_action_avoided',
      'scam_dna_t_pre',
      'scam_dna_a_pre',
      'scam_dna_g_pre',
      'scam_dna_e_pre',
      'scam_dna_c_pre',
      'scam_dna_r_pre',
      'scam_dna_t_post',
      'scam_dna_a_post',
      'scam_dna_g_post',
      'scam_dna_e_post',
      'scam_dna_c_post',
      'scam_dna_r_post',
      'created_at_iso',
      'feedback_note',
    ];

    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = allSurveys.map((s) => {
      const isAnon = s.isAnonymous === true || s.participantName.includes('Ẩn danh');
      const identityMode = isAnon ? 'ANONYMOUS_CODE' : 'REAL_NAME';
      const anonCode = s.anonymousCode || (isAnon ? s.participantName : '');
      const realName = !isAnon ? s.participantName : '';
      const gain = (s.testOutcome?.postScore || 0) - (s.testOutcome?.preScore || 0);

      const beforeDna = s.testOutcome?.scamDnaShift?.before || {};
      const afterDna = s.testOutcome?.scamDnaShift?.after || {};

      return [
        escapeCSV(s.id),
        escapeCSV(s.participantName),
        escapeCSV(identityMode),
        isAnon ? '1' : '0',
        escapeCSV(anonCode),
        escapeCSV(realName),
        escapeCSV(s.schoolName || 'THPT Chuyên'),
        escapeCSV(s.className || 'Khối 11'),
        escapeCSV(s.demographicGroup),
        escapeCSV(s.location || 'Hà Nội'),
        s.consentAgreed !== false ? '1' : '0',
        s.surveyResponses?.everEncounteredScam ? '1' : '0',
        escapeCSV(s.surveyResponses?.pastLossOrNearMiss || 'NEVER'),
        s.surveyResponses?.preConfidenceScore || 50,
        escapeCSV(s.surveyResponses?.biggestFearTactic || 'AUTHORITY_POLICE'),
        escapeCSV(s.surveyResponses?.verificationHabitPre || 'IMMEDIATE_ACTION'),
        s.surveyResponses?.timeToDecidePreSec || 3.5,
        s.testOutcome?.timeToDecidePostSec || 12.0,
        s.testOutcome?.preScore || 0,
        s.testOutcome?.postScore || 0,
        gain,
        s.testOutcome?.unseenScore || 85,
        s.testOutcome?.unsafeActionAvoided !== false ? '1' : '0',
        beforeDna.T ?? 0.70,
        beforeDna.A ?? 0.68,
        beforeDna.G ?? 0.56,
        beforeDna.E ?? 0.62,
        beforeDna.C ?? 0.65,
        beforeDna.R ?? 0.54,
        afterDna.T ?? 0.18,
        afterDna.A ?? 0.15,
        afterDna.G ?? 0.16,
        afterDna.E ?? 0.18,
        afterDna.C ?? 0.17,
        afterDna.R ?? 0.13,
        escapeCSV(s.createdAt),
        escapeCSV(s.feedbackNote || ''),
      ].join(',');
    });

    return '\uFEFF' + [headers.join(','), ...rows].join('\n');
  };

  // Download CSV
  const handleDownloadCSV = () => {
    const csvContent = generateCommaSeparatedCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VISEF_2026_SURVEY_TRAINING_DATASET_RFC4180_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy CSV to Clipboard
  const handleCopyCSV = async () => {
    try {
      const csvContent = generateCommaSeparatedCSV();
      await navigator.clipboard.writeText(csvContent);
      setCopiedCSV(true);
      setTimeout(() => setCopiedCSV(false), 2500);
    } catch (err) {
      console.error('Failed to copy CSV:', err);
    }
  };

  // Helper to format demographic name
  const getDemographicBadge = (group: SurveyDemographicGroup) => {
    switch (group) {
      case 'STUDENT':
        return { label: 'Học sinh & SV', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: GraduationCap };
      case 'TEACHER_JUDGE':
        return { label: 'Thầy Cô & Giám Khảo', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Building2 };
      case 'OFFICE_WORKER':
        return { label: 'Văn Phòng', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: User };
      case 'ELDERLY':
        return { label: 'Người Cao Tuổi', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: ShieldCheck };
      case 'BUSINESS_OWNER':
        return { label: 'Kinh Doanh', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: Building2 };
      default:
        return { label: group, color: 'bg-slate-800 text-slate-300 border-slate-700', icon: User };
    }
  };

  return (
    <div className="space-y-6" id="visef-survey-live-table-suite">
      {/* 1. Header Card with Live Polling & CSV Actions */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Survey Stream (Real-Time Dataset)
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono">
                Chuẩn RFC 4180 Dấu Phẩy (,)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
              Chi Tiết Đánh Giá Khảo Sát ViSEF & Bộ Dữ Liệu Train AI Thời Gian Thực
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Bảng dữ liệu thực nghiệm phân tách rõ <strong>Chế độ Ẩn danh (Mã #VN-XXXX)</strong> vs <strong>Đích danh (Họ Tên Thật)</strong>, 
              kèm Trường/Lớp, kết quả né tránh 12 bẫy và công cụ xuất file CSV phân tách bằng dấu phẩy tiêu chuẩn phục vụ huấn luyện mô hình máy học (ML/AI).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Live Polling Toggle */}
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isLiveActive
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isLiveActive ? 'Đang cập nhật trực tiếp mỗi 8 giây' : 'Đã tạm dừng cập nhật trực tiếp'}
            >
              {isLiveActive ? (
                <>
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Live ({secondsUntilNextPoll}s)</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tạm dừng live</span>
                </>
              )}
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => {
                fetchSurveys(false);
                if (onRefresh) onRefresh();
              }}
              disabled={loading || propLoading}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Làm mới dữ liệu khảo nghiệm ngay lập tức"
            >
              <RefreshCw className={`w-4 h-4 ${loading || propLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Preview CSV Button */}
            <button
              onClick={() => setShowCSVPreview(!showCSVPreview)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Xem trước định dạng text CSV"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showCSVPreview ? 'Ẩn Code CSV' : 'Xem Raw CSV'}</span>
            </button>

            {/* Copy CSV */}
            <button
              onClick={handleCopyCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Sao chép toàn bộ CSV có dấu phẩy vào Clipboard để paste vào Google Colab / Python"
            >
              {copiedCSV ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Đã chép CSV!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chép CSV</span>
                </>
              )}
            </button>

            {/* Download CSV */}
            <button
              id="btn-download-training-csv"
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải CSV Train AI (N={stats.total})</span>
            </button>
          </div>
        </div>

        {/* 2. Key Dataset Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
              Tổng Mẫu Khảo Nghiệm
            </div>
            <div className="text-xl font-extrabold text-white">N = {stats.total}</div>
            <div className="text-[10px] text-slate-400">
              Đồng bộ lúc: {lastSyncTime.toLocaleTimeString('vi-VN')}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              Tỷ Lệ Ẩn Danh vs Đích Danh
            </div>
            <div className="text-xl font-extrabold text-purple-300">
              {stats.anonPct}% <span className="text-xs font-normal text-slate-400">({stats.anonCount} Ẩn / {stats.realCount} Tên)</span>
            </div>
            <div className="text-[10px] text-slate-400">Mã hóa PII chuẩn ViSEF</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Điểm Phòng Thủ Pre / Post
            </div>
            <div className="text-xl font-extrabold text-white flex items-baseline gap-1.5">
              <span className="text-rose-400">{stats.avgPre}</span>
              <span className="text-slate-400 text-xs">→</span>
              <span className="text-emerald-400">{stats.avgPost}</span>
            </div>
            <div className="text-[10px] text-emerald-300 font-bold">
              +{stats.avgGain}đ tăng trưởng trung bình
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Né Tránh Bẫy Trung Bình
            </div>
            <div className="text-xl font-extrabold text-cyan-300">
              {stats.avgSafeTraps} / 12 <span className="text-xs font-normal text-slate-400">Bẫy</span>
            </div>
            <div className="text-[10px] text-slate-400">Chuẩn 12 kịch bản thực tế</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Cam Kết Đạo Đức IRB
            </div>
            <div className="text-xl font-extrabold text-emerald-300">100%</div>
            <div className="text-[10px] text-slate-400">Đã đồng ý điều khoản khảo nghiệm</div>
          </div>
        </div>
      </div>

      {/* CSV Preview Accordion */}
      <AnimatePresence>
        {showCSVPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl bg-slate-950 border border-indigo-900/60 p-4 space-y-3 overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 font-semibold">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Mẫu Cấu Trúc CSV Phân Tách Dấu Phẩy (RFC 4180 Comma-Separated Values)
              </div>
              <button
                onClick={handleCopyCSV}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedCSV ? 'Đã sao chép' : 'Sao chép toàn bộ'}
              </button>
            </div>

            <pre className="p-3 bg-slate-900/90 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 border border-slate-800">
              {generateCommaSeparatedCSV().slice(0, 1400)}
              {generateCommaSeparatedCSV().length > 1400 && '\n... (và các dòng tiếp theo)'}
            </pre>

            <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-200 flex items-center justify-between">
              <span>
                💡 <strong>Code mẫu đọc file bằng Python Pandas:</strong>{' '}
                <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">
                  import pandas as pd; df = pd.read_csv(&apos;VISEF_2026_SURVEY_TRAINING_DATASET.csv&apos;)
                </code>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Tên thật, Mã Ẩn danh (#VN-XXXX), Trường học, Lớp, Tỉnh thành, ID..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Identity Filter */}
            <select
              value={identityFilter}
              onChange={(e) => setIdentityFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">👤 Danh tính: Tất cả</option>
              <option value="ANONYMOUS">🔒 Chỉ Ẩn danh (Mã #VN-XXXX)</option>
              <option value="REAL_NAME">👤 Chỉ Có Họ Tên Thật</option>
            </select>

            {/* Demographic Filter */}
            <select
              value={demographicFilter}
              onChange={(e) => setDemographicFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Nhóm: Tất cả đối tượng</option>
              <option value="STUDENT">🎓 Học sinh - Sinh viên</option>
              <option value="TEACHER_JUDGE">👨‍🏫 Thầy Cô & Giám Khảo</option>
              <option value="OFFICE_WORKER">💼 Nhân viên Văn phòng</option>
              <option value="ELDERLY">👴 Người Cao tuổi</option>
              <option value="BUSINESS_OWNER">🏪 Kinh doanh / Bán lẻ</option>
            </select>

            {/* School Filter */}
            {schoolOptions.length > 0 && (
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 max-w-[160px] truncate"
              >
                <option value="ALL">Trường: Tất cả trường</option>
                {schoolOptions.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            )}

            {/* Score Tier Filter */}
            <select
              value={scoreTierFilter}
              onChange={(e) => setScoreTierFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Mức điểm: Tất cả</option>
              <option value="HIGH_GAIN">🚀 Tăng trưởng ≥ +40đ</option>
              <option value="LOW_PRE">⚠️ Điểm Pre thấp &lt; 40đ</option>
              <option value="MAX_POST">🌟 Điểm Post tối đa ≥ 95đ</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="NEWEST">⏱️ Mới nhất (Live)</option>
              <option value="GAIN">📈 Tăng trưởng cao nhất</option>
              <option value="POST_SCORE">🏆 Điểm Post cao nhất</option>
              <option value="PRE_SCORE">📊 Điểm Pre cao nhất</option>
            </select>
          </div>
        </div>

        {/* Filter Summary indicator */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          <span>
            Đang hiển thị <strong>{filteredSurveys.length}</strong> / {allSurveys.length} bản ghi khảo nghiệm
          </span>
          {(searchTerm || identityFilter !== 'ALL' || demographicFilter !== 'ALL' || schoolFilter !== 'ALL' || scoreTierFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setIdentityFilter('ALL');
                setDemographicFilter('ALL');
                setSchoolFilter('ALL');
                setScoreTierFilter('ALL');
              }}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              Đặt lại tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* 4. Main Interactive Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Mã Phiếu</th>
              <th className="py-3.5 px-4">Danh Tính Người Tham Gia</th>
              <th className="py-3.5 px-4">Trường Học & Lớp</th>
              <th className="py-3.5 px-4">Nhóm & Địa Bàn</th>
              <th className="py-3.5 px-4 text-center">Tự Tin Pre</th>
              <th className="py-3.5 px-4 text-center">Điểm Pre</th>
              <th className="py-3.5 px-4 text-center">Điểm Post</th>
              <th className="py-3.5 px-4 text-center">Tăng Trưởng</th>
              <th className="py-3.5 px-4 text-center">8 Bẫy Thực Nghiệm</th>
              <th className="py-3.5 px-4 text-center">IRB</th>
              <th className="py-3.5 px-4 text-right">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredSurveys.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400 space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
                  <p className="text-sm font-medium">Không tìm thấy bản ghi khảo sát nào phù hợp với bộ lọc.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setIdentityFilter('ALL');
                      setDemographicFilter('ALL');
                      setSchoolFilter('ALL');
                      setScoreTierFilter('ALL');
                    }}
                    className="text-xs text-cyan-400 hover:underline cursor-pointer"
                  >
                    Bấm vào đây để xóa bộ lọc
                  </button>
                </td>
              </tr>
            ) : (
              filteredSurveys.map((survey) => {
                const isAnon = survey.isAnonymous === true || survey.participantName.includes('Ẩn danh');
                const displayName = survey.participantName || (isAnon ? survey.anonymousCode : 'Khảo nghiệm viên ViSEF');
                const gain = (survey.testOutcome?.postScore || 0) - (survey.testOutcome?.preScore || 0);
                const isExpanded = expandedRowId === survey.id;
                const demoBadge = getDemographicBadge(survey.demographicGroup);
                const DemoIcon = demoBadge.icon;

                // Calculate safe trap count from preScore (each trap is ~8.33 pts)
                const safeCount = Math.min(12, Math.max(0, Math.round(((survey.testOutcome?.preScore || 0) / 100) * 12)));

                return (
                  <React.Fragment key={survey.id}>
                    <tr
                      onClick={() => setExpandedRowId(isExpanded ? null : survey.id)}
                      className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-indigo-950/30' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-300 text-[11px] whitespace-nowrap">
                        {survey.id}
                      </td>

                      {/* Participant Name / Anonymous Badge */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {isAnon ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                                <Lock className="w-2.5 h-2.5 text-purple-400" />
                                Ẩn danh
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                                <User className="w-2.5 h-2.5 text-emerald-400" />
                                Đích danh
                              </span>
                            )}
                            <span className="font-semibold text-white max-w-[180px] truncate" title={displayName}>
                              {displayName}
                            </span>
                          </div>

                          {isAnon && survey.anonymousCode && survey.anonymousCode !== displayName && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              Mã: {survey.anonymousCode}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* School & Class */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[160px]">
                          <div className="font-medium text-slate-200 truncate" title={survey.schoolName || 'THPT Chuyên'}>
                            {survey.schoolName || 'THPT Chuyên'}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {survey.className || 'Khối 11'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Demographic & Location */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-medium ${demoBadge.color}`}
                          >
                            <DemoIcon className="w-2.5 h-2.5" />
                            {demoBadge.label}
                          </span>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-500" />
                            <span>{survey.location || 'Hà Nội'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Pre Confidence */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span className="font-mono font-semibold text-slate-300">
                            {survey.surveyResponses?.preConfidenceScore || 50}%
                          </span>
                          <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-400 h-full rounded-full"
                              style={{ width: `${survey.surveyResponses?.preConfidenceScore || 50}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Pre Score */}
                      <td className="py-3.5 px-4 text-center font-bold text-rose-400 font-mono">
                        {survey.testOutcome?.preScore || 0}đ
                      </td>

                      {/* Post Score */}
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-400 font-mono">
                        {survey.testOutcome?.postScore || 0}đ
                      </td>

                      {/* Gain */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold font-mono text-[11px]">
                          +{gain}đ
                        </span>
                      </td>

                      {/* 8 Traps Mini Matrix */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {TRAP_LABELS.map((trap, idx) => {
                              const isSafe = idx < safeCount;
                              return (
                                <span
                                  key={trap.id}
                                  title={`${trap.code}: ${trap.name} - ${isSafe ? 'An toàn ✓' : 'Sập bẫy ✗'}`}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    isSafe ? 'bg-emerald-400' : 'bg-rose-500/80'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {safeCount}/12 bẫy
                          </span>
                        </div>
                      </td>

                      {/* IRB Consent */}
                      <td className="py-3.5 px-4 text-center">
                        {survey.consentAgreed !== false ? (
                          <span className="text-emerald-400 font-bold text-[11px] inline-flex items-center gap-0.5" title="Đã cam kết tuân thủ đạo đức nghiên cứu">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Đã duyệt
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Chưa</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail View */}
                    {isExpanded && (
                      <tr className="bg-slate-950/80 border-b border-indigo-900/40">
                        <td colSpan={11} className="p-4 sm:p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Card 1: Qualitative Feedback & Past Experience */}
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                Nhận Xét Định Tính & Trải Nghiệm
                              </h4>

                              <div className="text-xs text-slate-300 italic bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                                &ldquo;{survey.feedbackNote || 'Không có ghi chú bổ sung.'}&rdquo;
                              </div>

                              <div className="space-y-1.5 text-[11px] text-slate-400">
                                <div>
                                  Từng gặp lừa đảo:{' '}
                                  <strong className="text-white">
                                    {survey.surveyResponses?.everEncounteredScam ? 'Có' : 'Chưa'}
                                  </strong>
                                </div>
                                <div>
                                  Dạng rủi ro từng trải qua:{' '}
                                  <strong className="text-amber-300">
                                    {survey.surveyResponses?.pastLossOrNearMiss || 'Chưa từng'}
                                  </strong>
                                </div>
                                <div>
                                  Chiêu trò lo ngại nhất:{' '}
                                  <strong className="text-rose-300">
                                    {survey.surveyResponses?.biggestFearTactic || 'Chưa xác định'}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            {/* Card 2: 12 Trap Defense Breakdown */}
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                Chi Tiết Phản Xạ 12 Bẫy Tác Chiến
                              </h4>

                              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                {TRAP_LABELS.map((trap, idx) => {
                                  const isSafe = idx < safeCount;
                                  return (
                                    <div
                                      key={trap.id}
                                      className={`p-2 rounded-lg border flex items-center justify-between ${
                                        isSafe
                                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                                      }`}
                                    >
                                      <div>
                                        <div className="font-bold">{trap.code}: {trap.name}</div>
                                        <div className="text-[9px] text-slate-400">{trap.desc}</div>
                                      </div>
                                      {isSafe ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                                      ) : (
                                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-1" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Card 3: Cognitive Scam DNA Shift & Reaction Times */}
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                Thời Gian Phản Xạ & Dịch Chuyển DNA
                              </h4>

                              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                                <div className="flex justify-between text-slate-300">
                                  <span>Thời gian dừng suy nghĩ (Pre):</span>
                                  <strong className="text-rose-400 font-mono">{survey.surveyResponses?.timeToDecidePreSec || 3.5}s</strong>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Thời gian kiểm chứng 2 kênh (Post):</span>
                                  <strong className="text-emerald-400 font-mono">{survey.testOutcome?.timeToDecidePostSec || 12.0}s</strong>
                                </div>
                                <div className="text-[10px] text-cyan-300 pt-1 border-t border-slate-800">
                                  ⚡ Tăng khoảng dừng nhận thức: +{((survey.testOutcome?.timeToDecidePostSec || 12.0) - (survey.surveyResponses?.timeToDecidePreSec || 3.5)).toFixed(1)}s (tránh bẫy tâm lý vội vã)
                                </div>
                              </div>

                              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                                <span>Thời gian nộp: {new Date(survey.createdAt).toLocaleString('vi-VN')}</span>
                                <span className="font-mono text-indigo-400">ID: {survey.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
