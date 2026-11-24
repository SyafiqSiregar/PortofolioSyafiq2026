/* ==========================================================================
   SPIDER-DEV — Interactive Portfolio Engine
   Stack  : GSAP 3.13 + ScrollTrigger + Lenis Smooth Scroll + Motion (Framer Motion DOM v12)
   Focus  :
   1. Flagship POS & Operational Apps showcased strictly at the top (Tier 01),
      followed by Enterprise, Web & UI/UX projects (Tier 02) + Searchable GitHub Index.
   2. Fast, non-blocking preloader + background blob upgrade for silky scrubbing.
   3. Motion spring physics for category filtering, tactile card/button gestures,
      inView counters, and accessible Project Architecture Modal.
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = matchMedia("(max-width: 768px) and (pointer: coarse)").matches;
const M = window.Motion || null;

const heroVideo = document.getElementById("heroVideo");
const allVideo  = document.getElementById("allVideo");

let globalLenis = null;

/* ==========================================================================
   1. CURATED PROJECTS DATA — POS APPS STRICTLY FIRST, THEN OTHER PROJECTS
   ========================================================================== */
const CURATED_PROJECTS = [
  /* -------------------- TIER 01: FLAGSHIP POS & KASIR APPS -------------------- */
  {
    id: "sembako-os",
    category: "pos",
    featured: true,
    badge: "POS UNGGULAN #01",
    year: "2026 · PWA Offline-First",
    title: "SembakoOS",
    subtitle: "Aplikasi Kasir (POS) & Manajemen Inventaris Toko Sembako",
    platforms: ["PWA Tablet & PC", "100% Offline-First", "IndexedDB (Dexie)"],
    desc: "Sistem kasir dan pengelolaan stok toko sembako fisik yang berjalan 100% lokal di tablet Android maupun PC kasir menggunakan IndexedDB tanpa ketergantungan koneksi internet.",
    metrics: [
      ["160", "Automated Tests"],
      ["6/6", "DB Invariants"],
      ["100%", "Offline-First"]
    ],
    stack: ["TypeScript 5", "React 18", "Dexie.js IndexedDB", "Vite", "PWA"],
    liveUrl: "https://sembako-os.vercel.app",
    liveLabel: "Buka Live POS",
    repoUrl: "https://github.com/SyafiqSiregar/Sembako",
    problem: "Toko sembako fisik membutuhkan transaksi kasir berkecepatan tinggi, pencatatan mutasi stok multi-satuan, serta pemantauan barang kedaluwarsa yang tetap akurat meskipun koneksi internet di lokasi sering tidak stabil.",
    architecture: "Dibangun dengan TypeScript 5 strict mode dan React 18 di atas penyimpanan lokal Dexie.js (IndexedDB). Seluruh integritas mutasi stok dan transaksi kasir dijaga oleh 6 invarian basis data dan diverifikasi melalui 160 pengujian otomatis pada 33 test suite.",
    features: [
      "Transaksi penjualan kasir instan dengan kalkulasi harga, stok, dan struk lokal tanpa latensi server.",
      "Manajemen mutasi stok, stok opname berkala, serta peringatan dini produk mendekati tanggal kedaluwarsa.",
      "Dashboard analitik omzet harian per jam, jumlah struk, proporsi nilai stok per kategori, dan estimasi laba kotor."
    ]
  },
  {
    id: "raya-koffie-pos",
    category: "pos",
    featured: true,
    badge: "POS UNGGULAN #02",
    year: "2026 · v2.1 Android APK",
    title: "POS Raya Koffie & 439 Carwash",
    subtitle: "Hybrid Android Tablet APK, Kasir Ganda & Buku Kas Laci",
    platforms: ["Android Tablet APK", "Capacitor 8", "Bluetooth ESC/POS"],
    desc: "Aplikasi Point of Sale, Buku Kas Laci, dan manajemen operasional hybrid berbasis tablet Android serta Web untuk operasional harian terpadu antara kedai kopi dan jasa cuci kendaraan.",
    metrics: [
      ["v2.1", "Rilis Produksi"],
      ["2 Bisnis", "F&B + Carwash"],
      ["ESC/POS", "Thermal Print"]
    ],
    stack: ["Capacitor 8", "Vite 8", "JavaScript", "shadcn/ui", "Web Bluetooth", "Native Print"],
    liveUrl: "https://tubes-impal-pos.vercel.app",
    liveLabel: "Coba Demo POS",
    repoUrl: "https://github.com/SyafiqSiregar/Rayya-Coffe",
    problem: "Operasional gabungan antara kedai kopi dan layanan cuci kendaraan membutuhkan satu tablet kasir terpadu yang sanggup mengelola antrean layanan berbeda, arus kas laci harian, dan pencetakan struk termal tanpa kendala jaringan.",
    architecture: "Menggunakan arsitektur hybrid Capacitor 8 + Vite 8 dengan komponen berstandar shadcn/ui dan penyimpanan 100% Offline-First. Terintegrasi langsung dengan printer termal Bluetooth melalui Web Bluetooth API dan plugin native Android ESC/POS.",
    features: [
      "Pencatatan pesanan terintegrasi untuk menu F&B Raya Koffie sekaligus paket layanan cuci kendaraan 439 Carwash.",
      "Modul Buku Kas Laci untuk memantau saldo awal, kas masuk/keluar, dan rekonsiliasi penutupan kasir.",
      "Pencetakan struk termal instan ukuran 58mm/80mm via koneksi Bluetooth di tablet Android maupun browser."
    ]
  },
  {
    id: "1966-caffe-pos",
    category: "pos",
    featured: false,
    badge: "POS UNGGULAN #03",
    year: "2026 · v2.0 F&B System",
    title: "1966 Caffe POS System",
    subtitle: "Sistem Kasir F&B, Shift Kehadiran Kru & Rekap Omzet",
    platforms: ["Web & Android PWA", "ESC/POS 58/80mm", "Shift & Absensi"],
    desc: "Sistem Point of Sale dan operasional F&B 100% Offline-First yang dirancang untuk efisiensi transaksi kasir, manajemen shift dan kehadiran karyawan, pencatatan pengeluaran, serta rekapitulasi omzet harian 1966 Caffe.",
    metrics: [
      ["58/80mm", "Bluetooth Print"],
      ["Shift", "Absensi Kru"],
      ["v2.0", "Offline-First"]
    ],
    stack: ["JavaScript", "Vite 8", "PWA", "ESC/POS Thermal", "LocalStorage DB"],
    liveUrl: "https://1966-pos-system.vercel.app",
    liveLabel: "Buka Live POS",
    repoUrl: "https://github.com/SyafiqSiregar/1966-POS-System",
    problem: "Kedai kopi dengan pergantian shift harian memerlukan aplikasi kasir yang tidak hanya mencatat pesanan pelanggan, tetapi juga menertibkan absensi shift, pengeluaran belanja harian, dan laporan tutup buku.",
    architecture: "Dirancang sebagai Progressive Web App (PWA) ringan berbasis Vite 8 yang siap dipasang pada tablet Android kasir, lengkap dengan protokol cetak langsung ESC/POS Bluetooth 58/80mm.",
    features: [
      "Antarmuka kasir F&B responsif untuk pemrosesan pesanan cepat di jam sibuk kedai kopi.",
      "Manajemen shift kerja, pencatatan kehadiran kru, serta log pengeluaran kas operasional harian.",
      "Rekapitulasi omzet harian terstruktur dan pencetakan struk Bluetooth kertas 58mm maupun 80mm."
    ]
  },
  {
    id: "retinacctv-pro-pos",
    category: "pos",
    featured: false,
    badge: "POS UNGGULAN #04",
    year: "2024–2026 · Production",
    title: "RetinaCCTV Pro System",
    subtitle: "Cloud-Serverless POS & Pelacakan Serial Number (SN)",
    platforms: ["Cloud POS", "Barcode Scanner", "SN Inventory"],
    desc: "Solusi perangkat lunak kustom yang menyatukan Manajemen Gudang (Back Office) dan Mesin Kasir (Front Office POS) untuk meminimalisir human error pelacakan Serial Number perangkat CCTV.",
    metrics: [
      ["100%", "Validasi SN Unik"],
      ["0%", "Duplikasi Aset"],
      ["PPN", "Faktur & Struk"]
    ],
    stack: ["Cloud Serverless", "Google Sheets DB", "Barcode Engine", "JavaScript", "Thermal Print"],
    liveUrl: null,
    liveLabel: null,
    repoUrl: "https://github.com/SyafiqSiregar/RetinaCCTV-Pro-System",
    problem: "Distribusi perangkat keras CCTV memiliki kode Serial Number (SN) unik per unit. Pencatatan manual kerap menimbulkan selisih stok antar gudang, duplikasi input, dan kendala klaim garansi pelanggan.",
    architecture: "Mengubah ekosistem Google Spreadsheet menjadi basis data relasional terpusat berarsitektur cloud-serverless, dihubungkan dengan antarmuka POS berbasis pemindai barcode serta validasi anti-duplikasi otomatis.",
    features: [
      "Input cepat via pemindai barcode dengan pengecekan otomatis untuk menolak nomor seri ganda.",
      "Integrasi penuh antara stok masuk gudang (Back Office) dan transaksi kasir penjualan (Front Office).",
      "Perhitungan PPN otomatis, pembagian hak akses peran kerja, serta pencetakan nota/struk termal."
    ]
  },
  {
    id: "tjap-naga-pos",
    category: "pos",
    featured: false,
    badge: "POS SYSTEM #05",
    year: "2026 · Android APK",
    title: "Tjap Naga POS",
    subtitle: "Aplikasi Kasir Android Native APK & Sinkronisasi Cloud",
    platforms: ["Tjap_Naga_POS.apk", "Capacitor Android", "Apps Script Sync"],
    desc: "Aplikasi kasir mobile/tablet yang dibundel langsung sebagai paket instalasi Android (APK) menggunakan Capacitor dan disinkronkan dengan backend Google Apps Script untuk operasional ritel.",
    metrics: [
      ["APK", "Build Android"],
      ["Kode.gs", "Cloud Sync"],
      ["Hybrid", "Capacitor Engine"]
    ],
    stack: ["Capacitor Android", "JavaScript", "Google Apps Script", "HTML5/CSS3"],
    liveUrl: null,
    liveLabel: null,
    repoUrl: "https://github.com/SyafiqSiregar/TjapNaga-1",
    problem: "Pelaku usaha membutuhkan aplikasi kasir berbentuk APK Android mandiri yang mudah dipasang pada perangkat kasir toko sekaligus tetap tersinkronisasi dengan rekap data pemilik.",
    architecture: "Dikemas menjadi aplikasi native Android menggunakan Capacitor dengan antarmuka kasir ringan di sisi klien dan konektor sinkronisasi Google Apps Script (Kode.gs) untuk penyimpanan awan.",
    features: [
      "Distribusi langsung dalam format paket Tjap_Naga_POS.apk untuk perangkat Android toko.",
      "Antarmuka pencatatan transaksi kasir yang ringan dan hemat sumber daya perangkat.",
      "Sinkronisasi data penjualan dan produk ke spreadsheet awan melalui layanan Google Apps Script."
    ]
  },
  {
    id: "hello-coffee-pos",
    category: "pos",
    featured: false,
    badge: "POS SYSTEM #06",
    year: "2026 · Web Kasir",
    title: "Hello Coffee POS & Admin",
    subtitle: "Kasir Kedai Kopi Multi-Pembayaran & Dashboard Penjualan",
    platforms: ["Web POS", "Dine-In & Take-Away", "Admin Panel"],
    desc: "Sistem kasir berbasis web untuk kedai kopi dengan otentikasi Kasir & Admin, manajemen nomor meja, perhitungan pajak 10% dan diskon otomatis, dukungan QRIS/Tunai/Transfer/Kartu, serta laporan penjualan.",
    metrics: [
      ["4 Metode", "Tunai s.d. QRIS"],
      ["2 Peran", "Kasir & Admin"],
      ["10% Tax", "Hitung Otomatis"]
    ],
    stack: ["JavaScript", "HTML5", "Responsive CSS3", "Receipt Print", "Sales Analytics"],
    liveUrl: "https://hello-coffee-kappa.vercel.app",
    liveLabel: "Buka Live POS",
    repoUrl: "https://github.com/SyafiqSiregar/Hello-Coffee",
    problem: "Kedai kopi skala berkembang membutuhkan pemisahan jelas antara layar transaksi kasir harian dan panel admin pengelola harga menu serta laporan riwayat transaksi.",
    architecture: "Dibangun dengan arsitektur modular Vanilla JavaScript tanpa ketergantungan berat sehingga dapat dibuka instan di desktop, tablet, maupun ponsel kasir.",
    features: [
      "Manajemen pesanan Dine-In (dengan nama pelanggan & nomor meja) maupun Take-Away.",
      "Kalkulator keranjang otomatis mencakup subtotal, pajak 10%, diskon, metode bayar (Tunai, QRIS, Transfer, Kartu), dan kembalian.",
      "Panel Admin khusus untuk CRUD katalog menu, statistik penjualan, dan cetak struk transaksi."
    ]
  },

  /* -------------------- TIER 02: ENTERPRISE, WEB & UI/UX -------------------- */
  {
    id: "loyalty-card-umkm",
    category: "enterprise",
    featured: false,
    badge: "ENTERPRISE UMKM",
    year: "2026 · PWA Security",
    title: "Digital Loyalty Card UMKM",
    subtitle: "Kartu Stamp 3D Interaktif & QR Dinamis Anti-Screenshot",
    platforms: ["TypeScript PWA", "Dynamic QR Token", "Merchant Dashboard"],
    desc: "Aplikasi web (PWA) kartu loyalti pelanggan digital untuk UMKM dengan kartu stamp 3D yang bisa dibalik, token QR dinamis anti-screenshot, pemindaian kasir, voucher reward, dan dashboard pemilik.",
    metrics: [
      ["3D Card", "Flip Interaktif"],
      ["Anti-Fraud", "QR Dinamis"],
      ["RLS", "Skema Terproteksi"]
    ],
    stack: ["TypeScript", "PWA", "SQL & RLS", "Token Auth", "3D CSS Motion"],
    liveUrl: null,
    liveLabel: null,
    repoUrl: "https://github.com/SyafiqSiregar/Loyalty-Card-Web-UMKM",
    problem: "Kartu stempel kertas mudah hilang atau dipalsukan, sedangkan QR statis pada aplikasi sederhana rentan disalahgunakan lewat tangkapan layar (screenshot).",
    architecture: "Merancang arsitektur PWA lengkap mulai dari PRD, skema SQL dengan Row-Level Security (RLS), kontrak endpoint token dinamis berbatas waktu, hingga spesifikasi desain kartu 3D.",
    features: [
      "Kartu stempel digital 3D interaktif yang dapat dibalik pelanggan untuk melihat progres reward.",
      "Mekanisme QR dinamis anti-screenshot yang diverifikasi langsung saat pemindaian oleh kasir.",
      "Manajemen penukaran voucher reward dan ringkasan retensi pelanggan pada dashboard pemilik usaha."
    ]
  },
  {
    id: "progres-app-retina-v2",
    category: "enterprise",
    featured: false,
    badge: "ENTERPRISE OPS",
    year: "2026 · v2.0 Hybrid",
    title: "Progres APP Retina V2",
    subtitle: "Aplikasi Pelaporan Operasional & Generator Laporan CCTV",
    platforms: ["Desktop & Android", "React + Tailwind", "Capacitor"],
    desc: "Aplikasi pelaporan terintegrasi untuk perangkat Desktop dan Android yang mempercepat pencatatan progres pekerjaan lapangan serta pembuatan dokumen laporan proyek instalasi CCTV secara otomatis.",
    metrics: [
      ["v2.0", "Multi-Platform"],
      ["Instan", "Generator Laporan"],
      ["Hybrid", "Android & Web"]
    ],
    stack: ["React", "Vite", "Tailwind CSS", "Capacitor", "Android"],
    liveUrl: null,
    liveLabel: null,
    repoUrl: "https://github.com/SyafiqSiregar/Progres-APP-Retina-V2",
    problem: "Penyusunan laporan dokumentasi pengerjaan lapangan dan instalasi CCTV secara manual memakan banyak waktu teknisi serta menghasilkan format dokumen yang tidak seragam.",
    architecture: "Dikembangkan menggunakan React, Vite, dan Tailwind CSS untuk kecepatan penyusunan data, lalu dibungkus dengan Capacitor agar berjalan mulus di perangkat Android teknisi lapangan maupun desktop kantor.",
    features: [
      "Formulir dinamis untuk dokumentasi tahapan instalasi dan pemeliharaan sistem CCTV.",
      "Generator laporan otomatis yang merapikan data teknis dan dokumentasi ke format siap kirim.",
      "Antarmuka responsif yang nyaman dioperasikan langsung dari ponsel/tablet Android di lokasi proyek."
    ]
  },
  {
    id: "swms-warehouse",
    category: "enterprise",
    featured: false,
    badge: "WAREHOUSE SYSTEM",
    year: "2026 · Java Web",
    title: "SWMS Warehouse Management",
    subtitle: "Sistem Pergudangan Java JSP/Servlet & Ekspor PDF/Excel",
    platforms: ["Java Servlet/JSP", "MySQL Database", "PDF & Excel Export"],
    desc: "Smart Warehouse Management System berbasis Java Web untuk mengelola arus barang masuk, barang keluar, direktori pemasok, kategori stok, grafik analitik, serta ekspor laporan resmi ke PDF dan Excel.",
    metrics: [
      ["MySQL", "Basis Data"],
      ["iTextPDF", "Cetak Laporan"],
      ["Apache POI", "Ekspor Excel"]
    ],
    stack: ["Java 8+", "JSP & Servlet", "MySQL", "Bootstrap 5", "Chart.js", "iTextPDF", "Apache POI"],
    liveUrl: null,
    liveLabel: null,
    repoUrl: "https://github.com/SyafiqSiregar/GUDANG-TUBES-PBO",
    problem: "Pengelolaan keluar-masuk stok gudang dan pencatatan supplier membutuhkan sistem terstruktur berbasis peran dengan kemampuan ekspor dokumen audit ke format PDF dan spreadsheet Excel.",
    architecture: "Menggunakan arsitektur MVC berbasis Java Servlet & JSP dengan basis data relasional MySQL, visualisasi Chart.js, serta pustaka iTextPDF dan Apache POI di sisi server.",
    features: [
      "Pencatatan terstruktur untuk transaksi barang masuk, barang keluar, kategori produk, dan data supplier.",
      "Dashboard grafik ringkasan inventaris menggunakan Chart.js.",
      "Pembuatan laporan resmi gudang sekali klik dalam format dokumen PDF maupun lembar kerja Excel."
    ]
  },
  {
    id: "retina-ecommerce",
    category: "web",
    featured: false,
    badge: "WEB & E-COMMERCE",
    year: "2026 · Vue 3 Live",
    title: "Retina Security E-Commerce",
    subtitle: "Katalog CCTV Real-Time Inventory & WhatsApp Checkout",
    platforms: ["Vue 3 + Vite", "Real-Time Sheets Sync", "WA Quotation"],
    desc: "Website e-commerce dan showcase resmi solusi keamanan CCTV yang terhubung langsung ke Google Sheets untuk sinkronisasi harga dan stok secara real-time serta pemesanan langsung ke WhatsApp.",
    metrics: [
      ["Real-Time", "Sinkronisasi Stok"],
      ["Vue 3", "Composition API"],
      ["Direct", "WA Checkout"]
    ],
    stack: ["Vue.js 3", "Vite", "Google Sheets API", "Custom CSS System", "WhatsApp API"],
    liveUrl: "https://e-commerce-retina-beta.vercel.app",
    liveLabel: "Buka E-Commerce",
    repoUrl: "https://github.com/SyafiqSiregar/E-commerce-Retina-BETA",
    problem: "Klien korporat maupun residensial memerlukan katalog harga paket kamera keamanan yang selalu mutakhir mengikuti stok gudang dan mudah dikonsultasikan tanpa proses registrasi panjang.",
    architecture: "Dibangun dengan Vue 3 (Composition API) dan Vite menggunakan pipeline pembacaan data langsung dari Google Sheets sehingga perubahan stok/harga oleh tim admin langsung tampil di situs.",
    features: [
      "Sinkronisasi katalog produk, spesifikasi, dan harga real-time dari Google Sheets.",
      "Penyaringan produk dinamis berdasarkan kategori perangkat keamanan.",
      "Keranjang konsultasi dengan pengiriman rincian pesanan otomatis ke WhatsApp Business."
    ]
  },
  {
    id: "tour-travel-platform",
    category: "web",
    featured: false,
    badge: "NEXT.JS & DIGITAL MENU",
    year: "2026 · Live Web",
    title: "Tour & Travel + Hello Menu",
    subtitle: "Platform Wisata Next.js & Katalog Menu Digital Mobile-First",
    platforms: ["Next.js + TypeScript", "Interactive Menu", "Vercel Edge"],
    desc: "Eksplorasi platform layanan perjalanan wisata berbasis Next.js & TypeScript berdampingan dengan website menu digital premium untuk pemesanan cepat pelanggan kafe dari perangkat mobile.",
    metrics: [
      ["Next.js", "Modern Web"],
      ["TypeScript", "Type-Safe"],
      ["Mobile", "UX Responsif"]
    ],
    stack: ["Next.js", "TypeScript", "React", "JavaScript", "Responsive CSS"],
    liveUrl: "https://tour-travel-bay.vercel.app",
    liveLabel: "Buka Tour Web",
    repoUrl: "https://github.com/SyafiqSiregar/TOUR-TRAVEL",
    problem: "Bisnis jasa perjalanan dan kuliner membutuhkan halaman penjelajahan paket/menu yang terbuka sangat cepat di jaringan seluler pelanggan dengan hierarki visual yang bersih.",
    architecture: "Memanfaatkan Next.js App Router dengan TypeScript untuk halaman layanan wisata serta struktur data ringan teroptimasi mobile untuk katalog menu digital kafe.",
    features: [
      "Penyajian paket perjalanan wisata modern yang teroptimasi untuk kecepatan muat halaman.",
      "Ekosistem pendamping Hello Coffee Digital Menu (hello-website-menu.vercel.app) untuk meja pelanggan.",
      "Tata letak adaptif dari layar ponsel kecil hingga monitor desktop."
    ]
  },
  {
    id: "bantuin-motionlab",
    category: "web",
    featured: false,
    badge: "UI/UX & LAB RESEARCH",
    year: "2024–2026 · Telkom Univ",
    title: "Bantuin UI/UX & Riset Motion Lab",
    subtitle: "Atomic Design System Figma & Rekayasa Jaringan Konkuren",
    platforms: ["Figma Design System", "Java & Go", "Wireshark Analysis"],
    desc: "Perancangan sistem desain atomik aplikasi mobile gotong-royong Bantuin di Figma serta riset algoritma pemrosesan aliran konkuren dan analisis paket keamanan jaringan di Motion Laboratory Telkom University.",
    metrics: [
      ["40+", "Komponen Figma"],
      ["92%", "Usability Score"],
      ["Go & Java", "Riset Lab"]
    ],
    stack: ["Figma UI/UX", "Atomic Tokens", "Java", "Go (Golang)", "Wireshark", "Clean Architecture"],
    liveUrl: null,
    liveLabel: null,
    repoUrl: "https://github.com/SyafiqSiregar",
    problem: "Menggabungkan kepekaan desain antarmuka inklusif lintas usia dengan ketangguhan rekayasa perangkat lunak tingkat rendah pada sistem berbeban konkuren tinggi.",
    architecture: "Sisi desain menggunakan arsitektur Atomic Design Tokens & Auto-Layout di Figma; sisi rekayasa sistem menerapkan prinsip SOLID pada pipeline Java & Go serta bedah paket menggunakan Wireshark.",
    features: [
      "40+ komponen atomik Figma berstandar kontras aksesibilitas tinggi dengan alur permintaan bantuan <3 ketukan.",
      "Eksperimen pemrosesan konkuren berlatensi rendah menggunakan bahasa Go dan Java di Motion Lab.",
      "Analisis integritas paket jaringan dan deteksi anomali transmisi menggunakan Wireshark."
    ]
  }
];

