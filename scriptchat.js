
// Student Registration System - Lab 4
// Friendly & Student-like Version

const form = document.getElementById("regForm");
const live = document.getElementById("live");
const searchInput = document.getElementById("search");
let profiles = []; // store student data

// Load saved data when page loads
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("profiles")) || [];
  profiles = saved;
  profiles.forEach(p => renderProfile(p));
});

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const student = {
    id: Date.now(), // timestamp as unique ID
    first: form.first.value.trim(),
    last: form.last.value.trim(),
    email: form.email.value.trim(),
    prog: form.prog.value.trim(),
    year: form.year.value,
    interests: form.interests.value.trim(),
    photo: form.photo.value.trim() || `https://picsum.photos/128?t=${Date.now()}`
  };

  if (!validate(student)) {
    live.textContent = "⚠️ Please fix the errors before submitting.";
    return;
  }

  live.textContent = "✅ Student registered successfully!";
  profiles.push(student);
  saveProfiles();
  renderProfile(student);
  form.reset();
});

// Validation
function validate(s) {
  let valid = true;

  if (!s.first) { showError("first", "👉 First name is required!"); valid = false; }
  else showError("first", "");

  if (!s.last) { showError("last", "👉 Last name is required!"); valid = false; }
  else showError("last", "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) {
    showError("email", "👉 Enter a valid email (e.g. you@school.edu)");
    valid = false;
  } else showError("email", "");

  if (!s.prog) { showError("prog", "👉 Please enter your programme"); valid = false; }
  else showError("prog", "");

  if (!s.year) { showError("year", "👉 Select your year of study"); valid = false; }
  else showError("year", "");

  return valid;
}

function showError(field, msg) {
  document.getElementById(`err-${field}`).textContent = msg;
}

// Save
function saveProfiles() {
  localStorage.setItem("profiles", JSON.stringify(profiles));
}

// Render card + table row
function renderProfile(s) {
  // --- Card
  const card = document.createElement("div");
  card.className = "card-person";
  card.dataset.id = s.id;
  card.innerHTML = `
    <img src="${s.photo}" alt="${s.first} ${s.last}">
    <h3>${s.first} ${s.last}</h3>
    <p><span class="badge">${s.prog}</span> <span class="badge">Year ${s.year}</span></p>
    <p>${s.interests || "No interests listed"}</p>
    <button class="edit-btn">✏️ Edit</button>
    <button class="remove-btn">🗑️ Remove</button>
  `;
  document.getElementById("cards").prepend(card);

  // --- Table row
  const tr = document.createElement("tr");
  tr.dataset.id = s.id;
  tr.innerHTML = `
    <td>${s.first} ${s.last}</td>
    <td>${s.prog}</td>
    <td>${s.year}</td>
    <td>
      <button class="edit-btn">✏️ Edit</button>
      <button class="remove-btn">🗑️ Remove</button>
    </td>
  `;
  document.querySelector("#summary tbody").prepend(tr);

  // Actions
  card.querySelector(".remove-btn").addEventListener("click", () => removeProfile(s.id));
  tr.querySelector(".remove-btn").addEventListener("click", () => removeProfile(s.id));

  card.querySelector(".edit-btn").addEventListener("click", () => editProfile(s.id));
  tr.querySelector(".edit-btn").addEventListener("click", () => editProfile(s.id));
}

// Remove
function removeProfile(id) {
  if (!confirm("Are you sure you want to remove this student?")) return;
  profiles = profiles.filter(s => s.id !== id);
  saveProfiles();
  document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.remove());
  live.textContent = "🗑️ Student removed.";
}

// Edit
function editProfile(id) {
  const s = profiles.find(p => p.id === id);
  if (!s) return;

  form.first.value = s.first;
  form.last.value = s.last;
  form.email.value = s.email;
  form.prog.value = s.prog;
  form.interests.value = s.interests;
  form.photo.value = s.photo;
  form.querySelector(`input[name="year"][value="${s.year}"]`).checked = true;

  removeProfile(id); // remove old entry before re-submission
  live.textContent = "✏️ Editing mode: update details and re-submit.";
}

// Search
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  document.querySelectorAll("#cards .card-person").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(q) ? "block" : "none";
  });
  document.querySelectorAll("#summary tbody tr").forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});
