import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingDown,
  Phone,
  Volume2,
  Users,
  Shield,
  HelpCircle,
  Link,
  MessageSquare,
  AlertTriangle,
  QrCode,
  Search,
  Globe,
  Plus,
  Share2,
  Bell,
  CheckCircle2,
  UserCheck,
  Heart,
  FileText,
  Activity,
  ArrowRight,
  Flame,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  RefreshCw,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playAlertWarning } from '../utils/audioEffects';
import confetti from 'canvas-confetti';
import mascotShield from '../assets/images/mascot_shield_transparent.png';

interface DetectionAnalysisSuiteProps {
  userProfile?: any;
  onEarnXp?: (xp: number) => void;
}

// -------------------- MONEY TRACE INTERFACES & DATA --------------------
interface TraceNode {
  id: string;
  label: string;
  bank: string;
  amount: string;
  percentage: number;
  type: 'mule_1' | 'mule_2' | 'crypto' | 'otc' | 'origin';
  status: 'pending' | 'active' | 'completed';
  x: number;
  y: number;
  description: string;
}

// -------------------- SAVE MY LOVED ONE INTERFACES --------------------
interface DialogStep {
  id: string;
  grandmaMessage: string;
  options: {
    text: string;
    trustDelta: number; // Empathy/facts increase trust
    panicDelta: number; // Aggression increases panic
    xpReward: number;
    nextStepId: string | null; // null means end
    feedback: string;
  }[];
}

const GRANDMA_SCENARIOS = {
  investment: {
    title: 'Bà Nội sập bẫy "Đầu tư tài chính siêu lợi nhuận 30%"',
    initialTrust: 50,
    initialPanic: 30,
    steps: {
      start: {
        id: 'start',
        grandmaMessage: 'Con ơi! Có cô Mai giới thiệu gói đầu tư nông sản sạch được lời 30% một ngày, có bảo hiểm vốn nữa. Người ta hối bà nộp 50 triệu trước 11h trưa nay để kịp nhận khuyến mãi đại sứ vàng...',
        options: [
          {
            text: 'Bà khùng rồi! Lừa đảo trắng trợn thế mà cũng tin! Đừng chuyển tiền bậy bạ!',
            trustDelta: -25,
            panicDelta: 30,
            xpReward: 5,
            nextStepId: 'defensive',
            feedback: 'Bà nội cảm thấy bị xúc phạm và tổn thương lòng tự trọng. Bà nghĩ bạn cản đường làm giàu của bà.'
          },
          {
            text: 'Nội ơi, lãi suất cao bất thường vậy chắc chắn có rủi ro lớn. Nội gửi con xem thử trang web và số tài khoản nhận tiền nhé?',
            trustDelta: 20,
            panicDelta: -10,
            xpReward: 20,
            nextStepId: 'check_info',
            feedback: 'Nội thấy bạn nhỏ nhẹ, có thiện chí lắng nghe nên nội yên tâm gửi thông tin.'
          },
          {
            text: 'Khoan chuyển Nội ơi! Để con gọi video call ngay cho nội rồi hai bà cháu cùng xem nhé.',
            trustDelta: 15,
            panicDelta: 5,
            xpReward: 15,
            nextStepId: 'videocall_ask',
            feedback: 'Nội hơi bối rối nhưng đồng ý giữ liên lạc với bạn.'
          }
        ]
      },
      defensive: {
        id: 'defensive',
        grandmaMessage: 'Sao con lại mắng bà? Cô Mai hiền hậu lắm, gọi điện nói chuyện cả tuần nay chu đáo hơn cả con cháu. Người ta chụp cả giấy chứng nhận đăng ký kinh doanh có con dấu đỏ của Bộ Tài Chính đây này!',
        options: [
          {
            text: 'Giấy chứng nhận đó photoshop 2 phút là xong nội ơi. Nội gửi số tài khoản thụ hưởng con tra cứu chéo trên hệ thống chống lừa đảo xem sao nhé.',
            trustDelta: 15,
            panicDelta: -10,
            xpReward: 25,
            nextStepId: 'check_info',
            feedback: 'Nội bớt nóng giận, nhận ra lập luận khoa học của bạn có lý.'
          },
          {
            text: 'Con nói thật nội không tin thì tùy, sau này mất tiền ráng chịu đừng kêu cứu ai nhé!',
            trustDelta: -30,
            panicDelta: 40,
            xpReward: 0,
            nextStepId: 'lose_grandma',
            feedback: 'Nội cực kỳ tức giận và cúp máy để tự ý ra cây ATM chuyển khoản!'
          }
        ]
      },
      check_info: {
        id: 'check_info',
        grandmaMessage: 'Đây này con, trang web là "nongsan-shopee-global.xyz" và số tài khoản nhận tiền là tên cá nhân "NGUYEN VAN HOANG" ở ngân hàng khác, chứ không phải tên công ty Shopee. Người ta bảo tài khoản cá nhân của kế toán trưởng doanh nghiệp cho nhanh...',
        options: [
          {
            text: 'Nội ơi, không doanh nghiệp chính thống nào dùng STK cá nhân làm tài khoản gom vốn cả. Trang .xyz là tên miền lừa đảo giá rẻ 20k vừa tạo 3 ngày trước thôi!',
            trustDelta: 25,
            panicDelta: -15,
            xpReward: 30,
            nextStepId: 'win_grandma',
            feedback: 'Nội sững sờ khi biết tài khoản kế toán trưởng chỉ là tài khoản rác và trang web mới lập. Nội đã hoàn toàn tin bạn.'
          },
          {
            text: 'Cái này mờ ám quá, nội rút tiền gửi tiết kiệm ngân hàng truyền thống 6% thôi con dắt nội đi làm sổ mới nhé.',
            trustDelta: 15,
            panicDelta: -5,
            xpReward: 15,
            nextStepId: 'win_grandma',
            feedback: 'Nội đồng ý vì giải pháp thay thế của bạn an toàn và thiết thực.'
          }
        ]
      },
      videocall_ask: {
        id: 'videocall_ask',
        grandmaMessage: 'Bà gọi cho cô Mai bằng video thì cổ bảo camera phòng làm việc bị hỏng, chỉ gọi thoại được thôi. Rồi cổ bảo nếu bà cứ chần chừ hỏi con cháu thì suất ưu đãi 30% này sẽ chuyển cho người khác đấy.',
        options: [
          {
            text: 'Nội ơi, chiêu trò ép thời gian là đòn tâm lý điển hình của lừa đảo để nội không kịp suy nghĩ đấy. Việc hỏng camera thực chất là vì đối phương dùng Deepfake hoặc không dám lộ diện thật!',
            trustDelta: 20,
            panicDelta: -15,
            xpReward: 25,
            nextStepId: 'check_info',
            feedback: 'Nội bừng tỉnh và nhận ra điểm bất hợp lý của "cô Mai hiền hậu".'
          },
          {
            text: 'Nội cúp máy cô ta đi, con báo công an phường bắt bây giờ!',
            trustDelta: -10,
            panicDelta: 25,
            xpReward: 5,
            nextStepId: 'defensive',
            feedback: 'Nội cảm thấy sợ hãi và căng thẳng vì bạn hù dọa công an.'
          }
        ]
      },
      win_grandma: {
        id: 'win_grandma',
        grandmaMessage: 'Ôi may quá, nghe con giải thích bà mới thấy mình suýt mất cả gia tài tích cóp dưỡng già. Bà sẽ chặn số cô Mai này ngay lập tức. Cảm ơn cháu ngoan của bà nhiều lắm!',
        options: []
      },
      lose_grandma: {
        id: 'lose_grandma',
        grandmaMessage: 'Bà nội đã cắt đứt liên lạc, tự ý mang vàng đi bán và chuyển khoản 50 triệu đồng. Sau 1 giờ, cô Mai khóa tài khoản, rút tiền và biến mất hoàn toàn...',
        options: []
      }
    } as Record<string, DialogStep>
  }
};

