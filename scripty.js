
// Student Registration System - Lab 4
// My attempt at making a working form with validation

const form = document.getElementById("regForm");
const live = document.getElementById("live");
const searchInput = document.getElementById("search");
let profiles = []; // this will store all the student data

// Load saved data when page loads
window.addEventListener("DOMContentLoaded", function() {
  // try to get saved profiles from localStorage
  const savedData = localStorage.getItem("profiles");
  if (savedData) {
    profiles = JSON.parse(savedData);
    // show all the saved profiles
    for (let i = 0; i < profiles.length; i++) {
      renderProfile(profiles[i]);
    }
  }
});

// Handle form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // stop normal form submit
  
  // get all the form data
  const studentData = {
    id: Date.now(), // use timestamp as unique id
    first: form.first.value.trim(),
    last: form.last.value.trim(), 
    email: form.email.value.trim(),
    prog: form.prog.value.trim(),
    year: form.year.value,
    interests: form.interests.value.trim(),
    photo: form.photo.value.trim()
  };
  
  // if no photo provided, use a random placeholder
  if (!studentData.photo) {
    studentData.photo = `https://picsum.photos/128?t=${Date.now()}`;
  }



  // validate the data before adding
  if (validateStudentData(studentData)) {
    live.textContent = "Student added successfully!";
    
    profiles.push(studentData); // add to our array
    saveToLocalStorage(); // save everything
    renderProfile(studentData); // show the new profile
    form.reset(); // clear the form
  } else {
    live.textContent = "Please fix the errors before submitting.";
  }
});

/* Function to validate all the required fields
function validateStudentData(data) {
  let isValid = true;
  
  // check first name
  if (!data.first || data.first.length === 0) {
    showErrorMessage("first", "First name is required");
    isValid = false;
  } else {
    showErrorMessage("first", ""); // clear error
  }
  */
  // check last name  
  if (!data.last || data.last.length === 0) {
    showErrorMessage("last", "Last name is required");
    isValid = false;
  } else {
    showErrorMessage("last", "");
  }
  
  // validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    showErrorMessage("email", "Please enter a valid email address");
    isValid = false;
  } else {
    showErrorMessage("email", "");
  }
  
  // check programme
  if (!data.prog || data.prog.length === 0) {
    showErrorMessage("prog", "Programme is required");
    isValid = false;
  } else {
    showErrorMessage("prog", "");
  }
  
  // check if year is selected
  if (!data.year) {
    showErrorMessage("year", "Please select a year of study");
    isValid = false;
  } else {
    showErrorMessage("year", "");
  }
  
  return isValid;
}

// Helper function to show error messages
function showErrorMessage(fieldName, message) {
  const errorElement = document.getElementById(`err-${fieldName}`);
  errorElement.textContent = message;
}

// Save profiles to browser storage
function saveToLocalStorage() {
  const dataString = JSON.stringify(profiles);
  localStorage.setItem("profiles", dataString);
}

// Create and display profile card and table row
function renderProfile(studentData) {
  // Create the profile card
  const cardDiv = document.createElement("div");
  cardDiv.className = "card-person";
  cardDiv.dataset.id = studentData.id;
  
  // Build the card content
  const cardContent = `
    <img src="${studentData.photo}" alt="Photo of ${studentData.first} ${studentData.last}">
    <h3>${studentData.first} ${studentData.last}</h3>
    <p><span class="badge">${studentData.prog}</span> <span class="badge">Year ${studentData.year}</span></p>
    <p>${studentData.interests || 'No interests listed'}</p>
    <button class="edit-btn" onclick="editStudent(${studentData.id})">Edit</button>
    <button class="remove-btn" onclick="removeStudent(${studentData.id})">Remove</button>
  `;
  cardDiv.innerHTML = cardContent;
  
  // Add card to the page
  document.getElementById("cards").prepend(cardDiv);

  // Create table row
  const tableRow = document.createElement("tr");
  tableRow.dataset.id = studentData.id;
  tableRow.innerHTML = `
    <td>${studentData.first} ${studentData.last}</td>
    <td>${studentData.prog}</td>
    <td>${studentData.year}</td>
    <td>
      <button class="edit-btn" onclick="editStudent(${studentData.id})">Edit</button>
      <button class="remove-btn" onclick="removeStudent(${studentData.id})">Remove</button>
    </td>
  `;
  
  // Add row to table
  const tableBody = document.querySelector("#summary tbody");
  tableBody.prepend(tableRow);
}

