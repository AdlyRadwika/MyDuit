import {
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, setPersistence, browserSessionPersistence,
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
    } else {
      console.log("error");
    }
});

const createBtn = document.querySelector('.btn-create');
createBtn.addEventListener('click', (e) => {
  setPersistence(auth, browserSessionPersistence)
  .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return location.href = "./create-delete.html"
      // return signInWithEmailAndPassword(auth, email, password).then((cred) => {
      //     console.log('user logged in: ', cred.user)
      //     location.href = "./home.html";
      // })
      // .catch((err) => {
      //     console.log(err.message)
      //     alert(err.message)
      // });
  })
  .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
  });
})


