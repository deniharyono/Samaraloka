// 1. Ambil Parameter Nama Tamu Dinamis dari URL
const urlParams = new URLSearchParams(window.location.search);
const guestTo = urlParams.get('to') || '';

const guestNameEl = document.getElementById('guestName');
const rsvpNamaInput = document.getElementById('rsvp-nama');

if (guestTo) {
    guestNameEl.innerText = guestTo;
    rsvpNamaInput.value = guestTo;
    rsvpNamaInput.readOnly = true; 
} else {
    guestNameEl.innerText = "Tamu Undangan";
    rsvpNamaInput.value = "Tamu Kehormatan";
    rsvpNamaInput.readOnly = false; 
}

// 2. Tombol Buka Undangan (Aktifkan Scrolling & Musik)
const btnOpen = document.getElementById('btnOpen');
const coverOverlay = document.getElementById('coverOverlay');
const mainContent = document.getElementById('mainContent');
const weddingMusic = document.getElementById('weddingMusic');
const musicToggle = document.getElementById('musicToggle');

btnOpen.addEventListener('click', () => {
    coverOverlay.style.transition = "transform 1s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease";
    coverOverlay.style.transform = "translateY(-100%)";
    coverOverlay.style.opacity = "0";
    
    document.body.classList.remove('overflow-hidden');
    mainContent.classList.remove('opacity-0');
    mainContent.classList.add('opacity-100');

    weddingMusic.play().then(() => {
        isMusicPlaying = true;
        musicToggle.classList.remove('hidden');
    }).catch(e => {
        console.log("Autoplay music blocked: ", e);
        musicToggle.classList.remove('hidden');
    });

    setTimeout(() => {
        const monogram = document.getElementById('heroMonogram');
        const title = document.getElementById('heroTitle');
        
        monogram.style.transform = "scale(1)";
        monogram.style.opacity = "1";
        
        title.style.transform = "translateY(0)";
        title.style.opacity = "1";
    }, 300);

    setTimeout(() => {
        coverOverlay.classList.add('hidden');
    }, 1000);
});

// 3. Audio & Music Control
let isMusicPlaying = false;
const musicIcon = document.getElementById('musicIcon');

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        weddingMusic.pause();
        musicIcon.className = "fas fa-volume-mute text-xl";
        musicToggle.classList.remove('animate-spin-slow');
        isMusicPlaying = false;
    } else {
        weddingMusic.play();
        musicIcon.className = "fas fa-music text-xl";
        musicToggle.classList.add('animate-spin-slow');
        isMusicPlaying = true;
    }
});

// 4. Parallax Background pada Hero Section saat digulir
window.addEventListener('scroll', () => {
    const homeSec = document.getElementById('home');
    let offset = window.pageYOffset;
    homeSec.style.backgroundPositionY = offset * 0.4 + 'px';
});

// 5. Smooth Scroll Helper Function
function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// 6. Animasi Scroll Reveal (Sections & Elements Fade-up)
const revealElements = document.querySelectorAll('.reveal');
function checkReveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 100;
        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// 7. Hitungan Mundur (Countdown Timer)
const targetDate = new Date("Dec 12, 2026 09:00:00").getTime();
const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d < 10 ? '0' + d : d;
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;

    if (difference < 0) {
        clearInterval(countdownTimer);
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
    }
}, 1000);

// =========================================================
// LOGIKA DATABASE RSVP GOOGLE APPS SCRIPT
// =========================================================
const formRsvp = document.getElementById('form-rsvp-jawa');
const statusKirim = document.getElementById('status-kirim');
const formKonfirmasi = document.getElementById('form-konfirmasi');
const groupJumlahHadir = document.getElementById('group-jumlah-hadir');
const fieldJumlahHadir = document.getElementById('form-field-jumlah-hadir');
const wishesContainer = document.getElementById('wishesContainer');

// Masukkan URL Google Web App Apps Script Anda di sini
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwdp5WywrBX4pbpsnG8vhn2zzEmlvN5L1J1bdMVFy5aZZI7y9hAlqQ3IZUkLtovq6yr/exec'; 

