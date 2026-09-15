import React, { useState } from 'react';
import {
  Shield,
  Trash2,
  Download,
  Lock,
  EyeOff,
  FileText,
  Check,
  AlertTriangle,
  X,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface PrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onDataCleared?: () => void;
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({
  isOpen,
  onClose,
  userId = 'guest_user',
  onDataCleared,
}) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportData = async () => {
    setDownloading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/account/export', {
        headers: { 'x-user-id': userId },
      });
      if (!res.ok) throw new Error('Không thể xuất dữ liệu');
      const data = await res.json();

      // Trigger download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scamguard-defense-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage('Đã tải xuống toàn bộ dữ liệu hồ sơ và lịch sử huấn luyện thành công!');
    } catch (err: any) {
      setStatusMessage('Lỗi khi xuất dữ liệu: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleResetAllResearchData = async () => {
    setDeleting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/research/reset', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Không thể reset dữ liệu hệ thống');
      const data = await res.json();

      // Clear local storage completely
      localStorage.clear();

      setStatusMessage(data.message || 'Đã đưa toàn bộ hệ thống về trạng thái 0 (N = 0) phục vụ thu thập thực tế.');
      setDeleteConfirm(false);
      if (onDataCleared) onDataCleared();
    } catch (err: any) {
      setStatusMessage('Lỗi khi reset hệ thống: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteData = async () => {
    setDeleting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/account/data', {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      });
      if (!res.ok) throw new Error('Không thể xóa dữ liệu');

      // Clear local storage
      localStorage.removeItem('scamguard_user_profile');
      localStorage.removeItem('scamguard_current_arena_session');

      setStatusMessage('Đã xóa sạch toàn bộ hồ sơ, lịch sử tác chiến và dữ liệu cá nhân.');
      setDeleteConfirm(false);
      if (onDataCleared) onDataCleared();
    } catch (err: any) {
      setStatusMessage('Lỗi khi xóa dữ liệu: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Trung Tâm Quyền Riêng Tư & Bảo Mật</h2>
              <p className="text-xs text-slate-400">Cam kết bảo vệ dữ liệu và nguyên tắc Privacy-by-Design</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center space-x-2">
            <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 4 Pillars of Privacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <EyeOff className="w-4 h-4" />
              <span>Tự Động Ẩn Danh PII</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Mọi số thẻ ngân hàng, CCCD, OTP, mật khẩu hay số điện thoại bạn nhập đều được thay thế bằng mã che <code>[REDACTED]</code> trước khi xử lý.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>Không Lưu Trữ Tin Nhắn Thật</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Các đoạn chat kiểm tra chỉ lưu tạm thời phục vụ tính điểm phòng thủ và tự động hủy sau khi phiên kết thúc.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 text-purple-400 font-bold">
              <Download className="w-4 h-4" />
              <span>Quyền Xuất Dữ Liệu Cá Nhân</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Bạn có toàn quyền tải về trọn bộ hồ sơ chỉ số phản xạ Scam DNA và lịch sử huấn luyện dưới dạng tệp JSON tiêu chuẩn.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 text-rose-400 font-bold">
              <Trash2 className="w-4 h-4" />
              <span>Quyền Được Quên Lãng</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Xóa hoàn toàn mọi thông tin, phiên diễn tập và thành tích chỉ bằng một cú nhấp chuột không thể phục hồi.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Quản Lý Dữ Liệu & Khởi Động Nghiên Cứu Minh Bạch</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              ViSEF / ISEF Ready
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleResetAllResearchData}
              disabled={deleting}
              className="w-full py-3 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-purple-400 ${deleting ? 'animate-spin' : ''}`} />
              <span>
                {deleting ? 'Đang dọn dẹp hệ thống...' : 'Reset Toàn Bộ Dữ Liệu & Thống Kê Về 0 (Khởi Động Thực Nghiệm Học Sinh)'}
              </span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportData}
                disabled={downloading}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>{downloading ? 'Đang xuất tệp...' : 'Xuất Toàn Bộ Dữ Liệu (JSON)'}</span>
              </button>

              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Xóa Dữ Liệu Cá Nhân</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDeleteData}
                    disabled={deleting}
                    className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{deleting ? 'Đang xóa...' : 'Xác Nhận Xóa Vĩnh Viễn'}</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="py-3 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Disclaimers */}
        <div className="text-[11px] text-slate-500 space-y-1">
          <p>
            * SCAMGUARD là nền tảng huấn luyện phòng thủ phi lợi nhuận phục vụ cộng đồng. Chúng tôi không bao giờ bán dữ liệu người dùng hay chia sẻ cho bên thứ ba.
          </p>
          <p>
            * Phiên bản hiện tại tuân thủ nghiêm ngặt khung bảo vệ an toàn thông tin và chính sách bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.
          </p>
        </div>
      </div>
    </div>
  );
};
