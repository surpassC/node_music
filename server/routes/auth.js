const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user'); // 引入用户模型

// 用户注册
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await User.create(username, hashedPassword);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// 获取用户信息
router.get('/userinfo', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // 从请求头中获取 token
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ id: user.id, username: user.username, created_at: user.created_at });
    });
});

module.exports = router;
