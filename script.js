// Retrieve login status from localStorage
let isLoggedIn = false;

// Function to update the login icon based on the login status
function updateLoginIcon() {
  const iconElement = document.getElementById('myIcon');
  const linkElement = document.getElementById('myLink');

  if (isLoggedIn) {
    // Change the icon and link for logged-in users
    iconElement.className = 'bi bi-person-fill';
    linkElement.href = '/profile/profile.html';
  } else {
    // Revert to the original icon and link for not logged-in users
    iconElement.className = 'fa-solid fa-right-to-bracket';
    linkElement.href = '/log&register/LogIn.html';
  }
}

// Call the function to update the login icon on page load
updateLoginIcon();


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
    isLoggedIn = true;
  } else {
      // Revert to the original icon and link for not logged-in users
    iconElement.className = 'fa-solid fa-right-to-bracket';
    linkElement.href = '/log&register/LogIn.html';
  }
});

  function filterReports() {
    const filterSelect = document.getElementById('filterSelect');
    const selectedFilter = filterSelect.value;
  
    const currentDate = new Date();
  
    const filteredReports = reportData.filter(report => {
      const reportDate = new Date(report.date);
  
      switch (selectedFilter) {
        case 'year':
          return reportDate.getFullYear() === currentDate.getFullYear();
        case 'month':
          return (
            reportDate.getFullYear() === currentDate.getFullYear() &&
            reportDate.getMonth() === currentDate.getMonth()
          );
        case 'fixed':
          return report.status === 'Fixed';
        case 'fixing':
          return report.status === 'Fixing';
        default:
          return true; // 'all' filter or unknown filter value, show all reports
      }
    });
  
    // Repopulate the report list after sorting
    const reportList = document.getElementById('report-list');
    reportList.innerHTML = '';
  
    filteredReports.forEach(report => {
      const listItem = document.createElement('div');
      listItem.classList.add('report-item');
  
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
    });
  }


  function CanReport() {
    if (isLoggedIn) {
      window.location.href = '/Reporting/report.html';
    } else {
      alert("You have to login first !!!");
    }
  }
  
  reportButton.addEventListener('click', CanReport)
  // filterButton.addEventListener('click', sortReportsByDate);
  
  
  // Function to update the status in the reportData array
  function updateStatus(reportId, newStatus) {
    const report = reportData.find(report => report.id === reportId);
    if (report) {
      report.status = newStatus;
    }
  }
  
  // Function to update the displayed status element
  function updateStatusElement(statusElement, newStatus) {
    statusElement.textContent = `Status: ${newStatus}`;
  }
  
  // Function to populate the report list dynamically
  function populateReportList() {
    console.log('Populating report list:', reportData);
    const reportList = document.getElementById('report-list');
  
    while (reportList.firstChild) {
      reportList.removeChild(reportList.firstChild);
    }
  
    database.ref('entries').once('value')
      .then(snapshot => {
        const data = snapshot.val();
  
        if (data) {
          reportData.length = 0; // Clear existing data
          Object.values(data).forEach(report => {
            reportData.push(report);
          });
  
          filterReports(); // Filter reports after retrieving data
  
          console.log('Report list populated.');
        } else {
          reportList.innerHTML = '<p>No data available.</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
        reportList.innerHTML = '<p>Error fetching data. Please try again.</p>';
      });
  }
  
  populateReportList();
 
  
  function displayImage(input) {
    var file = input.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('profile-image').src = e.target.result;
  
        // Disable the upload button after an image has been selected and displayed
        document.getElementById('upload-button').disabled = true;
      };
      reader.readAsDataURL(file);
    }
  }


   // Attach the filterReports function to the onchange event of the filter dropdown
   document.getElementById('filterSelect').onchange = filterReports;
  
   // Initial population of the report list when the page loads
   populateReportList();
   