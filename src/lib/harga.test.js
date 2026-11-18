import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hitungHarga } from './harga.js'

test('menghitung harga, kontribusi, dan untung', () => {
  const r = hitungHarga({
    beratKg: 1.5, hargaPerKg: 10000, jam: 4, upahPerJam: 15000,
    finishing: 10000, marginPersen: 30, kontribusiPersen: 5, jumlah: 2,
  })
  // biaya = 15.000 + 60.000 + 10.000 = 85.000 ; harga = ceil(110.500 / 1000) * 1000 = 111.000
  assert.equal(r.biaya, 85000)
  assert.equal(r.harga, 111000)
  assert.equal(r.kontribusi, 5550)
  assert.equal(r.untung, 111000 - 85000 - 5550)
  assert.equal(r.totalHarga, 222000)
})

test('menolak angka negatif dan jumlah nol', () => {
  assert.throws(() => hitungHarga({ beratKg: -1 }))
  assert.throws(() => hitungHarga({ jumlah: 0 }))
})
