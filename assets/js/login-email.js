import{
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword,
    //Firestore
    getFirestore, setDoc, doc
} from './firebase.js'

const loginForm = document.querySelector(".login")
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
    .then((cred) =>{
        console.log('user logged in: ', cred.user)
        location.href = "./test.html"
    })
    .catch((err) =>{
        console.log(err.message)
        alert(err.message)
    })
})