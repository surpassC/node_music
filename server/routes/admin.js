const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Admin = require('../models/admin'); // 引入管理员模型
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 管理员登录
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findByUsername(username);
    if (admin.password == password) {
        res.json({ admin });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
