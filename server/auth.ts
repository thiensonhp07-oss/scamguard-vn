import { UserAccount, UserProfile, ExperienceMode, TrustedContact } from '../src/types';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }
}

// User database
const usersStore = new Map<string, {
  account: UserAccount;
  passwordHash?: string;
}>();

// Sessions map: token -> userId
const sessionsStore = new Map<string, string>();

function saveUsersToDisk() {
  try {
    const list: Array<{ id: string; account: UserAccount; passwordHash?: string }> = [];
    for (const [id, entry] of usersStore.entries()) {
      list.push({ id, account: entry.account, passwordHash: entry.passwordHash });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Auth] Failed to persist users to disk:', err);
  }
}

function loadUsersFromDisk() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const list: Array<{ id: string; account: UserAccount; passwordHash?: string }> = JSON.parse(raw);
      for (const item of list) {
        usersStore.set(item.id, { account: item.account, passwordHash: item.passwordHash });
        if (item.account.token) {
          sessionsStore.set(item.account.token, item.id);
        }
      }
      console.log(`🛡️ [Auth] Loaded ${list.length} saved user accounts from disk.`);
    }
  } catch (err) {
    console.warn('[Auth] Failed to load users from disk:', err);
  }
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(`scamguard_salt_${password}`).digest('hex');
}

function generateToken(userId: string): string {
  const token = `sg_tok_${userId}_${crypto.randomBytes(16).toString('hex')}`;
  sessionsStore.set(token, userId);
  return token;
}

// Pre-seeded demo user profiles for instant 1-click test drive across different demographics
export const DEMO_PRESET_USERS: Array<{
  id: string;
  username: string;
  email: string;
  name: string;
  mode: ExperienceMode;
  roleDescription: string;
  avatarUrl: string;
  score: number;
  xp: number;
  streak: number;
  completedScenarios: string[];
  trustedContacts: TrustedContact[];
}> = [
  {
    id: 'user_senior_thanh',
    username: 'bacthanh68',
    email: 'bacthanh.hanoi@gmail.com',
    name: 'Bác Nguyễn Văn Thành (68 tuổi)',
    mode: 'senior',
    roleDescription: 'Cao niên cảnh giác - Ưu tiên chữ lớn & xác minh cuộc gọi gia đình',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',
    score: 86,
    xp: 2150,
    streak: 7,
    completedScenarios: ['bank-lockout-alert', 'police-investigation-secrecy', 'package-delivery-failed'],
    trustedContacts: [
      {
        id: 'tc_s1',
        name: 'Con Trai Dũng (Kỹ sư)',
        relationship: 'Con Trai',
        phoneOrHandle: '0912 345 678',
        isFavorite: true,
      },
      {
        id: 'tc_s2',
        name: 'Cảnh Sát Khu Vực (Trung Tá Hùng)',
        relationship: 'Cơ Quan Chức Năng',
        phoneOrHandle: '024 3825 2525',
        isFavorite: true,
      },
    ],
  },
  {
    id: 'user_adult_van',
    username: 'thanhvan_fin',
    email: 'thanhvan.pham@company.vn',
    name: 'Phạm Thanh Vân (32 tuổi)',
    mode: 'adult',
    roleDescription: 'Nhân viên văn phòng - Chuyên sâu phòng ngừa lừa đảo ngân hàng & sàn thương mại',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    score: 92,
    xp: 3400,
    streak: 12,
    completedScenarios: ['bank-lockout-alert', 'fake-ecommerce-refund', 'police-investigation-secrecy', 'crypto-pig-butchering'],
    trustedContacts: [
      {
        id: 'tc_a1',
        name: 'Chồng Hoàng Minh',
        relationship: 'Vợ/Chồng',
        phoneOrHandle: '0988 777 666',
        isFavorite: true,
      },
      {
        id: 'tc_a2',
        name: 'Tổng Đài Vietcombank',
        relationship: 'Hotline Ngân Hàng',
        phoneOrHandle: '1900 54 54 13',
        isFavorite: true,
      },
    ],
  },
  {
    id: 'user_student_minhanh',
    username: 'minhanh_genz',
    email: 'minhanh.stu@university.edu.vn',
    name: 'Lê Minh Anh (19 tuổi)',
    mode: 'teen',
    roleDescription: 'Sinh viên thế hệ số - Phòng chống bẫy việc làm online & Deepfake bạn bè',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face',
    score: 78,
    xp: 1280,
    streak: 4,
    completedScenarios: ['telegram-job-task', 'deepfake-video-borrow'],
    trustedContacts: [
      {
        id: 'tc_t1',
        name: 'Mẹ Hiền',
        relationship: 'Phụ Huynh',
        phoneOrHandle: '0903 112 233',
        isFavorite: true,
      },
    ],
  },
  {
    id: 'user_expert_bao',
    username: 'quocbao_sec',
    email: 'bao.sec@cyberguard.tech',
    name: 'Trần Quốc Bảo (Chuyên Gia An Ninh)',
    mode: 'adult',
    roleDescription: 'Chuyên gia phân tích mã độc & điều tra pháp y lừa đảo mạng',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    score: 98,
    xp: 5600,
    streak: 21,
    completedScenarios: ['bank-lockout-alert', 'police-investigation-secrecy', 'package-delivery-failed', 'telegram-job-task', 'crypto-pig-butchering', 'deepfake-video-borrow'],
    trustedContacts: [
      {
        id: 'tc_e1',
        name: 'Trung Tâm Giám Sát An Toàn Không Gian Mạng Quốc Gia (NCSC)',
        relationship: 'Cơ Quan An Ninh',
        phoneOrHandle: '024 3209 6789',
        isFavorite: true,
      },
    ],
  },
];

