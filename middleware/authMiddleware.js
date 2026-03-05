import { supabase } from '../supabase.js'

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    })
  }

  const token = authHeader.split(' ')[1]

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    })
  }

  req.user = user
  req.token = token
  next()
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.userProfile?.role
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Access denied: insufficient role permissions'
      })
    }
    next()
  }
}