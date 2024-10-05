import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getDatabase, Database } from "firebase/database";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";

let app: FirebaseApp;
let analytics: Analytics | null = null;
let database: Database | null = null;
let auth: Auth | null = null;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);

  analytics = getAnalytics(app);
  database = getDatabase(app);
  auth = getAuth(app);
}

export { app, analytics, database, auth };
