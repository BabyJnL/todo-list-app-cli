// ========================== [Importing MySQL module] ==========================
import mysql from 'mysql2';

// Connection configuration
const db = mysql.createConnection({
    host: 'YOUR_HOSTNAME',
    user: 'YOUR_USERNAME',
    password: 'YOUR_PASSWORD',
    database: 'YOUR_DATABASE'
});

export default db;