import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User as FirebaseUser,
  signInAnonymously,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, facebookProvider, githubProvider, db } from '../firebase';
import { UserAccount, UserProfile, ExperienceMode } from '../types';

export function mapFirebaseUserToAccount(
  fbUser: FirebaseUser,
  profileData?: Partial<UserProfile>
): UserAccount {
  const profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || profileData?.name || 'Vệ Binh SCAMGUARD',
    username: profileData?.username || fbUser.email?.split('@')[0] || `user_${fbUser.uid.substring(0, 6)}`,
    email: fbUser.email || `${fbUser.uid}@scamguard.user`,
    mode: (profileData?.mode as ExperienceMode) || 'adult',
    language: profileData?.language || 'vi',
    overallScore: profileData?.overallScore !== undefined ? profileData.overallScore : 80,
    xp: profileData?.xp !== undefined ? profileData.xp : 200,
    streakDays: profileData?.streakDays !== undefined ? profileData.streakDays : 1,
    completedScenarios: profileData?.completedScenarios || ['bank-lockout-alert'],
    trustedContacts: profileData?.trustedContacts || [],
    avatarUrl:
      fbUser.photoURL ||
      profileData?.avatarUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || fbUser.email || 'SG')}&backgroundColor=0f172a,1e293b`,
    provider: (fbUser.providerData[0]?.providerId.replace('.com', '') as any) || 'firebase',
    createdAt: profileData?.createdAt || new Date().toISOString(),
  };

  return {
    id: fbUser.uid,
    username: profile.username || 'user',
    email: profile.email || '',
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    provider: profile.provider as any || 'firebase',
    profile,
    token: `fb_${fbUser.uid}`,
    createdAt: profile.createdAt || new Date().toISOString(),
  };
}

/**
 * Register with Email & Password via Firebase Auth & save profile to Firestore
 */
export async function registerWithFirebase(params: {
  name: string;
  username: string;
  email: string;
  password: string;
  mode?: ExperienceMode;
}): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, params.email, params.password);
    const fbUser = cred.user;

    // Update display name on Firebase Auth user
    if (params.name) {
      await updateProfile(fbUser, { displayName: params.name });
    }

    const initialProfile: UserProfile = {
      id: fbUser.uid,
      name: params.name,
      username: params.username.toLowerCase(),
      email: params.email,
      mode: params.mode || 'adult',
      language: 'vi',
      overallScore: 75,
      xp: 150,
      streakDays: 1,
      completedScenarios: [],
      trustedContacts: [],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(params.name)}&backgroundColor=0f172a,1e293b`,
      provider: 'firebase',
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      await setDoc(userRef, {
        ...initialProfile,
        updatedAt: new Date().toISOString(),
      });
    } catch (fsErr) {
      console.warn('Firestore profile write fallback to local state', fsErr);
    }

    const account = mapFirebaseUserToAccount(fbUser, initialProfile);
    return { success: true, user: account };
  } catch (err: any) {
    let message = err.message || 'Lỗi đăng ký Firebase.';
    if (err.code === 'auth/email-already-in-use') {
      message = 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.';
    } else if (err.code === 'auth/weak-password') {
      message = 'Mật khẩu quá yếu. Vui lòng nhập tối thiểu 6 ký tự.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Định dạng email không hợp lệ.';
    }
    return { success: false, error: message };
  }
}

/**
 * Sign in with Email & Password via Firebase Auth
 */
export async function loginWithFirebase(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;

    // Fetch existing profile from Firestore if available
    let profileData: Partial<UserProfile> | undefined;
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        profileData = snapshot.data() as UserProfile;
      }
    } catch (fsErr) {
      console.warn('Firestore profile fetch fallback', fsErr);
    }

    const account = mapFirebaseUserToAccount(fbUser, profileData);
    return { success: true, user: account };
  } catch (err: any) {
    let message = err.message || 'Đăng nhập không thành công.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      message = 'Email hoặc mật khẩu không chính xác.';
    } else if (err.code === 'auth/too-many-requests') {
      message = 'Quá nhiều lượt thử sai. Vui lòng đợi một lát rồi thử lại.';
    }
    return { success: false, error: message };
  }
}

