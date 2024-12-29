const db = require('../config/db')

const Composer = {
  getAll: async (limit, offset) => {
    let query = `
        SELECT c.*, g.name AS genre_name 
        FROM composers c
        LEFT JOIN genres g ON c.genre = g.id`; // 默认查询所有作曲家
    const params = [];

    if (limit !== undefined && offset !== undefined) {
        query += ' LIMIT ? OFFSET ?'; // 添加 LIMIT 和 OFFSET
        params.push(limit, offset);
    }

    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
},
  getTotalCount: async () => {
    const query = 'SELECT COUNT(*) AS total FROM composers' // 查询总记录数
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err)
        resolve(results[0].total) // 返回总数
      })
    })
  },
  getById: async (composerId) => {
    const query = 'SELECT c.*, g.name AS genre FROM composers c LEFT JOIN genres g ON c.id = g.id WHERE c.id = ?'
    return new Promise((resolve, reject) => {
      db.query(query, [composerId], (err, results) => {
        if (err) return reject(err)
        resolve(results[0]) // 返回单个作曲家
      })
    })
  },
  addComposer: async (composerData) => {
    const query = 'INSERT INTO composers (name, id,genre, birth_date, death_date, number_works, country, bio, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    console.log(composerData)

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [
          composerData.name,
          composerData.id,
          composerData.genre,
          composerData.birth_date,
          composerData.death_date,
          composerData.number_works,
          composerData.country,
          composerData.bio,
          composerData.image_path
        ],
        (err, results) => {
          if (err) return reject(err)
          resolve(results)
        }
      )
    })
  },
  updateComposer: async (composerId, composerData) => {
    const query =
      'UPDATE composers SET name = ?, id = ?, genre = ?, birth_date = ?, death_date = ?, number_works = ?, country = ?, bio = ?, image_path = ? WHERE id = ?'
    return new Promise((resolve, reject) => {
      db.query(
        query,
        [
          composerData.name,
          composerId,
          composerData.genre,
          composerData.birth_date,
          composerData.death_date,
          composerData.number_works,
          composerData.country,
          composerData.bio,
          composerData.image_path,
          composerId
        ],
        (err, results) => {
          if (err) return reject(err)
          resolve(results)
        }
      )
    })
  },
  deleteComposer: async (composerId) => {
    const query = 'DELETE FROM composers WHERE id = ?'
    return new Promise((resolve, reject) => {
      db.query(query, [composerId], (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }
}

module.exports = Composer