export const DetectionAnalysisSuite: React.FC<DetectionAnalysisSuiteProps> = ({
  userProfile = { streakDays: 3, overallScore: 82 },
  onEarnXp = (_xp: number) => {}
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'money_trace' | 'voice_clone' | 'save_loved' | 'qr_scanner' | 'scam_score' | 'opinion' | 'heatmap' | 'blacklist' | 'news'
  >('money_trace');

  // -------------------- 1. MONEY TRACE STATES & ENGINE --------------------
  const [traceAmount, setTraceAmount] = useState<number>(100000000); // Default 100M VND
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [traceStep, setTraceStep] = useState<number>(0);
  const [traceNodes, setTraceNodes] = useState<TraceNode[]>([]);
  const [traceLog, setTraceLog] = useState<string[]>([]);
  const traceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initTraceNodes = (amount: number): TraceNode[] => {
    const vnd = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    return [
      { id: 'origin', label: 'Tài khoản nạn nhân', bank: 'VCB - Vietcombank', amount: vnd(amount), percentage: 100, type: 'origin', status: 'active', x: 10, y: 50, description: 'Bị thao túng tâm lý chuyển khoản khẩn cấp.' },
      { id: 'mule_1a', label: 'TK Gom loại A (Mule Tier 1)', bank: 'BIDV - Phạm Văn C.', amount: vnd(amount * 0.6), percentage: 60, type: 'mule_1', status: 'pending', x: 35, y: 25, description: 'TK rác thuê mướn sinh viên, lao động nghèo. Nhận tiền sau 5 giây.' },
      { id: 'mule_1b', label: 'TK Gom loại A (Mule Tier 1)', bank: 'MB - Nguyễn Thị H.', amount: vnd(amount * 0.4), percentage: 40, type: 'mule_1', status: 'pending', x: 35, y: 75, description: 'TK rác gom tầng 1, tự động chia nhỏ lệnh chuyển qua app API.' },
      { id: 'mule_2a', label: 'TK Tán nhỏ B1 (Mule Tier 2)', bank: 'TCB - Trần Quốc B.', amount: vnd(amount * 0.3), percentage: 30, type: 'mule_2', status: 'pending', x: 60, y: 15, description: 'Chia nhỏ dòng tiền để tránh hệ thống báo động đỏ của NH Nhà Nước.' },
      { id: 'mule_2b', label: 'TK Tán nhỏ B2 (Mule Tier 2)', bank: 'VTB - Đỗ Thị L.', amount: vnd(amount * 0.3), percentage: 30, type: 'mule_2', status: 'pending', x: 60, y: 38, description: 'Dòng tiền luân chuyển liên tục 24/7 qua cổng thanh toán trung gian.' },
      { id: 'mule_2c', label: 'TK Tán nhỏ B3 (Mule Tier 2)', bank: 'ACB - Lê Hoàng N.', amount: vnd(amount * 0.4), percentage: 40, type: 'mule_2', status: 'pending', x: 60, y: 75, description: 'Giao dịch chuyển tiền nhanh Napas hoàn tất trong 2 giây.' },
      { id: 'crypto', label: 'Sàn USDT P2P (Crypto Gate)', bank: 'Ví Binance / OKX', amount: vnd(amount * 0.8) + ' ~ ' + (amount * 0.8 / 25400).toFixed(1) + ' USDT', percentage: 80, type: 'crypto', status: 'pending', x: 80, y: 30, description: 'Mua tiền số USDT vô danh. Không thể thu hồi bằng lệnh phong tỏa ngân hàng.' },
      { id: 'otc', label: 'Rút tiền mặt (OTC Camp)', bank: 'Campuchia / Tam Giác Vàng', amount: vnd(amount * 0.2), percentage: 20, type: 'otc', status: 'pending', x: 82, y: 70, description: 'Rút tiền mặt trực tiếp tại các sòng bạc biên giới để xóa hoàn toàn dấu vết.' }
    ];
  };

  const startMoneyTraceSimulation = () => {
    if (isTracing) return;
    setIsTracing(true);
    setTraceStep(0);
    setTraceLog(['[00:00] Giao dịch chuyển khoản lừa đảo hoàn tất. Dòng tiền bắt đầu tẩu tán...']);
    setTraceNodes(initTraceNodes(traceAmount));
    playAlertWarning();

    let step = 0;
    if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);

    traceIntervalRef.current = setInterval(() => {
      step++;
      setTraceStep(step);
      if (step === 1) {
        setTraceNodes(prev => prev.map(n => n.id === 'origin' ? { ...n, status: 'completed' } : (n.type === 'mule_1' ? { ...n, status: 'active' } : n)));
        setTraceLog(prev => [...prev, `[00:05] Tiền cập bến Mule Tier 1 (BIDV, MB Bank). Hệ thống Smart-Routing chia nhỏ khoản tiền thành 2 nhánh.`]);
        playAlertWarning();
      } else if (step === 2) {
        setTraceNodes(prev => prev.map(n => n.type === 'mule_1' ? { ...n, status: 'completed' } : (n.type === 'mule_2' ? { ...n, status: 'active' } : n)));
        setTraceLog(prev => [...prev, `[00:15] Tiền phân rã sang 3 tài khoản Mule Tier 2 (Techcombank, Vietinbank, ACB). Lệnh chuyển khoản tự động không có độ trễ.`]);
        playAlertWarning();
      } else if (step === 3) {
        setTraceNodes(prev => prev.map(n => n.type === 'mule_2' ? { ...n, status: 'completed' } : (n.type === 'crypto' || n.type === 'otc' ? { ...n, status: 'active' } : n)));
        setTraceLog(prev => [...prev, `[00:45] CHẠM NGƯỠNG ĐỎ: 80% dòng tiền được quy đổi sang USDT qua tài khoản Binance vô danh. 20% được gom rút mặt tại sòng bài biên giới.`]);
        playAlertWarning();
      } else if (step === 4) {
        setTraceNodes(prev => prev.map(n => ({ ...n, status: 'completed' })));
        setTraceLog(prev => [
          ...prev,
          `[01:00] HOÀN TẤT TẨU TÁN: Tiền mặt được tẩy sạch. Ví crypto chuyển sâu vào máy trộn (Mixer). Cơ hội thu hồi tài sản: < 0.1%.`,
          `⚠️ KẾT LUẬN PHÁP Y: Sau 15 phút, mọi nỗ lực báo ngân hàng phong tỏa đều vô hiệu vì tiền đã thoát khỏi hệ thống thanh toán Việt Nam. Hãy phòng chống trước khi bị lừa!`
        ]);
        setIsTracing(false);
        if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);
        playSuccessChime();
        onEarnXp(15);
        confetti({ particleCount: 30, spread: 40 });
      }
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);
    };
  }, []);

  // -------------------- 2. AI VOICE CLONE STATES & DATA --------------------
  const [voiceFile, setVoiceFile] = useState<string | null>(null);
  const [selectedVoiceSample, setSelectedVoiceSample] = useState<number | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [voiceConfidence, setVoiceConfidence] = useState<number | null>(null);
  const [voiceAnalysisResult, setVoiceAnalysisResult] = useState<any | null>(null);
  const [voiceLoading, setVoiceLoading] = useState<boolean>(false);
  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const VOICE_SAMPLES = [
    { id: 1, title: '📞 Cuộc gọi "Tai nạn cấp cứu" - Giọng Con Trai', duration: '18s', text: 'Bố ơi! Con Nam đây... Con đang đi xe máy thì bị taxi đụng, gãy chân rồi. Bác sĩ bảo phải nộp tạm ứng gấp 20 triệu viện phí để mổ luôn không nhiễm trùng. Bố chuyển gấp cho tài khoản bác sĩ trưởng khoa Lê Văn Toàn này hộ con với...', scriptText: 'Bố ơi! Con Nam đây...', simulatedFeatures: { aiConfidence: 94, flatPitch: true, missingPauses: true, metallicNoise: true, reason: 'Giọng điệu đều tăm tắp, nhịp điệu phát âm cứng nhắc. Thiếu âm hít thở sâu đặc trưng khi đau đớn gãy chân. Nhiễu âm nền lặp lại theo chu kỳ (artifact vòng lặp Deepfake).' } },
    { id: 2, title: '⚖️ Cuộc gọi "Lệnh bắt giữ hình sự" - Giọng Viện Kiểm Sát', duration: '24s', text: 'Tôi là kiểm sát viên Nguyễn Hữu Trí thuộc Viện kiểm sát nhân dân tối cao. Hồ sơ số 992-KS của anh có dính líu đến đường dây rửa tiền và buôn ma túy của Trịnh Sướng. Yêu cầu anh giữ bí mật cuộc gọi này, truy cập trang web vks-chongtoipham.org để tải lệnh bảo lãnh...', scriptText: 'Tôi là kiểm sát viên...', simulatedFeatures: { aiConfidence: 98, flatPitch: true, missingPauses: false, metallicNoise: true, reason: 'Giọng chuẩn phòng thu nhưng tần số bị cắt gọt nhân tạo, không có âm thở tự nhiên. Levenshtein check phát hiện trang web lừa đảo vks-chongtoipham.org. Tốc độ nói của giọng đọc cực đều.' } },
    { id: 3, title: '👨‍✈️ Cuộc gọi "Biên lai phạt nguội" - Giọng Cảnh Sát Giao Thông', duration: '15s', text: 'Phòng cảnh sát giao thông Hà Nội thông báo, xe ô tô biển số 30A-992.81 của ông có 3 lỗi chạy quá tốc độ phạt nguội 15 triệu đồng. Yêu cầu nộp tiền phạt trực tiếp qua tài khoản kho bạc cá nhân này...', scriptText: 'Phòng cảnh sát giao thông...', simulatedFeatures: { aiConfidence: 12, flatPitch: false, missingPauses: false, metallicNoise: false, reason: 'Giọng nói tự nhiên, có tiếng ồn đường phố thực tế ở nền, có các từ đệm tự phát. Khả năng cao là người thật gọi lừa đảo kịch bản cũ chứ không phải giọng nhân tạo AI.' } }
  ];

  const handleSelectVoiceSample = (id: number) => {
    setSelectedVoiceSample(id);
    setIsPlayingVoice(false);
    setVoiceConfidence(null);
    setVoiceAnalysisResult(null);
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
  };

  const togglePlayVoiceSample = () => {
    if (isPlayingVoice) {
      setIsPlayingVoice(false);
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    } else {
      setIsPlayingVoice(true);
      // Simulate spectral analysis ending
      let seconds = 0;
      speechIntervalRef.current = setInterval(() => {
        seconds++;
        if (seconds >= 4) {
          setIsPlayingVoice(false);
          clearInterval(speechIntervalRef.current!);
        }
      }, 1000);
    }
  };

  const runVoiceCloneScan = () => {
    if (selectedVoiceSample === null) return;
    setVoiceLoading(true);
    setVoiceConfidence(null);
    setVoiceAnalysisResult(null);

    setTimeout(() => {
      const sample = VOICE_SAMPLES.find(s => s.id === selectedVoiceSample);
      if (sample) {
        setVoiceConfidence(sample.simulatedFeatures.aiConfidence);
        setVoiceAnalysisResult(sample.simulatedFeatures);
        playSuccessChime();
        onEarnXp(20);
        confetti({ particleCount: 20, spread: 50 });
      }
      setVoiceLoading(false);
    }, 2500);
  };

  // -------------------- 3. SAVE LOVED ONE STATES --------------------
  const [lovedScenario, setLovedScenario] = useState<any>(GRANDMA_SCENARIOS.investment);
  const [lovedStepId, setLovedStepId] = useState<string>('start');
  const [lovedTrust, setLovedTrust] = useState<number>(GRANDMA_SCENARIOS.investment.initialTrust);
  const [lovedPanic, setLovedPanic] = useState<number>(GRANDMA_SCENARIOS.investment.initialPanic);
  const [lovedFeedbacks, setLovedFeedbacks] = useState<string[]>([]);
  const [lovedHistory, setLovedHistory] = useState<{ sender: 'grandma' | 'player'; text: string }[]>([
    { sender: 'grandma', text: GRANDMA_SCENARIOS.investment.steps.start.grandmaMessage }
  ]);

  const handleChooseOption = (option: any) => {
    const nextStepId = option.nextStepId;
    const newTrust = Math.max(0, Math.min(100, lovedTrust + option.trustDelta));
    const newPanic = Math.max(0, Math.min(100, lovedPanic + option.panicDelta));

    setLovedTrust(newTrust);
    setLovedPanic(newPanic);
    setLovedFeedbacks(prev => [...prev, option.feedback]);
    setLovedHistory(prev => [
      ...prev,
      { sender: 'player', text: option.text }
    ]);

    onEarnXp(option.xpReward);

    if (nextStepId) {
      setLovedStepId(nextStepId);
      const nextStep = lovedScenario.steps[nextStepId];
      setTimeout(() => {
        setLovedHistory(prev => [
          ...prev,
          { sender: 'grandma', text: nextStep.grandmaMessage }
        ]);
        if (newTrust >= 80 && lovedPanic <= 20) {
          // Early trigger grandma saved
          setLovedStepId('win_grandma');
          setLovedHistory(prev => [
            ...prev,
            { sender: 'grandma', text: lovedScenario.steps.win_grandma.grandmaMessage }
          ]);
          playSuccessChime();
          onEarnXp(50);
          confetti({ particleCount: 50, spread: 80 });
        } else if (newTrust <= 15 || lovedPanic >= 80) {
          // Early trigger grandma lost
          setLovedStepId('lose_grandma');
          setLovedHistory(prev => [
            ...prev,
            { sender: 'grandma', text: lovedScenario.steps.lose_grandma.grandmaMessage }
          ]);
          playAlertWarning();
        }
      }, 1000);
    } else {
      // Finished scenario
      if (lovedStepId === 'win_grandma' || newTrust >= 60) {
        playSuccessChime();
        onEarnXp(40);
        confetti({ particleCount: 40, spread: 60 });
      } else {
        playAlertWarning();
      }
    }
  };

  const restartLovedOneGame = () => {
    setLovedStepId('start');
    setLovedTrust(GRANDMA_SCENARIOS.investment.initialTrust);
    setLovedPanic(GRANDMA_SCENARIOS.investment.initialPanic);
    setLovedFeedbacks([]);
    setLovedHistory([{ sender: 'grandma', text: GRANDMA_SCENARIOS.investment.steps.start.grandmaMessage }]);
  };

  // -------------------- 4. QR OVERLAP STATES --------------------
  const [qrLayerRevealed, setQrLayerRevealed] = useState<boolean>(false);
  const [qrFile, setQrFile] = useState<string | null>(null);
  const [qrSandboxResult, setQrSandboxResult] = useState<any | null>(null);
  const [qrAnalyzing, setQrAnalyzing] = useState<boolean>(false);

  const simulateQrScan = (fake: boolean) => {
    setQrAnalyzing(true);
    setQrSandboxResult(null);
    setTimeout(() => {
      if (fake) {
        setQrSandboxResult({
          isSafe: false,
          decodedUrl: 'https://viet-qr-highlands.online/pay/table12/invoice_payment',
          originalWhitelistedUrl: 'https://vietqr.vn/highlands-coffee/t12_bill',
          detectedTrick: 'Typosquatting & Redirect dán đè',
          threatLevel: 'CRITICAL',
          description: 'Mã QR này chứa nhãn dán đè tinh vi hướng tới trang web giả mạo ngân hàng nhằm đánh cắp thông tin thẻ tín dụng/OTP thanh toán.'
        });
        playAlertWarning();
      } else {
        setQrSandboxResult({
          isSafe: true,
          decodedUrl: 'https://vietqr.vn/highlands-coffee/t12_bill',
          originalWhitelistedUrl: 'https://vietqr.vn/highlands-coffee/t12_bill',
          detectedTrick: 'Không phát hiện dán đè',
          threatLevel: 'SAFE',
          description: 'Mã QR chính chủ, dẫn tới đúng cổng thanh toán điện tử Whitelist của VietQR.'
        });
        playSuccessChime();
        onEarnXp(15);
      }
      setQrAnalyzing(false);
    }, 1800);
  };

  // -------------------- 5. SCAM SCORE STATES --------------------
  const [scoreQuery, setScoreQuery] = useState<string>('');
  const [calculatedScore, setCalculatedScore] = useState<any | null>(null);
  const [scoreLoading, setScoreLoading] = useState<boolean>(false);

  const calculateScamScore = () => {
    if (!scoreQuery.trim()) return;
    setScoreLoading(true);
    setCalculatedScore(null);

    setTimeout(() => {
      const q = scoreQuery.toLowerCase().trim();
      let score = 20; // Safe base
      let details: string[] = [];
      let typosquatMatch = '';

      // Check typosquatting
      const trustedBrands = ['vietcombank', 'techcombank', 'shopee', 'vneid', 'mbbank', 'bidv', 'telegram'];
      trustedBrands.forEach(b => {
        if (q.includes(b) && q !== `${b}.com.vn` && q !== `${b}.com` && q !== `vneid.gov.vn`) {
          score += 40;
          typosquatMatch = b;
          details.push(`Phát hiện cấu trúc nhại thương hiệu lớn: "${b}"`);
        }
      });

      // Domain suffixes
      if (q.endsWith('.xyz') || q.endsWith('.online') || q.endsWith('.top') || q.endsWith('.vip') || q.endsWith('.cc') || q.endsWith('.club')) {
        score += 25;
        details.push('Sử dụng đuôi tên miền giá rẻ (.xyz, .online, .top) phổ biến cho scam');
      }

      // SSL check simulator
      if (!q.startsWith('https://')) {
        score += 15;
        details.push('Không bắt buộc giao thức bảo mật HTTPS / Không sử dụng chứng chỉ SSL mã hóa');
      }

      // WHOIS simulate
      const isNew = Math.random() > 0.3;
      if (isNew) {
        score += 10;
        details.push('Tên miền mới đăng ký dưới 30 ngày (Độ rủi ro mạo danh cực cao)');
      }

      const finalScore = Math.min(99, score);
      setCalculatedScore({
        query: scoreQuery,
        score: finalScore,
        level: finalScore >= 70 ? 'NGUY HIỂM CAO' : (finalScore >= 40 ? 'NGHI NGỜ' : 'KHÁ AN TOÀN'),
        details: details.length > 0 ? details : ['Chưa ghi nhận phản hồi xấu từ cơ sở dữ liệu quốc gia', 'Chứng chỉ SSL hợp lệ', 'Tên miền đăng ký lâu năm'],
        levenshtein: typosquatMatch ? `Khoảng cách Levenshtein với thương hiệu gốc ${typosquatMatch} rất gần.` : 'Không phát hiện dấu hiệu giả mạo tên thương hiệu chính chủ.'
      });

      playSuccessChime();
      onEarnXp(10);
      setScoreLoading(false);
    }, 1200);
  };

  // -------------------- 6. SECOND OPINION STATES --------------------
  const [opinionText, setOpinionText] = useState<string>('');
  const [opinions, setOpinions] = useState([
    { id: 'op-1', content: 'Có người nhắn tin Messenger tự xưng là bưu tá Giao Hàng Tiết Kiệm bảo gói hàng trị giá 200k bị móp, yêu cầu click link để điền STK đền bù 500k...', votesScam: 12, votesSafe: 0, status: 'SCAM', comments: ['GHTK không bao giờ yêu cầu click link bậy bạ để đền bù đâu bạn!', 'Lừa đảo đó đừng ấn'] }
  ]);
  const [broadcasting, setBroadcasting] = useState<boolean>(false);

  const handlePostOpinion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinionText.trim()) return;

    setBroadcasting(true);
    setTimeout(() => {
      const newOp = {
        id: `op-${Date.now()}`,
        content: opinionText.trim(),
        votesScam: 1,
        votesSafe: 0,
        status: 'PENDING',
        comments: [] as string[]
      };
      setOpinions([newOp, ...opinions]);
      setOpinionText('');
      setBroadcasting(false);
      playSuccessChime();
      onEarnXp(15);

      // Simulate community votes coming in after 5s
      setTimeout(() => {
        setOpinions(prev => prev.map(o => o.id === newOp.id ? {
          ...o,
          votesScam: 15,
          votesSafe: 1,
          status: 'SCAM',
          comments: ['CẢNH BÁO: Đây là trò dụ nhận đền bù COD cực kỳ tinh vi!', 'Xóa tin nhắn chặn số gấp nhé bác ơi']
        } : o));
        playAlertWarning();
      }, 5000);
    }, 1500);
  };

  // -------------------- 7. HEATMAP STATES & DATA --------------------
  const [selectedScamFilter, setSelectedScamFilter] = useState<'banking' | 'shipper' | 'job' | 'invest'>('banking');
  const [selectedProvince, setSelectedProvince] = useState<string>('HCM');

  const PROVINCE_DATA: Record<string, any> = {
    HCM: { name: 'Thành phố Hồ Chí Minh', damage: '142 Tỷ VND', activeScam: 'App Thuế VNeID giả mạo cướp OTP ngân hàng', threatIndex: 94, hotzones: ['Quận 1', 'Quận Bình Thạnh', 'Quận Gò Vấp'] },
    HN: { name: 'Thủ đô Hà Nội', damage: '118 Tỷ VND', activeScam: 'Mạo danh Công An quận Ba Đình gọi video thoại giả AI deepfake', threatIndex: 89, hotzones: ['Quận Hoàn Kiếm', 'Quận Cầu Giấy', 'Quận Đống Đa'] },
    DN: { name: 'Thành phố Đà Nẵng', damage: '34 Tỷ VND', activeScam: 'Bẫy việc nhẹ lương cao tuyển cộng tác viên Shopee giật đơn hàng', threatIndex: 65, hotzones: ['Quận Hải Châu', 'Quận Liên Chiểu'] },
    MT: { name: 'Khu vực Miền Tây', damage: '48 Tỷ VND', activeScam: 'Tặng quà miễn phí tri ân khách hàng bắt đóng phí ship COD giả', threatIndex: 72, hotzones: ['Cần Thơ', 'Đồng Tháp'] },
    TN: { name: 'Khu vực Tây Nguyên', damage: '19 Tỷ VND', activeScam: 'Sàn lâm sản đa cấp cam kết lãi suất nông sản sạch 40%', threatIndex: 45, hotzones: ['Gia Lai', 'Đắk Lắk'] }
  };

  // -------------------- 8. COMMUNITY BLACKLIST STATES & DATA --------------------
  const [blacklistSearch, setBlacklistSearch] = useState<string>('');
  const [blacklist, setBlacklist] = useState([
    { id: 'b-1', target: '024.7302.2626', type: 'Số điện thoại', reason: 'Giả danh Công An điều tra dọa rửa tiền', upvotes: 142, downvotes: 2, date: '10 phút trước', verified: true },
    { id: 'b-2', target: 'STK: 1028392109 (Vingroup-pay.vip)', type: 'Tài khoản ngân hàng', reason: 'Nhận tiền đa cấp đầu tư ảo hoàn nhiệm vụ', upvotes: 98, downvotes: 1, date: '1 giờ trước', verified: true },
    { id: 'b-3', target: 'http://vietcombank-security-key.online', type: 'Liên kết website', reason: 'Trang phishing đăng nhập lấy OTP Vietcombank', upvotes: 312, downvotes: 0, date: '2 giờ trước', verified: true }
  ]);
  const [newReportTarget, setNewReportTarget] = useState('');
  const [newReportType, setNewReportType] = useState('Số điện thoại');
  const [newReportReason, setNewReportReason] = useState('');

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportTarget.trim() || !newReportReason.trim()) return;

    const newReport = {
      id: `b-${Date.now()}`,
      target: newReportTarget.trim(),
      type: newReportType,
      reason: newReportReason.trim(),
      upvotes: 1,
      downvotes: 0,
      date: 'Vừa xong',
      verified: false
    };

    setBlacklist([newReport, ...blacklist]);
    setNewReportTarget('');
    setNewReportReason('');
    playSuccessChime();
    onEarnXp(15);
  };

  const handleUpvoteBlacklist = (id: string) => {
    setBlacklist(prev => prev.map(item => item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item));
    playSuccessChime();
  };

  // -------------------- 9. NEWS FEED STATES & DATA --------------------
  const [followedProvinces, setFollowedProvinces] = useState<string[]>(['HCM']);
  const NEWS_FEED = [
    { id: 'n-1', province: 'HCM', title: '🚨 KHẨN CẤP: Băng nhóm giả mạo shipper điện máy xanh giao hàng thu hộ COD tràn ngập Bình Thạnh.', content: 'Các đối tượng nắm được thông tin đơn hàng rác của nạn nhân, giao hộp quà rỗng trị giá 150k - 300k. Đề nghị người dân kiểm tra kỹ app mua sắm trước khi thanh toán.', time: '5 phút trước' },
    { id: 'n-2', province: 'HN', title: '⚠️ CẢNH BÁO: Cuộc gọi lừa đảo mạo danh Chi cục Thuế Quận Đống Đa cài app thuế .apk chứa mã độc.', content: 'Ứng dụng thuế giả mạo yêu cầu cấp quyền Accessibility (Trợ năng), từ đó tự động đọc tin nhắn SMS OTP và chuyển tiền âm thầm trong đêm.', time: '42 phút trước' },
    { id: 'n-3', province: 'DN', title: '📢 TRUY QUÉT: Công an Đà Nẵng triệt phá đường dây tuyển cộng tác viên lừa đảo giật đơn Shopee.', content: 'Hơn 50 đối tượng đặt sào huyệt tại chung cư cao cấp bị bắt giữ. Tổng số tiền chiếm đoạt ước tính lên tới 25 tỷ đồng.', time: '2 giờ trước' }
  ];

  const toggleFollowProvince = (prov: string) => {
    if (followedProvinces.includes(prov)) {
      setFollowedProvinces(prev => prev.filter(p => p !== prov));
    } else {
      setFollowedProvinces(prev => [...prev, prov]);
      playSuccessChime();
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
        {[
          { id: 'money_trace', label: '💸 Money Trace', icon: TrendingDown },
          { id: 'voice_clone', label: '🎙️ Máy Dò Giọng AI', icon: Volume2 },
          { id: 'save_loved', label: '👵 Cứu Người Thân', icon: Heart },
          { id: 'qr_scanner', label: '🔳 Quét QR Đè', icon: QrCode },
          { id: 'scam_score', label: '🎯 Thang Điểm Web/App', icon: Activity },
          { id: 'opinion', label: '💬 Hội Chẩn SOS', icon: HelpCircle },
          { id: 'heatmap', label: '🗺️ Bản Đồ Nhiệt', icon: MapPin },
          { id: 'blacklist', label: '🚫 Community Blacklist', icon: Shield },
          { id: 'news', label: '📰 Tin Cảnh Báo', icon: Bell }
        ].map(subTab => {
          const Icon = subTab.icon;
          const isActive = activeSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{subTab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* 1. MONEY TRACE SIMULATION */}
          {activeSubTab === 'money_trace' && (
            <motion.div
              key="money_trace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <TrendingDown className="w-5 h-5 text-rose-400" />
                    <span>DÒNG TIỀN SAU LỪA ĐẢO (MONEY TRACE DETECT)</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Trải nghiệm trực quan dòng tiền phân rã cực nhanh qua các tài khoản rác (Mule Accounts) để hiểu vì sao ngân hàng rất khó phong tỏa thu hồi tài sản sau 15 phút!
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-400">Số tiền mô phỏng:</span>
                  <select
                    value={traceAmount}
                    onChange={(e) => setTraceAmount(Number(e.target.value))}
                    disabled={isTracing}
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value={10000000}>10 Triệu VND</option>
                    <option value={50000000}>50 Triệu VND</option>
                    <option value={100000000}>100 Triệu VND</option>
                    <option value={500000000}>500 Triệu VND</option>
                  </select>
                </div>
              </div>

              {/* Graphical Network Path Canvas */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 relative h-80 overflow-hidden select-none">
                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Origin to Mule 1 */}
                  <line x1="10%" y1="50%" x2="35%" y2="25%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 1 ? "animate-dash" : "opacity-20"} />
                  <line x1="10%" y1="50%" x2="35%" y2="75%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 1 ? "animate-dash" : "opacity-20"} />

                  {/* Mule 1a to Mule 2 */}
                  <line x1="35%" y1="25%" x2="60%" y2="15%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 2 ? "animate-dash" : "opacity-20"} />
                  <line x1="35%" y1="25%" x2="60%" y2="38%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 2 ? "animate-dash" : "opacity-20"} />

                  {/* Mule 1b to Mule 2c */}
                  <line x1="35%" y1="75%" x2="60%" y2="75%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 2 ? "animate-dash" : "opacity-20"} />

                  {/* Mule 2 to Crypto & OTC */}
                  <line x1="60%" y1="15%" x2="80%" y2="30%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 3 ? "animate-dash" : "opacity-20"} />
                  <line x1="60%" y1="38%" x2="80%" y2="30%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 3 ? "animate-dash" : "opacity-20"} />
                  <line x1="60%" y1="75%" x2="80%" y2="30%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 3 ? "animate-dash" : "opacity-20"} />
                  <line x1="60%" y1="75%" x2="82%" y2="70%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className={traceStep >= 3 ? "animate-dash" : "opacity-20"} />
                </svg>

                {/* Draw trace nodes */}
                {traceNodes.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-mono">
                    BẤM "KÍCH HOẠT ĐIỀU TRA" ĐỂ BẮT ĐẦU CHẠY MÔ PHỎNG DÒNG TIỀN
                  </div>
                ) : (
                  traceNodes.map(node => (
                    <div
                      key={node.id}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 w-44"
                    >
                      <div className={`p-2.5 rounded-xl border transition-all ${
                        node.status === 'completed'
                          ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                          : node.status === 'active'
                            ? 'bg-amber-950/80 border-amber-500 text-amber-200 animate-pulse ring-2 ring-amber-500/50'
                            : 'bg-slate-950/80 border-slate-800 text-slate-500'
                      }`}>
                        <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400 font-mono">{node.bank}</div>
                        <div className="text-xs font-bold truncate mt-0.5">{node.label}</div>
                        <div className="text-[11px] font-mono font-black text-rose-400 mt-1">{node.amount}</div>
                        {node.status === 'active' && (
                          <div className="text-[9px] mt-1 bg-amber-500/20 text-amber-300 rounded px-1 text-center font-bold">Dòng tiền đang chảy qua...</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Trace Log and Controllers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-2 h-44 overflow-y-auto font-mono text-xs text-slate-300">
                  <div className="text-cyan-400 font-black border-b border-slate-800 pb-1.5 uppercase">LOG GIÁM SÁT FORENSIC TIME:</div>
                  {traceLog.map((log, index) => (
                    <div key={index} className="leading-relaxed border-l-2 border-rose-500 pl-2 mt-1">
                      {log}
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-rose-400 font-mono uppercase tracking-widest block">CHỈ SỐ RỦI RO THẤT THOÁT</span>
                    <h4 className="text-2xl font-black text-white font-mono">99.9% CHÌM SÂU</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Lệnh Napas 24/7 chỉ mất 2 giây để hoàn tất 1 giao dịch. Khi nạn nhân chuyển khoản, trong 60 giây tiền đã được chia sang hàng chục tài khoản ma để mua Crypto.
                    </p>
                  </div>
                  <button
                    onClick={startMoneyTraceSimulation}
                    disabled={isTracing}
                    className="w-full mt-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs font-mono transition-all disabled:opacity-50"
                  >
                    {isTracing ? '🔍 ĐANG PHÂN TÍCH DÒNG TIỀN...' : 'KÍCH HOẠT MÔ PHỎNG DÒNG TIỀN'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. AI VOICE CLONE DETECTOR */}
          {activeSubTab === 'voice_clone' && (
            <motion.div
              key="voice_clone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                  <span>MÁY DÒ GIỌNG NÓI NHÂN TẠO (AI VOICE CLONE DETECTOR)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Phân tích tần số âm phổ, nhịp thở tự nhiên, nhiễu nền cơ học của cuộc gọi nghi ngờ giả giọng AI Deepfake người thân đòi tiền cấp cứu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Select Caller Transcript Samples */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300">Chọn mẫu ghi âm cuộc gọi lừa đảo kinh điển:</label>
                  <div className="space-y-2">
                    {VOICE_SAMPLES.map((sample, idx) => (
                      <div
                        key={sample.id}
                        onClick={() => handleSelectVoiceSample(sample.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedVoiceSample === sample.id
                            ? 'bg-indigo-950/60 border-indigo-500 text-white'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black font-mono text-cyan-400">MẪU SỐ #{idx + 1}</span>
                          <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-full">{sample.duration}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 mt-1">{sample.title}</h4>
                        <p className="text-xs text-slate-400 italic mt-1 line-clamp-2">"{sample.text}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Manual upload simulated */}
                  <div className="border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-950 text-center">
                    <span className="text-xs text-slate-400 block">Hoặc tải lên tệp .MP3 / .WAV ghi âm thực tế</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setVoiceFile(e.target.files[0].name);
                          setSelectedVoiceSample(1); // Mock with first sample characteristics
                        }
                      }}
                      className="hidden"
                      id="voice-upload"
                    />
                    <label htmlFor="voice-upload" className="inline-block mt-2 px-4 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold rounded-xl cursor-pointer transition-all border border-indigo-500/40">
                      Chọn file của bạn {voiceFile ? `(${voiceFile})` : ''}
                    </label>
                  </div>
                </div>

                {/* Right Side: Equalizer and Spectral Diagnostics */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-400 font-mono tracking-wider">MÔ PHỎNG PHỔ TẦN SỐ (SPECTRAL DIAGNOSTICS)</span>
                      <button
                        onClick={togglePlayVoiceSample}
                        disabled={selectedVoiceSample === null}
                        className="p-1.5 rounded-full bg-slate-800 text-slate-200 hover:text-white disabled:opacity-40"
                      >
                        {isPlayingVoice ? <Pause className="w-4 h-4 animate-pulse text-indigo-400" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Spectral Equalizer Animation */}
                    <div className="h-16 flex items-end justify-center space-x-1.5 border-b border-slate-900 pb-2">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            height: isPlayingVoice ? `${Math.floor(Math.random() * 90) + 10}%` : '8px',
                            transition: 'all 0.15s ease-in-out'
                          }}
                          className={`w-2.5 rounded-t bg-gradient-to-t ${isPlayingVoice ? 'from-indigo-600 via-cyan-400 to-rose-400' : 'from-slate-800 to-slate-800'}`}
                        />
                      ))}
                    </div>

                    {voiceLoading ? (
                      <div className="py-8 text-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                        <p className="text-xs text-slate-400 font-mono">ĐANG SOI ACOUSTIC & KIỂM TRA PHỔ GIỌNG AI...</p>
                      </div>
                    ) : voiceConfidence !== null ? (
                      <div className="space-y-3.5 animate-fadeIn">
                        <div className="flex items-center justify-between p-3 bg-rose-950/40 rounded-xl border border-rose-500/30">
                          <div>
                            <span className="text-[10px] font-black uppercase text-rose-400 font-mono">Confidence Score</span>
                            <div className="text-xl font-black text-rose-300 font-mono">{voiceConfidence}% GIỌNG NHÂN TẠO (AI)</div>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center space-x-2 text-slate-300">
                            <span className={`w-2 h-2 rounded-full ${voiceAnalysisResult.flatPitch ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span>Độ bằng phẳng âm vực (Flat Pitch Index): {voiceAnalysisResult.flatPitch ? 'Bất thường (Cực đều)' : 'Bình thường'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-300">
                            <span className={`w-2 h-2 rounded-full ${voiceAnalysisResult.missingPauses ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span>Nhịp nghỉ hít thở (Missing breath breaks): {voiceAnalysisResult.missingPauses ? 'Không phát hiện (Dấu hiệu AI)' : 'Có quãng thở'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-300">
                            <span className={`w-2 h-2 rounded-full ${voiceAnalysisResult.metallicNoise ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span>Nhiễu âm kim loại lặp (Acoustic artifacts): {voiceAnalysisResult.metallicNoise ? 'Phát hiện nhiễu C&C' : 'Tự nhiên'}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-2 font-medium">
                            <strong className="text-white">Chi tiết:</strong> {voiceAnalysisResult.reason}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500 font-mono">
                        {selectedVoiceSample === null ? 'VUI LÒNG CHỌN MẪU GHI ÂM ĐỂ KHỞI CHẠY' : 'BẤM "QUÉT GIỌNG AI PHÁP Y" ĐỂ BẮT ĐẦU CHẨN ĐOÁN'}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={runVoiceCloneScan}
                    disabled={selectedVoiceSample === null || voiceLoading}
                    className="w-full mt-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs font-mono transition-all disabled:opacity-40"
                  >
                    {voiceLoading ? '🔍 ĐANG QUÉT GIỌNG NẮM BẮT ĐỐI TƯỢNG...' : 'QUÉT GIỌNG AI PHÁP Y'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. SAVE MY LOVED ONE */}
          {activeSubTab === 'save_loved' && (
            <motion.div
              key="save_loved"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span>HỘI THOẠI ĐẢO VAI: "CỨU NGƯỜI THÂN"</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    AI đóng vai Bà Nội đang bị dụ dỗ chuyển 50 triệu đầu tư đa cấp. Hãy chọn cách thuyết phục thông thái nhất để giữ ví cho nội mà không làm tổn thương nội nhé!
                  </p>
                </div>
                <button
                  onClick={restartLovedOneGame}
                  className="px-3 py-1.5 border border-slate-800 rounded-xl text-[10px] text-slate-300 font-black hover:bg-slate-800 uppercase tracking-wider"
                >
                  Chơi lại từ đầu
                </button>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-cyan-400">ĐỘ TIN CẬY CỦA NỘI:</span>
                    <span className="font-mono text-white">{lovedTrust}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div style={{ width: `${lovedTrust}%` }} className="bg-cyan-400 h-full transition-all duration-500" />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-rose-400">ĐỘ HOẢNG LOẠN/ÁP LỰC:</span>
                    <span className="font-mono text-white">{lovedPanic}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div style={{ width: `${lovedPanic}%` }} className="bg-rose-500 h-full transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Chat Simulator Canvas */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 h-80 flex flex-col justify-between">
                <div className="overflow-y-auto space-y-3 flex-1 pr-2">
                  {lovedHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex ${chat.sender === 'player' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        chat.sender === 'player'
                          ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
                      }`}>
                        <div className="font-black text-[9px] uppercase tracking-wider opacity-60 mb-0.5">
                          {chat.sender === 'player' ? 'CHÁU NGOAN' : 'BÀ NỘI CÚC'}
                        </div>
                        {chat.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback log */}
                {lovedFeedbacks.length > 0 && (
                  <div className="text-[10px] text-amber-400 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 mb-3 text-center font-mono font-medium">
                    🔍 {lovedFeedbacks[lovedFeedbacks.length - 1]}
                  </div>
                )}

                {/* Dialog Selection Buttons */}
                <div className="space-y-1.5">
                  {lovedStepId !== 'win_grandma' && lovedStepId !== 'lose_grandma' && lovedScenario.steps[lovedStepId]?.options.map((opt: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleChooseOption(opt)}
                      className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 text-xs transition-all leading-relaxed"
                    >
                      {opt.text}
                    </button>
                  ))}

                  {/* End State Message */}
                  {lovedStepId === 'win_grandma' && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-center rounded-xl font-bold text-xs">
                      🎉 BẠN ĐÃ THUYẾT PHỤC THÀNH CÔNG NỘI! Bạn nhận được +100 XP danh hiệu dũng sỹ phản kích.
                    </div>
                  )}
                  {lovedStepId === 'lose_grandma' && (
                    <div className="p-3 bg-rose-950/60 border border-rose-500/30 text-rose-300 text-center rounded-xl font-bold text-xs">
                      😭 BÀ NỘI ĐÃ SẬP BẪY MẤT TIỀN. Hãy thử lại để học cách lắng nghe và đưa bằng chứng khoa học thay vì trách móc bà!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. QR OVERLAP SCANNER */}
          {activeSubTab === 'qr_scanner' && (
            <motion.div
              key="qr_scanner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <QrCode className="w-5 h-5 text-cyan-400" />
                  <span>PHÁT HIỆN QR ĐÈ PHÒNG ĂN / BÃI XE (QUISHING OVERLAP SANBOX)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Mô phỏng bóc tách mã QR bị dán chồng tại các quán Highlands Coffee hoặc bãi đỗ xe công cộng để trộm tiền chuyển khoản.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side QR sandbox screen */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-between space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-400">RÀ QUÉT QR DÁN ĐÈ BẰNG LÚP PHỔ QUANG:</span>
                  </div>

                  {/* Interactive QR Visualizer with reveal */}
                  <div className="relative w-48 h-48 bg-white p-4 rounded-xl shadow-xl select-none flex items-center justify-center cursor-pointer">
                    <img
                      src={mascotShield}
                      alt="QR Base"
                      className="w-full h-full object-contain opacity-20 absolute"
                      referrerPolicy="no-referrer"
                    />
                    {/* Fake overlapping sticker */}
                    <div className={`absolute inset-0 bg-white/90 flex flex-col items-center justify-center transition-all ${qrLayerRevealed ? 'opacity-30 scale-95' : 'opacity-100'}`}>
                      <QrCode className={`w-32 h-32 ${qrLayerRevealed ? 'text-rose-500' : 'text-slate-950'}`} />
                      {!qrLayerRevealed && <div className="absolute text-[10px] font-black bg-rose-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono shadow border border-slate-950 animate-bounce">ĐÈ NHÃN LẠ</div>}
                    </div>
                  </div>

                  {/* Slider Control to simulate peeling sticker */}
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                      <span>BÓC TÁCH LỚP QR (PEEL LABELS)</span>
                      <span>{qrLayerRevealed ? 'ĐÃ BÓC RA' : 'CHƯA BÓC'}</span>
                    </div>
                    <button
                      onClick={() => setQrLayerRevealed(!qrLayerRevealed)}
                      className="w-full py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-black transition-all"
                    >
                      {qrLayerRevealed ? 'DÁN LẠI NHÃN ĐỂ SOI' : 'BÓC TÁCH NHÃN DÁN ĐÈ'}
                    </button>
                  </div>

                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => simulateQrScan(true)}
                      className="flex-1 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-xl transition-all"
                    >
                      Quét mã Fake dán đè
                    </button>
                    <button
                      onClick={() => simulateQrScan(false)}
                      className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition-all"
                    >
                      Quét mã Thật Highlands
                    </button>
                  </div>
                </div>

                {/* Right side Sandbox Audit Details */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-black text-cyan-400 font-mono uppercase tracking-wider block">PHÂN TÍCH SANDBOX (DECODED ANALYSIS)</span>

                    {qrAnalyzing ? (
                      <div className="py-12 text-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                        <p className="text-xs text-slate-400 font-mono">ĐANG KHỞI CHẠY MÔI TRƯỜNG CÔ LẬP TRUY VẤN URL...</p>
                      </div>
                    ) : qrSandboxResult ? (
                      <div className="space-y-4 animate-fadeIn">
                        <div className={`p-3 rounded-xl border ${qrSandboxResult.isSafe ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`}>
                          <div className="text-[10px] font-black uppercase tracking-wider font-mono">TRẠNG THÁI KIỂM DUYỆT</div>
                          <div className="text-base font-black font-mono uppercase mt-0.5">{qrSandboxResult.threatLevel}</div>
                        </div>

                        <div className="space-y-2.5 text-xs leading-relaxed">
                          <div>
                            <span className="text-slate-400 font-mono text-[10px] uppercase">Link giải mã:</span>
                            <div className="font-mono bg-slate-900 p-2 rounded-xl border border-slate-850 text-cyan-300 select-all font-bold overflow-x-auto whitespace-nowrap mt-1">{qrSandboxResult.decodedUrl}</div>
                          </div>
                          <div>
                            <span className="text-slate-400 font-mono text-[10px] uppercase">Chiêu thức phát hiện:</span>
                            <div className="text-white font-bold mt-0.5">{qrSandboxResult.detectedTrick}</div>
                          </div>
                          <p className="text-slate-400 border-t border-slate-900 pt-2 font-medium">
                            {qrSandboxResult.description}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-xs text-slate-500 font-mono">
                        HÃY CHỌN QUÉT QR MẪU ĐỂ XEM HẠNG MỤC AN TOÀN TRƯỚC KHI TRUY CẬP TRÌNH DUYỆT
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      Mẹo bảo vệ: Khi thanh toán tại bàn Highlands Coffee hoặc Highlands Plaza, hãy sờ bề mặt QR để kiểm tra nhãn dán dột, sần sùi hoặc đè nhãn mới lên trên.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. SCAM SCORE FOR WEBSITES/APPS */}
          {activeSubTab === 'scam_score' && (
            <motion.div
              key="scam_score"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <span>THANG ĐIỂM BẢO MẬT WEBSITE & ỨNG DỤNG (SCAM SCORE)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Nhập địa chỉ website lạ hoặc file apk tải ngoài Store để bóc tách độ uy tín qua WHOIS age, SSL age, và thuật toán Levenshtein so khớp thương hiệu gốc.
                </p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={scoreQuery}
                      onChange={(e) => setScoreQuery(e.target.value)}
                      placeholder="Nhập link nghi ngờ (ví dụ: vietcombank-ibanking-safety.xyz)..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>
                  <button
                    onClick={calculateScamScore}
                    disabled={scoreLoading || !scoreQuery.trim()}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono rounded-xl transition-all disabled:opacity-40"
                  >
                    ĐÁNH GIÁ
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold text-slate-400">Gợi ý mẫu:</span>
                  {['vneid-vcs.online', 'vietcombank-login-shield.cc', 'shopee-gift.top', 'mbbank.com.vn'].map(s => (
                    <button
                      key={s}
                      onClick={() => { setScoreQuery(s); }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-lg text-[10px] font-mono text-slate-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {scoreLoading ? (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-8 text-center space-y-2">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">ĐANG DUYỆT CHỨNG CHỈ SSL & TRA CỨU LEVENSHTEIN DISTANCE...</p>
                </div>
              ) : calculatedScore ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between items-center text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 font-mono uppercase">CHỈ SỐ SCAM SCORE</span>
                      <div className={`text-4xl font-black font-mono ${calculatedScore.score >= 70 ? 'text-rose-500 animate-pulse' : (calculatedScore.score >= 40 ? 'text-amber-400' : 'text-emerald-400')}`}>
                        {calculatedScore.score} / 100
                      </div>
                      <div className={`text-xs font-black uppercase mt-1 ${calculatedScore.score >= 70 ? 'text-rose-400' : (calculatedScore.score >= 40 ? 'text-amber-300' : 'text-emerald-300')}`}>
                        Mức rủi ro: {calculatedScore.level}
                      </div>
                    </div>

                    <div className="w-32 h-32 relative mt-4">
                      {/* Dynamic SVG Dial */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="50" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                        <circle cx="64" cy="64" r="50" stroke={calculatedScore.score >= 70 ? '#f43f5e' : (calculatedScore.score >= 40 ? '#fbbf24' : '#10b981')} strokeWidth="8" fill="transparent" strokeDasharray={`${calculatedScore.score * 3.14}, 314`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black font-mono text-xl text-white">
                        {calculatedScore.score}%
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-cyan-400 font-mono uppercase block">KẾT QUẢ PHÂN TÍCH PHÁP Y THƯƠNG HIỆU (LEVENSHTEIN MATCH)</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {calculatedScore.levenshtein}
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-slate-900 pt-3">
                      <span className="text-[10px] font-black text-slate-400 font-mono uppercase block">DẤU HIỆU BẤT THƯỜNG TRUY VẤN ĐƯỢC:</span>
                      <div className="space-y-1.5">
                        {calculatedScore.details.map((d: string, i: number) => (
                          <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 font-mono">
                            <span className="text-rose-500 mt-0.5">•</span>
                            <span className="leading-relaxed">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* 6. SECOND OPINION SOS */}
          {activeSubTab === 'opinion' && (
            <motion.div
              key="opinion"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span>HỘI CHẨN CẢNH BÁO SOS (SECOND OPINION FAST)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Đăng tải tình huống mờ ám bạn đang gặp phải. Hệ thống sẽ ngay lập tức phát đi cảnh báo và mời 15+ thành viên gia đình & chuyên gia bảo mật đồng loạt biểu quyết, đưa ra lời giải thích thuyết phục nhất.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Form */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 h-fit">
                  <form onSubmit={handlePostOpinion} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">Nội dung / Chụp màn hình lừa đảo:</label>
                      <textarea
                        value={opinionText}
                        onChange={(e) => setOpinionText(e.target.value)}
                        placeholder="Ví dụ: Người tự xưng là shipper báo nhận đơn 0 đồng nhưng yêu cầu nộp phạt qua link..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 h-28 resize-none font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={broadcasting || !opinionText.trim()}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono transition-all disabled:opacity-40"
                    >
                      {broadcasting ? '🛰️ ĐANG PHÁT SÓNG SOS...' : 'PHÁT SÓNG HỘI CHẨN KHẨN CẤP'}
                    </button>
                  </form>
                </div>

                {/* Right Feed */}
                <div className="md:col-span-2 space-y-4">
                  <span className="text-xs font-black text-indigo-400 font-mono uppercase block">DÒNG Ý KIẾN HỘI CHẨN NÓNG (REALTIME OPINION VOTE)</span>
                  <div className="space-y-3 h-[280px] overflow-y-auto pr-1">
                    {opinions.map(op => (
                      <div key={op.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3">
                        <p className="text-xs text-slate-200 leading-relaxed font-bold">"{op.content}"</p>

                        <div className="flex items-center space-x-4 border-t border-slate-900 pt-3">
                          <div className="flex items-center space-x-1 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[10px] font-mono text-rose-300 font-black">LỪA ĐẢO: {op.votesScam} phiếu</span>
                          </div>
                          <div className="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-mono text-emerald-300 font-black">AN TOÀN: {op.votesSafe} phiếu</span>
                          </div>
                          {op.status === 'SCAM' && (
                            <span className="text-[9px] font-mono bg-rose-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Hội đồng cảnh báo đỏ</span>
                          )}
                        </div>

                        {op.comments.length > 0 && (
                          <div className="space-y-1.5 pl-3 border-l border-slate-800">
                            {op.comments.map((comment, i) => (
                              <div key={i} className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                <strong className="text-slate-300">Cộng đồng:</strong> {comment}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. SCAM HEATMAP */}
          {activeSubTab === 'heatmap' && (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    <span>BẢN ĐỒ NHIỆT RỦI RO LỪA ĐẢO VIỆT NAM (SCAM RISK HEATMAP)</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Cập nhật thời gian thực chỉ số thiệt hại tài sản và các chiêu thức lừa đảo bùng phát dữ dội nhất theo địa lý tỉnh thành cả nước.
                  </p>
                </div>

                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 space-x-1">
                  {[
                    { id: 'banking', label: 'Ngân hàng' },
                    { id: 'shipper', label: 'Fake Shipper' },
                    { id: 'job', label: 'Giật đơn CTV' },
                    { id: 'invest', label: 'Đầu tư đa cấp' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedScamFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                        selectedScamFilter === f.id ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SVG/List Map Selector */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
                  <span className="text-xs font-black text-slate-400 font-mono uppercase block">LỰA CHỌN PHÂN VÙNG ĐỊA LÝ:</span>
                  <div className="space-y-1.5">
                    {Object.keys(PROVINCE_DATA).map(key => {
                      const p = PROVINCE_DATA[key];
                      const isSelected = selectedProvince === key;
                      return (
                        <div
                          key={key}
                          onClick={() => { setSelectedProvince(key); playSuccessChime(); }}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                              : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <MapPin className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                            <span className="text-xs font-black">{p.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-mono font-black text-rose-400">{p.threatIndex}% Hot</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Province Audit details */}
                <div className="md:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <div>
                        <h3 className="text-base font-black text-white">{PROVINCE_DATA[selectedProvince].name}</h3>
                        <span className="text-[10px] font-mono text-cyan-400">CHỈ SỐ TÌNH BÁO TỘI PHẠM CÔNG NGHỆ CAO</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 font-mono block">TỔNG THIỆT HẠI ƯỚC TÍNH</span>
                        <span className="text-sm font-black font-mono text-rose-500">{PROVINCE_DATA[selectedProvince].damage}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                        <span className="text-[10px] font-black font-mono text-rose-400 uppercase tracking-widest block">⚠️ CHIÊU THỨC BÙNG PHÁT NỔI BẬT TUẦN NÀY:</span>
                        <p className="text-xs text-rose-300 font-bold leading-relaxed">
                          {PROVINCE_DATA[selectedProvince].activeScam}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-slate-400 font-mono uppercase block">Điểm nóng hoạt động nhiều (Hot Zones):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {PROVINCE_DATA[selectedProvince].hotzones.map((zone: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-850 text-[10px] font-mono text-slate-300 font-black">
                              🔥 {zone}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic mt-6 leading-relaxed font-medium">
                    * Bản đồ được trích xuất dữ liệu từ các báo cáo đã duyệt của hệ thống ScamGuard và Cục Phòng Chống Tội Phạm Không Gian Mạng Việt Nam.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 8. COMMUNITY BLACKLIST */}
          {activeSubTab === 'blacklist' && (
            <motion.div
              key="blacklist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <span>CSDL BLACKLIST QUỐC GIA (CROWDSOURCED SCAM DATABASE)</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Tra cứu chéo hoặc đóng góp số điện thoại, số tài khoản, tên miền lừa đảo để cộng đồng cùng kiểm duyệt và ngăn chặn.
                  </p>
                </div>
              </div>

              {/* Grid Layout for black list */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search & Add Report Form */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 h-fit space-y-4">
                  <span className="text-xs font-black text-cyan-400 font-mono uppercase block">ĐÓNG GÓP BAO VỆ CỘNG ĐỒNG (ADD REPORT)</span>
                  <form onSubmit={handleAddReport} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400">Loại đối tượng:</label>
                      <select
                        value={newReportType}
                        onChange={(e) => setNewReportType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                      >
                        <option value="Số điện thoại">Số điện thoại</option>
                        <option value="Tài khoản ngân hàng">Tài khoản ngân hàng</option>
                        <option value="Liên kết website">Liên kết website</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400">Địa chỉ / SĐT / STK:</label>
                      <input
                        type="text"
                        value={newReportTarget}
                        onChange={(e) => setNewReportTarget(e.target.value)}
                        placeholder="Ví dụ: 0918291039 hoặc Techcombank 1902..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400">Chiêu thức / Lý do tố cáo:</label>
                      <input
                        type="text"
                        value={newReportReason}
                        onChange={(e) => setNewReportReason(e.target.value)}
                        placeholder="Ví dụ: Giả shipper đe dọa đòi OTP nhận hàng..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!newReportTarget.trim() || !newReportReason.trim()}
                      className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono transition-all disabled:opacity-40"
                    >
                      GỬI REPORT KIỂM DUYỆT
                    </button>
                  </form>
                </div>

                {/* Search Result and Blacklist feed */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={blacklistSearch}
                      onChange={(e) => setBlacklistSearch(e.target.value)}
                      placeholder="Tìm nhanh SĐT / STK lừa đảo..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {blacklist
                      .filter(b => b.target.includes(blacklistSearch) || b.reason.includes(blacklistSearch))
                      .map(b => (
                        <div key={b.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs font-mono">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[9px] font-black border border-slate-800 text-slate-400">{b.type}</span>
                              <strong className="text-white select-all">{b.target}</strong>
                              {b.verified && (
                                <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 rounded font-black">CHỨNG CHỰC CHÍNH QUY</span>
                              )}
                            </div>
                            <p className="text-slate-400 text-[11px] leading-relaxed font-medium">Lý do: {b.reason}</p>
                            <span className="text-[10px] text-slate-500">Báo cáo lúc {b.date}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpvoteBlacklist(b.id)}
                              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg flex items-center space-x-1 font-black transition-all cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{b.upvotes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 9. REAL-TIME REGIONAL NEWS FEED */}
          {activeSubTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-indigo-400 font-black animate-swing" />
                  <span>CẢNH BÁO TỨC THÌ THEO KHU VỰC (REGIONAL NEWS FEED)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Đăng ký nhận cảnh báo đỏ về các thủ đoạn giăng bẫy tài chính, cài mã độc ngân hàng bùng phát riêng tại địa lý bạn đang sinh sống.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Subscription management */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                  <span className="text-xs font-black text-cyan-400 font-mono uppercase block">QUẢN LÝ THEO DÕI VÙNG ĐỒNG BỘ:</span>
                  <div className="space-y-2">
                    {[
                      { id: 'HCM', label: 'Thành phố Hồ Chí Minh' },
                      { id: 'HN', label: 'Thủ đô Hà Nội' },
                      { id: 'DN', label: 'Thành phố Đà Nẵng' }
                    ].map(prov => {
                      const isSubbed = followedProvinces.includes(prov.id);
                      return (
                        <div key={prov.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-850">
                          <span className="text-xs text-slate-200 font-black">{prov.label}</span>
                          <button
                            onClick={() => toggleFollowProvince(prov.id)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                              isSubbed ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {isSubbed ? 'Đang Theo Dõi' : 'Theo Dõi Ngay'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* News bulletin scroll */}
                <div className="md:col-span-2 space-y-4 h-[300px] overflow-y-auto pr-1">
                  {NEWS_FEED
                    .filter(item => followedProvinces.includes(item.province))
                    .map(item => (
                      <div key={item.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-2 animate-fadeIn relative">
                        <span className="absolute right-4 top-4 text-[10px] text-slate-500 font-mono">{item.time}</span>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-rose-500 text-slate-950 text-[9px] font-black uppercase font-mono tracking-wider animate-pulse">Cảnh Báo Đỏ</span>
                          <span className="text-[10px] font-black text-cyan-400 font-mono">[{item.province}]</span>
                        </div>
                        <h4 className="text-sm font-black text-white leading-relaxed mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{item.content}</p>
                      </div>
                    ))}
                  {followedProvinces.length === 0 && (
                    <div className="py-12 text-center text-xs text-slate-500 font-mono">
                      CHƯA THEO DÕI KHU VỰC NÀO. HÃY CHỌN THEO DÕI Ở KHUNG BÊN TRÁI ĐỂ CẬP NHẬT.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
