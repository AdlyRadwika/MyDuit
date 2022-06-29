import {
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider,
    //Firestore
    getFirestore, setDoc, doc, serverTimestamp, collection, getDoc, refreshAuth, onAuthStateChanged
} from './firebase.js'

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log("HOY");
      console.log(uid);
    } else if (user == null) {
      location.href = "./index.html"
    } else {
      console.log("error");
    }
  });


