import test from 'node:test'
import assert from 'node:assert/strict'
import { orderCodeFromScan } from './scanCode.js'

test('membaca kode pesanan dari barcode teks dan QR tautan', () => {
  assert.equal(orderCodeFromScan('psn-a1b2c3'), 'PSN-A1B2C3')
  assert.equal(orderCodeFromScan('https://pande.test/status?kode=PSN-ABC123'), 'PSN-ABC123')
})
test('menolak paspor produk dan kode pesanan yang tidak lengkap', () => {
  for (const value of ['PW-12345678', '/p/PW-ABC12345', 'PSN-ABC', 'PSN-ABC123456', '', null]) assert.equal(orderCodeFromScan(value), null)
})