// Seed preset accounts into store
DEMO_PRESET_USERS.forEach((preset) => {
  const token = `sg_tok_${preset.id}_demo_preset`;
  sessionsStore.set(token, preset.id);

  const profile: UserProfile = {
    id: preset.id,
    name: preset.name,
    username: preset.username,
    email: preset.email,
    mode: preset.mode,
    language: 'vi',
    overallScore: preset.score,
    xp: preset.xp,
    streakDays: preset.streak,
    completedScenarios: preset.completedScenarios,
    trustedContacts: preset.trustedContacts,
    avatarUrl: preset.avatarUrl,
    provider: 'demo',
    createdAt: new Date().toISOString(),
  };

  const account: UserAccount = {
    id: preset.id,
    username: preset.username,
    email: preset.email,
    name: preset.name,
    avatarUrl: preset.avatarUrl,
    provider: 'demo',
    profile,
    token,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(preset.id, {
    account,
    passwordHash: hashPassword('123456'), // Default password for demo if manually tested
  });
});

// Load previously registered and saved users from persistent disk
loadUsersFromDisk();

/**
 * Register a new user with username and password
 */
export function registerUser(params: {
  name: string;
  username: string;
  email?: string;
  password?: string;
  mode?: ExperienceMode;
}): { success: boolean; user?: UserAccount; error?: string } {
  const cleanUsername = (params.username || '').trim().toLowerCase();
  const cleanName = (params.name || '').trim();
  const cleanEmail = (params.email || `${cleanUsername}@scamguard.local`).trim().toLowerCase();

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: 'Tên đăng nhập phải có ít nhất 3 ký tự.' };
  }
  if (!cleanName) {
    return { success: false, error: 'Vui lòng nhập Họ và Tên của bạn.' };
  }
  if (params.password && params.password.length < 4) {
    return { success: false, error: 'Mật khẩu phải có ít nhất 4 ký tự.' };
  }

  // Check if username or email already exists
  for (const [, entry] of usersStore.entries()) {
    if (entry.account.username === cleanUsername) {
      return { success: false, error: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.' };
    }
    if (params.email && entry.account.email === cleanEmail) {
      return { success: false, error: 'Email này đã được đăng ký tài khoản.' };
    }
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const token = generateToken(userId);

  const profile: UserProfile = {
    id: userId,
    name: cleanName,
    username: cleanUsername,
    email: cleanEmail,
    mode: params.mode || 'adult',
    language: 'vi',
    overallScore: 70,
    xp: 100,
    streakDays: 1,
    completedScenarios: [],
    trustedContacts: [],
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0f172a,1e293b,334155`,
    provider: 'local',
    createdAt: new Date().toISOString(),
  };

  const account: UserAccount = {
    id: userId,
    username: cleanUsername,
    email: cleanEmail,
    name: cleanName,
    avatarUrl: profile.avatarUrl,
    provider: 'local',
    profile,
    token,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(userId, {
    account,
    passwordHash: params.password ? hashPassword(params.password) : undefined,
  });

  saveUsersToDisk();

  return { success: true, user: account };
}

/**
 * Log in with username or email and password
 */
export function loginUser(params: {
  usernameOrEmail: string;
  password?: string;
}): { success: boolean; user?: UserAccount; error?: string } {
  const query = (params.usernameOrEmail || '').trim().toLowerCase();
  if (!query) {
    return { success: false, error: 'Vui lòng nhập tên đăng nhập hoặc email.' };
  }

  let matchedUserId: string | null = null;
  let matchedEntry: { account: UserAccount; passwordHash?: string } | null = null;

  for (const [uid, entry] of usersStore.entries()) {
    if (
      entry.account.username.toLowerCase() === query ||
      entry.account.email.toLowerCase() === query
    ) {
      matchedUserId = uid;
      matchedEntry = entry;
      break;
    }
  }

  if (!matchedUserId || !matchedEntry) {
    return { success: false, error: 'Không tìm thấy tài khoản với thông tin này.' };
  }

  // If password was set, verify hash
  if (matchedEntry.passwordHash && params.password) {
    const inputHash = hashPassword(params.password);
    if (matchedEntry.passwordHash !== inputHash) {
      return { success: false, error: 'Mật khẩu không chính xác. Vui lòng thử lại.' };
    }
  }

  // Generate fresh token
  const token = generateToken(matchedUserId);
  matchedEntry.account.token = token;

  return { success: true, user: matchedEntry.account };
}

/**
 * Handle OAuth / Social Login (Google, Facebook, GitHub)
 */
export function socialLogin(params: {
  provider: 'google' | 'facebook' | 'github';
  name?: string;
  email?: string;
  avatarUrl?: string;
  mode?: ExperienceMode;
}): { success: boolean; user?: UserAccount } {
  const provider = params.provider;
  const providerNames: Record<string, string> = {
    google: 'Tài khoản Google',
    facebook: 'Tài khoản Facebook',
    github: 'Tài khoản GitHub',
  };

  const defaultName = params.name || `${providerNames[provider] || 'Người dùng'} (${provider.toUpperCase()})`;
  const email = params.email || `${provider}_${Date.now()}@auth.${provider}.com`;
  const username = `${provider}_${Math.random().toString(36).substring(2, 8)}`;

  // Check if existing social account matches email
  for (const [uid, entry] of usersStore.entries()) {
    if (entry.account.email === email && entry.account.provider === provider) {
      const token = generateToken(uid);
      entry.account.token = token;
      return { success: true, user: entry.account };
    }
  }

  // Otherwise create new user for this social identity
  const userId = `user_${provider}_${Date.now()}`;
  const token = generateToken(userId);

  const defaultAvatars: Record<string, string> = {
    google: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
    facebook: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop&crop=face',
    github: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&h=120&fit=crop&crop=face',
  };

  const avatarUrl = params.avatarUrl || defaultAvatars[provider];

  const profile: UserProfile = {
    id: userId,
    name: defaultName,
    username,
    email,
    mode: params.mode || 'adult',
    language: 'vi',
    overallScore: 80,
    xp: 250,
    streakDays: 1,
    completedScenarios: ['bank-lockout-alert'],
    trustedContacts: [],
    avatarUrl,
    provider,
    createdAt: new Date().toISOString(),
  };

  const account: UserAccount = {
    id: userId,
    username,
    email,
    name: defaultName,
    avatarUrl,
    provider,
    profile,
    token,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(userId, { account });
  saveUsersToDisk();
  return { success: true, user: account };
}

/**
 * Get user by session token or userId
 */
export function getUserByTokenOrId(identifier: string): UserAccount | null {
  if (!identifier) return null;

  // Check if identifier is a session token
  const userIdFromSession = sessionsStore.get(identifier);
  if (userIdFromSession && usersStore.has(userIdFromSession)) {
    return usersStore.get(userIdFromSession)!.account;
  }

  // Check if identifier is directly a userId
  if (usersStore.has(identifier)) {
    return usersStore.get(identifier)!.account;
  }

  return null;
}

/**
 * Update user profile
 */
export function updateUserProfile(userId: string, updates: Partial<UserProfile>): UserAccount | null {
  const entry = usersStore.get(userId);
  if (!entry) return null;

  entry.account.profile = {
    ...entry.account.profile,
    ...updates,
  };

  if (updates.name) {
    entry.account.name = updates.name;
  }
  if (updates.avatarUrl) {
    entry.account.avatarUrl = updates.avatarUrl;
  }

  saveUsersToDisk();

  return entry.account;
}

/**
 * Reset a user account or all accounts data
 */
export function resetUserAccountData(userId?: string) {
  if (userId && usersStore.has(userId)) {
    const entry = usersStore.get(userId)!;
    entry.account.profile = {
      ...entry.account.profile,
      completedScenarios: [],
      xp: 0,
      overallScore: 50,
      streakDays: 0,
      trustedContacts: [],
    };
    return { success: true, message: `Đã reset toàn bộ dữ liệu tài khoản ${userId}` };
  }

  // Reset all users in store to baseline 0
  for (const [, entry] of usersStore.entries()) {
    entry.account.profile = {
      ...entry.account.profile,
      completedScenarios: [],
      xp: 0,
      overallScore: 50,
      streakDays: 0,
      trustedContacts: [],
    };
  }
  return { success: true, message: 'Đã reset toàn bộ dữ liệu người dùng trên hệ thống.' };
}

/**
 * List all preset demo users
 */
export function getPresetDemoUsers() {
  return DEMO_PRESET_USERS.map((preset) => {
    const entry = usersStore.get(preset.id);
    return {
      id: preset.id,
      name: preset.name,
      username: preset.username,
      email: preset.email,
      mode: preset.mode,
      roleDescription: preset.roleDescription,
      avatarUrl: preset.avatarUrl,
      score: entry ? entry.account.profile.overallScore || preset.score : preset.score,
      xp: entry ? entry.account.profile.xp || preset.xp : preset.xp,
      streak: entry ? entry.account.profile.streakDays || preset.streak : preset.streak,
    };
  });
}
