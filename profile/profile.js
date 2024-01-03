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


  function logout() {
    firebase.auth().signOut()
    .then(() => {
        // Sign-out successful.
        console.log('User logged out successfully');
        window.location.href = "/Main/Main.html";
    })
    .catch((error) => {
        // An error happened.
        console.error('Error during logout:', error.message);
    });
  }

  //display user name 
  var usernameElement = document.getElementById("username");


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      // Assuming 'user_name' is stored in the user's data in the database
      const userRef = database.ref('users/' + user.uid); // Adjust the path to your data
      userRef.once('value')
        .then(snapshot => {
          const userData = snapshot.val();
          if (userData && userData.user_name) {
            usernameElement.innerHTML = "Welcome " + userData.user_name;
          } else {
            console.error('User data or user_name not found.');
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error.message);
        });
    }
  });


// Call the function to display user info after page load
  // Function to update the status in the reportData array
  function updateStatus(reportId, newStatus) {
    const report = reportData.find(report => report.id === reportId);
    if (report) {
      report.status = newStatus;
    }
  }


  // Function to populate the report list dynamically
function populateReportList() {
  const reportList = document.getElementById('report-list');

  firebase.auth().onAuthStateChanged(function (user) {
  
      const userEmail = user.email;
      database.ref('entries').once('value')
        .then(snapshot => {
          const data = snapshot.val();

          if (data) {
            reportList.innerHTML = ''; // Clear existing data
            Object.values(data).forEach(report => {
              if (report.email === userEmail) {

                const listItem = document.createElement('div');
                listItem.classList.add('report-item');

                // all the element below is added to this listItem
                const imageElement = document.createElement('img');
                imageElement.classList.add('report-image');
                imageElement.src = report.imageUrl;

                const contentElement = document.createElement('div');
                contentElement.classList.add('report-content');

                const statusElement = document.createElement('div');
                statusElement.classList.add('report-status');
                statusElement.textContent = `Status: ${report.status}`;

                const buildingElement = document.createElement('div');
                buildingElement.classList.add('report-building');
                buildingElement.textContent = `Building: ${report.building}`;

                const floorElement = document.createElement('div');
                floorElement.classList.add('report-floor');
                floorElement.textContent = `Floor: ${report.floor}`;

                const roomElement = document.createElement('div');
                roomElement.classList.add('report-room');
                roomElement.textContent = `Room: ${report.room}`;

                const detailElement = document.createElement('div');
                detailElement.classList.add('report-detail');
                detailElement.textContent = `Detail: ${report.detail}`;

                const dateElement = document.createElement('div');
                dateElement.classList.add('report-date');
                dateElement.textContent = `Date: ${report.date}`;

                const authorElement = document.createElement('div');
                authorElement.classList.add('report-author');

                const anonymousElement = document.createElement('div');
                anonymousElement.classList.add('report-anonymous');
                anonymousElement.textContent = 'Anonymous';

                contentElement.appendChild(statusElement);
                contentElement.appendChild(buildingElement);
                contentElement.appendChild(floorElement);
                contentElement.appendChild(roomElement);
                contentElement.appendChild(detailElement);

                if (report.author) {
                  authorElement.textContent = `Reported by: ${report.author}`;
                  contentElement.appendChild(authorElement);
                } else {
                  contentElement.appendChild(anonymousElement);
                }

                contentElement.appendChild(dateElement);
                listItem.appendChild(imageElement);
                listItem.appendChild(contentElement);

                reportList.appendChild(listItem);
              }
            });

            if (reportList.innerHTML === '') {
              reportList.innerHTML = '<p>No reports available for the current user.</p>';
            }
          } else {
            reportList.innerHTML = '<p>No data available.</p>';
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error.message);
          reportList.innerHTML = '<p>Error fetching data. Please try again.</p>';
        });
    
  });
}



populateReportList()