// Remove a student profile
function removeStudent(studentId) {
  // confirm before deleting
  if (confirm("Are you sure you want to remove this student?")) {
    // remove from profiles array
    profiles = profiles.filter(function(student) {
      return student.id !== studentId;
    });
    
    // update localStorage
    saveToLocalStorage();
    
    // remove from DOM
    const elementsToRemove = document.querySelectorAll(`[data-id="${studentId}"]`);
    for (let i = 0; i < elementsToRemove.length; i++) {
      elementsToRemove[i].remove();
    }
  }
}

// Edit existing student profile
function editStudent(studentId) {
  // find the student in our array
  let studentToEdit = null;
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].id === studentId) {
      studentToEdit = profiles[i];
      break;
    }
  }
  
  if (!studentToEdit) {
    alert("Student not found!");
    return;
  }

  // populate the form with existing data
  form.first.value = studentToEdit.first;
  form.last.value = studentToEdit.last;
  form.email.value = studentToEdit.email;
  form.prog.value = studentToEdit.prog;
  form.interests.value = studentToEdit.interests;
  form.photo.value = studentToEdit.photo;
  
  // select the correct year radio button
  const yearRadios = form.querySelectorAll('input[name="year"]');
  for (let i = 0; i < yearRadios.length; i++) {
    if (yearRadios[i].value === studentToEdit.year) {
      yearRadios[i].checked = true;
      break;
    }
  }

  // remove the old profile directly (no confirmation needed for editing)
  removeStudentDirectly(studentId);
}

// Remove student without confirmation (for editing)
function removeStudentDirectly(studentId) {
  // remove from profiles array
  profiles = profiles.filter(function(student) {
    return student.id !== studentId;
  });
  
  // update localStorage
  saveToLocalStorage();
  
  // remove from DOM
  const elementsToRemove = document.querySelectorAll(`[data-id="${studentId}"]`);
  for (let i = 0; i < elementsToRemove.length; i++) {
    elementsToRemove[i].remove();
  }
}

