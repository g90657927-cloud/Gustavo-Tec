import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { UserProfile, OnlineChatMessage } from '../types';
import { ThemeSettings } from '../context/ThemeContext';

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
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Persists or updates the complete user profile in Firestore
 */
export async function persistUserProfileToFirestore(userId: string, profile: Partial<UserProfile>): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      ...profile,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Saves and synchronizes reading & visual preferences in Firestore
 */
export async function persistReadingPreferences(userId: string, userEmail: string, settings: ThemeSettings): Promise<void> {
  const path = `reading_preferences/${userId}`;
  try {
    const prefDocRef = doc(db, 'reading_preferences', userId);
    await setDoc(prefDocRef, {
      userId,
      userEmail,
      isDarkReadingMode: settings.isDarkReadingMode,
      opacityLevel: settings.opacityLevel,
      isHighContrast: settings.isHighContrast,
      isWarmTint: settings.isWarmTint,
      spatial3DMode: settings.spatial3DMode,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Loads user reading preferences from Firestore
 */
export async function fetchReadingPreferences(userId: string): Promise<Partial<ThemeSettings> | null> {
  const path = `reading_preferences/${userId}`;
  try {
    const prefDocRef = doc(db, 'reading_preferences', userId);
    const snap = await getDoc(prefDocRef);
    if (snap.exists()) {
      return snap.data() as Partial<ThemeSettings>;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export interface StoredAiChatMessage {
  id: string;
  userId: string;
  userEmail?: string;
  role: 'user' | 'model';
  content: string;
  presetRole?: string;
  timestamp: number;
  formattedTime?: string;
}

/**
 * Saves an AI ChatBot conversation turn to Firestore
 */
export async function persistAiChatMessage(
  userId: string,
  userEmail: string,
  role: 'user' | 'model',
  content: string,
  presetRole: string
): Promise<string | null> {
  const path = 'ai_chat_history';
  try {
    const docRef = await addDoc(collection(db, 'ai_chat_history'), {
      userId,
      userEmail,
      role,
      content,
      presetRole,
      timestamp: Date.now(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return null;
  }
}

/**
 * Loads the user's AI ChatBot history from Firestore
 */
export async function fetchAiChatHistory(userId: string, limitCount = 30): Promise<StoredAiChatMessage[]> {
  const path = 'ai_chat_history';
  try {
    const q = query(
      collection(db, 'ai_chat_history'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId,
        userEmail: data.userEmail,
        role: data.role,
        content: data.content,
        presetRole: data.presetRole,
        timestamp: data.timestamp || Date.now()
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Clears AI ChatBot history in Firestore for a user
 */
export async function clearUserAiChatHistory(userId: string): Promise<void> {
  const path = 'ai_chat_history';
  try {
    const q = query(
      collection(db, 'ai_chat_history'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
