import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const tarikhInput = document.getElementById("tarikh");
  const hariDisp = document.getElementById("hariDisp");
  const hariInput = document.getElementById("hari");
  const activityForm = document.getElementById("activityForm");

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
    const dateVal = e.target.value;

    if (dateVal) {
      const date = new Date(dateVal);
      const dayName = malayDays[date.getDay()];
      hariDisp.textContent = dayName;
      hariInput.value = dayName;
    } else {
      hariDisp.textContent = "-";
      hariInput.value = "";
    }
  });

  // Submit form
  activityForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(activityForm);
      const data = Object.fromEntries(formData.entries());

      await addDoc(collection(db, "activities"), {
        tarikh: data.tarikh,
        hari: data.hari,
        tajuk: data.tajuk, // ← FIXED
        penceramah: data.penceramah,
        createdAt: serverTimestamp(),
      });

      alert("Aktiviti berjaya didaftarkan!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error saving activity:", error);
      alert("Gagal menyimpan aktiviti. Sila cuba lagi.");
    }
  });
});
