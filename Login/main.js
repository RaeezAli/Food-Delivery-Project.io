import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
  const auth = getAuth(app);
  const db = getFirestore(app);

auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    const userData = {
      email: user.email,
      uid: user.uid,
      displayName: user.displayName || '',
      photoURL: user.photoURL || ''
    };

    // Store user data in Firestore
    db.collection('users').doc(user.uid).set(userData)
      .then(() => {
        console.log('User data stored in Firestore');
      })
      .catch((error) => {
        console.error('Error storing user data:', error);
      });
  } else {
    // User is signed out
    console.log('No user signed in');
  }
});

const loginForm = document.querySelector('#loginForm'); // Use ID selector
const googleLoginBtn = document.querySelector('.login-google-button');

googleLoginBtn.addEventListener('click', () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {

      const user = result.user;
      console.log("User signed in with Google:", user.displayName);

      const photoURL = user.photoURL;

      localStorage.setItem('userPhotoURL', photoURL);
      window.location.href = 'index.html'; // Redirect to index.html after login
    })
    .catch((error) => {
      console.error("Google login error:", error.message);
      // Handle login error (display error message to user, etc.)
    });
});
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.querySelector('.email-input').value;
    const password = document.querySelector('.password-input').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User logged in successfully
        console.log("User logged in:", userCredential.user.email);
        window.location.href = 'index.html'; // Redirect to index.html after login
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        // Handle login error (display error message to user, etc.)
      });
  });