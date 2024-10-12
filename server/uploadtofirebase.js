// Import the necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, setDoc, doc } from "firebase/firestore"; // Firestore for data upload
import fs from 'fs'; // To read the JSON file

// Your Firebase configuration, now using environment variables
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional, only if you need analytics
const db = getFirestore(app); // Initialize Firestore

// Read JSON file (adjust the path as necessary)
const esgData = JSON.parse(fs.readFileSync("../data.json", "utf-8"));

// Function to upload data to Firestore
async function uploadData() {
    for (const [company, data] of Object.entries(esgData)) {
        try {
            // Upload each company's data to the "companies" collection
            await setDoc(doc(db, "companies", company), data);
            console.log(`Uploaded data for ${company}`);
        } catch (error) {
            console.error(`Error uploading data for ${company}: `, error);
        }
    }
}

// Call the upload function
uploadData();
