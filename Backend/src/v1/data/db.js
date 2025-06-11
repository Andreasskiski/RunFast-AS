const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: DB_PASSWORD,
    database: 'RunFastAS',
    waitForConnections: true, 
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = {
    pool
}