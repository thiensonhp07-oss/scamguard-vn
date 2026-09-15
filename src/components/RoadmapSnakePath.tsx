import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Sparkles,
  Flame,
  Star,
  CheckCircle2,
  Lock,
  Play,
  Check,
  ChevronRight,
  ChevronLeft,
  Shield,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Gift,
  Target,
  Trophy,
  Swords,
  Zap,
  Compass,
  Radar,
  ArrowRight,
  Cpu,
  Radio,
  ShoppingBag,
  HeartCrack,
  TrendingUp,
  Scale,
  ScanFace,
  Crown,
  Activity,
  AlertTriangle,
  Terminal,
  Layers,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  CAMPAIGN_SECTORS,
  CampaignNode,
  SectorCampaign,
  BossBattle,
  SpeedReflexChallenge,
  SupplyChest,
} from '../data/campaignData';
import { DuolingoLessonRunner } from './DuolingoLessonRunner';
import { BossBattleRunner } from './BossBattleRunner';
import { SpeedReflexRunner } from './SpeedReflexRunner';
import { SupplyChestModal } from './SupplyChestModal';
import { MascotOwl } from './MascotOwl';

interface RoadmapSnakePathProps {
  userProfile: UserProfile;
  onNavigate: (tab: 'home' | 'train' | 'check' | 'progress' | 'learn', subView?: string) => void;
  onOpenLeaderboard: () => void;
  onEarnXp?: (amount: number) => void;
}

// Visual simulation environment configuration for each sector
const SECTOR_ENVIRONMENT_THEMES: Record<
  number,
  {
    icon: React.ReactNode;
    threatLevel: string;
    threatBadgeClass: string;
    atmosphereTitle: string;
    simulationDossier: string;
    cardBorder: string;
    arenaBg: string;
    glowColor1: string;
    glowColor2: string;
    gradStop1: string;
    gradStop2: string;
    gradStop3: string;
    nodeActiveGrad: string;
    pedestalBorder: string;
    accentHex: string;
    bgPattern: string;
  }
