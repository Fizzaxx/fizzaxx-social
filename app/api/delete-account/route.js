import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { userId } = await request.json()

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Delete user from auth (requires service role)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) throw authError

    return NextResponse.json({ success: true, message: 'Account deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}