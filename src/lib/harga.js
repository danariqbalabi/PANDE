// Kalkulator harga pesanan custom (dipakai di Admin).
// Harga jual dibulatkan ke atas per Rp1.000.
export function hitungHarga({
  beratKg = 0, hargaPerKg = 0, jam = 0, upahPerJam = 0,
  finishing = 0, marginPersen = 0, kontribusiPersen = 0, jumlah = 1,
}) {
  const angka = { beratKg, hargaPerKg, jam, upahPerJam, finishing, marginPersen, kontribusiPersen, jumlah }
  for (const [k, v] of Object.entries(angka)) {
    if (!Number.isFinite(Number(v)) || Number(v) < 0) throw new Error(`Nilai ${k} tidak valid`)
  }
  if (Number(jumlah) < 1) throw new Error('Jumlah minimal 1')

  const bahan = beratKg * hargaPerKg
  const upah = jam * upahPerJam
  const biaya = bahan + upah + Number(finishing)
  const harga = Math.ceil((biaya * (1 + marginPersen / 100)) / 1000) * 1000
  const kontribusi = Math.round((harga * kontribusiPersen) / 100)
  const untung = harga - biaya - kontribusi

  return {
    bahan, upah, biaya, harga, kontribusi, untung,
    totalHarga: harga * jumlah,
    totalUntung: untung * jumlah,
  }
}
