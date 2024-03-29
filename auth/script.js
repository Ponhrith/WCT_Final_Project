// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrFB0ywO4Q4DhyCms4YGNCPc-bzPtXJHo",
  authDomain: "urms-project.firebaseapp.com",
  databaseURL: "https://urms-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "urms-project",
  storageBucket: "urms-project.appspot.com",
  messagingSenderId: "624650378050",
  appId: "1:624650378050:web:32c11dee451f9d4b9d06db"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  //variable for change button
 


  // Set up our register function
  function register () {
    // Get all our input fields
    user_name = document.getElementById('user_name').value;
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    confirm_password = document.getElementById('con_password').value
    
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }


    if (password !== confirm_password) {
      alert("password not match!!")
      return
    } 
    
    
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        user_name : user_name,
        email : email,
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
  
      // DOne
      alert('User Created!!')
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  // Set login status to true
  localStorage.setItem('isLoggedIn', 'null');



   // Add a listener to detect authentication state changes
   firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is logged in
        console.log('User is logged in:', user.email);
        // Set login status to true
        localStorage.setItem('isLoggedIn', 'true');
    } else {
        // User is logged out
        console.log('User is logged out');
        // Set login status to false
        localStorage.setItem('isLoggedIn', 'false');
    }
});



  // Set up our login function
  function login() {
    // Get email and password from input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Validate input fields
    if (validate_email(email) === false || validate_password(password) === false) {
      alert('Email or Password is Outta Line!!');
      return;
    }
  
    auth.signInWithEmailAndPassword(email, password)
      .then(function () {
        // Declare user variable
        var user = auth.currentUser;
  
        // Add this user to Firebase Database
        var database_ref = database.ref();
  
        // Create User data
        var user_data = {
          last_login: Date.now(),
        };
  
        // Push to Firebase Database
        database_ref.child('users/' + user.uid).update(user_data);
  
        // Check if the email and password match the admin credentials
        if (email.toLowerCase() === 'adminrupp@gmail.com' && password === 'adminpass') {
          // Redirect to admin page
          window.location.href = "/WCT_Final_Project/Admin/admin.html";
        } else {
          // Redirect to profile page
          window.location.href = "/WCT_Final_Project/About/About.html";
        }
       

        // Call the function to update the login icon after a successful login for both admin and normal users
     

        alert(' Logged in success!!');
      })
      .catch(function (error) {
        // Firebase will use this to alert its errors
        var error_message = error.message;
        alert(error_message);
      });
  }
  
 

  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
 