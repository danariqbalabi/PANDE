import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseSiap = Boolean(url && key)

// Tanpa env, situs tetap tampil (halaman statis) dan menampilkan pesan konfigurasi di bagian data.
export const supabase = supabaseSiap ? createClient(url, key) : null
