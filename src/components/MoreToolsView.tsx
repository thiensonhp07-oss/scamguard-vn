import React, { useState } from 'react';
import {
  MoreHorizontal,
  Shield,
  PhoneCall,
  Users,
  AlertTriangle,
  Lock,
  Eye,
  Radio,
  Brain,
  Radar,
  Wifi,
  Sparkles,
  Database,
  Globe,
  Clock,
  Zap,
  Grid,
  Palette
} from 'lucide-react';
import { SocialGrowthSuite } from './SocialGrowthSuite';
import { PersonalDataSuite } from './PersonalDataSuite';
import { RealTimeResponseSuite } from './RealTimeResponseSuite';
import { AdaptivePersonalizationSuite } from './AdaptivePersonalizationSuite';
import { DetectionAnalysisSuite } from './DetectionAnalysisSuite';
import { AdvancedUtilitiesSuite } from './AdvancedUtilitiesSuite';

interface MoreToolsViewProps {
  onOpenEmergency: () => void;
  onOpenFriends: () => void;
  onOpenTrustedContacts: () => void;
  onOpenFamilySchool: () => void;
  onOpenPrivacyCenter: () => void;
  onOpenCallSim: () => void;
  onOpenSentinel?: () => void;
  onOpenDecoder?: () => void;
  onOpenRadar?: () => void;
  onOpenWifiShield?: () => void;
  onOpenTheme?: () => void;
  userProfile?: any;
  onEarnXp?: (xp: number) => void;
  posts?: any[];
  onAddPost?: (newPost: any) => void;
  onReactPost?: (postId: string, reaction: any) => void;
  onAddComment?: (postId: string, commentText: string) => void;
  onSharePost?: (postId: string) => void;
  onToggleFollowUser?: (userId: string) => void;
}

