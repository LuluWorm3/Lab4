// grabbing the form + helpers
const regForm = document.getElementById("regForm");
const liveMsg = document.getElementById("live");
const searchBox = document.getElementById("search");

let allProfiles = []; // will hold students

// load saved data
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("profiles");
  if (saved) {
    try {
      allProfiles = JSON.parse(saved);
    } catch (e) {
      console.error("Bad JSON in storage", e);
      allProfiles = [];
    }
  }
  allProfiles.forEach(p => renderProfile(p));
});

// submit new student
regForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    id: Date.now(),
    first: regForm.first.value.trim(),
    last: regForm.last.value.trim(),
    email: regForm.email.value.trim(),
    prog: regForm.prog.value.trim(),
    year: regForm.year.value,
    interests: regForm.interests.value.trim(),
    photo: regForm.photo.value.trim() || `https://picsum.photos/128?t=${Math.random()}`
  };

  if (!validate(data)) {
    liveMsg.textContent = "⚠️ Please fix errors before submitting.";
    return;
  }

  liveMsg.textContent = "✅ Student registered successfully!";
  allProfiles.push(data);
  saveProfiles();
  renderProfile(data);
  regForm.reset();
});

// validation
function validate(d) {
  let valid = true;
  if (!d.first) { showError("first", "First name required"); valid = false; } else showError("first", "");
  if (!d.last) { showError("last", "Last name required"); valid = false; } else showError("last", "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    showError("email", "Invalid email"); valid = false;
  } else showError("email", "");
  if (!d.prog) { showError("prog", "Programme required"); valid = false; } else showError("prog", "");
  if (!d.year) { showError("year", "Pick a year"); valid = false; } else showError("year", "");
  return valid;
}

function showError(field, msg) {
  document.getElementById(`err-${field}`).textContent = msg;
}

// localStorage helpers
function saveProfiles() {
  localStorage.setItem("profiles", JSON.stringify(allProfiles));
}

// render both card + table row
function renderProfile(p) {
  // card
  const card = document.createElement("div");
  card.className = "card-person";
  card.dataset.id = p.id;
  card.innerHTML = `
      <img src="${p.photo}" alt="${p.first} ${p.last}">
      <h3>${p.first} ${p.last}</h3>
      <p><span class="badge">${p.prog}</span> <span class="badge">Year ${p.year}</span></p>
      <p>${p.interests}</p>
      <button class="edit-btn">Edit</button>
      <button class="remove-btn">Remove</button>
    `;
  document.getElementById("cards").prepend(card);

  // table row
  const tr = document.createElement("tr");
  tr.dataset.id = p.id;
  tr.innerHTML = `
      <td>${p.first} ${p.last}</td>
      <td>${p.prog}</td>
      <td>${p.year}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
      </td>
    `;
  document.querySelector("#summary tbody").prepend(tr);

  // events
  card.querySelector(".remove-btn").addEventListener("click", () => removeProfile(p.id));
  tr.querySelector(".remove-btn").addEventListener("click", () => removeProfile(p.id));
  card.querySelector(".edit-btn").addEventListener("click", () => editProfile(p.id));
  tr.querySelector(".edit-btn").addEventListener("click", () => editProfile(p.id));
}

// remove profile
function removeProfile(id) {
  allProfiles = allProfiles.filter(x => x.id !== id);
  saveProfiles();
  document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.remove());
}

// edit profile
function editProfile(id) {
  const prof = allProfiles.find(x => x.id === id);
  if (!prof) return;

  regForm.first.value = prof.first;
  regForm.last.value = prof.last;
  regForm.email.value = prof.email;
  regForm.prog.value = prof.prog;
  regForm.interests.value = prof.interests;
  regForm.photo.value = prof.photo;

  const yrRadio = regForm.querySelector(`input[name="year"][value="${prof.year}"]`);
  if (yrRadio) yrRadio.checked = true;

  // remove old entry before resubmit
  removeProfile(id);
}

// search/filter
searchBox.addEventListener("input", () => {
  const q = searchBox.value.toLowerCase();
  document.querySelectorAll("#cards .card-person").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(q) ? "block" : "none";
  });
  document.querySelectorAll("#summary tbody tr").forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});
