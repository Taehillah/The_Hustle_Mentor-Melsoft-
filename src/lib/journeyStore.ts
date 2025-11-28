import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";

type NotesMap = Record<string, string>;

const USER_ID_KEY = "hm_user_id";
const JOURNEY_ID = "default";

const createUserId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user-${Math.random().toString(36).slice(2, 10)}`;
};

const getUserId = () => {
  if (typeof window === "undefined") return null;
  const existing = localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;
  const next = createUserId();
  localStorage.setItem(USER_ID_KEY, next);
  return next;
};

const journeyDoc = (userId: string) => doc(db, "users", userId, "journeys", JOURNEY_ID);

export const loadJourney = async (): Promise<NotesMap> => {
  const userId = getUserId();
  if (!userId) return {};
  try {
    const snap = await getDoc(journeyDoc(userId));
    const data = snap.data() as { notes?: NotesMap } | undefined;
    return data?.notes || {};
  } catch (error) {
    console.error("Failed to load journey", error);
    return {};
  }
};

export const saveJourney = async (notes: NotesMap) => {
  const userId = getUserId();
  if (!userId) throw new Error("User not available in browser");
  try {
    await setDoc(
      journeyDoc(userId),
      {
        notes,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    const err = error as FirestoreError;
    console.error("Failed to save journey", err?.message || error);
    throw error;
  }
};
