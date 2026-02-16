import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache,
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";  // to uncomment on deploy
  
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID  // to uncomment on deploy
};

const app = initializeApp(firebaseConfig);

const warehouseDB = initializeFirestore(app, {
  localeCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const warehouseStorage = getStorage(app);


export { warehouseDB, warehouseStorage };

// const analytics = getAnalytics(app);  // to uncomment on deploy
