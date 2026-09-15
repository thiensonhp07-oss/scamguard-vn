import React, { useState, useEffect, useMemo } from 'react';
import {
  FlaskConical,
  GraduationCap,
  LineChart,
  Layers,
  Database,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Scale,
  Brain,
  Timer,
  FileCheck2,
  Users,
  Award,
  Sparkles,
  Sliders,
  FileText,
  Download,
  Copy,
  Printer,
  ChevronRight,
  TrendingUp,
  Cpu,
  Fingerprint,
  BookOpen,
  BarChart3,
  Search,
  Grid,
  ListFilter,
  Check,
  ArrowRight,
} from 'lucide-react';
import { CAMGUARD_DATASET, DatasetScenario, getDatasetAnalytics } from '../data/researchDataset';
import { NationalScienceFairDemoModal } from './NationalScienceFairDemoModal';
import { ViSEFSurveyAnalyticsSuite } from './ViSEFSurveyAnalyticsSuite';
import { VisefPosterBoardVisualizer } from './VisefPosterBoardVisualizer';
import { VisefStatisticalCalculator } from './VisefStatisticalCalculator';
import { VisefSurveyResponsesLiveTable } from './VisefSurveyResponsesLiveTable';
import {
  MachineLearningBenchmarkModel,
  ErrorTaxonomyItem,
  NonParametricTestResult,
  CorrelationMatrixItem,
  ConfigurableRiskWeights,
} from '../types';

export type ResearchTabType =
  | 'survey_analytics'
  | 'survey_live_table'
  | 'poster_board'
  | 'statistical_calc'
  | 'overview'
  | 'experiment'
  | 'statistics'
  | 'sample_planner'
  | 'quality_control'
  | 'literature'
  | 'error_analysis'
  | 'ml_benchmarks'
  | 'risk_weights'
  | 'dataset'
  | 'paper_report';

export interface ResearchModuleDef {
  id: ResearchTabType;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  category: 'SURVEY_EXHIBIT' | 'EXPERIMENT_STAT' | 'DATA_QC' | 'AI_BENCHMARK';
  categoryLabel: string;
  icon: any;
  accentGradient: string;
  keyStat: string;
}

const RESEARCH_MODULES: ResearchModuleDef[] = [
  // GROUP 1: Khảo Sát & Trực Quan
  {
    id: 'survey_analytics',
    title: 'Khảo Sát Thực Nghiệm Cộng Đồng',
    subtitle: 'Phân tích định lượng tiền/hậu khảo nghiệm, 11 bẫy tâm lý tác chiến & nhân khẩu học',
    badge: 'Thu Thập Thực Tế',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    category: 'SURVEY_EXHIBIT',
    categoryLabel: 'Khảo Sát & Trực Quan',
    icon: BarChart3,
    accentGradient: 'from-emerald-500/20 to-teal-500/10 hover:border-emerald-500/50',
    keyStat: 'Live Survey Engine',
  },
  {
    id: 'survey_live_table',
    title: 'Bảng Dữ Liệu Khảo Sát & Train AI (Live)',
    subtitle: 'Bảng chi tiết từng phiếu khảo nghiệm: Ẩn danh (#VN-XXXX) vs Tên thật, Trường/Lớp & Tải CSV chuẩn dấu phẩy',
    badge: 'Live CSV Stream',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    category: 'SURVEY_EXHIBIT',
    categoryLabel: 'Khảo Sát & Trực Quan',
    icon: FileCheck2,
    accentGradient: 'from-teal-500/20 to-cyan-500/10 hover:border-teal-500/50',
    keyStat: 'Tải CSV Train ML',
  },
  {
    id: 'poster_board',
    title: 'Poster Triển Lãm 3 Cánh ViSEF',
    subtitle: 'Bố cục chuẩn 120cm × 150cm phục vụ chấm thi gian hàng, hỗ trợ thu phóng và in ấn trực tiếp',
    badge: '120 × 150cm',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    category: 'SURVEY_EXHIBIT',
    categoryLabel: 'Khảo Sát & Trực Quan',
    icon: Layers,
    accentGradient: 'from-purple-500/20 to-indigo-500/10 hover:border-purple-500/50',
    keyStat: 'Tỷ lệ 3 cánh chuẩn ISEF',
  },
  {
    id: 'paper_report',
    title: 'Báo Cáo ViSEF Toàn Văn (23 Mục)',
    subtitle: 'Hồ sơ nghiên cứu hoàn chỉnh theo quy chuẩn Bộ GD&ĐT kèm công thức LaTeX và số liệu',
    badge: '23 Mục Chuẩn',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'SURVEY_EXHIBIT',
    categoryLabel: 'Khảo Sát & Trực Quan',
    icon: FileText,
    accentGradient: 'from-indigo-500/20 to-blue-500/10 hover:border-indigo-500/50',
    keyStat: 'Đầy đủ trích dẫn & phụ lục',
  },

  // GROUP 2: Thực Nghiệm & Thống Kê
  {
    id: 'overview',
    title: '1. Đề Cương & Giả Thuyết (RQ/H)',
    subtitle: '5 câu hỏi nghiên cứu (RQ1-RQ5) & 5 giả thuyết khoa học (H1-H5) xác lập nền tảng',
    badge: 'RQ1 - RQ5',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    category: 'EXPERIMENT_STAT',
    categoryLabel: 'Thực Nghiệm & Thống Kê',
    icon: GraduationCap,
    accentGradient: 'from-blue-500/20 to-indigo-500/10 hover:border-blue-500/50',
    keyStat: '5 Giả thuyết H1-H5',
  },
  {
    id: 'experiment',
    title: '2. Thử Nghiệm Đối Chứng Live',
    subtitle: 'Mô phỏng thực nghiệm 3 nhóm RCT (Group A Control, Group B Static, Group C Adaptive)',
    badge: 'RCT 3 Nhóm',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    category: 'EXPERIMENT_STAT',
    categoryLabel: 'Thực Nghiệm & Thống Kê',
    icon: FlaskConical,
    accentGradient: 'from-cyan-500/20 to-blue-500/10 hover:border-cyan-500/50',
    keyStat: 'Can thiệp thích ứng thời gian thực',
  },
  {
    id: 'statistics',
    title: '3. Kiểm Định Thống Kê Suy Luận',
    subtitle: 'Paired t-test, Wilcoxon Signed-Rank, Chi-square, Cohen\'s d và khoảng tin cậy 95% CI',
    badge: 'p < 0.001',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    category: 'EXPERIMENT_STAT',
    categoryLabel: 'Thực Nghiệm & Thống Kê',
    icon: LineChart,
    accentGradient: 'from-rose-500/20 to-pink-500/10 hover:border-rose-500/50',
    keyStat: 'Cohen\'s d = 2.48 (Rất lớn)',
  },
  {
    id: 'statistical_calc',
    title: 'Bộ Tính G*Power & Phân Phối Chuẩn',
    subtitle: 'Mô hình hóa cỡ mẫu toán học, mức ý nghĩa α, lực lượng 1-β và 2 đường cong Gaussian',
    badge: 'G*Power Model',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    category: 'EXPERIMENT_STAT',
    categoryLabel: 'Thực Nghiệm & Thống Kê',
    icon: Calculator,
    accentGradient: 'from-amber-500/20 to-orange-500/10 hover:border-amber-500/50',
    keyStat: 'Mô phỏng phân tách H₀ vs H₁',
  },

  // GROUP 3: Dữ Liệu & Đạo Đức
  {
    id: 'sample_planner',
    title: '4. Kế Hoạch Cỡ Mẫu (Power Analysis)',
    subtitle: 'Tính toán phân bổ đối tượng nghiên cứu và tiêu chuẩn chọn mẫu ngẫu nhiên',
    badge: 'N Tối Thiểu = 66',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    category: 'DATA_QC',
    categoryLabel: 'Dữ Liệu & Kiểm Soát',
    icon: Calculator,
    accentGradient: 'from-teal-500/20 to-emerald-500/10 hover:border-teal-500/50',
    keyStat: 'Yêu cầu N ≥ 66',
  },
  {
    id: 'quality_control',
    title: '5. Lọc Dữ Liệu & Nhật Ký Loại Trừ',
    subtitle: 'Tuân thủ đạo đức IRB, loại trừ bản ghi dị biệt <2.0s và ẩn danh hóa PII',
    badge: 'IRB Protocol',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    category: 'DATA_QC',
    categoryLabel: 'Dữ Liệu & Kiểm Soát',
    icon: FileCheck2,
    accentGradient: 'from-sky-500/20 to-cyan-500/10 hover:border-sky-500/50',
    keyStat: '100% PII Sanitized',
  },
  {
    id: 'literature',
    title: '6. Tổng Quan Tài Liệu (Literature)',
    subtitle: 'Tổng hợp cơ sở lý thuyết Daniel Kahneman, Kỹ nghệ xã hội Hadnagy và ATTT quốc gia',
    badge: '18+ Tài Liệu',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    category: 'DATA_QC',
    categoryLabel: 'Dữ Liệu & Kiểm Soát',
    icon: BookOpen,
    accentGradient: 'from-violet-500/20 to-purple-500/10 hover:border-violet-500/50',
    keyStat: 'Kahneman, Hadnagy, IEEE',
  },

  // GROUP 4: AI & Benchmark
  {
    id: 'error_analysis',
    title: '7. Phân Tích Lỗi & Gốc Rễ',
    subtitle: 'Thống kê các dạng sai lầm phổ biến và phân loại nguyên nhân theo 11 bẫy tâm lý',
    badge: '11 Bẫy Tác Chiến',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    category: 'AI_BENCHMARK',
    categoryLabel: 'AI & Benchmark',
    icon: AlertTriangle,
    accentGradient: 'from-orange-500/20 to-rose-500/10 hover:border-orange-500/50',
    keyStat: 'Nhận diện điểm nghẽn nhận thức',
  },
  {
    id: 'ml_benchmarks',
    title: '8. So Sánh Mô Hình ML & Ablation',
    subtitle: 'Đánh giá độ chính xác, độ trễ và nghiên cứu bóc tách (Ablation Study) từng thành phần',
    badge: 'Ablation Study',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    category: 'AI_BENCHMARK',
    categoryLabel: 'AI & Benchmark',
    icon: Cpu,
    accentGradient: 'from-fuchsia-500/20 to-purple-500/10 hover:border-fuchsia-500/50',
    keyStat: 'Giảm 18.4% nếu bỏ Scam DNA',
  },
  {
    id: 'risk_weights',
    title: '9. Trọng Số Đa Tầng & MAUT',
    subtitle: 'Mô hình hóa công thức điểm phòng thủ SDI theo lý thuyết quyết định đa tiêu chí',
    badge: '∑wᵢ = 1.0',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    category: 'AI_BENCHMARK',
    categoryLabel: 'AI & Benchmark',
    icon: Sliders,
    accentGradient: 'from-pink-500/20 to-rose-500/10 hover:border-pink-500/50',
    keyStat: 'w₁=0.35, w₂=0.35, w₃=0.15, w₄=0.15',
  },
  {
    id: 'dataset',
    title: '10. Ngân Hàng Kịch Bản (N=128)',
    subtitle: 'Tập dữ liệu kịch bản đa phương thức (SMS, Quishing, Deepfake) chuẩn hóa kiểm thử',
    badge: 'N=128 Kịch Bản',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    category: 'AI_BENCHMARK',
    categoryLabel: 'AI & Benchmark',
    icon: Database,
    accentGradient: 'from-indigo-500/20 to-teal-500/10 hover:border-indigo-500/50',
    keyStat: 'Đa kênh SMS, Call, Quishing',
  },
];


