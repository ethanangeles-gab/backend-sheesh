import express from 'express'
import { supabase } from '../supabase.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET PROFILE
router.get('/api/v1/me', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', req.user.id)
    .single()

  if (error || !data) {
    return res.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: 'No profile found for this user'
    })
  }

  return res.status(200).json({
    userProfile: {
      user_id: data.user_id,
      full_name: data.full_name,
      phone_number: data.phone_number,
      role: data.role,
      is_verified: data.is_verified,
      terms_accepted_at: data.terms_accepted_at,
      metadata: data.metadata
    }
  })
})

// COMPLETE / UPDATE PROFILE
router.post('/api/v1/me/complete', authenticate, async (req, res) => {
  const { full_name, phone_number, role, metadata } = req.body

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: req.user.id,
      full_name,
      phone_number,
      role,
      metadata,
      terms_accepted_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json({ message: 'Profile completed', profile: data })
})

export default router