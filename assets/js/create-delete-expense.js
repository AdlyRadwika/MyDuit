import{
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, browserSessionPersistence, setPersistence, refreshAuth, onAuthStateChanged,
    //Firestore
    getFirestore, setDoc, doc, serverTimestamp, collection, getDoc, addDoc
} from './firebase.js'

const categoryForm = document.querySelector(".category");

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      categoryForm.addEventListener('submit', (e) => {
          e.preventDefault();
          insertData(user);
      });

    } else {
      console.log("error");
    }
});

async function insertData(user){
  const category = categoryForm.pick.value
  const nominal = categoryForm.nominal.value
  const desc = categoryForm.description.value
  const date = new Date();
  const dailyCode = date.toLocaleString('default', { day:'2-digit', month:'2-digit', year:'numeric' });
  const monthCode = date.toLocaleString('default', { month:'2-digit', year:'numeric' });
  const uid = user.uid;

  const docRef = await addDoc(collection(db, "expenses"), {
      category: category,
      nominal: nominal,
      description: desc,
      monthly_date_code: monthCode,
      daily_date_code: dailyCode,
      user_id: uid,
      timestamp: serverTimestamp()
  });

  console.log(docRef);
  alert("Berhasil tambah data");
}