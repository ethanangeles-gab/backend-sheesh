import express from 'express'
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import homepageRoutes from './routes/homepage.js'

const app = express()
app.use(express.json())

// Welcome / App Entry
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to pakiShip 🚚', status: 'running' })
})

// Routes
app.use('/auth', authRoutes)
app.use('/', profileRoutes)
app.use('/', homepageRoutes)

// 503 fallback
app.use((err, req, res, next) => {
  console.error(err)
  res.status(503).json({
    statusCode: 503,
    error: 'Service Unavailable',
    message: 'Backend is temporarily down'
  })
})

app.listen(3000, () => console.log('🚀 pakiShip backend running on port 3000'))