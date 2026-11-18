// Membuat supabase/seed.sql dari src/data/demo.js (data asli Gayeng Ruyeng). Jalankan: npm run seed
import { writeFileSync } from 'node:fs'
import { DEMO_PENGRAJIN, DEMO_KARYA } from '../src/data/demo.js'

const q = (v) => (v == null ? 'null' : typeof v === 'number' ? String(v) : typeof v === 'boolean' ? String(v) : `'${String(v).replace(/'/g, "''")}'`)
const arr = (a) => `array[${(a ?? []).map(q).join(',')}]::text[]`

let sql = '-- Data awal PANDE (dibuat otomatis oleh scripts/seed.mjs). Aman dijalankan ulang.\n\n'
for (const p of DEMO_PENGRAJIN) {
  sql += `insert into pengrajin (slug, nama, peran, keahlian, izin_tampil, wawancara) values (${q(p.slug)}, ${q(p.nama)}, ${q(p.peran)}, ${arr(p.keahlian)}, true, '[]') on conflict (slug) do nothing;\n`
}
sql += '\n'
for (const k of DEMO_KARYA) {
  const kol = ['slug', 'nama', 'kategori', 'jenis', 'deskripsi', 'ukuran', 'finishing', 'panjang_mm', 'berat_gram', 'baja', 'gagang', 'harga_mulai', 'harga_sampai', 'foto_url', 'unggulan']
  sql += `insert into karya (${kol.join(', ')}) select ${kol.map((c) => q(k[c])).join(', ')} where not exists (select 1 from karya where nama = ${q(k.nama)});\n`
}
for (const k of DEMO_KARYA) sql += `update karya set slug = ${q(k.slug)} where nama = ${q(k.nama)} and slug is null;
`
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql)
console.log(`seed.sql: ${DEMO_PENGRAJIN.length} pengrajin, ${DEMO_KARYA.length} karya`)
