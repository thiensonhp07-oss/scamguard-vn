import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App instance safely (singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Auth Providers for Social Sign In
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Initialize Firestore with custom databaseId if configured
const configWithDbId = firebaseConfig as typeof firebaseConfig & { firestoreDatabaseId?: string };
export const db = configWithDbId.firestoreDatabaseId && configWithDbId.firestoreDatabaseId !== '(default)'
  ? initializeFirestore(app, {}, configWithDbId.firestoreDatabaseId)
  : getFirestore(app);

export default app;
