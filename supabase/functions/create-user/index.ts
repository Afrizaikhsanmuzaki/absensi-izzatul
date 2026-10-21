import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized: Tidak ada token login yang dikirim dari browser.');
    }

    // Ekstrak JWT token murni dengan memotong kata 'Bearer '
    const token = authHeader.replace('Bearer ', '');

    // 1. Inisialisasi client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 2. Verifikasi sesi Admin (Masukkan token secara paksa dan langsung ke dalam getUser)
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error(`Unauthorized: Sesi tidak valid. Detail: ${authError?.message}`);
    }

    // 3. Tangkap Data dari React
    const payload = await req.json()
    const { username, name, role, status, is_admin, password } = payload

    // 4. Gunakan Akses Root (Service Role)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 5. Buat Akun Auth Login
    const { error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: `${username}@izzatulislam.com`,
      password: password,
      email_confirm: true,
    })
    if (createAuthError) throw new Error(`Gagal membuat otentikasi: ${createAuthError.message}`)

    // 6. Masukkan ke Tabel Pegawai
    const { error: dbError } = await supabaseAdmin.from('pegawai').insert([{
      username, name, role, status, is_admin
    }])
    if (dbError) throw new Error(`Gagal menyimpan data ke tabel: ${dbError.message}`)

    return new Response(JSON.stringify({ message: 'Pegawai berhasil didaftarkan' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})