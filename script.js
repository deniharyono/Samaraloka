// 1. Bootstrapping Animasi AOS [cite: 70]
AOS.init({ duration: 1200, easing: 'ease-in-out-sine', once: true });

// 2. Pemrosesan Parameter URL (Nama Tamu Dinamis) [cite: 39]
const parameters = new URLSearchParams(window.location.search);
const namaPenerima = parameters.get('to');
const targetTeksNama = document.getElementById('nama-penerima');
const targetInputForm = document.getElementById('rsvp-nama');

if (namaPenerima) {
    const hasilDekode = decodeURIComponent(namaPenerima.replace(/\+/g, ' ')); // Proteksi sanitasi karakter [cite: 53]
    targetTeksNama.innerText = hasilDekode;
    targetInputForm.value = hasilDekode;
} else {
    targetTeksNama.innerText = "Tamu Undangan";
    targetInputForm.value = "Tamu Undangan";
    targetInputForm.removeAttribute('readonly');
}

// 3. Eksekusi Pembukaan Sampul & Kebijakan Bypass Audio Peramban [cite: 92, 94]
function bukaUndangan() {
    const audio = document.getElementById('audio-latar');
    const sekat = document.getElementById('sekat-sampul');
    
    // Penanganan pemutaran audio berbasis Promise gestur [cite: 94]
    audio.play().then(() => {
        console.log("Web Audio API context resumed successfully.");
    }).catch(galat => {
        console.log("Autoplay policy restriction triggered:", galat);
    });

    sekat.classList.add('hancur-ke-atas');
    document.body.classList.remove('body-no-scroll'); // Membuka sekat layar utama [cite: 116]

    // Pemicu Auto-Scroll Halus jika terdapat hash '#ucapan' dari platform tautan
    if (window.location.hash === '#ucapan') {
        setTimeout(() => {
            const elemenUcapan = document.getElementById('ucapan');
            if (elemenUcapan) {
                elemenUcapan.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 1200); 
    }
}

// 4. Perhitungan Matematika Presisi Countdown Timer (UNIX Timestamp Modulo) [cite: 141, 145]
function jalankanMundur(targetWaktu) {
    const target = new Date(targetWaktu).getTime();
    const elemenMundur = document.getElementById('timer-jawa');
    
    const interval = setInterval(() => {
        const sekarang = new Date().getTime();
        const selisih = target - sekarang;

        if (selisih < 0) {
            clearInterval(interval);
            elemenMundur.innerHTML = "<div style='color:var(--emas-bronze);font-weight:bold;'>Acara Pernikahan Sedang Berlangsung!</div>"; // [cite: 167]
            return;
        }

        // Operasi pembagian bilangan bulat (floor) dan modulo matematika [cite: 145]
        const d = Math.floor(selisih / (1000 * 60 * 60 * 24)); // [cite: 146]
        const h = Math.floor((selisih / (1000 * 60 * 60)) % 24); // [cite: 147]
        const m = Math.floor((selisih / (1000 * 60)) % 60); // [cite: 148]
        const s = Math.floor((selisih / 1000) % 60); // [cite: 149]

        elemenMundur.querySelector('.hari').innerText = String(d).padStart(2, '0');
        elemenMundur.querySelector('.jam').innerText = String(h).padStart(2, '0');
        elemenMundur.querySelector('.menit').innerText = String(m).padStart(2, '0');
        elemenMundur.querySelector('.detik').innerText = String(s).padStart(2, '0');
    }, 1000);
}
jalankanMundur('2026-12-12T09:00:00+07:00'); // Target eksekusi hitung mundur resmi [cite: 184]

// 5. Logika Kondisional Input Jumlah Hadir (Sesuai Hasil Analisa Berkas) [cite: 912]
const selectKonfirmasi = document.getElementById('form-konfirmasi');
const groupJumlahHadir = document.getElementById('group-jumlah-hadir');
const inputJumlahHadir = document.getElementById('form-field-jumlah-hadir');

selectKonfirmasi.addEventListener('change', function() {
    if (this.value === 'Hadir') {
        groupJumlahHadir.classList.add('is-visible');
        inputJumlahHadir.disabled = false; // [cite: 931]
        inputJumlahHadir.required = true; // [cite: 932]
    } else {
        groupJumlahHadir.classList.remove('is-visible');
        inputJumlahHadir.disabled = true; // [cite: 939]
        inputJumlahHadir.required = false; // [cite: 940]
        inputJumlahHadir.value = ''; // Mengosongkan kembali nilai [cite: 940]
    }
});

// 6. Integrasi Pembuatan Tombol Add To Calendar Secara Otomatis
(function() {
    const btnCalendar = document.getElementById('add-to-calendar');
    if (!btnCalendar) return;

    const titleAcara = encodeURIComponent("Pawiwahan Agung Arif & Kayla");
    const tanggalMulai = "20261212T090000Z"; 
    const tanggalSelesai = "20261212T130000Z"; 

    btnCalendar.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${titleAcara}&dates=${tanggalMulai}/${tanggalSelesai}`;
    btnCalendar.target = '_blank';
})();

// 7. AJAX Fetch Pengiriman Form RSVP ke Backend Google Sheets Nirbiaya [cite: 187, 260]
const formRsvp = document.getElementById('form-rsvp-jawa');
const statusKirim = document.getElementById('status-kirim');
const SCRIPT_URL = 'GANTI_DENGAN_URL_WEB_APP_APPS_SCRIPT_ANDA'; // ← Tempel URL Web App dari Google Sheets Anda di sini!

formRsvp.addEventListener('submit', function(e) {
    e.preventDefault();
    statusKirim.innerText = "Sedang mengirim konfirmasi...";
    statusKirim.style.color = "var(--emas-bronze)";

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: new URLSearchParams(new FormData(formRsvp))
    })
    .then(res => res.json())
    .then(data => {
        if(data.result === 'success') {
            statusKirim.innerText = "Matur Nuwun, konfirmasi RSVP kasimpen.";
            statusKirim.style.color = "green";
            formRsvp.reset();
            groupJumlahHadir.classList.remove('is-visible');
        } else {
            statusKirim.innerText = "Gagal: " + data.message;
            statusKirim.style.color = "red";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusKirim.innerText = "Terjadi gangguan jaringan database.";
        statusKirim.style.color = "red";
    });
});