// Search functionality
searchInput.addEventListener("input", function() {
  const searchTerm = searchInput.value.toLowerCase();
  
  // filter cards
  const allCards = document.querySelectorAll("#cards .card-person");
  for (let i = 0; i < allCards.length; i++) {
    const cardText = allCards[i].textContent.toLowerCase();
    if (cardText.includes(searchTerm)) {
      allCards[i].style.display = "block";
    } else {
      allCards[i].style.display = "none";
    }
  }
  
  // filter table rows
  const allRows = document.querySelectorAll("#summary tbody tr");
  for (let i = 0; i < allRows.length; i++) {
    const rowText = allRows[i].textContent.toLowerCase();
    if (rowText.includes(searchTerm)) {
      allRows[i].style.display = "";
    } else {
      allRows[i].style.display = "none";
    }
  }
});
/*
// Student Registration System - Lab 4
// My attempt at making a working form with validation

const form = document.getElementById("regForm");
const live = document.getElementById("live");
const searchInput = document.getElementById("search");
let profiles = []; // this will store all the student data

// Load saved data when page loads
window.addEventListener("DOMContentLoaded", function() {
  // try to get saved profiles from localStorage
  const savedData = localStorage.getItem("profiles");
  if (savedData) {
    profiles = JSON.parse(savedData);
    // show all the saved profiles
    for (let i = 0; i < profiles.length; i++) {
      renderProfile(profiles[i]);
    }
  }
});

// Handle form submission
form.addEventListener("submit", function(event) {
  event.preventDefault(); // stop normal form submit
  
  // get all the form data
  const studentData = {
    id: Date.now(), // use timestamp as unique id
    first: form.first.value.trim(),
    last: form.last.value.trim(), 
    email: form.email.value.trim(),
    prog: form.prog.value.trim(),
    year: form.year.value,
    interests: form.interests.value.trim(),
    photo: form.photo.value.trim()
  };
  
  // if no photo provided we can use a random placeholder
  if (!studentData.photo) {
    studentData.photo = `https://picsum.photos/128?t=${Date.now()}`;
  }

  // validate the data before adding
  if (validateStudentData(studentData)) {
    live.textContent = "Student added successfully!";
    
    profiles.push(studentData); // add to our array
    saveToLocalStorage(); // save everything
    renderProfile(studentData); // show the new profile
    form.reset(); // clear the form
  } else {
    live.textContent = "Please fix the errors before submitting.";
  }
});

// Function to validate all the required fields
function validateStudentData(data) {
  let isValid = true;
  
  // check first name
  if (!data.first || data.first.length === 0) {
    showErrorMessage("first", "First name is required");
    isValid = false;
  } else {
    showErrorMessage("first", ""); // clear error
  }
  
  // check last name  
  if (!data.last || data.last.length === 0) {
    showErrorMessage("last", "Last name is required");
    isValid = false;
  } else {
    showErrorMessage("last", "");
  }
  
  // validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    showErrorMessage("email", "Please enter a valid email address");
    isValid = false;
  } else {
    showErrorMessage("email", "");
  }
  
  // check programme
  if (!data.prog || data.prog.length === 0) {
    showErrorMessage("prog", "Programme is required");
    isValid = false;
  } else {
    showErrorMessage("prog", "");
  }
  
  // check if year is selected
  if (!data.year) {
    showErrorMessage("year", "Please select a year of study");
    isValid = false;
  } else {
    showErrorMessage("year", "");
  }
  
  return isValid;
}

// Helper function to show error messages
function showErrorMessage(fieldName, message) {
  const errorElement = document.getElementById(`err-${fieldName}`);
  errorElement.textContent = message;
}

// Save profiles to browser storage
function saveToLocalStorage() {
  const dataString = JSON.stringify(profiles);
  localStorage.setItem("profiles", dataString);
}

// Create and display profile card and table row
function renderProfile(studentData) {
  // Create the profile card
  const cardDiv = document.createElement("div");
  cardDiv.className = "card-person";
  cardDiv.dataset.id = studentData.id;
  
  // Build the card content
  const cardContent = `
    <img src="${studentData.photo}" alt="Photo of ${studentData.first} ${studentData.last}">
    <h3>${studentData.first} ${studentData.last}</h3>
    <p><span class="badge">${studentData.prog}</span> <span class="badge">Year ${studentData.year}</span></p>
    <p>${studentData.interests || 'No interests listed'}</p>
    <button class="edit-btn" onclick="editStudent(${studentData.id})">Edit</button>
    <button class="remove-btn" onclick="removeStudent(${studentData.id})">Remove</button>
  `;
  cardDiv.innerHTML = cardContent;
  
  // Add card to the page
  document.getElementById("cards").prepend(cardDiv);

  // Create table row
  const tableRow = document.createElement("tr");
  tableRow.dataset.id = studentData.id;
  tableRow.innerHTML = `
    <td>${studentData.first} ${studentData.last}</td>
    <td>${studentData.prog}</td>
    <td>${studentData.year}</td>
    <td>
      <button class="edit-btn" onclick="editStudent(${studentData.id})">Edit</button>
      <button class="remove-btn" onclick="removeStudent(${studentData.id})">Remove</button>
    </td>
  `;
  
  // Add row to table
  const tableBody = document.querySelector("#summary tbody");
  tableBody.prepend(tableRow);
}

// Remove a student profile
function removeStudent(studentId) {
  // confirm before deleting
  if (confirm("Are you sure you want to remove this student?")) {
    // remove from profiles array
    profiles = profiles.filter(function(student) {
      return student.id !== studentId;
    });
    
    // update localStorage
    saveToLocalStorage();
    
    // remove from DOM
    const elementsToRemove = document.querySelectorAll(`[data-id="${studentId}"]`);
    for (let i = 0; i < elementsToRemove.length; i++) {
      elementsToRemove[i].remove();
    }
  }
}

// Edit existing student profile
function editStudent(studentId) {
  // find the student in our array
  let studentToEdit = null;
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].id === studentId) {
      studentToEdit = profiles[i];
      break;
    }
  }
  
  if (!studentToEdit) {
    alert("Student not found!");
    return;
  }

  // populate the form with existing data
  form.first.value = studentToEdit.first;
  form.last.value = studentToEdit.last;
  form.email.value = studentToEdit.email;
  form.prog.value = studentToEdit.prog;
  form.interests.value = studentToEdit.interests;
  form.photo.value = studentToEdit.photo;
  
  // select the correct year radio button
  const yearRadios = form.querySelectorAll('input[name="year"]');
  for (let i = 0; i < yearRadios.length; i++) {
    if (yearRadios[i].value === studentToEdit.year) {
      yearRadios[i].checked = true;
      break;
    }
  }

  // remove the old profile so user can resubmit
  removeStudent(studentId);
}

// Search functionality
searchInput.addEventListener("input", function() {
  const searchTerm = searchInput.value.toLowerCase();
  
  // filter cards
  const allCards = document.querySelectorAll("#cards .card-person");
  for (let i = 0; i < allCards.length; i++) {
    const cardText = allCards[i].textContent.toLowerCase();
    if (cardText.includes(searchTerm)) {
      allCards[i].style.display = "block";
    } else {
      allCards[i].style.display = "none";
    }
  }
  
  // filter table rows
  const allRows = document.querySelectorAll("#summary tbody tr");
  for (let i = 0; i < allRows.length; i++) {
    const rowText = allRows[i].textContent.toLowerCase();
    if (rowText.includes(searchTerm)) {
      allRows[i].style.display = "";
    } else {
      allRows[i].style.display = "none";
    }
  }
});