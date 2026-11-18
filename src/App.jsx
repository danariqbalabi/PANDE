import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Beranda from './pages/Beranda.jsx'
import Katalog from './pages/Katalog.jsx'
import KaryaDetail from './pages/KaryaDetail.jsx'
import Pesan from './pages/Pesan.jsx'
import Status from './pages/Status.jsx'
import Paspor from './pages/Paspor.jsx'
import Pengrajin from './pages/Pengrajin.jsx'
import PengrajinDetail from './pages/PengrajinDetail.jsx'
import CaraKerja from './pages/CaraKerja.jsx'
import Dampak from './pages/Dampak.jsx'
import Desa from './pages/Desa.jsx'
import Aturan from './pages/Aturan.jsx'
import NotFound from './pages/NotFound.jsx'
import Admin from './admin/Admin.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/karya" element={<Katalog />} />
        <Route path="/karya/:id" element={<KaryaDetail />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/status" element={<Status />} />
        <Route path="/p/:kode" element={<Paspor />} />
        <Route path="/pengrajin" element={<Pengrajin />} />
        <Route path="/pengrajin/:slug" element={<PengrajinDetail />} />
        <Route path="/cara-kerja" element={<CaraKerja />} />
        <Route path="/dampak" element={<Dampak />} />
        <Route path="/desa" element={<Desa />} />
        <Route path="/aturan" element={<Aturan />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
