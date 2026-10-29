# Gambar rak kosong

Letak di sini versi **kosong** (tiada produk) bagi setiap gambar fixture dalam `assets/equipment-hd/`, dengan **nama fail yang sama**, contohnya `07-snack-rack.png`.

Bila stok rak berkurang, game akan menukar produk kepada gambar kosong ini satu slot demi satu, jadi barang nampak hilang sedikit demi sedikit. Fixture yang belum ada gambar kosong akan kekal nampak penuh (game tetap berfungsi).

Fail yang diperlukan: `01-fruit-veg-rack.png` hingga `27-magazine-stationery-rack.png`. Fail 28–30 (stor, kotak, loker) tidak perlu.

## Syarat gambar

- Saiz sama dengan gambar asal (contoh 1312×1199, atau 1548×1016 / 1551×1014 untuk freezer dan kaunter display).
- Rak berada pada **kedudukan, sudut dan skala yang sama**. Hanya produk yang dibuang; kayu, besi, kaca, lampu dan rak mesti kekal di tempat yang sama.
- Latar belakang lutsinar (PNG dengan alpha), sama seperti gambar asal.
- Bahagian yang dahulunya ditutup produk perlu menunjukkan rak kosong (papan belakang, lantai rak, dalam chiller yang bercahaya).

Kalau guna alat AI image editing, guna gambar asal sebagai input dan minta ia edit, bukan jana gambar baru. Contoh prompt:

> Remove every product from this shelf so it is completely empty. Keep the shelf, frame, lighting, camera angle, size and position exactly the same. Keep the transparent background.

Kalau rangka rak beralih sedikit pun tidak mengapa, tetapi lebih tepat lebih kemas hasilnya. Selepas tambah gambar, refresh browser sahaja (tidak perlu `npm run build`). Game perlu dibuka melalui server (`python3 -m http.server 8000`), bukan terus dari fail.
