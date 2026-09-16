import React, { useState, useEffect } from 'react';
import { UserAccount, ExperienceMode, UserProfile } from '../types';
import {
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Shield,
  ArrowRight,
  LogIn,
  UserPlus,
  KeyRound,
  HelpCircle,
  RefreshCw,
  Award,
} from 'lucide-react';
import { playSuccessChime, playAlertWarning } from '../utils/audioEffects';
import { handleAvatarError } from '../utils/avatarFallback';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onLogout: () => void;
}

const AVATAR_PRESETS = [
  { id: 'owl', label: 'CyberGuard AI 🤖', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face' },
  { id: 'shield', label: 'Vệ Binh Khiên 🛡️', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face' },
  { id: 'senior', label: 'Cao Niên Minh Triết 👴', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face' },
  { id: 'student', label: 'Học Sinh Thế Hệ Số 🎓', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face' },
];

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}: AuthModalProps) {
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot' | 'presets'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMode, setRegMode] = useState<ExperienceMode>('adult');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [presets, setPresets] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      fetchPresets();
    }
  }, [isOpen]);

  const fetchPresets = async () => {
    try {
      const res = await fetch('/api/auth/presets');
      if (res.ok) {
        const data = await res.json();
        if (data.presets) {
          setPresets(data.presets);
          return;
        }
      }
    } catch (e) {
      // Quiet fallback for presets
    }
  };

  if (!isOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Chưa nhập', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Yếu', color: 'bg-rose-500', width: '25%' };
    if (score <= 3) return { score: 2, label: 'Khá an toàn', color: 'bg-amber-500', width: '65%' };
    return { score: 3, label: 'Rất mạnh', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength(regPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setSuccessMsg(`Chào mừng trở lại, ${data.user.name}!`);
        localStorage.setItem('scamguard_token', data.user.token);
        localStorage.setItem('scamguard_user_id', data.user.id);
        playSuccessChime();
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      } else {
        playAlertWarning();
        setErrorMsg(data.error || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } catch (err: any) {
      playAlertWarning();
      setErrorMsg('Không thể kết nối đến máy chủ xác thực.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          username: regUsername.trim(),
          email: regEmail.trim() || undefined,
          password: regPassword,
          mode: regMode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        if (selectedAvatar) {
          data.user.avatarUrl = selectedAvatar;
        }
        setSuccessMsg(`Tạo tài khoản thành công! Xin chào ${data.user.name}.`);
        localStorage.setItem('scamguard_token', data.user.token);
        localStorage.setItem('scamguard_user_id', data.user.id);
        playSuccessChime();
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 700);
      } else {
        playAlertWarning();
        setErrorMsg(data.error || 'Đăng ký tài khoản không thành công.');
      }
    } catch (err: any) {
      playAlertWarning();
      setErrorMsg('Lỗi kết nối khi đăng ký tài khoản vào máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotSent(true);
      playSuccessChime();
    }, 800);
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'github') => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const providerNames: Record<string, string> = {
        google: 'Google',
        facebook: 'Facebook',
        github: 'GitHub',
      };

      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          name: `Vệ Binh ${providerNames[provider]}`,
          mode: regMode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setSuccessMsg(`Đăng nhập thành công qua ${provider.toUpperCase()}!`);
        localStorage.setItem('scamguard_token', data.user.token);
        localStorage.setItem('scamguard_user_id', data.user.id);
        playSuccessChime();
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      } else {
        playAlertWarning();
        setErrorMsg(data.error || 'Đăng nhập mạng xã hội không thành công.');
      }
    } catch (err: any) {
      playAlertWarning();
      setErrorMsg('Không thể kết nối đến cổng đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = async (presetId: string) => {
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: presetId,
          password: '',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setSuccessMsg(`Đã kích hoạt hồ sơ: ${data.user.name}`);
        localStorage.setItem('scamguard_token', data.user.token);
        playSuccessChime();
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 500);
      } else {
        playAlertWarning();
        setErrorMsg('Không thể chuyển sang hồ sơ mẫu này.');
      }
    } catch (e) {
      playAlertWarning();
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="auth-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 font-semibold shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {currentUser ? 'Hồ Sơ Vệ Binh' : 'Tài Khoản Vệ Binh An Ninh'}
              </h2>
              <p className="text-xs text-slate-400">
                Đồng bộ Scam DNA, huy hiệu danh dự và bảo vệ đa thiết bị
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User is logged in: Profile Dashboard */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face'}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                onError={(e) => handleAvatarError(e, currentUser.name)}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-white truncate">{currentUser.name}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                    {currentUser.provider === 'local' ? 'Cá nhân' : currentUser.provider.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">@{currentUser.username}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-slate-300">
                  <span>Điểm: <strong className="text-cyan-400">{currentUser.profile.overallScore || 80}/100</strong></span>
                  <span>XP: <strong className="text-amber-400">{currentUser.profile.xp || 0}</strong></span>
                  <span>Chuỗi: <strong className="text-emerald-400">{currentUser.profile.streakDays || 1} ngày</strong></span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Chuyển nhanh sang hồ sơ thử nghiệm mẫu
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`text-left p-3 rounded-2xl border text-xs transition-all flex items-center space-x-3 cursor-pointer ${
                      currentUser.id === preset.id
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 font-bold'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <img
                      src={preset.avatarUrl}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleAvatarError(e, preset.name)}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold truncate">{preset.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{preset.score}/100 điểm</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                id="logout-btn"
                onClick={() => {
                  localStorage.removeItem('scamguard_token');
                  localStorage.removeItem('scamguard_user_id');
                  onLogout();
                  setAuthTab('login');
                }}
                className="px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/40 rounded-xl transition-colors cursor-pointer"
              >
                Đăng Xuất Khỏi Thiết Bị
              </button>
              <button
                onClick={onClose}
                className="btn-tactile btn-tactile-slate px-6 py-2.5 text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Tab switchers */}
            <div className="flex p-1.5 bg-slate-950 rounded-2xl border border-slate-800 gap-1">
              <button
                id="tab-btn-login"
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-cyan-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
              <button
                id="tab-btn-register"
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-cyan-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng Ký</span>
              </button>
              <button
                id="tab-btn-presets"
                type="button"
                onClick={() => {
                  setAuthTab('presets');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  authTab === 'presets'
                    ? 'bg-cyan-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Hồ Sơ Mẫu</span>
              </button>
            </div>

            {/* Error / Success alerts */}
            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-xs text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Tên đăng nhập hoặc Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-username-input"
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="Ví dụ: bacthanh68 hoặc email@domain.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">Mật khẩu</label>
                    <button
                      type="button"
                      onClick={() => setAuthTab('forgot')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu của bạn"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    id="remember-me-cb"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="remember-me-cb" className="cursor-pointer">
                    Ghi nhớ đăng nhập trên thiết bị này
                  </label>
                </div>

                <button
                  id="submit-login-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full btn-tactile btn-tactile-cyan py-3 text-xs sm:text-sm font-black flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {loading ? (
                    <span>Đang xác thực tài khoản...</span>
                  ) : (
                    <>
                      <span>ĐĂNG NHẬP VỆ BINH</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Họ và Tên
                  </label>
                  <input
                    id="register-name-input"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Tên Đăng Nhập
                    </label>
                    <input
                      id="register-username-input"
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="vanan2026"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Chế Độ Trải Nghiệm
                    </label>
                    <select
                      id="register-mode-select"
                      value={regMode}
                      onChange={(e) => setRegMode(e.target.value as ExperienceMode)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="adult">Người Lớn (Toàn diện)</option>
                      <option value="senior">Người Cao Tuổi (Chữ lớn & trợ lý)</option>
                      <option value="teen">Sinh Viên / Thiếu Niên</option>
                      <option value="kids">Trẻ Em / Học Sinh</option>
                      <option value="family">Gia Đình Bảo Vệ</option>
                    </select>
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Chọn Biểu Tượng Vệ Binh Đại Diện
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_PRESETS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.url)}
                        className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                          selectedAvatar === av.url
                            ? 'bg-cyan-950 border-cyan-400 ring-2 ring-cyan-400/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleAvatarError(e, av.label)}
                          className="w-9 h-9 rounded-full object-cover mx-auto mb-1"
                        />
                        <span className="text-[10px] text-slate-300 font-bold block truncate">
                          {av.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    id="register-email-input"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="vanan@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mật Khẩu
                  </label>
                  <input
                    id="register-password-input"
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 4 ký tự"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  {/* Live Password Strength Meter */}
                  {regPassword && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-400">Độ mạnh mật khẩu:</span>
                        <span className={strength.score === 3 ? 'text-emerald-400' : strength.score === 2 ? 'text-amber-400' : 'text-rose-400'}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: strength.width }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  id="submit-register-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full btn-tactile btn-tactile-cyan py-3 text-xs sm:text-sm font-black flex items-center justify-center space-x-2 disabled:opacity-50 mt-2 cursor-pointer shadow-lg"
                >
                  {loading ? (
                    <span>Đang khởi tạo tài khoản...</span>
                  ) : (
                    <>
                      <span>TẠO TÀI KHOẢN VỆ BINH</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB: FORGOT PASSWORD */}
            {authTab === 'forgot' && (
              <div className="space-y-4">
                {!forgotSent ? (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl">
                        🔑
                      </div>
                      <h3 className="text-base font-black text-white">Khôi Phục Mật Khẩu</h3>
                      <p className="text-xs text-slate-400">
                        Nhập địa chỉ email đăng ký để nhận mã liên kết đặt lại mật khẩu an toàn:
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Email đã đăng ký
                      </label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-tactile btn-tactile-cyan py-3 text-xs font-bold"
                    >
                      {loading ? 'Đang gửi mã...' : 'Gửi Mã Xác Nhận Khôi Phục'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthTab('login')}
                      className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 cursor-pointer"
                    >
                      Quay lại Đăng Nhập
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-4 py-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-base font-black text-white">Đã gửi hướng dẫn khôi phục!</h3>
                    <p className="text-xs text-slate-300 max-w-xs mx-auto">
                      Vui lòng kiểm tra hộp thư đến tại <strong>{forgotEmail}</strong> để hoàn tất đặt mật khẩu mới.
                    </p>
                    <button
                      onClick={() => {
                        setForgotSent(false);
                        setAuthTab('login');
                      }}
                      className="btn-tactile btn-tactile-slate px-6 py-2.5 text-xs font-bold"
                    >
                      Về Màn Hình Đăng Nhập
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PRESETS */}
            {authTab === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Chọn 1 tài khoản mẫu có sẵn dưới đây để trải nghiệm ngay với dữ liệu thực tế:
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className="w-full text-left p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500 transition-all flex items-center space-x-3.5 group cursor-pointer"
                    >
                      <img
                        src={preset.avatarUrl}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleAvatarError(e, preset.name)}
                        className="w-11 h-11 rounded-full object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {preset.name}
                          </p>
                          <span className="text-xs text-cyan-400 font-bold ml-2">
                            {preset.score}đ
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {preset.roleDescription}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Social Authentication */}
            {authTab !== 'presets' && authTab !== 'forgot' && (
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                    Hoặc đăng nhập với 1 chạm
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    id="social-auth-google"
                    type="button"
                    onClick={() => handleSocialAuth('google')}
                    disabled={loading}
                    className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 11.3 0 14s.7 5.3 1.9 7.7l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.8-2.5 1.3-4.3 1.3-3 0-5.5-2.4-6.4-5.2L1.9 16.1C3.7 19.8 7.5 23 12 23z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    id="social-auth-facebook"
                    type="button"
                    onClick={() => handleSocialAuth('facebook')}
                    disabled={loading}
                    className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>

                  <button
                    id="social-auth-github"
                    type="button"
                    onClick={() => handleSocialAuth('github')}
                    disabled={loading}
                    className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-slate-200" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
