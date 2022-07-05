import {
    auth,db,
    //Firebase Auth
    onAuthStateChanged, signOut,
    //Firestore
    addDoc,
    doc,
    serverTimestamp,
    collection,
    getDoc,
    getDocs,
    query,
    orderBy,
    startAfter,
    limit,
    updateDoc,
    deleteDoc,
    where,
    increment,
    setDoc,
    runTransaction
} from './firebase.js'

let listLog = [];
let lastVisible = null;
let userUuid = null;
let isCreate = true;
let editId = null;
let editPreviousData = null;


window.onload = function () {
    console.log('window - onload');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            userUuid = uid;

            getLogList();
            getTodayExpense();
            getMonthlyExpense();
            
            
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
                if(isCreate === true){
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
    editPreviousData = null;
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
        const first = query(collection(db, "expenses"), orderBy("timestamp", "desc"), where("user_id", "==", userUuid), limit(5));
        let documentSnapshots = null;
        await getDocs(first).then(result => {
            documentSnapshots = result;
        }).catch(e => {
            console.log(e);
            alert(e);
        });

        listLog = documentSnapshots.docs;

        lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        

    } else {
        const next = query(collection(db, "expenses"),
            orderBy("timestamp", "desc"),
            where("user_id", "==", userUuid), 
            startAfter(lastVisible),
            limit(5));

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
    const dateVal = inputDate.value;
    const d = new Date(dateVal);
    const dailyCode = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
    const monthCode = (d.getMonth()+1) + "-" + d.getFullYear();
    await updateDoc(docRef, {
        category: inputCat.value,
        description: inputDesc.value,
        daily_date_code: dailyCode,
        monthly_date_code: monthCode,
        date: serverTimestamp(new Date(dailyCode)),
        nominal: parseInt(inputNominal.value),
        updated_at: serverTimestamp()
    });

    await updateDailyAndMonthly({
        daily_date_code: dailyCode,
        monthly_date_code: monthCode,
        nominal: parseInt(inputNominal.value),
    });

    console.log("who first");
    setToCreate();
    listLog = [];
    getLogList();
    getTodayExpense();
    getMonthlyExpense();
}

function setEdit(id, data) {
    isCreate = false;
    editId = id;
    editPreviousData = data;
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
    console.log(data.daily_date_code)
    let strDate = data.daily_date_code.split("-");
    let d = new Date(parseInt(strDate[2]), parseInt(strDate[0])-1, parseInt(strDate[1])+1);
    console.log(d);
    inputDate.valueAsDate = d;
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

async function getMonthlyExpense() {
    const d = new Date();
    const dailyCode = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
    const monthCode = (d.getMonth()+1) + "-" + d.getFullYear();

    let monthlyRef = doc(db, "monthly_expenses", monthCode+"_"+userUuid);
    const monthlySnap = await getDoc(monthlyRef);
    

    if (monthlySnap.exists()) {
        console.log("exist");
        let tvmonthly = document.getElementById("tv-monthly-expense");
        tvmonthly.innerHTML = "Rp." + monthlySnap.data().nominal;
    }
}

async function getTodayExpense() {
    const d = new Date();
    const dailyCode = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
    const monthCode = (d.getMonth()+1) + "-" + d.getFullYear();

    console.log("daily load");
    let todayRef = doc(db, "daily_expenses", dailyCode+"_"+userUuid);
    const todaySnap = await getDoc(todayRef);
    console.log("daily loaded");
    console.log(todaySnap);

    if (todaySnap.exists()) {
        console.log("exist daily");
        console.log("exist daily");
        let tvToday = document.getElementById("tv-today-expense");
        tvToday.innerHTML = "Rp." + todaySnap.data().nominal;
    }
}

async function insertData(id){
    const uid = id;
    let categoryData = document.getElementById("category").value;
    let nominal = document.getElementById("nominal").value;
    let desc = document.getElementById("description").value;
    let date = document.getElementById("date").value;
    const d = new Date(date);
    const dailyCode = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
    const monthCode = (d.getMonth()+1) + "-" + d.getFullYear();
    if(categoryData == "" || nominal == "" || desc == "" || date == ""){
        alert("Fill the empty input");
        return false;
    }else{
        try {
            await addDoc(collection(db, "expenses"), {
                category: categoryData,
                nominal: parseInt(nominal),
                description: desc,
                monthly_date_code: monthCode,
                daily_date_code: dailyCode,
                date: date,
                user_id: uid,
                timestamp: serverTimestamp(new Date(date.value)),
                updated_at: serverTimestamp()
            });

            let monthlyRef = doc(db, "monthly_expenses", monthCode+"_"+userUuid);
            const monthlySnap = await getDoc(monthlyRef);
            
            let categoryMap = {};
            let categoryMapAdd = {};
            categoryMap[categoryData] = increment(1);
            categoryMapAdd[categoryData] = 1;
            if (monthlySnap.exists()) {
                let valueUpdate = {
                    categories: categoryMap,
                    nominal: increment(parseInt(nominal)),
                    updated_at: serverTimestamp()
                };
                valueUpdate["categories"] = categoryMap;
                await updateDoc(monthlyRef, valueUpdate);
            } else {
                let valueAdd = {
                    categories: categoryMapAdd,
                    nominal: parseInt(nominal),
                    user_id: userUuid,
                    timestamp: serverTimestamp(new Date()),
                    updated_at: serverTimestamp()
                };
                valueAdd["categories"] = categoryMapAdd;
                await setDoc(doc(db, "monthly_expenses", monthCode+"_"+userUuid), valueAdd);
            }

            let dailyRef = doc(db, "daily_expenses", dailyCode+"_"+userUuid);
            const dailySnap = await getDoc(dailyRef);
            
            if (dailySnap.exists()) {
                let valueUpdate = {
                    categories: categoryMap,
                    nominal: increment(parseInt(nominal)),
                    updated_at: serverTimestamp()
                };
                valueUpdate["categories"] = categoryMap;
                await updateDoc(dailyRef, valueUpdate);
            } else {
                let valueAdd = {
                    categories: categoryMapAdd,
                    nominal: parseInt(nominal),
                    user_id: uid,
                    timestamp: serverTimestamp(new Date(date.value)),
                    updated_at: serverTimestamp()
                };
                valueAdd["categories"] = categoryMapAdd;
                await setDoc(doc(db, "daily_expenses", dailyCode+"_"+userUuid), valueAdd);
            }

            console.log(""+categoryData+"|"+nominal+"|"+desc+"|"+date+"|"+dailyCode+"|"+monthCode+"|"+uid);
            alert("Berhasil tambah data");
            categoryData = "";
            nominal = "";
            desc = "";
            date = "";
            setToCreate();
            listLog = [];
            getLogList();
            getTodayExpense();
            getMonthlyExpense();
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

async function decreaseDailyAndMonthlyBeforeUpdate(data) {
    const d = data.daily_date_code.split("-");
    const dailyCode = `${parseInt(d[0])}-${parseInt(d[1])}-${parseInt(d[2])}`;
    const monthCode = `${parseInt(d[1])}-${parseInt(d[2])}`;
    console.log(" DEC => " + data.nominal);

    let monthlyRef = doc(db, "monthly_expenses", monthCode+"_"+userUuid);
    const monthlySnap = await getDoc(monthlyRef);
    console.log( monthlySnap);
    if (monthlySnap.exists()) {
        console.log("Monthly Exist => " + monthlySnap.exists());
        let valueUpdate = {
            nominal: increment(parseInt(-data.nominal)),
            updated_at: serverTimestamp()
        };
        await updateDoc(monthlyRef, valueUpdate);
    } 

    let dailyRef = doc(db, "daily_expenses", dailyCode+"_"+userUuid);
    const dailySnap = await getDoc(dailyRef);
    console.log(dailySnap);
    
    if (dailySnap.exists()) {
        console.log("Daily Exist => " + monthlySnap.exists());
        let valueUpdate = {
            nominal: increment(parseInt(-data.nominal)),
            updated_at: serverTimestamp()
        };
        await updateDoc(dailyRef, valueUpdate);
    }
}

async function updateDailyAndMonthly(data) {
    try {
        await runTransaction(db, async (transaction) => {
            const d = data.daily_date_code.split("-");
            const dailyCode = `${parseInt(d[0])}-${parseInt(d[1])}-${parseInt(d[2])}`;
            const monthCode = `${parseInt(d[1])}-${parseInt(d[2])}`;
            let monthlyRef = doc(db, "monthly_expenses", monthCode+"_"+userUuid);
            const monthlySnap = await transaction.get(monthlyRef);

            let dailyRef = doc(db, "daily_expenses", dailyCode+"_"+userUuid);
            const dailySnap = await transaction.get(dailyRef);
            console.log("SELISIH => " + (data.nominal - editPreviousData.nominal));
            if (monthlySnap.exists()) {
                let valueUpdate = {
                    nominal: increment(data.nominal - editPreviousData.nominal),
                    updated_at: serverTimestamp()
                };
                transaction.update(monthlyRef, valueUpdate);
                
            } 
            
            if (dailySnap.exists()) {
                let valueUpdate = {
                    nominal: increment(data.nominal - editPreviousData.nominal),
                    updated_at: serverTimestamp()
                };
                await transaction.update(dailyRef, valueUpdate);
            }
            
        });
        console.log("Transaction successfully committed!");
    } catch (e) {
        console.log("Transaction failed: ", e);
    }
    
}