> = {
  1: {
    icon: <Cpu className="w-4 h-4 text-emerald-400" />,
    threatLevel: 'CẤP ĐỘ 1: BẪY MỒI NHỬ CƠ BẢN',
    threatBadgeClass: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80',
    atmosphereTitle: 'Mô Phỏng Rừng Số Cyber Bio-Matrix',
    simulationDossier: 'Môi trường mô phỏng các thủ đoạn tặng quà 0 đồng, vòng quay trúng thưởng giả lập VinFast/iPhone.',
    cardBorder: 'border-emerald-500/40 hover:border-emerald-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950',
    glowColor1: 'bg-emerald-500/20',
    glowColor2: 'bg-teal-500/15',
    gradStop1: '#10b981',
    gradStop2: '#06b6d4',
    gradStop3: '#059669',
    nodeActiveGrad: 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-200 border-emerald-800 text-slate-950',
    pedestalBorder: 'border-emerald-500/50',
    accentHex: '#10b981',
    bgPattern: 'radial-gradient(#10b981 1.5px, transparent 1.5px)',
  },
  2: {
    icon: <Radio className="w-4 h-4 text-cyan-400" />,
    threatLevel: 'CẤP ĐỘ 2: TẤN CÔNG VIỄN THÔNG BTS',
    threatBadgeClass: 'bg-cyan-950/90 text-cyan-300 border-cyan-700/80',
    atmosphereTitle: 'Mô Phỏng Thung Lũng Sóng Vô Tuyến Telecom',
    simulationDossier: 'Môi trường radar mô phỏng trạm phát sóng BTS giả mạo, chèn tin nhắn SMS Brandname mạo danh ngân hàng.',
    cardBorder: 'border-cyan-500/40 hover:border-cyan-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-cyan-950/25 to-slate-950',
    glowColor1: 'bg-cyan-500/20',
    glowColor2: 'bg-blue-500/15',
    gradStop1: '#06b6d4',
    gradStop2: '#3b82f6',
    gradStop3: '#0284c7',
    nodeActiveGrad: 'bg-gradient-to-t from-cyan-600 via-cyan-400 to-sky-200 border-cyan-800 text-slate-950',
    pedestalBorder: 'border-cyan-500/50',
    accentHex: '#06b6d4',
    bgPattern: 'radial-gradient(#06b6d4 1.5px, transparent 1.5px)',
  },
  3: {
    icon: <ShoppingBag className="w-4 h-4 text-teal-400" />,
    threatLevel: 'CẤP ĐỘ 3: LỪA ĐẢO TMĐT & PHÍ SHIPPER',
    threatBadgeClass: 'bg-teal-950/90 text-teal-300 border-teal-700/80',
    atmosphereTitle: 'Mô Phỏng Đô Thị Kho Vận & Thương Mại Điện Tử',
    simulationDossier: 'Mô phỏng mạng lưới đơn hàng Shopee ảo, shipper thu COD giả mạo và bẫy việc làm giật đơn hoa hồng ảo.',
    cardBorder: 'border-teal-500/40 hover:border-teal-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-teal-950/25 to-slate-950',
    glowColor1: 'bg-teal-500/20',
    glowColor2: 'bg-amber-500/15',
    gradStop1: '#14b8a6',
    gradStop2: '#f59e0b',
    gradStop3: '#0d9488',
    nodeActiveGrad: 'bg-gradient-to-t from-teal-600 via-teal-400 to-amber-200 border-teal-800 text-slate-950',
    pedestalBorder: 'border-teal-500/50',
    accentHex: '#14b8a6',
    bgPattern: 'radial-gradient(#14b8a6 1.5px, transparent 1.5px)',
  },
  4: {
    icon: <HeartCrack className="w-4 h-4 text-purple-400" />,
    threatLevel: 'CẤP ĐỘ 4: THAO TÚNG TÂM LÝ TÌNH CẢM (ROMANCE SCAM)',
    threatBadgeClass: 'bg-purple-950/90 text-purple-300 border-purple-700/80',
    atmosphereTitle: 'Mô Phỏng Mê Cung Tím Thao Túng Cảm Xúc',
    simulationDossier: 'Mô phỏng hồ sơ hẹn hò mỹ nam/mỹ nữ ngoại quốc, bẫy gửi quà hải quan giữ và chiêu trò mượn tiền chữa bệnh.',
    cardBorder: 'border-purple-500/40 hover:border-purple-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950',
    glowColor1: 'bg-purple-500/20',
    glowColor2: 'bg-pink-500/15',
    gradStop1: '#a855f7',
    gradStop2: '#ec4899',
    gradStop3: '#7e22ce',
    nodeActiveGrad: 'bg-gradient-to-t from-purple-600 via-pink-400 to-purple-200 border-purple-800 text-white',
    pedestalBorder: 'border-purple-500/50',
    accentHex: '#a855f7',
    bgPattern: 'radial-gradient(#a855f7 1.5px, transparent 1.5px)',
  },
  5: {
    icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
    threatLevel: 'CẤP ĐỘ 5: SÀN TÀI CHÍNH PONZI & LỆNH GIẢ',
    threatBadgeClass: 'bg-amber-950/90 text-amber-300 border-amber-700/80',
    atmosphereTitle: 'Mô Phỏng Sàn Nến Vàng & Mỏ Tiền Ảo Crypto',
    simulationDossier: 'Mô phỏng sàn Forex tự chế, can thiệp đồ thị nến giá, tạo tài khoản demo nhân đôi vốn và khóa lệnh rút tiền.',
    cardBorder: 'border-amber-500/40 hover:border-amber-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-amber-950/25 to-slate-950',
    glowColor1: 'bg-amber-500/20',
    glowColor2: 'bg-yellow-500/15',
    gradStop1: '#f59e0b',
    gradStop2: '#eab308',
    gradStop3: '#d97706',
    nodeActiveGrad: 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 border-amber-800 text-slate-950',
    pedestalBorder: 'border-amber-500/50',
    accentHex: '#f59e0b',
    bgPattern: 'radial-gradient(#f59e0b 1.5px, transparent 1.5px)',
  },
  6: {
    icon: <Scale className="w-4 h-4 text-blue-400" />,
    threatLevel: 'CẤP ĐỘ 6: MẠO DANH PHÁP LUẬT & ĐE DỌA PHẠM PHÁP',
    threatBadgeClass: 'bg-blue-950/90 text-blue-300 border-blue-700/80',
    atmosphereTitle: 'Mô Phỏng Pháo Đài Tư Pháp & Lá Chắn Quốc Gia',
    simulationDossier: 'Mô phỏng cuộc gọi đe dọa "lệnh bắt tạm giam rửa tiền", tài liệu giả mạo dấu đỏ Viện Kiểm Sát và lệnh phong tỏa.',
    cardBorder: 'border-blue-500/40 hover:border-blue-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950',
    glowColor1: 'bg-blue-500/20',
    glowColor2: 'bg-indigo-500/15',
    gradStop1: '#3b82f6',
    gradStop2: '#6366f1',
    gradStop3: '#1d4ed8',
    nodeActiveGrad: 'bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-200 border-blue-800 text-white',
    pedestalBorder: 'border-blue-500/50',
    accentHex: '#3b82f6',
    bgPattern: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)',
  },
  7: {
    icon: <ScanFace className="w-4 h-4 text-rose-400" />,
    threatLevel: 'CẤP ĐỘ 7: CÔNG NGHỆ CAO AI DEEPFAKE & QUISHING',
    threatBadgeClass: 'bg-rose-950/90 text-rose-300 border-rose-700/80',
    atmosphereTitle: 'Mô Phỏng Viện Nghiên Cứu Tội Phạm AI & QR Độc',
    simulationDossier: 'Mô phỏng video call ghép mặt Deepfake người thân mượn tiền, mã QR độc dán đè tại quán ăn và đánh cắp sinh trắc học CCCD.',
    cardBorder: 'border-rose-500/40 hover:border-rose-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-rose-950/25 to-slate-950',
    glowColor1: 'bg-rose-500/20',
    glowColor2: 'bg-red-500/15',
    gradStop1: '#f43f5e',
    gradStop2: '#fb7185',
    gradStop3: '#e11d48',
    nodeActiveGrad: 'bg-gradient-to-t from-rose-600 via-rose-400 to-pink-200 border-rose-800 text-white',
    pedestalBorder: 'border-rose-500/50',
    accentHex: '#f43f5e',
    bgPattern: 'radial-gradient(#f43f5e 1.5px, transparent 1.5px)',
  },
  8: {
    icon: <Crown className="w-4 h-4 text-amber-300" />,
    threatLevel: 'CẤP ĐỘ 8: TỐI CAO - SƠ CỨU GIỜ VÀNG & SIÊU TRÙM',
    threatBadgeClass: 'bg-amber-950/90 text-amber-300 border-amber-500/80',
    atmosphereTitle: 'Mô Phỏng Đại Điện Thần Thoại Vệ Binh Không Gian Số',
    simulationDossier: 'Thao trường sát hạch 30 kỹ năng tổng hợp, sơ cứu tài chính 3 bước trong giờ vàng và bẻ gãy bẫy lừa kép thu hồi tiền.',
    cardBorder: 'border-amber-400/60 hover:border-amber-300/80',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950',
    glowColor1: 'bg-amber-400/25',
    glowColor2: 'bg-indigo-500/20',
    gradStop1: '#fbbf24',
    gradStop2: '#818cf8',
    gradStop3: '#d97706',
    nodeActiveGrad: 'bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 border-amber-700 text-slate-950',
    pedestalBorder: 'border-amber-400/60',
    accentHex: '#fbbf24',
    bgPattern: 'radial-gradient(#fbbf24 1.5px, transparent 1.5px)',
  },
  9: {
    icon: <ScanFace className="w-4 h-4 text-rose-400" />,
    threatLevel: 'CẤP ĐỘ 9: TRÍ TUỆ NHÂN TẠO DEEPFAKE & BIOMETRICS',
    threatBadgeClass: 'bg-rose-950/90 text-rose-300 border-rose-700/80',
    atmosphereTitle: 'Mô Phỏng Phân Khu Sinh Trắc Học & Giọng Nói AI',
    simulationDossier: 'Môi trường mô phỏng các thủ đoạn nhân bản giọng nói AI (Voice Cloning), làm giả Video Call cứu trợ y tế khẩn cấp.',
    cardBorder: 'border-rose-500/40 hover:border-rose-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-rose-950/20 to-slate-950',
    glowColor1: 'bg-rose-500/20',
    glowColor2: 'bg-pink-500/15',
    gradStop1: '#f43f5e',
    gradStop2: '#ec4899',
    gradStop3: '#be123c',
    nodeActiveGrad: 'bg-gradient-to-t from-rose-600 via-rose-400 to-rose-200 border-rose-800 text-slate-950',
    pedestalBorder: 'border-rose-500/50',
    accentHex: '#f43f5e',
    bgPattern: 'radial-gradient(#f43f5e 1.5px, transparent 1.5px)',
  },
  10: {
    icon: <Zap className="w-4 h-4 text-indigo-400" />,
    threatLevel: 'CẤP ĐỘ 10: TIỀN KỸ THUẬT SỐ & WEB3 DRAINER CONTRACT',
    threatBadgeClass: 'bg-indigo-950/90 text-indigo-300 border-indigo-700/80',
    atmosphereTitle: 'Mô Phỏng Quần Đảo Blockchain & Sàn Giao Dịch Web3',
    simulationDossier: 'Môi trường phi tập trung mô phỏng bẫy lấy 12 ký tự khôi phục ví, ủy quyền rút tiền tự động thông qua nút bấm nhận Airdrop ảo.',
    cardBorder: 'border-indigo-500/40 hover:border-indigo-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-indigo-950/25 to-slate-950',
    glowColor1: 'bg-indigo-500/20',
    glowColor2: 'bg-blue-500/15',
    gradStop1: '#6366f1',
    gradStop2: '#3b82f6',
    gradStop3: '#4338ca',
    nodeActiveGrad: 'bg-gradient-to-t from-indigo-600 via-indigo-400 to-indigo-200 border-indigo-800 text-white',
    pedestalBorder: 'border-indigo-500/50',
    accentHex: '#6366f1',
    bgPattern: 'radial-gradient(#6366f1 1.5px, transparent 1.5px)',
  },
  11: {
    icon: <Radio className="w-4 h-4 text-teal-400" />,
    threatLevel: 'CẤP ĐỘ 11: JUICE JACKING SẠC CÁP & WIFI CÔNG CỘNG',
    threatBadgeClass: 'bg-teal-950/90 text-teal-300 border-teal-700/80',
    atmosphereTitle: 'Mô Phỏng Trạm Sạc Thông Minh & Điểm Wifi Miễn Phí',
    simulationDossier: 'Môi trường công cộng mô phỏng bẫy cài ứng dụng theo dõi lén qua cổng sạc USB sân bay và đánh cắp mã OTP qua Wifi giả mạo.',
    cardBorder: 'border-teal-500/40 hover:border-teal-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-teal-950/25 to-slate-950',
    glowColor1: 'bg-teal-500/20',
    glowColor2: 'bg-emerald-500/15',
    gradStop1: '#14b8a6',
    gradStop2: '#10b981',
    gradStop3: '#0f766e',
    nodeActiveGrad: 'bg-gradient-to-t from-teal-600 via-teal-400 to-teal-200 border-teal-800 text-slate-950',
    pedestalBorder: 'border-teal-500/50',
    accentHex: '#14b8a6',
    bgPattern: 'radial-gradient(#14b8a6 1.5px, transparent 1.5px)',
  },
  12: {
    icon: <Shield className="w-4 h-4 text-amber-400" />,
    threatLevel: 'CẤP ĐỘ 12: THÁNH ĐƯỜNG CÔNG LÝ - BẺ GÃY LỪA ĐẢO THU HỒI',
    threatBadgeClass: 'bg-amber-950/90 text-amber-300 border-amber-700/80',
    atmosphereTitle: 'Mô Phỏng Điện Thờ Bảo Vệ Pháp Lý Số',
    simulationDossier: 'Phòng vệ tối cao bẻ gãy kịch bản mạo danh văn phòng luật sư quốc tế, cam kết thu hồi 100% tiền bị lừa treo để gài cọc đóng phí.',
    cardBorder: 'border-amber-500/40 hover:border-amber-400/60',
    arenaBg: 'bg-gradient-to-b from-slate-950 via-amber-950/25 to-slate-950',
    glowColor1: 'bg-amber-500/20',
    glowColor2: 'bg-yellow-500/15',
    gradStop1: '#f59e0b',
    gradStop2: '#eab308',
    gradStop3: '#b45309',
    nodeActiveGrad: 'bg-gradient-to-t from-amber-600 via-yellow-400 to-amber-200 border-amber-800 text-slate-950',
    pedestalBorder: 'border-amber-500/50',
    accentHex: '#f59e0b',
    bgPattern: 'radial-gradient(#f59e0b 1.5px, transparent 1.5px)',
  },
};

