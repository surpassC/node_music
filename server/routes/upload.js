const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

// 设置 multer 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // 上传文件存储的目录
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname)) // 使用唯一的文件名
  }
})

// 创建 multer 实例
const upload = multer({storage: storage})

// 图片上传接口
router.post('/', upload.single('image'), (req, res) => {
  console.log(req.file)
  if (!req.file) {
    return res.status(400).json({message: '没有上传文件'})
  }
  // 返回上传的文件路径
  res.json({url: `http://localhost:3000/uploads/${req.file.filename}`}) // 根据您的服务器配置调整 URL
})
// 音频上传接口
router.post('/audio', upload.single('audio'), (req, res) => {
  console.log(req.file)
  if (!req.file) {
    return res.status(400).json({message: '没有上传文件'})
  }
  // 返回上传的文件路径
  res.json({url: `http://localhost:3000/uploads/${req.file.filename}`}) // 根据您的服务器配置调整 URL
})

module.exports = router
