const mysql = require('mysql2');


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'MovieSequelsUsuallySuck420',
    database: 'employee_db'
  }
)
// .then((connection) => {
//   db = connection;
//   console.log(`Connected to the employee_db database.`)
// });

module.exports = db;