const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Intheghetto7',
  database: 'ManagementProject'
});

// Connect to the database
function connect() {
  connection.connect(error => {
    if (error) {
      console.error('Failed to connect to the database:', error);
      return;
    }
    console.log('Connected to the database');
  });
}

// Disconnect from the database
function disconnect() {
  connection.end(error => {
    if (error) {
      console.error('Failed to disconnect from the database:', error);
      return;
    }
    console.log('Disconnected from the database');
  });
}

module.exports = connection;