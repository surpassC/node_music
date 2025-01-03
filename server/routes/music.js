const express = require('express');
const router = express.Router();
const Music = require('../models/music');

// 收藏相关的路由
router.post('/favorite', async (req, res) => {
    try {
        const { user_id, music_id } = req.body;
        await Music.addFavorite(user_id, music_id);
        res.status(201).json({ message: '收藏成功' });
    } catch (error) {
        res.status(500).json({ message: '收藏失败', error });
    }
});

// 取消收藏音乐
router.delete('/favorite', async (req, res) => {
    try {
        const { user_id, music_id } = req.query;
        await Music.removeFavorite(user_id, music_id);
        res.json({ message: '取消收藏成功' });
    } catch (error) {
        res.status(500).json({ message: '取消收藏失败', error });
    }
});

// 获取用户收藏的音乐列表
router.get('/favorites/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const favorites = await Music.getUserFavorites(userId);
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: '获取收藏列表失败', error });
    }
});

// 通用的音乐CRUD路由
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page); // 获取页码
    const limit = 10; // 每页返回的数量
    const offset = page ? (page - 1) * limit : 0; // 计算偏移量，如果没有页码则为0
    const userId = req.query.userId; // 获取用户ID
    
    try {
        if (isNaN(page)) {
            // 如果没有提供 page 参数，返回所有音乐
            const musicList = await Music.getAll(limit, offset, userId); // 获取所有音乐
            const total = musicList.length; // 计算总数
            return res.json({data:musicList,total:total}); // 返回总数和音乐数据
        } else {
            // 如果提供了 page 参数，返回分页数据
            const [musicList, total] = await Promise.all([
                Music.getAll(limit, offset, userId), // 获取当前页的音乐
                Music.getTotalCount() // 获取总记录数
            ]);
            return res.json({ total, data: musicList }); // 返回总数和音乐数据
        }
    } catch (error) {
        res.status(500).json({ message: '获取音乐失败', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const musicId = req.params.id;
        const music = await Music.getMusicById(musicId);
        res.json(music);
    } catch (error) {
        res.status(500).json({ message: '获取音乐信息失败', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const musicData = req.body;
        const result = await Music.addMusic(musicData);
        res.status(201).json({ message: '音乐添加成功', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: '添加音乐失败', error });
    }
});

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

router.delete('/:id', async (req, res) => {
    try {
        const musicId = req.params.id;
        await Music.deleteMusic(musicId);
        res.json({ message: '音乐删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除音乐失败', error });
    }
});

module.exports = router;