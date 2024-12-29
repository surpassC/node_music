const express = require('express')
const router = express.Router()
const db = require('../config/db')
const Genre = require('../models/genre')

// 获取所有流派
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) // 获取页码
  const limit = 10 // 每页返回的数量
  const offset = page ? (page - 1) * limit : 0 // 计算偏移量，如果没有页码则为0

  try {
    if (isNaN(page)) {
      // 如果没有提供 page 参数，返回所有流派
      const genres = await Genre.getAll() // 获取所有流派
      const total = genres.length // 计算总数
      return res.json(genres) // 返回总数和流派数据
    } else {
      // 如果提供了 page 参数，返回分页数据
      const [genres, total] = await Promise.all([
        Genre.getAll(limit, offset), // 获取当前页的流派
        Genre.getTotalCount() // 获取总记录数
      ])
      return res.json({total, genres}) // 返回总数和流派数据
    }
  } catch (error) {
    res.status(500).json({message: '获取流派失败', error})
  }
})
router.get('/genre-data', async (req, res) => {
  const genreName = req.query.genre // 从请求中获取流派名称

  try {
    const [workData, countryData] = await Promise.all([
      // 获取作品数量和作曲家数量
      db.query(
        `SELECT 
                        g.name AS genreName,
                        COUNT(m.id) AS workCount,
                        COUNT(DISTINCT c.id) AS composerCount
                      FROM 
                        music m
                      JOIN 
                        composers c ON m.composers_id = c.id
                      JOIN 
                        genres g ON m.genre_id = g.id
                      WHERE 
                        g.name = ?
                      GROUP BY 
                        g.name;`,
        [genreName]
      ),

      // 获取各国作曲家数量
      db.query(
        `SELECT 
                        c.country,
                        COUNT(c.id) AS composerCount
                      FROM 
                        composers c
                      JOIN 
                        music m ON c.id = m.composers_id
                      JOIN 
                        genres g ON m.genre_id = g.id
                      WHERE 
                        g.name = ?
                      GROUP BY 
                        c.country;`,
        [genreName]
      )
    ])

    res.json({workData, countryData})
  } catch (error) {
    res.status(500).json({message: '获取数据失败', error})
  }
})

// 获取单个流派
router.get('/:id', async (req, res) => {
  const genreId = req.params.id
  const query = 'SELECT * FROM genres WHERE id = ?'
  db.query(query, [genreId], (err, results) => {
    if (err) return res.status(500).json({message: '获取流派失败', error: err})
    if (results.length === 0) return res.status(404).json({message: '流派未找到'})
    res.json(results[0])
  })
})

// 添加流派
router.post('/', async (req, res) => {
  const {name, description, image_path} = req.body
  const query = 'INSERT INTO genres (name, description, image_path) VALUES (?, ?, ?)'
  db.query(query, [name, description, image_path], (err, results) => {
    if (err) return res.status(500).json({message: '添加流派失败', error: err})
    res.status(201).json({message: '流派添加成功'})
  })
})

// 更新流派
router.put('/:id', async (req, res) => {
  const genreId = req.params.id
  const {name, description, image_path} = req.body
  const query = 'UPDATE genres SET name = ?, description = ?, image_path = ? WHERE id = ?'
  db.query(query, [name, description, image_path, genreId], (err, results) => {
    if (err) return res.status(500).json({message: '更新流派失败', error: err})
    if (results.affectedRows === 0) return res.status(404).json({message: '流派未找到'})
    res.json({message: '流派更新成功'})
  })
})

// 删除流派
// 删除流派
// routes/genre.js
router.delete('/:id', async (req, res) => {
  const genreId = req.params.id

  try {
    // 1. 删除与该流派相关的音乐
    const result = db.query('DELETE FROM genres WHERE id = ?', [genreId])

    if (result.affectedRows === 0) {
      return res.status(404).json({message: '流派未找到'})
    }

    res.json({message: '流派及其相关音乐和作曲家删除成功'})
  } catch (error) {
    
    res.status(500).json({message: '删除流派失败', error})
  }
})
module.exports = router
