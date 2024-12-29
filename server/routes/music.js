const express = require('express');
const router = express.Router();
const Music = require('../models/music');

// 获取所有音乐
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page); // 获取页码
    const limit = 10; // 每页返回的数量
    const offset = page ? (page - 1) * limit : 0; // 计算偏移量，如果没有页码则为0

    try {
        if (isNaN(page)) {
            // 如果没有提供 page 参数，返回所有音乐
            const musicList = await Music.getAll(); // 获取所有音乐
            const total = musicList.length; // 计算总数
            return res.json(musicList); // 返回总数和音乐数据
        } else {
            // 如果提供了 page 参数，返回分页数据
            const [musicList, total] = await Promise.all([
                Music.getAll(limit, offset), // 获取当前页的音乐
                Music.getTotalCount() // 获取总记录数
            ]);
            return res.json({ total, musicList }); // 返回总数和音乐数据
        }
    } catch (error) {
        res.status(500).json({ message: '获取音乐失败', error });
    }
});
// 添加音乐
router.post('/', async (req, res) => {
    try {
        const musicData = req.body;
        const result = await Music.addMusic(musicData);
        res.status(201).json({ message: '音乐添加成功', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: '添加音乐失败', error });
    }
});


// 查询音乐的接口
router.get('/search', (req, res) => {
    const { title, genres, composers } = req.query;
  
    // 构建 SQL 查询
    let sql = 'SELECT * FROM music WHERE 1=1';
    const params = [];
  
    if (title) {
      sql += ' AND title LIKE ?';
      params.push(`%${title}%`);
    }
  
    if (genres && genres.length > 0) {
      sql += ' AND genreName IN (?)';
      params.push(genres);
    }
  
    if (composers && composers.length > 0) {
      sql += ' AND composerName IN (?)';
      params.push(composers);
    }
  
    db.query(sql, [params], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: '数据库查询失败' });
      }
      res.json(results);
    });
  });
  
// 更新音乐
router.put('/:id', async (req, res) => {
    try {
        const musicId = req.params.id;
        const musicData = req.body;
        await Music.updateMusic(musicId, musicData);
        res.json({ message: '音乐更新成功' });
    } catch (error) {
        res.status(500).json({ message: '更新音乐失败', error });
    }
});

// 删除音乐
router.delete('/:id', async (req, res) => {
    try {
        const musicId = req.params.id;
        await Music.deleteMusic(musicId);
        res.json({ message: '音乐删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除音乐失败', error });
    }
});

// 获取单个音乐信息
router.get('/:id', async (req, res) => {
    try {
        const musicId = req.params.id;
        const music = await Music.getMusicById(musicId);
        res.json(music);
    } catch (error) {
        res.status(500).json({ message: '获取音乐信息失败', error });
    }
});

module.exports = router;