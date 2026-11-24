# SYAFIQ SIREGAR — SPIDER/DEV Portfolio

Portofolio interaktif *scroll-driven* milik **Syafiq Siregar** (Software Engineer, POS Architect & UI/UX Designer · Motion Laboratory, Telkom University).

Menggabungkan video *scroll-scrubbed* bergaya komik editorial dengan showcase terstruktur yang menempatkan **Ekosistem Aplikasi Kasir (POS) Offline-First, Android APK, & Cloud Inventory** di urutan paling atas, diikuti sistem enterprise, platform web, dan desain produk UI/UX.

## Menjalankan Lokal

Gunakan static server yang mendukung **HTTP Range** agar video *all-intra* dapat di-seek secara mulus:

```bash
npx http-server -p 4173 -c-1
```

Lalu buka `http://localhost:4173`.

## Teknologi Utama

- **GSAP 3.13 + ScrollTrigger** — Scrubbing video keyframe per frame & freeze-frame panel komik.
- **Lenis 1.3** — *Smooth scrolling* presisi yang disinkronkan langsung ke ticker GSAP.
- **Motion v12 (Framer Motion DOM Engine)** — Animasi berbasis fisika pegas (*spring physics*) untuk filter kategori projek, elevasi kartu, hitungan statistik (`inView`), serta dialog detail arsitektur.
- **HTML5 / Modern CSS Design Tokens** — Kontras tinggi ramah OLED, aksesibilitas fokus keyboard WCAG 2.2 AA, responsif penuh (`375px` hingga desktop lebar), dan dukungan `prefers-reduced-motion`.

## Struktur Folder

```text
index.html          Markup utama, navigasi, showcase POS, modal detail, & arsip GitHub
css/style.css       Sistem token desain, tata letak kartu berjenjang, & breakpoint responsif
js/main.js          Data kurasi projek POS, engine scroll, Motion spring, & sinkronisasi GitHub API
assets/video/       Video *-scrub.mp4 (all-intra keyframe untuk seeking instan)
assets/img/         Poster video, foto lensa optik Hero, & ilustrasi karakter
```
