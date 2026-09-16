/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DuolingoSidebar } from './components/DuolingoSidebar';
import { DuolingoRightSidebar } from './components/DuolingoRightSidebar';
import { HomeView } from './components/HomeView';
import { CheckScamView } from './components/CheckScamView';
import { TrainHubView } from './components/TrainHubView';
import { ProgressView } from './components/ProgressView';
import { LearnView } from './components/LearnView';
import { LeaderboardView } from './components/LeaderboardView';
import { DailyQuestsView } from './components/DailyQuestsView';
import { SupplyStoreView } from './components/SupplyStoreView';
import { ProfileView } from './components/ProfileView';
import { MoreToolsView } from './components/MoreToolsView';
import { EmergencyModal } from './components/EmergencyModal';
import { TrustedContactsModal } from './components/TrustedContactsModal';
import { FamilySchoolModal } from './components/FamilySchoolModal';
import { PrivacyCenterModal } from './components/PrivacyCenterModal';
import { AuthModal } from './components/AuthModal';
import { FriendsHubModal } from './components/FriendsHubModal';
import { FriendDuelModal } from './components/FriendDuelModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { LiveCallSimulatorModal } from './components/LiveCallSimulatorModal';
import { ScreenSentinelModal } from './components/ScreenSentinelModal';
import { ScamSpeechDecoderModal } from './components/ScamSpeechDecoderModal';
import { PublicWifiNfcShieldModal } from './components/PublicWifiNfcShieldModal';
import { LiveScamRadarModal } from './components/LiveScamRadarModal';
import { StreakModal, GemsModal, HeartsModal, StreakCelebrationModal } from './components/MetricsModals';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { UtilityFooter } from './components/UtilityFooter';
import { ResearchCenterView } from './components/ResearchCenterView';
import { ScamDnaView } from './components/ScamDnaView';
import { NationalScienceFairDemoModal } from './components/NationalScienceFairDemoModal';
import { RoadmapSnakePath } from './components/RoadmapSnakePath';
import { LeaderboardModal } from './components/LeaderboardModal';
import { NotificationsModal } from './components/NotificationsModal';
import { MobileDrawerMenu } from './components/MobileDrawerMenu';
import { Compass } from 'lucide-react';
import {
  ExperienceMode,
  Language,
  ScamScenario,
  TrustedContact,
  UserProfile,
  UserAccount,
  FriendUser,
  DailyQuest,
  FriendActivityEvent,
  SocialPost,
  ReactionType,
  SocialComment,
  ScamTactic,
} from './types';
import { LanguageProvider } from './i18n/LanguageContext';
import { INITIAL_FRIENDS, INITIAL_QUESTS, INITIAL_ACTIVITY_FEED, INITIAL_SOCIAL_POSTS } from './data/friendsData';
import { playSuccessChime, playRewardTrophy } from './utils/audioEffects';
import {
  ThemeConfig,
  getStoredThemeConfig,
  applyThemeToDom,
  saveThemeConfig,
} from './utils/themeManager';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'train' | 'check' | 'learn' | 'progress' | 'leaderboard' | 'quests' | 'store' | 'profile' | 'more' | 'research' | 'scamdna' | 'roadmap'
  >('home');
  const [trainSubTab, setTrainSubTab] = useState<'arena' | 'quishing' | 'deepfake' | 'drills'>('arena');
  const [progressSubTab, setProgressSubTab] = useState<string>('all');
  const [checkSubTab, setCheckSubTab] = useState<'smart_link' | 'fake_bill' | 'threat_intel' | 'blacklist' | 'pii_redact'>('smart_link');
  const [learnTactic, setLearnTactic] = useState<ScamTactic | null>(null);
  const [selectedQuishId, setSelectedQuishId] = useState<string | null>(null);
  const [selectedDeepfakeId, setSelectedDeepfakeId] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScamScenario | null>(null);

  // Theme & Appearance State
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getStoredThemeConfig);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    applyThemeToDom(themeConfig);
  }, [themeConfig]);

  // Modals state
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isTrustedContactsOpen, setIsTrustedContactsOpen] = useState(false);
  const [isFamilySchoolOpen, setIsFamilySchoolOpen] = useState(false);
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Social & Gamification Modals
  const [isFriendsHubOpen, setIsFriendsHubOpen] = useState(false);
  const [isDuelOpen, setIsDuelOpen] = useState(false);
  const [activeDuelFriend, setActiveDuelFriend] = useState<FriendUser | null>(null);
  const [isDailyQuestsOpen, setIsDailyQuestsOpen] = useState(false);
  const [isCallSimulatorOpen, setIsCallSimulatorOpen] = useState(false);
  const [isScreenSentinelOpen, setIsScreenSentinelOpen] = useState(false);
  const [isSpeechDecoderOpen, setIsSpeechDecoderOpen] = useState(false);
  const [isWifiShieldOpen, setIsWifiShieldOpen] = useState(false);
  const [isScamRadarOpen, setIsScamRadarOpen] = useState(false);
  const [isScienceFairDemoOpen, setIsScienceFairDemoOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Social & Gamification Data State
  const [friends, setFriends] = useState<FriendUser[]>(INITIAL_FRIENDS);
  const [activityFeed, setActivityFeed] = useState<FriendActivityEvent[]>(INITIAL_ACTIVITY_FEED);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(INITIAL_QUESTS);
  const [chestsCount, setChestsCount] = useState(0);

  const handleAddPost = (newPost: SocialPost) => {
    setPosts((prev) => [newPost, ...prev]);
    handleEarnXp(90);
  };

  const handleReactPost = (postId: string, reaction: ReactionType) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSameReaction = p.myReaction === reaction;
          const prevReaction = p.myReaction;
          const newMyReaction = isSameReaction ? undefined : reaction;

          const newReactions = { ...p.reactions };
          if (prevReaction) {
            newReactions[prevReaction] = Math.max(0, newReactions[prevReaction] - 1);
          }
          if (!isSameReaction) {
            newReactions[reaction] = (newReactions[reaction] || 0) + 1;
          }

          return {
            ...p,
            myReaction: newMyReaction,
            reactions: newReactions,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment: SocialComment = {
            id: `c_${Date.now()}`,
            userId: 'current_user',
            userName: userProfile.name || 'Bạn',
            userAvatar:
              userProfile.avatarUrl ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
            content: commentText,
            timestamp: 'Vừa xong',
            likesCount: 0,
          };
          return {
            ...p,
            commentsCount: (p.commentsCount || p.comments.length) + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );
  };

  const handleSharePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            sharesCount: p.sharesCount + 1,
          };
        }
        return p;
      })
    );
    handleEarnXp(30);
  };

  const handleToggleFollowUser = (userId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.userId === userId) {
          const nextState = !p.isFollowing;
          const delta = nextState ? 1 : -1;
          return {
            ...p,
            isFollowing: nextState,
            followersCount: Math.max(0, p.followersCount + delta),
          };
        }
        return p;
      })
    );

    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === userId) {
          const nextState = !f.isFollowing;
          const delta = nextState ? 1 : -1;
          return {
            ...f,
            isFollowing: nextState,
            followersCount: Math.max(0, (f.followersCount || 0) + delta),
          };
        }
        return f;
      })
    );
  };

  // Gamification Metrics State
  const [gems, setGems] = useState(0);
  const [lives, setLives] = useState(5);
  const [hasStreakFreeze, setHasStreakFreeze] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isGemsModalOpen, setIsGemsModalOpen] = useState(false);
  const [isHeartsModalOpen, setIsHeartsModalOpen] = useState(false);
  const [isStreakCelebrationOpen, setIsStreakCelebrationOpen] = useState(false);
  const [prevStreakValue, setPrevStreakValue] = useState(0);

  const handleRefillLives = () => {
    if (gems >= 100 && lives < 5) {
      setGems((prev) => prev - 100);
      setLives(5);
    }
  };

  const handleBuyStreakFreeze = () => {
    if (gems >= 200 && !hasStreakFreeze) {
      setGems((prev) => prev - 200);
      setHasStreakFreeze(true);
    }
  };

  const handleExtendStreak = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('scamguard_streak_last_date');

    if (lastDate !== todayStr) {
      const oldVal = userProfile.streakDays || 0;
      const newVal = oldVal + 1;
      setPrevStreakValue(oldVal);
      setUserProfile((prev) => ({ ...prev, streakDays: newVal }));
      localStorage.setItem('scamguard_streak_days', newVal.toString());
      localStorage.setItem('scamguard_streak_last_date', todayStr);
      setIsStreakCelebrationOpen(true);
      playRewardTrophy();
    }
  };

  // User & Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Helper to retrieve or create a unique persistent guest profile
  const getOrCreateGuestProfile = (): UserProfile => {
    const saved = localStorage.getItem('scamguard_guest_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing guest profile', e);
      }
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newGuest: UserProfile = {
      id: `guest_${randomNum}_${Date.now()}`,
      name: `Khách Vệ Binh #${randomNum}`,
      mode: 'adult',
      language: 'vi',
      overallScore: 70,
      xp: 100,
      streakDays: 1,
      completedScenarios: [],
      trustedContacts: [],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('scamguard_guest_profile', JSON.stringify(newGuest));
    return newGuest;
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    return getOrCreateGuestProfile();
  });

  // Sync guest changes to localStorage in real-time if not logged in
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('scamguard_guest_profile', JSON.stringify(userProfile));
    }
  }, [userProfile, currentUser]);

  // Restore user session on startup if token exists
  useEffect(() => {
    let isMounted = true;

    const checkUserSession = async () => {
      const token = localStorage.getItem('scamguard_token');
      if (!token) return;

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          if (res.status === 401 || res.status === 404) {
            localStorage.removeItem('scamguard_token');
          }
          return;
        }

        const data = await res.json();
        if (isMounted && data.success && data.user) {
          setCurrentUser(data.user);
          setUserProfile(data.user.profile);
        }
      } catch (err) {
        // Quiet fallback when offline or during server cold-boot
        console.warn('Session restore info: Using offline/cached profile state.');
      }
    };

    checkUserSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = async (account: UserAccount) => {
    // Merge guest progress with logged-in profile progress seamlessly!
    const mergedProfile: UserProfile = {
      ...account.profile,
      xp: Math.max(userProfile.xp || 100, account.profile.xp || 100),
      streakDays: Math.max(userProfile.streakDays || 1, account.profile.streakDays || 1),
      overallScore: Math.max(userProfile.overallScore || 70, account.profile.overallScore || 70),
      completedScenarios: Array.from(new Set([
        ...(userProfile.completedScenarios || []),
        ...(account.profile.completedScenarios || [])
      ])),
      mode: userProfile.mode || account.profile.mode || 'adult',
    };

    // Merge trusted contacts
    const guestContacts = userProfile.trustedContacts || [];
    const accountContacts = account.profile.trustedContacts || [];
    const mergedContacts = [...accountContacts];
    guestContacts.forEach(gc => {
      if (!mergedContacts.some(ac => ac.name === gc.name || ac.id === gc.id)) {
        mergedContacts.push(gc);
      }
    });
    mergedProfile.trustedContacts = mergedContacts;

    if (account.token) {
      localStorage.setItem('scamguard_token', account.token);
    }

    const updatedAccount = {
      ...account,
      profile: mergedProfile,
    };

    setCurrentUser(updatedAccount);
    setUserProfile(mergedProfile);

    // Sync merged profile to server
    if (account.token) {
      try {
        await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${account.token}`,
          },
          body: JSON.stringify(mergedProfile),
        });
      } catch (e) {
        console.error('Failed to sync merged profile to server', e);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('scamguard_token');
    setCurrentUser(null);
    setUserProfile(getOrCreateGuestProfile());
  };

  const handleModeChange = (mode: ExperienceMode) => {
    setUserProfile((prev) => ({ ...prev, mode }));
    if (currentUser) {
      updateServerProfile({ mode });
    }
  };

  const handleLanguageChange = (language: Language) => {
    setUserProfile((prev) => ({ ...prev, language }));
    if (currentUser) {
      updateServerProfile({ language });
    }
  };

  const updateServerProfile = async (updates: Partial<UserProfile>) => {
    const token = localStorage.getItem('scamguard_token');
    if (!token) return;

    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error('Failed to sync profile update', e);
    }
  };

  const handleNavigate = (
    tab: 'home' | 'train' | 'check' | 'learn' | 'progress' | 'leaderboard' | 'quests' | 'store' | 'profile' | 'more' | 'research' | 'scamdna' | 'roadmap',
    subView?: string
  ) => {
    setActiveTab(tab);

    // Modal triggers directly from search or buttons
    if (subView === 'radar') {
      setIsScamRadarOpen(true);
      return;
    }
    if (subView === 'wifi-shield') {
      setIsWifiShieldOpen(true);
      return;
    }
    if (subView === 'call-sim') {
      setIsCallSimulatorOpen(true);
      return;
    }

    // Train hub sub-tabs & cases
    if (tab === 'train') {
      if (subView && ['arena', 'quishing', 'deepfake', 'drills'].includes(subView)) {
        setTrainSubTab(subView as 'arena' | 'quishing' | 'deepfake' | 'drills');
      }
    }

    // Check scam sub-tabs
    if (tab === 'check') {
      if (subView && ['smart_link', 'fake_bill', 'threat_intel', 'blacklist', 'pii_redact'].includes(subView)) {
        setCheckSubTab(subView as any);
      } else if (subView === 'detect') {
        setCheckSubTab('smart_link');
      } else if (subView === 'domain') {
        setCheckSubTab('threat_intel');
      } else if (subView === 'pii') {
        setCheckSubTab('pii_redact');
      }
    }

    // Learn view tactics
    if (tab === 'learn' && subView) {
      setLearnTactic(subView as ScamTactic);
    }

    // Progress sub-tab
    if (tab === 'progress' && subView) {
      setProgressSubTab(subView);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEarnXp = (amount: number) => {
    handleExtendStreak();
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        xp: (prev.xp || 0) + amount,
        overallScore: Math.min(100, (prev.overallScore || 80) + 1),
      };
      if (currentUser) {
        updateServerProfile({ xp: updated.xp, overallScore: updated.overallScore });
      }
      return updated;
    });

    // Check if any quest can be progressed
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'quest_arena' && !q.completed) {
          const current = Math.min(q.target, q.current + 1);
          return { ...q, current, completed: current >= q.target };
        }
        return q;
      })
    );
  };

  const handleStartFriendDuel = (friend: FriendUser) => {
    setActiveDuelFriend(friend);
    setIsFriendsHubOpen(false);
    setIsDuelOpen(true);
  };

  const handleClaimQuest = (questId: string, xpReward: number) => {
    setDailyQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true, claimed: true } : q))
    );
    handleEarnXp(xpReward);
    playRewardTrophy();
  };

  const handleOpenChest = () => {
    if (chestsCount <= 0) return;
    setChestsCount((c) => Math.max(0, c - 1));
    handleEarnXp(120);
    playRewardTrophy();
  };

  const handleSendShieldToFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, streakDays: f.streakDays + 1, giftSentToday: true } : f))
    );
    handleEarnXp(25);
    playSuccessChime();
  };

  const handleAddFriend = (codeOrUser: string) => {
    const query = codeOrUser.trim().toLowerCase();
    const found = friends.find(
      (f) =>
        f.friendCode.toLowerCase() === query ||
        f.username.toLowerCase() === query
    );
    if (found) {
      return { success: false, message: 'Người bạn này đã có trong danh sách Biệt Đội của bạn!' };
    }
    const newFriend: FriendUser = {
      id: `friend_${Date.now()}`,
      friendCode: codeOrUser.trim().toUpperCase(),
      name: codeOrUser.trim().startsWith('SG-') ? `Vệ Binh ${codeOrUser.trim().slice(3, 9)}` : codeOrUser.trim(),
      username: codeOrUser.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face`,
      overallScore: 85,
      xp: 1200,
      streakDays: 2,
      isOnline: true,
      level: 3,
      mode: 'adult',
      lastActive: 'Vừa xong',
      giftReceivedToday: false,
      giftSentToday: false,
      isFavorite: false,
      shieldsCount: 1,
    };
    setFriends((prev) => [newFriend, ...prev]);
    return { success: true, message: `Đã kết nối thành công với ${newFriend.name}!` };
  };

  const handleLikeActivity = (activityId: string) => {
    setActivityFeed((prev) =>
      prev.map((act) =>
        act.id === activityId
          ? {
              ...act,
              likesCount: act.likedByMe ? act.likesCount - 1 : act.likesCount + 1,
              likedByMe: !act.likedByMe,
            }
          : act
      )
    );
    playSuccessChime();
  };

  const handleBroadcastSos = (message: string) => {
    const newEvent: FriendActivityEvent = {
      id: `act_${Date.now()}`,
      userId: userProfile.id || 'user_me',
      userName: currentUser?.name || userProfile.name || 'Bạn',
      userAvatar:
        currentUser?.avatarUrl ||
        userProfile.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
      userMode: userProfile.mode,
      actionType: 'sos_shared',
      title: '🚨 Cảnh Báo Khẩn Cấp Được Chia Sẻ',
      description: message,
      timestamp: 'Vừa xong',
      likesCount: 1,
      likedByMe: true,
    };
    setActivityFeed((prev) => [newEvent, ...prev]);
  };

  const handleUpdateContacts = (contacts: TrustedContact[]) => {
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        trustedContacts: contacts,
      };
      if (currentUser) {
        updateServerProfile({ trustedContacts: contacts });
      }
      return updated;
    });
  };

  const handleResetAllData = async () => {
    try {
      const token = localStorage.getItem('scamguard_token');
      await fetch('/api/account/reset-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (e) {
      console.warn('Reset server sync info:', e);
    }

    // Clear all client-side local storage
    localStorage.clear();

    // Reset profile and all state to 0
    setUserProfile({
      id: `user_${Date.now()}`,
      name: 'Tân Binh An Toàn',
      mode: 'adult',
      language: 'vi',
      overallScore: 50,
      xp: 0,
      streakDays: 0,
      completedScenarios: [],
      trustedContacts: [],
    });
    setCurrentUser(null);
    setGems(0);
    setLives(5);
    setHasStreakFreeze(false);
    setChestsCount(0);
    setDailyQuests(INITIAL_QUESTS.map((q) => ({ ...q, current: 0, completed: false, claimed: false })));

    // Emit data reset events
    window.dispatchEvent(new Event('scamguard_data_cleared'));
    window.dispatchEvent(new Event('scamguard_reset_data'));
  };

  const handleDataCleared = () => {
    handleResetAllData();
  };

  const onlineFriendsCount = friends.filter((f) => f.isOnline).length;
  const completedQuestsCount = dailyQuests.filter((q) => q.completed).length;

  return (
    <LanguageProvider
      language={userProfile.language || 'vi'}
      onLanguageChange={handleLanguageChange}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-slate-950 pb-24 lg:pb-0">
        {/* Left Duolingo Sidebar (Desktop) */}
        <DuolingoSidebar
          activeTab={activeTab}
          onSelectTab={(tab, sub) => handleNavigate(tab, sub)}
        />

        {/* Center Main Column */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Dynamic Background Pattern Layer */}
          <div className="theme-bg-pattern-layer absolute inset-0 pointer-events-none z-0" />
          
          {/* Dynamic Glow Aura */}
          <div className="theme-orb-glow top-10 right-10 z-0" />

          {/* Top Main Navigation Header */}
          <Navbar
            activeTab={activeTab}
            userProfile={userProfile}
            currentUser={currentUser}
            onSelectTab={(tab, sub) => handleNavigate(tab, sub)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenTheme={() => setIsThemeModalOpen(true)}
            onOpenStreak={() => setIsStreakModalOpen(true)}
            onOpenScienceFairDemo={() => setIsScienceFairDemoOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenChat={() => setIsFriendsHubOpen(true)}
            onOpenDrawer={() => setIsMobileDrawerOpen(true)}
            onLanguageChange={handleLanguageChange}
          />

          {/* Main Dynamic View Content */}
          <main className="flex-1 w-full relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {activeTab === 'home' && (
                  <HomeView
                    userProfile={userProfile}
                    currentUser={currentUser}
                    overallScore={userProfile.overallScore}
                    friendsList={friends}
                    dailyQuests={dailyQuests}
                    onNavigate={handleNavigate}
                    onOpenEmergency={() => setIsEmergencyOpen(true)}
                    onOpenFamilySchool={() => setIsFamilySchoolOpen(true)}
                    onOpenTrustedContacts={() => setIsTrustedContactsOpen(true)}
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onOpenFriends={() => setIsFriendsHubOpen(true)}
                    onOpenQuests={() => setIsDailyQuestsOpen(true)}
                    onOpenCallSim={() => setIsCallSimulatorOpen(true)}
                    onStartFriendDuel={handleStartFriendDuel}
                    onEarnXp={handleEarnXp}
                    onOpenScienceFairDemo={() => setIsScienceFairDemoOpen(true)}
                  />
                )}

                {activeTab === 'check' && (
                  <CheckScamView
                    subView={checkSubTab}
                    onOpenEmergency={() => setIsEmergencyOpen(true)}
                    onOpenSentinel={() => setIsScreenSentinelOpen(true)}
                  />
                )}

                {activeTab === 'learn' && (
                  <LearnView
                    initialTactic={learnTactic}
                    onNavigate={(tab, sub) => handleNavigate(tab as any, sub)}
                  />
                )}

                {activeTab === 'progress' && (
                  <ProgressView
                    userProfile={userProfile}
                    subTab={progressSubTab}
                    onNavigate={(tab, sub) => handleNavigate(tab as any, sub)}
                    onEarnXp={handleEarnXp}
                  />
                )}

                {activeTab === 'train' && (
                  <TrainHubView
                    subView={trainSubTab}
                    onSubViewChange={setTrainSubTab}
                    selectedScenario={selectedScenario}
                    onScenarioSelect={setSelectedScenario}
                    selectedQuishId={selectedQuishId}
                    selectedDeepfakeId={selectedDeepfakeId}
                    onCompleteScenario={(score) => {
                      setUserProfile((prev) => ({
                        ...prev,
                        overallScore: Math.round(((prev.overallScore || 80) + score) / 2),
                      }));
                    }}
                    onAddXp={handleEarnXp}
                  />
                )}

                {activeTab === 'leaderboard' && (
                  <LeaderboardView currentUserProfile={userProfile} />
                )}

                {activeTab === 'quests' && (
                  <DailyQuestsView
                    quests={dailyQuests}
                    onClaimQuest={(id, xp) => handleClaimQuest(id, xp)}
                    onOpenMysteryChest={(reward) => handleEarnXp(reward.amount || 50)}
                  />
                )}

                {activeTab === 'store' && (
                  <SupplyStoreView
                    userProfile={userProfile}
                    gems={userProfile.gems || 505}
                    onDeductGems={(amount) => {
                      setUserProfile((prev) => ({
                        ...prev,
                        gems: Math.max(0, (prev.gems || 505) - amount),
                      }));
                    }}
                    onRefillLives={handleRefillLives}
                    onEquipStreakFreeze={() => setHasStreakFreeze(true)}
                    onEarnXp={handleEarnXp}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileView
                    userProfile={userProfile}
                    currentUser={currentUser}
                    currentThemeConfig={themeConfig}
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onLogout={handleLogout}
                    onOpenTheme={() => setIsThemeModalOpen(true)}
                    onUpdateThemeConfig={setThemeConfig}
                    onNavigate={(tab, sub) => handleNavigate(tab as any, sub)}
                  />
                )}

                {activeTab === 'more' && (
                  <MoreToolsView
                    onOpenEmergency={() => setIsEmergencyOpen(true)}
                    onOpenFriends={() => setIsFriendsHubOpen(true)}
                    onOpenTrustedContacts={() => setIsTrustedContactsOpen(true)}
                    onOpenFamilySchool={() => setIsFamilySchoolOpen(true)}
                    onOpenPrivacyCenter={() => setIsPrivacyCenterOpen(true)}
                    onOpenCallSim={() => setIsCallSimulatorOpen(true)}
                    onOpenSentinel={() => setIsScreenSentinelOpen(true)}
                    onOpenDecoder={() => setIsSpeechDecoderOpen(true)}
                    onOpenRadar={() => setIsScamRadarOpen(true)}
                    onOpenWifiShield={() => setIsWifiShieldOpen(true)}
                    onOpenTheme={() => setIsThemeModalOpen(true)}
                    userProfile={userProfile}
                    onEarnXp={handleEarnXp}
                    posts={posts}
                    onAddPost={handleAddPost}
                    onReactPost={handleReactPost}
                    onAddComment={handleAddComment}
                    onSharePost={handleSharePost}
                    onToggleFollowUser={handleToggleFollowUser}
                  />
                )}

                {activeTab === 'research' && (
                  <ResearchCenterView onNavigateToMainUI={() => setActiveTab('home')} />
                )}

                {activeTab === 'scamdna' && (
                  <ScamDnaView
                    userProfile={userProfile}
                    onNavigateToArena={(scenarioId) => {
                      if (scenarioId) {
                        const matchedScenario = userProfile.completedScenarios?.find((s) => s.id === scenarioId);
                        if (matchedScenario) {
                          setSelectedScenario(matchedScenario as any);
                        }
                      }
                      handleNavigate('train', 'arena');
                    }}
                    onEarnXp={handleEarnXp}
                  />
                )}

                {activeTab === 'roadmap' && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                    <div className="text-center space-y-3 max-w-3xl mx-auto">
                      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-xs font-black uppercase shadow-sm">
                        <Compass className="w-3.5 h-3.5 text-cyan-400" />
                        <span>HUẤN LUYỆN & NHIỆM VỤ</span>
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                        Lộ Trình Huấn Luyện Phòng Tuyến Số
                      </h1>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Chinh phục 8 khu vực mô phỏng phòng thủ không gian mạng, vượt qua các thử thách trạm và đánh bại trùm lừa đảo để rèn luyện phản xạ an ninh mạng tối ưu.
                      </p>
                    </div>

                    <RoadmapSnakePath
                      userProfile={userProfile}
                      onNavigate={handleNavigate}
                      onOpenLeaderboard={() => setActiveTab('leaderboard')}
                      onEarnXp={handleEarnXp}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Professional Utility Footer */}
          <UtilityFooter />
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => handleNavigate(tab)}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* Mobile & Tablet Full Operations Drawer Menu */}
        <MobileDrawerMenu
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          activeTab={activeTab}
          userProfile={userProfile}
          currentUser={currentUser}
          onSelectTab={(tab, sub) => handleNavigate(tab, sub)}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenTheme={() => setIsThemeModalOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenScienceFairDemo={() => setIsScienceFairDemoOpen(true)}
        />

        {/* Modals */}
        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onNavigate={handleNavigate}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />

        <FriendsHubModal
          isOpen={isFriendsHubOpen}
          onClose={() => setIsFriendsHubOpen(false)}
          currentUser={currentUser}
          userProfile={userProfile}
          friendsList={friends}
          activityFeed={activityFeed}
          onSendGift={handleSendShieldToFriend}
          onStartDuel={handleStartFriendDuel}
          onAddFriend={handleAddFriend}
          onLikeActivity={handleLikeActivity}
          onBroadcastSos={handleBroadcastSos}
        />

        <FriendDuelModal
          isOpen={isDuelOpen}
          onClose={() => setIsDuelOpen(false)}
          friend={activeDuelFriend}
          userProfile={userProfile}
          onEarnXp={handleEarnXp}
        />

        <DailyQuestsModal
          isOpen={isDailyQuestsOpen}
          onClose={() => setIsDailyQuestsOpen(false)}
          quests={dailyQuests}
          chestsCount={chestsCount}
          streakDays={userProfile.streakDays || 3}
          onClaimQuest={handleClaimQuest}
          onOpenChest={handleOpenChest}
        />

        <LiveCallSimulatorModal
          isOpen={isCallSimulatorOpen}
          onClose={() => setIsCallSimulatorOpen(false)}
          onEarnXp={handleEarnXp}
        />

        <ScreenSentinelModal
          isOpen={isScreenSentinelOpen}
          onClose={() => setIsScreenSentinelOpen(false)}
          onOpenEmergency={() => {
            setIsScreenSentinelOpen(false);
            setIsEmergencyOpen(true);
          }}
        />

        <ScamSpeechDecoderModal
          isOpen={isSpeechDecoderOpen}
          onClose={() => setIsSpeechDecoderOpen(false)}
          onOpenEmergency={() => {
            setIsSpeechDecoderOpen(false);
            setIsEmergencyOpen(true);
          }}
        />

        <PublicWifiNfcShieldModal
          isOpen={isWifiShieldOpen}
          onClose={() => setIsWifiShieldOpen(false)}
        />

        <LiveScamRadarModal
          isOpen={isScamRadarOpen}
          onClose={() => setIsScamRadarOpen(false)}
          onOpenEmergency={() => {
            setIsScamRadarOpen(false);
            setIsEmergencyOpen(true);
          }}
        />

        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
        />

        <TrustedContactsModal
          isOpen={isTrustedContactsOpen}
          onClose={() => setIsTrustedContactsOpen(false)}
          contacts={userProfile.trustedContacts || []}
          onSaveContacts={handleUpdateContacts}
        />

        <FamilySchoolModal
          isOpen={isFamilySchoolOpen}
          onClose={() => setIsFamilySchoolOpen(false)}
        />

        <PrivacyCenterModal
          isOpen={isPrivacyCenterOpen}
          onClose={() => setIsPrivacyCenterOpen(false)}
          userId={userProfile.id}
          onDataCleared={handleDataCleared}
        />

        {/* Gamification Metric Modals */}
        <StreakModal
          isOpen={isStreakModalOpen}
          onClose={() => setIsStreakModalOpen(false)}
          streakDays={userProfile.streakDays || 1}
          gems={gems}
          hasFreeze={hasStreakFreeze}
          onBuyFreeze={handleBuyStreakFreeze}
          onNavigate={handleNavigate}
          onOpenFriends={() => setIsFriendsHubOpen(true)}
        />

        <StreakCelebrationModal
          isOpen={isStreakCelebrationOpen}
          onClose={() => setIsStreakCelebrationOpen(false)}
          oldStreak={prevStreakValue}
          newStreak={userProfile.streakDays || 1}
        />

        <GemsModal
          isOpen={isGemsModalOpen}
          onClose={() => setIsGemsModalOpen(false)}
          gems={gems}
          onNavigate={handleNavigate}
        />

        <HeartsModal
          isOpen={isHeartsModalOpen}
          onClose={() => setIsHeartsModalOpen(false)}
          lives={lives}
          maxLives={5}
          gems={gems}
          onRefillLives={handleRefillLives}
          onNavigate={handleNavigate}
        />

        {/* Full Theme Studio Customizer Modal */}
        <ThemeCustomizerModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          currentConfig={themeConfig}
          onConfigChange={(newConfig) => {
            setThemeConfig(newConfig);
            saveThemeConfig(newConfig);
          }}
        />

        {/* National Science Fair ViSEF 5-Minute Evaluation Demo Modal */}
        <NationalScienceFairDemoModal
          isOpen={isScienceFairDemoOpen}
          onClose={() => setIsScienceFairDemoOpen(false)}
          onNavigateToResearch={() => {
            setIsScienceFairDemoOpen(false);
            setActiveTab('research');
          }}
          onNavigateToMainUI={() => {
            setIsScienceFairDemoOpen(false);
            setActiveTab('home');
          }}
          onNavigateToSimulator={() => {
            setIsScienceFairDemoOpen(false);
            setActiveTab('train');
            setTrainSubTab('arena');
          }}
        />
      </div>
    </LanguageProvider>
  );
}