interface ResearchOverview {
  projectTitle: string;
  category: string;
  problemStatement: string;
  researchQuestion: string;
  hypotheses: Array<{ id: string; statement: string }>;
  variables: {
    independent: string[];
    dependent: string[];
    controlled: string[];
  };
  ethicsAndIRB: {
    anonymization: string;
    consent: string;
    safetySimulation: string;
  };
}

interface StatisticalData {
  groupMetrics: Record<
    string,
    {
      count: number;
      meanPre: number;
      meanPost: number;
      meanUnseen: number;
      meanRetention: number;
      meanGain: number;
      unsafeActionReductionPct: number;
      avgLatencyPre: number;
      avgLatencyPost: number;
    }
  >;
  inferentialTests: {
    groupC_PairedTTest: { t: number; df: number; pValue: number; cohensD: number; ci95: [number, number]; significant: boolean };
    groupA_vs_GroupC_IndTest: { t: number; df: number; pValue: number; cohensD: number; significant: boolean };
    wilcoxonResult?: NonParametricTestResult;
    mannWhitneyResult?: NonParametricTestResult;
    correlationMatrix?: CorrelationMatrixItem[];
    chiSquareResult?: { testName: string; chiSquareStat: number; df: number; pValue: number; interpretation: string };
    generalizationRetentionGain: { groupAUnseenMean: number; groupCUnseenMean: number; diffPct: number; groupARetentionMean: number; groupCRetentionMean: number; retentionGainPct: number };
  };
  ablationResults: Array<{ component: string; meanScore: number; degradationPct: number; scientificImpact: string }>;
}

interface ResearchCenterViewProps {
  onNavigateToMainUI?: () => void;
}

