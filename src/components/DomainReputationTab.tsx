import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  ThumbsUp,
  ThumbsDown,
  QrCode,
  Eye,
  Video,
  Database,
  Cpu,
  Globe,
  Lock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playRewardTrophy } from '../utils/audioEffects';

// Heuristic Levenshtein Distance for Typosquatting
function getLevenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j;
  for (i = 0; i <= a.length; i++) tmp.push([i]);
  for (j = 1; j <= b.length; j++) tmp[0].push(j);
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

const TRUSTED_BRANDS = [
  'vietcombank',
  'techcombank',
  'mbbank',
  'bidv',
  'acb',
  'vneid',
  'shopee',
  'lazada',
  'tiktok',
  'google',
  'facebook',
  'telegram',
  'netflix'
];

interface CommunityNote {
  id: string;
  target: string;
  type: 'url' | 'phone' | 'stk';
  scamType: string;
  description: string;
  upvotes: number;
  downvotes: number;
  userVoted?: 'up' | 'down';
  verifiedStatus: 'PENDING' | 'VERIFIED' | 'DISPUTED';
  timestamp: string;
}

const INITIAL_NOTES: CommunityNote[] = [
  {
    id: 'note-1',
    target: 'vietcombank-login-online.xyz',
    type: 'url',
    scamType: 'Giả Mạo Thương Hiệu / Phishing',
    description: 'Trang web mạo danh giao diện đăng nhập VCB Digibank để thu thập OTP. WHOIS đăng ký ẩn danh tại Nga cách đây 2 ngày.',
    upvotes: 142,
    downvotes: 3,
    verifiedStatus: 'VERIFIED',
    timestamp: '10 phút trước'
  },
  {
    id: 'note-2',
    target: '0392910392',
    type: 'phone',
    scamType: 'Giả danh Cơ Quan Chức Năng',
    description: 'Đối tượng giả danh shipper công ty Giao Hàng Tiết Kiệm bắt nộp phí COD khống qua cổng chuyển khoản lừa đảo.',
    upvotes: 95,
    downvotes: 1,
    verifiedStatus: 'VERIFIED',
    timestamp: '2 giờ trước'
  },
  {
    id: 'note-3',
    target: 'vnpost-capnhat-diachi.cc',
    type: 'url',
    scamType: 'Phishing Giao Hàng',
    description: 'Bẫy nộp phí lưu kho 10.000đ để thu thập toàn bộ thông tin thẻ tín dụng quốc tế Visa/Mastercard.',
    upvotes: 64,
    downvotes: 0,
    verifiedStatus: 'VERIFIED',
    timestamp: '5 giờ trước'
  }
];

