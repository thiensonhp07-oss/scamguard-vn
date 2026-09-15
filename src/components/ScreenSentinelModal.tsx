import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  Smartphone,
  AlertOctagon,
  Eye,
  CheckCircle2,
  Lock,
  Zap,
  PhoneCall,
  Bell,
  Sparkles,
  FileCode,
  Globe,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScreenSentinelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergency?: () => void;
}

export const ScreenSentinelModal: React.FC<ScreenSentinelModalProps> = ({
  isOpen,
  onClose,
  onOpenEmergency,
}) => {
  const [isSentinelActive, setIsSentinelActive] = useState(true);
  const [activeSimulation, setActiveSimulation] = useState<
    'vneid_apk' | 'tax_apk' | 'phishing_otp' | 'blacklisted_stk' | null
  >(null);
  const [showRedAlertOverlay, setShowRedAlertOverlay] = useState(false);

  if (!isOpen) return null;

  const triggerSimulation = (type: 'vneid_apk' | 'tax_apk' | 'phishing_otp' | 'blacklisted_stk') => {
    setActiveSimulation(type);
    setShowRedAlertOverlay(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 bg-slate-900/95 shadow-2xl space-y-6 overflow-hidden my-8"
      >
        {/* Background glow */}
        <div className="glow-orb-cyan top-0 right-0 opacity-20" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Eye className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-extrabold uppercase">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Gemini Vision On-Device Pro Shield</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Screen Context Sentinel</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sentinel Active Status Control */}
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isSentinelActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
              }`}
            />
            <div>
              <p className="text-sm font-bold text-white">
                {isSentinelActive ? 'Trợ Lý Sentinel Đang Giám Sát Màn Hình' : 'Sentinel Tạm Tắt'}
              </p>
              <p className="text-xs text-slate-400">
                Phân tích ngữ cảnh trực tiếp khi mở tệp APK lạ, web trộm OTP hoặc giao diện chuyển khoản.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSentinelActive(!isSentinelActive)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              isSentinelActive
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isSentinelActive ? 'ĐANG BẬT' : 'BẬT LẠI'}
          </button>
        </div>

        {/* Feature Explainer */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Thử Nghiệm Phản Xạ Cảnh Báo Màn Hình Đỏ (Red Overlay)</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Chọn một trong các kịch bản thực tế dưới đây để kích hoạt thử nghiệm Sentinel. Khi phát hiện mã độc hoặc trang web thu thập mã OTP, hệ thống lập tức chèn lớp khóa đỏ đè lên màn hình:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => triggerSimulation('vneid_apk')}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/60 text-left space-y-2 transition-all group cursor-pointer hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <FileCode className="w-5 h-5 text-rose-400" />
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  CỰC KỲ NGUY HIỂM
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-rose-300">
                Mở file APK VNeID Giả Mạo
              </p>
              <p className="text-[11px] text-slate-400">
                Yêu cầu cấp quyền Accessibility (Truy cập màn hình) để chiếm quyền điều khiển.
              </p>
            </button>

            <button
              onClick={() => triggerSimulation('tax_apk')}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/60 text-left space-y-2 transition-all group cursor-pointer hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  MÃ ĐỘC TÀI CHÍNH
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-amber-300">
                Tải App Thuế eTax.apk Ngoại Luồng
              </p>
              <p className="text-[11px] text-slate-400">
                Tải về từ link `.xyz`, yêu cầu tắt tính năng bảo vệ hệ điều hành.
              </p>
            </button>

            <button
              onClick={() => triggerSimulation('phishing_otp')}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 text-left space-y-2 transition-all group cursor-pointer hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  TRỘM MÃ OTP
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-cyan-300">
                Trang Web Yêu Cầu Nhập OTP
              </p>
              <p className="text-[11px] text-slate-400">
                Trang web giả mạo giao diện ngân hàng đòi nhập OTP hủy lệnh chuyển tiền.
              </p>
            </button>

            <button
              onClick={() => triggerSimulation('blacklisted_stk')}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/60 text-left space-y-2 transition-all group cursor-pointer hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <Lock className="w-5 h-5 text-purple-400" />
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  CẢNH BÁO CHUYỂN TIỀN
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-purple-300">
                Chuyển Tiền Vào STK Blacklist
              </p>
              <p className="text-[11px] text-slate-400">
                Dành cho chế độ người thân: Khóa tạm thời và báo động tới con cháu.
              </p>
            </button>
          </div>
        </div>

        {/* Simulated Red Warning Overlay */}
        <AnimatePresence>
          {showRedAlertOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/90 backdrop-blur-xl border-4 border-rose-600"
            >
              <div className="max-w-xl w-full text-center space-y-6 p-6 sm:p-8 bg-slate-950 rounded-3xl border-2 border-rose-500 shadow-2xl relative overflow-hidden">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 animate-bounce shadow-xl shadow-rose-500/40">
                  <AlertOctagon className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-black uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>CẢNH BÁO NGUY HIỂM TỘI PHẠM MẠNG</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    LỚP PHÒNG THỦ CẢNH BÁO ĐỎ TỰ ĐỘNG
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {activeSimulation === 'vneid_apk' &&
                      'Phát hiện file APK "VNeID_CapNhat.apk" yêu cầu quyền CẤP QUYỀN TRUY CẬP HỆ THỐNG (Accessibility Service)! Đây là ứng dụng độc hại nhằm tự động đọc tin nhắn OTP và chiếm quyền chuyển tiền ngân hàng.'}
                    {activeSimulation === 'tax_apk' &&
                      'Phát hiện tệp "eTax_Mobile_2026.apk" tải từ nguồn lạ bên ngoài CH Play/App Store! Lớp lá chắn khuyên bạn HUỶ CÀI ĐẶT NGAY BÂY GIỜ.'}
                    {activeSimulation === 'phishing_otp' &&
                      'Phát hiện giao diện yêu cầu nhập mã OTP ngân hàng trên tên miền lạ "vcb-digibank.ebank-xacthuc.xyz"! ĐÂY LÀ TRANG WEB CÂU TRỘM TÀI KHOẢN.'}
                    {activeSimulation === 'blacklisted_stk' &&
                      'Phát hiện thao tác chuyên tiền tới STK [19038291029] nằm trong DANH SÁCH ĐEN LỪA ĐẢO CỦA CÔNG AN! Màn hình bị khóa tạm thời để bảo vệ số dư.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-rose-500/40 text-left space-y-2">
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Zap className="w-4 h-4" />
                    <span>Hành động tự động (Agentic Autonomous Action) từ CyberGuard:</span>
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>Đã tự động khóa màn hình thao tác & ngắt kết nối phiên làm việc độc hại</li>
                    <li>Đã chặn tiến trình cài đặt file APK ngầm trong nền hệ thống</li>
                    <li>Sẵn sàng khởi tạo vé báo cáo vi phạm khẩn cấp tới NCSC Việt Nam</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setShowRedAlertOverlay(false)}
                    className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all shadow-lg shadow-rose-600/30 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>XÁC NHẬN CHẶN MÃ ĐỘC & ĐÓNG TỆP</span>
                  </button>

                  {onOpenEmergency && (
                    <button
                      onClick={() => {
                        setShowRedAlertOverlay(false);
                        onOpenEmergency();
                      }}
                      className="px-5 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs border border-amber-500 transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>BÁO KHẨN CHO NGƯỜI THÂN (24/7)</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
