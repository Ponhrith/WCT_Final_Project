firebase.initializeApp({
  apiKey: "AIzaSyCrFB0ywO4Q4DhyCms4YGNCPc-bzPtXJHo",
  authDomain: "urms-project.firebaseapp.com",
  databaseURL: "https://urms-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "urms-project",
  storageBucket: "urms-project.appspot.com",
  messagingSenderId: "624650378050",
  appId: "1:624650378050:web:32c11dee451f9d4b9d06db"
});

// Reference to the Firebase database
const database = firebase.database();

const reportData = [];

const filterButton = document.getElementById('filterButton');
let ascendingOrder = true; // Variable to track sorting order
reportbutton = document.getElementById('reportButton');

firebase.auth().onAuthStateChanged(user => {
const iconElement = document.getElementById('myIcon');
const linkElement = document.getElementById('myLink');
if (user) {
  iconElement.className = 'bi bi-person-fill';
  linkElement.href = '/profile/profile.html';
} else {
    // Revert to the original icon and link for not logged-in users
  iconElement.className = 'fa-solid fa-right-to-bracket';
  linkElement.href = '/log&register/LogIn.html';
}
});

