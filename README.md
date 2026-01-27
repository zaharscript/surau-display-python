# 🕌 Surau Digital Display System

A **modern, elegant digital display** for surau & masjid — showing **live prayer times, countdown to next prayer, Islamic dates, and weekly activities** in a beautiful, TV-friendly layout.

Designed for **Surau Seri Dahlia, Bandar Seri Putra**, but easily adaptable for any mosque or prayer hall.

---

## ✨ Features

✅ **Live Digital Clock** (12-hour format with seconds)  
✅ **Automatic Prayer Times** (Malaysia – JAKIM zone support)  
✅ **Next Prayer Countdown Timer**  
✅ **Gregorian & Hijri Dates**  
✅ **Iqamah Time Display**  
✅ **Weekly Activities Schedule**  
✅ **Auto-Rotating Announcements / Ads**  
✅ **Glassmorphism UI** – perfect for TV & large screens  
✅ **Offline-friendly once loaded**

---

## 🖥️ Preview

> Designed for **Full HD (1920×1080)** displays  
> Works great on:
- Smart TV (via browser)
- Android TV
- Raspberry Pi
- Mini PC / NUC

📸 *Add screenshots here once deployed*

---

## 🏗️ Tech Stack

| Technology | Purpose |
|----------|--------|
| **HTML5** | Layout & structure |
| **CSS3** | Modern UI (glassmorphism, animations) |
| **JavaScript (Vanilla)** | Clock, countdown, API handling |
| **Waktu Solat API** | Official Malaysia prayer times |
| **Google Fonts** | Amiri & Montserrat |
| **Font Awesome** | Islamic & UI icons |

No frameworks.  
No build step.  
Just open & run. ⚡

---

## 📁 Project Structure

```text
surau-display-python/
│
├── index.html          # Main display page
├── css/
│   └── style.css       # UI styling & layout
├── js/
│   └── script.js       # Clock, prayer times, countdown
├── img/
│   ├── logo.jpg        # Surau logo
│   ├── mosque_bg.png   # Background image
│   └── ustaz/          # Speaker images
└── README.md


##⚙️ Configuration
1️⃣ Set Prayer Zone

Open script.js and edit:

const CONFIG = {
  zone: 'SGR01', // Example: Hulu Langat
  location: 'Bandar Seri Putra',
  country: 'Malaysia'
};

📌 Common Malaysia Zones:

SGR01 – Hulu Langat

WLY01 – Kuala Lumpur

JHR02 – Johor Bahru

PNG01 – Penang

2️⃣ Update Surau Info

Edit in index.html:

<h1 class="english-name">Surau Seri Dahlia</h1>
<h2 class="arabic-name">سوراو سري داهليا</h2>

Replace the logo:

img/logo.jpg

3️⃣ Weekly Activities

Modify the Weekly Activities section in index.html to match your surau’s schedule:

Kuliah Subuh

Kelas Al-Quran

Yasin & Tahlil

Children’s classes

Special events

Supports:

Speaker photo

Icons

Multiple sessions per day


##📺 Running the Display
Option A: Simple (Recommended)

Just open index.html in:

Chrome

Edge

Firefox

Then press F11 (Fullscreen).


Option B: Raspberry Pi / Kiosk Mode

chromium-browser --kiosk index.html

Perfect for 24/7 TV display.

🧠 Design Philosophy

🧘 Calm & respectful

📖 Easy to read from far

🌙 Islamic aesthetics

🚫 No distractions

🧓 Elder-friendly fonts


🔮 Planned Enhancements (Ideas)

🔊 Azan audio playback

🌧️ Weather widget

📢 Emergency announcements

🌐 Multi-language toggle

📱 Remote admin panel

🕰️ Configurable iqamah delays

PRs are welcome 🤝


📜 License

MIT License

🕌 Credits

Built with ❤️ for the community
Inspired by real surau needs in Malaysia

“Sebaik-baik manusia adalah yang paling bermanfaat kepada manusia lain.”

⭐ Support the Project

If this helped your surau:

Give it a ⭐ on GitHub

Share with other masjid committees

Make du‘a for the contributors 🤍


---