export const RoadmapSnakePath: React.FC<RoadmapSnakePathProps> = ({
  userProfile,
  onNavigate,
  onOpenLeaderboard,
  onEarnXp,
}) => {
  // Store completed node IDs in local storage
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('scamguard_campaign_completed_nodes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // Default: fresh start for new user (0 nodes completed)
    return [];
  });

  // Dynamic user age / perspective mode (Học sinh, Văn phòng, Người cao tuổi)
  const [ageMode, setAgeMode] = useState<'teen' | 'adult' | 'senior'>(() => {
    try {
      const saved = localStorage.getItem('scamguard_roadmap_age_mode');
      if (saved === 'teen' || saved === 'adult' || saved === 'senior') {
        return saved;
      }
      if (userProfile.mode === 'kids' || userProfile.mode === 'teen') return 'teen';
      if (userProfile.mode === 'senior') return 'senior';
    } catch (e) {
      console.error(e);
    }
    return 'adult';
  });

  // Save active age mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scamguard_roadmap_age_mode', ageMode);
    } catch (e) {
      console.error(e);
    }
  }, [ageMode]);

  // Dynamic sectors state sorted by real-time failure rate based on ViSEF Survey and Train AI dataset
  const [sectorsSorted, setSectorsSorted] = useState<typeof CAMPAIGN_SECTORS>(() => CAMPAIGN_SECTORS);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Track active sector ID to maintain selection across dynamic reorder events
  const [activeSectorId, setActiveSectorId] = useState<string>(() => {
    try {
      const savedIdx = localStorage.getItem('scamguard_active_sector_idx');
      if (savedIdx) {
        const parsed = parseInt(savedIdx, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < CAMPAIGN_SECTORS.length) {
          return CAMPAIGN_SECTORS[parsed].id;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return CAMPAIGN_SECTORS[0].id;
  });

  // Derived active sector index within the sorted list
  const activeSectorIndex = Math.max(0, sectorsSorted.findIndex((s) => s.id === activeSectorId));

  // Handle setting sector by index in sorted array
  const handleSelectSectorIndex = (idx: number) => {
    const targetSector = sectorsSorted[idx];
    if (targetSector) {
      setActiveSectorId(targetSector.id);
      try {
        const staticIdx = CAMPAIGN_SECTORS.findIndex((s) => s.id === targetSector.id);
        localStorage.setItem('scamguard_active_sector_idx', staticIdx.toString());
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Helper function to calculate failure/error rates dynamically for each sector
  const calculateSectorFailureRate = (sectorId: string, analytics: any): number => {
    const getDnaVuln = (key: string) => {
      const item = analytics?.scamDnaComparativeRadar?.find((d: any) => d.dimensionKey === key);
      return item ? item.preAppVulnerability : 50; // default 50%
    };

    const getTacticPct = (key: string) => {
      const item = analytics?.fearTacticsDistribution?.find((t: any) => t.tacticKey === key);
      return item ? item.percentage : 20; // default 20%
    };

    switch (sectorId) {
      case 'sector-1':
        return (getDnaVuln('G') + getDnaVuln('R') + getTacticPct('TELEGRAM_INCOME')) / 3;
      case 'sector-2':
        return (getDnaVuln('R') + getDnaVuln('T')) / 2;
      case 'sector-3':
        return (getDnaVuln('C') + getTacticPct('FAKE_BILL_QR')) / 2;
      case 'sector-4':
        return (getDnaVuln('E') + getTacticPct('DEEPFAKE_CALL')) / 2;
      case 'sector-5':
        return (getDnaVuln('G') * 0.4 + getTacticPct('TELEGRAM_INCOME') * 1.5);
      case 'sector-6':
        return (getDnaVuln('A') * 0.4 + getTacticPct('AUTHORITY_POLICE') * 1.5);
      case 'sector-7':
        return (getDnaVuln('C') + getTacticPct('FAKE_BILL_QR')) / 2;
      case 'sector-8':
        return (getDnaVuln('T') * 0.4 + getTacticPct('URGENT_ACCIDENT') * 1.5);
      case 'sector-9':
        return (getDnaVuln('E') * 0.4 + getTacticPct('DEEPFAKE_CALL') * 1.5);
      case 'sector-10':
        return getDnaVuln('G');
      case 'sector-11':
        return getDnaVuln('C');
      case 'sector-12':
        return getDnaVuln('R');
      default:
        return 50;
    }
  };

  // Explanation for why each sector was prioritized based on metrics
  const getSectorFailureReason = (sectorId: string): string => {
    switch (sectorId) {
      case 'sector-1':
        return 'Người dùng dễ bị thu hút bởi quà tặng miễn phí và chưa có thói quen kiểm chứng nguồn gốc.';
      case 'sector-2':
        return 'Tỷ lệ dính bẫy tin nhắn mạo danh ngân hàng và dồn ép thời gian khẩn cấp rất cao trong tập dữ liệu.';
      case 'sector-3':
        return 'Định kiến tiện lợi mua sắm trực tuyến khiến nhiều người giao dịch COD hoặc nhận hóa đơn giả mà không đối soát số dư thực.';
      case 'sector-4':
        return 'Độ tổn thương cao trước các thủ đoạn lừa tình mồi chài đầu tư (Romance/Pig-Butchering) qua mạng xã hội.';
      case 'sector-5':
        return 'Cực kỳ dễ sập bẫy việc nhẹ lương cao nhiệm vụ Telegram - thủ đoạn có tần suất xuất hiện dày đặc nhất.';
      case 'sector-6':
        return 'Tâm lý tuân thủ mù quáng khi đối tượng giả danh Cơ quan điều tra, Cán bộ thuế hoặc Cổng dịch vụ công.';
      case 'sector-7':
        return 'Thử thách lớn trong việc phát hiện quẹt mã QR độc hại và biên lai Photoshop giả mạo.';
      case 'sector-8':
        return 'Hoảng loạn tâm lý trước áp lực thời gian dồn dập, dễ cung cấp mã OTP/mật khẩu giao dịch.';
      case 'sector-9':
        return 'Yếu trong việc nhận biết các tín hiệu đồ họa nhân tạo và giọng nói tổng hợp trong cuộc gọi Deepfake.';
      case 'sector-10':
        return 'Bị cuốn vào bẫy Claim Token Web3 miễn phí liên quan đến ủy quyền hợp đồng thông minh độc hại.';
      case 'sector-11':
        return 'Thói quen kết nối Wifi công cộng miễn phí không an toàn và cắm sạc cổng USB lạ.';
      case 'sector-12':
        return 'Dễ bị lừa dối kép bởi các đối tượng giả danh luật sư bồi thường hỗ trợ đòi lại tiền lừa đảo.';
      default:
        return 'Chỉ số tổn thương phòng thủ cao ước tính từ tập dữ liệu khảo sát cộng đồng.';
    }
  };

  // Fetch and sort training sectors based on real-time science evaluation dataset
  const fetchRoadmapAnalytics = async () => {
    try {
      const res = await fetch('/api/research/survey-analytics');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.scamDnaComparativeRadar) {
            setAnalyticsData(data);
            const sorted = [...CAMPAIGN_SECTORS].sort((a, b) => {
              const rateA = calculateSectorFailureRate(a.id, data);
              const rateB = calculateSectorFailureRate(b.id, data);
              return rateB - rateA; // Sort highest error rates first
            });
            setSectorsSorted(sorted);
          }
        }
      }
    } catch (e) {
      console.warn('Notice: Roadmap analytics polling temporarily running in local/fallback mode');
    }
  };

  useEffect(() => {
    fetchRoadmapAnalytics();
    const interval = setInterval(fetchRoadmapAnalytics, 4000);
    return () => clearInterval(interval);
  }, []);

  // Active Runner Modals
  const [activeLessonNode, setActiveLessonNode] = useState<CampaignNode | null>(null);
  const [activeBossNode, setActiveBossNode] = useState<BossBattle | null>(null);
  const [activeReflexNode, setActiveReflexNode] = useState<SpeedReflexChallenge | null>(null);
  const [activeChestNode, setActiveChestNode] = useState<SupplyChest | null>(null);

  // Listen to global data reset events
  useEffect(() => {
    const handleReset = () => {
      localStorage.removeItem('scamguard_campaign_completed_nodes');
      localStorage.removeItem('scamguard_active_sector_idx');
      setCompletedNodeIds([]);
      setActiveSectorId(sectorsSorted[0]?.id || CAMPAIGN_SECTORS[0].id);
    };

    window.addEventListener('scamguard_data_cleared', handleReset);
    window.addEventListener('scamguard_reset_data', handleReset);
    return () => {
      window.removeEventListener('scamguard_data_cleared', handleReset);
      window.removeEventListener('scamguard_reset_data', handleReset);
    };
  }, [sectorsSorted]);

  // Overall Stats
  const currentXp = userProfile.xp ?? 0;
  const level = Math.floor(currentXp / 500) + 1;
  const currentLevelXp = currentXp % 500;
  const xpPercent = Math.min(100, (currentLevelXp / 500) * 100);

  // Total nodes in all 8 sectors
  const allNodesFlat = sectorsSorted.flatMap((s) => s.nodes);
  const totalNodesCount = allNodesFlat.length;
  const completedCount = completedNodeIds.length;
  const progressPercent = Math.round((completedCount / totalNodesCount) * 100);

  const currentSector = sectorsSorted[activeSectorIndex] || sectorsSorted[0];
  const envTheme =
    SECTOR_ENVIRONMENT_THEMES[currentSector.sectorNumber] || SECTOR_ENVIRONMENT_THEMES[1];

  // Helper to mark node complete
  const markNodeComplete = (nodeId: string, earnedXp: number) => {
    setCompletedNodeIds((prev) => {
      const next = prev.includes(nodeId) ? prev : [...prev, nodeId];
      try {
        localStorage.setItem('scamguard_campaign_completed_nodes', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    if (onEarnXp) {
      onEarnXp(earnedXp);
    }
  };

  // Node Status checker
  const getNodeStatus = (
    node: CampaignNode,
    nodeIndexInSector: number
  ): 'completed' | 'active' | 'locked' => {
    if (completedNodeIds.includes(node.id)) {
      return 'completed';
    }

    // In Sector 0, first node is active if not complete
    if (activeSectorIndex === 0 && nodeIndexInSector === 0) {
      return 'active';
    }

    // Check if previous node in the same sector is completed
    if (nodeIndexInSector > 0) {
      const prevNode = currentSector.nodes[nodeIndexInSector - 1];
      if (prevNode && completedNodeIds.includes(prevNode.id)) {
        return 'active';
      }
    } else if (activeSectorIndex > 0) {
      // First node of current sector is active if last node of previous sector is completed
      const prevSector = sectorsSorted[activeSectorIndex - 1];
      const lastNodeOfPrevSector = prevSector.nodes[prevSector.nodes.length - 1];
      if (lastNodeOfPrevSector && completedNodeIds.includes(lastNodeOfPrevSector.id)) {
        return 'active';
      }
    }

    return 'locked';
  };

  // Sector unlock status
  const isSectorUnlocked = (sectorIdx: number) => {
    if (sectorIdx === 0) return true;
    const prevSector = sectorsSorted[sectorIdx - 1];
    // Unlocked if at least 2 nodes of previous sector are completed or last node is completed
    return prevSector.nodes.some((n) => completedNodeIds.includes(n.id));
  };

  // Current sector completion progress
  const sectorCompletedNodes = currentSector.nodes.filter((n) =>
    completedNodeIds.includes(n.id)
  );
  const sectorProgressPercent = Math.round(
    (sectorCompletedNodes.length / currentSector.nodes.length) * 100
  );
  const isCurrentSectorFinished =
    sectorCompletedNodes.length === currentSector.nodes.length;

  // Zig-zag offset for serpentine path inside single frame - pronounced oscillation (8 nodes)
  const getHorizontalOffset = (index: number) => {
    const pattern = [-55, 55, -55, 55, -55, 55, -55, 55];
    return pattern[index % pattern.length];
  };

  // Briefing modal state for inspect/click
  const [briefingNode, setBriefingNode] = useState<CampaignNode | null>(null);

  // Launch node
  const handleLaunchNode = (node: CampaignNode) => {
    const status = getNodeStatus(node, node.nodeIndex);
    if (status === 'locked') {
      setBriefingNode(node);
      return;
    }

    if (node.kind === 'lesson' && node.lessonData) {
      setActiveLessonNode(node);
    } else if (node.kind === 'boss' && node.bossData) {
      setActiveBossNode(node.bossData);
    } else if (node.kind === 'reflex' && node.reflexData) {
      setActiveReflexNode(node.reflexData);
    } else if (node.kind === 'chest' && node.chestData) {
      setActiveChestNode(node.chestData);
    }
  };

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-scroll the blade rack to keep the selected blade visible/centered
  useEffect(() => {
    const rack = document.getElementById('scamguard-blade-rack');
    if (rack) {
      const selectedButton = rack.children[activeSectorIndex] as HTMLElement;
      if (selectedButton) {
        const rackWidth = rack.clientWidth;
        const buttonWidth = selectedButton.clientWidth;
        const buttonLeft = selectedButton.offsetLeft;
        rack.scrollTo({
          left: buttonLeft - (rackWidth / 2) + (buttonWidth / 2),
          behavior: 'smooth',
        });
      }
    }
  }, [activeSectorIndex]);

  return (
    <div className="space-y-6">
      {/* 1. TOP HERO HUD & OVERALL PROGRESS WITH GLASSMORPHIC PANORAMA BANNER */}
      <div className="cyber-card-neon relative overflow-hidden rounded-3xl border border-cyan-500/40 shadow-2xl flex flex-col">
        {/* Glassmorphic Panorama Banner Header */}
        <div className="w-full h-28 relative overflow-hidden flex items-center px-6 sm:px-8 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md">
          {/* Subtle grid and scanning lines overlay */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,rgba(6,182,212,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.3)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/45 to-transparent z-0" />
          <div className="absolute top-0 right-1/4 w-64 h-full bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <span className="cyber-badge-cyan text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center space-x-1.5 bg-cyan-950/80 border border-cyan-500/40 text-glow-cyan shadow-md">
                <Compass className="w-3.5 h-3.5" />
                <span>Khu Vực {currentSector.sectorNumber}: {currentSector.title}</span>
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] font-black tracking-widest text-slate-400 font-mono">
              BẢN ĐỒ PHÒNG TUYẾN SỐ v4.2
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="glow-orb-cyan -top-10 -right-10 opacity-60" />
          <div className="glow-orb-pink -bottom-10 -left-10 opacity-50" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Mascot & Rank Header */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="relative flex-shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-300 p-0.5 shadow-[0_0_25px_rgba(0,243,255,0.35)] flex items-center justify-center animate-pulse-glow">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] overflow-hidden flex items-center justify-center">
                    <MascotOwl size="md" variant="avatar" className="scale-105" />
                  </div>
                </div>
                <div className="absolute -bottom-1.5 -right-1 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full border border-slate-950 shadow-md font-mono">
                  Lv.{level}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="cyber-badge-cyan text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <Crown className="w-3 h-3 text-cyan-400" />
                    <span>Cấp {level} Vệ Binh</span>
                  </span>
                  <span className="cyber-badge-gold text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 bg-amber-950/60 border border-amber-800/60 text-amber-300">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                    <span>{userProfile.streakDays ?? 0} Ngày Liên Tiếp</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white text-glow-cyan leading-none">
                  Bản Đồ Phòng Tuyến Số
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Chinh phục 12 Khu Vực Mô Phỏng Độc Bản • Vượt Thử Thách Trạm & Tiêu Diệt Trùm Lừa Đảo.
                </p>
              </div>
            </div>

            {/* Quick Stats & Leaderboard Button */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
              <div className="bg-slate-950/80 border border-cyan-500/20 px-4 py-2.5 rounded-2xl flex items-center space-x-2.5 shadow-inner">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">
                    Tổng Tiến Trình 12 Khu
                  </span>
                  <span className="text-xs sm:text-sm font-black text-white font-mono">
                    {completedCount} / {totalNodesCount} Trạm ({progressPercent}%)
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenLeaderboard}
                className="btn-cyber-primary px-4 py-2.5 text-xs flex items-center space-x-2 rounded-2xl shadow-lg cursor-pointer font-extrabold uppercase font-mono"
              >
                <Award className="w-4 h-4" />
                <span>Bảng Xếp Hạng</span>
              </button>
            </div>
          </div>

          {/* Upgraded Level XP Progress Bar (Thicker, Gradient, metallic shimmer animation) */}
          <div className="mt-6 pt-5 border-t border-slate-900 space-y-2">
            <div className="flex justify-between text-[11px] font-black uppercase font-mono tracking-wider">
              <span className="text-cyan-400 flex items-center space-x-1.5 text-glow-cyan">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Tiến trình thăng Cấp {level + 1} Vệ Binh</span>
              </span>
              <span className="text-slate-300">
                {currentLevelXp} / 500 XP (Tổng {currentXp} XP)
              </span>
            </div>
            
            <div className="w-full h-4.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)] relative">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-rose-500 rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
                style={{ width: `${xpPercent}%` }}
              >
                {/* Metallic shimmer glowing wave sweep overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_50%,transparent_100%)] bg-[size:200%_100%] animate-shimmer pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK DAILY CYBER STRIKE BANNER (GAMIFICATION LOOP ENHANCEMENT) */}
      <div className="cyber-card-pink p-4 sm:p-5 rounded-2xl border-2 border-pink-500/60 shadow-[0_0_20px_rgba(255,0,127,0.2)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/60 flex items-center justify-center flex-shrink-0 text-2xl shadow-[0_0_15px_rgba(255,0,127,0.4)] animate-pulse">
            ⚡
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="cyber-badge-pink text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                NHIỆM VỤ PHẢN XẠ 24H
              </span>
              <span className="text-[10px] text-amber-400 font-bold font-mono">+50 XP THƯỞNG</span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
              Thử Thách Nhanh: Nhận Diện Cuộc Gọi Deepfake Video Bố Mẹ Nhập Viện
            </h4>
          </div>
        </div>

        <button
          onClick={() => {
            const node = currentSector.nodes.find((n) => n.kind === 'reflex') || currentSector.nodes[1];
            handleLaunchNode(node);
          }}
          className="btn-tactile bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-lg cursor-pointer whitespace-nowrap self-end md:self-auto"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Vào Thử Thách Nhanh (25s)</span>
        </button>
      </div>

      {/* 2. THE DYNAMIC THEMED SECTOR SIMULATION ARENA (TACTICAL CYBER SECURITY COMMAND ROOM & HOLOGRAM CORE) */}
      <div
        className="bg-[#090E17] border-2 border-cyan-500/30 text-slate-100 p-5 sm:p-8 relative overflow-hidden space-y-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-3xl transition-all duration-500"
        style={{
          '--accent-color': envTheme.accentHex,
          '--accent-glow-20': `${envTheme.accentHex}33`,
          '--accent-glow-10': `${envTheme.accentHex}1a`,
        } as React.CSSProperties}
      >
        {/* Dynamic Styles injected directly inside for advanced Cyberpunk effects */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cyber-hologram-sweep {
            0% { top: -20%; opacity: 0.8; }
            50% { opacity: 0.2; }
            100% { top: 120%; opacity: 0.8; }
          }
          @keyframes cyber-conduit-flow {
            to {
              stroke-dashoffset: -32;
            }
          }
          @keyframes cyber-terminal-pulse {
            0%, 100% { box-shadow: 0 0 10px var(--accent-color); opacity: 0.8; }
            50% { box-shadow: 0 0 25px var(--accent-color); opacity: 1; }
          }
          @keyframes cyber-signal-wave {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          .cyber-grid-blueprint {
            background-size: 24px 24px;
            background-image: 
              linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          }
          .cyber-sweep-line {
            position: absolute;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(to right, transparent, var(--accent-color), transparent);
            box-shadow: 0 0 12px var(--accent-color);
            animation: cyber-hologram-sweep 7s linear infinite;
            pointer-events: none;
            z-index: 5;
          }
          .cyber-conduit-flow-completed {
            stroke-dasharray: 8 8;
            animation: cyber-conduit-flow 1.2s linear infinite;
          }
          .cyber-conduit-flow-active {
            stroke-dasharray: 4 6;
            animation: cyber-conduit-flow 0.6s linear infinite;
          }
          @keyframes tech-rotate-cw {
            to { transform: rotate(360deg); }
          }
          @keyframes tech-rotate-ccw {
            to { transform: rotate(-360deg); }
          }
          .tech-ring-cw {
            transform-origin: center;
            animation: tech-rotate-cw 12s linear infinite;
          }
          .tech-ring-ccw {
            transform-origin: center;
            animation: tech-rotate-ccw 8s linear infinite;
          }
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        {/* Laser Sweep Holographic Scanning line */}
        <div className="cyber-sweep-line" />

        {/* Matrix Blueprint grid backdrop */}
        <div className="absolute inset-0 cyber-grid-blueprint opacity-60 pointer-events-none" />

        {/* Tech Corner Crosshairs [+] for authentic military-grade command interface */}
        <div className="absolute top-3 left-3 text-cyan-500/40 font-mono text-xs select-none pointer-events-none">[+]</div>
        <div className="absolute top-3 right-3 text-cyan-500/40 font-mono text-xs select-none pointer-events-none">[+]</div>
        <div className="absolute bottom-3 left-3 text-cyan-500/40 font-mono text-xs select-none pointer-events-none">[+]</div>
        <div className="absolute bottom-3 right-3 text-cyan-500/40 font-mono text-xs select-none pointer-events-none">[+]</div>

        {/* Header Telemetry ticker */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black uppercase font-mono tracking-widest text-cyan-400">
              OPERATIONS DECK STATUS: ACTIVE SECURE // THREAT ANALYSIS RUNNING
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 hidden md:block">
            LATENCY: 12MS // SYS_ENG: DRIZZLE_FS
          </span>
        </div>

        {/* SECTOR SWITCHER NAVIGATION (CYBER BLADE CABINET INTERFACE) */}
        <div className="space-y-4 relative z-10 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Radar className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-300 font-mono block">
                  BẢNG ĐIỀU KHIỂN PHÂN KHU SỐ (TACTICAL CORES CABINET)
                </span>
                <span className="text-[8px] text-slate-500 font-mono block uppercase">
                  CHỌN KHU VỰC ĐỂ KÍCH HOẠT MÔ PHỎNG AN NINH MẠNG
                </span>
              </div>
            </div>

            {/* Quick Sector Next / Prev Navigation */}
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                disabled={activeSectorIndex <= 0}
                onClick={() => handleSelectSectorIndex(Math.max(0, activeSectorIndex - 1))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center space-x-1 border border-slate-800 transition-all ${
                  activeSectorIndex > 0
                    ? 'bg-slate-900/90 text-cyan-400 border-cyan-500/30 hover:bg-cyan-950/40 hover:text-cyan-300 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)] active:scale-95'
                    : 'bg-slate-950 text-slate-700 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>TRƯỚC</span>
              </button>

              <button
                disabled={activeSectorIndex >= sectorsSorted.length - 1}
                onClick={() =>
                  handleSelectSectorIndex(
                    Math.min(sectorsSorted.length - 1, activeSectorIndex + 1)
                  )
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center space-x-1 border border-slate-800 transition-all ${
                  activeSectorIndex < sectorsSorted.length - 1
                    ? 'bg-slate-900/90 text-cyan-400 border-cyan-500/30 hover:bg-cyan-950/40 hover:text-cyan-300 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)] active:scale-95'
                    : 'bg-slate-950 text-slate-700 cursor-not-allowed opacity-40'
                }`}
              >
                <span>TIẾP</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cybernetic Blade Rack Chassis with Horizontal Scroll Snap */}
          <div className="relative group/rack">
            {/* Ambient sliding indicators for desktop scroll assistance */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#090E17] to-transparent pointer-events-none z-20 opacity-0 group-hover/rack:opacity-100 transition-opacity" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#090E17] to-transparent pointer-events-none z-20 opacity-0 group-hover/rack:opacity-100 transition-opacity" />

            <div 
              id="scamguard-blade-rack"
              className="flex overflow-x-auto gap-3 pb-3 pt-1 px-1 scroll-smooth snap-x scrollbar-none"
              style={{
                scrollbarWidth: 'none',
              }}
            >
              {sectorsSorted.map((sec, idx) => {
                const isSelected = activeSectorIndex === idx;
                const unlocked = isSectorUnlocked(idx);
                const secCompleted = sec.nodes.filter((n) =>
                  completedNodeIds.includes(n.id)
                ).length;
                const isFinished = secCompleted === sec.nodes.length;
                const pct = sec.nodes.length > 0 ? (secCompleted / sec.nodes.length) * 100 : 0;
                const tabTheme =
                  SECTOR_ENVIRONMENT_THEMES[sec.sectorNumber] || SECTOR_ENVIRONMENT_THEMES[1];
                const failureRate = calculateSectorFailureRate(sec.id, analyticsData);

                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      if (unlocked) {
                        handleSelectSectorIndex(idx);
                      }
                    }}
                    disabled={!unlocked}
                    className={`flex-shrink-0 w-[155px] p-3 rounded-2xl border transition-all duration-300 relative font-mono text-left flex flex-col justify-between snap-center select-none overflow-hidden ${
                      isSelected
                        ? 'bg-[#0f1d30]/90 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4),inset_0_0_12px_rgba(6,182,212,0.2)] scale-[1.03] z-10'
                        : unlocked
                        ? 'bg-slate-950/80 border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:bg-slate-900/60 shadow-md cursor-pointer'
                        : 'bg-slate-950/20 border-slate-900/40 text-slate-600 opacity-50 cursor-not-allowed'
                    }`}
                    title={`${sec.title} - ${sec.biomeName}`}
                  >
                    {/* Glowing Accent Bar on Left edge of the Blade */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${
                        isSelected ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]' : unlocked ? 'bg-slate-800' : 'bg-slate-950'
                      }`}
                      style={isSelected ? { backgroundColor: tabTheme.accentHex, boxShadow: `0 0 8px ${tabTheme.accentHex}` } : undefined}
                    />

                    {/* Laser scanning shimmer wave on selection */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
                    )}

                    {/* Micro telemetry line at the bottom */}
                    {isSelected && (
                      <div className="absolute bottom-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                    )}

                    <div className="pl-1 w-full">
                      <div className="flex items-center justify-between w-full mb-2.5">
                        <span className={`text-[8px] font-black tracking-widest ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                          BLADE_{sec.sectorNumber.toString().padStart(2, '0')}
                        </span>

                        {/* Circular Telemetry gauge */}
                        <div className="flex items-center justify-center flex-shrink-0">
                          {isFinished ? (
                            <span className="text-amber-400 text-[10px] animate-pulse">★</span>
                          ) : unlocked ? (
                            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                              <circle cx="10" cy="10" r="7.5" className="stroke-slate-800/80" strokeWidth="2" fill="transparent" />
                              <circle
                                cx="10"
                                cy="10"
                                r="7.5"
                                className="transition-all duration-500"
                                style={{ stroke: tabTheme.accentHex }}
                                strokeWidth="2"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 7.5}
                                strokeDashoffset={2 * Math.PI * 7.5 * (1 - pct / 100)}
                              />
                            </svg>
                          ) : (
                            <Lock className="w-2.5 h-2.5 text-slate-700" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 min-w-0 mt-1">
                        <div className={`p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 ${
                          isSelected ? 'bg-cyan-950/60 border border-cyan-500/30' : 'bg-slate-900/40'
                        }`}>
                          <span className={`scale-95 block transition-transform ${isSelected ? 'animate-pulse' : ''}`}>{tabTheme.icon}</span>
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <span className="text-[10px] font-extrabold uppercase truncate tracking-wide text-white">
                            Khu {sec.sectorNumber}
                          </span>
                          <span className="text-[7px] text-slate-500 font-mono uppercase tracking-widest truncate">
                            {unlocked ? `${pct.toFixed(0)}% SECURED` : 'SYS_LOCKED'}
                          </span>
                          <span className="text-[7.5px] text-rose-400 font-mono font-bold mt-0.5 whitespace-nowrap">
                            💥 LỖI: {failureRate.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Interactive Cyberpunk Timeline Scroller Indicator below */}
            <div className="mt-2.5 flex items-center justify-center space-x-1.5 px-4 py-1.5 bg-slate-950/60 rounded-xl border border-slate-900 w-fit mx-auto shadow-inner">
              <span className="text-[7px] font-mono font-black text-slate-500 uppercase tracking-widest">CABINET DECK</span>
              <div className="h-1.5 w-32 bg-slate-900 rounded-full relative overflow-hidden flex items-center p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  style={{ 
                    width: '8%',
                    marginLeft: `${(activeSectorIndex / (sectorsSorted.length - 1)) * 92}%` 
                  }}
                />
              </div>
              <span className="text-[8px] font-mono font-bold text-cyan-400">
                {(activeSectorIndex + 1).toString().padStart(2, '0')}/{sectorsSorted.length.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIVE SECTOR TACTICAL BRIEFING DOSSIER */}
        <div
          className={`p-5 sm:p-6 rounded-2xl bg-[#05080e]/95 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-4 transition-all duration-500 mb-6 sm:mb-8 ${
            ageMode === 'senior' ? 'ring-2 ring-amber-500 bg-[#282620]/30' : 'ring-1 ring-cyan-500/10'
          }`}
        >
          {/* Cyber Dossier HUD Tech Lines decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 h-[1px] bg-gradient-to-r from-transparent to-cyan-400" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-950 bg-cyan-400 px-2.5 py-0.5 rounded shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                  PHÂN KHU CHIẾN THUẬT: {currentSector.sectorNumber.toString().padStart(2, '0')} // {sectorsSorted.length}
                </span>
                <span
                  className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-900/60"
                >
                  DANGER: {envTheme.threatLevel.split(':')[1] || envTheme.threatLevel}
                </span>
                <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/40 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{currentSector.nodes.length} TRẠM BẢM MẬT</span>
                </span>
              </div>
              <h3 className={`font-black text-slate-100 mt-2 font-mono tracking-tight ${ageMode === 'senior' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
                {ageMode === 'teen' ? `🎒 Học Cùng Cú: ${currentSector.title}` : currentSector.title}
              </h3>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl self-start sm:self-auto shadow-md">
              <Target className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div>
                <span className="text-[8px] uppercase font-mono font-black text-slate-400 block">
                  TIẾN TRÌNH KHU VỰC
                </span>
                <span className="text-xs font-mono font-black text-cyan-300">
                  {sectorCompletedNodes.length} / {currentSector.nodes.length} Trạm ({sectorProgressPercent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 relative z-10 pt-3 border-t border-slate-800/80">
            <p className={`text-slate-300 leading-relaxed ${ageMode === 'senior' ? 'text-base sm:text-lg font-bold' : 'text-xs sm:text-sm font-medium'}`}>
              <strong className="text-cyan-400 font-mono text-[9px] tracking-widest uppercase block sm:inline mr-1.5">[CHỈ THỊ NHIỆM VỤ]</strong>
              {currentSector.subtitle}
            </p>
            <p className={`text-slate-400 leading-relaxed ${ageMode === 'senior' ? 'text-base sm:text-lg font-semibold' : 'text-xs font-normal'}`}>
              <strong className="text-slate-500 font-mono text-[9px] tracking-widest uppercase block sm:inline mr-1.5">[SỐ LIỆU TÌNH BÁO SCAM]</strong>
              {envTheme.simulationDossier}
            </p>

            {/* Real-time prioritization telemetry explaining exactly why this sector is ranked here */}
            <div className="p-3.5 rounded-2xl bg-rose-950/15 border border-rose-500/20 flex flex-col space-y-1.5 mt-3 animate-fade-in">
              <span className="text-[9px] font-mono font-black text-rose-400 tracking-widest uppercase block">
                🚨 ĐĂC ĐIỂM ƯU TIÊN HUẤN LUYỆN THỜI GIAN THỰC (REAL-TIME TRAIN AI CORES)
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25">
                  ĐỘ ƯU TIÊN: HẠNG {activeSectorIndex + 1} / {sectorsSorted.length} (RỦI RO CAO)
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25">
                  TỶ LỆ LỖI KHẢO SÁT ViSEF: {calculateSectorFailureRate(currentSector.id, analyticsData).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-1">
                {getSectorFailureReason(currentSector.id)}
              </p>
            </div>
          </div>
        </div>

        {/* OPERATIONS HOLOGRAPHIC ROADMAP FIELD */}
        <div className="relative max-w-3xl mx-auto bg-[#070b13] rounded-2xl border border-slate-800 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] overflow-hidden pt-[55px] pb-[155px]">
          
          {/* Cyber Grid Lines backdrop */}
          <div className="absolute inset-0 cyber-grid-blueprint opacity-40 pointer-events-none" />

          {/* Dynamic Vector/Laser lines background */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-cyan-500/10 animate-ping pointer-events-none" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border border-cyan-500/10 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
          </div>

          {/* Glowing laser background radar sweep effect */}
          <div className="absolute top-12 left-12 w-28 h-28 opacity-25 border border-dashed border-cyan-500/20 rounded-full flex items-center justify-center pointer-events-none select-none">
            <div className="w-full h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent radar-sweep-hand" />
          </div>

          <div className="absolute top-4 right-4 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-[8px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-[0_0_8px_rgba(6,182,212,0.2)] z-20 pointer-events-none">
            ☣️ MATRIX_LINK_ONLINE
          </div>

          <div className="absolute top-28 left-16 opacity-40 text-cyan-400/80 font-mono text-[8px] pointer-events-none hidden md:block">
            ▶ INITIATING CAMPAIGN TUNNEL
          </div>

          <div className="absolute bottom-28 right-8 opacity-40 text-rose-400/80 font-mono text-[8px] pointer-events-none hidden md:block">
            ⚡ WARN: BOSS TERMINAL DETECTED AHEAD
          </div>

          {/* SVG Connection Conduits styled as Glowing Energy Lines */}
          <div className="absolute inset-0 pointer-events-none flex justify-center">
            <svg
              className="w-full h-full"
              viewBox={`0 0 400 ${currentSector.nodes.length * 150 + 60}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {currentSector.nodes.slice(1).map((node, i) => {
                const prevNode = currentSector.nodes[i];
                const prevStatus = getNodeStatus(prevNode, i);
                const currentStatus = getNodeStatus(node, i + 1);

                const prevX = 200 + getHorizontalOffset(i);
                const prevY = 55 + i * 150;
                const x = 200 + getHorizontalOffset(i + 1);
                const y = 55 + (i + 1) * 150;

                const midY = (prevY + y) / 2;
                const controlOffset = (i % 2 === 0 ? 15 : -15);
                const pathD = `M ${prevX} ${prevY} C ${prevX + controlOffset} ${midY}, ${x - controlOffset} ${midY}, ${x} ${y}`;

                const isCompletedSegment = currentStatus === 'completed';
                const isActiveSegment = (prevStatus === 'completed' || prevStatus === 'active') && currentStatus === 'active';

                let glowColor = envTheme.accentHex;
                let strokeColor = '#1e293b'; // locked color (dark slate conduit sleeve)
                let flowClass = '';

                if (isCompletedSegment) {
                  strokeColor = envTheme.accentHex;
                  flowClass = 'cyber-conduit-flow-completed';
                } else if (isActiveSegment) {
                  strokeColor = '#475569';
                  flowClass = 'cyber-conduit-flow-active';
                }

                return (
                  <g key={`cyber-path-${i}`}>
                    {/* Shadow outline backing for futuristic depth */}
                    {(isCompletedSegment || isActiveSegment) && (
                      <path
                        d={pathD}
                        stroke="#000"
                        strokeWidth="7"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                    )}

                    {/* Wide glowing halo aura */}
                    {(isCompletedSegment || isActiveSegment) && (
                      <path
                        d={pathD}
                        stroke={glowColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        opacity={isCompletedSegment ? "0.2" : "0.08"}
                        className="transition-all duration-500"
                      />
                    )}

                    {/* Base physical cable tube sleeve */}
                    <path
                      d={pathD}
                      stroke={strokeColor}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      opacity={isCompletedSegment ? "1" : "0.4"}
                      className="transition-all duration-300"
                    />

                    {/* Animated energy pulses floating inside conduit */}
                    {(isCompletedSegment || isActiveSegment) && (
                      <path
                        d={pathD}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.9"
                        className={flowClass}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Stepping Stone Nodes with Holographic Rotating Rings visual treatment */}
          <div className="relative z-10">
            {currentSector.nodes.map((node, nIdx) => {
              const status = getNodeStatus(node, nIdx);
              const offsetXPercent = (getHorizontalOffset(nIdx) / 400) * 100;

              return (
                <div
                  key={node.id}
                  className="relative w-full h-[150px]"
                  style={{
                    left: `${offsetXPercent}%`,
                  }}
                >
                  {/* Absolutely centered at the top of this node wrapper slot */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                  {/* Floating CyberGuard Mascot atop the active station */}
                  {status === 'active' && (
                    <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-14 h-14 select-none drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-float">
                      <MascotOwl size="sm" variant="avatar" className="scale-115" />
                    </div>
                  )}

                  {/* Holographic Pulse Beacon Rings */}
                  <div className="relative flex items-center justify-center">
                    {status === 'active' && (
                      <>
                        <div
                          className="absolute -inset-6 rounded-full border border-cyan-400/30 tech-ring-cw pointer-events-none opacity-40"
                          style={{ borderColor: `${envTheme.accentHex}40` }}
                        />
                        <div
                          className="absolute -inset-4 rounded-full border border-dashed pointer-events-none opacity-60 animate-ping"
                          style={{ borderColor: envTheme.accentHex, animationDuration: '3s' }}
                        />
                        <div
                          className="absolute -inset-2 rounded-full border border-dotted tech-ring-ccw pointer-events-none opacity-50"
                          style={{ borderColor: `${envTheme.accentHex}60` }}
                        />
                      </>
                    )}

                    {status === 'completed' && (
                      <div
                        className="absolute -inset-4 rounded-full border border-emerald-500/20 bg-emerald-950/10 pointer-events-none animate-pulse"
                        style={{ animationDuration: '4s' }}
                      />
                    )}

                    {/* The Interactive Glowing Node Terminal Button */}
                    <button
                      id={`campaign-node-${node.id}`}
                      onClick={() => handleLaunchNode(node)}
                      className={`rounded-full flex items-center justify-center transition-all transform duration-300 cursor-pointer select-none relative z-10 border-2 ${
                        node.kind === 'boss'
                          ? status === 'completed'
                            ? 'w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-950 to-yellow-900 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-108'
                            : status === 'active'
                            ? 'w-20 h-20 sm:w-22 sm:h-22 bg-gradient-to-tr from-rose-950 to-red-900 border-rose-500 text-rose-200 shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:scale-108 animate-bounce-subtle'
                            : 'w-16 h-16 sm:w-18 sm:h-18 bg-slate-900/80 border-slate-800 text-slate-500 opacity-50'
                          : node.kind === 'chest'
                          ? status === 'completed'
                            ? 'w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-tr from-emerald-950 to-teal-900 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-108'
                            : status === 'active'
                            ? 'w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-tr from-purple-950 to-violet-900 border-purple-500 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-108 animate-bounce-subtle'
                            : 'w-16 h-16 sm:w-18 sm:h-18 bg-slate-900/80 border-slate-800 text-slate-500 opacity-50'
                          : status === 'completed'
                          ? 'w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-tr from-teal-950 to-cyan-900 border-teal-500 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:scale-108'
                          : status === 'active'
                          ? node.kind === 'reflex'
                            ? 'w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-950 to-yellow-900 border-amber-500 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-108 animate-bounce-subtle'
                            : 'w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-tr from-[#132238] to-[#1c385c] border-cyan-500 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-108 animate-bounce-subtle'
                          : 'w-16 h-16 sm:w-18 sm:h-18 bg-slate-950/90 border-slate-900 text-slate-600 opacity-60'
                      }`}
                      style={status === 'active' ? { borderColor: envTheme.accentHex } : undefined}
                    >
                      {status === 'completed' && (
                        <div className="flex flex-col items-center">
                          <span className="text-xl sm:text-2xl">{node.kind === 'boss' ? '🏆' : node.kind === 'chest' ? '🎁' : node.icon}</span>
                          {node.kind !== 'chest' && (
                            <div className="flex items-center space-x-0.5 mt-0.5">
                              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            </div>
                          )}
                        </div>
                      )}

                      {status === 'active' && (
                        <div className="flex flex-col items-center">
                          <span className="text-xl sm:text-2xl animate-pulse">{node.icon}</span>
                          <span className="text-[7px] font-black uppercase font-mono tracking-widest bg-black/80 text-white px-1.5 py-0.5 rounded-full mt-1 border border-slate-800">
                            {node.kind === 'boss'
                              ? 'BOSS'
                              : node.kind === 'reflex'
                              ? 'RAPID'
                              : node.kind === 'chest'
                              ? 'VAULT'
                              : 'SEC'}
                          </span>
                        </div>
                      )}

                      {status === 'locked' && (
                        <div className="flex flex-col items-center">
                          {node.kind === 'boss' ? (
                            <>
                              <span className="text-xl opacity-35">💀</span>
                              <div className="flex items-center space-x-0.5 mt-0.5 bg-black/60 px-1 py-0.5 rounded border border-slate-900">
                                <Lock className="w-2 h-2 text-slate-500" />
                                <span className="text-[6px] font-bold text-slate-500 font-mono">BOSS</span>
                              </div>
                            </>
                          ) : node.kind === 'chest' ? (
                            <>
                              <span className="text-xl opacity-35">📦</span>
                              <div className="flex items-center space-x-0.5 mt-0.5 bg-black/60 px-1 py-0.5 rounded border border-slate-900">
                                <Lock className="w-2 h-2 text-slate-500" />
                                <span className="text-[6px] font-bold text-slate-500 font-mono">BOX</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-slate-600 opacity-70" />
                              <span className="text-[7px] font-mono font-bold text-slate-600 mt-0.5">
                                UNIT {(nIdx + 1).toString().padStart(2, '0')}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </button>

                    {/* Custom Sketched Tactical Stamp Badge for Completion status */}
                    {status === 'completed' && (
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs shadow-md border border-slate-950 z-20 animate-fade-in">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* HIGH-TECH TERMINAL BRIEFING MODULAR INTERACTIVE BOX */}
                  <div
                    onClick={() => handleLaunchNode(node)}
                    className={`mt-3 w-[170px] sm:w-[195px] px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-md z-20 hover:scale-103 active:scale-97 text-center flex flex-col items-center relative overflow-hidden ${
                      status === 'completed'
                        ? 'bg-[#061c16]/95 text-emerald-300 border-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
                        : status === 'active'
                        ? node.kind === 'boss'
                          ? 'bg-[#290912]/95 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                          : node.kind === 'reflex'
                          ? 'bg-[#211604]/95 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : node.kind === 'chest'
                          ? 'bg-[#180a2b]/95 text-purple-300 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-[#091b2c]/95 text-cyan-300 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-[#0c121e]/80 text-slate-500 border-slate-900 shadow-[1px_1px_4px_rgba(0,0,0,0.4)] opacity-70'
                    }`}
                    style={status === 'active' ? { borderColor: envTheme.accentHex } : undefined}
                  >
                    {/* Tiny grid backdrop inside info card */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none" />

                    <div className="flex items-center justify-between w-full mb-1 text-[7px] font-mono font-black uppercase tracking-widest relative z-10">
                      <span className={status === 'active' ? 'text-cyan-400' : 'text-slate-500'}>
                        {node.kind === 'boss'
                          ? '⚔️ BOSS_TERMINAL'
                          : node.kind === 'reflex'
                          ? '⚡ RAPID_RESPONSE'
                          : node.kind === 'chest'
                          ? '🎁 SUPPLY_VAULT'
                          : `🛰️ STN_NODE_${(nIdx + 1).toString().padStart(2, '0')}`}
                      </span>
                      <span className="text-emerald-400">+{node.xpReward} XP</span>
                    </div>

                    <span className="text-[11px] font-bold line-clamp-2 leading-tight text-slate-200 text-center px-0.5 font-mono tracking-tight relative z-10">
                      {node.title}
                    </span>

                    {/* Integrated Dynamic Status stamp */}
                    <div className="mt-2 flex items-center justify-center relative z-10">
                      {status === 'completed' ? (
                        <span className="text-[7px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center space-x-1 font-mono uppercase tracking-widest">
                          <Check className="w-2 h-2" />
                          <span>SECURED</span>
                        </span>
                      ) : status === 'active' ? (
                        <span className="text-[7px] font-black uppercase tracking-widest bg-cyan-500 text-slate-950 px-2.5 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.4)] animate-pulse flex items-center space-x-1 font-mono border border-cyan-400">
                          <Play className="w-2 h-2 fill-slate-950 animate-ping" />
                          <span>INITIALIZE</span>
                        </span>
                      ) : (
                        <span className="text-[7px] font-bold text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-900 flex items-center space-x-1 font-mono uppercase tracking-widest">
                          <Lock className="w-2 h-2 text-slate-500" />
                          <span>LOCKED</span>
                        </span>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER SWITCHER (SỔ TAY GHI CHÉP FOOTER) */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            {isCurrentSectorFinished ? (
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hoàn thành xuất sắc Khu Vực {currentSector.sectorNumber}! Tốt lắm!</span>
              </span>
            ) : (
              <span>Vượt hết {currentSector.nodes.length} trạm vẽ tay để đạt Chứng Chỉ Thải Độc Mạng.</span>
            )}
          </div>

          {activeSectorIndex < sectorsSorted.length - 1 ? (
            <button
              onClick={() => handleSelectSectorIndex(activeSectorIndex + 1)}
              className="px-6 py-3 text-xs sm:text-sm font-mono font-black border border-cyan-500/30 bg-cyan-500 text-slate-950 rounded-xl hover:bg-cyan-400 flex items-center space-x-2 cursor-pointer w-full sm:w-auto justify-center transition-all active:translate-y-0.5"
            >
              <span>Lật Sang Khu Vực {activeSectorIndex + 2}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 shadow-[2px_2px_0px_#000]">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Cậu Đã Vươn Tới Khu Vực Tối Cao!</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. RUNNER MODALS */}
      {/* 3.1 Lesson Runner */}
      {activeLessonNode && activeLessonNode.lessonData && (
        <DuolingoLessonRunner
          lesson={activeLessonNode.lessonData}
          unit={{
            id: currentSector.id,
            unitNumber: currentSector.sectorNumber,
            title: currentSector.title,
            objective: currentSector.subtitle,
            themeColor: {
              bg: currentSector.themeColor.bg,
              border: currentSector.themeColor.border,
              glow: currentSector.themeColor.glow,
              text: currentSector.themeColor.text,
              gradient: 'from-cyan-600 to-blue-700',
              button: 'bg-cyan-500 hover:bg-cyan-400 border-b-4 border-cyan-700 text-slate-950',
            },
            lessons: currentSector.nodes
              .filter((n) => n.lessonData)
              .map((n) => n.lessonData!),
          }}
          isOpen={true}
          onClose={() => setActiveLessonNode(null)}
          onCompleteLesson={(lessonId, earnedXp, shieldBadge) => {
            markNodeComplete(activeLessonNode.id, earnedXp);
          }}
        />
      )}

      {/* 3.2 Boss Battle Runner */}
      {activeBossNode && (
        <BossBattleRunner
          boss={activeBossNode}
          isOpen={true}
          onClose={() => setActiveBossNode(null)}
          onVictory={(bossId, earnedXp, trophyName) => {
            const node = currentSector.nodes.find((n) => n.bossData?.id === bossId);
            if (node) {
              markNodeComplete(node.id, earnedXp);
            }
          }}
        />
      )}

      {/* 3.3 Speed Reflex Runner */}
      {activeReflexNode && (
        <SpeedReflexRunner
          challenge={activeReflexNode}
          isOpen={true}
          onClose={() => setActiveReflexNode(null)}
          onComplete={(challengeId, earnedXp, badgeName) => {
            const node = currentSector.nodes.find(
              (n) => n.reflexData?.id === challengeId
            );
            if (node) {
              markNodeComplete(node.id, earnedXp);
            }
          }}
        />
      )}

      {/* 3.4 Supply Chest Modal */}
      {activeChestNode && (
        <SupplyChestModal
          chest={activeChestNode}
          isOpen={true}
          onClose={() => setActiveChestNode(null)}
          onClaim={(chestId, earnedXp, artifactName) => {
            const node = currentSector.nodes.find((n) => n.chestData?.id === chestId);
            if (node) {
              markNodeComplete(node.id, earnedXp);
            }
          }}
        />
      )}

      {/* 3.5 Dedicated Station Briefing Modal (Works cleanly on all screens) */}
      {briefingNode && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-5 animate-scale-up relative">
            <button
              onClick={() => setBriefingNode(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Đóng bảng thông tin"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3.5 pr-8">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-md">
                {briefingNode.icon}
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800 inline-block">
                  {briefingNode.kind === 'boss'
                    ? 'Trận Đấu Trùm'
                    : briefingNode.kind === 'reflex'
                    ? 'Minigame Phản Xạ'
                    : briefingNode.kind === 'chest'
                    ? 'Rương Cổ Vật'
                    : 'Trạm Phòng Thủ'}{' '}
                  • Khu Vực {currentSector.sectorNumber}
                </span>
                <h3 className="text-lg font-black text-white mt-1 leading-snug">
                  {briefingNode.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              {briefingNode.shortDesc}
            </p>

            <div className="flex items-center justify-between text-xs bg-cyan-950/40 border border-cyan-800/60 p-3 rounded-2xl text-cyan-300 font-bold">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Phần Thưởng Trạm:</span>
              </span>
              <span className="text-amber-400 font-black">+{briefingNode.xpReward} XP</span>
            </div>

            {getNodeStatus(briefingNode, briefingNode.nodeIndex) === 'locked' ? (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center space-x-2.5">
                <Lock className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>Bạn cần hoàn thành các trạm trước trong lộ trình để mở khóa trạm này!</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  const nodeToLaunch = briefingNode;
                  setBriefingNode(null);
                  handleLaunchNode(nodeToLaunch);
                }}
                className="btn-tactile btn-tactile-cyan w-full py-3 text-sm font-black flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>
                  {getNodeStatus(briefingNode, briefingNode.nodeIndex) === 'completed'
                    ? 'Chơi Lại / Ôn Tập'
                    : briefingNode.kind === 'boss'
                    ? 'Khiêu Chiến Trùm Ngay'
                    : briefingNode.kind === 'reflex'
                    ? 'Bắt Đầu Quét 25s'
                    : briefingNode.kind === 'chest'
                    ? 'Mở Rương Ngay'
                    : 'Bắt Đầu Trạm Này'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
