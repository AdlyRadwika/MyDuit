import{
    app, auth, provider, db,
    //Firebase Auth
    signInWithPopup, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, GoogleAuthProvider, browserSessionPersistence, setPersistence, refreshAuth, onAuthStateChanged,
    //Firestore
    getFirestore, setDoc, doc, serverTimestamp, collection, getDoc, addDoc, deleteDoc, getDocs, query, where,
} from './firebase.js'

const categoryForm = document.querySelector(".category");
const table = document.querySelector('.tbody');

window.onload = function () {
  console.log('window - onload');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      document.querySelector("#btn-create").addEventListener('click', (e) => {
          e.preventDefault();
          insertData(user);
      });

      document.querySelector("#btn-read").addEventListener('click', (e) =>{
        e.preventDefault();
        table.innerHTML = ``;
        data(user);
      })

    } else {
      alert("You do not have access, please sign in first.");
      location.replace("index.html");
    }
  });
};

async function insertData(user){
  const uid = user.uid;
  const category = categoryForm.pick.value
  const nominal = categoryForm.nominal.value
  const desc = categoryForm.description.value
  const date = categoryForm.date.value
  const dateConv = new Date(date);
  const dailyCode = dateConv.toLocaleString('default', { day:'2-digit', month:'2-digit', year:'numeric' });
  const monthCode = dateConv.toLocaleString('default', { month:'2-digit', year:'numeric' });
  if(category == "" || nominal == "" || desc == "" || date == ""){
    alert("Fill the empty input");
    return false;
  }else{
    try {
      await addDoc(collection(db, "expenses"), {
          category: category,
          nominal: nominal,
          description: desc,
          monthly_date_code: monthCode,
          daily_date_code: dailyCode,
          date: date,
          user_id: uid,
          timestamp: serverTimestamp(),
          updated_at: serverTimestamp()
      });
      console.log(""+category+"|"+nominal+"|"+desc+"|"+date+"|"+dailyCode+"|"+monthCode+"|"+user.uid);
      alert("Berhasil tambah data");
      categoryForm.reset();
    } catch (error) {
      console.log(error);
    };
  }
}

async function deleteData(id){
  await deleteDoc(doc(db, "expenses", id));
}

async function data(user){
  const q = query(collection(db, "expenses"), where("user_id","==", user.uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    readData(doc);
  });
}

async function readData(docs){
  let td = document.createElement('tr');
  let postID = document.createElement('td');
  let category = document.createElement('td');
  let nominal = document.createElement('td');
  let description = document.createElement('td');
  let monthly = document.createElement('td');
  let daily = document.createElement('td');
  let user_id = document.createElement('td');
  let delBtn = document.createElement('button');
  delBtn.classList.add("delete", "btn");
  delBtn.innerHTML=`<i class="bi bi-trash-fill"></i>`;

  td.setAttribute('data-id', docs.id);
  postID.textContent = docs.id;
  category.textContent = docs.data().category;
  nominal.textContent = docs.data().nominal;
  description.textContent = docs.data().description;
  monthly.textContent = docs.data().monthly_date_code;
  daily.textContent = docs.data().daily_date_code;
  user_id.textContent = docs.data().user_id;

  td.appendChild(postID);
  td.appendChild(category);
  td.appendChild(nominal);
  td.appendChild(description);
  td.appendChild(monthly);
  td.appendChild(daily);
  td.appendChild(user_id);
  td.appendChild(delBtn);

  table.appendChild(td);

  delBtn.addEventListener('click', async (e) => {

      e.preventDefault();
      let id = docs.id;
      deleteData(id);
      table.innerHTML=``;
  })
}