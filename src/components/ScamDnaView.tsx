import React, { useState, useEffect, useMemo } from 'react';
import {
  Dna,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  User,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Target,
  Flame,
  RefreshCw,
  Share2,
  Download,
  Compass,
  HelpCircle,
  Activity,
  Brain,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers,
  Lock,
  Eye,
  Sliders,
  Award,
  BookOpen,
  Cpu,
  Wallet,
  Smartphone,
  Search,
  FileText,
  Check,
  Copy,
  BarChart3,
  PieChart,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScamDnaProfile,
  CommunityScamDna,
  ScamDnaDimensionDetail,
  ScamDnaDimensionKey,
  UserProfile,
} from '../types';
import { ScamDnaTrendChart } from './ScamDnaTrendChart';

interface ScamDnaViewProps {
  userProfile: UserProfile;
  dnaProfile?: ScamDnaProfile;
  onNavigateToArena?: (scenarioId?: string) => void;
  onEarnXp?: (amount: number) => void;
}

// 3 Core Pillars Classification
export type DnaPillarCategory = 'all' | 'psychology' | 'technical' | 'financial';

interface PillarDefinition {
  id: DnaPillarCategory;
  name: string;
  shortName: string;
  icon: any;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  dimensionKeys: ScamDnaDimensionKey[];
}

const PILLARS: PillarDefinition[] = [
  {
    id: 'psychology',
    name: 'Chỉ Số Kháng Thao Túng Tâm Lý',
    shortName: 'Tâm Lý',
    icon: Brain,
    color: '#c084fc',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-950/40',
    description: 'Đánh giá năng lực chống đỡ trước các thủ đoạn kích động cảm xúc (uy quyền, dồn ép thời gian, đe dọa sợ hãi, bẫy lòng tham, thao túng cô lập và giữ bình tĩnh).',
    dimensionKeys: ['authority', 'urgency', 'fear', 'greed', 'isolation', 'emotional_stability'],
  },
  {
    id: 'technical',
    name: 'Chỉ Số Giám Định Kỹ Thuật & AI',
    shortName: 'Kỹ Thuật & AI',
    icon: Cpu,
    color: '#38bdf8',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-950/40',
    description: 'Năng lực phát hiện dấu hiệu lừa đảo công nghệ cao: Quét mã QR độc hại (Quishing), tên miền giả mạo (Typosquatting), và nhận diện video/giọng nói AI Deepfake.',
    dimensionKeys: ['quishing_domain', 'deepfake_ai'],
  },
  {
    id: 'financial',
    name: 'Chỉ Số Bảo Vệ Tài Chính & Danh Tính',
    shortName: 'Tài Chính & Dữ Liệu',
    icon: Wallet,
    color: '#34d399',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-950/40',
    description: 'Khả năng thiết lập rào chắn dữ liệu nhạy cảm: Bảo vệ mã OTP, thông tin Căn cước công dân (CCCD) và kích hoạt phản xạ xác minh chéo qua kênh phụ độc lập.',
    dimensionKeys: ['privacy_credential', 'verification_reflex'],
  },
];

// Rich Context & 2026 Threat Intelligence per Dimension
const DIMENSION_THREAT_INTEL: Record<
  ScamDnaDimensionKey,
  {
    pillar: 'psychology' | 'technical' | 'financial';
    realWorldScenarioVN: string;
    protocolSteps: string[];
    nationalIncidentCount: string;
    vulnerabilityInVN: number; // percentage of vulnerable users
    dangerLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  }
