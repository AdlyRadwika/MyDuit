import{
    auth,
    //Firebase Auth
    signOut,
} from './firebase.js'

const logoutButton = document.querySelector('.btn-logout')
logoutButton.addEventListener('click', async () => {
    signOut(auth)
    .then(() => {
        console.log("the user signed out")
        location.href = "./index.html"
    })
    .catch((err) => {
        console.log(err.message)
    })
})