// Logika Tampilkan / Sembunyikan Porsi Tambahan (Conditional Field)
formKonfirmasi.addEventListener('change', function() {
    if (this.value === 'Hadir') {
        groupJumlahHadir.classList.remove('hidden');
        fieldJumlahHadir.required = true;
    } else {
        groupJumlahHadir.classList.add('hidden');
        fieldJumlahHadir.required = false;
        fieldJumlahHadir.value = ''; 
    }
});

// Kirim RSVP AJAX ke Google Sheets
formRsvp.addEventListener('submit', function(e) {
    e.preventDefault();
    
    statusKirim.innerText = "Sedang mengirim konfirmasi...";
    statusKirim.className = "mt-4 text-center font-semibold text-sm text-gold-light animate-pulse";

    const rawName = document.getElementById('rsvp-nama').value;
    const rawStatus = formKonfirmasi.value;
    const rawPorsi = fieldJumlahHadir.value || '0';
    const rawWish = document.getElementById('rsvp-pesan').value;

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: new URLSearchParams(new FormData(formRsvp))
    })
    .then(res => res.json())
    .then(data => {
        if(data.result === 'success') {
            statusKirim.innerText = "Matur Nuwun, konfirmasi RSVP kasimpen.";
            statusKirim.className = "mt-4 text-center font-semibold text-sm text-green-400";
            
            // Append visual instan ke Daftar Doa
            const card = document.createElement('div');
            card.className = "border-b border-gold/10 pb-3 transition-all transform scale-95 opacity-0";
            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <h5 class="text-gold font-semibold text-sm">${rawName}</h5>
                    <span class="text-[10px] px-2 py-0.5 bg-emerald-light text-gold rounded-full font-bold">
                        ${rawStatus} ${rawStatus === 'Hadir' ? '(' + rawPorsi + ' Pax)' : ''}
                    </span>
                </div>
                <p class="text-xs text-gray-300 mt-1">${rawWish}</p>
            `;
            wishesContainer.insertBefore(card, wishesContainer.firstChild);

            setTimeout(() => {
                card.classList.remove('scale-95', 'opacity-0');
                card.classList.add('scale-100', 'opacity-100');
            }, 100);

            const tempName = rsvpNamaInput.value;
            formRsvp.reset();
            rsvpNamaInput.value = tempName;
            groupJumlahHadir.classList.add('hidden');
            fieldJumlahHadir.required = false;
        } else {
            statusKirim.innerText = "Gagal: " + data.message;
            statusKirim.className = "mt-4 text-center font-semibold text-sm text-red-500";
        }
    })
    .catch(error => {
        statusKirim.innerText = "Terjadi gangguan jaringan database.";
        statusKirim.className = "mt-4 text-center font-semibold text-sm text-red-400";
        console.error('Error database RSVP:', error);
    });
});

// 9. Lightbox Modal Gallery Foto Zoom
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
}

function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
}

// 10. Navigasi Aktif saat Scroll
const sections = document.querySelectorAll('section');
const navButtons = {
    'home': document.getElementById('nav-home'),
    'mempelai': document.getElementById('nav-mempelai'),
    'acara': document.getElementById('nav-acara'),
    'rsvp': document.getElementById('nav-rsvp')
};

window.addEventListener('scroll', () => {
    let current = 'home';
    sections.forEach(sec => {
        const sectionTop = sec.offsetTop;
        const sectionHeight = sec.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            if (sec.id === 'home' || sec.id === 'quotes') current = 'home';
            else if (sec.id === 'mempelai') current = 'mempelai';
            else if (sec.id === 'acara' || sec.id === 'galeri') current = 'acara';
            else if (sec.id === 'rsvp' || sec.id === 'cerita') current = 'rsvp';
        }
    });

    Object.values(navButtons).forEach(btn => {
        if(btn) btn.classList.remove('text-gold', 'scale-110');
    });
    if(navButtons[current]) {
        navButtons[current].classList.add('text-gold', 'scale-110');
    }
});

// ==========================================
// CANVAS ANIMATION (FALLING GOLD GLITTER)
// ==========================================
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 50;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
            this.speedY = Math.random() * 0.8 + 0.4;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 1.6, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
