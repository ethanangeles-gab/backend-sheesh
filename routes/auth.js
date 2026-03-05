import express from 'express'
import { supabase } from '../supabase.js'

const router = express.Router()

// SIGN UP
router.post('/signup', async (req, res) => {
  const { email, password, full_name, phone_number, role = 'CUSTOMER' } = req.body

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return res.status(400).json({ error: error.message })

  const { error: profileError } = await supabase.from('user_profiles').insert({
    user_id: data.user.id,
    full_name,
    phone_number,
    role,
    is_verified: false,
    terms_accepted_at: new Date().toISOString()
  })

  if (profileError) return res.status(500).json({ error: profileError.message })

  return res.status(201).json({
    message: 'Signup successful',
    user: data.user,
    session: data.session
  })
})

// LOG IN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(401).json({ error: error.message })

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    token_type: 'bearer',
    user: {
      id: data.user.id,
      email: data.user.email
    }
  })
})

// REFRESH TOKEN
router.post('/token/refresh_token', async (req, res) => {
  const { refresh_token } = req.body

  const { data, error } = await supabase.auth.refreshSession({ refresh_token })
  if (error) return res.status(401).json({
    error: 'invalid_grant',
    message: 'Refresh token expired or revoked'
  })

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: 3600
  })
})

// SIGN OUT
router.post('/signout', async (req, res) => {
  const { error } = await supabase.auth.signOut()
  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ message: 'Signed out successfully' })
})

export default router