/* ==========================================================================
   2. ACT II VIDEO FREEZE-FRAME TIMELINE MAP
   ========================================================================== */
const SEGMENTS = [
  { p: [0.00, 0.13], t: [1.00, 4.30] },
  { p: [0.13, 0.32], t: [4.30, 4.30], panel: 0 }, // Freeze 01: SembakoOS POS
  { p: [0.32, 0.46], t: [4.30, 8.20] },
  { p: [0.46, 0.65], t: [8.20, 8.20], panel: 1 }, // Freeze 02: Raya & 1966 POS Suite
  { p: [0.65, 0.78], t: [8.20, 12.0] },
  { p: [0.78, 0.95], t: [12.0, 12.0], panel: 2 }, // Freeze 03: Engineering Stack
  { p: [0.95, 1.00], t: [12.0, 14.95] }
];

function videoTimeAt(progress) {
  for (const s of SEGMENTS) {
    if (progress <= s.p[1] || s === SEGMENTS[SEGMENTS.length - 1]) {
      const span = s.p[1] - s.p[0];
      const local = span === 0 ? 0 : gsap.utils.clamp(0, 1, (progress - s.p[0]) / span);
      return s.t[0] + (s.t[1] - s.t[0]) * local;
    }
  }
  return SEGMENTS[SEGMENTS.length - 1].t[1];
}

