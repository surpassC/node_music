const express = require('express')
const cors = require('cors') // 引入 cors
const app = express()
const path = require('path')
const authRoutes = require('./routes/auth')
const musicRoutes = require('./routes/music')
const genreRoutes = require('./routes/genre') // 引入流派路由
const adminRoutes = require('./routes/admin')
const composerRoutes = require('./routes/composer')
const uploadRoutes = require('./routes/upload') // 引入上传路由
const dataShowRoutes = require('./routes/dataShow')

app.use(cors()) // 使用 CORS 中间件
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/upload', uploadRoutes) // 使用上传路由
app.use('/api/auth', authRoutes)
app.use('/api/music', musicRoutes)
app.use('/api/genres', genreRoutes) // 使用流派路由
app.use('/api/admin', adminRoutes)
app.use('/api/composers', composerRoutes) 

app.use('/api/dataShow', dataShowRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
})
