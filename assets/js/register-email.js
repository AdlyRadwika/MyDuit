import{
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword,
    //Firestore
    getFirestore, setDoc, doc
} from './firebase.js'

const registerForm = document.querySelector(".register")
registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const name = registerForm.name.value
    const email = registerForm.email.value
    const password = registerForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
    // Created 
    const user = userCredential.user;
    console.log('new user: ', user);
    // Add to firestore
    await setDoc(doc(db, "users", user.uid), {
        name: name
    });
    // To alert and redirect to login
    alert("Akun dibuat!");
    location.href = "./index.html"
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    console.log(errorCode);
    alert(errorMessage)
    });
})