/* ==========================================================================
   3. VIDEO SCRUBBER — Pauses decoding automatically when stage is offscreen
   ========================================================================== */
class Scrubber {
  constructor(video, stageEl, smooth = 0.16) {
    this.video = video;
    this.target = 0;
    this.current = 0;
    this.smooth = smooth;
    this.ready = video.readyState >= 1;
    this.visible = true;

    const markReady = () => { this.ready = true; };
    video.addEventListener("loadedmetadata", markReady, { once: true });
    video.addEventListener("canplay", markReady, { once: true });

    if (stageEl && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => { this.visible = entries[0]?.isIntersecting ?? true; },
        { rootMargin: "250px 0px" }
      );
      io.observe(stageEl);
    }

    gsap.ticker.add(() => this.tick());
  }

  set(t) {
    this.target = t;
  }

  tick() {
    if (!this.visible) return;
    if (!this.ready) {
      if (this.video.readyState >= 1) this.ready = true;
      else return;
    }
    this.current += (this.target - this.current) * this.smooth;
    if (Math.abs(this.video.currentTime - this.current) > 0.014) {
      try {
        this.video.currentTime = this.current;
      } catch (_) {
        // Ignore transient DOMException before seekable ranges populate
      }
    }
  }
}

/* ==========================================================================
   4. SPLIT TEXT FOR SHORT DISPLAY HEADLINES
   ========================================================================== */
if (!prefersReduced) {
  document.querySelectorAll("[data-split]").forEach((el) => {
    const frag = document.createDocumentFragment();
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        [...node.textContent].forEach((ch) => {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch === " " ? "\u00A0" : ch;
          frag.appendChild(span);
        });
      } else {
        frag.appendChild(node.cloneNode(true));
      }
    });
    el.textContent = "";
    el.appendChild(frag);
  });
}

