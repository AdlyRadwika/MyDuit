import{
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword,
    //Firestore
    getFirestore, setDoc, doc
} from './firebase.js'

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("ready!");
    
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

