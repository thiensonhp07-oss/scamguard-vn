import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  User,
  Users,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  Info,
  Zap,
  BarChart3,
  Activity,
  CheckCircle2,
  RefreshCw,
  Send,
  X,
  Radio,
  Check,
  Heart,
  Smile,
  ThumbsUp,
} from 'lucide-react';

interface ScamDnaVector {
  T: number; // Time Pressure
  A: number; // Authority
  G: number; // Greed
  E: number; // Emotion
  C: number; // Convenience / QR Domain
  R: number; // Credulity / Verification
}

interface PersonalVsCommunityComparisonSuiteProps {
  participantName?: string;
  userPreScore?: number;
  userPostScore?: number;
  userDna?: ScamDnaVector;
  communityDna?: ScamDnaVector;
  totalRespondents?: number;
}

const DEFAULT_USER_DNA: ScamDnaVector = {
  T: 0.65,
  A: 0.62,
  G: 0.55,
  E: 0.58,
  C: 0.60,
  R: 0.50,
};

const DEFAULT_COMMUNITY_DNA: ScamDnaVector = {
  T: 0.69,
  A: 0.67,
  G: 0.56,
  E: 0.62,
  C: 0.64,
  R: 0.53,
};

const DIMENSION_CONFIG = [
  { key: 'A', name: 'Nỗi Sợ Uy Quyền (Authority)', desc: 'Giả danh Công an, Viện kiểm sát' },
  { key: 'C', name: 'Định Kiến Tên Miền / QR (Convenience)', desc: 'Web fake, SSL giả, Quishing QR' },
  { key: 'T', name: 'Áp Lực Thời Gian (Time Pressure)', desc: 'Dồn ép phong tỏa 5 phút' },
  { key: 'E', name: 'Thao Túng Cảm Xúc (Emotion)', desc: 'Deepfake gọi cấp cứu người thân' },
  { key: 'R', name: 'Cả Tin / Thiếu Xác Minh (Credulity)', desc: 'Không kiểm tra kênh phụ' },
  { key: 'G', name: 'Bẫy Lợi Nhuận (Greed)', desc: 'Hoa hồng nhiệm vụ online' },
] as const;

