import React from 'react';
import { Bell, Shield, AlertTriangle, Trophy, Zap, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif_1',
      title: 'Cảnh báo chiến dịch lừa đảo Deepfake mới',
      desc: 'Phát hiện cuộc gọi giả mạo giọng nói lãnh đạo yêu cầu chuyển khoản gấp. Hãy bật Khiên Lọc Giọng Nói.',
      time: '15 phút trước',
      type: 'danger',
      tab: 'train',
    },
    {
      id: 'notif_2',
      title: 'Cập nhật danh sách đen tài khoản quốc gia',
      desc: 'Hệ thống ViSEF đã thêm 145 số tài khoản và URL giả mạo mới vào cơ sở dữ liệu xác thực.',
      time: '2 giờ trước',
      type: 'warning',
      tab: 'check',
    },
    {
      id: 'notif_3',
      title: 'Lời thách đấu Đấu trường Scam Arena',
      desc: 'Đồng chí Minh Triết vừa gửi lời thách đấu 1v1 đối kháng kịch bản lừa đảo tài chính.',
      time: '5 giờ trước',
      type: 'info',
      tab: 'train',
    },
    {
      id: 'notif_4',
      title: 'Nhiệm vụ hàng ngày đã sẵn sàng',
      desc: 'Hoàn thành 3 bài học và giám định 2 tin nhắn nghi vấn để nhận +150 XP và Kim Cương.',
      time: 'Hôm nay',
      type: 'success',
      tab: 'quests',
    },
    {
      id: 'notif_5',
      title: 'Báo cáo an ninh ViSEF 2026',
      desc: 'Chỉ số phòng thủ cá nhân của bạn đạt mức Xuất Sắc (94/100). Tiếp tục duy trì chuỗi bảo mật!',
      time: 'Hôm qua',
      type: 'success',
      tab: 'progress',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
              <Bell className="w-5 h-5 animate-swing" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">Trung Tâm Thông Báo & Cảnh Báo</h2>
              <p className="text-xs text-slate-400">Cập nhật tin tức an ninh và sự kiện phòng tuyến số</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onNavigate(item.tab);
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group flex items-start space-x-3.5"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === 'danger'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800/60'
                    : item.type === 'warning'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                    : item.type === 'success'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                }`}
              >
                {item.type === 'danger' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : item.type === 'warning' ? (
                  <Shield className="w-4 h-4" />
                ) : item.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">Tất cả thông báo được bảo mật bởi ViSEF</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
          >
            Đã Đọc Tất Cả
          </button>
        </div>
      </motion.div>
    </div>
  );
};
