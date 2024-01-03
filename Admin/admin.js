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

  function deleteReport(reportId) {
    // Reference to the Firebase database
    const database = firebase.database();
  
    // Find the index of the report with the given id
    const index = reportData.findIndex(report => report.id === reportId);
  
    if (index !== -1) {
      // Remove the report from the array
      reportData.splice(index, 1);
  
      // Clear the existing report list
      const reportList = document.getElementById('report-list');
      reportList.innerHTML = '';
  
      // Repopulate the report list after deletion
      populateReportList();
  
      // Remove the report from the Firebase database
      database.ref('entries/' + reportId).remove()
        .then(() => {
          console.log('Report deleted successfully from the database.');
        })
        .catch(error => {
          console.error('Error deleting report from the database:', error.message);
        });
    }
  }  

  // Function to update the status in the reportData array
  function updateStatus(reportId, newStatus) {
    // Reference to the Firebase database
    const database = firebase.database();
  
    const reportRef = database.ref('entries/' + reportId);
  
    // Update the status in the Firebase database
    reportRef.update({
      status: newStatus
    })
    .then(() => {
      console.log(`Report ${reportId} status updated to '${newStatus}' in the database.`);
    })
    .catch(error => {
      console.error('Error updating report status in the database:', error.message);
    });
  }

  // Function to update the displayed status element
  function updateStatusElement(statusElement, newStatus) {
    statusElement.textContent = `Status: ${newStatus}`;
  }

  // Function to populate the report list dynamically
  function populateReportList() {
    const reportList = document.getElementById('report-list');

    database.ref('entries').once('value')
      .then(snapshot => {
        const data = snapshot.val();

        if (data) {
          reportData.length = 0; // Clear existing data
          Object.values(data).forEach(report => {
            reportData.push(report);
          });

          reportData.forEach(report => {
            const listItem = document.createElement('div');
            listItem.classList.add('report-item');

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
            // Attach an event listener to the delete button
            deleteButton.addEventListener('click', () => {
              deleteReport(report.id);
            });

            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');
            checkButton.innerHTML = '<i class="bi bi-eye-fill"></i>';
            // Attach an event listener to the check button
            checkButton.addEventListener('click', () => {
              // Handle check action here
              console.log(`Report ${report.id} checked`);
              updateStatus(report.id, 'Checking'); // Update status to 'Checking'
              updateStatusElement(statusElement, 'Checking'); // Update displayed status
            });

            const fixingButton = document.createElement('button');
            fixingButton.classList.add('fixing-button');
            fixingButton.innerHTML = '<i class="bi bi-wrench"></i>';
            // Attach an event listener to the fixing button
            fixingButton.addEventListener('click', () => {
              // Handle fixing action here
              console.log(`Report ${report.id} being fixed`);
              updateStatus(report.id, 'Fixing'); // Update status to 'Fixing'
              updateStatusElement(statusElement, 'Fixing'); // Update displayed status
            });

            const fixedButton = document.createElement('button');
            fixedButton.classList.add('fixed-button');
            fixedButton.innerHTML = '<i class="bi bi-check-circle"></i>';
            // Attach an event listener to the fixed button
            fixedButton.addEventListener('click', () => {
              // Handle fixed action here
              console.log(`Report ${report.id} fixed`);
              updateStatus(report.id, 'Fixed'); // Update status to 'Fixed'
              updateStatusElement(statusElement, 'Fixed'); // Update displayed status
            });

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

            contentElement.appendChild(statusElement); // Add status element
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
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(checkButton);
            buttonContainer.appendChild(fixingButton);
            buttonContainer.appendChild(fixedButton);
            listItem.appendChild(buttonContainer);
          });
        } else {
          reportList.innerHTML = '<p>No data available.</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
        reportList.innerHTML = '<p>Error fetching data. Please try again.</p>';
      });
  }

  
populateReportList()
  
  