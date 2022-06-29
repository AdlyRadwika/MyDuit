import {
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged,
    //Firestore
    getFirestore, setDoc, doc, serverTimestamp, collection, getDoc
} from './firebase.js'

//To control session
onAuthStateChanged(auth, (user) => {
    if (user != null) {
      location.href = "./home.html"
    }
});

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
                name: name,
                email: email,
                daily_expense: 0,
                timestamp: serverTimestamp()
            });
            // To alert and redirect to login
            alert("Akun dibuat!");
            location.href = "./home.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            console.log(errorCode);
            alert(errorMessage)
        });
});

document.getElementById('btn-google').addEventListener('click', (e)=>{
    signInWithPopup(auth, provider)
    .then( async (result) => {
        
        let userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            location.href = "./home.html";
            console.log("SUCCESS LOGIN");
        } else {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                name: auth.currentUser.displayName,
                email: auth.currentUser.email,
                daily_expense: 0,
                timestamp: serverTimestamp()
            });
            alert("Akun dibuat!");
            location.href = "./home.html";
            console.log("SUCCESS REGISTER");
        }
        
    }).catch((error) => {
        console.log("ERR " + error);
       
        
    });
});