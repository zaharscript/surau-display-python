import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const tarikhInput = document.getElementById("tarikh");
  const hariDisp = document.getElementById("hariDisp");
  const hariInput = document.getElementById("hari");
  const activityForm = document.getElementById("activityForm");
  const activityList = document.getElementById("activityList");
  const editIdInput = document.getElementById("editId");
  const submitBtn = document.getElementById("submitBtn");
  const cancelEditBtn = document.getElementById("cancelEdit");

  const malayDays = [
    "Ahad",
    "Isnin",
    "Selasa",
    "Rabu",
    "Khamis",
    "Jumaat",
    "Sabtu",
  ];

  // Auto fill hari
  tarikhInput.addEventListener("change", (e) => {
    updateDayDisplay(e.target.value);
  });

  function updateDayDisplay(dateVal) {
    if (dateVal) {
      const date = new Date(dateVal);
      const dayName = malayDays[date.getDay()];
      hariDisp.textContent = dayName;
      hariInput.value = dayName;
    } else {
      hariDisp.textContent = "-";
      hariInput.value = "";
    }
  }

  // Load activities in real-time
  const q = query(collection(db, "activities"), orderBy("tarikh", "desc"));
  onSnapshot(q, (snapshot) => {
    activityList.innerHTML = "";
    if (snapshot.empty) {
      activityList.innerHTML = '<p style="text-align: center; color: #888;">Tiada aktiviti dijumpai.</p>';
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;

      const item = document.createElement("div");
      item.className = "activity-item";
      item.innerHTML = `
        <div class="activity-info">
          <h4>${data.tajuk}</h4>
          <p><strong>Tarikh:</strong> ${data.tarikh} (${data.hari})</p>
          <p><strong>Masa:</strong> ${data.masa || "-"}</p>
          <p><strong>Penceramah:</strong> ${data.penceramah}</p>
        </div>
        <div class="activity-actions">
          <button class="edit-btn" data-id="${id}">Edit Aktiviti</button>
          <button class="delete-btn" data-id="${id}">Padam Aktiviti</button>
        </div>
      `;
      activityList.appendChild(item);
    });

    // Add event listeners to buttons
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => handleEdit(btn.dataset.id, snapshot));
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => handleDelete(btn.dataset.id));
    });
  });

  // Handle Edit click
  function handleEdit(id, snapshot) {
    const docData = snapshot.docs.find(d => d.id === id).data();

    // Fill form
    editIdInput.value = id;
    tarikhInput.value = docData.tarikh;
    updateDayDisplay(docData.tarikh);
    document.getElementById("masa").value = docData.masa || "";
    document.getElementById("tajuk").value = docData.tajuk;
    document.getElementById("penceramah").value = docData.penceramah;

    // UI Updates
    submitBtn.textContent = "Simpan Kemaskini";
    submitBtn.style.backgroundColor = "#f1c40f";
    submitBtn.style.color = "#333";
    cancelEditBtn.style.display = "inline-block";

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Delete click
  async function handleDelete(id) {
    if (confirm("Adakah anda pasti mahu memadam aktiviti ini?")) {
      try {
        await deleteDoc(doc(db, "activities", id));
        alert("Aktiviti berjaya dipadam!");
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert("Gagal memadam aktiviti.");
      }
    }
  }

  // Cancel Edit
  cancelEditBtn.addEventListener("click", () => {
    resetForm();
  });

  function resetForm() {
    activityForm.reset();
    editIdInput.value = "";
    hariDisp.textContent = "-";
    submitBtn.textContent = "Daftar Aktiviti";
    submitBtn.style.backgroundColor = "#1A5319";
    submitBtn.style.color = "white";
    cancelEditBtn.style.display = "none";
  }

  // Submit form (Add or Update)
  activityForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = editIdInput.value;

    try {
      const formData = new FormData(activityForm);
      const data = Object.fromEntries(formData.entries());

      const activityData = {
        tarikh: data.tarikh,
        hari: data.hari,
        masa: data.masa || "",
        tajuk: data.tajuk,
        penceramah: data.penceramah,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        // Update
        await updateDoc(doc(db, "activities", id), activityData);
        alert("Aktiviti berjaya dikemaskini!");
        resetForm();
      } else {
        // Add
        activityData.createdAt = serverTimestamp();
        await addDoc(collection(db, "activities"), activityData);
        alert("Aktiviti berjaya didaftarkan!");
        window.location.href = "index.html"; // Redirect to main display
      }
    } catch (error) {
      console.error("Error saving activity:", error);
      alert("Gagal menyimpan aktiviti. Sila cuba lagi.");
    }
  });
});