/* ==========================================================================
   5. RENDER CURATED SHOWCASE + MOTION SPRING FILTER + MODAL
   ========================================================================== */
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function createProjectCardHtml(proj, displayIndex) {
  const isPos = proj.category === "pos";
  const classes = [
    "pcard",
    isPos ? "pcard--pos" : "",
    proj.featured ? "pcard--featured" : ""
  ].filter(Boolean).join(" ");

  const idxStr = String(displayIndex).padStart(2, "0");

  return `
    <article class="${classes}" data-project-id="${escapeHtml(proj.id)}" data-category="${escapeHtml(proj.category)}">
      <div class="pcard__inner">
        <div class="pcard__top">
          <span class="pcard__badge">
            ${isPos ? '<svg aria-hidden="true"><use href="#icon-pos"/></svg>' : ""}
            <span>${escapeHtml(proj.badge)}</span>
          </span>
          <span class="pcard__year">${escapeHtml(proj.year)}</span>
        </div>

        <div class="pcard__head">
          <span class="pcard__idx">${idxStr}</span>
          <div>
            <h4 class="pcard__title">${escapeHtml(proj.title)}</h4>
            <span class="pcard__subtitle">${escapeHtml(proj.subtitle)}</span>
          </div>
        </div>

        <div class="pcard__platforms">
          ${proj.platforms.map((pl) => `<span class="pcard__plat">${escapeHtml(pl)}</span>`).join("")}
        </div>

        <p class="pcard__desc">${escapeHtml(proj.desc)}</p>

        <div class="pcard__metrics">
          ${proj.metrics.map(([val, lbl]) => `
            <div class="pmetric">
              <strong>${escapeHtml(val)}</strong>
              <span>${escapeHtml(lbl)}</span>
            </div>
          `).join("")}
        </div>

        <div class="pcard__stack">
          ${proj.stack.map((tech) => `<span>${escapeHtml(tech)}</span>`).join("")}
        </div>

        <div class="pcard__footer">
          <div class="pcard__btns">
            ${proj.liveUrl ? `
              <a class="pbtn pbtn--primary" href="${escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener noreferrer">
                <span>${escapeHtml(proj.liveLabel || "Live Demo")}</span>
                <svg aria-hidden="true"><use href="#icon-external"/></svg>
              </a>
            ` : ""}
            <a class="pbtn" href="${escapeHtml(proj.repoUrl)}" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true"><use href="#icon-github"/></svg>
              <span>Kode Sumber</span>
            </a>
          </div>
          <button type="button" class="pbtn pbtn--detail" data-open-modal="${escapeHtml(proj.id)}">
            <span>Detail Arsitektur</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function attachCardInteractions(container) {
  const cards = container.querySelectorAll(".pcard");

  cards.forEach((card) => {
    // Subtle radial spotlight tracking mouse coordinates
    if (!isMobile) {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
        card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
      });
    }

    // Framer Motion hover spring elevation
    if (M && !isMobile && !prefersReduced) {
      M.hover(card, () => {
        M.animate(card, { y: -5 }, { type: "spring", stiffness: 380, damping: 26 });
        return () => {
          M.animate(card, { y: 0 }, { type: "spring", stiffness: 360, damping: 28 });
        };
      });
    }
  });

  // Tactile press feedback on buttons inside cards
  if (M && !prefersReduced) {
    container.querySelectorAll(".pbtn").forEach((btn) => {
      M.press(btn, () => {
        M.animate(btn, { scale: 0.96 }, { duration: 0.1 });
        return () => {
          M.animate(btn, { scale: 1 }, { type: "spring", stiffness: 450, damping: 24 });
        };
      });
    });
  }
}

function renderCuratedProjects(activeFilter = "all", animateWithMotion = false) {
  const root = document.getElementById("curatedProjectsRoot");
  const statusEl = document.getElementById("filterStatus");
  if (!root) return;

  const posProjects = CURATED_PROJECTS.filter((p) => p.category === "pos");
  const otherProjects = CURATED_PROJECTS.filter((p) => p.category !== "pos");

  let html = "";
  let shownCount = 0;

  if (activeFilter === "all") {
    shownCount = CURATED_PROJECTS.length;
    html = `
      <div class="tier-block">
        <div class="tier-header tier-header--pos">
          <div>
            <span class="tier-header__eyebrow">
              <svg aria-hidden="true"><use href="#icon-pos"/></svg>
              <span>PRIORITAS UTAMA · 6 APLIKASI KASIR &amp; POS</span>
            </span>
            <h3 class="tier-header__title">Ekosistem Point of Sale (Android APK, PWA &amp; Cloud)</h3>
          </div>
          <p class="tier-header__sub">
            Aplikasi kasir dan inventaris siap operasional dengan arsitektur Offline-First, cetak struk Bluetooth ESC/POS, dan pelacakan barcode.
          </p>
        </div>
        <div class="projects-grid">
          ${posProjects.map((p, idx) => createProjectCardHtml(p, idx + 1)).join("")}
        </div>
      </div>

      <div class="tier-block">
        <div class="tier-header tier-header--other">
          <div>
            <span class="tier-header__eyebrow">
              <svg aria-hidden="true"><use href="#icon-layers"/></svg>
              <span>PROJEK UNGGULAN LAINNYA · ENTERPRISE, WEB &amp; UI/UX</span>
            </span>
            <h3 class="tier-header__title">Sistem Operasional, E-Commerce &amp; Desain Produk</h3>
          </div>
          <p class="tier-header__sub">
            Platform loyalitas UMKM, pelaporan lapangan lintas perangkat, manajemen gudang Java, hingga riset sistem &amp; UI/UX.
          </p>
        </div>
        <div class="projects-grid">
          ${otherProjects.map((p, idx) => createProjectCardHtml(p, posProjects.length + idx + 1)).join("")}
        </div>
      </div>
    `;
  } else {
    const filtered = CURATED_PROJECTS.filter((p) => p.category === activeFilter);
    shownCount = filtered.length;
    const labels = {
      pos: ["PRIORITAS UTAMA · APLIKASI POS & KASIR", "Ekosistem Point of Sale & Inventaris"],
      enterprise: ["SISTEM OPERASIONAL & BACKEND", "Aplikasi Enterprise, Gudang & Loyalitas UMKM"],
      web: ["PLATFORM WEB & DESAIN PRODUK", "E-Commerce Real-Time, Next.js & Sistem UI/UX"]
    };
    const [eyebrow, heading] = labels[activeFilter] || ["DAFTAR PROJEK", "Projek Terpilih"];

    html = `
      <div class="tier-block">
        <div class="tier-header ${activeFilter === "pos" ? "tier-header--pos" : "tier-header--other"}">
          <div>
            <span class="tier-header__eyebrow"><span>${escapeHtml(eyebrow)}</span></span>
            <h3 class="tier-header__title">${escapeHtml(heading)}</h3>
          </div>
        </div>
        <div class="projects-grid">
          ${filtered.map((p, idx) => createProjectCardHtml(p, idx + 1)).join("")}
        </div>
      </div>
    `;
  }

  root.innerHTML = html;

  if (statusEl) {
    const labelMap = {
      all: `Menampilkan ${shownCount} projek unggulan · Aplikasi POS ditempatkan paling atas`,
      pos: `Menampilkan ${shownCount} Aplikasi POS & Kasir (Android APK, PWA Offline-First, Cloud)`,
      enterprise: `Menampilkan ${shownCount} Sistem Enterprise, Gudang & Operasional`,
      web: `Menampilkan ${shownCount} Platform Web, E-Commerce & Riset UI/UX`
    };
    statusEl.textContent = labelMap[activeFilter] || `Menampilkan ${shownCount} projek`;
  }

  attachCardInteractions(root);

  if (animateWithMotion && M && !prefersReduced) {
    const newCards = root.querySelectorAll(".pcard");
    M.animate(
      newCards,
      { opacity: [0, 1], y: [22, 0], scale: [0.98, 1] },
      {
        delay: M.stagger(0.045),
        type: "spring",
        stiffness: 340,
        damping: 28
      }
    );
  }

  if (typeof ScrollTrigger !== "undefined") {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}

function initProjectShowcase() {
  // Update tab counts dynamically
  const counts = {
    all: CURATED_PROJECTS.length,
    pos: CURATED_PROJECTS.filter((p) => p.category === "pos").length,
    enterprise: CURATED_PROJECTS.filter((p) => p.category === "enterprise").length,
    web: CURATED_PROJECTS.filter((p) => p.category === "web").length
  };
  Object.entries(counts).forEach(([key, val]) => {
    const el = document.querySelector(`[data-count-for="${key}"]`);
    if (el) el.textContent = String(val);
  });

  renderCuratedProjects("all", false);

  // Filter tab clicks
  const tabsWrap = document.getElementById("projectFilters");
  if (tabsWrap) {
    const tabs = tabsWrap.querySelectorAll(".filter-tab");
    tabs.forEach((tab) => {
      if (M && !prefersReduced) {
        M.press(tab, () => {
          M.animate(tab, { scale: 0.96 }, { duration: 0.09 });
          return () => M.animate(tab, { scale: 1 }, { type: "spring", stiffness: 440, damping: 24 });
        });
      }

      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter || "all";
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        renderCuratedProjects(filter, true);
      });
    });
  }

  // Event delegation for Architecture Detail Modal
  const root = document.getElementById("curatedProjectsRoot");
  if (root) {
    root.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-open-modal]");
      if (!trigger) return;
      const projId = trigger.getAttribute("data-open-modal");
      const proj = CURATED_PROJECTS.find((p) => p.id === projId);
      if (proj) openProjectModal(proj, trigger);
    });
  }
}

/* ==========================================================================
   6. INTERACTIVE PROJECT ARCHITECTURE MODAL (Motion Spring + Keyboard A11y)
   ========================================================================== */
let lastModalTrigger = null;

function openProjectModal(proj, triggerEl) {
  const modal = document.getElementById("projectModal");
  const dialog = document.getElementById("pmodalDialog");
  const backdrop = document.getElementById("pmodalBackdrop");
  const badge = document.getElementById("pmodalBadge");
  const content = document.getElementById("pmodalContent");
  const closeBtn = document.getElementById("pmodalClose");

  if (!modal || !dialog || !content) return;

  lastModalTrigger = triggerEl || document.activeElement;
  if (badge) badge.textContent = `${proj.badge} · ${proj.year}`;

  content.innerHTML = `
    <h3 class="pmodal__title" id="pmodalTitle">${escapeHtml(proj.title)}</h3>
    <p class="pmodal__sub">${escapeHtml(proj.subtitle)}</p>

    <div class="pcard__platforms" style="margin-bottom: 1.4rem;">
      ${proj.platforms.map((pl) => `<span class="pcard__plat">${escapeHtml(pl)}</span>`).join("")}
    </div>

    <div class="pmodal__sec">
      <h4>Tantangan Operasional</h4>
      <p>${escapeHtml(proj.problem)}</p>
    </div>

    <div class="pmodal__sec">
      <h4>Arsitektur Teknis</h4>
      <p>${escapeHtml(proj.architecture)}</p>
    </div>

    <div class="pmodal__sec">
      <h4>Kapabilitas Utama</h4>
      <ul class="pmodal__features">
        ${proj.features.map((f) => `
          <li>
            <svg aria-hidden="true"><use href="#icon-check"/></svg>
            <span>${escapeHtml(f)}</span>
          </li>
        `).join("")}
      </ul>
    </div>

    <div class="pmodal__sec">
      <h4>Teknologi &amp; Stack</h4>
      <div class="pcard__stack">
        ${proj.stack.map((s) => `<span>${escapeHtml(s)}</span>`).join("")}
      </div>
    </div>

    <div class="pmodal__actions">
      ${proj.liveUrl ? `
        <a class="pbtn pbtn--primary" href="${escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener noreferrer">
          <span>${escapeHtml(proj.liveLabel || "Buka Live Demo")}</span>
          <svg aria-hidden="true"><use href="#icon-external"/></svg>
        </a>
      ` : ""}
      <a class="pbtn" href="${escapeHtml(proj.repoUrl)}" target="_blank" rel="noopener noreferrer">
        <svg aria-hidden="true"><use href="#icon-github"/></svg>
        <span>Lihat Repositori GitHub</span>
      </a>
    </div>
  `;

  dialog.setAttribute("data-lenis-prevent", "");
  modal.hidden = false;
  document.body.classList.add("modal-open");
  if (globalLenis) globalLenis.stop();

  if (M && !prefersReduced) {
    M.animate(backdrop, { opacity: [0, 1] }, { duration: 0.22 });
    M.animate(
      dialog,
      { opacity: [0, 1], scale: [0.94, 1], y: [20, 0] },
      { type: "spring", stiffness: 380, damping: 30 }
    );
  }

  requestAnimationFrame(() => closeBtn?.focus());
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  const dialog = document.getElementById("pmodalDialog");
  const backdrop = document.getElementById("pmodalBackdrop");
  if (!modal || modal.hidden) return;

  const finish = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (globalLenis) globalLenis.start();
    if (lastModalTrigger && typeof lastModalTrigger.focus === "function") {
      lastModalTrigger.focus();
    }
  };

  if (M && !prefersReduced && dialog && backdrop) {
    M.animate(backdrop, { opacity: [1, 0] }, { duration: 0.16 });
    M.animate(dialog, { opacity: [1, 0], scale: [1, 0.96], y: [0, 10] }, { duration: 0.16 }).then(finish);
  } else {
    finish();
  }
}

function initModalListeners() {
  const closeBtn = document.getElementById("pmodalClose");
  const backdrop = document.getElementById("pmodalBackdrop");

  closeBtn?.addEventListener("click", closeProjectModal);
  backdrop?.addEventListener("click", closeProjectModal);

  document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("projectModal");
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeProjectModal();
    }
  });
}

/* ==========================================================================
   7. GITHUB REPOSITORY ARCHIVE EXPLORER (Sorted POS-First + Live Search)
   ========================================================================== */
const GITHUB_FALLBACK = [
  ["Sembako", "TypeScript", "2026", "https://sembako-os.vercel.app"],
  ["Rayya-Coffe", "JavaScript", "2026"],
  ["1966-POS-System", "JavaScript", "2026", "https://1966-pos-system.vercel.app"],
  ["RetinaCCTV-Pro-System", "JavaScript", "2026"],
  ["TjapNaga-1", "JavaScript", "2026"],
  ["Hello-Coffee", "JavaScript", "2026", "https://hello-coffee-kappa.vercel.app"],
  ["Tubes-Impal-POS", "JavaScript", "2026", "https://tubes-impal-pos.vercel.app"],
  ["Loyalty-Card-Web-UMKM", "TypeScript", "2026"],
  ["Progres-APP-Retina-V2", "JavaScript", "2026"],
  ["E-commerce-Retina-BETA", "Vue", "2026", "https://e-commerce-retina-beta.vercel.app"],
  ["pembaruan-retina", "Vue", "2026", "https://pembaruan-retina.vercel.app"],
  ["GUDANG-TUBES-PBO", "Java", "2026"],
  ["TOUR-TRAVEL", "TypeScript", "2026", "https://tour-travel-bay.vercel.app"],
  ["HELLO-WEBSITE-MENU", "JavaScript", "2026", "https://hello-website-menu.vercel.app"],
  ["Tubes-PBO-manajemen-Gudang", "Java", "2026"],
  ["Tubes-1-aplikasi-manajemen-kebutuhan-rumah-tangga", "Go", "2025"],
  ["Contoh-website-film", "HTML", "2026", "https://contoh-website-film.vercel.app"],
  ["PortofolioSyafiqSiregar", "JavaScript", "2026", "https://portofolio-syafiq-siregar.vercel.app"],
  ["Porto-Serius", "JavaScript", "2026", "https://porto-serius.vercel.app"],
  ["SyafiqSiregarPortofolio", "JavaScript", "2026"],
  ["Code-tubes-1", "Go", "2025"],
  ["Selamat-Ulang-Tahun", "CSS", "2026", "https://zaskya-amelia.vercel.app"],
  ["foto-kita-blur", "Web", "2026"],
  ["Portofolio", "HTML", "2026"],
  ["portofolio.html", "HTML", "2026", "https://portofoliohtml-green.vercel.app"],
  ["index.html", "HTML", "2026", "https://index-html-ten-rust.vercel.app"],
  ["blank-screen", "HTML", "2026"],
  ["syafiq", "Config", "2025"]
];

const POS_REPO_PRIORITY = [
  "Sembako",
  "Rayya-Coffe",
  "1966-POS-System",
  "RetinaCCTV-Pro-System",
  "TjapNaga-1",
  "Hello-Coffee",
  "Tubes-Impal-POS"
];

const FEATURED_REPO_PRIORITY = [
  "Loyalty-Card-Web-UMKM",
  "Progres-APP-Retina-V2",
  "E-commerce-Retina-BETA",
  "GUDANG-TUBES-PBO",
  "TOUR-TRAVEL",
  "HELLO-WEBSITE-MENU",
  "pembaruan-retina",
  "Tubes-PBO-manajemen-Gudang",
  "Tubes-1-aplikasi-manajemen-kebutuhan-rumah-tangga"
];

const LOW_PRIORITY_REPOS = new Set([
  "blank-screen",
  "index.html",
  "syafiq",
  "foto-kita-blur",
  "Portofolio",
  "portofolio.html"
]);

function getRepoScore(repoName) {
  const posIdx = POS_REPO_PRIORITY.findIndex((n) => n.toLowerCase() === repoName.toLowerCase());
  if (posIdx !== -1) return 1000 - posIdx * 10;

  if (/pos|kasir|sembako/i.test(repoName)) return 850;

  const featIdx = FEATURED_REPO_PRIORITY.findIndex((n) => n.toLowerCase() === repoName.toLowerCase());
  if (featIdx !== -1) return 700 - featIdx * 10;

  if (LOW_PRIORITY_REPOS.has(repoName)) return 10;
  return 300;
}

function isPosRepo(repoName) {
  return POS_REPO_PRIORITY.some((n) => n.toLowerCase() === repoName.toLowerCase()) ||
    /pos|kasir|sembako/i.test(repoName);
}

function formatRepoName(name) {
  const customTitles = {
    "Sembako": "SembakoOS (Grocery POS & Inventory)",
    "Rayya-Coffe": "POS Raya Koffie & 439 Carwash",
    "1966-POS-System": "1966 Caffe POS System",
    "RetinaCCTV-Pro-System": "RetinaCCTV Pro (Cloud POS & SN)",
    "TjapNaga-1": "Tjap Naga POS (Android APK)",
    "Hello-Coffee": "Hello Coffee POS System",
    "Tubes-Impal-POS": "Raya Koffie POS (Web Demo)",
    "Loyalty-Card-Web-UMKM": "Digital Loyalty Card UMKM",
    "Progres-APP-Retina-V2": "Progres APP Retina V2",
    "E-commerce-Retina-BETA": "Retina Security E-Commerce",
    "GUDANG-TUBES-PBO": "SWMS Warehouse Management (Java)"
  };
  if (customTitles[name]) return customTitles[name];
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\bpos\b/gi, "POS")
    .replace(/\bhtml\b/gi, "HTML")
    .replace(/\bui\b/gi, "UI")
    .replace(/\bumkm\b/gi, "UMKM")
    .replace(/\bpbo\b/gi, "PBO")
    .replace(/\bpro\b/gi, "Pro");
}

function initGithubExplorer() {
  const listEl = document.getElementById("repoList");
  const countEl = document.getElementById("githubProjectCount");
  const statEl = document.getElementById("publicRepoStat");
  const toggleBtn = document.getElementById("repoToggleBtn");
  const searchInput = document.getElementById("repoSearchInput");

  if (!listEl) return;

  let allRepos = GITHUB_FALLBACK.map(([name, language, year, homepage]) => ({
    name,
    language: language || "Software",
    year,
    pushed_at: `${year}-06-01T00:00:00Z`,
    homepage: homepage || null,
    html_url: `https://github.com/SyafiqSiregar/${encodeURIComponent(name)}`
  }));

  let expanded = false;
  let query = "";

  function sortRepos(repos) {
    return [...repos]
      .filter((r) => !r.fork && r.name !== "SyafiqSiregar")
      .sort((a, b) => {
        const scoreDiff = getRepoScore(b.name) - getRepoScore(a.name);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0);
      });
  }

  function render(animateRows = false) {
    const sorted = sortRepos(allRepos);
    const q = query.trim().toLowerCase();

    const matched = q
      ? sorted.filter((r) => {
          const hay = `${r.name} ${formatRepoName(r.name)} ${r.language || ""} ${r.description || ""}`.toLowerCase();
          return hay.includes(q);
        })
      : sorted;

    const DEFAULT_LIMIT = 8;
    const visible = (expanded || q) ? matched : matched.slice(0, DEFAULT_LIMIT);

    if (countEl) {
      countEl.textContent = q
        ? `Ditemukan ${matched.length} dari ${sorted.length} repositori publik`
        : `${sorted.length} repositori publik tersinkronisasi · POS di urutan teratas`;
    }

    if (statEl) {
      statEl.dataset.val = String(sorted.length);
      statEl.textContent = `${sorted.length}+`;
    }

    if (toggleBtn) {
      if (q || matched.length <= DEFAULT_LIMIT) {
        toggleBtn.hidden = true;
      } else {
        toggleBtn.hidden = false;
        toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
        toggleBtn.textContent = expanded
          ? "Ringkas Daftar (8 Teratas)"
          : `Tampilkan Semua (${matched.length} Repositori)`;
      }
    }

    if (visible.length === 0) {
      listEl.innerHTML = `
        <div class="repo-empty">
          <p>Tidak ada repositori yang cocok dengan kata kunci "<strong>${escapeHtml(query)}</strong>".</p>
          <button type="button" class="pbtn" id="resetRepoSearch">Reset Pencarian</button>
        </div>
      `;
      document.getElementById("resetRepoSearch")?.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        query = "";
        render(true);
      });
      return;
    }

    listEl.innerHTML = visible.map((repo) => {
      const posFlag = isPosRepo(repo.name);
      const year = repo.pushed_at
        ? new Date(repo.pushed_at).getUTCFullYear()
        : (repo.year || "2026");
      const lang = repo.language || "Project";
      const repoUrl = repo.html_url || `https://github.com/SyafiqSiregar/${encodeURIComponent(repo.name)}`;

      return `
        <div class="repo-row ${posFlag ? "repo-row--pos" : ""}" role="listitem">
          <div class="repo-row__main">
            <div class="repo-row__top">
              <span class="repo-row__name">${escapeHtml(formatRepoName(repo.name))}</span>
              ${posFlag ? '<span class="repo-row__pill">POS</span>' : ""}
            </div>
            <div class="repo-row__meta">${escapeHtml(lang)} · Diperbarui ${escapeHtml(year)}</div>
          </div>
          <div class="repo-row__links">
            ${repo.homepage ? `
              <a class="repo-row__link repo-row__link--live" href="${escapeHtml(repo.homepage)}" target="_blank" rel="noopener noreferrer">Live</a>
            ` : ""}
            <a class="repo-row__link" href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      `;
    }).join("");

    if (animateRows && M && !prefersReduced) {
      M.animate(
        listEl.querySelectorAll(".repo-row"),
        { opacity: [0, 1], y: [10, 0] },
        { delay: M.stagger(0.02), duration: 0.28 }
      );
    }

    if (typeof ScrollTrigger !== "undefined") {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }

  render(false);

  toggleBtn?.addEventListener("click", () => {
    expanded = !expanded;
    render(true);
  });

  searchInput?.addEventListener("input", (e) => {
    query = e.target.value || "";
    render(false);
  });

  // Live GitHub sync in background
  fetch("https://api.github.com/users/SyafiqSiregar/repos?per_page=100&sort=pushed&direction=desc&type=owner")
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
      return res.json();
    })
    .then((repos) => {
      if (Array.isArray(repos) && repos.length > 0) {
        allRepos = repos;
        render(false);
      }
    })
    .catch(() => {
      // Static fallback already rendered cleanly
    });
}

