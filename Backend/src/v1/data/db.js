const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'RunFastAS',
    waitForConnections: true, 
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = {
    pool
}