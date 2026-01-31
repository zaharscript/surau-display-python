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

    // Form Submission
    activityForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(activityForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Activity Data Submitted:', data);
        alert('Aktiviti berjaya didaftarkan! (Development Mode: Check console for data)');

        // Optional: Reset form or redirect
        activityForm.reset();
        hariDisp.textContent = '-';
        fileName.textContent = 'Tiada fail dipilih';
    });
});
