import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { userId, username, name } = await request.json()

    // Use service role key on server side where it's available
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error } = await supabaseAdmin.rpc('create_user_profile', {
      user_id: userId,
      user_username: username,
      user_name: name
    })

    if (error) {
      console.error('Profile creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}