/* ==========================================================================
   8. FAST PRELOADER + BACKGROUND BLOB UPGRADE
   ========================================================================== */
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
const loaderPct = document.getElementById("loaderPct");
const loaderSkip = document.getElementById("loaderSkip");

async function upgradeVideoToBlob(video, onProgress) {
  if (!video || location.protocol === "file:") return;
  const src = video.getAttribute("src");
  if (!src || src.startsWith("blob:")) return;

  try {
    const res = await fetch(src);
    if (!res.ok || !res.body) throw new Error("HTTP " + res.status);
    const total = +res.headers.get("Content-Length") || 11000000;
    const reader = res.body.getReader();
    let loaded = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (onProgress) onProgress(Math.min(0.99, loaded / total));
    }
    const blob = new Blob(chunks, { type: "video/mp4" });
    const prevTime = video.currentTime || 0;
    video.src = URL.createObjectURL(blob);
    video.load();
    video.addEventListener("loadedmetadata", () => {
      try { video.currentTime = prevTime; } catch (_) {}
    }, { once: true });
    if (onProgress) onProgress(1);
  } catch (_) {
    if (onProgress) onProgress(1);
  }
}

let booted = false;
function boot() {
  if (booted) return;
  booted = true;

  if (loader) {
    loader.classList.add("is-done");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
    setTimeout(() => loader?.remove(), 800);
  }

  if (!prefersReduced) {
    initExperience();
    // Upgrade second reel in idle background so Act II scrubbing is silky without slowing startup
    setTimeout(() => upgradeVideoToBlob(allVideo), 700);
  }
}

