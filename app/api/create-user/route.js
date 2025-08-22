import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password, name, username } = await request.json()

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 1. Create user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { name }
    })

    if (authError) {
      console.error('Auth create error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // 2. Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: authData.user.id,
        username,
        name,
        avatar_url: null
      }])

    if (profileError) {
      console.error('Profile create error:', profileError)
      // Clean up: delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      userId: authData.user.id,
      message: 'User created successfully' 
    })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}