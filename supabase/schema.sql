-- PANDE - skema database Supabase
-- Jalankan sekali di Supabase Dashboard > SQL Editor.
-- Aman dijalankan ulang (pakai IF NOT EXISTS / OR REPLACE).

create extension if not exists pgcrypto;

-- ============ ADMIN ============
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  catatan text
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ============ TABEL ============
create table if not exists pengrajin (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  keahlian text[] not null default '{}',
  kapasitas_per_bulan int,
  bio text,
  foto_url text,
  izin_tampil boolean not null default false,  -- tampil publik hanya dengan izin
  created_at timestamptz not null default now()
);

create table if not exists kategori_harga (
  kategori text primary key,
  label text not null,
  harga_mulai int,     -- kisaran per barang, untuk estimasi awal
  harga_sampai int,
  urutan int not null default 0
);

create table if not exists karya (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null references kategori_harga(kategori),
  deskripsi text,
  ukuran text,
  harga_mulai int,
  harga_sampai int,
  foto_url text,
  pengrajin_id uuid references pengrajin(id) on delete set null,
  unggulan boolean not null default false,
  tampil boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists pesanan (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  nama text not null,
  no_hp text not null,
  instansi text,
  kategori text not null references kategori_harga(kategori),
  jenis text not null,
  ukuran text,
  jumlah int not null check (jumlah between 1 and 500),
  catatan text,
  estimasi_min bigint,
  estimasi_max bigint,
  harga_final int,
  dp int,
  status text not null default 'diterima'
    check (status in ('diterima','estimasi','dp','ditempa','finishing','dikirim','selesai','dibatalkan')),
  pengrajin_id uuid references pengrajin(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pesanan_no_hp_idx on pesanan (no_hp, created_at);

create table if not exists paspor (
  -- kode acak, tercetak di QR: JANGAN diubah setelah dicetak
  kode text primary key default ('PW-' || upper(encode(gen_random_bytes(4), 'hex'))),
  nama_barang text not null,
  kategori text references kategori_harga(kategori),
  pesanan_id uuid references pesanan(id) on delete set null,
  pengrajin_id uuid references pengrajin(id) on delete set null,
  tgl_tempa date not null default current_date,
  asal_besi text,
  berat_besi_bekas_kg numeric(8,2) check (berat_besi_bekas_kg >= 0),
  cara_rawat text,
  created_at timestamptz not null default now()
);

create table if not exists setoran_besi (
  id uuid primary key default gen_random_uuid(),
  tanggal date not null default current_date,
  sumber text not null,           -- bank sampah / bengkel / lainnya
  berat_kg numeric(8,2) not null check (berat_kg > 0),
  harga int,
  catatan text,
  created_at timestamptz not null default now()
);

create table if not exists log_scan (
  id bigint generated always as identity primary key,
  kode text not null references paspor(kode) on delete cascade,
  waktu timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists pesanan_updated on pesanan;
create trigger pesanan_updated before update on pesanan for each row execute function set_updated_at();

-- ============ RLS ============
alter table admins enable row level security;
alter table pengrajin enable row level security;
alter table kategori_harga enable row level security;
alter table karya enable row level security;
alter table pesanan enable row level security;
alter table paspor enable row level security;
alter table setoran_besi enable row level security;
alter table log_scan enable row level security;

drop policy if exists admins_self on admins;
create policy admins_self on admins for select using (user_id = auth.uid());

drop policy if exists pengrajin_publik on pengrajin;
create policy pengrajin_publik on pengrajin for select using (izin_tampil or is_admin());
drop policy if exists pengrajin_admin on pengrajin;
create policy pengrajin_admin on pengrajin for all using (is_admin()) with check (is_admin());

drop policy if exists kategori_publik on kategori_harga;
create policy kategori_publik on kategori_harga for select using (true);
drop policy if exists kategori_admin on kategori_harga;
create policy kategori_admin on kategori_harga for all using (is_admin()) with check (is_admin());

drop policy if exists karya_publik on karya;
create policy karya_publik on karya for select using (tampil or is_admin());
drop policy if exists karya_admin on karya;
create policy karya_admin on karya for all using (is_admin()) with check (is_admin());

-- pesanan berisi data pribadi: TIDAK ada akses publik. Publik hanya lewat fungsi di bawah.
drop policy if exists pesanan_admin on pesanan;
create policy pesanan_admin on pesanan for all using (is_admin()) with check (is_admin());

drop policy if exists paspor_publik on paspor;
create policy paspor_publik on paspor for select using (true);
drop policy if exists paspor_admin on paspor;
create policy paspor_admin on paspor for all using (is_admin()) with check (is_admin());

drop policy if exists setoran_admin on setoran_besi;
create policy setoran_admin on setoran_besi for all using (is_admin()) with check (is_admin());

drop policy if exists scan_admin on log_scan;
create policy scan_admin on log_scan for select using (is_admin());

-- ============ FUNGSI PUBLIK (RPC) ============

-- Buat pesanan baru. Validasi di sini karena ini batas kepercayaan (input publik).
drop function if exists buat_pesanan(text,text,text,text,text,text,int,text,boolean);
create or replace function buat_pesanan(
  p_nama text, p_no_hp text, p_instansi text, p_kategori text, p_jenis text,
  p_ukuran text, p_jumlah int, p_catatan text, p_setuju_aturan boolean
) returns table (kode text, estimasi_min bigint, estimasi_max bigint)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare
  v_hp text := regexp_replace(coalesce(p_no_hp, ''), '[^0-9]', '', 'g');
  v_kode text;
  v_kat kategori_harga%rowtype;
begin
  v_hp := regexp_replace(v_hp, '^62', '0');
  if not coalesce(p_setuju_aturan, false) then
    raise exception 'Harap setujui aturan pesanan.';
  end if;
  if length(trim(coalesce(p_nama, ''))) not between 2 and 80 then
    raise exception 'Nama wajib diisi (2-80 karakter).';
  end if;
  if length(v_hp) not between 9 and 15 then
    raise exception 'Nomor HP tidak valid.';
  end if;
  if length(trim(coalesce(p_jenis, ''))) not between 2 and 120 then
    raise exception 'Jenis barang wajib diisi (2-120 karakter).';
  end if;
  if p_jumlah is null or p_jumlah not between 1 and 500 then
    raise exception 'Jumlah harus 1-500.';
  end if;
  if length(coalesce(p_ukuran, '')) > 200 or length(coalesce(p_catatan, '')) > 1000
     or length(coalesce(p_instansi, '')) > 120 then
    raise exception 'Isian terlalu panjang.';
  end if;
  select * into v_kat from kategori_harga where kategori = p_kategori;
  if not found then
    raise exception 'Kategori tidak dikenal.';
  end if;
  -- anti-spam: maksimal 5 pesanan per nomor HP per 24 jam
  if (select count(*) from pesanan where no_hp = v_hp and created_at > now() - interval '24 hours') >= 5 then
    raise exception 'Terlalu banyak pesanan dari nomor ini hari ini. Silakan hubungi kami lewat WhatsApp.';
  end if;

  loop
    v_kode := 'PSN-' || upper(encode(extensions.gen_random_bytes(3), 'hex'));
    exit when not exists (select 1 from pesanan where pesanan.kode = v_kode);
  end loop;

  insert into pesanan (kode, nama, no_hp, instansi, kategori, jenis, ukuran, jumlah, catatan, estimasi_min, estimasi_max)
  values (v_kode, trim(p_nama), v_hp, nullif(trim(p_instansi), ''), p_kategori, trim(p_jenis),
          nullif(trim(p_ukuran), ''), p_jumlah, nullif(trim(p_catatan), ''),
          v_kat.harga_mulai::bigint * p_jumlah, v_kat.harga_sampai::bigint * p_jumlah);

  return query select v_kode, v_kat.harga_mulai::bigint * p_jumlah, v_kat.harga_sampai::bigint * p_jumlah;
end; $$;

-- Cek status: wajib kode + 4 digit akhir HP. Tidak mengembalikan nama / nomor HP.
drop function if exists cek_status(text,text);
create or replace function cek_status(p_kode text, p_hp4 text)
returns table (kode text, status text, jenis text, jumlah int, estimasi_min bigint, estimasi_max bigint,
               harga_final int, dp int, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.kode, p.status, p.jenis, p.jumlah, p.estimasi_min, p.estimasi_max, p.harga_final, p.dp, p.updated_at
  from pesanan p
  where p.kode = upper(trim(p_kode))
    and length(p_hp4) = 4
    and right(p.no_hp, 4) = p_hp4;
$$;

create or replace function catat_scan(p_kode text) returns void
language sql security definer set search_path = public as $$
  insert into log_scan (kode)
  select kode from paspor
  where kode = upper(trim(p_kode))
    -- abaikan scan beruntun kode yang sama (<10 detik) agar angka tidak mudah digelembungkan
    and not exists (select 1 from log_scan l where l.kode = paspor.kode and l.waktu > now() - interval '10 seconds');
$$;

-- Angka dampak publik (agregat saja)
create or replace function dampak() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'kg_besi_disetor', coalesce((select sum(berat_kg) from setoran_besi), 0),
    'kg_besi_ditempa', coalesce((select sum(berat_besi_bekas_kg) from paspor), 0),
    'jumlah_barang_berpaspor', (select count(*) from paspor),
    'jumlah_karya', (select count(*) from karya where tampil),
    'jumlah_scan', (select count(*) from log_scan),
    'pesanan_selesai', (select count(*) from pesanan where status in ('dikirim','selesai')),
    'pengrajin', (select count(*) from pengrajin)
  );
$$;

grant execute on function buat_pesanan(text,text,text,text,text,text,int,text,boolean) to anon, authenticated;
grant execute on function cek_status(text,text) to anon, authenticated;
grant execute on function catat_scan(text) to anon, authenticated;
grant execute on function dampak() to anon, authenticated;

-- ============ STORAGE (foto karya & pengrajin) ============
insert into storage.buckets (id, name, public) values ('foto', 'foto', true)
on conflict (id) do nothing;

drop policy if exists foto_admin_insert on storage.objects;
create policy foto_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'foto' and is_admin());
drop policy if exists foto_admin_select on storage.objects;
create policy foto_admin_select on storage.objects for select to authenticated
  using (bucket_id = 'foto' and is_admin());
drop policy if exists foto_admin_update on storage.objects;
create policy foto_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'foto' and is_admin());
drop policy if exists foto_admin_delete on storage.objects;
create policy foto_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'foto' and is_admin());

-- ============ DATA AWAL KATEGORI ============
-- Kisaran harga NULL = belum diisi; isi lewat halaman Admin setelah wawancara pengrajin.
insert into kategori_harga (kategori, label, urutan) values
  ('alat_tani',  'Alat Tani & Kebun', 1),
  ('pertukangan','Pertukangan', 2),
  ('dapur',      'Dapur', 3),
  ('rumah_dekor','Rumah & Dekorasi', 4),
  ('suvenir',    'Suvenir & Cendera Mata', 5),
  ('khusus',     'Pesanan Khusus', 6)
on conflict (kategori) do nothing;
