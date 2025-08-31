import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
    doc,
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager, setDoc,
} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAh_nLoOwMGCTR3PWCilmKRl9H9LmcLxDo",
    authDomain: "challenge-80397.firebaseapp.com",
    projectId: "challenge-80397",
    storageBucket: "challenge-80397.firebasestorage.app",
    messagingSenderId: "128540730871",
    appId: "1:128540730871:web:d6cbf1257b7a78fdc8baf2"
};
const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
    }),
});

// export const db = initializeFirestore(app, {
//   localCache: persistentLocalCache({
//     tabManager: persistentMultipleTabManager(),
//   }),
// });