/* Render showcase & GitHub explorer immediately so DOM is complete from frame 0 */
initProjectShowcase();
initModalListeners();
initGithubExplorer();
initCraftSection();

if (prefersReduced) {
  loader?.remove();
  initMobileDrawer(null);
} else {
  loaderSkip?.addEventListener("click", boot);

  let heroProg = 0;
  let shown = 0;

  // Start hero blob fetch for smooth 1-frame scrubbing, but unlock quickly if ready or after 2.4s max
  upgradeVideoToBlob(heroVideo, (p) => { heroProg = Math.max(heroProg, p); });

  const markCanPlay = () => { heroProg = Math.max(heroProg, 0.92); };
  heroVideo?.addEventListener("canplay", markCanPlay, { once: true });
  if (heroVideo && heroVideo.readyState >= 3) heroProg = 1;

  const iv = setInterval(() => {
    heroProg = Math.min(1, heroProg + 0.04);
    const targetPct = heroProg * 100;
    shown += (targetPct - shown) * 0.28;
    const pct = Math.min(100, Math.round(shown));
    if (loaderBar) loaderBar.style.width = pct + "%";
    if (loaderPct) loaderPct.textContent = pct + "%";

    if (pct >= 98) {
      clearInterval(iv);
      if (loaderBar) loaderBar.style.width = "100%";
      if (loaderPct) loaderPct.textContent = "100%";
      setTimeout(boot, 120);
    }
  }, 40);

  // Comfort guarantee: never keep the user waiting longer than 2.2s
  setTimeout(() => {
    clearInterval(iv);
    boot();
  }, 2200);
}

/* ==========================================================================
   9. MAIN INTERACTIVE EXPERIENCE (LENIS + GSAP + MOTION)
   ========================================================================== */
function initExperience() {
  if (isMobile) document.body.classList.add("is-mobile");

  /* Tuned Lenis Smooth Scroll — natural wheel glide, native touch inertia */
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.92,
    touchMultiplier: 1.35,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false
  });
  globalLenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* Global top progress bar */
  gsap.to("#progressBar", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
  });

  /* Left web thread indicator */
  const thread = document.querySelector(".thread");
  if (thread) {
    gsap.to("#threadFill", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.7 }
    });
    gsap.to("#threadBead", {
      y: () => thread.offsetHeight,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.7, invalidateOnRefresh: true }
    });
  }

  /* Marquee belt — velocity-reactive, paused when offscreen */
  const beltEl = document.querySelector(".interlude");
  const marquee = gsap.to("#beltTrack", {
    xPercent: -100 / 6,
    ease: "none",
    duration: 16,
    repeat: -1
  });
  if (beltEl && "IntersectionObserver" in window) {
    const beltIo = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) marquee.play();
      else marquee.pause();
    }, { rootMargin: "200px 0px" });
    beltIo.observe(beltEl);
  }

  let marqueeSettle;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate(self) {
      if (!marquee.isActive()) return;
      const boost = gsap.utils.clamp(-3.5, 5, 1 + self.getVelocity() / 320);
      marqueeSettle?.kill();
      marquee.timeScale(boost);
      marqueeSettle = gsap.to(marquee, { timeScale: 1, duration: 1.2, ease: "power2.out" });
    }
  });

  buildHero();
  const missionsST = isMobile ? (buildMissionsMobile(), null) : buildMissionsDesktop();
  buildMotionEnhancements();
  buildCaseOperative();
  buildContact();
  buildNavigation(lenis);
  initMobileDrawer(lenis);
  buildMicroInteractions();
  if (missionsST) buildRail(lenis, missionsST);

  addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/* ==========================================================================
   10. ACT I — HERO (Scrubbed Video + Optical Decode Lens)
   ========================================================================== */
function buildHero() {
  const heroStage = document.getElementById("heroStage");
  const scrub = new Scrubber(heroVideo, heroStage, 0.17);
  const heroDur = 6.0;

  const p1 = gsap.timeline({ paused: true })
    .fromTo("#phrase1", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55, ease: "power2.out" })
    .from("#phrase1 .caption-box", { y: 28, rotate: -4, duration: 0.75, ease: "power3.out" }, "<")
    .from("#phrase1 .hero__quick-bar", { y: 18, autoAlpha: 0, duration: 0.65, ease: "power2.out" }, "<0.12");

  const p3 = gsap.timeline({ paused: true })
    .fromTo("#phrase3", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" })
    .from(".hero__pre", { y: 22, autoAlpha: 0, duration: 0.75, ease: "power2.out" }, "<")
    .from(".hero__alias", { scale: 1.25, autoAlpha: 0, duration: 0.95, ease: "expo.out" }, "<0.1")
    .from(".hero__role", { y: 24, autoAlpha: 0, duration: 0.85, ease: "power2.out" }, "<0.28");

  const windows = [
    { tl: p1, on: 0.0, off: 0.48 },
    { tl: p3, on: 0.64, off: 1.01 }
  ];

  // Show intro CTA immediately on initial load so page feels alive at scroll = 0
  p1.play();

  const alias = document.querySelector(".hero__alias");
  let crackFired = false;
  const faceDecode = buildHeroFaceDecode();

  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: () => "+=" + innerHeight * 3.2,
    pin: "#heroStage",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const p = self.progress;
      scrub.set(p * heroDur);

      if (faceDecode) faceDecode.onScroll(p);

      windows.forEach(({ tl, on, off }) => {
        const inside = p >= on && p < off;
        if (inside && !tl.isActive() && tl.progress() === 0) tl.play();
        if (!inside && tl.progress() > 0) tl.reverse();
      });

      if (p > 0.65 && !crackFired) {
        crackFired = true;
        flash("#heroFlash");
        alias?.classList.add("is-glitching");
        gsap.delayedCall(0.85, () => alias?.classList.remove("is-glitching"));
      }
      if (p < 0.58) crackFired = false;

      gsap.set("#heroFade", { opacity: 0.82 * gsap.utils.clamp(0, 1, (p - 0.88) / 0.12) });
      gsap.to("#heroHint", { autoAlpha: p < 0.04 ? 1 : 0, duration: 0.35, overwrite: "auto" });
    }
  });

  if (!isMobile) {
    const layers = [
      { el: ".hero__layer--back",  y: -8 },
      { el: ".hero__layer--mid",   y: -30 },
      { el: ".hero__layer--front", y: -65 }
    ];
    layers.forEach(({ el, y }) => {
      gsap.to(el, {
        yPercent: y,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: () => "+=" + innerHeight * 3.2,
          scrub: 0.5
        }
      });
    });

    const quicks = layers.map(({ el }, i) => ({
      x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
      y2: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
      depth: (i + 1) * 8
    }));
    heroStage?.addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      quicks.forEach(({ x, y2, depth }) => { x(nx * depth * 1.8); y2(ny * depth); });
    });
  }
}

