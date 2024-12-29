const db = require('../config/db')

const Music = {
  // 获取所有音乐
  getAll: async (limit, offset) => {
    let query = `SELECT *,
        m.id,
        m.title,
        GROUP_CONCAT(DISTINCT c.name) AS composerName,
        GROUP_CONCAT(DISTINCT g.name) AS genreName,
        m.information,
        m.photo_path,
        m.file_path
    FROM 
        music m
    LEFT JOIN 
        composers c ON m.composers_id = c.id
    LEFT JOIN 
        genres g ON m.genre_id = g.id
    GROUP BY 
        m.id` // 默认查询所有音乐
    const params = []

    if (limit !== undefined && offset !== undefined) {
      query += ' LIMIT ? OFFSET ?' // 添加 LIMIT 和 OFFSET
      params.push(limit, offset)
    }

    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  },
  // 在 Music 模型中添加获取总记录数的方法
  getTotalCount: async () => {
    const query = 'SELECT COUNT(*) AS total FROM music' // 查询总记录数
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err)
        resolve(results[0].total) // 返回总数
      })
    })
  },

  // 添加音乐
  addMusic: async (musicData) => {
    const query = 'INSERT INTO music (title, composers_id, genre_id, information,photo_path, file_path) VALUES (?, ?, ?, ?, ?, ?)'
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [musicData.title, musicData.composers_id, musicData.genre_id, musicData.information, musicData.photo_path, musicData.file_path],
        (err, results) => {
          if (err) return reject(err)
          resolve(results)
        }
      )
    })
  },

  // 更新音乐
  updateMusic: async (musicId, musicData) => {
    const query = 'UPDATE music SET title = ?, composers_id = ?, genre_id = ?, information = ?, photo_path = ?, file_path = ? WHERE id = ?'
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [musicData.title, musicData.composers_id, musicData.genre_id, musicData.information, musicData.photo_path, musicData.file_path, musicId],
        (err, results) => {
          if (err) return reject(err)
          resolve(results)
        }
      )
    })
  },

  // 删除音乐
  deleteMusic: async (musicId) => {
    const query = 'DELETE FROM music WHERE id = ?'
    return new Promise((resolve, reject) => {
      db.query(query, [musicId], (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  },

  // 获取单个音乐信息
  getMusicById: async (musicId) => {
    const query = 'SELECT * FROM music WHERE id = ?'
    return new Promise((resolve, reject) => {
      db.query(query, [musicId], (err, results) => {
        if (err) return reject(err)
        resolve(results[0]) // 返回单个音乐对象
      })
    })
  }
}

module.exports = Music