export const MoreToolsView: React.FC<MoreToolsViewProps> = ({
  onOpenEmergency,
  onOpenFriends,
  onOpenTrustedContacts,
  onOpenFamilySchool,
  onOpenPrivacyCenter,
  onOpenCallSim,
  onOpenSentinel,
  onOpenDecoder,
  onOpenRadar,
  onOpenWifiShield,
  onOpenTheme,
  userProfile = { streakDays: 3, overallScore: 82 },
  onEarnXp = () => {},
  posts,
  onAddPost,
  onReactPost,
  onAddComment,
  onSharePost,
  onToggleFollowUser,
}) => {
  const [activeToolTab, setActiveToolTab] = useState<'grid' | 'social' | 'personal_data' | 'realtime' | 'adaptive' | 'detection' | 'utilities'>('grid');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="cartoon-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 flex items-center space-x-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg flex-shrink-0 animate-pulse">
          <MoreHorizontal className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Tiện Ích & Công Cụ Khẩn Cấp</h1>
          <p className="text-sm text-slate-300 mt-1 font-medium">
            Phòng vệ chủ động! Giám sát thông tin PII, bóc tách kịch bản, huấn luyện phản xạ cuộc gọi dọa nạt, kích hoạt SOS, và quản lý bảo mật gia đình.
          </p>
        </div>
      </div>

      {/* Main Suite Tab Selector with Design Tokens */}
      <div className="flex flex-wrap gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'grid', label: '🛠️ LỚP PHÒNG THỦ', icon: Grid },
          { id: 'detection', label: '🛰️ TÌNH BÁO SCAM', icon: Radar },
          { id: 'utilities', label: '⚡ TIỆN ÍCH PHÒNG VỆ', icon: Zap },
          { id: 'social', label: '👨‍👩‍👧‍👦 SOCIAL & GROWTH', icon: Users },
          { id: 'personal_data', label: '🔐 DATA PRIVACY', icon: Lock },
          { id: 'realtime', label: '🚨 PHẢN ỨNG SOS', icon: AlertTriangle },
          { id: 'adaptive', label: '🧠 ADAPTIVE PSYCH', icon: Brain }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeToolTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveToolTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
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

      {/* Content Renderers */}
      {activeToolTab === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Scam Speech & Script Decoder AI */}
          {onOpenDecoder && (
            <div
              onClick={onOpenDecoder}
              className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                  AI SCRIPT DECODER
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">
                Bóc Tách Kịch Bản & Tâm Lý Lừa Đảo
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Bóc tách 5 đòn tâm lý chính (Hoảng loạn, Ép thời gian, Uy hiếp) trong tin nhắn/thoại và cung cấp ngay Kịch Bản Phản Đòn thông minh.
              </p>
            </div>
          )}

          {/* Live Threat Scam Radar 24/7 */}
          {onOpenRadar && (
            <div
              onClick={onOpenRadar}
              className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <Radar className="w-6 h-6 animate-spin-slow" />
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                  LIVE RADAR 24/7
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-rose-400 transition-colors">
                Ra-đa Cảnh Báo Lừa Đảo Nóng Theo Vùng
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Cập nhật bản đồ rủi ro lừa đảo đang bùng phát (eTax giả, Báo động cấp cứu viện, Trộm QR) tại TP.HCM, Hà Nội và tỉnh thành.
              </p>
            </div>
          )}

          {/* Public Wi-Fi & NFC Shield */}
          {onOpenWifiShield && (
            <div
              onClick={onOpenWifiShield}
              className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Wifi className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                  WIFI & NFC SHIELD
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                Phòng Thủ Wi-Fi Công Cộng, NFC & QR Code
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Mô phỏng phát hiện Wi-Fi Evil Twin bẫy bắt trộm mật khẩu ngân hàng tại quán cà phê & Khóa chip NFC quẹt trộm ngầm.
              </p>
            </div>
          )}

          {/* Screen Context Sentinel Pro Tool */}
          {onOpenSentinel && (
            <div
              onClick={onOpenSentinel}
              className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border-2 border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-wider">
                  PRO SHIELD (VISION)
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-teal-400 transition-colors">
                Screen Context Sentinel (Gemini)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Dịch vụ chạy ngầm theo dõi màn hình khi mở file APK lạ (VNeID, Thuế) hoặc trang web đòi OTP. Kích hoạt lớp cảnh báo đỏ tức thì.
              </p>
            </div>
          )}

          {/* Live Audio Voice-Clone Guard Call Sim */}
          <div
            onClick={onOpenCallSim}
            className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                LIVE VOICE GUARD
              </span>
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">
              Live Audio Voice-Clone Guard
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Mô phỏng phân tích nhịp điệu & phổ âm tần số khi nhận cuộc gọi giả mạo giọng người thân, công an để phát hiện giọng nhân tạo Deepfake.
            </p>
          </div>

          {/* Theme Studio Customizer Tool */}
          {onOpenTheme && (
            <div
              onClick={onOpenTheme}
              className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                  THEME STUDIO 2026
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                Tùy Biến Giao Diện & Màu Sắc Đa Dạng
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Khám phá 10+ bộ chủ đề tương lai (Cyberpunk, Matrix, Synthwave, Hổ phách hoàng kim, OLED Black, Clean Light), hiệu ứng ánh sáng neon và chế độ hỗ trợ thị giác.
              </p>
            </div>
          )}

          {/* Emergency 24/7 */}
          <div
            onClick={onOpenEmergency}
            className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-rose-400 transition-colors">
              Quy Trình Khẩn Cấp 24/7 & Khóa Máy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Hướng dẫn khóa tài khoản ngân hàng ngay lập tức, báo công an và vô hiệu hóa thiết bị khi bị chiếm đoạt tài sản.
            </p>
          </div>

          {/* Guardian Emergency Dial / Trusted Contacts */}
          <div
            onClick={onOpenTrustedContacts}
            className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
              Chế Độ Người Thân (Guardian Emergency)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Thiết lập mật khẩu bí mật gia đình và tự động nhắn tin cấp báo cho con cháu khi người lớn tuổi chuyển khoản nguy cơ cao.
            </p>
          </div>

          {/* Privacy Center */}
          <div
            onClick={onOpenPrivacyCenter}
            className="cartoon-card p-6 cursor-pointer shadow-xl space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
              Trung Tâm Bảo Mật & On-Device PII
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Cấu hình che đen thông tin nhạy cảm, xuất dữ liệu cá nhân (GDPR) và quản lý quyền truy cập dữ liệu.
            </p>
          </div>
        </div>
      )}

      {activeToolTab === 'social' && (
        <SocialGrowthSuite
          userProfile={userProfile}
          onEarnXp={onEarnXp}
          posts={posts}
          onAddPost={onAddPost}
          onReactPost={onReactPost}
          onAddComment={onAddComment}
          onSharePost={onSharePost}
          onToggleFollowUser={onToggleFollowUser}
        />
      )}

      {activeToolTab === 'detection' && (
        <DetectionAnalysisSuite userProfile={userProfile} onEarnXp={onEarnXp} />
      )}

      {activeToolTab === 'utilities' && (
        <AdvancedUtilitiesSuite onEarnXp={onEarnXp} />
      )}

      {activeToolTab === 'personal_data' && (
        <PersonalDataSuite />
      )}

      {activeToolTab === 'realtime' && (
        <RealTimeResponseSuite />
      )}

      {activeToolTab === 'adaptive' && (
        <AdaptivePersonalizationSuite />
      )}
    </div>
  );
};
