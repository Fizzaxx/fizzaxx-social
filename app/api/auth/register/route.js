import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { email, password, name, username } = await request.json()

    console.log('Creating user:', { email, name, username })

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username
        }
      }
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create profile in database (WITHOUT email column)
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: authData.user.id,
          username: username,
          name: name,
          avatar_url: null
          // REMOVED: email: email - we don't have this column!
        }])

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Clean up auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    console.log('User created successfully:', authData.user.id)
    return NextResponse.json({ success: true, user: authData.user })

  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}