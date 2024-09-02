const sql = require('msnodesqlv8');

const connectionString = 'server=localhost;Database=SeoAnalyzer;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}';

const poolPromise = new Promise((resolve, reject) => {
  sql.open(connectionString, (err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
      return reject(err);
    }
    console.log('Connected to SQL Server using Windows Authentication');
    resolve(connection);
  });
});

module.exports = {
  sql,
  poolPromise
};

