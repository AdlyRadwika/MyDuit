import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("ready!");

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

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    
    document.getElementById('btn-google').addEventListener('click', (e)=>{
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("SUCCESS");
            // ...
        }).catch((error) => {
            console.log("ERR " + error);
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    });

});

