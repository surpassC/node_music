const express = require('express')
const router = express.Router()
const Composer = require('../models/composer') // 引入 Composer 模型
const db = require('../config/db')

// 获取所有作曲家
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) // 获取页码
  const limit = 10 // 每页返回的数量
  const offset = page ? (page - 1) * limit : 0 // 计算偏移量，如果没有页码则为0

  try {
    if (isNaN(page)) {
      // 如果没有提供 page 参数，返回所有作曲家
      const composers = await Composer.getAll() // 获取所有作曲家
      return res.json(composers) // 返回总数和作曲家数据
    } else {
      // 如果提供了 page 参数，返回分页数据
      const [composers, total] = await Promise.all([
        Composer.getAll(limit, offset), // 获取当前页的作曲家
        Composer.getTotalCount() // 获取总记录数
      ])
      return res.json({total, composers}) // 返回总数和作曲家数据
    }
  } catch (error) {
    res.status(500).json({message: '获取作曲家失败', error})
  }
})

router.get('/getGenreType', async (req, res) => {
  const genreId = req.query.genre // 从请求中获取流派 ID

  const query = `SELECT * FROM composers WHERE genre = ?`

  try {
    db.query(query, [genreId], (err, results) => {
      if (err) return res.status(500).json({message: '获取作曲家失败', error: err})
      res.json(results)
    })
  } catch (error) {
    console.error('获取作曲家失败:', error) // 使用 console.error 打印错误信息
    res.status(500).json({message: '获取作曲家失败', error})
  }
})

// 根据 ID 获取作曲家
router.get('/:id', async (req, res) => {
  const composerId = req.params.id
  try {
    const composer = await Composer.getById(composerId)
    if (composer) {
      res.json(composer)
    } else {
      res.status(404).json({message: '作曲家未找到'})
    }
  } catch (error) {
    res.status(500).json({message: '获取作曲家失败', error})
  }
})

// 添加作曲家
router.post('/', async (req, res) => {
  const {name, genre, birth_date, death_date, number_works, country, bio, image_path} = req.body

  // 格式化日期
  const formattedBirthDate = birth_date ? new Date(birth_date).toISOString().split('T')[0] : null
  const formattedDeathDate = death_date ? new Date(death_date).toISOString().split('T')[0] : null

  try {
    await Composer.addComposer({name, genre, birth_date: formattedBirthDate, death_date: formattedDeathDate, number_works, country, bio, image_path})
    res.status(201).json({message: '作曲家添加成功'})
  } catch (error) {
    console.log(error)

    res.status(500).json({message: '添加作曲家失败', error})
  }
})

// 更新作曲家
router.put('/:id', async (req, res) => {
  const composerId = req.params.id
  const {name, genre, birth_date, death_date, number_works, country, bio, image_path} = req.body

  // 格式化日期
  const formattedBirthDate = birth_date ? new Date(birth_date).toISOString().split('T')[0] : null
  const formattedDeathDate = death_date ? new Date(death_date).toISOString().split('T')[0] : null

  try {
    const result = await Composer.updateComposer(composerId, {
      name,
      genre,
      birth_date: formattedBirthDate,
      death_date: formattedDeathDate,
      number_works,
      country,
      bio,
      image_path
    })
    if (result.affectedRows > 0) {
      res.json({message: '作曲家更新成功'})
    } else {
      res.status(404).json({message: '作曲家未找到'})
    }
  } catch (error) {
    res.status(500).json({message: '更新作曲家失败', error})
  }
})

// 删除作曲家
router.delete('/:id', async (req, res) => {
  const composerId = req.params.id
  try {
    const result = await Composer.deleteComposer(composerId)
    if (result.affectedRows > 0) {
      res.json({message: '作曲家删除成功'})
    } else {
      res.status(404).json({message: '作曲家未找到'})
    }
  } catch (error) {
    res.status(500).json({message: '删除作曲家失败', error})
  }
})

module.exports = router
