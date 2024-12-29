const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = {
    findByUsername: async (username) => {
        const query = 'SELECT * FROM admins WHERE username = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [username], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // 返回第一个匹配的管理员
            });
        });
    },
};

module.exports = Admin;