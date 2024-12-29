const mysql = require('mysql2');

// 创建数据库连接
const connection = mysql.createConnection({
    host: 'localhost', // 数据库主机
    user: 'root', // 数据库用户名
    password: 'root', // 数据库密码
    database: 'node_music' // 数据库名称
});

// 连接到数据库
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = connection;