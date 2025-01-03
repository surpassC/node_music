const db = require('../config/db')

const Music = {
  // 获取所有音乐
  getAll: async (limit, offset, userId = null) => {
    // 第一次查询：获取所有音乐基本信息
    let query = `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT c.name) AS composerName,
        GROUP_CONCAT(DISTINCT g.name) AS genreName
      FROM 
        music m
      LEFT JOIN 
        composers c ON m.composers_id = c.id
      LEFT JOIN 
        genres g ON m.genre_id = g.id
      GROUP BY 
        m.id`;

    const params = [];

    if (limit !== undefined && offset !== undefined) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    return new Promise((resolve, reject) => {
      db.query(query, params, async (err, results) => {
        if (err) return reject(err);

        // 调试日志：打印用户ID
        console.log('处理用户ID:', userId);

        if (!userId) {
          console.log('没有用户ID，返回全部未收藏状态');
          const processedResults = results.map(row => ({
            ...row,
            isFavorite: false
          }));
          return resolve(processedResults);
        }

        // 第二次查询：获取用户的收藏列表
        const favoriteQuery = 'SELECT music_id FROM favorites WHERE user_id = ?';
        console.log('执行收藏查询，用户ID:', userId);
        
        db.query(favoriteQuery, [userId], (err, favorites) => {
          if (err) return reject(err);

          // 调试日志：打印收藏数据
          console.log('查询到的收藏:', favorites);

          // 创建收藏音乐ID的集合
          const favoriteIds = new Set(favorites.map(f => f.music_id));
          console.log('收藏ID集合:', Array.from(favoriteIds));

          // 处理结果，添加收藏状态
          const processedResults = results.map(row => ({
            ...row,
            isFavorite: favoriteIds.has(row.id)
          }));

          // 调试日志：打印处理后的结果
          console.log('处理后的结果示例:', processedResults[0]);

          resolve(processedResults);
        });
      });
    });
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
  },

  // 添加收藏
  addFavorite: async (userId, musicId) => {
    const query = 'INSERT INTO favorites (user_id, music_id, created_at) VALUES (?, ?, NOW())'
    return new Promise((resolve, reject) => {
      db.query(query, [userId, musicId], (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  },

  // 取消收藏
  removeFavorite: async (userId, musicId) => {
    const query = 'DELETE FROM favorites WHERE user_id = ? AND music_id = ?'
    return new Promise((resolve, reject) => {
      db.query(query, [userId, musicId], (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  },

  // 获取用户收藏列表
  getUserFavorites: async (userId) => {
    const query = `
      SELECT m.*, 
             GROUP_CONCAT(DISTINCT c.name) AS composerName,
             GROUP_CONCAT(DISTINCT g.name) AS genreName
      FROM music m
      INNER JOIN favorites f ON m.id = f.music_id
      LEFT JOIN composers c ON m.composers_id = c.id
      LEFT JOIN genres g ON m.genre_id = g.id
      WHERE f.user_id = ?
      GROUP BY m.id`
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }
}

module.exports = Music
