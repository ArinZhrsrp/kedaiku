# KedaiKu

Game simulasi mengurus kedai runcit. Player bermula sebagai pekerja part time atau full time di kedai runcit orang lain, mengumpul duit sehingga cukup untuk membeli bangunan, kemudian membuka dan membesarkan kedai runcit sendiri. Sebagai owner, player bergerak dalam kedai untuk urus stok, jadi cashier, dan akhirnya siapkan penghantaran. Fokusnya kerja mengurus kedai, bukan kuiz meneka harga barang.

Arah perjalanan player (karier) ini masih dalam perancangan; lihat [Perjalanan player: dari pekerja ke owner](#perjalanan-player-dari-pekerja-ke-owner).

Projek ini sudah **dimulakan semula daripada asas**. README ini membezakan apa yang sudah ada dalam kod dengan flow yang hendak dibina, supaya sesiapa yang sambung development tidak tersalah ikut implementasi lama.

## Status sekarang

Scene 3D gaya clay/pastel menggunakan Three.js, dengan kamera isometrik ortografik yang fixed. Kamera tidak mengikuti karakter atau boleh di-drag untuk rotate.

Yang sudah tersedia:

- Lantai berjubin dan dua dinding.
- Pintu kaca di bawah kiri, kaunter cashier di bawah kanan, mengikut view kamera semasa.
- Tingkap pada kedua-dua dinding: tiga di dinding atas dan dua di dinding kiri.
- Beberapa pokok hiasan.
- Karakter owner spawn di tengah kedai.
- Klik/tap lantai untuk berjalan ke destinasi; laluan mengelak kaunter dan pokok.
- Joystick sentiasa kelihatan di kiri bawah, boleh digunakan dengan mouse atau touch.
- Klik kaunter untuk berjalan ke tempat berdiri di belakang kaunter. Apabila sampai, karakter menghadap lurus ke depan kaunter.
- Animasi berjalan dan penanda destinasi pada lantai.

**Belum tersedia dalam versi semasa:** rak, produk, duit, popup welcome/tutorial, order stok, countdown delivery, terima stok, pelanggan, transaksi cashier, misi, progression, dan save game. Klik kaunter sekarang hanya menggerakkan karakter; belum memproses pembayaran.

## Flow seterusnya yang hendak dibina

Mulakan dengan sistem order stok sahaja dahulu. Siapkan dan semak flow ini sebelum tambah pelanggan atau delivery kepada customer.

1. Apabila game dibuka, keluar popup **Welcome to KedaiKu** yang menerangkan tugas owner. Player diberikan duit permulaan; jumlahnya belum dimuktamadkan untuk versi baru.
2. Selepas popup welcome ditutup, keluar popup tutorial yang menyuruh player pilih rak makanan atau minuman.
3. Setiap jenis rak hanya menerima kategori produk yang sesuai. Kemudian boleh tambah peti sejuk dan freezer aiskrim dengan kategori masing-masing.
4. Player klik rak dan karakter berjalan ke rak tersebut untuk order. **Tiada terminal atau kaunter khas untuk order stok.**
5. Panel rak memaparkan produk, harga beli, harga jual, stok yang tinggal, dan butang **Buy** untuk pembelian secara batch. Saiz batch, harga dan kapasiti rak perlu ditentukan semasa implementasi.
6. Selepas pembelian, duit ditolak dan status **Stock out for delivery** berserta countdown dipaparkan di kanan atas.
7. Apabila barang sampai, player perlu pergi ke tempat terima stok dan melakukan tindakan terima.
8. Stok yang diterima terus disusun secara automatik pada rak asal tempat order dibuat. Player tidak perlu bawa dan susun setiap unit secara manual untuk flow ini.
9. Player boleh klik semula rak untuk menyemak baki stok dan membeli batch seterusnya.

Penghantaran supplier ini berbeza daripada penghantaran pesanan customer yang dirancang kemudian.

## Arah game selepas flow stok siap

- Pelanggan membeli produk dan beratur di cashier.
- Owner scan barang dan terima bayaran; jumlah dipaparkan terus, tanpa pilihan jawapan teka harga.
- Owner memantau stok dan membuat pembelian semula dari rak.
- Player boleh membeli rak/fridge yang sesuai untuk kategori produk tambahan.
- Untuk pesanan delivery customer, owner mengutip produk dan memasukkannya ke dalam van sebelum masa tamat.

## Perjalanan player: dari pekerja ke owner

> **Status: perancangan sahaja.** Belum ada sebarang kod untuk feature ini. Bina selepas flow stok dan cashier asas stabil, kerana fasa pekerja dan fasa owner akan menggunakan semula sistem yang sama.

Game tidak terus meletakkan player sebagai owner. Player melalui tiga fasa:

### 1. Fasa pekerja

- Pada permulaan game, player memilih untuk bekerja **part time** atau **full time** di kedai runcit milik orang lain (NPC owner).
- Player membuat kerja harian kedai seperti jaga cashier, susun stok dan layan pelanggan, menggunakan kawalan yang sama seperti fasa owner.
- Player menerima gaji mengikut jenis kerja. Cadangan awal: full time memberi gaji lebih tinggi tetapi syif lebih panjang; part time gaji lebih rendah tetapi syif lebih pendek. Nilai gaji, panjang syif dan kekerapan bayaran belum dimuktamadkan.
- Duit gaji dikumpul sebagai simpanan untuk matlamat membeli bangunan sendiri.

### 2. Capai target dan beli bangunan

- Game memaparkan **target simpanan** dan kemajuan player ke arah target tersebut.
- Apabila simpanan mencukupi, player boleh membeli bangunan untuk kedai sendiri. Harga bangunan, pilihan lokasi/saiz bangunan, dan sama ada perlu modal tambahan untuk stok awal belum ditentukan.
- Selepas membeli bangunan, player berhenti kerja dan beralih ke fasa owner.

### 3. Fasa owner: bina dan besarkan kedai sendiri

- Player memulakan kedai runcit sendiri dengan modal yang tinggal dan menggunakan flow owner dalam README ini (order stok, cashier, delivery).
- Player cuba menjadikan kedai berjaya dan terus membesarkan perniagaan. Idea untuk progression:
  - Tambah rak, peti sejuk, freezer dan kategori produk baru.
  - Upgrade atau besarkan bangunan.
  - Upah pekerja sendiri.
  - Buka cawangan kedai baru.
- Ukuran "berjaya" (contoh: keuntungan, bilangan pelanggan, rating kedai) perlu ditentukan semasa implementasi.

Perkara yang perlu diputuskan sebelum develop: perbezaan sebenar part time dan full time, sama ada player boleh tukar jenis kerja di tengah jalan, kos hidup atau perbelanjaan semasa fasa pekerja, dan sama ada save game diperlukan sebelum fasa ini dibina.

Rujukan arah visual dan cara bermain ialah game supermarket isometrik seperti Marketland/Supermarketland. Buat perubahan secara bertahap, kekalkan kamera fixed dan kawalan klik + joystick. Jangan masukkan semula semua sistem versi lama serentak.

## Jalankan projek

Keperluan untuk build: Node.js dan npm.

```sh
npm ci
npm run build
```

`index.html` yang telah dibuild mengandungi semua skrip, jadi boleh dibuka terus dalam browser yang menyokong WebGL. Untuk serve secara lokal dari folder projek:

```sh
python3 -m http.server 8000
```

Buka `http://localhost:8000`. Untuk cuba di telefon pada Wi-Fi yang sama, gunakan `http://<IP-LAN-komputer>:8000`; komputer mesti terus menjalankan server dan firewall mesti membenarkan sambungan. `localhost` pada telefon merujuk kepada telefon sendiri.

Selepas ubah JavaScript sumber, jalankan `npm run build` semula dan refresh browser. Tiada hot reload atau test runner dikonfigurasi.

## Peta fail untuk developer

| Fail | Kegunaan |
| --- | --- |
| `scene3d.js` | Scene Three.js, kamera, karakter, props, collision, pathfinding dan pergerakan. |
| `app.js` | Sambungan input klik/tap dan joystick kepada scene, serta mesej ralat. |
| `index.html` | Struktur halaman, CSS, canvas dan joystick; juga mengandungi bundle yang dijana build. |
| `build.mjs` | Bundle `scene3d.js` dengan esbuild, kemudian embed engine dan skrip game ke `index.html`. |
| `music.js` | Muzik latar dan bunyi efek yang dijana dengan Web Audio (tiada fail audio). |
| `shelf-stock.js` | Buat produk pada rak/chiller hilang satu per satu bila stok berkurang, menggunakan gambar rak kosong. |
| `shelf-layouts.js` | Kedudukan baris produk pada setiap gambar fixture (dipakai oleh `shelf-stock.js`). |
| `assets/equipment-hd/empty/` | Gambar versi rak kosong. Lihat `README.md` dalam folder itu untuk syarat gambar. |
| `missions.js` | Data misi versi lama. Masih disertakan oleh build tetapi **tidak digunakan** oleh gameplay semasa; bukan spesifikasi flow baru. |
| `package.json` / `package-lock.json` | Dependency dan arahan build. |

Edit JavaScript dalam fail sumber, bukan salinan bundle dalam `index.html`. Kekalkan marker `3D_ENGINE_START/END` dan `GAME_APP_START/END` kerana build menggunakannya untuk menggantikan skrip. HTML/CSS di luar marker boleh diedit terus.

Semakan asas selepas perubahan:

```sh
node --check scene3d.js
node --check app.js
npm run build
```

Kemudian semak dalam browser: karakter bermula di tengah, klik lantai berfungsi, joystick boleh digerakkan dan dilepaskan, karakter mengelak halangan, dan klik kaunter berhenti dengan arah yang betul. Semak juga layout serta kawalan touch pada mobile.

## Berkongsi dengan kawan

Untuk sama-sama develop, kongsi repository Git dan beri akses melalui platform repository yang digunakan. Kawan boleh clone repository, jalankan arahan di atas dan sambung daripada fail sumber. Untuk tengok hasil sahaja, kongsi `index.html` yang sudah dibuild.

Mengubah README ini tidak memberikan permission repository atau menerbitkan website secara automatik. Versi sekarang berjalan dalam browser sahaja dan belum mempunyai backend, akaun pengguna atau multiplayer.



