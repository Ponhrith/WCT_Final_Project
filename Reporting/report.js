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


const author = authorState;
// Reference to the Firebase storage
const storage = firebase.storage().ref(); 
const reportbutton = document.getElementById('reportButton');

// Function to update the login icon based on the login status
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';



//update room
function updateRoom() {
// Get the floor and room elements
var floor = document.getElementById("floor");
var room = document.getElementById("room");
// Clear the room options
room.innerHTML = "";
// Create a default option
var defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.innerHTML = "Please select a room";
// Append the default option to the room menu
room.appendChild(defaultOption);
// Check if the floor value is not empty
if (floor.value != "") {
  // Loop from 0 to 1
  for (var i = 0; i < 10; i++) {
    // Create a new option
    var option = document.createElement("option");
    option.value = floor.value + 0 + i;
    option.innerHTML = "Room " + floor.value + 0 + i;
    // Append the option to the room menu
    room.appendChild(option);
  }
}
}
var userEmail = null;
var username = null;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    const userRef = database.ref('users/' + user.uid); // Adjust the path to your data
    userRef.once('value')
      .then(snapshot => {
        const userData = snapshot.val();
        if (userData && userData.user_name) {
          username = userData.user_name;
          userEmail = userData.email;
          updateSlider();
        } else {
          console.error('User data or user_name not found.');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error.message);
      });
  } else {
    // User is signed out
    username = null;
  }
});

var authorState = "author"; // Initial author state
function toggleSlider() {
  
  var checkbox = document.querySelector('.toggle-btn input');
    // Toggle between "author" and "anonymous"
    authorState = (authorState === username) ? "anonymous" : username;

    updateSlider();
}

function updateSlider() {
    var checkbox = document.querySelector('.toggle-btn input');
    var slider = document.querySelector('.toggle-btn .toggle-slider');

    if (checkbox.checked) {
        slider.style.transform = 'translateX(30px)';
        slider.style.backgroundColor = '#ffff00';
    } else {
        slider.style.transform = 'translateX(0)';
        slider.style.backgroundColor = '#fff';
    }

}


// Initialize Firebase with your configuration

// const auth = firebase.auth();
function storeData() {
  // Get values from the form
  const building = document.getElementById('building').value;
  // const status = document.getElementById('status').value;
  const status = "Unchecked";
  const floor = document.getElementById('floor').value;
  const room = document.getElementById('room').value;
  const detail = document.getElementById('detail').value;
  const date = document.getElementById('date').value;
  const imageInput = document.getElementById('image');
  
 
  // Ensure an image is selected
  if (!imageInput.files[0]) {
    alert('Please select an image.');
    return;
  }

  // Generate a unique ID for each entry
  const id = database.ref().push().key;

  // Upload the image to Firebase Storage
  const imageFile = imageInput.files[0];
  const imageRef = storage.child(`images/${id}/${imageFile.name}`);
  imageRef.put(imageFile)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(imageUrl => {
      // Create an object with the data and image URL
      const data = {
        id,
        email: userEmail,
        building,
        status,
        floor,
        room,
        detail,
        date,
        author: authorState, // Make sure to use the correct variable
        imageUrl
      };

      // Store the data in Firebase under the "entries" node with the unique ID
      database.ref('entries/' + id).set(data);

      // Clear the form after storing data
      document.getElementById('dataForm').reset();

      alert('Data stored successfully!');
    })
    .catch(error => {
      console.error('Error uploading image:', error.message);
      alert('Error uploading image. Please try again.');
    });
}



const textarea = document.querySelector('textarea');

textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

