import { useEffect, useState } from 'react'
import { supabase, supabaseSiap } from './supabase.js'

// Muat data dari Supabase. fn menerima client supabase dan mengembalikan query/rpc.
export function useData(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    if (!supabaseSiap) {
      setState({ data: null, error: 'Supabase belum dikonfigurasi (isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY).', loading: false })
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
