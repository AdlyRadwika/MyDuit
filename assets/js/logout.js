import{
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword,
    //Firestore
    getFirestore, setDoc, doc
} from './firebase.js'

const logoutButton = document.querySelector('.btn-logout')
logoutButton.addEventListener('click', async () => {
    signOut(auth)
    .then(() => {
        console.log("the user signed out")
        location.href = "./index.html"
    })
    .catch((err) => {
        console.log(err.message)
    })
})