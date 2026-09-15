import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ThumbsUp, 
  Heart, 
  Shield, 
  AlertTriangle, 
  Smile, 
  Share2, 
  MessageSquare, 
  UserPlus, 
  UserCheck, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  MoreHorizontal,
  Flame,
  Award,
  Link,
  Copy,
  Check,
  Zap,
  Tag
} from 'lucide-react';
import { SocialPost, ReactionType, UserProfile, SocialComment } from '../types';
import { playSuccessChime, playCardFlip } from '../utils/audioEffects';
import { handleAvatarError } from '../utils/avatarFallback';

interface SocialFeedViewProps {
  currentUserProfile: UserProfile;
  posts: SocialPost[];
  onAddPost?: (newPost: SocialPost) => void;
  onReactPost?: (postId: string, reaction: ReactionType) => void;
  onAddComment?: (postId: string, commentText: string) => void;
  onSharePost?: (postId: string) => void;
  onToggleFollowUser?: (userId: string) => void;
}

const REACTION_CONFIG: Record<ReactionType, { label: string; emoji: string; color: string; bg: string }> = {
  like: { label: 'Thích', emoji: '👍', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  love: { label: 'Yêu thích', emoji: '❤️', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  shield: { label: 'Khiên Bối', emoji: '🛡️', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  warning: { label: 'Cảnh Báo', emoji: '⚠️', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  haha: { label: 'Haha', emoji: '😂', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
};

export const SocialFeedView: React.FC<SocialFeedViewProps> = ({
  currentUserProfile,
  posts,
  onAddPost,
  onReactPost,
  onAddComment,
  onSharePost,
  onToggleFollowUser,
}) => {
  // Post Creation State
  const [postContent, setPostContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scamCategory, setScamCategory] = useState('🚨 Cảnh Báo Scam');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [isSosAlert, setIsSosAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Reactions & Comments view
  const [activeReactionPicker, setActiveReactionPicker] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Share Modal State
  const [sharingPost, setSharingPost] = useState<SocialPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Handle create post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsSubmitting(true);
    playSuccessChime();

    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      userId: 'current_user',
      userName: currentUserProfile.name || 'Vệ Binh ScamGuard',
      userAvatar: currentUserProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
      userBadge: '🛡️ Hiệp Sĩ Tiên Phong',
      userMode: currentUserProfile.mode || 'adult',
      isVerified: true,
      followersCount: 185,
      content: postContent.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
      scamCategory: scamCategory,
      timestamp: 'Vừa xong',
      reactions: {
        like: 1,
        love: 0,
        shield: 1,
        warning: isSosAlert ? 1 : 0,
        haha: 0,
      },
      myReaction: 'shield',
      sharesCount: 0,
      commentsCount: 0,
      comments: [],
      isSosAlert,
      dnaScore: currentUserProfile.overallScore || 92,
    };

    if (onAddPost) {
      onAddPost(newPost);
    }

    setPostContent('');
    setMediaUrl('');
    setShowMediaInput(false);
    setIsSosAlert(false);
    setIsSubmitting(false);
  };

  // Toggle Reaction
  const handleReact = (postId: string, reaction: ReactionType) => {
    playCardFlip();
    if (onReactPost) {
      onReactPost(postId, reaction);
    }
    setActiveReactionPicker(null);
  };

  // Toggle Comment Input expansion
  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Submit Comment
  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    playSuccessChime();
    if (onAddComment) {
      onAddComment(postId, text.trim());
    }

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Trigger Share
  const handleShareClick = (post: SocialPost) => {
    setSharingPost(post);
    if (onSharePost) {
      onSharePost(post.id);
    }
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    playSuccessChime();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Create Post Card (Facebook-style composer) */}
      <div className="cyber-card p-4 sm:p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={currentUserProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face'}
            alt="User"
            referrerPolicy="no-referrer"
            onError={(e) => handleAvatarError(e, currentUserProfile.fullName || 'Bạn')}
            className="w-11 h-11 rounded-2xl border-2 border-cyan-400 object-cover"
          />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>{currentUserProfile.name || 'Bạn'}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Hiệp Sĩ Số
              </span>
            </h3>
            <p className="text-xs text-slate-400">Chia sẻ cảnh báo hoặc trải nghiệm an toàn với cộng đồng</p>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Viết cảnh báo lừa đảo, kinh nghiệm hoặc câu chuyện an toàn của bạn..."
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />

          {showMediaInput && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Dán URL hình ảnh minh họa (ví dụ: ảnh chụp màn hình tin nhắn lừa đảo)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </motion.div>
          )}

          {/* Preset Category Tags */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              '🚨 Cảnh Báo Phishing',
              '👵 Khóa Gia Đình',
              '📞 Cuộc Gọi Lừa Đảo',
              '📲 QR Code Mã Độc',
              '💎 Báo Cáo Scam DNA',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setScamCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  scamCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowMediaInput(!showMediaInput)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  showMediaInput ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>Thêm Ảnh</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSosAlert(!isSosAlert)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isSosAlert ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Gắn Nhãn SOS Khẩn</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!postContent.trim() || isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng Bài Cảnh Báo (+90 XP)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Feed Posts List */}
      <div className="space-y-6">
        {posts.map((post) => {
          const totalReactions =
            post.reactions.like +
            post.reactions.love +
            post.reactions.shield +
            post.reactions.warning +
            post.reactions.haha;

          const isCommentsOpen = !!expandedComments[post.id];

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`cyber-card p-5 sm:p-6 rounded-3xl border transition-all shadow-xl relative overflow-hidden bg-slate-900/90 ${
                post.isSosAlert ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-slate-800'
              }`}
            >
              {post.isSosAlert && (
                <div className="mb-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/90 border border-red-500/60 text-red-400 text-[10px] font-black uppercase tracking-wider animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>BÁO ĐỘNG SOS KHẨN CẤP TỪ CỘNG ĐỒNG</span>
                </div>
              )}

              {/* Author Header & Follow Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleAvatarError(e, post.userName)}
                    className="w-12 h-12 rounded-2xl border-2 border-cyan-400 object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h4 className="text-sm font-black text-white">{post.userName}</h4>
                      {post.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                      )}
                      {post.userBadge && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-950 text-cyan-300 border border-indigo-500/30">
                          {post.userBadge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5 font-medium">
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <span className="text-cyan-300 font-mono">{post.followersCount} Followers</span>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                {post.userId !== 'current_user' && (
                  <button
                    onClick={() => {
                      if (onToggleFollowUser) onToggleFollowUser(post.userId);
                      playSuccessChime();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      post.isFollowing
                        ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                        : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-black shadow-md'
                    }`}
                  >
                    {post.isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Đang theo dõi</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Theo dõi</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Category Tag & Content */}
              {post.scamCategory && (
                <div className="mb-2">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span>{post.scamCategory}</span>
                  </span>
                </div>
              )}

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line mb-4">
                {post.content}
              </p>

              {/* Optional Post Media Image */}
              {post.mediaUrl && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800 max-h-80 bg-slate-950">
                  <img
                    src={post.mediaUrl}
                    alt="Attachment"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Hide media container if image fails to load
                      const parent = e.currentTarget.parentElement;
                      if (parent) parent.style.display = 'none';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Reactions Bar & Counter Row */}
              <div className="flex items-center justify-between py-2 border-t border-b border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    {post.reactions.shield > 0 && <span className="text-sm">🛡️</span>}
                    {post.reactions.love > 0 && <span className="text-sm">❤️</span>}
                    {post.reactions.like > 0 && <span className="text-sm">👍</span>}
                    {post.reactions.warning > 0 && <span className="text-sm">⚠️</span>}
                  </div>
                  <span className="font-bold text-slate-300 ml-1">{totalReactions} Tương tác</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span>{post.commentsCount || post.comments.length} Bình luận</span>
                  <span>•</span>
                  <span>{post.sharesCount} Chia sẻ</span>
                </div>
              </div>

              {/* Interactive Action Buttons (Like / Comment / Share) */}
              <div className="flex items-center justify-around pt-2 relative">
                {/* Reaction Popover */}
                {activeReactionPicker === post.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-12 left-2 bg-slate-950 border-2 border-cyan-500/60 rounded-full p-2 flex items-center space-x-2 shadow-2xl z-30"
                  >
                    {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((rKey) => {
                      const cfg = REACTION_CONFIG[rKey];
                      return (
                        <button
                          key={rKey}
                          onClick={() => handleReact(post.id, rKey)}
                          className="hover:scale-130 transition-transform p-1 rounded-full cursor-pointer text-xl"
                          title={cfg.label}
                        >
                          {cfg.emoji}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Reaction Trigger Button */}
                <button
                  onClick={() => setActiveReactionPicker(activeReactionPicker === post.id ? null : post.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer hover:bg-slate-800/60 ${
                    post.myReaction ? REACTION_CONFIG[post.myReaction].color : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {post.myReaction ? (
                    <>
                      <span className="text-base">{REACTION_CONFIG[post.myReaction].emoji}</span>
                      <span>{REACTION_CONFIG[post.myReaction].label}</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="w-4 h-4" />
                      <span>Thả Cảm Cúm / Khiên</span>
                    </>
                  )}
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center space-x-2 transition-all cursor-pointer hover:bg-slate-800/60"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Bình luận</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShareClick(post)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center space-x-2 transition-all cursor-pointer hover:bg-slate-800/60"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Chia sẻ</span>
                </button>
              </div>

              {/* Expandable Comments Section */}
              <AnimatePresence>
                {isCommentsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-800 space-y-3"
                  >
                    {/* Add Comment Input */}
                    <div className="flex items-center space-x-2">
                      <img
                        src={currentUserProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face'}
                        alt="User"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleAvatarError(e, currentUserProfile.fullName || 'Bạn')}
                        className="w-8 h-8 rounded-xl border border-cyan-400 object-cover"
                      />
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(post.id);
                        }}
                        placeholder="Viết bình luận của bạn..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="p-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {post.comments.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-2">
                          Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến!
                        </p>
                      ) : (
                        post.comments.map((c) => (
                          <div key={c.id} className="flex items-start space-x-2.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
                            <img
                              src={c.userAvatar}
                              alt={c.userName}
                              referrerPolicy="no-referrer"
                              onError={(e) => handleAvatarError(e, c.userName)}
                              className="w-7 h-7 rounded-xl object-cover border border-slate-700"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-bold text-cyan-300">{c.userName}</h5>
                                <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-200 mt-1">{c.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {sharingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="cyber-card p-6 rounded-3xl border-2 border-emerald-500/60 bg-slate-900 max-w-md w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  <span>Chia Sẻ Cảnh Báo An Toàn</span>
                </h3>
                <button
                  onClick={() => setSharingPost(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-cyan-400">Trích đoạn bài viết:</p>
                <p className="text-xs text-slate-300 line-clamp-3 italic">"{sharingPost.content}"</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-between transition-all cursor-pointer border border-slate-700"
                >
                  <span className="flex items-center space-x-2">
                    <Link className="w-4 h-4 text-cyan-400" />
                    <span>Sao Chép Liên Kết Bài Viết</span>
                  </span>
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>

                <button
                  onClick={() => {
                    playSuccessChime();
                    setSharingPost(null);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-lg hover:brightness-110"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Chia Sẻ Lên Trang Cá Nhân (+30 XP)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
