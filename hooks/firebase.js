// hooks/firebase.js
import { useState, useEffect } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const useFirebase = () => {
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [firestore, setFirestore] = useState(null);

  useEffect(() => {
    // Check if Firebase app is already initialized
    const firebaseApps = getApps();
    if (firebaseApps.length === 0) {
      // Initialize Firebase app if not already initialized
      const firebaseConfig = {
        apiKey: "AIzaSyDI2fbHZxCjAMjdYfB_PCt8SxlKf61ODEY",
        authDomain: "nth-images.firebaseapp.com",
        projectId: "nth-images",
        storageBucket: "nth-images.appspot.com",
        messagingSenderId: "526158403770",
        appId: "1:526158403770:web:da08ee7ceb5b7900b34a83",
        measurementId: "G-XSWBLX1KZG",
      };
      const app = initializeApp(firebaseConfig);
      setFirebaseApp(app);
    } else {
      // Use existing Firebase app
      const app = firebaseApps[0];
      setFirebaseApp(app);
    }

    // Get Firestore instance
    const db = getFirestore();
    setFirestore(db);
  }, []);

  return { firebaseApp, firestore };
};

export default useFirebase;
