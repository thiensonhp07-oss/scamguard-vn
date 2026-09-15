import React, { useState } from 'react';
import {
  Users,
  Shield,
  Gift,
  Swords,
  Flame,
  UserPlus,
  Copy,
  Check,
  Sparkles,
  Heart,
  Share2,
  AlertTriangle,
  Send,
  X,
  QrCode,
  Award,
  Zap,
} from 'lucide-react';
import { FriendUser, FriendActivityEvent, UserProfile, UserAccount } from '../types';
import { playSuccessChime, playChestFanfare, playDuelBell } from '../utils/audioEffects';
import { handleAvatarError } from '../utils/avatarFallback';
import confetti from 'canvas-confetti';

interface FriendsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  userProfile: UserProfile;
  friendsList: FriendUser[];
  activityFeed: FriendActivityEvent[];
  onSendGift: (friendId: string) => void;
  onStartDuel: (friend: FriendUser) => void;
  onAddFriend: (friendCodeOrUsername: string) => { success: boolean; message: string };
  onLikeActivity: (activityId: string) => void;
  onBroadcastSos: (message: string) => void;
}

export const FriendsHubModal: React.FC<FriendsHubModalProps> = ({
  isOpen,
  onClose,
  currentUser = null,
  userProfile,
  friendsList = [],
  activityFeed = [],
  onSendGift,
  onStartDuel,
  onAddFriend,
  onLikeActivity,
  onBroadcastSos,
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'feed' | 'add' | 'sos'>('friends');
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [addFeedback, setAddFeedback] = useState<{ success?: boolean; text?: string } | null>(null);
  const [sosText, setSosText] = useState('');
  const [sosSent, setSosSent] = useState(false);

  if (!isOpen) return null;

  const myFriendCode = currentUser
    ? `SG-${(currentUser.username || 'USER').toUpperCase().slice(0, 5)}-${(currentUser.id || '000').slice(-3).toUpperCase()}`
    : `SG-DEFENDER-${((userProfile?.name) || 'GUEST').slice(0, 4).toUpperCase()}`;

  const handleCopyFriendCode = () => {
    navigator.clipboard.writeText(myFriendCode);
    setCopiedCode(true);
    playSuccessChime();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = onAddFriend(inputCode.trim());
    setAddFeedback({ success: res.success, text: res.message });
    if (res.success) {
      setInputCode('');
      playSuccessChime();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSendGiftWithFx = (friendId: string) => {
    onSendGift(friendId);
    playChestFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  const handleStartDuelWithFx = (friend: FriendUser) => {
    playDuelBell();
    onStartDuel(friend);
  };

  const handleBroadcastSosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosText.trim()) return;
    onBroadcastSos(sosText.trim());
    setSosSent(true);
    playSuccessChime();
    setTimeout(() => {
      setSosSent(false);
      setSosText('');
      setActiveTab('feed');
    }, 1500);
  };

  return (
    <div
      id="friends-hub-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="friends-hub-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white tracking-tight">Biệt Đội Vệ Binh & Bạn Bè</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full">
                  {friendsList.length} Bạn bè
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thách đấu phòng thủ, tặng khiên hàng ngày & cảnh báo lừa đảo tương hỗ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-2 bg-slate-950/70 border-b border-slate-800 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'friends'
                ? 'bg-cyan-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh Sách Bạn</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'feed'
                ? 'bg-cyan-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Nhật Ký An Toàn</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'add'
                ? 'bg-cyan-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm & Mã Bạn</span>
          </button>

          <button
            onClick={() => setActiveTab('sos')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'sos'
                ? 'bg-rose-600 text-white shadow-md font-black animate-pulse'
                : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Cảnh Báo SOS</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: FRIENDS LIST */}
          {activeTab === 'friends' && (
            <div className="space-y-3">
              {/* Quick Friend Code Bar */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Mã Vệ Binh Của Bạn</span>
                    <span className="text-sm font-black text-cyan-300 font-mono tracking-wider">{myFriendCode}</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyFriendCode}
                  className="btn-tactile btn-tactile-slate px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã Sao Chép' : 'Sao Chép'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Đồng đội trực tuyến ({friendsList.filter((f) => f.isOnline).length}/{friendsList.length})
                </span>
                <span className="text-xs text-amber-400 font-medium">Tặng khiên nhận ngay +50 XP</span>
              </div>

              {friendsList.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/50 p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="relative">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleAvatarError(e, friend.name)}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-cyan-400 transition-colors"
                      />
                      {friend.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {friend.name}
                        </h4>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
                          Cấp {friend.level}
                        </span>
                        {friend.mode === 'senior' && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-amber-950 text-amber-300 border border-amber-800 rounded">
                            Cao Tuổi
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                        <span>Điểm: <strong className="text-cyan-400">{friend.overallScore}/100</strong></span>
                        <span>XP: <strong className="text-amber-400">{friend.xp}</strong></span>
                        <span className="flex items-center space-x-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <strong className="text-amber-400">{friend.streakDays}d</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this Friend */}
                  <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <button
                      onClick={() => handleSendGiftWithFx(friend.id)}
                      disabled={friend.giftSentToday}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        friend.giftSentToday
                          ? 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed'
                          : 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                      }`}
                      title={friend.giftSentToday ? 'Đã tặng quà hôm nay' : 'Tặng 1 Khiên An Ninh & 50 XP'}
                    >
                      <Gift className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{friend.giftSentToday ? 'Đã Tặng' : 'Tặng Khiên'}</span>
                    </button>

                    <button
                      onClick={() => handleStartDuelWithFx(friend)}
                      className="btn-tactile btn-tactile-cyan px-3.5 py-2 text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Thách Đấu</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SAFETY FEED */}
          {activeTab === 'feed' && (
            <div className="space-y-3">
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded-2xl text-xs text-cyan-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Hoạt động rèn luyện và cảnh báo tương hỗ thời gian thực từ mạng lưới Vệ Binh của bạn.</span>
              </div>

              {activityFeed.map((event) => (
                <div
                  key={event.id}
                  className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-2.5 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={event.userAvatar}
                        alt={event.userName}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleAvatarError(e, event.userName)}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{event.userName}</h4>
                          <span className="text-[10px] text-slate-400">• {event.timestamp}</span>
                        </div>
                        <p className="text-xs font-semibold text-cyan-400">{event.title}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-12">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 pl-12">
                    <button
                      onClick={() => onLikeActivity(event.id)}
                      className={`flex items-center space-x-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        event.likedByMe ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${event.likedByMe ? 'fill-rose-400' : ''}`} />
                      <span>{event.likesCount} Cổ vũ</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('sos')}
                      className="text-xs text-slate-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Chia sẻ cảnh báo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ADD FRIEND & FRIEND CODE */}
          {activeTab === 'add' && (
            <div className="space-y-6">
              {/* My Code Card */}
              <div className="bg-slate-950 border-2 border-cyan-500/40 p-6 rounded-3xl text-center space-y-3 relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto text-2xl">
                  🪪
                </div>
                <h3 className="text-base font-black text-white">Mã Vệ Binh Cá Nhân</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Gửi mã này cho bạn bè hoặc người thân để họ kết nối vào mạng lưới bảo vệ an ninh của bạn:
                </p>

                <div className="inline-flex items-center bg-slate-900 border border-cyan-500/60 rounded-2xl p-2 px-4 space-x-3 shadow-inner">
                  <span className="text-lg font-black text-cyan-300 font-mono tracking-widest">{myFriendCode}</span>
                  <button
                    onClick={handleCopyFriendCode}
                    className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Add Friend Form */}
              <form onSubmit={handleAddFriendSubmit} className="space-y-3 bg-slate-950/70 p-5 rounded-3xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Nhập Mã Vệ Binh Hoặc Tên Người Dùng Bạn Bè
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Ví dụ: SG-HTUAN-99 hoặc hoangtuan_sec"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="btn-tactile btn-tactile-cyan px-5 py-2.5 text-xs font-black flex items-center space-x-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Kết Nối</span>
                  </button>
                </div>

                {addFeedback && (
                  <p
                    className={`text-xs font-bold mt-2 ${
                      addFeedback.success ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {addFeedback.text}
                  </p>
                )}
              </form>

              {/* Quick Recommendations */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Gợi ý kết nối nhanh
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">Đường Dây Nóng An Ninh (NCSC)</h5>
                      <span className="text-[10px] text-slate-400">Mã: SG-NCSC-VN</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddFriend('SG-NCSC-VN')}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg"
                    >
                      Kết nối
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">Vệ Binh Cao Niên Mẫu</h5>
                      <span className="text-[10px] text-slate-400">Mã: SG-THANH-68</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddFriend('SG-THANH-68')}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg"
                    >
                      Kết nối
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOS ALERT */}
          {activeTab === 'sos' && (
            <div className="space-y-4">
              <div className="bg-rose-950/40 border border-rose-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    🚨
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-rose-300">
                      Phát Cảnh Báo Cho Toàn Bộ Biệt Đội Bạn Bè
                    </h3>
                    <p className="text-xs text-slate-300">
                      Nếu bạn vừa nhận một tin nhắn đáng ngờ, cuộc gọi đe dọa hoặc nghi bị lộ OTP, hãy chia sẻ ngay để bạn bè cùng trợ giúp xác minh!
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBroadcastSosSubmit} className="space-y-3 pt-2">
                  <textarea
                    rows={3}
                    value={sosText}
                    onChange={(e) => setSosText(e.target.value)}
                    placeholder="Mô tả ngắn: 'Mình vừa nhận cuộc gọi từ số 024... xưng là công an quận đòi xác minh căn cước, mọi người kiểm tra giúp mình với...'"
                    className="w-full bg-slate-950 border border-rose-900/60 rounded-2xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Cảnh báo sẽ được gửi tức thì đến {friendsList.length} đồng đội.
                    </span>
                    <button
                      type="submit"
                      disabled={sosSent}
                      className="btn-tactile px-6 py-2.5 text-xs font-black bg-rose-600 hover:bg-rose-500 text-white rounded-xl flex items-center space-x-2 shadow-lg shadow-rose-600/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sosSent ? 'Đã Phát Cảnh Báo!' : 'Phát Tín Hiệu SOS'}</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-amber-400 block uppercase text-[11px]">
                  Lưu ý an toàn:
                </span>
                <p>• Không gửi trực tiếp mật khẩu thật hoặc mã OTP cá nhân lên bảng tin.</p>
                <p>• Trong trường hợp đã chuyển tiền hoặc phát hiện mất quyền kiểm soát tài khoản ngân hàng, vui lòng gọi ngay hotline 113 và tổng đài ngân hàng để khóa tài khoản khẩn cấp.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
