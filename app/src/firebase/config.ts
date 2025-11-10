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
  setPersistence,
  getRedirectResult,
  indexedDBLocalPersistence,
  onAuthStateChanged,
  signInAnonymously,
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

onAuthStateChanged(auth, async (user) => {
  if (!user) await signInAnonymously(auth);
});

export async function linkGoogleAccount() {
  const provider = new GoogleAuthProvider();
  await linkWithRedirect(auth.currentUser, provider);
}

let hasInitialized = false;

export async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Account successfully linked:", result.user.uid);
    }
  } catch (err) {
    console.error("Redirect error:", err);
  }
  
  hasInitialized = true;

  if (!auth.currentUser) {
    console.log("No user after redirect. signing in anonymously");
    await signInAnonymously(auth);
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!hasInitialized) return;

  if (!user) {
    console.log("Auth state: no user anonymous login");
    await signInAnonymously(auth);
  }
});
