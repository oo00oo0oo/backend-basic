// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Youtube',
  dateStrings : true
});

// A simple SELECT query
connection.query(
  'SELECT * FROM `users`',
  function (err, results, fields) {
    const {id,email,name,password,contact, created_at} = results[0]

    console.log(id)
    console.log(email)
    console.log(name)
    console.log(password)
    console.log(contact)
    console.log(created_at)


    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);

// Using placeholders
connection.query(
  'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
  ['Page', 45],
  function (err, results) {
    console.log(results);
  }
);