document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const CONFIG = {
        zone: 'SGR01', // Hulu Langat (Bandar Seri Putra)
        location: 'Bandar Seri Putra',
        country: 'Malaysia'
    };

    // State
    let prayerTimes = null;
    let nextPrayerTime = null;

    // Elements
    const clockEl = document.getElementById('clock');
    const ampmEl = document.getElementById('ampm');
    const gregDateEl = document.getElementById('gregorian-date');
    const hijriDateEl = document.getElementById('hijri-date');
    const nextPrayerNameEl = document.getElementById('next-prayer-name');
    const countdownEl = document.getElementById('countdown');

    // Initialize
    init();

    function init() {
        updateClock(); // Start immediately
        setInterval(updateClock, 1000);

        fetchPrayerTimes();
        // Refresh prayer times daily (or every 6 hours to be safe)
        setInterval(fetchPrayerTimes, 6 * 60 * 60 * 1000);

        // Initialize Advertisement Rotator
        initAdRotator();

        // Initialize Dynamic Activities
        initActivities();
    }

    function updateClock() {
        const now = new Date();

        // Time
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
        ampmEl.textContent = ampm;

        // Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        gregDateEl.textContent = now.toLocaleDateString('en-MY', options);

        // Update Prayer Status if we have data
        if (prayerTimes) {
            updatePrayerStatus(now);
        }
    }

    async function fetchPrayerTimes() {
        try {
            const apiUrl = `https://api.waktusolat.app/v2/solat/${CONFIG.zone}`;
            console.log('Fetching prayer times from:', apiUrl);

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.prayers) {
                const today = new Date();
                const dayOfMonth = today.getDate();
                const todayData = data.prayers.find(p => p.day === dayOfMonth);

                if (todayData) {
                    // Format times from Unix timestamp to HH:MM (24h)
                    const formatUnix = (timestamp) => {
                        const date = new Date(timestamp * 1000);
                        const h = String(date.getHours()).padStart(2, '0');
                        const m = String(date.getMinutes()).padStart(2, '0');
                        return `${h}:${m}`;
                    };

                    prayerTimes = {
                        Fajr: formatUnix(todayData.fajr),
                        Sunrise: formatUnix(todayData.syuruk),
                        Dhuhr: formatUnix(todayData.dhuhr),
                        Asr: formatUnix(todayData.asr),
                        Maghrib: formatUnix(todayData.maghrib),
                        Isha: formatUnix(todayData.isha)
                    };

                    // Update Hijri Date
                    // Format: "1447-08-06"
                    const [hYear, hMonth, hDay] = todayData.hijri.split('-');
                    const hijriMonths = [
                        'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
                        'Jamadil Awal', 'Jamadil Akhir', 'Rejab', 'Syaaban',
                        'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijjah'
                    ];
                    const monthName = hijriMonths[parseInt(hMonth) - 1];
                    hijriDateEl.textContent = `${parseInt(hDay)} ${monthName} ${hYear}`;

                    // Update UI with Times
                    fillPrayerTimes(prayerTimes);
                }
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
        }
    }

    function fillPrayerTimes(timings) {
        // Map API keys to DOM IDs
        const mapping = {
            'Fajr': 'fajr',
            'Sunrise': 'sunrise', // Syuruq
            'Dhuhr': 'dhuhr',
            'Asr': 'asr',
            'Maghrib': 'maghrib',
            'Isha': 'isha'
        };

        for (const [key, id] of Object.entries(mapping)) {
            const timeElement = document.getElementById(`${id}-time`);
            const iqamahElement = document.getElementById(`${id}-iqamah`);

            if (timeElement && timings[key]) {
                // Formatting time from 24h to 12h for display if desired, 
                // but usually prayer times are shown in 24h or 12h. Let's do 12h for consistency.
                const formattedTime = formatTime12h(timings[key]);
                timeElement.textContent = formattedTime;

                // Fake Iqamah time (Prayer + 10 mins) for demo
                if (iqamahElement) {
                    const [h, m] = timings[key].split(':');
                    const date = new Date();
                    date.setHours(parseInt(h), parseInt(m) + 10);
                    const iqamahStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                    iqamahElement.textContent = formatTime12h(iqamahStr);
                }
            }
        }
    }

    function updatePrayerStatus(now) {
        // Convert current time to minutes since midnight for comparison
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const prayers = [
            { name: 'Fajr', time: prayerTimes.Fajr },
            { name: 'Syuruq', time: prayerTimes.Sunrise },
            { name: 'Dhuhr', time: prayerTimes.Dhuhr },
            { name: 'Asr', time: prayerTimes.Asr },
            { name: 'Maghrib', time: prayerTimes.Maghrib },
            { name: 'Isha', time: prayerTimes.Isha }
        ];

        let nextPrayer = null;
        let currentPrayer = null;

        // Find next prayer
        for (let i = 0; i < prayers.length; i++) {
            const timeParts = prayers[i].time.split(':');
            const pMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);

            if (pMinutes > nowMinutes) {
                nextPrayer = prayers[i];
                // Current is the one before next
                currentPrayer = i > 0 ? prayers[i - 1] : prayers[prayers.length - 1]; // logic slightly flawed for Fajr
                break;
            }
        }

        // If no next prayer found today, it's Fajr tomorrow
        if (!nextPrayer) {
            nextPrayer = prayers[0];
            nextPrayer.isTomorrow = true;
            currentPrayer = prayers[prayers.length - 1]; // Isha
        }

        // Update UI Classes
        document.querySelectorAll('.prayer-card').forEach(card => {
            card.classList.remove('active', 'next');
        });

        // Highlight Next
        // Note: ID mapping needs to match
        const nextId = nextPrayer.name === 'Syuruq' ? 'sunrise' : nextPrayer.name.toLowerCase();
        const nextCard = document.getElementById(`${nextId}-card`);
        if (nextCard) nextCard.classList.add('next');

        // Highlight Current (Active)
        // const currentId = currentPrayer.name === 'Syuruq' ? 'sunrise' : currentPrayer.name.toLowerCase();
        // const currentCard = document.getElementById(`${currentId}-card`);
        // if (currentCard) currentCard.classList.add('active'); // Optional: show what 'time zone' we are in

        // Update Countdown
        updateCountdown(nextPrayer, now);
    }

    function updateCountdown(nextPrayer, now) {
        if (!nextPrayer) return;

        nextPrayerNameEl.textContent = nextPrayer.name;

        const timeParts = nextPrayer.time.split(':');
        const targetDate = new Date();
        targetDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0);

        if (nextPrayer.isTomorrow) {
            targetDate.setDate(targetDate.getDate() + 1);
        }

        const diff = targetDate - now;

        if (diff > 0) {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            countdownEl.textContent = `-${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        } else {
            countdownEl.textContent = "00:00:00";
        }
    }

    function formatTime12h(time24) {
        const [h, m] = time24.split(':');
        let hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        return `${hour}:${m}`;
        // return `${hour}:${m} ${ampm}`; // removed ampm for cleaner list look
    }

    function initAdRotator() {
        const slides = document.querySelectorAll('.ad-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        const slideInterval = 4000; // 4 seconds

        // Ensure first slide is active
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active', 'exit');
            }
        });

        setInterval(() => {
            // Current slide exits
            if (slides[currentSlide]) {
                slides[currentSlide].classList.remove('active');
                slides[currentSlide].classList.add('exit');
                const prevSlide = currentSlide;
                currentSlide = (currentSlide + 1) % slides.length;

                // Next slide enters
                slides[currentSlide].classList.remove('exit');
                slides[currentSlide].classList.add('active');

                // Reset previous slide after transition
                setTimeout(() => {
                    slides[prevSlide].classList.remove('exit');
                }, 800); // Matches transition duration
            }
        }, slideInterval);
    }

    function initActivities() {
        const activitiesContent = document.querySelector('.activities-content');
        if (!activitiesContent) return;

        // Load from localStorage
        const storedActivities = JSON.parse(localStorage.getItem('surau_activities') || '[]');

        if (storedActivities.length > 0) {
            // Clear existing hardcoded activities if we have stored ones
            activitiesContent.innerHTML = '';

            // Sort by date (Tarikh)
            storedActivities.sort((a, b) => new Date(a.tarikh) - new Date(b.tarikh));

            // Group by date to match HTML structure
            const grouped = storedActivities.reduce((acc, act) => {
                if (!acc[act.tarikh]) acc[act.tarikh] = [];
                acc[act.tarikh].push(act);
                return acc;
            }, {});

            for (const [date, acts] of Object.entries(grouped)) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'activity-group';

                // Format the long date for display
                const dateObj = new Date(date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = dateObj.toLocaleDateString('ms-MY', options);

                // Use image from first activity in group or default
                const imageSrc = acts[0].imageData || 'img/ustaz/ustaz.png';

                groupDiv.innerHTML = `
                    <div class="box">
                        <img src="${imageSrc}" class="group-ustaz-img" alt="Ustaz">
                    </div>
                    <div class="activity-date">
                        <span class="day-badge">${acts[0].hari}</span>
                        <span class="date-text">${formattedDate}</span>
                    </div>
                `;

                acts.forEach(act => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'activity-item';

                    // Pick icon based on keywords
                    let icon = 'fa-calendar-check';
                    const title = act.acara.toLowerCase();
                    if (title.includes('quran') || title.includes('mengaji')) icon = 'fa-book-quran';
                    else if (title.includes('kelas') || title.includes('kuliah')) icon = 'fa-chalkboard-user';
                    else if (title.includes('yasin') || title.includes('tahlil')) icon = 'fa-book-open-reader';
                    else if (title.includes('maghrib') || title.includes('isya')) icon = 'fa-cloud-moon';
                    else if (title.includes('subuh')) icon = 'fa-sun';

                    itemDiv.innerHTML = `
                        <div class="act-icon"><i class="fa-solid ${icon}"></i></div>
                        <div class="act-details">
                            <div class="act-title">${act.acara} ${act.masa ? `(${act.masa})` : ''}</div>
                            <div class="act-lead">${act.oleh}</div>
                        </div>
                    `;
                    groupDiv.appendChild(itemDiv);
                });

                activitiesContent.appendChild(groupDiv);
            }
        }
    }
});