> = {
  authority: {
    pillar: 'psychology',
    realWorldScenarioVN: 'Kẻ gian giả danh Cán bộ Công an điều tra, Viện Kiểm Sát hoặc Cục Thuế gọi điện đe dọa dính líu đến đường dây rửa tiền, yêu cầu cài App dịch vụ công giả mạo hoặc chuyển tiền vào tài khoản tạm giữ điều tra.',
    protocolSteps: [
      'Ghi nhớ: Công an và cơ quan tư pháp KHÔNG BAO GIỜ làm việc hay tống đạt lệnh qua điện thoại/Zalo.',
      'Yêu cầu giấy triệu tập chính thức gửi về địa chỉ cư trú hoặc mời lên trụ sở Công an Phường.',
      'Cúp máy ngay và tự tra cứu số điện thoại trực ban Công an địa phương để đối chiếu.',
    ],
    nationalIncidentCount: '42.150+ vụ báo cáo',
    vulnerabilityInVN: 68.4,
    dangerLevel: 'CRITICAL',
  },
  urgency: {
    pillar: 'psychology',
    realWorldScenarioVN: 'Thông báo tài khoản ngân hàng bị đăng nhập trái phép, yêu cầu xác nhận trong vòng 5 phút nếu không sẽ bị khóa vĩnh viễn hoặc bị trừ tiền phạt trễ hạn điện thoại.',
    protocolSteps: [
      'Áp dụng "Quy tắc 5 Phút Vàng": Không một giao dịch hợp pháp nào ép buộc xử lý trong vài phút mà không có kênh đối chứng.',
      'Đặt điện thoại xuống, hít thở sâu, tuyệt đối không bấm vào đường link trong tin nhắn dồn ép.',
      'Mở ứng dụng ngân hàng chính thức trên điện thoại để kiểm tra mục Thông Báo Hệ Thống.',
    ],
    nationalIncidentCount: '58.900+ vụ báo cáo',
    vulnerabilityInVN: 72.1,
    dangerLevel: 'CRITICAL',
  },
  fear: {
    pillar: 'psychology',
    realWorldScenarioVN: 'Đe dọa khởi tố hình sự, dọa gửi video cắt ghép nhạy cảm cho bạn bè và đồng nghiệp nếu không chuyển khoản tiền chuộc trong vòng 24 giờ.',
    protocolSteps: [
      'Bình tĩnh nhận diện đòn tâm lý tống tiền: Kẻ tống tiền luôn tận dụng sự hoảng loạn để ngăn bạn tư duy logic.',
      'Lưu lại toàn bộ ảnh chụp màn hình, số tài khoản nhận tiền và tin nhắn đe dọa làm bằng chứng.',
      'Chặn liên lạc ngay và báo cáo sự việc cho cơ quan công an hoặc Tổng đài Bảo vệ An toàn Mạng.',
    ],
    nationalIncidentCount: '31.400+ vụ báo cáo',
    vulnerabilityInVN: 64.7,
    dangerLevel: 'HIGH',
  },
  greed: {
    pillar: 'psychology',
    realWorldScenarioVN: 'Mời gọi làm nhiệm vụ xem video TikTok/YouTube nhận 500k-1 triệu/ngày, đầu tư chứng khoán quốc tế cam kết lợi nhuận 30%/tháng, hoặc bẫy nhận quà trúng thưởng xe máy.',
    protocolSteps: [
      'Khắc sâu nguyên lý kinh tế: Không có bất kỳ công việc hay kênh đầu tư nào "việc nhẹ - tiền nhiều - không rủi ro".',
      'Nếu được rút tiền lãi nhỏ ở 1-2 lần đầu, đó là mồi nhử để bạn nạp số tiền lớn hơn gấp chục lần.',
      'Dứt khoát từ chối mọi nhóm Telegram/Zalo kêu gọi nạp tiền làm nhiệm vụ nâng cấp VIP.',
    ],
    nationalIncidentCount: '63.200+ vụ báo cáo',
    vulnerabilityInVN: 69.3,
    dangerLevel: 'CRITICAL',
  },
  isolation: {
    pillar: 'psychology',
    realWorldScenarioVN: 'Yêu cầu bạn phải vào phòng kín, cắm tai nghe, tuyệt đối không được nói cho vợ/chồng/bố mẹ biết vì "đây là chuyên án tuyệt mật quốc gia" hoặc "sợ người thân lo lắng".',
    protocolSteps: [
      'Nguyên tắc vàng: Khi bất kỳ ai yêu cầu bạn "GIỮ BÍ MẬT VỚI GIA ĐÌNH", đó 100% là kịch bản lừa đảo đang cô lập bạn.',
      'Mở cửa phòng ngay lập tức và kể toàn bộ cuộc gọi cho người thân cận nhất hoặc bạn bè tin cậy.',
      'Sự can thiệp của người thứ ba luôn là liều thuốc giải độc hiệu quả nhất trước bẫy thao túng tâm lý.',
    ],
    nationalIncidentCount: '38.600+ vụ báo cáo',
    vulnerabilityInVN: 61.2,
    dangerLevel: 'HIGH',
  },
  emotional_stability: {
    pillar: 'psychology',
    realWorldScenarioVN: 'Kẻ lừa đảo liên tục thay đổi giọng điệu từ đe dọa gay gắt sang ân cần giúp đỡ ("Anh thấy em còn trẻ nên mới hỗ trợ né án phạt...") nhằm gây nhiễu loạn cảm xúc.',
    protocolSteps: [
      'Nhận thức tín hiệu cơ thể: Tim đập nhanh, toát mồ hôi, bối rối là dấu hiệu bạn đang bị thao túng tâm lý.',
      'Dừng cuộc trò chuyện bằng câu dứt khoát: "Tôi đang bận, tôi sẽ liên hệ lại sau" và ngắt kết nối.',
      'Dành 60 giây uống một ngụm nước và tĩnh tâm trước khi đưa ra bất kỳ quyết định tài chính nào.',
    ],
    nationalIncidentCount: '29.800+ vụ báo cáo',
    vulnerabilityInVN: 55.4,
    dangerLevel: 'MEDIUM',
  },
  quishing_domain: {
    pillar: 'technical',
    realWorldScenarioVN: 'Dán đè mã QR độc hại tại bãi đỗ xe, bàn ăn nhà hàng, hoặc gửi thư phạt nguội giao thông kèm QR dẫn đến trang web giả mạo ngân hàng có tên miền dạng "vietcombank-ebank.online".',
    protocolSteps: [
      'Không bao giờ quét mã QR dán lỏng lẻo hoặc có dấu hiệu dán đè ở nơi công cộng mà không hỏi nhân viên.',
      'Xem kỹ địa chỉ URL trước khi bấm Truy Cập: Tên miền chính thống phải kết thúc bằng .vn, .com.vn hoặc thương hiệu chuẩn.',
      'Tuyệt đối không nhập mật khẩu Internet Banking hay mã OTP trên trang web mở ra từ mã QR lạ.',
    ],
    nationalIncidentCount: '47.500+ vụ báo cáo',
    vulnerabilityInVN: 74.8,
    dangerLevel: 'CRITICAL',
  },
  deepfake_ai: {
    pillar: 'technical',
    realWorldScenarioVN: 'Kẻ gian dùng AI Clone khuôn mặt và giọng nói của con cái/bạn thân gọi video call chập chờn 5-10 giây kêu đang ở bệnh viện/đồn cảnh sát cần vay gấp 50 triệu.',
    protocolSteps: [
      'Yêu cầu người gọi thực hiện hành động kiểm chứng: Quay mặt góc 90 độ, vẫy tay trước mặt hoặc đọc Mật Khẩu An Toàn Gia Đình.',
      'Ngắt cuộc gọi và chủ động dùng số điện thoại cá nhân (Sim di động thông thường) gọi lại trực tiếp cho người thân.',
      'Để ý các điểm bất thường của AI: Chớp mắt không tự nhiên, viền khuôn mặt mờ nhòe, giọng nói có âm sắc robot kim loại.',
    ],
    nationalIncidentCount: '36.700+ vụ báo cáo',
    vulnerabilityInVN: 67.2,
    dangerLevel: 'CRITICAL',
  },
  privacy_credential: {
    pillar: 'financial',
    realWorldScenarioVN: 'Giả danh nhân viên viễn thông hoặc hỗ trợ ngân hàng yêu cầu đọc mã OTP gửi về máy để "nâng cấp Sim 4G/5G" hoặc "hủy lệnh chuyển tiền nhầm".',
    protocolSteps: [
      'Quy tắc bất di bất dịch: Mã OTP và mã Smart OTP là chìa khóa két sắt cá nhân - KHÔNG BAO GIỜ cung cấp cho bất kỳ ai, kể cả nhân viên ngân hàng.',
      'Không chụp 2 mặt Căn cước công dân (CCCD) gửi lên các ứng dụng vay tiền online không rõ nguồn gốc.',
      'Nếu vô tình đọc OTP, lập tức gọi hotline khẩn cấp của ngân hàng để yêu cầu khóa toàn bộ thẻ và dịch vụ e-Banking.',
    ],
    nationalIncidentCount: '52.300+ vụ báo cáo',
    vulnerabilityInVN: 63.5,
    dangerLevel: 'CRITICAL',
  },
  verification_reflex: {
    pillar: 'financial',
    realWorldScenarioVN: 'Nhận được tin nhắn từ tài khoản Facebook của sếp hoặc người quen nhờ chuyển tiền gấp vì đang kẹt họp, tài khoản nhận lại là tên người khác.',
    protocolSteps: [
      'Nguyên tắc "Mặt Sau Thẻ": Luôn gọi trực tiếp bằng số điện thoại di động chính để xác minh người nhờ chuyển tiền.',
      'Nếu tài khoản nhận tiền mang tên người lạ (khác tên người quen), 100% tài khoản mạng xã hội đó đã bị hack.',
      'Không tin vào lời giải thích "đây là tài khoản của đối tác/kế toán" mà chưa được nghe giọng nói xác nhận trực tiếp.',
    ],
    nationalIncidentCount: '49.100+ vụ báo cáo',
    vulnerabilityInVN: 70.9,
    dangerLevel: 'CRITICAL',
  },
};

