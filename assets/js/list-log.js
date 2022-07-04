import {
    auth,db,
    //Firebase Auth
    onAuthStateChanged, signOut,
    //Firestore
    addDoc,
    doc,
    serverTimestamp,
    collection,
    getDocs,
    query,
    orderBy,
    startAfter,
    limit,
    updateDoc,
    deleteDoc,
} from './firebase.js'

let listLog = [];
let lastVisible = null;
let userUuid = null;
let isCreate = true;
let editId = null;


window.onload = function () {
    console.log('window - onload');



    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            userUuid = uid;

            getLogList();
            
            const btnPaging = document.getElementById("btn-paging");
            btnPaging.addEventListener("click", (e) => {
                getLogList();
            });

            let btnCreate = document.getElementById("btn-create");
            btnCreate.addEventListener("click", (e) => {
                setToCreate();
            });

            let btnSubmit = document.getElementById("btn-submit-data");
            btnSubmit.addEventListener("click", (e)=>{
                if(isCreate == true){
                    insertData(userUuid);
                } else{
                    updateData();
                }
            });

            const logoutButton = document.querySelector('.btn-logout')
            logoutButton.addEventListener('click', async () => {
                signOut(auth)
                .then(() => {
                    alert("You will be redirected to sign in")
                })
                .catch((err) => {
                    console.log(err.message)
                })
            })
        } else {
            location.href = "./index.html"
        }
    });
};

function setToCreate() {
    let btnCreate = document.getElementById("btn-create");
    let infoEdit = document.getElementById("info-edit");

    btnCreate.classList.add("invisible");
    infoEdit.classList.add("invisible");
    editId = null;
    isCreate = true;

    let inputCat = document.getElementById("category");
    let inputDesc = document.getElementById("description");
    let inputDate = document.getElementById("date");
    let inputNominal = document.getElementById("nominal");

    inputCat.value = "";
    inputDesc.value = "";
    inputDate.value = "";
    inputNominal.value = "";
}

async function getLogList() {
    if (listLog.length == 0) {
        const first = query(collection(db, "expenses"), orderBy("timestamp"), limit(2));
        let documentSnapshots = null;
        await getDocs(first).then(result => {
            documentSnapshots = result;
        }).catch(e => {
            console.log(e);
            alert(e);
        });

        listLog = documentSnapshots.docs;

        lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        console.log(listLog[0].id);

    } else {
        const next = query(collection(db, "expenses"),
            orderBy("timestamp"),
            startAfter(lastVisible),
            limit(2));

        const documentSnapshots = await getDocs(next);

        if (documentSnapshots.docs.length > 0 && documentSnapshots.docs[documentSnapshots.docs.length - 1].id != lastVisible.id) {
            listLog.push(...documentSnapshots.docs);
            lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        }
    }
    let list = document.getElementById('list-log');
    list.innerHTML = "";
    listLog.forEach(data => {
        createListElement(data.id, data.data());
    });
}

async function updateData() {
    let docRef = doc(db, "expenses", editId);
    let inputCat = document.getElementById("category");
    let inputDesc = document.getElementById("description");
    let inputDate = document.getElementById("date");
    let inputNominal = document.getElementById("nominal");
    await updateDoc(docRef, {
        category: inputCat.value,
        description: inputDesc.value,
        date: inputDate.value,
        nominal: inputNominal.value,
        updated_at: serverTimestamp()
    });
    setToCreate();
    listLog = [];
    getLogList();
}

function setEdit(id, data) {
    isCreate = false;
    editId = id;
    let btnCreate = document.getElementById("btn-create");
    let infoEdit = document.getElementById("info-edit");
    btnCreate.classList.remove("invisible");
    infoEdit.classList.remove("invisible");

    let inputCat = document.getElementById("category");
    let inputDesc = document.getElementById("description");
    let inputDate = document.getElementById("date");
    let inputNominal = document.getElementById("nominal");

    inputCat.value = data.category;
    inputDesc.value = data.description;
    inputDate.valueAsDate = data.timestamp.toDate();
    inputNominal.value = data.nominal;
}

function createListElement(id, data) {
    let list = document.getElementById('list-log');
    list.innerHTML += `
    <div class="logs card mx-auto">               
        <div class="flex-container">
            <div class="flex-child magenta">
                <div class="id-log invisible">${id}</div>
                <h4 class="center">${data.category}</h4>
                <p class="center2 fs-6">${data.description}</p>
            </div>
            <div class="flex-child green">
                <div class="icon-row">
                    <p class="center">Rp.${data.nominal}</p>
                    <button class="edit-log btn"><i class="bi bi-pencil-fill"></i></button>
                </div>
                <div class="icon-row2">
                    <p class="center fs-6">${data.daily_date_code}</p>
                    <button class="delete-log btn"><i class="bi bi-trash-fill"></i></button>
                </div>
            </div>                            
        </div>              
    </div>
    `

    
    let listId = document.getElementsByClassName("id-log");
    let listButton = document.getElementsByClassName("edit-log btn");
    let deleteBtn = document.getElementsByClassName("delete-log btn");
    for (let i=0; i<listId.length; i++) {
        listButton[i].addEventListener("click", (e)=>{
            setEdit(listId[i].innerHTML, listLog[i].data());
        });
        deleteBtn[i].addEventListener('click', async (e) => {
            e.preventDefault();
            deleteData(listLog[i].id);
        })
    }

} 

async function insertData(id){
    const uid = id;
    let category = document.getElementById("category").value;
    let nominal = document.getElementById("nominal").value;
    let desc = document.getElementById("description").value;
    let date = document.getElementById("date").value;
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
            console.log(""+category+"|"+nominal+"|"+desc+"|"+date+"|"+dailyCode+"|"+monthCode+"|"+uid);
            alert("Berhasil tambah data");
            category = "";
            nominal = "";
            desc = "";
            date = "";
            listLog = [];
            getLogList();
        } catch (error) {
            console.log(error);
        };
    }
}

async function deleteData(id){
    await deleteDoc(doc(db, "expenses", id));
    listLog = [];
    getLogList();
}