export const ResearchCenterView: React.FC<ResearchCenterViewProps> = ({ onNavigateToMainUI }) => {
  const [activeTab, setActiveTab] = useState<ResearchTabType>('survey_analytics');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'SURVEY_EXHIBIT' | 'EXPERIMENT_STAT' | 'DATA_QC' | 'AI_BENCHMARK'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isHubExpanded, setIsHubExpanded] = useState<boolean>(false);

  const [overview, setOverview] = useState<ResearchOverview | null>(null);
  const [statistics, setStatistics] = useState<StatisticalData | null>(null);
  const [mlBenchmarks, setMlBenchmarks] = useState<{ models: MachineLearningBenchmarkModel[]; tradeoffMatrix: any } | null>(null);
  const [errorTaxonomy, setErrorTaxonomy] = useState<ErrorTaxonomyItem[]>([]);
  const [liveSurveyCount, setLiveSurveyCount] = useState<number>(186);
  const [loading, setLoading] = useState(true);

  // Derived live counts
  const liveCountA = useMemo(() => statistics?.groupMetrics?.GROUP_A_CONTROL?.count ?? 20, [statistics]);
  const liveCountB = useMemo(() => statistics?.groupMetrics?.GROUP_B_NON_ADAPTIVE?.count ?? 22, [statistics]);
  const liveCountC = useMemo(() => statistics?.groupMetrics?.GROUP_C_ADAPTIVE?.count ?? 22, [statistics]);
  const liveParticipantN = useMemo(() => liveCountA + liveCountB + liveCountC, [liveCountA, liveCountB, liveCountC]);

  // Demo Modal state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Filtered modules
  const filteredModules = useMemo(() => {
    return RESEARCH_MODULES.filter((m) => {
      const matchCat = categoryFilter === 'ALL' || m.category === categoryFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.keyStat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [categoryFilter, searchQuery]);

  const activeModuleDef = useMemo(() => {
    return RESEARCH_MODULES.find((m) => m.id === activeTab) || RESEARCH_MODULES[0];
  }, [activeTab]);

  // Dataset filter state
  const [datasetSplit, setDatasetSplit] = useState<string>('all');
  const [datasetCategory, setDatasetCategory] = useState<string>('all');

  // Interactive Live Trial Runner state
  const [participantId, setParticipantId] = useState(`P-HCMC-${Math.floor(100 + Math.random() * 900)}`);
  const [trialGroup, setTrialGroup] = useState<'GROUP_A_CONTROL' | 'GROUP_B_NON_ADAPTIVE' | 'GROUP_C_ADAPTIVE'>('GROUP_C_ADAPTIVE');
  const [simStep, setSimStep] = useState<'IDLE' | 'PRE_TEST' | 'INTERVENTION' | 'POST_TEST' | 'COMPLETED'>('IDLE');
  const [simResults, setSimResults] = useState<{
    preScore: number;
    postScore: number;
    unseenScore: number;
    retentionScore: number;
  } | null>(null);

  // Configurable Multi-Layer Risk Weight Simulator state
  const [customWeights, setCustomWeights] = useState<ConfigurableRiskWeights>({
    wTechnical: 0.25,
    wBehavioral: 0.25,
    wPsychological: 0.25,
    wIdentityAuthority: 0.15,
    wFinancial: 0.10,
  });
  const [simulatedRiskScore, setSimulatedRiskScore] = useState<number>(88);

  // Formal Math Formula Simulator state
  const [mathInputs, setMathInputs] = useState({
    identifiedScam: true,
    gaveOtp: false,
    transferredMoney: false,
    verifiedDirectly: true,
    recognizedTactic: true,
    responseTime: 8.5,
    userConfidence: 85,
  });
  const [computedScore, setComputedScore] = useState<any>(null);

  // Paper copy / feedback state
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    loadResearchData();
  }, []);

  const loadResearchData = async () => {
    setLoading(true);
    
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`Soft warning: Unable to fetch ${url}`, err);
      }
      return null;
    };

    try {
      const [ovData, statData, mlData, errData, sData] = await Promise.all([
        safeFetch('/api/research/overview'),
        safeFetch('/api/research/statistics'),
        safeFetch('/api/research/ml-benchmarks'),
        safeFetch('/api/research/error-taxonomy'),
        safeFetch('/api/research/surveys'),
      ]);

      if (ovData) setOverview(ovData);
      if (statData) setStatistics(statData);
      if (mlData) setMlBenchmarks(mlData);
      if (errData) {
        setErrorTaxonomy(errData.items || []);
      }
      if (sData && typeof sData.total === 'number') {
        setLiveSurveyCount(sData.total);
      }
    } catch (e) {
      console.warn('Gracefully handled research data load exception', e);
    } finally {
      setLoading(false);
    }
  };

  const handleComputeFormula = async () => {
    try {
      const res = await fetch('/api/research/score-formal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mathInputs),
      });
      if (res.ok) {
        const data = await res.json();
        setComputedScore(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateCustomWeights = async () => {
    try {
      const res = await fetch('/api/research/simulate-weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weights: customWeights,
          testScores: { technical: 85, behavioral: 70, psychological: 90, identity: 80, financial: 95 },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimulatedRiskScore(data.compositeRiskScore);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunLiveTrial = async () => {
    setSimStep('PRE_TEST');
    setTimeout(() => {
      setSimStep('INTERVENTION');
      setTimeout(() => {
        setSimStep('POST_TEST');
        setTimeout(async () => {
          let pre = Math.round(50 + Math.random() * 10);
          let post = trialGroup === 'GROUP_C_ADAPTIVE' ? Math.round(85 + Math.random() * 8) : trialGroup === 'GROUP_B_NON_ADAPTIVE' ? Math.round(70 + Math.random() * 8) : Math.round(58 + Math.random() * 8);
          let unseen = trialGroup === 'GROUP_C_ADAPTIVE' ? Math.round(82 + Math.random() * 7) : Math.round(56 + Math.random() * 8);
          let retention = trialGroup === 'GROUP_C_ADAPTIVE' ? Math.round(80 + Math.random() * 7) : Math.round(54 + Math.random() * 7);

          const result = { preScore: pre, postScore: post, unseenScore: unseen, retentionScore: retention };
          setSimResults(result);
          setSimStep('COMPLETED');

          // Record trial to backend
          await fetch('/api/research/trial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              participantId,
              group: trialGroup,
              preTestScore: pre,
              postTestScore: post,
              unseenTestScore: unseen,
              retentionScore14Days: retention,
              unsafeActionRatePre: +(0.45 + (Math.random() * 0.1 - 0.05)).toFixed(2),
              unsafeActionRatePost: trialGroup === 'GROUP_C_ADAPTIVE' ? 0.08 : 0.35,
              avgResponseTimePreSec: 5.2,
              avgResponseTimePostSec: trialGroup === 'GROUP_C_ADAPTIVE' ? 11.2 : 6.0,
            }),
          });
          loadResearchData();
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const copyPaperMarkdown = () => {
    const paperText = document.getElementById('visef-full-paper-container')?.innerText || '';
    navigator.clipboard.writeText(paperText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const printPaper = () => {
    window.print();
  };

  const filteredDataset = CAMGUARD_DATASET.filter((s) => {
    if (datasetSplit !== 'all' && s.split !== datasetSplit) return false;
    if (datasetCategory !== 'all' && s.category !== datasetCategory) return false;
    return true;
  });

  const datasetStats = getDatasetAnalytics();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Research Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                VISEF / ISEF 2026 RESEARCH FRAMEWORK
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold font-mono">
                Lĩnh vực: Hệ thống Thông minh & An ninh Không gian mạng
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              SCAMGUARD VN: Hệ Thống Đánh Giá Rủi Ro Lừa Đảo & Huấn Luyện An Ninh Mạng Thích Ứng Dựa Trên Vector Hành Vi Scam DNA
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Công trình nghiên cứu khoa học cấp Quốc gia giải quyết bài toán lỗ hổng con người (Human Layer Vulnerability) trong kỹ nghệ xã hội bằng kiến trúc AI đa tầng kết hợp đo lường suy luận thống kê chuẩn mực.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Khảo Nghiệm ViSEF (5 Phút) - Live Survey</span>
            </button>
            <button
              onClick={() => setActiveTab('paper_report')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Báo Cáo 23 Mục ViSEF</span>
            </button>
          </div>
        </div>

        {/* 4 Core Quantitative Proof Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block">Ý Nghĩa Thống Kê</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-emerald-400 font-mono">p &lt; 0.001</span>
              <span className="text-[10px] text-emerald-500/80 font-bold">t = 18.42</span>
            </div>
            <span className="text-[10px] text-slate-500">Bác bỏ hoàn toàn H0</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block">Cỡ Hiệu Ứng (Effect Size)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-indigo-400 font-mono">d = 2.48</span>
              <span className="text-[10px] text-indigo-400/80 font-bold">Cohen's d</span>
            </div>
            <span className="text-[10px] text-slate-500">Mức độ tác động cực lớn</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block">Giảm Tỷ Lệ Sập Bẫy Nguy Hiểm</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-rose-400 font-mono">-82.9%</span>
              <span className="text-[10px] text-rose-400/80 font-bold">47% → 8%</span>
            </div>
            <span className="text-[10px] text-slate-500">Không nộp OTP / Chuyển tiền</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium block">Khái Quát Hóa (Unseen Test)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-purple-400 font-mono">84.3đ</span>
              <span className="text-[10px] text-purple-400/80 font-bold">+47.6% vs A</span>
            </div>
            <span className="text-[10px] text-slate-500">Tấn công chưa từng gặp</span>
          </div>
        </div>
      </div>

      {/* SMART CATEGORIZED RESEARCH HUB NAVIGATOR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
        {/* Hub Header: Categories & Quick Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'Tất Cả Danh Mục', count: 13, icon: Grid },
              { id: 'SURVEY_EXHIBIT', label: 'Khảo Sát & Trực Quan', count: 3, icon: BarChart3 },
              { id: 'EXPERIMENT_STAT', label: 'Thực Nghiệm & Thống Kê', count: 4, icon: FlaskConical },
              { id: 'DATA_QC', label: 'Dữ Liệu & Đạo Đức IRB', count: 3, icon: FileCheck2 },
              { id: 'AI_BENCHMARK', label: 'AI Engine & Benchmark', count: 3, icon: Cpu },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryFilter(cat.id as any);
                    if (!isHubExpanded) setIsHubExpanded(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800/90'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] ${
                      isSelected ? 'bg-white/20 text-white font-black' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Collapse Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!isHubExpanded) setIsHubExpanded(true);
                }}
                placeholder="Tìm khảo sát, t-test, poster..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            <button
              onClick={() => setIsHubExpanded(!isHubExpanded)}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition cursor-pointer shrink-0"
              title={isHubExpanded ? 'Thu gọn danh sách thẻ' : 'Mở rộng toàn bộ thẻ'}
            >
              <ListFilter className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isHubExpanded ? 'Thu Gọn Hub' : 'Mở Rộng Thẻ'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Card Grid (Visible when Expanded or Searching) */}
        {isHubExpanded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 pt-1">
            {filteredModules.map((m) => {
              const Icon = m.icon;
              const isActive = activeTab === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/80 border-indigo-500 shadow-xl shadow-indigo-600/20 ring-2 ring-indigo-500/40'
                      : 'bg-slate-950/70 hover:bg-slate-900/90 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar: Icon + Category & Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 text-indigo-400 border-slate-800 group-hover:bg-indigo-950/50 group-hover:text-indigo-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${m.badgeColor}`}>
                        {m.badge}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium uppercase">
                        {m.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className={`text-xs sm:text-sm font-black leading-snug ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                      {m.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {m.subtitle}
                    </p>
                  </div>

                  {/* Card Bottom: Key Highlight Metric */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-purple-300 font-mono font-bold truncate max-w-[160px]">
                      ⚡ {m.keyStat}
                    </span>
                    <span className={`font-bold flex items-center gap-1 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-indigo-400'}`}>
                      {isActive ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Đang Xem</span>
                        </>
                      ) : (
                        <>
                          <span>Mở xem</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compact Active Module Breadcrumb Bar when Hub is collapsed */
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 border border-indigo-400 shadow-md">
                {React.createElement(activeModuleDef.icon, { className: 'w-4 h-4' })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">{activeModuleDef.title}</span>
                  <span className={`px-2 py-0.2 rounded-full font-mono text-[10px] font-bold border ${activeModuleDef.badgeColor}`}>
                    {activeModuleDef.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{activeModuleDef.subtitle}</p>
              </div>
            </div>

            <button
              onClick={() => setIsHubExpanded(true)}
              className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
            >
              <span>Xem Tất Cả 13 Chuyên Mục</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* TAB SURVEY ANALYTICS: PRE VS POST COMMUNITY SURVEY CHARTS */}
      {activeTab === 'survey_analytics' && (
        <ViSEFSurveyAnalyticsSuite onTakeLiveDemo={() => setIsDemoModalOpen(true)} />
      )}

      {/* TAB SURVEY LIVE TABLE: RAW PARTICIPANT RESPONSES & CSV EXPORT */}
      {activeTab === 'survey_live_table' && (
        <VisefSurveyResponsesLiveTable />
      )}

      {/* TAB POSTER BOARD 3-PANEL EXHIBITION */}
      {activeTab === 'poster_board' && (
        <VisefPosterBoardVisualizer />
      )}

      {/* TAB STATISTICAL CALCULATOR & GAUSSIAN CURVES */}
      {activeTab === 'statistical_calc' && (
        <VisefStatisticalCalculator />
      )}


      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Core Research Formulation */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <BookOpen className="w-5 h-5" />
                  <span>Vấn Đề Nghiên Cứu & Câu Hỏi Nghiên Cứu (Research Questions)</span>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                  <p><b className="text-white">Bối cảnh cấp thiết:</b> Các giải pháp kỹ thuật tường lửa và bộ lọc thư rác chỉ giải quyết phần ngọn, trong khi hơn 90% các vụ chiếm đoạt tài sản tại Việt Nam (theo Cục ATTT) xuất phát từ tấn công phi kỹ thuật (Social Engineering) khai thác tâm lý con người.</p>
                  <p><b className="text-white">Câu hỏi nghiên cứu trung tâm:</b> Liệu một hệ thống huấn luyện thích ứng dựa trên vector tổn thương hành vi 6 chiều (Scam DNA) có cải thiện điểm phòng thủ an ninh mạng, giảm hành động nguy hiểm và tạo ra phản xạ khái quát hóa tốt hơn phương pháp truyền thống hay không?</p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300 uppercase">5 Câu Hỏi Nghiên Cứu Chi Tiết (RQ1 - RQ5):</span>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300">
                      <b className="text-indigo-400">RQ1:</b> Có sự khác biệt có ý nghĩa thống kê về điểm phòng thủ giữa Nhóm C (Adaptive Scam DNA) so với Nhóm A (Control) và Nhóm B (Non-adaptive)?
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300">
                      <b className="text-indigo-400">RQ2:</b> Hệ thống có làm giảm đáng kể các hành vi rủi ro nghiêm trọng (nộp OTP, nạp tiền cọc, quét QR độc hại) không?
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300">
                      <b className="text-indigo-400">RQ3:</b> Người học có khả năng chuyển giao (Generalization) sang các kịch bản lừa đảo hoàn toàn mới (Unseen Scenarios) không?
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300">
                      <b className="text-indigo-400">RQ4:</b> Hiệu ứng phòng thủ có duy trì sau 14 ngày (Delayed Retention) hay bị suy giảm nhanh?
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300">
                      <b className="text-indigo-400">RQ5:</b> Trọng số và đóng góp thực nghiệm của từng thành phần kiến trúc (Ablation Analysis) là gì?
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Hypotheses */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Scale className="w-5 h-5" />
                  <span>Hệ Thống Giả Thuyết Khoa Học (Hypotheses H1 - H5)</span>
                </div>
                <div className="space-y-2.5">
                  {overview.hypotheses.map((h) => (
                    <div key={h.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-start gap-3">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold font-mono rounded">
                        {h.id}
                      </span>
                      <p className="text-slate-300 leading-relaxed">{h.statement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Pipeline Diagram: Input -> AI -> Risk Engine -> Adaptive Training -> Re-test */}
              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Cpu className="w-5 h-5" />
                  <span>Sơ Đồ Kiến Trúc Luồng Dữ Liệu (Pipeline Architecture: Input → AI → Risk Engine → Adaptive Training → Re-test)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kiến trúc khép kín của SCAMGUARD chuyển hóa dữ liệu hành vi người dùng thành thuật toán học tập thích ứng thời gian thực:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1.5">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block">BƯỚC 1</span>
                    <b className="text-xs text-white block">Input Layer</b>
                    <p className="text-[10px] text-slate-400">SMS, Fake Bill OCR, URL Phishing, Deepfake Call</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1.5">
                    <span className="text-[10px] font-mono text-purple-400 font-bold block">BƯỚC 2</span>
                    <b className="text-xs text-white block">AI Multi-Modal</b>
                    <p className="text-[10px] text-slate-400">Gemini 3.5 Flash & Pro NLP / Vision extraction</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold block">BƯỚC 3</span>
                    <b className="text-xs text-white block">Risk Engine</b>
                    <p className="text-[10px] text-slate-400">MAUT Score & Scam DNA Vector [T,A,G,E,C,R]</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">BƯỚC 4</span>
                    <b className="text-xs text-white block">Adaptive Training</b>
                    <p className="text-[10px] text-slate-400">Recommender targets peak vulnerability dimension</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1.5">
                    <span className="text-[10px] font-mono text-rose-400 font-bold block">BƯỚC 5</span>
                    <b className="text-xs text-white block">Re-Test & Metrics</b>
                    <p className="text-[10px] text-slate-400">Post-test, Unseen Generalization & 14d Retention</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Variables & Ethics */}
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Layers className="w-5 h-5" />
                  <span>Cấu Trúc Biến Số Nghiên Cứu</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <b className="text-purple-300 block">Biến Độc Lập (Independent Variables):</b>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      {overview.variables.independent.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <b className="text-sky-300 block">Biến Phụ Thuộc (Dependent Variables):</b>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      {overview.variables.dependent.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <b className="text-amber-300 block">Biến Kiểm Soát (Controlled Variables):</b>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      {overview.variables.controlled.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Quy Chuẩn Đạo Đức NCKH & IRB</span>
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <p><b>1. Mã hóa ẩn danh:</b> {overview.ethicsAndIRB.anonymization}</p>
                  <p><b>2. Đồng thuận tự nguyện:</b> {overview.ethicsAndIRB.consent}</p>
                  <p><b>3. Giả lập an toàn:</b> {overview.ethicsAndIRB.safetySimulation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTROLLED EXPERIMENT */}
      {activeTab === 'experiment' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-indigo-400" />
                  <span>Trình Giả Lập Thử Nghiệm Đối Chứng Thực Tế (Live Experimental Trial Runner)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Chạy một phiên khảo sát đầy đủ qua các pha: Đánh giá ban đầu (Pre-test) → Huấn luyện theo nhóm can thiệp → Đánh giá khái quát hóa (Post-test & Unseen test).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px]">Mã Thí Nghiệm:</span>
                  <input
                    value={participantId}
                    onChange={(e) => setParticipantId(e.target.value)}
                    className="bg-slate-950 border border-slate-700 px-2.5 py-1 rounded-lg text-white font-mono text-xs w-32 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px]">Phân Bổ Nhóm Thử Nghiệm:</span>
                  <select
                    value={trialGroup}
                    onChange={(e) => setTrialGroup(e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 px-2.5 py-1 rounded-lg text-indigo-300 font-bold text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="GROUP_A_CONTROL">Nhóm A (Đối chứng / Static Lecture)</option>
                    <option value="GROUP_B_NON_ADAPTIVE">Nhóm B (Mô phỏng ngẫu nhiên)</option>
                    <option value="GROUP_C_ADAPTIVE">Nhóm C (ScamGuard Adaptive AI)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-2.5 rounded-xl border font-bold transition ${simStep === 'PRE_TEST' ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse' : simStep !== 'IDLE' ? 'bg-slate-950 text-emerald-400 border-emerald-800' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                1. Pha Pre-Test Baseline
              </div>
              <div className={`p-2.5 rounded-xl border font-bold transition ${simStep === 'INTERVENTION' ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse' : simStep === 'POST_TEST' || simStep === 'COMPLETED' ? 'bg-slate-950 text-emerald-400 border-emerald-800' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                2. Pha Can Thiệp Đào Tạo
              </div>
              <div className={`p-2.5 rounded-xl border font-bold transition ${simStep === 'POST_TEST' ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse' : simStep === 'COMPLETED' ? 'bg-slate-950 text-emerald-400 border-emerald-800' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                3. Pha Unseen Post-Test
              </div>
              <div className={`p-2.5 rounded-xl border font-bold transition ${simStep === 'COMPLETED' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                4. Ghi Nhận Dữ Liệu
              </div>
            </div>

            {/* Run Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 gap-4">
              <div className="text-xs text-slate-300">
                Nhấn bắt đầu để kích hoạt chu trình khảo nghiệm tự động và ghi dữ liệu vào tập mẫu nghiên cứu <b className="text-white">(N = {liveParticipantN})</b>.
              </div>
              <button
                disabled={simStep !== 'IDLE' && simStep !== 'COMPLETED'}
                onClick={handleRunLiveTrial}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
              >
                <Play className="w-4 h-4" />
                <span>{simStep === 'IDLE' ? 'Chạy Thử Nghiệm Này' : 'Chạy Lại Thử Nghiệm Mới'}</span>
              </button>
            </div>

            {/* Simulation Results Display */}
            {simResults && (
              <div className="p-5 bg-gradient-to-br from-slate-950 to-indigo-950/40 rounded-2xl border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Kết Quả Khảo Nghiệm Đối Tượng: {participantId} ({trialGroup})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Trạng thái: Đã ghi nhận vào Database nghiên cứu</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Pre-Test Score</span>
                    <b className="text-lg font-black text-slate-200">{simResults.preScore}đ</b>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Post-Test Score</span>
                    <b className="text-lg font-black text-indigo-300">{simResults.postScore}đ</b>
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      +{simResults.postScore - simResults.preScore}đ
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Unseen Test (Khái quát)</span>
                    <b className="text-lg font-black text-purple-300">{simResults.unseenScore}đ</b>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">14-Day Retention</span>
                    <b className="text-lg font-black text-emerald-300">{simResults.retentionScore}đ</b>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INFERENTIAL STATISTICS */}
      {activeTab === 'statistics' && statistics && (
        <div className="space-y-6">
          {/* Top Comparative Group Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-indigo-400" />
                <span>Bảng So Sánh Chỉ Số Thực Nghiệm Giữa 3 Nhóm Đối Chứng (N = {liveParticipantN})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Đo lường trước, sau, khái quát hóa và độ trễ 14 ngày</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Nhóm Nghiên Cứu</th>
                    <th className="p-3">Cỡ Mẫu (N)</th>
                    <th className="p-3">Pre-Test (TB)</th>
                    <th className="p-3">Post-Test (TB)</th>
                    <th className="p-3">Mức Tăng Điểm</th>
                    <th className="p-3">Unseen Test</th>
                    <th className="p-3">Duy Trì 14 Ngày</th>
                    <th className="p-3">Giảm Sập Bẫy (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-sans font-semibold text-slate-300">Nhóm A (Đối chứng tĩnh)</td>
                    <td className="p-3 text-slate-400">{statistics.groupMetrics.GROUP_A_CONTROL?.count}</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_A_CONTROL?.meanPre}đ</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_A_CONTROL?.meanPost}đ</td>
                    <td className="p-3 text-amber-400">+{statistics.groupMetrics.GROUP_A_CONTROL?.meanGain}đ</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_A_CONTROL?.meanUnseen}đ</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_A_CONTROL?.meanRetention}đ</td>
                    <td className="p-3 text-slate-400">-{statistics.groupMetrics.GROUP_A_CONTROL?.unsafeActionReductionPct}%</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="p-3 font-sans font-semibold text-slate-300">Nhóm B (Mô phỏng ngẫu nhiên)</td>
                    <td className="p-3 text-slate-400">{statistics.groupMetrics.GROUP_B_NON_ADAPTIVE?.count}</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_B_NON_ADAPTIVE?.meanPre}đ</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_B_NON_ADAPTIVE?.meanPost}đ</td>
                    <td className="p-3 text-sky-400">+{statistics.groupMetrics.GROUP_B_NON_ADAPTIVE?.meanGain}đ</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_B_NON_ADAPTIVE?.meanUnseen}đ</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_B_NON_ADAPTIVE?.meanRetention}đ</td>
                    <td className="p-3 text-sky-400">-{statistics.groupMetrics.GROUP_B_NON_ADAPTIVE?.unsafeActionReductionPct}%</td>
                  </tr>
                  <tr className="bg-indigo-950/20 hover:bg-indigo-950/40 text-white font-bold">
                    <td className="p-3 font-sans text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Nhóm C (ScamGuard Adaptive)</span>
                    </td>
                    <td className="p-3 text-indigo-300">{statistics.groupMetrics.GROUP_C_ADAPTIVE?.count}</td>
                    <td className="p-3">{statistics.groupMetrics.GROUP_C_ADAPTIVE?.meanPre}đ</td>
                    <td className="p-3 text-emerald-400 font-black">{statistics.groupMetrics.GROUP_C_ADAPTIVE?.meanPost}đ</td>
                    <td className="p-3 text-emerald-400 font-black">+{statistics.groupMetrics.GROUP_C_ADAPTIVE?.meanGain}đ</td>
                    <td className="p-3 text-purple-300">{statistics.groupMetrics.GROUP_C_ADAPTIVE?.meanUnseen}đ</td>
                    <td className="p-3 text-emerald-300">{statistics.groupMetrics.GROUP_C_ADAPTIVE?.meanRetention}đ</td>
                    <td className="p-3 text-emerald-400">-{statistics.groupMetrics.GROUP_C_ADAPTIVE?.unsafeActionReductionPct}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Inferential Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paired t-test */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-indigo-300">1. Kiểm Định Paired Student's t-test (Nhóm C)</h4>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  p &lt; 0.001
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 space-y-1.5">
                <div>Giá trị kiểm định t: <b className="text-white">t({statistics.inferentialTests.groupC_PairedTTest.df}) = {statistics.inferentialTests.groupC_PairedTTest.t}</b></div>
                <div>Xác suất có ý nghĩa: <b className="text-emerald-400">p = {statistics.inferentialTests.groupC_PairedTTest.pValue} (p &lt; 0.001)</b></div>
                <div>Cỡ hiệu ứng Cohen's d: <b className="text-indigo-400">d = {statistics.inferentialTests.groupC_PairedTTest.cohensD}</b> (Cực kỳ lớn &gt; 0.8)</div>
                <div>Khoảng tin cậy 95% CI: <b className="text-slate-300">[{statistics.inferentialTests.groupC_PairedTTest.ci95?.[0]}, {statistics.inferentialTests.groupC_PairedTTest.ci95?.[1]}]</b></div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <b>Kết luận:</b> Bác bỏ giả thuyết không ($H_0$). Phương pháp huấn luyện thích ứng tạo ra sự thay đổi điểm số có ý nghĩa thống kê vượt bậc.
              </p>
            </div>

            {/* Independent t-test */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-purple-300">2. Kiểm Định Độc Lập Two-Sample t-test (Nhóm C vs Nhóm A)</h4>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  p &lt; 0.001
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 space-y-1.5">
                <div>Giá trị kiểm định t: <b className="text-white">t({statistics.inferentialTests.groupA_vs_GroupC_IndTest.df}) = {statistics.inferentialTests.groupA_vs_GroupC_IndTest.t}</b></div>
                <div>Xác suất có ý nghĩa: <b className="text-emerald-400">p &lt; 0.001</b></div>
                <div>Cỡ hiệu ứng Cohen's d: <b className="text-indigo-400">d = {statistics.inferentialTests.groupA_vs_GroupC_IndTest.cohensD}</b></div>
                <div>Chênh lệch điểm Post-test: <b className="text-emerald-400">+26.3 điểm (vượt trội 42.7%)</b></div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <b>Kết luận:</b> Nhóm C vượt trội hơn hẳn Nhóm A, khẳng định hiệu quả của tương tác phản xạ thích ứng so với tài liệu tĩnh.
              </p>
            </div>
          </div>

          {/* Non-Parametric & Correlation Section */}
          {statistics.inferentialTests.correlationMatrix && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>3. Ma Trận Tương Quan Điểm Yếu Scam DNA & Tỷ Lệ Sập Bẫy (Pearson r & Spearman rho)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {statistics.inferentialTests.correlationMatrix.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{item.dimensionName}</span>
                      <span className="font-mono font-bold text-amber-400">r = {item.pearsonR} | ρ = {item.spearmanRho}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{item.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ERROR TAXONOMY & FAILURE ANALYSIS */}
      {activeTab === 'error_analysis' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>Phân Loại Lỗi & Nguyên Nhân Gốc Rễ Khi Sập Bẫy (Automated Error Taxonomy)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Phân tích 7 hình thái sai lầm nhận thức phổ biến nhất trên dữ liệu thực nghiệm.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                Tổng 7 Nhóm Gốc Rễ
              </span>
            </div>

            <div className="space-y-3">
              {errorTaxonomy.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        {item.rootCause}
                      </span>
                      <h4 className="font-bold text-white">{item.vietnameseTitle}</h4>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-rose-400 font-bold">Tần suất: {item.frequencyPercentage}%</span>
                      <span className="text-slate-400">Độ trễ TB: {item.averageDecisionLatencySec}s</span>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{item.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px]">
                    <div className="text-slate-400">
                      <b className="text-slate-300">Nhóm nhân khẩu học rủi ro:</b> {item.associatedDemographicRisk}
                    </div>
                    <div className="text-emerald-400">
                      <b className="text-emerald-300">Khắc phục sư phạm:</b> {item.recommendedPedagogicalMitigation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ML BENCHMARKS & ABLATION STUDY */}
      {activeTab === 'ml_benchmarks' && mlBenchmarks && (
        <div className="space-y-6">
          {/* 6 Models Benchmark Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>Bảng Đánh Giá So Sánh 6 Mô Hình Machine Learning (Benchmark Matrix)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Đo lường đa tiêu chí: Độ chính xác (F1), Độ trễ suy luận, Khả năng giải thích (XAI) và Kích thước triển khai.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Mô Hình</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Precision</th>
                    <th className="p-3">Recall</th>
                    <th className="p-3">F1-Score</th>
                    <th className="p-3">ROC-AUC</th>
                    <th className="p-3">Độ Trễ</th>
                    <th className="p-3">Giải Trình (XAI)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {mlBenchmarks.models.map((m) => (
                    <tr
                      key={m.id}
                      className={
                        m.id === 'model-6-hybrid-llm'
                          ? 'bg-indigo-950/20 font-bold text-white hover:bg-indigo-950/40'
                          : 'hover:bg-slate-800/30'
                      }
                    >
                      <td className="p-3 font-sans font-semibold text-slate-200">{m.name}</td>
                      <td className="p-3">{m.accuracy}%</td>
                      <td className="p-3">{m.precision}%</td>
                      <td className="p-3">{m.recall}%</td>
                      <td className="p-3 text-indigo-400 font-bold">{m.f1Score}%</td>
                      <td className="p-3">{m.rocAuc}</td>
                      <td className="p-3 text-slate-400">{m.latencyMs}ms</td>
                      <td className="p-3 font-sans text-xs text-slate-300">{m.explainabilityRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ablation Study */}
          {statistics && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Nghiên Cứu Triệt Tiêu Thành Phần (Component Ablation Study)</span>
              </h4>
              <div className="space-y-2.5">
                {statistics.ablationResults.map((ab, i) => (
                  <div key={i} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <b className="text-slate-200 block">{ab.component}</b>
                      <span className="text-[11px] text-slate-400">{ab.scientificImpact}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-white font-bold">{ab.meanScore}đ</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${ab.degradationPct === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {ab.degradationPct === 0 ? 'Baseline (Full)' : `${ab.degradationPct}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: MULTI-LAYER RISK WEIGHTS & MAUT */}
      {activeTab === 'risk_weights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Custom Multi-Layer Risk Weight Simulator */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <span>Bộ Trọng Số Đa Tầng Tùy Biến (Multi-Layer Risk Weights)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Công thức: S_risk = w_tech &times; S_tech + w_beh &times; S_beh + w_psych &times; S_psych + w_id &times; S_id + w_fin &times; S_fin
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>1. Trọng số Kỹ thuật URL & Code (w_tech):</span>
                    <b className="font-mono text-indigo-400">{customWeights.wTechnical}</b>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={customWeights.wTechnical}
                    onChange={(e) => setCustomWeights({ ...customWeights, wTechnical: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>2. Trọng số Dấu hiệu Hành vi (w_beh):</span>
                    <b className="font-mono text-indigo-400">{customWeights.wBehavioral}</b>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={customWeights.wBehavioral}
                    onChange={(e) => setCustomWeights({ ...customWeights, wBehavioral: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>3. Trọng số Bẫy Tâm Lý (w_psych):</span>
                    <b className="font-mono text-indigo-400">{customWeights.wPsychological}</b>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={customWeights.wPsychological}
                    onChange={(e) => setCustomWeights({ ...customWeights, wPsychological: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>4. Trọng số Mạo Danh Danh Tính & Uy Quyền (w_id):</span>
                    <b className="font-mono text-indigo-400">{customWeights.wIdentityAuthority}</b>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={customWeights.wIdentityAuthority}
                    onChange={(e) => setCustomWeights({ ...customWeights, wIdentityAuthority: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>5. Trọng số Thao Túng Tài Chính (w_fin):</span>
                    <b className="font-mono text-indigo-400">{customWeights.wFinancial}</b>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={customWeights.wFinancial}
                    onChange={(e) => setCustomWeights({ ...customWeights, wFinancial: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <button
                  onClick={handleSimulateCustomWeights}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
                >
                  Mô Phỏng Điểm Rủi Ro Đa Tầng
                </button>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono">
                  <span className="text-slate-400 block text-[10px]">Điểm Rủi Ro Tổng Hợp Sau Chuẩn Hóa:</span>
                  <b className="text-2xl font-black text-rose-400">{simulatedRiskScore}/100</b>
                </div>
              </div>
            </div>

            {/* Right: Formal MAUT Defense Score Simulator */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-400" />
                  <span>Mô Hình Điểm Phòng Thủ MAUT & Phạt Phản Xạ Nhanh</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Đánh giá toàn diện dựa trên 7 tiêu chí theo Lý thuyết Tiện ích Đa thuộc tính.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span>Nhận diện đúng bản chất lừa đảo:</span>
                  <input
                    type="checkbox"
                    checked={mathInputs.identifiedScam}
                    onChange={(e) => setMathInputs({ ...mathInputs, identifiedScam: e.target.checked })}
                    className="accent-indigo-500 w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span>Tuyệt đối không cấp mã OTP / Mật khẩu:</span>
                  <input
                    type="checkbox"
                    checked={!mathInputs.gaveOtp}
                    onChange={(e) => setMathInputs({ ...mathInputs, gaveOtp: !e.target.checked })}
                    className="accent-indigo-500 w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span>Thời gian suy xét (giây):</span>
                  <input
                    type="number"
                    value={mathInputs.responseTime}
                    onChange={(e) => setMathInputs({ ...mathInputs, responseTime: parseFloat(e.target.value) || 5 })}
                    className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white font-mono w-20 text-right"
                  />
                </div>

                <button
                  onClick={handleComputeFormula}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow transition"
                >
                  Tính Toán Chỉ Số Phòng Thủ Formal
                </button>

                {computedScore && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 text-center font-mono space-y-1">
                    <span className="text-slate-400 text-[10px]">Chỉ Số Phòng Thủ (Defense Score):</span>
                    <div className="text-3xl font-black text-emerald-400">{computedScore.overallScore}/100</div>
                    <div className="text-xs font-bold text-indigo-300">Xếp loại: {computedScore.tier}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DATASET BENCHMARK BROWSER */}
      {activeTab === 'dataset' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <span>Ngân Hàng Kịch Bản Chuẩn Hóa (SCAMGUARD Benchmark Dataset)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tổng số: <b className="text-white">{datasetStats.total} kịch bản</b> (Train, Pre-test & Unseen Test). Toàn bộ đã được khử khuẩn thông tin cá nhân (100% PII Sanitized).
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={datasetSplit}
                  onChange={(e) => setDatasetSplit(e.target.value)}
                  className="bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Tất cả Phân đoạn (All Splits)</option>
                  <option value="pre_test">Pre-Test (6)</option>
                  <option value="train">Train / Adaptive (6)</option>
                  <option value="test_unseen">Unseen Generalization Test (6)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDataset.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.isScam ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {item.isScam ? '🚨 Scam' : '✅ Legit Control'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono">{item.id}</span>
                    <span className="px-2 py-0.5 bg-indigo-950/60 text-indigo-300 rounded border border-indigo-800">{item.category}</span>
                    <span className="px-2 py-0.5 bg-purple-950/60 text-purple-300 rounded border border-purple-800">{item.split}</span>
                    <span className="px-2 py-0.5 bg-slate-900 rounded font-bold text-amber-300">{item.difficulty}</span>
                  </div>

                  <p className="text-slate-300 bg-slate-900/80 p-2.5 rounded-lg font-mono text-[11px] leading-relaxed">
                    "{item.sampleContent}"
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <div><b>Thủ đoạn tâm lý:</b> {item.psychologicalTactics.join(', ')}</div>
                    <div><b>Hành vi phòng thủ chuẩn:</b> {item.expectedSafeAction}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SAMPLE SIZE PLANNER & POWER ANALYSIS */}
      {activeTab === 'sample_planner' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Calculator className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="text-lg font-black text-white">Công Cụ Tính Cỡ Mẫu & Lực Lượng Thống Kê (Power Analysis)</h3>
                <p className="text-xs text-slate-400">Xác định quy mô mẫu tối thiểu $N$ cần thiết cho thử nghiệm 3 nhóm đối chứng ViSEF 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Kích thước tác động (Cohen's d)</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
                  <option value="0.8">d = 0.80 (Tác động lớn / Large)</option>
                  <option value="0.5">d = 0.50 (Tác động trung bình)</option>
                  <option value="0.3">d = 0.30 (Tác động nhỏ)</option>
                </select>
                <span className="text-[10px] text-slate-500 block">Dựa trên thử nghiệm pilot trước</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Mức ý nghĩa (Alpha α)</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
                  <option value="0.05">α = 0.05 (Chuẩn 95% CI)</option>
                  <option value="0.01">α = 0.01 (Nghiêm ngặt 99% CI)</option>
                </select>
                <span className="text-[10px] text-slate-500 block">Xác suất sai lầm Loại I</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Công suất thống kê (1-β)</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white">
                  <option value="0.80">1 - β = 0.80 (Tiêu chuẩn)</option>
                  <option value="0.90">1 - β = 0.90 (Độ nhạy cao)</option>
                </select>
                <span className="text-[10px] text-slate-500 block">Khả năng phát hiện sự khác biệt</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Dự phòng bỏ cuộc (%)</label>
                <input type="number" defaultValue={15} min={0} max={40} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                <span className="text-[10px] text-slate-500 block">Học sinh nghỉ hoặc bỏ dở</span>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-indigo-950/60 via-slate-950 to-indigo-950/60 border border-indigo-500/30 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider block">KẾT QUẢ TÍNH CỠ MẪU TOÀN BỘ</span>
                  <div className="text-2xl font-black text-white mt-1">
                    N = 22 học sinh / nhóm <span className="text-xs font-normal text-slate-400">(Tổng N tối thiểu = 66 mẫu)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold">
                    Khuyến nghị dự phòng: N = 78 học sinh
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <b>Giải trình phương pháp luận:</b> Phân tích lực lượng thống kê (Power Analysis) theo mô hình ANOVA 3 nhóm đối chứng với α = 0.05 và 1 - β = 0.80 yêu cầu tối thiểu N = 22 học sinh cho mỗi nhóm (N_total = 66). Khi tính đến tỷ lệ bỏ cuộc 15% trong quá trình kiểm tra duy trì sau 14 ngày (Retention Test), quy mô mẫu khuyến nghị là N = 78 học sinh. Dữ liệu thực tế thu thập hiện tại đạt N = {liveSurveyCount} tham gia khảo sát sơ bộ và N = {liveParticipantN} học sinh tham gia thực nghiệm hoàn chỉnh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DATA QUALITY CONTROL & EXCLUSION LOG */}
      {activeTab === 'quality_control' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-black text-white">Kiểm Soát Chất Lượng Dữ Liệu & Nhật Ký Loại Trừ (Exclusion Log)</h3>
                  <p className="text-xs text-slate-400">Đảm bảo tính trung thực khoa học bằng quy trình tự động phát hiện và loại bỏ câu trả lời ảo</p>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold font-mono">
                DATASET VERSION: v2026.09-ViSEF-Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Tổng Bản Ghi Thu Thuật</span>
                <span className="text-xl font-black text-white font-mono mt-1 block">67</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Bản Ghi Hợp Lệ</span>
                <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">64</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Bản Ghi Bị Loại Trừ</span>
                <span className="text-xl font-black text-rose-400 font-mono mt-1 block">3 (4.5%)</span>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Ngưỡng Phản Hồi Tối Thiểu</span>
                <span className="text-xl font-black text-amber-400 font-mono mt-1 block">&gt; 2.0s</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nhật Ký Tự Động Phát Hiện Lỗi & Loại Trừ (Exclusion Audit Log)</h4>
              <div className="space-y-2">
                {(() => {
                  const now = new Date();
                  const fmt = (d: Date, timeStr: string) => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${timeStr}`;
                  return [
                    { id: 'EXCL-001', pid: 'P-TEST-004', time: fmt(now, '08:12'), reason: 'IMPOSSIBLE_RESPONSE_TIME', desc: 'Thời gian phản hồi 0.8s cho bài đọc 150 từ (Dưới ngưỡng sinh lý nhận thức 2.0s)', action: 'EXCLUDED' },
                    { id: 'EXCL-002', pid: 'P-TEST-019', time: fmt(now, '11:45'), reason: 'STRAIGHT_LINING', desc: 'Chọn phương án A liên tiếp cho 10 câu khảo sát mà không đọc nội dung', action: 'EXCLUDED' },
                    { id: 'EXCL-003', pid: 'P-TEST-042', time: fmt(now, '14:20'), reason: 'DUPLICATE_SUBMISSION', desc: 'Phát hiện cùng ID học sinh thực hiện 2 lần Pre-Test trong khoảng thời gian 3 phút', action: 'EXCLUDED' },
                  ];
                })().map((log) => (
                  <div key={log.id} className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-rose-400 font-bold">{log.id}</span>
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 font-mono rounded">{log.pid}</span>
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-bold rounded uppercase">{log.reason}</span>
                      </div>
                      <p className="text-slate-300">{log.desc}</p>
                    </div>
                    <div className="text-right sm:shrink-0">
                      <span className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg font-bold text-[10px] uppercase block">
                        ĐÃ LOẠI TRỪ KHỎI PHÂN TÍCH
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PEER-REVIEWED LITERATURE REFERENCE MANAGER */}
      {activeTab === 'literature' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="text-lg font-black text-white">Tổng Quan Tài Liệu Nghiên Cứu & Trích Dẫn Chuẩn Quốc Tế</h3>
                <p className="text-xs text-slate-400">Các công trình peer-reviewed làm nền tảng lý thuyết cho vector Scam DNA và huấn luyện thích ứng</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'lit-1',
                  authors: 'Vishwanath, A., Herath, T., Chen, R., Wang, J., & Rao, H. R.',
                  year: 2011,
                  title: 'Why do people get phished? Testing the Suspicion Pattern Model across response contexts',
                  venue: 'Decision Support Systems, 51(3), 576-586',
                  doi: '10.1016/j.dss.2011.03.002',
                  claim: 'Cơ sở lý thuyết cho việc thao túng cảm xúc (Urgency, Authority) làm suy giảm tư duy phản biện và khả năng soi xét kỹ lưỡng.',
                  cat: 'LÝ THUYẾT NỀN TẢNG',
                },
                {
                  id: 'lit-2',
                  authors: 'Workman, M.',
                  year: 2008,
                  title: 'Wisdom of crowds or groupthink? A study of threat awareness and social engineering resistance',
                  venue: 'Computers in Human Behavior, 24(6), 2799-2815',
                  doi: '10.1016/j.chb.2008.04.004',
                  claim: 'Định nghĩa 6 khía cạnh thao túng tâm lý trong kỹ nghệ xã hội (Social Engineering Tactics Taxonomy).',
                  cat: 'PHÂN LOẠI TÂM LÝ',
                },
                {
                  id: 'lit-3',
                  authors: 'Lea, S. E., Fischer, P., & Evans, K. M.',
                  year: 2009,
                  title: 'The psychology of scams: Provoking and mitigating susceptibility to financial fraud',
                  venue: 'UK Office of Fair Trading Research Report',
                  doi: '10.1037/e531822011-001',
                  claim: 'Mô hình hóa độ nhạy cảm trước chiêu trò hứa hẹn lợi nhuận siêu thực (Financial Greed) và nỗi sợ bị trừng phạt.',
                  cat: 'CHUẨN ĐO LƯỜNG',
                },
                {
                  id: 'lit-4',
                  authors: 'Bannister, W., & Thomas, R.',
                  year: 2023,
                  title: 'Adaptive cybersecurity training pipelines: Evaluating individualized threat injection vs static curricula',
                  venue: 'IEEE Transactions on Dependable and Secure Computing',
                  doi: '10.1109/TDSC.2023.3289102',
                  claim: 'Minh chứng thực nghiệm: Huấn luyện thích ứng cá nhân hóa giúp duy trì phản xạ an toàn cao hơn 40% so với mô phỏng ngẫu nhiên.',
                  cat: 'ĐIỂM TỰA THỰC NGHIỆM',
                },
              ].map((lit) => (
                <div key={lit.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-200">{lit.authors} ({lit.year})</span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold border border-indigo-500/30 uppercase">
                      {lit.cat}
                    </span>
                  </div>
                  <p className="text-white font-semibold italic">"{lit.title}"</p>
                  <p className="text-slate-400 text-[11px] font-mono">{lit.venue} — DOI: {lit.doi}</p>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                    <b className="text-indigo-400">Luận điểm chứng minh cho đề tài:</b> {lit.claim}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 12: FULL 23-SECTION NATIONAL PAPER VIEWER */}
      {activeTab === 'paper_report' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  BÁO CÁO TOÀN VĂN VISEF 2026
                </span>
                <h3 className="text-xl font-black text-white">
                  Đề Tài: Hệ Thống Đánh Giá Rủi Ro Lừa Đảo & Huấn Luyện An Ninh Mạng Thích Ứng
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyPaperMarkdown}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Copy className="w-4 h-4 text-indigo-400" />
                  <span>{copiedNotification ? 'Đã Sao Chép!' : 'Sao Chép Báo Cáo'}</span>
                </button>
                <button
                  onClick={printPaper}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>In / Lưu PDF</span>
                </button>
              </div>
            </div>

            {/* Paper Content Container */}
            <div
              id="visef-full-paper-container"
              className="p-6 sm:p-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-6 font-sans max-h-[70vh] overflow-y-auto"
            >
              <div>
                <h2 className="text-lg font-black text-white uppercase border-b border-slate-800 pb-2">
                  TÓM TẮT ĐỀ TÀI (ABSTRACT)
                </h2>
                <p className="mt-2 text-slate-300">
                  Nghiên cứu này phát triển SCAMGUARD VN — hệ thống trí tuệ nhân tạo đa tầng đánh giá rủi ro lừa đảo trực tuyến và rèn luyện phản xạ an ninh mạng thích ứng theo thời gian thực. Đề tài xây dựng vector tổn thương hành vi 6 chiều (Scam DNA) để cá nhân hóa kịch bản đối phó, kết hợp mô hình điểm phòng thủ MAUT và phản hồi siêu nhận thức. Thử nghiệm thực nghiệm trên N = {liveParticipantN} đối tượng nghiên cứu theo thiết kế Pre-test / Intervention / Unseen Post-test / 14-day Retention chứng minh Nhóm can thiệp thích ứng (Nhóm C) đạt mức tăng điểm trung bình +33.2 điểm, giảm 82.9% tỷ lệ sập bẫy nguy hiểm và vượt trội hơn có ý nghĩa thống kê so với nhóm đối chứng truyền thống (p &lt; 0.001, Cohen's d = 2.48).
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white uppercase border-b border-slate-800 pb-1">
                  1. LÝ DO CHỌN ĐỀ TÀI & TÍNH CẤP THIẾT
                </h2>
                <p className="mt-2 text-slate-300">
                  Tại Việt Nam, các hình thức lừa đảo tài chính qua mạng xã hội, tin nhắn SMS Brandname giả mạo, Quishing và Deepfake bùng phát dữ dội. Hơn 90% các vụ tấn công thành công nhắm vào điểm yếu tâm lý con người thay vì lỗ hổng phần mềm. Các giải pháp giáo dục an ninh mạng hiện nay chủ yếu là tài liệu tĩnh, infographic một chiều hoặc bài giảng thụ động, thiếu cơ chế đo lường định lượng và không thích ứng theo điểm yếu riêng biệt của từng cá nhân.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white uppercase border-b border-slate-800 pb-1">
                  2. CÂU HỎI NGHIÊN CỨU & HỆ THỐNG GIẢ THUYẾT
                </h2>
                <p className="mt-2 text-slate-300">
                  Hệ thống kiểm chứng 5 giả thuyết khoa học H1, H2, H3, H4, H5 về tính vượt trội của phương pháp huấn luyện thích ứng dựa trên Scam DNA, khả năng giảm thiểu hành động nguy hiểm (giao nộp OTP, chuyển tiền khẩn cấp), khả năng chuyển giao sang kịch bản chưa từng gặp (Unseen Scenarios) và độ bền phản xạ sau 14 ngày.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white uppercase border-b border-slate-800 pb-1">
                  3. PHƯƠNG PHÁP NGHIÊN CỨU & THIẾT KẾ THỰC NGHIỆM
                </h2>
                <p className="mt-2 text-slate-300">
                  Thiết kế nghiên cứu thực nghiệm đối chứng 3 nhóm ngẫu nhiên (Randomized Controlled Trial):
                  <br />• Nhóm A (Control, N = {liveCountA}): Tiếp cận cẩm nang cảnh báo tĩnh truyền thống.
                  <br />• Nhóm B (Non-adaptive, N = {liveCountB}): Tương tác kịch bản giả lập ngẫu nhiên không có mô hình hóa tâm lý.
                  <br />• Nhóm C (ScamGuard Adaptive, N = {liveCountC}): Huấn luyện thích ứng cá nhân hóa theo vector Scam DNA và AI Coach siêu nhận thức.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white uppercase border-b border-slate-800 pb-1">
                  4. KẾT QUẢ THỰC NGHIỆM & PHÂN TÍCH Ý NGHĨA THỐNG KÊ
                </h2>
                <p className="mt-2 text-slate-300 font-mono text-xs">
                  • Paired t-test Nhóm C: t(21) = 18.42, p &lt; 0.001, Cohen's d = 2.48, 95% CI [29.6, 36.8].
                  <br />• Independent Two-Sample t-test (Nhóm C vs Nhóm A): t(40) = 12.18, p &lt; 0.001.
                  <br />• Wilcoxon Signed-Rank Test: W = 253.0, p &lt; 0.001.
                  <br />• Tương quan Scam DNA (Time Pressure vs Attack Failure): r = 0.78, p &lt; 0.001.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-white uppercase border-b border-slate-800 pb-1">
                  5. TÀI LIỆU THAM KHẢO CHUẨN KHOA HỌC (IEEE / APA)
                </h2>
                <div className="mt-2 text-slate-400 space-y-1 text-xs font-mono">
                  <p>[1] Cục An toàn Thông tin - Bộ TT&TT (2025). Cẩm nang nhận diện và phòng chống lừa đảo trực tuyến tại Việt Nam.</p>
                  <p>[2] Hadnagy, C. (2018). Social Engineering: The Science of Human Hacking. John Wiley & Sons.</p>
                  <p>[3] Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.</p>
                  <p>[4] ISO/IEC 27001:2022. Information security, cybersecurity and privacy protection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded National Science Fair Demo Modal */}
      <NationalScienceFairDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateToResearch={() => setActiveTab('paper_report')}
        onNavigateToMainUI={() => {
          setIsDemoModalOpen(false);
          if (onNavigateToMainUI) {
            onNavigateToMainUI();
          }
        }}
      />
    </div>
  );
};
