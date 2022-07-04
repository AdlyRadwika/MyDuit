import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { 
    collection,
    getFirestore,
    setDoc,
    getDoc,
    doc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    startAfter,
    limit,
    where,
    updateDoc
} from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, browserSessionPersistence, setPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyATZkvNo0d64fJQnKhryVX9c0PKAwlrkjk",
    authDomain: "serplet-8aa23.firebaseapp.com",
    databaseURL: "https://serplet-8aa23-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "serplet-8aa23",
    storageBucket: "serplet-8aa23.appspot.com",
    messagingSenderId: "750990775732",
    appId: "1:750990775732:web:271ab20deb5b5000c54ee1",
    measurementId: "G-PRLDFRJSYL"
}

const app = initializeApp(firebaseConfig);
let auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const refreshAuth = function () {
    auth = getAuth(app);
}

export{
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, browserSessionPersistence, setPersistence, refreshAuth, onAuthStateChanged,
    //Firestore
    getFirestore, setDoc, doc, serverTimestamp, collection, getDoc,
    getDocs,
    query,
    orderBy,
    startAfter,
    limit,
    where,
    updateDoc
}