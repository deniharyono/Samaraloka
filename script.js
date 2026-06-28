// 1. Inisialisasi AOS (Animate On Scroll)
AOS.init({
    duration: 1200,
    easing: 'ease-in-out-sine',
    once: true,
    offset: 150
});

// 2. Pembacaan Logika Nama Tamu Dinamis via Query Parameter (?to=Nama+Tamu)
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
const elemenNama = document.getElementById('nama-penerima');
const inputFormNama = document.getElementById('rsvp-nama');

if (namaTamu) {
    const namaTerdekode = decodeURIComponent(namaTamu.replace(/\+/g, ' '));
    elemenNama.innerText = namaTerdekode;
    inputFormNama.value = namaTerdekode;
} else {
    elemenNama.innerText = "Tamu Undangan";
    inputFormNama.value = "Tamu Undangan";
    inputFormNama.removeAttribute('readonly'); // Izinkan isi manual jika parameter kosong
}

// 3. Penanganan Tombol Buka Undangan & Mitigasi Autoplay Musik
const tombolBuka = document.querySelector('.tombol-buka');
const sekatSampul = document.getElementById('sekat-sampul');
const audioLatar = document.getElementById('audio-latar');

tombolBuka.addEventListener('click', function() {
    // Jalankan Audio dengan pembungkusan Promise pengaman
    const playPromise = audioLatar.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log("Audio berhasil dijalankan dengan persetujuan gestur.");
        }).catch(error => {
            console.log("Pemutaran audio diblokir oleh sistem:", error);
        });
    }

    // Geser sampul ke atas dan buka kunci scroll
    sekatSampul.classList.add('buka-halaman');
    document.body.classList.remove('body-no-scroll');
});

// 4. Kalkulasi Sistem Penghitung Waktu Mundur Akurat (Target: 12 Des 2026)
function inisialisasiCountdown(idElemen, waktuAcara) {
    const targetTime = new Date(waktuAcara).getTime();
    const elemenMundur = document.getElementById(idElemen);

    const interval = setInterval(() => {
        const sekarang = new Date().getTime();
        const dt = targetTime - sekarang;

        if (dt < 0) {
            clearInterval(interval);
            elemenMundur.innerHTML = "<div class='acara-dimulai'>Acara Pernikahan Sedang Berlangsung!</div>";
            return;
        }

        // Operasi Matematika Pembagian Bilangan Bulat & Modulo
        const d = Math.floor(dt / (1000 * 60 * 60 * 24));
        const h = Math.floor((dt / (1000 * 60 * 60)) % 24);
        const m = Math.floor((dt / (1000 * 60)) % 60);
        const s = Math.floor((dt / 1000) % 60);

        // Render ke HTML dengan format 2 digit
        elemenMundur.querySelector('.hari').innerText = String(d).padStart(2, '0');
        elemenMundur.querySelector('.jam').innerText = String(h).padStart(2, '0');
        elemenMundur.querySelector('.menit').innerText = String(m).padStart(2, '0');
        elemenMundur.querySelector('.detik').innerText = String(s).padStart(2, '0');
    }, 1000);
}

// Eksekusi Countdown menuju tanggal target
inisialisasiCountdown('counter-wedding', '2026-12-12T09:00:00+07:00');

// 5. Integrasi Formulir RSVP Frontend ke Web App API Google Sheets
const formRsvp = document.getElementById('form-rsvp');
const statusKirim = document.getElementById('status-kirim');

// GANTI teks di bawah ini dengan Web App URL yang Anda salin dari Langkah 3!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjwxy-5Jh_Zt-0zCoQQ2c2g3ONyjIFflEVuxCAclDZuiN1qxp0-g5x3p-6MaSwTT-G/exec';

formRsvp.addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah muat ulang halaman saat tombol submit ditekan
    
    statusKirim.innerText = "Sedang mengirim konfirmasi...";
    statusKirim.style.color = "#8a704c";

    // Mengambil seluruh input data dari formulir elemen secara otomatis
    const formData = new FormData(formRsvp);
    
    // Mengirimkan data menggunakan metode POST asynchronous (AJAX Fetch)
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            statusKirim.innerText = "Terima kasih! Konfirmasi Anda telah berhasil disimpan.";
            statusKirim.style.color = "green";
            formRsvp.reset(); // Mengosongkan kembali form isi
        } else {
            statusKirim.innerText = "Gagal: " + data.message;
            statusKirim.style.color = "red";
        }
    })
    .catch(error => {
        console.error('Error saat mengirim data rsvp:', error);
        statusKirim.innerText = "Terjadi gangguan jaringan. Silakan coba lagi.";
        statusKirim.style.color = "red";
    });
});

// =========================================================================
// IMPLEMENTASI HASIL ANALISA IVY.INVITEABLE.ID
// =========================================================================

// 1. Logika Kondisional Form RSVP (Jumlah Hadir Muncul Hanya Jika Memilih 'Hadir')
const selectKonfirmasi = document.getElementById('form-konfirmasi');
const groupJumlahHadir = document.getElementById('group-jumlah-hadir');
const inputJumlahHadir = groupJumlahHadir.querySelector('input');

selectKonfirmasi.addEventListener('change', function() {
    if (this.value === 'Hadir') {
        groupJumlahHadir.classList.add('is-visible');
        inputJumlahHadir.required = true;
        inputJumlahHadir.disabled = false;
    } else {
        groupJumlahHadir.classList.remove('is-visible');
        inputJumlahHadir.required = false;
        inputJumlahHadir.disabled = true;
        inputJumlahHadir.value = ''; // Reset nilai
    }
});

// 2. Otomatisasi Fitur Add To Calendar Instan via Google Calendar Link
(function() {
    const btnCalendar = document.getElementById('add-to-calendar');
    if (!btnCalendar) return;

    const titleAcara = encodeURIComponent("Pawiwahan Agung Arif & Kayla");
    const tanggalMulai = "20261212"; // Format: YYYYMMDD
    const tanggalSelesai = "20261213"; 

    btnCalendar.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${titleAcara}&dates=${tanggalMulai}/${tanggalSelesai}`;
    btnCalendar.target = '_blank';
})();
