import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyATZkvNo0d64fJQnKhryVX9c0PKAwlrkjk",
    authDomain: "serplet-8aa23.firebaseapp.com",
    databaseURL: "https://serplet-8aa23-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "serplet-8aa23",
    storageBucket: "serplet-8aa23.appspot.com",
    messagingSenderId: "750990775732",
    appId: "1:750990775732:web:271ab20deb5b5000c54ee1",
    measurementId: "G-PRLDFRJSYL"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore()

const registerForm = document.querySelector(".register")
registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const name = registerForm.name.value
    const email = registerForm.email.value
    const password = registerForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log('new user: ', user);
    alert("Akun dibuat!");
    registerForm.reset();
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    console.log(errorCode);
    alert(errorMessage)
    });
})