export const DomainReputationTab: React.FC = () => {
  // Navigation for Sub-modules
  const [activeSubTab, setActiveSubTab] = useState<'reputation' | 'community' | 'qr_sandbox' | 'deepfake' | 'osint'>('reputation');

  // 1. Reputation Engine States
  const [domainInput, setDomainInput] = useState('');
  const [repResult, setRepResult] = useState<any | null>(null);
  const [repLoading, setRepLoading] = useState(false);

  // 2. Community Feed States
  const [communityNotes, setCommunityNotes] = useState<CommunityNote[]>(INITIAL_NOTES);
  const [newTarget, setNewTarget] = useState('');
  const [newType, setNewType] = useState<'url' | 'phone' | 'stk'>('url');
  const [newScamType, setNewScamType] = useState('Giả Mạo Thương Hiệu');
  const [newDesc, setNewDesc] = useState('');

  // 3. QR Sandbox States
  const [qrInputUrl, setQrInputUrl] = useState('https://vietcombank-xacminh.xyz/digibank/verify-otp');
  const [qrDecoded, setQrDecoded] = useState<any | null>(null);
  const [qrScanning, setQrScanning] = useState(false);

  // 4. Deepfake States
  const [deepfakeFile, setDeepfakeFile] = useState<string | null>(null);
  const [deepfakeLoading, setDeepfakeLoading] = useState(false);
  const [deepfakeResult, setDeepfakeResult] = useState<any | null>(null);

  // 5. OSINT States
  const [osintQuery, setOsintQuery] = useState('');
  const [osintResult, setOsintResult] = useState<any | null>(null);
  const [osintLoading, setOsintLoading] = useState(false);

  // Handle Domain Reputation Calculation
  const handleCheckReputation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setRepLoading(true);
    setRepResult(null);

    setTimeout(() => {
      let rawDomain = domainInput.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      let domainParts = rawDomain.split('.');
      let cleanDomain = domainParts.length > 1 ? domainParts[domainParts.length - 2] : rawDomain;

      // Typosquatting Check
      let closestBrand = '';
      let minDistance = 999;
      for (const brand of TRUSTED_BRANDS) {
        const dist = getLevenshteinDistance(cleanDomain, brand);
        if (dist > 0 && dist <= 3) {
          if (dist < minDistance) {
            minDistance = dist;
            closestBrand = brand;
          }
        }
      }

      const isTyposquatting = closestBrand !== '';
      const isBadTLD = /\.(xyz|top|cc|club|work|vip|online|site|online|fit|ru|click|gq|cf|ml)$/i.test(rawDomain);
      const isHttps = domainInput.startsWith('https://');

      // Calculate score out of 100
      let riskScore = 10; // baseline safe
      if (isTyposquatting) riskScore += 50;
      if (isBadTLD) riskScore += 25;
      if (!isHttps) riskScore += 10;

      riskScore = Math.min(riskScore, 99);

      setRepResult({
        domain: rawDomain,
        riskScore,
        riskLevel: riskScore >= 70 ? 'HIGH' : (riskScore >= 40 ? 'MEDIUM' : 'SAFE'),
        whoisAge: riskScore > 50 ? '3 ngày' : '5 năm, 120 ngày',
        sslCertAge: riskScore > 40 ? '2 ngày (Tự phát hành/Let\'s Encrypt)' : '360 ngày (DigiCert High Assurance EV CA)',
        isTyposquatting,
        closestBrand: isTyposquatting ? closestBrand.toUpperCase() : null,
        levenshtein: minDistance,
        scamHistoryFound: riskScore > 40,
        explanation: isTyposquatting
          ? `CẢNH BÁO: Phát hiện tên miền có độ lệch khoảng cách ký tự cực ngắn (${minDistance} ký tự) so với thương hiệu chính thức "${closestBrand.toUpperCase()}". Đây là hành vi mạo danh (Typosquatting) cực kỳ nguy hiểm để dụ nạn nhân nhầm lẫn.`
          : 'Tên miền chưa phát hiện tín hiệu mạo danh thương hiệu trực diện, tuy nhiên vẫn cần cảnh giác với nguồn phát tán.'
      });
      setRepLoading(false);
      playSuccessChime();
    }, 1200);
  };

  // Handle Note Voting
  const handleVote = (id: string, voteType: 'up' | 'down') => {
    setCommunityNotes(prev => prev.map(note => {
      if (note.id !== id) return note;
      
      let upvotes = note.upvotes;
      let downvotes = note.downvotes;
      let userVoted = note.userVoted;

      if (userVoted === voteType) {
        // undo vote
        if (voteType === 'up') upvotes--;
        else downvotes--;
        userVoted = undefined;
      } else {
        // undo previous vote if any
        if (userVoted === 'up') upvotes--;
        else if (userVoted === 'down') downvotes--;

        // apply new vote
        if (voteType === 'up') upvotes++;
        else downvotes++;
        userVoted = voteType;
      }

      return {
        ...note,
        upvotes,
        downvotes,
        userVoted
      };
    }));
    playSuccessChime();
  };

  // Handle Note Submission
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.trim() || !newDesc.trim()) return;

    const note: CommunityNote = {
      id: `note-${Date.now()}`,
      target: newTarget.trim(),
      type: newType,
      scamType: newScamType,
      description: newDesc.trim(),
      upvotes: 1,
      downvotes: 0,
      userVoted: 'up',
      verifiedStatus: 'PENDING',
      timestamp: 'Vừa xong'
    };

    setCommunityNotes([note, ...communityNotes]);
    setNewTarget('');
    setNewDesc('');
    playRewardTrophy();
  };

  // Simulate QR Decode Safe Sandbox
  const handleQRScan = () => {
    setQrScanning(true);
    setQrDecoded(null);

    setTimeout(() => {
      let isSafe = !qrInputUrl.includes('verify') && !qrInputUrl.includes('xacminh') && !qrInputUrl.includes('.xyz') && !qrInputUrl.includes('.top');
      setQrDecoded({
        targetUrl: qrInputUrl,
        isSafe,
        riskScore: isSafe ? 12 : 88,
        previewImage: qrInputUrl.includes('vietcombank') ? 'Giao diện mạo danh đăng nhập VCB Digibank' : 'Trang đích chuẩn hóa',
        headers: {
          server: 'nginx/1.22.1 (Russia proxy redirection)',
          contentType: 'text/html; charset=UTF-8',
          safetyPolicy: 'Không có Content-Security-Policy',
        },
        warningFlags: isSafe ? [] : [
          'Chứa biểu mẫu điền mã OTP bảo mật',
          'Tên miền con trùng lặp nhãn hiệu ngân hàng nhưng không chính gốc',
          'Không có chứng chỉ số an toàn tổ chức EV SSL'
        ],
        sandboxAction: 'Đã cô lập phiên kết nối. Chặn chuyển hướng an toàn.'
      });
      setQrScanning(false);
      playSuccessChime();
    }, 1500);
  };

  // Simulate Deepfake Confidence Evaluation
  const handleDeepfakeAnalyze = () => {
    setDeepfakeLoading(true);
    setDeepfakeResult(null);

    setTimeout(() => {
      setDeepfakeResult({
        confidenceScore: 92.4, // Fake confidence
        verdict: 'AI GENERATED / DEEPFAKE DETECTED',
        indicators: [
          { name: 'Tần số nháy mắt (Blink Rate)', val: '1.2 lần/phút (Mức trung bình người thật là 15-20)', status: 'CRITICAL_ANOMALY' },
          { name: 'Biên độ nhịp môi (Lip-sync Mismatch)', val: 'Lệch pha âm phổ 0.28 giây so với khẩu hình mặt', status: 'CRITICAL_ANOMALY' },
          { name: 'Nhiễu phổ âm tần (Audio Artifacts)', val: 'Phát hiện tần số sóng mang giọng hát nhân tạo Vocoder', status: 'SUSPICIOUS' },
          { name: 'Độ mờ rìa khuôn mặt (Face-border Artifacts)', val: 'Nhiễu mờ hạt quanh vùng xương quai hàm khi quay góc nghiêng', status: 'HIGH_RISK' }
        ],
        explanation: 'Kịch bản cuộc gọi video deepfake lừa đảo cứu trợ gia đình. Đối phương dựng căn phòng mờ ảo, đeo headphone lớn để che lấp các lỗi khớp khuôn mặt và giả vờ tín hiệu sóng chập chờn để cúp máy sớm ngay sau khi dọa dẫm chuyển tiền.'
      });
      setDeepfakeLoading(false);
      playRewardTrophy();
    }, 2000);
  };

  // Simulate OSINT Cross-check Tool
  const handleOSINTCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!osintQuery.trim()) return;

    setOsintLoading(true);
    setOsintResult(null);

    setTimeout(() => {
      const q = osintQuery.trim();
      const isRisk = q.startsWith('098') || q.startsWith('190') || q.includes('888');
      
      setOsintResult({
        identifier: q,
        trustScore: isRisk ? 15 : 92,
        classification: isRisk ? 'HIGHLY_DANGEROUS' : 'CLEAN_HISTORY',
        scannedSources: [
          { name: 'Hệ thống tra cứu NCSC (Trung tâm Giám sát An toàn không gian mạng Quốc gia)', status: isRisk ? 'Có lịch sử trục lợi ngân dịch' : 'An toàn' },
          { name: 'Cục Điện thoại & Đầu số Rác nhà mạng Viễn thông', status: isRisk ? 'Sim kích hoạt rác không chính chủ (mới kích hoạt 15 ngày)' : 'SĐT đã định danh' },
          { name: 'Crowdsourced Scam Database (Cộng đồng ScamGuard)', status: isRisk ? '18 lượt tố cáo lừa đảo tuyển dụng việc làm' : 'Chưa có báo cáo' },
          { name: 'Cổng thông tin Doanh nghiệp & Mã số thuế Quốc gia', status: 'Không liên kết với doanh nghiệp hợp pháp nào' }
        ],
        riskDetails: isRisk 
          ? 'Cảnh báo: Đối tượng xuất hiện với mật độ dày đặc trong các hội nhóm báo cáo đòi nợ thuê ảo và giả danh shipper lừa đảo quẹt thẻ cào.'
          : 'Dữ liệu tra cứu sạch. Đối tượng chưa bị đưa vào danh sách đen báo cáo.'
      });
      setOsintLoading(false);
      playSuccessChime();
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Visual Tab Bar */}
      <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'reputation', label: '🌐 Domain Reputation', icon: Globe },
          { id: 'community', label: '🤝 Community Feed', icon: Database },
          { id: 'qr_sandbox', label: '📱 QR Sandbox Decoder', icon: QrCode },
          { id: 'deepfake', label: '🎥 Deepfake Confidence', icon: Video },
          { id: 'osint', label: '🔎 OSINT Cross-check', icon: Search }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'reputation' && (
          <motion.div
            key="reputation"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>REAL-TIME URL/DOMAIN REPUTATION ENGINE</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Phân tích danh tiếng tên miền qua tuổi thọ đăng ký (WHOIS Age), chứng chỉ bảo mật (SSL Cert Age), và thuật toán khoảng cách Levenshtein chống giả mạo nhãn hiệu ngân hàng (Typosquatting).
              </p>
            </div>

            <form onSubmit={handleCheckReputation} className="flex gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Ví dụ: vietcomBank-xacminh.xyz, mbbanks.online, vneid-gov.vip..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={repLoading || !domainInput.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 font-mono cursor-pointer disabled:opacity-40"
              >
                {repLoading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>DANG QUET...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>THẨM ĐỊNH TÊN MIỀN</span>
                  </>
                )}
              </button>
            </form>

            {repResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-5 rounded-2xl border space-y-4 ${
                  repResult.riskLevel === 'HIGH'
                    ? 'bg-red-950/20 border-red-500/30 text-slate-100'
                    : 'bg-emerald-950/20 border-emerald-500/30 text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-slate-500">KẾT QUẢ ĐỐI TƯỢNG:</p>
                    <p className="text-sm font-black font-mono text-cyan-400">{repResult.domain}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono font-bold text-slate-500">ĐIỂM RỦI RO (RISK SCORE):</p>
                    <p className={`text-xl font-black font-mono ${repResult.riskScore >= 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {repResult.riskScore}/100
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold">• TUỔI ĐĂNG KÝ (WHOIS AGE):</p>
                    <p className="text-slate-200 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{repResult.whoisAge}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold">• CHỨNG CHỈ BẢO MẬT (SSL AGE):</p>
                    <p className="text-slate-200 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{repResult.sslCertAge}</span>
                    </p>
                  </div>
                  {repResult.isTyposquatting && (
                    <div className="sm:col-span-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1 text-xs">
                      <p className="text-rose-400 font-black flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4 animate-bounce" />
                        <span>PHÁT HIỆN TYPOSQUATTING (MẠO DANH NHÃN HIỆU):</span>
                      </p>
                      <p className="text-slate-300">
                        Rất giống thương hiệu chính thức <strong className="text-white">{repResult.closestBrand}</strong> (Khoảng cách Levenshtein: {repResult.levenshtein} ký tự lệch).
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs font-sans leading-relaxed">
                  <p className="font-bold text-white mb-1">Kết luận giám định:</p>
                  <p className="text-slate-300">{repResult.explanation}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeSubTab === 'community' && (
          <motion.div
            key="community"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Notes List Feed */}
            <div className="lg:col-span-7 space-y-4">
              <div className="cartoon-card p-5 bg-slate-900/40 border-slate-800 space-y-3">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>CROWDSOURCED SCAM DATABASE (FEED TÌNH BÁO)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cơ sở dữ liệu lừa đảo đóng góp công khai từ nạn nhân. Người dùng có quyền Upvote/Downvote để tăng hoặc giảm độ tin cậy của thông tin (Cơ chế Community Notes của ScamGuard).
                </p>
              </div>

              {communityNotes.map(note => (
                <div key={note.id} className="cartoon-card p-5 bg-slate-950/60 border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black font-mono text-cyan-400">{note.target}</p>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">{note.scamType}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                      note.verifiedStatus === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {note.verifiedStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{note.description}</p>

                  <div className="flex items-center justify-between pt-2 text-[10px] border-t border-slate-900/60 text-slate-500">
                    <span>Cập nhật: {note.timestamp}</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleVote(note.id, 'up')}
                        className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                          note.userVoted === 'up'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{note.upvotes}</span>
                      </button>

                      <button
                        onClick={() => handleVote(note.id, 'down')}
                        className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                          note.userVoted === 'down'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>{note.downvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Report Sidebar */}
            <div className="lg:col-span-5">
              <div className="cartoon-card p-6 bg-slate-900/60 border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>BÁO CÁO MỐI ĐE DỌA MỚI</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Nếu bạn vừa phát hiện một liên kết lừa đảo, số điện thoại rác dọa nạt, hoặc số tài khoản ngân hàng trung gian nhận tiền phi pháp, hãy tố cáo ngay tại đây để bảo vệ đồng bào.
                </p>

                <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Loại đối tượng:</label>
                    <div className="flex gap-1.5">
                      {['url', 'phone', 'stk'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewType(type as any)}
                          className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer transition-all uppercase font-mono text-[10px] ${
                            newType === type
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Đối tượng cần gán đen:</label>
                    <input
                      type="text"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      placeholder={newType === 'url' ? 'vietcombank-xacminh.xyz' : (newType === 'phone' ? '0912...' : 'STK ngân hàng...')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Kịch bản lừa đảo:</label>
                    <select
                      value={newScamType}
                      onChange={(e) => setNewScamType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="Giả Mạo Thương Hiệu">Giả Mạo Thương Hiệu</option>
                      <option value="Giả danh Công An/VKS">Giả danh Công An/VKS</option>
                      <option value="Bẫy Tuyển Dụng / Nhiệm vụ Telegram">Bẫy Tuyển Dụng / Nhiệm vụ Telegram</option>
                      <option value="Lừa Đảo Giao Hàng (COD)">Lừa Đảo Giao Hàng (COD)</option>
                      <option value="Đầu Tư Sàn Ảo / Coin rác">Đầu Tư Sàn Ảo / Coin rác</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Chi tiết & chứng cứ ban đầu:</label>
                    <textarea
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Nêu rõ đòn tâm lý họ sử dụng và tên miền/STK họ yêu cầu tương tác..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newTarget.trim() || !newDesc.trim()}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all uppercase tracking-wider font-mono cursor-pointer disabled:opacity-40"
                  >
                    GỬI BÁO CÁO CỘNG ĐỒNG
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'qr_sandbox' && (
          <motion.div
            key="qr_sandbox"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>QR CODE PAYLOAD SANDBOX SCANNER</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Phòng chống mã độc Quishing. Nhập hoặc tải ảnh QR để decode payload ngầm, giả lập hiển thị chi tiết tên miền và các rủi ro bên trong một sandbox cô lập an toàn trước khi thực hiện chuyển hướng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Input section */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 font-mono uppercase">Mã URL được mã hóa trong QR:</label>
                  <input
                    type="text"
                    value={qrInputUrl}
                    onChange={(e) => setQrInputUrl(e.target.value)}
                    placeholder="Dán link giải mã của QR Code..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                </div>

                <div className="p-6 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/60 text-center relative hover:border-cyan-500/40 transition-all">
                  <QrCode className="w-8 h-8 text-cyan-400 mx-auto animate-bounce-subtle" />
                  <p className="text-xs text-slate-300 font-bold mt-2">Dán ảnh QR Code cần quét an toàn</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Hệ thống sẽ chạy sandbox phân tích link gốc</p>
                </div>

                <button
                  type="button"
                  onClick={handleQRScan}
                  disabled={qrScanning || !qrInputUrl.trim()}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 font-mono cursor-pointer disabled:opacity-40"
                >
                  {qrScanning ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>CO LẬP HÀNH VI LINK...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>XEM TRƯỚC AN TOÀN TRONG SANDBOX</span>
                    </>
                  )}
                </button>
              </div>

              {/* Safe Sandbox Preview Section */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full filter blur-xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                  <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-extrabold font-mono">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>🛡️ SCAMGUARD SECURE SANDBOX CONTAINER</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-black">
                    VIRTUAL RUNTIME ACTIVE
                  </span>
                </div>

                {qrDecoded ? (
                  <div className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Đường dẫn thực tế đã được chặn đứng:</p>
                      <p className="p-2.5 bg-slate-900 rounded-lg text-rose-300 font-mono break-all text-xs border border-slate-850">
                        {qrDecoded.targetUrl}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Dấu hiệu nhận biết mối nguy hiểm:</p>
                      {qrDecoded.warningFlags.length > 0 ? (
                        <div className="space-y-1.5">
                          {qrDecoded.warningFlags.map((flag: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-1.5 text-rose-400 bg-rose-950/10 p-2 rounded-lg border border-rose-950/30">
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{flag}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/10 p-2 rounded-lg border border-emerald-950/30">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span>Link gốc đạt chuẩn an toàn của ScamGuard Cloud.</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                      <span>Phản ứng Sandbox: <strong className="text-cyan-400">{qrDecoded.sandboxAction}</strong></span>
                      <span className={qrDecoded.isSafe ? 'text-emerald-400' : 'text-rose-400'}>RISK: {qrDecoded.riskScore}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-2">
                    <HelpCircle className="w-8 h-8 text-slate-700 animate-pulse" />
                    <p className="text-xs font-medium font-sans">Chưa có dữ liệu sandbox.</p>
                    <p className="text-[10px] font-mono">Hãy điền link QR và nhấn nút "Xem trước an toàn" để phân tích ngầm.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'deepfake' && (
          <motion.div
            key="deepfake"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Video className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>DEEPFAKE CONFIDENCE SCORE (MULTI-MODAL DETECTION)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Phân tích video/audio cuộc gọi đáng ngờ để phát hiện giọng nói AI voice-clone, lệch pha khớp nhịp môi (lip-sync), và tần suất nháy mắt dị thường (blink rate).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Form */}
              <div className="space-y-4">
                <div className="p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/60 text-center relative hover:border-cyan-500/40 transition-all cursor-pointer">
                  <Video className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                  <p className="text-xs text-slate-300 font-bold mt-2">Dán link video/audio cuộc gọi hoặc tải lên file ghi âm .mp3/.mp4</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Hệ thống sẽ chạy phân tích đa nhân học máy</p>
                </div>

                <button
                  type="button"
                  onClick={handleDeepfakeAnalyze}
                  disabled={deepfakeLoading}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 font-mono cursor-pointer"
                >
                  {deepfakeLoading ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>XỬ LÝ ĐA NHÂN NEURAL...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      <span>CHẠY GIÁM ĐỊNH DEEPFAKE</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Results */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">BÁO CÁO NHẬN DIỆN PHỔ HÌNH ẢNH:</span>
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-black">
                    BIOMETRICS VERIFIED
                  </span>
                </div>

                {deepfakeResult ? (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex items-center justify-between bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-rose-300 font-mono">CHỈ SỐ THIẾT KẾ AI (CONFIDENCE SCORE):</p>
                        <p className="text-base font-black text-rose-400">{deepfakeResult.verdict}</p>
                      </div>
                      <span className="text-2xl font-black text-rose-400 font-mono">{deepfakeResult.confidenceScore}%</span>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Bảng bóc tách điểm dị biệt sinh trắc học:</p>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {deepfakeResult.indicators.map((ind: any, idx: number) => (
                          <div key={idx} className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-850">
                            <span className="text-slate-400">{ind.name}:</span>
                            <span className={ind.status === 'CRITICAL_ANOMALY' ? 'text-rose-400 font-black' : 'text-amber-400'}>
                              {ind.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-xs leading-relaxed">
                      <p className="font-bold text-white mb-1 font-mono">Cách phân tích kịch bản tâm lý:</p>
                      <p className="text-slate-300 font-sans">{deepfakeResult.explanation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-2">
                    <Video className="w-8 h-8 text-slate-700 animate-pulse" />
                    <p className="text-xs font-medium">Chưa có kết quả phân tích.</p>
                    <p className="text-[10px] font-mono">Nhấn nút chạy giám định để bóc tách khuôn mặt và nhịp điệu sinh học giọng nói.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'osint' && (
          <motion.div
            key="osint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Search className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>OSINT CROSS-CHECK TOOL (TRA CỨU CHÉO NGUỒN CÔNG KHAI)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Nhập số điện thoại, số tài khoản ngân hàng thụ hưởng, hoặc email lạ để hệ thống tự động quy vấn chéo các cổng dữ liệu NCSC, nhà mạng viễn thông, và feed tố cáo toàn diện.
              </p>
            </div>

            <form onSubmit={handleOSINTCheck} className="flex gap-2">
              <input
                type="text"
                value={osintQuery}
                onChange={(e) => setOsintQuery(e.target.value)}
                placeholder="Ví dụ: 0988112344, 19038291029..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={osintLoading || !osintQuery.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 font-mono cursor-pointer"
              >
                {osintLoading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>DANG TRUY VAN...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>TRA CỨU CHÉO</span>
                  </>
                )}
              </button>
            </form>

            {osintResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-5 rounded-2xl border space-y-4 ${
                  osintResult.classification === 'HIGHLY_DANGEROUS'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-emerald-950/20 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-slate-500">ĐỐI TƯỢNG TRA CỨU:</p>
                    <p className="text-sm font-black font-mono text-cyan-400">{osintResult.identifier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono font-bold text-slate-500">ĐIỂM ĐỘ TIN CẬY (TRUST SCORE):</p>
                    <p className={`text-xl font-black font-mono ${osintResult.trustScore < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {osintResult.trustScore}/100
                    </p>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Báo cáo chéo từ các cổng nguồn:</p>
                  <div className="space-y-2">
                    {osintResult.scannedSources.map((src: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs">
                        <span className="text-slate-300 font-sans">{src.name}</span>
                        <span className={`font-mono text-[11px] font-black ${
                          src.status.includes('An toàn') || src.status.includes('Chưa có')
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}>
                          {src.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 text-xs leading-relaxed">
                    <p className="font-bold text-white mb-1 font-mono">Lưu ý rủi ro:</p>
                    <p className="text-slate-300">{osintResult.riskDetails}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
