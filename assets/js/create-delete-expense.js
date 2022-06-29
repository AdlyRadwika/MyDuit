import{
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, browserSessionPersistence, setPersistence, refreshAuth, onAuthStateChanged,
    //Firestore
    getFirestore, setDoc, doc, serverTimestamp, collection, getDoc, addDoc
} from './firebase.js'

const categoryForm = document.querySelector(".category")
categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = categoryForm.pick.value
    const nominal = categoryForm.nominal.value
    const desc = categoryForm.description.value

    console.log("|"+category+"|"+nominal+"|"+desc)

    const docRef = await addDoc(collection(db, "expenses"), {
        category: category,
        nominal: nominal,
        description: desc,
        monthly_date_code: "a",
        daily_date_code: "a",
        user_id: "aa",
        timestamp: serverTimestamp()
    });

    console.log("Berhasil tambah data")
});
