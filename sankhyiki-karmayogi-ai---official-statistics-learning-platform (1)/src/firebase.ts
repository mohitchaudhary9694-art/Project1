import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserProfile } from './types';
import { INITIAL_COMPETENCIES } from './data/mockData';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore with custom database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;
  return await syncUserProfile(firebaseUser);
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Sync or create user profile in Firestore
 */
export async function syncUserProfile(firebaseUser: FirebaseUser, additionalData?: Partial<UserProfile>): Promise<UserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const existing = userSnap.data() as UserProfile;
    // Update last active
    await setDoc(userRef, {
      ...existing,
      ...additionalData,
      lastLoginAt: serverTimestamp(),
    }, { merge: true });
    return {
      ...existing,
      ...additionalData,
      id: firebaseUser.uid,
      email: firebaseUser.email || existing.email,
    };
  }

  // Create new profile
  const isGov = firebaseUser.email?.endsWith('.gov.in') || firebaseUser.email?.includes('gov.in');
  const newProfile: UserProfile = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0].replace('.', ' ') || 'Statistical Officer',
    email: firebaseUser.email || '',
    govEmployeeId: `ISS/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    designation: isGov ? 'Senior Statistical Officer' : 'Statistical Officer / Research Fellow',
    cadre: 'ISS',
    department: 'NAD',
    currentAssignment: 'National Statistical Quality & Analysis Operations',
    experienceYears: 5,
    education: 'Postgraduate in Statistics / Economics',
    role: firebaseUser.email?.includes('admin') ? 'admin' : 'learner',
    cpdHoursCompleted: 24,
    cpdHoursTarget: 50,
    completedTrainings: ['Official Statistics Induction (NSSTA)'],
    enrolledCourseIds: ['igot_stat_101', 'igot_tech_301', 'igot_gov_401'],
    competencies: INITIAL_COMPETENCIES,
    careerGoal: 'Contribute to modernized data-driven national policy formulation.',
    mfaEnabled: true,
    onboardingCompleted: false,
    diagnosticCompleted: false,
    ...additionalData,
  };

  await setDoc(userRef, {
    ...newProfile,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });

  return newProfile;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Permission/Operation Notice:', JSON.stringify(errInfo));
}

/**
 * Save updated user profile to Firestore & Local Storage
 */
export async function saveUserProfile(user: UserProfile): Promise<void> {
  // Always update local cache for smooth offline/session recovery
  try {
    localStorage.setItem('sankhyiki_current_user', JSON.stringify(user));
  } catch (e) {
    // ignore storage quota
  }

  // Only attempt Firestore write if an active Firebase Auth user session exists
  if (auth.currentUser) {
    const targetDocId = user.id === auth.currentUser.uid ? user.id : auth.currentUser.uid;
    const path = `users/${targetDocId}`;
    try {
      const userRef = doc(db, 'users', targetDocId);
      await setDoc(userRef, {
        ...user,
        id: targetDocId,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
}

/**
 * Record assessment test attempt in Firestore & Local Storage
 */
export async function saveAssessmentResult(userId: string, assessmentData: any): Promise<void> {
  try {
    const localHistory = JSON.parse(localStorage.getItem('sankhyiki_assessments') || '[]');
    localHistory.push({ ...assessmentData, userId, submittedAt: new Date().toISOString() });
    localStorage.setItem('sankhyiki_assessments', JSON.stringify(localHistory));
  } catch (e) {
    // ignore
  }

  if (auth.currentUser) {
    const path = 'assessments';
    try {
      const assessmentRef = doc(collection(db, path));
      await setDoc(assessmentRef, {
        ...assessmentData,
        userId: auth.currentUser.uid || userId,
        submittedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
}

/**
 * Save Role Digital Twin to Firestore & Local Storage
 */
export async function saveRoleDigitalTwin(role: any): Promise<void> {
  try {
    const localTwins = JSON.parse(localStorage.getItem('sankhyiki_role_twins') || '{}');
    localTwins[role.id] = role;
    localStorage.setItem('sankhyiki_role_twins', JSON.stringify(localTwins));
  } catch (e) {
    // ignore
  }

  if (auth.currentUser) {
    const path = `role_twins/${role.id}`;
    try {
      const roleRef = doc(db, 'role_twins', role.id);
      await setDoc(roleRef, {
        ...role,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
}

/**
 * Fetch all Role Digital Twins from Firestore or Local Storage
 */
export async function fetchRoleDigitalTwins(): Promise<any[]> {
  try {
    if (auth.currentUser) {
      const snap = await getDocs(collection(db, 'role_twins'));
      if (!snap.empty) {
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    }
    const localTwins = JSON.parse(localStorage.getItem('sankhyiki_role_twins') || '{}');
    const localValues = Object.values(localTwins);
    if (localValues.length > 0) {
      return localValues;
    }
  } catch (e) {
    console.warn('Error fetching role twins:', e);
  }
  return [];
}

