import {
    auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, setPersistence, browserSessionPersistence,
    //Firestore
    setDoc, doc, getDoc
} from './firebase.js'

const loginForm = document.querySelector(".login");
const googleBtn = document.getElementById("btn-google");
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    setPersistence(auth, browserSessionPersistence)
        .then(() => {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            return signInWithEmailAndPassword(auth, email, password).then((cred) => {
                console.log('user logged in: ', cred.user)
                location.href = "./home-dev.html";
            })
            .catch((err) => {
                console.log(err.message)
                alert(err.message)
            });
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
        });
})

googleBtn.addEventListener("click", (e) => {
    setPersistence(auth, browserSessionPersistence)
        .then(() => {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            return signInWithPopup(auth, provider)
            .then( async (result) => {
                
                let userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists()) {
                    location.href = "./home-dev.html";
                    console.log("SUCCESS LOGIN");
                } else {
                    await setDoc(doc(db, "users", auth.currentUser.uid), {
                        name: auth.currentUser.displayName,
                        email: auth.currentUser.email,
                        daily_expense: 0,
                        timestamp: serverTimestamp()
                    });
                    alert("Akun dibuat!");
                    location.href = "./home-dev.html";
                    console.log("SUCCESS REGISTER");
                }
                
            }).catch((error) => {
                console.log("ERR " + error);
               
                
            });
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});

