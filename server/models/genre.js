const db = require('../config/db')

const Genre = {
  // 在 Genre 模型中更新 getAll 方法以支持无参数查询
  getAll: async (limit, offset) => {
    let query = 'SELECT * FROM genres' // 默认查询所有流派
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

  // 在 Genre 模型中添加获取总记录数的方法
  getTotalCount: async () => {
    const query = 'SELECT COUNT(*) AS total FROM genres' // 查询总记录数
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) return reject(err)
        resolve(results[0].total) // 返回总数
      })
    })
  }
}

module.exports = Genre