function buildHeroFaceDecode() {
  const headZone = document.getElementById("headZone");
  const faceWrap = document.getElementById("heroFaceWrap");
  const lensEl = document.getElementById("heroLens");
  const heroStage = document.getElementById("heroStage");
  const decodeHint = document.getElementById("decodeHint");

  if (!headZone || !faceWrap || !lensEl || !heroStage) return null;

  const lensRim = lensEl.querySelector(".lens__rim");
  const LENS_BASE_R = 80;

  let isHovering = false;
  let isScrollLocked = false;
  let radiusTween = null;

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight * 0.34 };
  const lens = { x: mouse.x, y: mouse.y };
  const lensState = { r: 0, open: 0 };

  const getTargetRadius = () => Math.max(78, Math.min(105, headZone.offsetWidth * 0.4));

  function setLensRadius(target) {
    if (radiusTween) radiusTween.kill();
    const opening = target > 0;
    if (opening) {
      faceWrap.classList.add("is-active");
      gsap.to(lensEl, { opacity: 1, duration: 0.3, ease: "power2.out" });
      if (decodeHint) gsap.to(decodeHint, { opacity: 0.18, duration: 0.25 });
      if (lensRim) gsap.fromTo(lensRim, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }
    radiusTween = gsap.to(lensState, {
      r: target,
      open: opening ? 1 : 0,
      duration: opening ? 0.65 : 0.4,
      ease: opening ? "power3.out" : "power2.inOut",
      onComplete: () => {
        if (!opening) {
          faceWrap.classList.remove("is-active");
          gsap.to(lensEl, { opacity: 0, duration: 0.2 });
          if (decodeHint && !isScrollLocked) gsap.to(decodeHint, { opacity: 0.9, duration: 0.3 });
        }
      }
    });
  }

  headZone.addEventListener("pointerenter", (e) => {
    if (isScrollLocked) return;
    isHovering = true;
    mouse.x = lens.x = e.clientX;
    mouse.y = lens.y = e.clientY;
    setLensRadius(getTargetRadius());
  });

  headZone.addEventListener("pointermove", (e) => {
    if (isScrollLocked) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  headZone.addEventListener("pointerleave", () => {
    isHovering = false;
    setLensRadius(0);
  });

  headZone.addEventListener("click", () => {
    if (isScrollLocked) return;
    const rect = headZone.getBoundingClientRect();
    mouse.x = lens.x = rect.left + rect.width / 2;
    mouse.y = lens.y = rect.top + rect.height / 2;
    setLensRadius(getTargetRadius());
    gsap.delayedCall(2.2, () => {
      if (!isHovering) setLensRadius(0);
    });
  });

  let clock = 0;
  gsap.ticker.add(() => {
    if (lensState.open < 0.001 && !isHovering) return;

    const dr = Math.min(3, gsap.ticker.deltaRatio());
    clock += dr / 60;

    const le = Math.min(1, 0.18 * dr);
    lens.x += (mouse.x - lens.x) * le;
    lens.y += (mouse.y - lens.y) * le;

    const breathe = 1 + Math.sin(clock * 2.2) * 0.025;
    const r = lensState.r * breathe;

    const wrapRect = faceWrap.getBoundingClientRect();
    faceWrap.style.setProperty("--lx", `${(lens.x - wrapRect.left).toFixed(1)}px`);
    faceWrap.style.setProperty("--ly", `${(lens.y - wrapRect.top).toFixed(1)}px`);
    faceWrap.style.setProperty("--lr", `${Math.max(0, r).toFixed(1)}px`);

    const stageRect = heroStage.getBoundingClientRect();
    const sx = lens.x - stageRect.left;
    const sy = lens.y - stageRect.top;
    const scale = Math.max(0, r / LENS_BASE_R);
    lensEl.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, -50%) scale(${scale.toFixed(4)})`;
  });

  return {
    onScroll(p) {
      if (p > 0.03) {
        if (!isScrollLocked) {
          isScrollLocked = true;
          headZone.style.pointerEvents = "none";
          if (isHovering || lensState.r > 0) {
            isHovering = false;
            setLensRadius(0);
            gsap.set(lensEl, { opacity: 0 });
            faceWrap.classList.remove("is-active");
          }
          if (decodeHint) gsap.to(decodeHint, { autoAlpha: 0, duration: 0.2 });
        }
      } else if (isScrollLocked) {
        isScrollLocked = false;
        headZone.style.pointerEvents = "auto";
        if (decodeHint && !isHovering) gsap.to(decodeHint, { autoAlpha: 0.9, duration: 0.3 });
      }
    }
  };
}

/* ==========================================================================
   11. ACT II — MISSIONS (Desktop Pinned Scrub & Mobile Segment Autoplay)
   ========================================================================== */
function buildMissionsDesktop() {
  const missionsStage = document.getElementById("missionsStage");
  const scrub = new Scrubber(allVideo, missionsStage, 0.15);
  const panels = gsap.utils.toArray(".panel");

  const t0 = videoTimeAt(0);
  scrub.current = scrub.target = t0;
  try { allVideo.currentTime = t0; } catch (_) {}

  const panelTls = panels.map((panel) => {
    const tl = gsap.timeline({ paused: true });
    tl.set(panel, { visibility: "visible" })
      .fromTo("#halftone", { opacity: 0 }, { opacity: 0.55, duration: 0.65, ease: "power2.out" }, 0)
      .fromTo("#misprint", { opacity: 0 }, { opacity: 0.38, duration: 0.65, ease: "power2.out" }, 0.06)
      .fromTo(
        panel.querySelector(".panel__frame"),
        { y: 70, rotate: -3, autoAlpha: 0 },
        { y: 0, rotate: -0.8, autoAlpha: 1, duration: 0.95, ease: "power3.out" },
        0.12
      )
      .from(
        panel.querySelectorAll(".panel__eyebrow, .char"),
        { yPercent: 100, autoAlpha: 0, stagger: { each: 0.024 }, duration: 0.75, ease: "power3.out" },
        0.24
      )
      .from(
        panel.querySelectorAll(".panel__desc, .panel__tags li, .panel__actions, .arsenal li"),
        { y: 20, autoAlpha: 0, stagger: 0.06, duration: 0.75, ease: "power2.out" },
        0.42
      );

    const pow = panel.querySelector(".pow");
    if (pow) {
      tl.fromTo(
        pow,
        { scale: 0.45, rotate: -18, autoAlpha: 0 },
        { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.6, ease: "back.out(2.1)" },
        0.4
      );
    }
    tl.eventCallback("onReverseComplete", () => gsap.set(panel, { visibility: "hidden" }));
    return tl;
  });

  const freezeFired = SEGMENTS.map(() => false);

  return ScrollTrigger.create({
    trigger: "#missions",
    start: "top top",
    end: () => "+=" + innerHeight * 5.4,
    pin: "#missionsStage",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const p = self.progress;
      scrub.set(videoTimeAt(p));

      SEGMENTS.forEach((seg, i) => {
        if (seg.panel === undefined) return;
        const inside = p >= seg.p[0] && p < seg.p[1];
        const tl = panelTls[seg.panel];

        if (inside) {
          if (!freezeFired[i]) {
            freezeFired[i] = true;
            flash("#missionFlash");
          }
          if (tl.progress() === 0 && !tl.isActive()) tl.play();
        } else {
          freezeFired[i] = false;
          if (tl.progress() > 0) tl.reverse();
        }
      });
    }
  });
}

function buildMissionsMobile() {
  const panels = gsap.utils.toArray(".panel");
  let playToken = 0;

  try { allVideo.currentTime = 1.0; } catch (_) {}

  function playSegment(from, to) {
    const token = ++playToken;
    try { allVideo.currentTime = from; } catch (_) {}
    allVideo.play().catch(() => {});
    const check = () => {
      if (token !== playToken) return;
      if (allVideo.currentTime >= to) { allVideo.pause(); return; }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }

  const stops = SEGMENTS.filter((s) => s.panel !== undefined).map((s) => s.t[0]);

  panels.forEach((panel, i) => {
    gsap.set(panel, { visibility: "visible", position: "relative", padding: "2.2rem 1rem" });
    gsap.from(panel.querySelector(".panel__frame"), {
      y: 45,
      autoAlpha: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: panel, start: "top 80%" }
    });
    ScrollTrigger.create({
      trigger: panel,
      start: "top 90%",
      onEnter: () => playSegment(i === 0 ? 1.0 : stops[i - 1], stops[i])
    });
  });
}

/* ==========================================================================
   12. FRAMER MOTION (Motion v12) VIEWPORT REVEALS, GESTURES & STAT COUNTERS
   ========================================================================== */
function buildMotionEnhancements() {
  if (!M || prefersReduced) return;

  // Stagger reveal for Dossier summary pills
  const pills = document.querySelectorAll(".dossier-pill");
  if (pills.length) {
    M.inView(".dossier-highlights", () => {
      M.animate(
        pills,
        { opacity: [0, 1], y: [18, 0] },
        { delay: M.stagger(0.08), type: "spring", stiffness: 320, damping: 28 }
      );
    }, { amount: 0.25 });
  }

  // Initial reveal of Project Cards when entering #case-files
  M.inView("#curatedProjectsRoot", () => {
    const cards = document.querySelectorAll("#curatedProjectsRoot .pcard");
    M.animate(
      cards,
      { opacity: [0, 1], y: [24, 0] },
      { delay: M.stagger(0.05), type: "spring", stiffness: 300, damping: 28 }
    );
  }, { amount: 0.06 });

  // Comic panels & Engineering workflow strip in Act IV
  document.querySelectorAll(".cpanel").forEach((panel, idx) => {
    M.inView(panel, () => {
      M.animate(
        panel,
        { opacity: [0, 1], y: [26, 0], scale: [0.985, 1] },
        { delay: (idx % 2) * 0.08, type: "spring", stiffness: 290, damping: 27 }
      );
    }, { amount: 0.18 });
  });

  const pipeSteps = document.querySelectorAll(".pipeline-step");
  if (pipeSteps.length) {
    M.inView(".craft-pipeline", () => {
      M.animate(
        pipeSteps,
        { opacity: [0, 1], y: [20, 0] },
        { delay: M.stagger(0.08), type: "spring", stiffness: 310, damping: 28 }
      );
    }, { amount: 0.2 });
  }

  // Manifesto quote & experience cards
  const quote = document.querySelector(".manifesto__quote");
  if (quote) {
    M.inView(quote, () => {
      M.animate(quote, { opacity: [0, 1], x: [-24, 0] }, { duration: 0.65 });
    }, { amount: 0.35 });
  }

  const mCards = document.querySelectorAll(".manifesto__card");
  if (mCards.length) {
    M.inView(".manifesto__cols", () => {
      M.animate(
        mCards,
        { opacity: [0, 1], y: [24, 0] },
        { delay: M.stagger(0.12), type: "spring", stiffness: 300, damping: 28 }
      );
    }, { amount: 0.25 });
  }

  // Animated Stat Counters in Manifesto
  M.inView(".manifesto__stats", () => {
    document.querySelectorAll(".stat-num").forEach((el) => {
      const target = parseInt(el.dataset.val || "0", 10);
      const suffix = el.dataset.suffix || "";
      if (!target) return;
      M.animate(0, target, {
        duration: 1.35,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => {
          el.textContent = `${Math.round(latest)}${suffix}`;
        }
      });
    });
  }, { amount: 0.4 });
}

/* ==========================================================================
   13. SPIDER-MAN DOSSIER OPERATIVE 3D INTERACTION
   ========================================================================== */
function buildCaseOperative() {
  const operative = document.getElementById("caseOperative");
  const figure = document.getElementById("operativeFigure");
  const thwipBtn = document.getElementById("operativeThwip");

  if (!operative || !figure) return;

  if (!isMobile) {
    const xTo = gsap.quickTo(figure, "rotateY", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(figure, "rotateX", { duration: 0.55, ease: "power3.out" });

    operative.addEventListener("pointermove", (e) => {
      const rect = operative.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(px * 16);
      yTo(-py * 14);
    });

    operative.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  }

  thwipBtn?.addEventListener("click", () => {
    if (M && !prefersReduced) {
      M.animate(thwipBtn, { scale: [1, 1.32, 1], rotate: [8, 20, 8] }, { duration: 0.42 });
      M.animate(figure, { scale: [1, 1.05, 1] }, { duration: 0.32 });
    }
  });
}

/* ==========================================================================
   14. NAVIGATION, ACTIVE SECTION HIGHLIGHT, MOBILE DRAWER & STORY RAIL
   ========================================================================== */
function buildNavigation(lenis) {
  // Smooth anchor scrolling with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      if (href === "#top") {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.3 });
        return;
      }
      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, { offset: -72, duration: 1.35 });
      }
    });
  });

  // Track active nav section & toggle floating reelSkip visibility
  const navLinks = document.querySelectorAll(".chrome__link[data-nav-sec]");
  const reelSkip = document.getElementById("reelSkip");
  const sectionIds = ["hero", "missions", "case-files", "the-craft", "manifesto", "contact"];

  function updateNavState() {
    const scrollMid = window.scrollY + innerHeight * 0.38;
    let currentId = "hero";

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (scrollMid >= top) currentId = id;
      }
    }

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.navSec === currentId);
    });

    // Show floating "Langsung ke Projek POS" pill only while inside Hero/Missions above #case-files
    const casesEl = document.getElementById("case-files");
    if (reelSkip && casesEl) {
      const casesTop = casesEl.getBoundingClientRect().top;
      reelSkip.classList.toggle("is-hidden", casesTop <= innerHeight * 0.95);
    }
  }

  ScrollTrigger.create({ start: 0, end: "max", onUpdate: updateNavState });
  updateNavState();
}

function initMobileDrawer(lenis) {
  const btn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileNavDrawer");
  if (!btn || !drawer) return;

  function setOpen(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    drawer.hidden = !open;
    if (open && M && !prefersReduced) {
      M.animate(drawer, { opacity: [0, 1], y: [-8, 0] }, { duration: 0.2 });
    }
  }

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      setOpen(false);
      if (lenis && href && href.startsWith("#")) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -72, duration: 1.25 });
        }
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawer.hidden) {
      setOpen(false);
      btn.focus();
    }
  });
}

function buildRail(lenis, missionsST) {
  const dots = gsap.utils.toArray(".rail__dot");
  const plateaus = SEGMENTS.filter((s) => s.panel !== undefined);
  const len = () => missionsST.end - missionsST.start;

  const getSecTop = (id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  };

  const targets = () => [
    0,
    ...plateaus.map((s) => missionsST.start + len() * ((s.p[0] + s.p[1]) / 2)),
    getSecTop("case-files") - 60,
    getSecTop("the-craft") - 60,
    getSecTop("manifesto") - 60,
    getSecTop("contact")
  ];

  const thresholds = () => [
    0,
    ...plateaus.map((s) => missionsST.start + len() * s.p[0]),
    getSecTop("case-files") - innerHeight * 0.4,
    getSecTop("the-craft") - innerHeight * 0.4,
    getSecTop("manifesto") - innerHeight * 0.4,
    getSecTop("contact") - innerHeight * 0.4
  ];

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      const tg = targets()[i];
      if (tg !== undefined) lenis.scrollTo(tg, { duration: 1.45 });
    });
  });

  function setActive() {
    const y = window.scrollY + innerHeight * 0.35;
    let active = 0;
    thresholds().forEach((t, i) => { if (y >= t) active = i; });
    dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
  }
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: setActive });
  setActive();
}

/* ==========================================================================
   15. CONTACT REVEAL & MAGNETIC MICRO-INTERACTIONS
   ========================================================================== */
function buildContact() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: "#contact", start: "top 72%" }
  });
  tl.from(".contact__continued", { y: 28, autoAlpha: 0, duration: 0.7, ease: "power3.out" })
    .from(".contact__title .char", {
      yPercent: 105,
      autoAlpha: 0,
      stagger: { each: 0.02 },
      duration: 0.85,
      ease: "power3.out"
    }, "-=0.4")
    .from(".contact__sub", { y: 18, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, "-=0.55")
    .from(".contact__cta-row", { y: 22, autoAlpha: 0, duration: 0.75, ease: "power2.out" }, "-=0.5")
    .from(".contact__socials", { y: 16, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");
}

function buildMicroInteractions() {
  if (isMobile) return;

  document.querySelectorAll(".magnetic").forEach((btn) => {
    const inner = btn.querySelector(".magnetic__inner");
    if (!inner) return;
    const xTo = gsap.quickTo(inner, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(inner, "y", { duration: 0.45, ease: "power3.out" });
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.28);
      yTo((e.clientY - r.top - r.height / 2) * 0.28);
    });
    btn.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  });

  if (M && !prefersReduced) {
    document.querySelectorAll(".chrome__cta, .hero__quick-btn, .contact__wa, .contact__mail").forEach((el) => {
      M.press(el, () => {
        M.animate(el, { scale: 0.97 }, { duration: 0.09 });
        return () => M.animate(el, { scale: 1 }, { type: "spring", stiffness: 450, damping: 24 });
      });
    });
  }
}

function initCraftSection() {
  const sheet = document.getElementById("craftSheet");
  const modeBtns = document.querySelectorAll("[data-craft-mode]");
  const simBtn = document.getElementById("offlineSimBtn");
  const simLabel = document.getElementById("offlineSimLabel");
  const simCap = document.getElementById("offlineSimCap");
  const craftThwip = document.getElementById("craftThwipBtn");

  // 1. Mode Switcher: Visual Comic vs Technical Blueprint
  modeBtns.forEach((btn) => {
    if (M && !prefersReduced) {
      M.press(btn, () => {
        M.animate(btn, { scale: 0.96 }, { duration: 0.09 });
        return () => M.animate(btn, { scale: 1 }, { type: "spring", stiffness: 440, damping: 24 });
      });
    }

    btn.addEventListener("click", () => {
      const targetMode = btn.getAttribute("data-craft-mode") || "comic";
      if (sheet) sheet.setAttribute("data-mode", targetMode);

      modeBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });

      const bpBoxes = document.querySelectorAll(".cpanel__blueprint");
      const caps = document.querySelectorAll(".cpanel__cap");
      const isBlueprint = targetMode === "blueprint";

      bpBoxes.forEach((box) => {
        box.hidden = !isBlueprint;
        box.removeAttribute("style");
      });
      caps.forEach((cap) => cap.removeAttribute("style"));

      if (M && !prefersReduced) {
        const activeTargets = isBlueprint ? bpBoxes : caps;
        if (activeTargets.length) {
          M.animate(
            activeTargets,
            { opacity: [0, 1], y: [10, 0] },
            { delay: M.stagger(0.05), type: "spring", stiffness: 360, damping: 28 }
          );
        }
      }

      if (typeof ScrollTrigger !== "undefined") {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    });
  });

  // 2. Interactive Offline-First POS Network Simulator (FIG. 01)
  if (simBtn && simLabel && simCap) {
    let isOfflineSim = false;
    simBtn.addEventListener("click", () => {
      isOfflineSim = !isOfflineSim;
      simBtn.classList.toggle("is-offline", isOfflineSim);
      simBtn.setAttribute("aria-pressed", isOfflineSim ? "true" : "false");

      if (isOfflineSim) {
        simLabel.textContent = "MODE OFFLINE AKTIF · INDEXEDDB LOKAL 0ms";
        simCap.innerHTML =
          "<strong>Simulasi Koneksi Terputus:</strong> Sinyal internet diputus, namun <em>SembakoOS</em> &amp; <em>1966 POS</em> tetap memproses keranjang kasir, potong stok, dan cetak struk 100% lokal (6/6 DB Invariants terjaga).";
      } else {
        simLabel.textContent = "JARINGAN: ONLINE · UJI PUTUS KONEKSI";
        simCap.innerHTML =
          "<strong>Ketahanan Offline-First:</strong> Pada <em>SembakoOS</em> dan <em>1966 Caffe POS</em>, kasir tetap melayani transaksi, mutasi stok, dan laporan harian tanpa jeda meski internet toko padam total.";
      }

      if (M && !prefersReduced) {
        M.animate(simBtn, { scale: [1, 1.05, 1] }, { duration: 0.28 });
        M.animate(simCap, { y: [6, 0], opacity: [0.7, 1] }, { type: "spring", stiffness: 360, damping: 26 });
      }
    });
  }

  // 3. Interactive Comic Burst on FIG. 02
  if (craftThwip) {
    craftThwip.addEventListener("click", () => {
      if (M && !prefersReduced) {
        M.animate(craftThwip, { scale: [1, 1.28, 1], rotate: [-8, 10, -8] }, { duration: 0.38 });
      }
    });
  }
}

function flash(sel) {
  gsap.fromTo(sel, { opacity: 0.78 }, { opacity: 0, duration: 0.5, ease: "power2.out" });
}
