import express from 'express'
import { supabase } from '../supabase.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/api/v1/homepage', authenticate, async (req, res) => {
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('role, full_name, is_verified')
    .eq('user_id', req.user.id)
    .single()

  if (error || !profile) {
    return res.status(404).json({ redirect: '/complete-profile' })
  }

  switch (profile.role) {
    case 'CUSTOMER':
      return res.status(200).json({
        role: profile.role,
        full_name: profile.full_name,
        redirect_path: '/customer/dashboard',
        server_time: new Date().toISOString()
      })
    case 'DRIVER':
      return res.status(200).json({
        role: profile.role,
        full_name: profile.full_name,
        redirect_path: '/driver/app',
        server_time: new Date().toISOString()
      })
    case 'OPERATOR':
      return res.status(200).json({
        role: profile.role,
        full_name: profile.full_name,
        redirect_path: '/operator/drop-off-dashboard',
        server_time: new Date().toISOString()
      })
    default:
      return res.status(403).json({
        error: 'unsupported_role',
        action: 'block_access',
        redirect: '/unauthorized'
      })
  }
})

export default router