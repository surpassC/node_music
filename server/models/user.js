const db = require('../config/db');

const User = {
    create: async (username, password) => {
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [username, password], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    findByUsername: async (username) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [username], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // 返回第一个匹配的用户
            });
        });
    },
    findById: async (id) => {
        const query = 'SELECT id, username, created_at FROM users WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // 返回用户信息
            });
        });
    }
};

module.exports = User;