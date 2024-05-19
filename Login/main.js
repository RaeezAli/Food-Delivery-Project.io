import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCq1M-4yxROOTDkMdg-NpmX5QuNlbz4HMc",
    authDomain: "se-food-delivery-project.firebaseapp.com",
    projectId: "se-food-delivery-project",
    storageBucket: "se-food-delivery-project.appspot.com",
    messagingSenderId: "1097206790674",
    appId: "1:1097206790674:web:24fe27183f24a9fc8176cb",
    measurementId: "G-XXBW3DJQ5T"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();


const submit = document.querySelector('.login-Btn');
const loginWithGoogle = document.querySelector(".login-google-button");





submit.addEventListener('click', () => {

    let email = document.querySelector('.email-input');
    let password = document.querySelector('.password-input');

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const q = query(collection(fdb, "users"), where("Uid", "==",result.user.uid));

    const querySnapshot = getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        addItemToLocalStorage(doc.data())
    });
    // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });


    window.location.href = 'index.html';


});

const loginWithGoogleFunction = () => {

    console.log('Login with Google');
    signInWithPopup(auth, provider)
        .then(async (result) => {


            const q = query(collection(fdb, "users"), where("Uid", "==",result.user.uid));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());

                addItemToLocalStorage(doc.data())
            });



            window.location.href("index.html");

        }).catch((error) => {

            console.log(error);
        });
}

loginWithGoogle.addEventListener('click', loginWithGoogleFunction);