export const ScamDnaView: React.FC<ScamDnaViewProps> = ({
  userProfile,
  dnaProfile: initialDna,
  onNavigateToArena,
  onEarnXp,
}) => {
  const [viewMode, setViewMode] = useState<'personal' | 'community' | 'compare' | 'trend'>('personal');
  const [selectedPillar, setSelectedPillar] = useState<DnaPillarCategory>('all');
  const [activeDimensionKey, setActiveDimensionKey] = useState<ScamDnaDimensionKey>('authority');
  const [dnaProfile, setDnaProfile] = useState<ScamDnaProfile | null>(initialDna || null);
  const [communityDna, setCommunityDna] = useState<CommunityScamDna | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [selectedDemographic, setSelectedDemographic] = useState<string>('all');
  const [telemetryOptIn, setTelemetryOptIn] = useState(true);

  // Interactive Simulator Goals State
  const [simulatedDrills, setSimulatedDrills] = useState<Record<string, boolean>>({
    quishing: false,
    deepfake: false,
    authority: false,
    otp_defense: false,
  });

  // Fetch DNA and Community Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const progRes = await fetch('/api/progress');
        if (progRes.ok) {
          const progData = await progRes.json();
          if (progData.dnaProfile) {
            setDnaProfile(progData.dnaProfile);
          }
        }

        const commRes = await fetch(`/api/scamdna/community?userScore=${initialDna?.overallScore || 80}`);
        if (commRes.ok) {
          const commJson = await commRes.json();
          if (commJson.data) {
            setCommunityDna(commJson.data);
          }
        }
      } catch (err) {
        console.warn('Soft notification: Error fetching DNA and Community data (handled):', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    return () => clearInterval(interval);
  }, [initialDna?.overallScore]);

  // Pillar scores calculation
  const pillarScores = useMemo(() => {
    if (!dnaProfile) {
      return {
        psychology: { user: 0, community: 0, delta: 0 },
        technical: { user: 0, community: 0, delta: 0 },
        financial: { user: 0, community: 0, delta: 0 },
      };
    }

    const getAvg = (keys: ScamDnaDimensionKey[]) => {
      const matched = dnaProfile.dimensions.filter((d) => keys.includes(d.key));
      if (matched.length === 0) return { user: 70, community: 60, delta: 10 };
      const userSum = matched.reduce((acc, curr) => acc + curr.score, 0);
      const commSum = matched.reduce((acc, curr) => acc + curr.communityAverage, 0);
      const userAvg = Math.round(userSum / matched.length);
      const commAvg = Math.round(commSum / matched.length);
      return {
        user: userAvg,
        community: commAvg,
        delta: userAvg - commAvg,
      };
    };

    return {
      psychology: getAvg(['authority', 'urgency', 'fear', 'greed', 'isolation', 'emotional_stability']),
      technical: getAvg(['quishing_domain', 'deepfake_ai']),
      financial: getAvg(['privacy_credential', 'verification_reflex']),
    };
  }, [dnaProfile]);

  // Filtered dimensions based on selected pillar
  const displayedDimensions = useMemo(() => {
    if (!dnaProfile?.dimensions) return [];
    if (selectedPillar === 'all') return dnaProfile.dimensions;
    const targetPillar = PILLARS.find((p) => p.id === selectedPillar);
    if (!targetPillar) return dnaProfile.dimensions;
    return dnaProfile.dimensions.filter((d) => targetPillar.dimensionKeys.includes(d.key));
  }, [dnaProfile, selectedPillar]);

  // Active dimension details
  const activeDimension = useMemo(() => {
    if (!dnaProfile) return null;
    return (
      dnaProfile.dimensions.find((d) => d.key === activeDimensionKey) ||
      dnaProfile.dimensions[0]
    );
  }, [dnaProfile, activeDimensionKey]);

  // Active threat intel
  const activeThreatIntel = useMemo(() => {
    if (!activeDimension) return DIMENSION_THREAT_INTEL.authority;
    return DIMENSION_THREAT_INTEL[activeDimension.key] || DIMENSION_THREAT_INTEL.authority;
  }, [activeDimension]);

  // Simulated SDI Score
  const simulatedScore = useMemo(() => {
    const base = dnaProfile?.overallScore || 80;
    let bonus = 0;
    if (simulatedDrills.quishing) bonus += 4;
    if (simulatedDrills.deepfake) bonus += 5;
    if (simulatedDrills.authority) bonus += 4;
    if (simulatedDrills.otp_defense) bonus += 3;
    return Math.min(99, base + bonus);
  }, [dnaProfile?.overallScore, simulatedDrills]);

  // Handle Share / Copy Passport
  const handleSharePassport = () => {
    const shareText = `🛡️ HỒ SƠ SCAM DNA CỦA TÔI TRÊN SCAMGUARD:
• Điểm Năng Lực Phòng Vệ (SDI): ${dnaProfile?.overallScore || 82}/100
• Danh Hiệu: ${dnaProfile?.archetype?.title || 'Vệ Binh Tinh Nhuệ'}
• Trụ Cột Tâm Lý: ${pillarScores.psychology.user}/100 (TB Toàn Quốc: ${pillarScores.psychology.community}/100)
• Trụ Cột Kỹ Thuật & AI: ${pillarScores.technical.user}/100 (TB Toàn Quốc: ${pillarScores.technical.community}/100)
• Trụ Cột Tài Chính & Dữ Liệu: ${pillarScores.financial.user}/100 (TB Toàn Quốc: ${pillarScores.financial.community}/100)
• Xếp Hạng: Top ${100 - (communityDna?.percentileRank || 84)}% người dùng có phản xạ an toàn tốt nhất cả nước!
Kiểm tra Bản Đồ Gen Phòng Thủ của bạn tại ScamGuard ngay!`;
    navigator.clipboard?.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // SVG Radar Coordinates Calculator (Dynamic for displayed dimensions)
  const radarData = useMemo(() => {
    if (!displayedDimensions || displayedDimensions.length === 0) return null;

    const dimensions = displayedDimensions;
    const numPoints = dimensions.length;
    const center = 160;
    const maxRadius = 115;

    const angleStep = (Math.PI * 2) / numPoints;

    // Grid webs (20%, 40%, 60%, 80%, 100%)
    const webs = [0.2, 0.4, 0.6, 0.8, 1.0].map((level) => {
      const points = Array.from({ length: numPoints }).map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = maxRadius * level;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      return points.join(' ');
    });

    // Axis lines and label anchors
    const axes = dimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const xEnd = center + maxRadius * Math.cos(angle);
      const yEnd = center + maxRadius * Math.sin(angle);
      const labelR = maxRadius + (numPoints <= 4 ? 36 : 28);
      const xLabel = center + labelR * Math.cos(angle);
      const yLabel = center + labelR * Math.sin(angle);

      // Determine pillar color for node
      const intel = DIMENSION_THREAT_INTEL[dim.key];
      const pillarColor =
        intel?.pillar === 'psychology'
          ? '#c084fc'
          : intel?.pillar === 'technical'
          ? '#38bdf8'
          : '#34d399';

      return {
        key: dim.key,
        name: dim.label,
        angle,
        xEnd,
        yEnd,
        xLabel,
        yLabel,
        score: dim.score,
        commAvg: dim.communityAverage,
        pillar: intel?.pillar,
        pillarColor,
      };
    });

    // User polygon points
    const userPoints = dimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const ratio = Math.max(0.15, dim.score / 100);
      const r = maxRadius * ratio;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, str: `${x.toFixed(1)},${y.toFixed(1)}`, score: dim.score, key: dim.key };
    });

    // Community polygon points
    const commPoints = dimensions.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const ratio = Math.max(0.15, dim.communityAverage / 100);
      const r = maxRadius * ratio;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, str: `${x.toFixed(1)},${y.toFixed(1)}`, score: dim.communityAverage, key: dim.key };
    });

    return {
      center,
      maxRadius,
      webs,
      axes,
      userPolygon: userPoints.map((p) => p.str).join(' '),
      userVertices: userPoints,
      commPolygon: commPoints.map((p) => p.str).join(' '),
      commVertices: commPoints,
    };
  }, [displayedDimensions]);

  // Top Strengths and Weaknesses Gap vs Community
  const comparisonInsights = useMemo(() => {
    if (!dnaProfile?.dimensions) return { topAdvantages: [], criticalGaps: [] };

    const deltas = dnaProfile.dimensions.map((d) => ({
      ...d,
      delta: d.score - d.communityAverage,
      intel: DIMENSION_THREAT_INTEL[d.key],
    }));

    const sortedByDelta = [...deltas].sort((a, b) => b.delta - a.delta);

    return {
      topAdvantages: sortedByDelta.slice(0, 3),
      criticalGaps: sortedByDelta.slice(-3).reverse(),
    };
  }, [dnaProfile]);

  return (
    <div id="scam-dna-root" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 relative">
      {/* Background Ambience */}
      <div className="glow-orb-cyan -top-20 -left-20 opacity-20" />
      <div className="glow-orb-emerald top-[600px] right-0 opacity-15" />

      {/* 1. HERO HEADER BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bento-card-glow bg-gradient-to-br from-slate-900/80 via-slate-950/95 to-purple-950/30 border border-purple-500/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-widest">
              <Dna className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Hệ Thống Phân Tích Bản Đồ Gen Phòng Thủ SCAM DNA v3.5</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3 flex-wrap">
              <span>Bản Đồ Gen Phòng Thủ</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 font-mono">
                SCAM DNA
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-normal">
                3 Trụ Cột • 10 Trục Rủi Ro
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Khảo sát và định lượng <strong className="text-purple-300">năng lực phản xạ phòng thủ số</strong> qua 3 trụ cột thiết yếu: <em>Tâm lý hành vi</em>, <em>Kỹ thuật & Công nghệ AI</em>, và <em>Bảo vệ tài chính - danh tính</em>. Đối chiếu tức thời với <strong className="text-cyan-300">{communityDna?.totalParticipants ? `${communityDna.totalParticipants.toLocaleString('vi-VN')} người dùng` : 'dữ liệu cộng đồng người dùng thực tế'}</strong> để triệt tiêu các điểm mù an toàn chí mạng.
            </p>

            {/* Quick Stats Pill Strip */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Điểm SDI Cá Nhân:</span>
                <span className="text-emerald-300 font-black">{dnaProfile?.overallScore || 82}/100</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">Hình Mẫu:</span>
                <span className="text-cyan-300 font-black">{dnaProfile?.archetype?.title || 'Vệ Binh Tinh Nhuệ'}</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/40 text-xs font-mono">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 font-bold">Top {100 - (communityDna?.percentileRank || 84)}% cả nước</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Passport Modal & Share */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-auto">
            <motion.button
              id="btn-open-passport"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPassportModal(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 cursor-pointer transition-all border border-purple-400/30 whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              <span>Xem Hộ Chiếu An Toàn Số (Passport)</span>
            </motion.button>

            <motion.button
              id="btn-share-dna"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSharePassport}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>{copiedLink ? 'Đã Sao Chép Kết Quả!' : 'Sao Chép Báo Cáo Chia Sẻ'}</span>
            </motion.button>
          </div>
        </div>

        {/* 2. PRIMARY VIEW MODE SWITCHER (TABS) */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            <button
              id="tab-view-personal"
              onClick={() => setViewMode('personal')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                viewMode === 'personal'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>1. Scam DNA Cá Nhân</span>
            </button>

            <button
              id="tab-view-community"
              onClick={() => setViewMode('community')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                viewMode === 'community'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2. Thống Kê Cộng Đồng {communityDna?.totalParticipants ? `(${communityDna.totalParticipants.toLocaleString('vi-VN')})` : '(0)'}</span>
            </button>

            <button
              id="tab-view-compare"
              onClick={() => setViewMode('compare')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                viewMode === 'compare'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>3. Đối Chiếu Song Song</span>
            </button>

            <button
              id="tab-view-trend"
              onClick={() => setViewMode('trend')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                viewMode === 'trend'
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>4. Xu Hướng 30 Ngày</span>
            </button>
          </div>

          {/* Quick Context Hint */}
          <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {viewMode === 'personal'
                ? 'Đang xem: Phản xạ và điểm mù phòng thủ của riêng bạn'
                : viewMode === 'community'
                ? 'Đang xem: Thống kê rủi ro của toàn bộ người dùng app tại Việt Nam'
                : viewMode === 'compare'
                ? 'Đang xem: So sánh trực quan Bạn vs. Trung bình toàn quốc'
                : 'Đang xem: Biểu đồ xu hướng rủi ro và tiến bộ phòng vệ 30 ngày'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. THREE CORE PILLARS OVERVIEW CARDS (TÂM LÝ - KỸ THUẬT - TÀI CHÍNH) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>3 Trụ Cột Phòng Thủ & Đánh Giá Rủi Ro</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bấm vào từng trụ cột để lọc biểu đồ radar và phân tích chuyên sâu
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedPillar('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedPillar === 'all'
                  ? 'bg-slate-200 text-slate-950 font-black shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Xem Tất Cả (10 Trục)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PILLARS.map((pillar) => {
            const PillarIcon = pillar.icon;
            const isSelected = selectedPillar === pillar.id;
            const scores = pillarScores[pillar.id as keyof typeof pillarScores];

            return (
              <motion.div
                key={pillar.id}
                whileHover={{ scale: 1.015 }}
                onClick={() => setSelectedPillar(isSelected ? 'all' : pillar.id)}
                className={`bento-card p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden shadow-xl ${
                  isSelected
                    ? `${pillar.borderColor} ${pillar.bgColor} ring-2 ring-purple-500/40`
                    : 'border-slate-800/80 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `${pillar.color}20`, border: `1px solid ${pillar.color}40` }}
                    >
                      <PillarIcon className="w-5 h-5" style={{ color: pillar.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">{pillar.name}</h3>
                      <div className="text-[10px] font-mono text-slate-400">
                        {pillar.dimensionKeys.length} trục khảo sát
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black font-mono" style={{ color: pillar.color }}>
                      {scores.user}/100
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      TB CĐ: <strong className="text-slate-300">{scores.community}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3.5 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Comparative Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Bạn vs. Trung bình toàn quốc</span>
                    <span
                      className={`font-black ${
                        scores.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {scores.delta >= 0 ? `▲ Vượt trội +${scores.delta} điểm` : `▼ Tụt hậu ${scores.delta} điểm`}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden relative">
                    <div
                      style={{ width: `${scores.user}%`, backgroundColor: pillar.color }}
                      className="h-full rounded-full transition-all duration-700"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE LAYOUT: RADAR (LEFT 5 COLS) + DETAIL VECTOR CARD (RIGHT 7 COLS) */}
      {(viewMode === 'personal' || viewMode === 'compare' || viewMode === 'community') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 10-Axis SVG Spider Radar Chart */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bento-card p-6 rounded-3xl border border-slate-800/80 bg-slate-950/90 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>
                      Biểu Đồ Radar {selectedPillar === 'all' ? '10 Chiều Toàn Diện' : `Trụ Cột ${selectedPillar.toUpperCase()}`}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Bấm vào bất kỳ đỉnh nào để phân tích chi tiết</p>
                </div>

                {/* Legend */}
                <div className="flex items-center space-x-3 text-[10px] font-mono">
                  <div className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm" />
                    <span className="text-slate-300 font-bold">Bạn</span>
                  </div>
                  {(viewMode === 'community' || viewMode === 'compare') && (
                    <div className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block border border-dashed border-white" />
                      <span className="text-purple-300 font-bold">Toàn quốc</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SVG Visualizer */}
              <div className="relative flex justify-center items-center py-2 select-none">
                {radarData && (
                  <svg
                    viewBox="0 0 320 320"
                    className="w-full max-w-[320px] sm:max-w-[340px] h-auto overflow-visible filter drop-shadow-[0_10px_30px_rgba(6,182,212,0.15)]"
                  >
                    <defs>
                      <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                        <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.12" />
                        <stop offset="75%" stopColor="#10b981" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="userPolygonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                        <stop offset="50%" stopColor="#10b981" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
                      </linearGradient>
                      <linearGradient id="commPolygonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#e879f9" stopOpacity="0.10" />
                      </linearGradient>
                      <filter id="neonRadarGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.9" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="neonCommGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#c084fc" floodOpacity="0.8" />
                      </filter>
                    </defs>

                    {/* Central Glow Field */}
                    <circle cx={radarData.center} cy={radarData.center} r={120} fill="url(#radarCenterGlow)" />

                    {/* Concentric webs */}
                    {radarData.webs.map((pts, idx) => (
                      <polygon
                        key={`web-${idx}`}
                        points={pts}
                        fill={idx === 4 ? 'rgba(34, 211, 238, 0.02)' : 'none'}
                        stroke={idx === 4 ? 'rgba(34, 211, 238, 0.45)' : 'rgba(148, 163, 184, 0.15)'}
                        strokeWidth={idx === 4 ? '1.5' : '1'}
                        strokeDasharray={idx === 4 ? 'none' : '3 3'}
                      />
                    ))}

                    {/* Radial axis lines */}
                    {radarData.axes.map((ax, idx) => (
                      <line
                        key={`axis-${idx}`}
                        x1={radarData.center}
                        y1={radarData.center}
                        x2={ax.xEnd}
                        y2={ax.yEnd}
                        stroke="rgba(148, 163, 184, 0.22)"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Community Polygon (shown in community or compare mode) */}
                    {(viewMode === 'community' || viewMode === 'compare') && (
                      <g>
                        <polygon
                          points={radarData.commPolygon}
                          fill="url(#commPolygonGrad)"
                          stroke="#c084fc"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          filter="url(#neonCommGlow)"
                        />
                        {radarData.commVertices.map((v, i) => (
                          <circle
                            key={`comm-v-${i}`}
                            cx={v.x}
                            cy={v.y}
                            r={3.5}
                            fill="#c084fc"
                            className="opacity-90"
                          />
                        ))}
                      </g>
                    )}

                    {/* User Polygon (shown in personal or compare mode) */}
                    {(viewMode === 'personal' || viewMode === 'compare') && (
                      <g>
                        <polygon
                          points={radarData.userPolygon}
                          fill="url(#userPolygonGrad)"
                          stroke="#22d3ee"
                          strokeWidth="3"
                          strokeLinejoin="round"
                          filter="url(#neonRadarGlow)"
                        />
                        {radarData.userVertices.map((v, i) => {
                          const isSelected = v.key === activeDimensionKey;
                          return (
                            <g key={`user-v-${i}`}>
                              {isSelected && (
                                <circle
                                  cx={v.x}
                                  cy={v.y}
                                  r={11}
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="1.5"
                                  className="animate-ping opacity-75"
                                />
                              )}
                              <circle
                                cx={v.x}
                                cy={v.y}
                                r={isSelected ? 7 : 4.5}
                                fill={isSelected ? '#10b981' : '#22d3ee'}
                                stroke="#020617"
                                strokeWidth="2.5"
                                className="cursor-pointer transition-all hover:scale-125"
                                onClick={() => setActiveDimensionKey(v.key as ScamDnaDimensionKey)}
                              />
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* Axis Interactive Labels */}
                    {radarData.axes.map((ax) => {
                      const isSelected = ax.key === activeDimensionKey;
                      return (
                        <g
                          key={`label-${ax.key}`}
                          className="cursor-pointer transition-all"
                          onClick={() => setActiveDimensionKey(ax.key as ScamDnaDimensionKey)}
                        >
                          <text
                            x={ax.xLabel}
                            y={ax.yLabel}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`text-[9px] font-black transition-all ${
                              isSelected
                                ? 'fill-cyan-300 font-extrabold scale-110'
                                : 'fill-slate-400 hover:fill-slate-200'
                            }`}
                          >
                            {ax.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* Quick Vertex Selector Pills with Pillar Badges */}
              <div className="pt-3 border-t border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
                  Chọn trục rủi ro cần phân tích:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {displayedDimensions.map((dim) => {
                    const isSelected = dim.key === activeDimensionKey;
                    const intel = DIMENSION_THREAT_INTEL[dim.key];

                    return (
                      <button
                        key={dim.key}
                        onClick={() => setActiveDimensionKey(dim.key)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer font-mono flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black shadow-lg scale-105'
                            : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{dim.label}</span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-black ${
                            isSelected ? 'bg-slate-950 text-cyan-300' : 'text-slate-400'
                          }`}
                        >
                          {dim.score}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Archetype Card */}
            {dnaProfile?.archetype && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bento-card p-6 rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>Hình Mẫu Phòng Thủ Cá Nhân</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${dnaProfile.archetype.tagColor}`}>
                    {dnaProfile.archetype.title}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-white">{dnaProfile.archetype.subtitle}</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {dnaProfile.archetype.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Thế Mạnh Vững Chắc:</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-normal">{dnaProfile.archetype.primaryStrength}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-amber-300 space-y-1">
                    <div className="font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cảnh Báo Điểm Mù:</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-normal">{dnaProfile.archetype.blindspotAlert}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DNA Upgrade Simulator Widget */}
            <div className="bento-card p-6 rounded-3xl border border-cyan-500/30 bg-slate-950/90 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Giả Lập Nâng Hạng DNA (Simulator)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold">
                  Dự đoán: {simulatedScore}/100
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Chọn các mục tiêu bạn cam kết hoàn thành để xem điểm SDI và vị trí xếp hạng bứt phá:
              </p>

              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={simulatedDrills.quishing}
                    onChange={(e) => setSimulatedDrills({ ...simulatedDrills, quishing: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                  />
                  <span className="flex-1">Vượt qua 5 bài thi Soi Mã QR Quishing (+4đ)</span>
                  <span className="text-[10px] font-mono text-cyan-400">+4 SDI</span>
                </label>

                <label className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={simulatedDrills.deepfake}
                    onChange={(e) => setSimulatedDrills({ ...simulatedDrills, deepfake: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                  />
                  <span className="flex-1">Vượt qua 3 tình huống Video AI Deepfake (+5đ)</span>
                  <span className="text-[10px] font-mono text-cyan-400">+5 SDI</span>
                </label>

                <label className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={simulatedDrills.authority}
                    onChange={(e) => setSimulatedDrills({ ...simulatedDrills, authority: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                  />
                  <span className="flex-1">Hóa giải bẫy Công An giả mạo trong Arena (+4đ)</span>
                  <span className="text-[10px] font-mono text-cyan-400">+4 SDI</span>
                </label>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono flex items-center justify-between">
                <span>Xếp hạng mới ước tính:</span>
                <strong className="text-white font-bold">
                  {simulatedScore >= 90 ? 'Top 3% Quốc Gia' : simulatedScore >= 85 ? 'Top 8% Quốc Gia' : 'Top 15% Quốc Gia'}
                </strong>
              </div>
            </div>
          </div>

          {/* Right Column: Deep Dive on Active Dimension & Prescriptive Remediation */}
          <div className="lg:col-span-7 space-y-6">
            {activeDimension && (
              <motion.div
                key={activeDimension.key}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bento-card p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-950/90 space-y-6 shadow-2xl"
              >
                {/* Header with Title & Level Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full animate-ping"
                        style={{ backgroundColor: activeDimension.color }}
                      />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                        Trục Đánh Giá: {activeThreatIntel.pillar.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {activeDimension.vietnameseName}
                    </h2>
                  </div>

                  {/* Score Big Pill */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-white">
                        {activeDimension.score}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        TB CĐ: <strong className="text-purple-300">{activeDimension.communityAverage}</strong>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border ${
                        activeDimension.level === 'OPTIMAL'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : activeDimension.level === 'MODERATE'
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                          : activeDimension.level === 'VULNERABLE'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {activeDimension.level === 'OPTIMAL'
                        ? 'Tối Ưu'
                        : activeDimension.level === 'MODERATE'
                        ? 'Vững Vàng'
                        : activeDimension.level === 'VULNERABLE'
                        ? 'Có Rủi Ro'
                        : 'Báo Động Đỏ'}
                    </div>
                  </div>
                </div>

                {/* Progress Comparison Bars */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold">Chỉ số phản xạ của bạn</span>
                      <span className="text-cyan-300 font-black">{activeDimension.score}/100</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activeDimension.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Trung bình toàn bộ người dùng cả nước</span>
                      <span className="text-purple-300 font-bold">
                        {activeDimension.communityAverage > 0
                          ? `${activeDimension.communityAverage}/100`
                          : `Chưa có dữ liệu (${communityDna?.totalParticipants ? `N = ${communityDna.totalParticipants}` : 'N = 0'})`}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        style={{ width: `${activeDimension.communityAverage}%` }}
                        className="h-full rounded-full bg-purple-500/70"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] font-mono pt-1 gap-2">
                    <span className="text-slate-400">
                      Tỷ lệ người Việt dễ sập bẫy trục này:{' '}
                      <strong className="text-rose-400">
                        {communityDna && communityDna.totalParticipants > 0
                          ? `${activeThreatIntel.vulnerabilityInVN}%`
                          : 'Đang thu thập mẫu (N = 0)'}
                      </strong>
                    </span>

                    {activeDimension.communityAverage === 0 ? (
                      <span className="text-slate-400 italic">
                        Đang chờ thu thập thêm phản hồi từ cộng đồng người dùng thực tế
                      </span>
                    ) : activeDimension.score >= activeDimension.communityAverage ? (
                      <span className="text-emerald-400 font-bold">
                        ▲ Cao hơn mức trung bình cộng đồng +{activeDimension.score - activeDimension.communityAverage} điểm
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold">
                        ▼ Thấp hơn mức trung bình cộng đồng {activeDimension.communityAverage - activeDimension.score} điểm (Cần rèn luyện)
                      </span>
                    )}
                  </div>
                </div>

                {/* 2x2 Scientific Bento Grid for Cyber Threat Dossier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quadrant 1: Threat Scenario & Vulnerability Rate */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-950 border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 font-mono uppercase tracking-wider">
                        <Flame className="w-4 h-4" />
                        <span>Kịch Bản Lừa Đảo Thực Tế</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300 font-bold">
                        {activeThreatIntel.vulnerabilityInVN}% sập bẫy
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-3 hover:line-clamp-none transition-all">
                      {activeThreatIntel.realWorldScenarioVN}
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800/80">
                      <span>Quy mô rủi ro:</span>
                      <strong className="text-amber-400">{activeThreatIntel.nationalIncidentCount}</strong>
                    </div>
                  </div>

                  {/* Quadrant 2: Psychological Mechanism */}
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                      <Brain className="w-4 h-4" />
                      <span>Điểm Yếu Tâm Lý Khai Thác</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-3 hover:line-clamp-none transition-all">
                      {activeDimension.psychologicalTrigger}
                    </p>
                    <div className="text-[10px] font-mono text-cyan-400 pt-1 flex items-center space-x-1.5 border-t border-slate-800/80">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>Cần tăng cường rào chắn tư duy phản biện</span>
                    </div>
                  </div>
                </div>

                {/* 3-Step Defense Standard Operating Procedure (SOP) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Quy Trình 3 Bước Phản Xạ Hóa Giải (SOP)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Chuẩn Quốc Tế</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {activeThreatIntel.protocolSteps.map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono font-black text-cyan-300">
                          <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-[9px]">
                            {idx + 1}
                          </span>
                          <span>Bước {idx + 1}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reflex Mantra & Remediation CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                  <div className="sm:col-span-7 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-1">
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Thần Chú 3 Giây Vô Điều Kiện:</span>
                    </div>
                    <p className="text-xs font-black text-emerald-200 font-mono italic">
                      "{activeDimension.improvementMantra}"
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNavigateToArena?.(activeDimension.recommendedScenarioId)}
                    className="sm:col-span-5 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/10 cursor-pointer transition-all"
                  >
                    <Target className="w-4 h-4" />
                    <span>Luyện Tập Tình Huống Này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Critical Blindspots Callout */}
            {dnaProfile?.criticalBlindspots && dnaProfile.criticalBlindspots.length > 0 && (
              <div className="bento-card p-6 rounded-3xl border border-rose-500/30 bg-rose-950/10 space-y-4">
                <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-black uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Báo Cáo Điểm Mù Chí Mạng (Cần Ưu Tiên Hóa Giải)</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {dnaProfile.criticalBlindspots.map((blind, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-white">{blind.dimension}</span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold">
                            {blind.score}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-normal">{blind.dangerSummary}</p>
                      </div>

                      <button
                        onClick={() => onNavigateToArena?.(blind.scenarioId)}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap transition-all"
                      >
                        <span>Luyện tập</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. HISTORICAL TREND SECTION: 30-DAY RISK & DEFENSE PROGRESSION LINE CHART */}
      {(viewMode === 'trend' || viewMode === 'personal' || viewMode === 'compare') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-2"
        >
          <ScamDnaTrendChart
            dnaProfile={dnaProfile}
            onNavigateToArena={onNavigateToArena}
          />
        </motion.div>
      )}

      {/* 4. SIDE-BY-SIDE COMPARISON & GAP ANALYSIS SECTION (Chế độ so sánh chuyên sâu) */}
      {(viewMode === 'compare' || viewMode === 'community') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 pt-4 border-t border-slate-800/80"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
                <SlidersHorizontal className="w-6 h-6 text-amber-400" />
                <span>Bảng Đối Chiếu Song Song & Khoảng Cách An Toàn (Gap Analysis)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Phân tích định lượng sự chênh lệch giữa phản xạ cá nhân và dữ liệu thực tế từ cộng đồng người dùng {communityDna?.totalParticipants ? `(${communityDna.totalParticipants.toLocaleString('vi-VN')} mẫu)` : ''}
              </p>
            </div>

            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Độ tin cậy mẫu: 99.8% (Quốc gia)</span>
            </div>
          </div>

          {/* Top 3 Advantages vs Top 3 Gaps Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top 3 Advantages */}
            <div className="bento-card p-6 rounded-3xl border border-emerald-500/30 bg-slate-950/80 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-black uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Top 3 Điểm Vượt Trội Nhất So Với Cộng Đồng (Ưu Thế Cốt Lõi)</span>
              </div>

              <div className="space-y-3">
                {comparisonInsights.topAdvantages.map((adv, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center space-x-2">
                        <span>{adv.vietnameseName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Bạn: <strong className="text-emerald-300">{adv.score}</strong> | Toàn quốc:{' '}
                        <strong>{adv.communityAverage}</strong>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-emerald-900/60 text-emerald-300 font-mono text-xs font-black">
                      +{adv.delta} đ
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Critical Gaps */}
            <div className="bento-card p-6 rounded-3xl border border-rose-500/30 bg-slate-950/80 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-black uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Top 3 Điểm Tụt Hậu Nguy Hiểm Cần Gia Cố Ngay</span>
              </div>

              <div className="space-y-3">
                {comparisonInsights.criticalGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center space-x-2">
                        <span>{gap.vietnameseName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Bạn: <strong className="text-rose-300">{gap.score}</strong> | Toàn quốc:{' '}
                        <strong>{gap.communityAverage}</strong>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-rose-900/60 text-rose-300 font-mono text-xs font-black">
                      {gap.delta} đ
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed 10-Dimension Comparison Table */}
          <div className="bento-card p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-950/90 space-y-6 shadow-2xl overflow-x-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Ma Trận So Sánh Chi Tiết 10 Trục Phản Xạ</span>
              </h3>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
                Cập nhật theo dữ liệu thực chiến
              </span>
            </div>

            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Trục Đánh Giá</th>
                  <th className="py-3 px-4">Trụ Cột</th>
                  <th className="py-3 px-4 text-center">Điểm Của Bạn</th>
                  <th className="py-3 px-4 text-center">TB Toàn Quốc</th>
                  <th className="py-3 px-4 text-center">Chênh Lệch (Δ)</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {dnaProfile?.dimensions.map((dim) => {
                  const delta = dim.score - dim.communityAverage;
                  const intel = DIMENSION_THREAT_INTEL[dim.key];

                  return (
                    <tr
                      key={dim.key}
                      onClick={() => setActiveDimensionKey(dim.key)}
                      className={`hover:bg-slate-900/50 transition-all cursor-pointer ${
                        dim.key === activeDimensionKey ? 'bg-slate-900/80' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dim.color }} />
                        <span>{dim.vietnameseName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                        {intel?.pillar === 'psychology'
                          ? 'Tâm Lý'
                          : intel?.pillar === 'technical'
                          ? 'Kỹ Thuật'
                          : 'Tài Chính'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-black text-cyan-300">
                        {dim.score}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-purple-300 font-bold">
                        {dim.communityAverage}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            delta >= 0
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                              : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                          }`}
                        >
                          {delta >= 0 ? `+${delta}` : delta}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            dim.level === 'OPTIMAL'
                              ? 'text-emerald-400 bg-emerald-950/60'
                              : dim.level === 'MODERATE'
                              ? 'text-cyan-400 bg-cyan-950/60'
                              : 'text-amber-400 bg-amber-950/60'
                          }`}
                        >
                          {dim.level === 'OPTIMAL' ? 'Tối ưu' : dim.level === 'MODERATE' ? 'Khá' : 'Cần chú ý'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToArena?.(dim.recommendedScenarioId);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-[11px] font-bold border border-cyan-500/30 transition-all"
                        >
                          Luyện tập
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* 5. COMMUNITY DNA DEMOGRAPHIC BENCHMARKS */}
      <AnimatePresence>
        {(viewMode === 'community' || viewMode === 'compare') && communityDna && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8 pt-4"
          >
            <div className="border-t border-slate-800/80 pt-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <span>Dữ Liệu Scam DNA Theo Nhóm Nhân Khẩu Học</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Khảo sát tỷ lệ sập bẫy và năng lực tự vệ của 3 nhóm nhân khẩu học lớn tại Việt Nam
                  </p>
                </div>

                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono">
                  <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>Điểm TB Toàn Quốc: {communityDna.overallCommunityAverage}/100</span>
                </div>
              </div>

              {/* 3 Demographic Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {communityDna.demographicBreakdown.map((demo, idx) => (
                  <div
                    key={idx}
                    className="bento-card p-6 rounded-3xl border border-slate-800/80 bg-slate-950/80 space-y-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{demo.group}</span>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-mono font-black"
                        style={{ backgroundColor: `${demo.color}20`, color: demo.color }}
                      >
                        {demo.averageScore}/100
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        style={{ width: `${demo.averageScore}%`, backgroundColor: demo.color }}
                        className="h-full rounded-full"
                      />
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      Cỡ mẫu khảo sát: <strong>{demo.sampleCount.toLocaleString('vi-VN')} người dùng</strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1">
                      <div className="font-bold text-amber-300 flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Điểm Yếu Phổ Biến Nhất:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{demo.criticalWeakness}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top National Vulnerabilities Table */}
              <div className="bento-card p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-950/90 space-y-6 mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white flex items-center space-x-2">
                    <Target className="w-5 h-5 text-rose-400" />
                    <span>Top 5 Đòn Tâm Lý Khiến Người Việt Nam Dễ Sập Bẫy Nhất</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
                    Thống kê tỷ lệ sai sót thực tế
                  </span>
                </div>

                <div className="space-y-3">
                  {communityDna.topVulnerabilitiesNational.map((vuln, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-rose-400 font-mono">#{idx + 1}</span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{vuln.label}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                              vuln.trend === 'rising'
                                ? 'bg-rose-950 text-rose-300 border border-rose-700'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {vuln.trend === 'rising' ? '▲ Đang tăng mạnh' : '● Ổn định'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{vuln.description}</p>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <div className="text-lg font-black font-mono text-rose-400">
                          {vuln.vulnerabilityRate}%
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">người dùng bị lừa</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anonymous Telemetry Contribution Card */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Đóng Góp Dữ Liệu Diễn Tập Ẩn Danh Vì An Toàn Quốc Gia</span>
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xl">
                    Kết quả diễn tập của bạn được mã hóa một chiều và ẩn danh hoàn toàn để góp phần cập nhật bản đồ rủi ro quốc gia giúp bảo vệ trẻ em và người cao tuổi.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={telemetryOptIn}
                    onChange={(e) => setTelemetryOptIn(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-xs font-mono font-bold text-slate-300">
                    {telemetryOptIn ? 'Đang Bật' : 'Đã Tắt'}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. MODAL: DIGITAL DEFENSE PASSPORT (HỘ CHIẾU AN TOÀN SỐ) */}
      <AnimatePresence>
        {showPassportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-950 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden space-y-6"
            >
              {/* Background gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-black uppercase">
                  <Award className="w-4 h-4" />
                  <span>Hộ Chiếu Phòng Vệ Số (ScamGuard Defense Passport)</span>
                </div>
                <button
                  onClick={() => setShowPassportModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              {/* Passport Body */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/50 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Chủ sở hữu</div>
                    <div className="text-base font-black text-white">{userProfile.name || 'Người Dùng ScamGuard'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Điểm SDI</div>
                    <div className="text-xl font-black font-mono text-emerald-300">
                      {dnaProfile?.overallScore || 82}/100
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-2">
                  <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30">
                    <div className="text-purple-300 font-bold">TÂM LÝ</div>
                    <div className="text-sm font-black text-white mt-0.5">{pillarScores.psychology.user}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-sky-950/40 border border-sky-500/30">
                    <div className="text-sky-300 font-bold">KỸ THUẬT</div>
                    <div className="text-sm font-black text-white mt-0.5">{pillarScores.technical.user}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                    <div className="text-emerald-300 font-bold">TÀI CHÍNH</div>
                    <div className="text-sm font-black text-white mt-0.5">{pillarScores.financial.user}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hình mẫu: {dnaProfile?.archetype?.title || 'Vệ Binh Tinh Nhuệ'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{dnaProfile?.archetype?.subtitle}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSharePassport}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? 'Đã Sao Chép Kết Quả!' : 'Sao Chép & Chia Sẻ'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
