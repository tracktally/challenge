import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
    doc,
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager, setDoc,
} from "firebase/firestore"


import {
  getAuth,
  GoogleAuthProvider, linkWithRedirect ,
  signInWithRedirect,
  setPersistence,
  getRedirectResult,
  signInWithPopup,
  linkWithPopup,
  indexedDBLocalPersistence,
  onAuthStateChanged,
  signInAnonymously,
  OAuthProvider,
  type User,
} from "firebase/auth";

const ENV = (import.meta.env.VITE_APP_ENV ?? "dev") as "dev" | "prod";

// beanrm
const devConfig = {
  apiKey: "AIzaSyB-M1n9lAU6vUO9xltMGUCGwObAizuc1No",
  authDomain: "tracktally-dev.firebaseapp.com",
  projectId: "tracktally-dev",
  storageBucket: "tracktally-dev.firebasestorage.app",
  messagingSenderId: "185163725463",
  appId: "1:185163725463:web:047222a4e33539975007d2",
  measurementId: "G-0EQ0P6E08P"
};

const challengeDevConfig = {
    apiKey: "AIzaSyAh_nLoOwMGCTR3PWCilmKRl9H9LmcLxDo",
    authDomain: "challenge-80397.firebaseapp.com",
    projectId: "challenge-80397",
    storageBucket: "challenge-80397.firebasestorage.app",
    messagingSenderId: "128540730871",
    appId: "1:128540730871:web:d6cbf1257b7a78fdc8baf2"
};

const prodConfig = {
  apiKey: "AIzaSyBUnmdskhEgf0cZlWG7VYwrtyA2mhkA7SM",
  authDomain: "tracktally-prod.firebaseapp.com",
  projectId: "tracktally-prod",
  storageBucket: "tracktally-prod.firebasestorage.app",
  messagingSenderId: "766523427751",
  appId: "1:766523427751:web:18003f732a266ddda24482",
  measurementId: "G-GQ5L5XKTT6"
};

export let siteSuffix = "";
// let config = devConfig;
let config = challengeDevConfig;

if (ENV === "prod") {
  config = prodConfig;
  console.log("Using prod firebase config");
} else {
  console.log("Using dev firebase config");
  siteSuffix = "testing";
}


const app = initializeApp(config);
export const auth = getAuth(app);

export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
    }),
});

export async function linkGoogleAccount() {
  const provider = new GoogleAuthProvider();

  if (auth.currentUser?.isAnonymous) {
    // link anonymous to google
    return linkWithRedirect(auth.currentUser, provider);
  } else {
    // sign in normally
    return signInWithRedirect(auth, provider);
  }
}

export async function linkAppleAccount() {
  const provider = new OAuthProvider("apple.com");

  if (auth.currentUser?.isAnonymous) {
    return linkWithRedirect(auth.currentUser, provider);
  } else {
    return signInWithRedirect(auth, provider);
  }
}


let initialized = false;

onAuthStateChanged(auth, async (user) => {
  if (!initialized) {
    initialized = true;
    if (!user) {
      console.log("No user on initial load → logging in anonymously");
      await signInAnonymously(auth);
    }
    return;
  }

  if (!user) {
    console.log("User signed out → anonymous login");
    await signInAnonymously(auth);
  }
});

export async function getAuthEmail(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const token = await user.getIdTokenResult();
  return (
    token.claims.email ||
    user.email ||
    user.providerData?.find(p => p.providerId === "google.com")?.email ||
    null
  );
}

export function isGoogleLinked(user: User){
  return user?.providerData?.some(
              (p) => p.providerId === "google.com");
}

// does not work without apple developer account
export function isAppleLinked(user: User) {
  return user?.providerData?.some(
              (p) => p.providerId === "apple.com");
}              