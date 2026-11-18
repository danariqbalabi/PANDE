import { useEffect, useState } from 'react'
import { supabase, supabaseSiap } from './supabase.js'

// Muat data dari Supabase. fn menerima client supabase dan mengembalikan query/rpc.
// demo (opsional): fungsi yang mengembalikan data contoh saat Supabase belum dikonfigurasi,
// supaya desain bisa ditinjau sebelum database siap.
export function useData(fn, deps = [], demo = null) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    if (!supabaseSiap) {
      setState(demo
        ? { data: demo(), error: null, loading: false, demo: true }
        : { data: null, error: 'Supabase belum dikonfigurasi (isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY).', loading: false })
      return
    }
    let aktif = true
    setState((s) => ({ ...s, loading: true }))
    Promise.resolve(fn(supabase)).then(({ data, error }) => {
      if (aktif) setState({ data, error: error?.message ?? null, loading: false })
    })
    return () => { aktif = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

// Select standar untuk karya: dua relasi ke pengrajin (penempa & pengasah) perlu nama FK eksplisit.
export const SELECT_KARYA =
  '*, kategori_harga(label), pengrajin:pengrajin!karya_pengrajin_id_fkey(nama, slug), pengasah:pengrajin!karya_pengasah_id_fkey(nama, slug)'
