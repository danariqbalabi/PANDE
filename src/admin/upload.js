import { supabase } from '../lib/supabase.js'

const MAKS = 5 * 1024 * 1024
const TIPE = ['image/jpeg', 'image/png', 'image/webp']

// Unggah foto ke bucket publik "foto", kembalikan URL publiknya.
export async function unggahFoto(file, folder) {
  if (!TIPE.includes(file.type)) throw new Error('Foto harus JPG, PNG, atau WEBP.')
  if (file.size > MAKS) throw new Error('Ukuran foto maksimal 5 MB.')
  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('foto').upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from('foto').getPublicUrl(path).data.publicUrl
}
