import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

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