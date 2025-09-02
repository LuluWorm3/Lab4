const form = document.getElementById("regForm");
const live = document.getElementById("live");
const searchInput = document.getElementById("search");
let profiles = []; // state array

// On load → restore from LocalStorage
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("profiles")) || [];
  profiles = saved;
  profiles.forEach(p => renderProfile(p));
});

// Form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    id: Date.now(), // unique id
    first: form.first.value.trim(),
    last: form.last.value.trim(),
    email: form.email.value.trim(),
    prog: form.prog.value.trim(),
    year: form.year.value,
    interests: form.interests.value.trim(),
    photo: form.photo.value.trim() || "https://placehold.co/128"
  };

  if (!validate(data)) {
    live.textContent = "Fix errors before submitting.";
    return;
  }
  live.textContent = "Student added successfully.";

  profiles.push(data);
  saveProfiles();
  renderProfile(data);
  form.reset();
});

// Validation helper
function validate(data) {
  let valid = true;
  if (!data.first) { showError("first", "First name required"); valid = false; }
  else showError("first", "");
  if (!data.last) { showError("last", "Last name required"); valid = false; }
  else showError("last", "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showError("email", "Enter valid email"); valid = false;
  } else showError("email", "");
  if (!data.prog) { showError("prog", "Programme required"); valid = false; }
  else showError("prog", "");
  if (!data.year) { showError("year", "Select year"); valid = false; }
  else showError("year", "");
  return valid;
}

function showError(field, msg) {
  document.getElementById(`err-${field}`).textContent = msg;
}

// Save to LocalStorage
function saveProfiles() {
  localStorage.setItem("profiles", JSON.stringify(profiles));
}

// Render profile (card + table row)
function renderProfile(data) {
  // --- Card
  const card = document.createElement("div");
  card.className = "card-person";
  card.dataset.id = data.id;
  card.innerHTML = `
    <img src="${data.photo}" alt="${data.first} ${data.last}">
    <h3>${data.first} ${data.last}</h3>
    <p><span class="badge">${data.prog}</span> <span class="badge">Year ${data.year}</span></p>
    <p>${data.interests}</p>
    <button class="edit-btn">Edit</button>
    <button class="remove-btn">Remove</button>
  `;
  document.getElementById("cards").prepend(card);

  // --- Table
  const tr = document.createElement("tr");
  tr.dataset.id = data.id;
  tr.innerHTML = `
    <td>${data.first} ${data.last}</td>
    <td>${data.prog}</td>
    <td>${data.year}</td>
    <td>
      <button class="edit-btn">Edit</button>
      <button class="remove-btn">Remove</button>
    </td>
  `;
  document.querySelector("#summary tbody").prepend(tr);

  // --- Actions
  const removeHandler = () => removeProfile(data.id);
  const editHandler = () => editProfile(data.id);

  card.querySelector(".remove-btn").addEventListener("click", removeHandler);
  tr.querySelector(".remove-btn").addEventListener("click", removeHandler);

  card.querySelector(".edit-btn").addEventListener("click", editHandler);
  tr.querySelector(".edit-btn").addEventListener("click", editHandler);
}

// Remove
function removeProfile(id) {
  profiles = profiles.filter(p => p.id !== id);
  saveProfiles();
  document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.remove());
}

// Edit
function editProfile(id) {
  const profile = profiles.find(p => p.id === id);
  if (!profile) return;

  // Fill form with existing data
  form.first.value = profile.first;
  form.last.value = profile.last;
  form.email.value = profile.email;
  form.prog.value = profile.prog;
  form.interests.value = profile.interests;
  form.photo.value = profile.photo;
  form.querySelector(`input[name="year"][value="${profile.year}"]`).checked = true;

  // Remove old entry before resubmission
  removeProfile(id);
}

// 🔎 Search / Filter
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  document.querySelectorAll("#cards .card-person").forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(q) ? "block" : "none";
  });
  document.querySelectorAll("#summary tbody tr").forEach(tr => {
    const text = tr.textContent.toLowerCase();
    tr.style.display = text.includes(q) ? "" : "none";
  });
});