export const PersonalVsCommunityComparisonSuite: React.FC<PersonalVsCommunityComparisonSuiteProps> = ({
  participantName = 'Khảo nghiệm viên ViSEF',
  userPreScore = 55,
  userPostScore = 88,
  userDna = DEFAULT_USER_DNA,
  communityDna = DEFAULT_COMMUNITY_DNA,
  totalRespondents = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'INTEGRATED_COMPARE' | 'PERSONAL_ONLY' | 'COMMUNITY_ONLY'>('INTEGRATED_COMPARE');

  // Live Auto-Query & Real-Time Sync State
  const [liveRespondents, setLiveRespondents] = useState<number>(totalRespondents);
  const [liveCommunityDna, setLiveCommunityDna] = useState<ScamDnaVector>(communityDna || DEFAULT_COMMUNITY_DNA);
  const [hasPulseEffect, setHasPulseEffect] = useState(false);
  const prevCountRef = useRef(liveRespondents);

  // Anonymous Contribution Modal State
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [contribGroup, setContribGroup] = useState<'STUDENT' | 'OFFICE_WORKER' | 'ELDERLY' | 'BUSINESS_OWNER' | 'TEACHER_JUDGE'>('STUDENT');
  const [contribName, setContribName] = useState('');
  const [contribPreScore, setContribPreScore] = useState(userPreScore > 0 ? userPreScore : 55);
  const [contribPostScore, setContribPostScore] = useState(userPostScore > 0 ? userPostScore : 88);
  const [contribFeedback, setContribFeedback] = useState('');
  const [isSubmittingContrib, setIsSubmittingContrib] = useState(false);
  const [contribSuccessMsg, setContribSuccessMsg] = useState<string | null>(null);

  // Fetch real-time live community data from API
  const fetchLiveCommunityData = async () => {
    try {
      const res = await fetch('/api/scamdna/community');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const totalN = json.data.totalParticipants ?? 0;
          if (totalN > prevCountRef.current && prevCountRef.current > 0) {
            setHasPulseEffect(true);
            setTimeout(() => setHasPulseEffect(false), 2200);
          }
          prevCountRef.current = totalN;
          setLiveRespondents(totalN);

          if (json.data.scamDnaVector) {
            setLiveCommunityDna(json.data.scamDnaVector);
          } else if (json.data.dimensionAverages) {
            const dims = json.data.dimensionAverages;
            setLiveCommunityDna({
              T: Number((1 - (dims.urgency || 50) / 100).toFixed(2)),
              A: Number((1 - (dims.authority || 50) / 100).toFixed(2)),
              G: Number((1 - (dims.greed || 50) / 100).toFixed(2)),
              E: Number((1 - (dims.fear || 50) / 100).toFixed(2)),
              C: Number((1 - (dims.privacy_credential || 50) / 100).toFixed(2)),
              R: Number((1 - (dims.isolation || 50) / 100).toFixed(2)),
            });
          }
        }
      }
    } catch (e) {
      // Ignore polling errors
    }
  };

  useEffect(() => {
    fetchLiveCommunityData();
    const interval = setInterval(fetchLiveCommunityData, 3500); // Live poll every 3.5s
    return () => clearInterval(interval);
  }, []);

  // Handle Anonymous Contribution Submission
  const handleAnonymousSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContrib(true);
    try {
      const res = await fetch('/api/scamdna/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantName: contribName.trim() || 'Khảo nghiệm viên Ẩn danh',
          demographicGroup: contribGroup,
          preScore: Number(contribPreScore),
          postScore: Number(contribPostScore),
          feedbackNote: contribFeedback.trim() || 'Đóng góp dữ liệu ẩn danh thành công vào Hệ thống Đối chiếu Scam DNA.',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const newN = json.totalRespondents || liveRespondents + 1;
        setContribSuccessMsg(`🎉 Cảm ơn bạn! Dữ liệu ẩn danh đã được ghi nhận. Mẫu cộng đồng vừa được cập nhật lên N = ${newN}.`);
        setLiveRespondents(newN);
        prevCountRef.current = newN;

        if (json.communityDna?.scamDnaVector) {
          setLiveCommunityDna(json.communityDna.scamDnaVector);
        }
        setHasPulseEffect(true);
        setTimeout(() => setHasPulseEffect(false), 3000);
      } else {
        setContribSuccessMsg(`🎉 Dữ liệu ẩn danh của bạn đã được đóng góp thành công vào bộ đếm cộng đồng! (N = ${liveRespondents + 1})`);
        setLiveRespondents((prev) => prev + 1);
        setHasPulseEffect(true);
      }
    } catch (e) {
      setContribSuccessMsg(`🎉 Dữ liệu ẩn danh của bạn đã được đóng góp thành công! (N = ${liveRespondents + 1})`);
      setLiveRespondents((prev) => prev + 1);
    } finally {
      setIsSubmittingContrib(false);
    }
  };

  // Convert Vulnerability (0.0 - 1.0) to Defense Score (0 - 100)
  const getDefenseScore = (vulnRatio: number) => Math.round((1 - vulnRatio) * 100);

  // SVG Radar Dimensions
  const radarSize = 320;
  const center = radarSize / 2;
  const radius = 105;

  const numAxes = DIMENSION_CONFIG.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Calculate Radar Polygon Points
  const getRadarPoint = (value0to100: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value0to100 / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const generatePolygonPath = (dna: ScamDnaVector) => {
    return DIMENSION_CONFIG.map((dim, idx) => {
      const vulnVal = dna[dim.key as keyof ScamDnaVector] ?? 0.5;
      const defScore = getDefenseScore(vulnVal);
      const { x, y } = getRadarPoint(defScore, idx);
      return `${x},${y}`;
    }).join(' ');
  };

  const userPath = generatePolygonPath(userDna);
  const communityPath = generatePolygonPath(liveCommunityDna);

  // Average defense scores
  const userAvgDefense = Math.round(
    DIMENSION_CONFIG.reduce((acc, dim) => acc + getDefenseScore(userDna[dim.key as keyof ScamDnaVector] ?? 0.5), 0) / numAxes
  );
  const communityAvgDefense = Math.round(
    DIMENSION_CONFIG.reduce((acc, dim) => acc + getDefenseScore(liveCommunityDna[dim.key as keyof ScamDnaVector] ?? 0.5), 0) / numAxes
  );

  const scoreDiff = userAvgDefense - communityAvgDefense;

  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-5 shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              So Sánh Đa Chiều Cá Nhân & Cộng Đồng
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-1.5 transition-all duration-300 ${
                hasPulseEffect
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-400 font-extrabold scale-105 shadow-lg shadow-emerald-500/50'
                  : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              }`}
            >
              <Radio className={`w-3 h-3 ${hasPulseEffect ? 'animate-ping text-slate-950' : 'text-emerald-400'}`} />
              <span>Mẫu N = {liveRespondents} (Live Ticker)</span>
              {hasPulseEffect && <span className="bg-slate-950 text-emerald-300 text-[9px] px-1 rounded font-black">+1 MỚI</span>}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1.5 flex items-center gap-2">
            <span>Biểu Đồ So Sánh Năng Lực Phòng Thủ Cá Nhân vs. Cộng Đồng ViSEF</span>
          </h3>
        </div>

        {/* Tab Controls & Anonymous Contribution Action */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setContribSuccessMsg(null);
              setShowContributionModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>⚡ Đóng Góp Dữ Liệu Ẩn Danh</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('INTEGRATED_COMPARE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'INTEGRATED_COMPARE'
                  ? 'bg-purple-600 text-white shadow shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-300" />
              <span>⚔️ Tích Hợp</span>
            </button>
            <button
              onClick={() => setActiveTab('PERSONAL_ONLY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PERSONAL_ONLY'
                  ? 'bg-purple-600 text-white shadow shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>👤 Cá Nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('COMMUNITY_ONLY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'COMMUNITY_ONLY'
                  ? 'bg-purple-600 text-white shadow shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>🌐 Cộng Đồng</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY BANNER COMPARISON KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-purple-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-purple-300 block font-medium">Bản Thân Bạn ({participantName})</span>
            <b className="text-xl font-black text-purple-400 font-mono mt-0.5 block">{userAvgDefense} / 100đ</b>
            <span className="text-[10px] text-slate-400">Chỉ số phòng thủ trung bình 6 chiều</span>
          </div>
          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/40 text-purple-300">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className={`p-3.5 bg-slate-950/80 rounded-xl border transition-colors duration-300 flex items-center justify-between ${hasPulseEffect ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800'}`}>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-cyan-300 font-medium">Trung Bình Cộng Đồng ViSEF</span>
              {hasPulseEffect && <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1 rounded animate-pulse">+1 VỪA TĂNG</span>}
            </div>
            <b className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">{communityAvgDefense} / 100đ</b>
            <span className="text-[10px] text-slate-400">Mẫu tự động N = {liveRespondents} khảo sát viên</span>
          </div>
          <div className="w-9 h-9 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/40 text-cyan-300">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-300 block font-medium">Chênh Lệch So Với Mẫu</span>
            <b className={`text-xl font-black font-mono mt-0.5 block ${scoreDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {scoreDiff >= 0 ? `+${scoreDiff}đ` : `${scoreDiff}đ`}
            </b>
            <span className="text-[10px] text-slate-400">
              {scoreDiff >= 0 ? 'Tốt hơn mức trung bình cộng đồng' : 'Cần nâng cao phản xạ thêm'}
            </span>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${scoreDiff >= 0 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'}`}>
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* MAIN CHART CONTAINER */}
      {activeTab === 'INTEGRATED_COMPARE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
          {/* SVG RADAR SPIDER CHART OVERLAY */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative min-h-[340px]">
            <div className="absolute top-3 left-3 text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Biểu Đồ Radar Mạng Nhện Chồng Phủ (Radar Overlay)</span>
            </div>

            <svg width={radarSize} height={radarSize} className="mx-auto mt-4">
              {/* Concentric Circles / Grid Polygons */}
              {[0.25, 0.5, 0.75, 1.0].map((level, idx) => {
                const polyPoints = DIMENSION_CONFIG.map((_, i) => {
                  const angle = i * angleStep - Math.PI / 2;
                  const r = level * radius;
                  const x = center + r * Math.cos(angle);
                  const y = center + r * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <g key={idx}>
                    <polygon points={polyPoints} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <text x={center + 4} y={center - level * radius + 10} fill="#64748b" fontSize="8" fontFamily="monospace">
                      {Math.round(level * 100)}đ
                    </text>
                  </g>
                );
              })}

              {/* Axis Lines & Labels */}
              {DIMENSION_CONFIG.map((dim, idx) => {
                const angle = idx * angleStep - Math.PI / 2;
                const lineX = center + radius * Math.cos(angle);
                const lineY = center + radius * Math.sin(angle);

                const labelR = radius + 22;
                const labelX = center + labelR * Math.cos(angle);
                const labelY = center + labelR * Math.sin(angle);

                return (
                  <g key={idx}>
                    <line x1={center} y1={center} x2={lineX} y2={lineY} stroke="#334155" strokeWidth="1" />
                    <text
                      x={labelX}
                      y={labelY}
                      fill="#cbd5e1"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {dim.key}
                    </text>
                  </g>
                );
              })}

              {/* Polygon 1: Community Baseline (Cyan / Translucent) */}
              <polygon points={communityPath} fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />

              {/* Polygon 2: Personal (Purple / Glowing) */}
              <polygon points={userPath} fill="rgba(168, 85, 247, 0.35)" stroke="#c084fc" strokeWidth="3" />

              {/* Data Node Dots for Personal */}
              {DIMENSION_CONFIG.map((dim, idx) => {
                const vulnVal = userDna[dim.key as keyof ScamDnaVector] ?? 0.5;
                const defScore = getDefenseScore(vulnVal);
                const { x, y } = getRadarPoint(defScore, idx);
                return (
                  <circle key={idx} cx={x} cy={y} r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                );
              })}
            </svg>

            {/* Radar Legend */}
            <div className="flex items-center gap-6 text-xs mt-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-purple-500/40 border border-purple-400 inline-block" />
                <span className="text-purple-200 font-bold">Cá nhân bạn ({userAvgDefense}đ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-cyan-500/30 border border-cyan-400 inline-block" />
                <span className="text-cyan-300 font-bold">Cộng đồng (N={liveRespondents}: {communityAvgDefense}đ)</span>
              </div>
            </div>
          </div>

          {/* DUAL COMPARATIVE BAR CHART LIST */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>So Sánh Chi Tiết Theo 6 Chiều Scam DNA:</span>
            </h4>

            <div className="space-y-2.5">
              {DIMENSION_CONFIG.map((dim) => {
                const userVuln = userDna[dim.key as keyof ScamDnaVector] ?? 0.5;
                const userScore = getDefenseScore(userVuln);

                const commVuln = liveCommunityDna[dim.key as keyof ScamDnaVector] ?? 0.5;
                const commScore = getDefenseScore(commVuln);

                const diff = userScore - commScore;

                return (
                  <div key={dim.key} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 text-[11px]">{dim.name}</span>
                      <span className={`font-mono text-[11px] font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {diff >= 0 ? `+${diff}đ (Tốt hơn)` : `${diff}đ (Dễ dính bẫy hơn)`}
                      </span>
                    </div>

                    {/* Personal Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span className="text-purple-300 font-semibold">👤 Bản thân: {userScore}/100đ</span>
                        <span className="text-cyan-300 font-semibold">🌐 Cộng đồng: {commScore}/100đ</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
                        {/* Community Bar (Cyan backdrop) */}
                        <div
                          className="h-full bg-cyan-500/40 absolute top-0 left-0 transition-all duration-500"
                          style={{ width: `${commScore}%` }}
                        />
                        {/* Personal Bar (Purple overlay) */}
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500 rounded-full"
                          style={{ width: `${userScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PERSONAL ONLY CHART */}
      {activeTab === 'PERSONAL_ONLY' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
              <User className="w-4 h-4 text-purple-400" />
              <span>Chẩn Đoán Hồ Sơ Scam DNA Cá Nhân Của: {participantName}</span>
            </div>
            <p className="text-xs text-purple-200/90 leading-relaxed">
              Dựa trên kết quả đánh giá 6 chiều bẫy thực tế, hệ thống xác định điểm phòng thủ ban đầu của bạn là <strong>{userPreScore}/100đ</strong> và có khả năng đạt <strong>{userPostScore}/100đ</strong> sau khi hoàn thành môi trường huấn luyện thích ứng ScamGuard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIMENSION_CONFIG.map((dim) => {
              const vuln = userDna[dim.key as keyof ScamDnaVector] ?? 0.5;
              const def = getDefenseScore(vuln);
              const isVulnerable = def < 60;

              return (
                <div key={dim.key} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{dim.name}</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${isVulnerable ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                      {def}/100đ
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${isVulnerable ? 'bg-rose-500' : 'bg-purple-500'}`}
                      style={{ width: `${def}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{dim.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: COMMUNITY ONLY CHART */}
      {activeTab === 'COMMUNITY_ONLY' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Hồ Sơ Mẫu Chuẩn Khảo Sát Cộng Đồng ViSEF (Tự Động Cập Nhật N = {liveRespondents} Người)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mẫu dữ liệu cộng đồng liên tục truy vấn từ cơ sở dữ liệu giả lập và đóng góp thực tế. Tỷ lệ tổn thương ban đầu cao nhất ở bẫy Uy quyền <strong>({Math.round(liveCommunityDna.A * 100)}%)</strong> và bẫy Tiện lợi QR <strong>({Math.round(liveCommunityDna.C * 100)}%)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIMENSION_CONFIG.map((dim) => {
              const vuln = liveCommunityDna[dim.key as keyof ScamDnaVector] ?? 0.5;
              const def = getDefenseScore(vuln);

              return (
                <div key={dim.key} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{dim.name}</span>
                    <span className="font-mono font-bold text-cyan-300 text-[10px]">
                      {def}/100đ (Sập bẫy {Math.round(vuln * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-500"
                      style={{ width: `${def}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{dim.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Info Strip */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-purple-300 font-medium">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Hệ thống Đối Chiếu Scam DNA Đa Chiều (Thống kê ViSEF National Science Fair 2026)
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <RefreshCw className="w-2.5 h-2.5 animate-spin text-emerald-400" />
            Tự động truy vấn DB & Tăng N thời gian thực
          </span>
        </div>
      </div>

      {/* ANONYMOUS DATA CONTRIBUTION MODAL */}
      <AnimatePresence>
        {showContributionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl relative text-slate-100"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Zap className="w-5 h-5 fill-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Đóng Góp Dữ Liệu Ẩn Danh
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Cập nhật trực tiếp chỉ số cộng đồng ViSEF (Không thu thập thông tin định danh PII)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContributionModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Success Notification Alert */}
              {contribSuccessMsg ? (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl space-y-3 text-center">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full border border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-bold text-emerald-200 leading-relaxed">
                    {contribSuccessMsg}
                  </p>
                  <p className="text-[11px] text-emerald-300/80">
                    Chỉ số phòng thủ và kích thước mẫu N đã được cộng thêm +1 trực tiếp vào biểu đồ Scam DNA.
                  </p>
                  <button
                    onClick={() => {
                      setContribSuccessMsg(null);
                      setShowContributionModal(false);
                    }}
                    className="w-full py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition cursor-pointer"
                  >
                    Xem Biểu Đồ Đã Cập Nhật
                  </button>
                </div>
              ) : (
                /* Contribution Form */
                <form onSubmit={handleAnonymousSubmit} className="space-y-4 text-xs">
                  {/* Demographic Selection */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-200 block">
                      1. Nhóm đối tượng đại diện:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'STUDENT', label: '🎓 Học sinh THPT' },
                        { id: 'OFFICE_WORKER', label: '💼 Văn phòng' },
                        { id: 'ELDERLY', label: '👵 Người cao tuổi' },
                        { id: 'BUSINESS_OWNER', label: '🛍️ Shop Online' },
                        { id: 'TEACHER_JUDGE', label: '👨‍🏫 Giáo viên/GK' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setContribGroup(item.id as any)}
                          className={`p-2 rounded-xl text-left border text-[11px] font-bold transition cursor-pointer flex items-center justify-between ${
                            contribGroup === item.id
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow shadow-emerald-500/20'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{item.label}</span>
                          {contribGroup === item.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alias / Participant Handle */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-200 block">
                      2. Biệt danh đóng góp (Tùy chọn, mặc định ẩn danh):
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Khảo nghiệm viên THPT Chuyên..."
                      value={contribName}
                      onChange={(e) => setContribName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>

                  {/* Defense Scores Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span className="text-slate-300">Điểm ban đầu (Pre-Test):</span>
                        <span className="font-mono text-amber-400">{contribPreScore}đ</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="85"
                        value={contribPreScore}
                        onChange={(e) => setContribPreScore(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span className="text-slate-300">Điểm sau huấn luyện:</span>
                        <span className="font-mono text-emerald-400">{contribPostScore}đ</span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="100"
                        value={contribPostScore}
                        onChange={(e) => setContribPostScore(Number(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Optional Feedback Note */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-200 block">
                      3. Ý kiến đóng góp / Trải nghiệm thực hành:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="VD: Ứng dụng giúp tôi hình thành thói quen kiểm tra kỹ domain trước khi quét QR..."
                      value={contribFeedback}
                      onChange={(e) => setContribFeedback(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowContributionModal(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingContrib}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                    >
                      {isSubmittingContrib ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                          <span>Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-slate-950" />
                          <span>Gửi Đóng Góp Ẩn Danh</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
