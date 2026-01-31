document.addEventListener('DOMContentLoaded', () => {
    const tarikhInput = document.getElementById('tarikh');
    const hariDisp = document.getElementById('hariDisp');
    const hariInput = document.getElementById('hari');
    const uploadBtn = document.getElementById('uploadBtn');
    const gambarInput = document.getElementById('gambarInput');
    const fileName = document.getElementById('fileName');
    const activityForm = document.getElementById('activityForm');

    // Days in Malay
    const malayDays = [
        'Ahad',
        'Isnin',
        'Selasa',
        'Rabu',
        'Khamis',
        'Jumaat',
        'Sabtu'
    ];

    // Auto-fill Hari based on Tarikh
    tarikhInput.addEventListener('change', (e) => {
        const dateVal = e.target.value;
        if (dateVal) {
            const date = new Date(dateVal);
            const dayName = malayDays[date.getDay()];
            hariDisp.textContent = dayName;
            hariInput.value = dayName;
        } else {
            hariDisp.textContent = '-';
            hariInput.value = '';
        }
    });

    // Trigger file upload
    uploadBtn.addEventListener('click', () => {
        gambarInput.click();
    });

    // Show selected file name
    gambarInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileName.textContent = e.target.files[0].name;
        } else {
            fileName.textContent = 'Tiada fail dipilih';
        }
    });

    // Helper to convert image to Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // Form Submission
    activityForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(activityForm);
        const data = Object.fromEntries(formData.entries());

        // Handle optional image
        const imageFile = gambarInput.files[0];
        if (imageFile) {
            try {
                data.imageData = await toBase64(imageFile);
            } catch (err) {
                console.error("Error converting image:", err);
            }
        }

        // Add timestamp for sorting
        data.id = Date.now();
        data.timestamp = new Date().toISOString();

        // Save to localStorage
        const existingActivities = JSON.parse(localStorage.getItem('surau_activities') || '[]');
        existingActivities.push(data);
        localStorage.setItem('surau_activities', JSON.stringify(existingActivities));

        alert('Aktiviti berjaya didaftarkan!');

        // Redirect to main page
        window.location.href = 'index.html';
    });
});