/**
 * Sign in with Google Popup via Firebase Auth
 */
export async function signInWithGoogleFirebase(
  mode: ExperienceMode = 'adult'
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const fbUser = cred.user;

    let profileData: Partial<UserProfile> | undefined;
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        profileData = snapshot.data() as UserProfile;
      } else {
        // Create new user profile in Firestore
        profileData = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Người dùng Google',
          username: fbUser.email?.split('@')[0] || `google_${fbUser.uid.substring(0, 5)}`,
          email: fbUser.email || '',
          mode,
          language: 'vi',
          overallScore: 82,
          xp: 300,
          streakDays: 1,
          completedScenarios: ['bank-lockout-alert'],
          trustedContacts: [],
          avatarUrl: fbUser.photoURL || undefined,
          provider: 'google',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, {
          ...profileData,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (fsErr) {
      console.warn('Firestore Google auth sync warning', fsErr);
    }

    const account = mapFirebaseUserToAccount(fbUser, profileData);
    return { success: true, user: account };
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Cửa sổ đăng nhập Google đã đóng.' };
    }
    if (err.code === 'auth/popup-blocked') {
      return { success: false, error: 'Trình duyệt chặn popup. Vui lòng cho phép popup để đăng nhập Google.' };
    }
    return { success: false, error: err.message || 'Lỗi đăng nhập Google.' };
  }
}

/**
 * Sign in with GitHub Popup via Firebase Auth
 */
export async function signInWithGithubFirebase(
  mode: ExperienceMode = 'adult'
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  try {
    const cred = await signInWithPopup(auth, githubProvider);
    const fbUser = cred.user;

    let profileData: Partial<UserProfile> | undefined;
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        profileData = snapshot.data() as UserProfile;
      } else {
        profileData = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Lập trình viên GitHub',
          username: fbUser.email?.split('@')[0] || `github_${fbUser.uid.substring(0, 5)}`,
          email: fbUser.email || '',
          mode,
          language: 'vi',
          overallScore: 85,
          xp: 450,
          streakDays: 1,
          completedScenarios: ['bank-lockout-alert'],
          trustedContacts: [],
          avatarUrl: fbUser.photoURL || undefined,
          provider: 'github',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, {
          ...profileData,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (fsErr) {
      console.warn('Firestore GitHub auth sync warning', fsErr);
    }

    const account = mapFirebaseUserToAccount(fbUser, profileData);
    return { success: true, user: account };
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Cửa sổ đăng nhập GitHub đã đóng.' };
    }
    return { success: false, error: err.message || 'Lỗi đăng nhập GitHub.' };
  }
}

/**
 * Sign in with Facebook Popup via Firebase Auth
 */
export async function signInWithFacebookFirebase(
  mode: ExperienceMode = 'adult'
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  try {
    const cred = await signInWithPopup(auth, facebookProvider);
    const fbUser = cred.user;

    let profileData: Partial<UserProfile> | undefined;
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        profileData = snapshot.data() as UserProfile;
      } else {
        profileData = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Người dùng Facebook',
          username: fbUser.email?.split('@')[0] || `fb_${fbUser.uid.substring(0, 5)}`,
          email: fbUser.email || '',
          mode,
          language: 'vi',
          overallScore: 80,
          xp: 250,
          streakDays: 1,
          completedScenarios: ['bank-lockout-alert'],
          trustedContacts: [],
          avatarUrl: fbUser.photoURL || undefined,
          provider: 'facebook',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, {
          ...profileData,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (fsErr) {
      console.warn('Firestore Facebook auth sync warning', fsErr);
    }

    const account = mapFirebaseUserToAccount(fbUser, profileData);
    return { success: true, user: account };
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Cửa sổ đăng nhập Facebook đã đóng.' };
    }
    return { success: false, error: err.message || 'Lỗi đăng nhập Facebook.' };
  }
}

/**
 * Sync updated user profile into Firestore
 */
export async function syncUserProfileToFirestore(
  userId: string,
  profile: Partial<UserProfile>
) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    // Graceful fallback for demo or offline accounts
  }
}

/**
 * Sign out of Firebase
 */
export async function logoutFromFirebase() {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Firebase signOut', e);
  }
}
