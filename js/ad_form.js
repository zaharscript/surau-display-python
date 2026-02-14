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
    const adForm = document.getElementById("adForm");
    const adList = document.getElementById("adList");
    const editIdInput = document.getElementById("editId");
    const submitBtn = document.getElementById("submitBtn");
    const cancelEditBtn = document.getElementById("cancelEdit");
    const syncStatus = document.getElementById("syncStatus");

    // Sync Status Logic
    function updateSyncStatus(isSynced, isError = false) {
        if (!syncStatus) return;

        if (isError) {
            syncStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Ralat';
            syncStatus.className = "sync-badge error";
        } else if (isSynced) {
            syncStatus.innerHTML = '<i class="fas fa-check-circle"></i> Bersama';
            syncStatus.className = "sync-badge synced";
        } else {
            syncStatus.innerHTML =
                '<i class="fas fa-circle-notch fa-spin"></i> Menyinkron...';
            syncStatus.className = "sync-badge";
        }
    }

    updateSyncStatus(navigator.onLine);
    window.addEventListener("online", () => updateSyncStatus(true));
    window.addEventListener("offline", () => updateSyncStatus(false));

    // Load advertisements in real-time
    const q = query(collection(db, "advertisements"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        adList.innerHTML = "";
        if (snapshot.empty) {
            adList.innerHTML =
                '<p style="text-align: center; color: #888;">Tiada iklan dijumpai.</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;

            const item = document.createElement("div");
            item.className = "activity-item";
            item.innerHTML = `
        <div class="ad-info">
          <h4>${data.header}</h4>
          <p><strong>Highlight:</strong> ${data.highlight}</p>
          <p><strong>Line 1:</strong> ${data.line1}</p>
          <p><strong>Line 2:</strong> ${data.line2 || "-"}</p>
          <p><strong>Contact 1:</strong> ${data.contact1 || "-"}</p>
          <p><strong>Contact 2:</strong> ${data.contact2 || "-"}</p>
        </div>
        <div class="activity-actions">
          <button class="edit-btn" data-id="${id}">Edit Iklan</button>
          <button class="delete-btn" data-id="${id}">Padam Iklan</button>
        </div>
      `;
            adList.appendChild(item);
        });

        // Add event listeners
        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", () => handleEdit(btn.dataset.id, snapshot));
        });
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => handleDelete(btn.dataset.id));
        });
    });

    // Handle Edit
    function handleEdit(id, snapshot) {
        const docData = snapshot.docs.find((d) => d.id === id).data();

        editIdInput.value = id;
        document.getElementById("header").value = docData.header;
        document.getElementById("highlight").value = docData.highlight;
        document.getElementById("line1").value = docData.line1;
        document.getElementById("line2").value = docData.line2 || "";
        document.getElementById("contact1").value = docData.contact1 || "";
        document.getElementById("contact2").value = docData.contact2 || "";

        submitBtn.textContent = "Simpan Kemaskini";
        submitBtn.style.backgroundColor = "#f1c40f";
        submitBtn.style.color = "#1a202c";
        cancelEditBtn.style.display = "block";

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Handle Delete
    async function handleDelete(id) {
        if (confirm("Adakah anda pasti mahu memadam iklan ini?")) {
            try {
                await deleteDoc(doc(db, "advertisements", id));
                alert("Iklan berjaya dipadam!");
            } catch (error) {
                console.error("Error deleting ad:", error);
                alert("Gagal memadam iklan.");
            }
        }
    }

    // Cancel Edit
    cancelEditBtn.addEventListener("click", () => {
        resetForm();
    });

    function resetForm() {
        adForm.reset();
        editIdInput.value = "";
        submitBtn.textContent = "Daftar Iklan";
        submitBtn.style.backgroundColor = "";
        submitBtn.style.color = "";
        cancelEditBtn.style.display = "none";
    }

    // Submit form
    adForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = editIdInput.value;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        updateSyncStatus(false);

        try {
            const formData = new FormData(adForm);
            const data = Object.fromEntries(formData.entries());

            const adData = {
                header: data.header,
                highlight: data.highlight,
                line1: data.line1,
                line2: data.line2 || "",
                contact1: data.contact1 || "",
                contact2: data.contact2 || "",
                updatedAt: serverTimestamp(),
            };

            if (id) {
                await updateDoc(doc(db, "advertisements", id), adData);
                alert("Iklan berjaya dikemaskini!");
                resetForm();
            } else {
                adData.createdAt = serverTimestamp();
                await addDoc(collection(db, "advertisements"), adData);
                alert("Iklan berjaya didaftarkan!");
                resetForm();
            }
            updateSyncStatus(true);
            submitBtn.disabled = false;
            submitBtn.textContent = id ? "Simpan Kemaskini" : "Daftar Iklan";
        } catch (error) {
            console.error("Error saving ad:", error);
            updateSyncStatus(false, true);
            alert("Gagal menyimpan iklan.");
            submitBtn.disabled = false;
            submitBtn.textContent = id ? "Simpan Kemaskini" : "Daftar Iklan";
        }
    });
});
