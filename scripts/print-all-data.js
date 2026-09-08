const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'abcd',
};

const databases = ['auth_db', 'crm_db', 'fleet_db', 'rental_db', 'analytics_db', 'ai_db'];

async function printAllData() {
  console.log('===========================================================');
  console.log('🚜 CAT FleetBrain AI - Printing All MySQL Database Records');
  console.log('===========================================================');

  try {
    const connection = await mysql.createConnection(dbConfig);

    for (const dbName of databases) {
      console.log(`\n📁 DATABASE: [ ${dbName} ]`);
      console.log('-----------------------------------------------------------');

      // Get tables in database
      const [tables] = await connection.query(`SHOW TABLES FROM \`${dbName}\`;`);

      if (tables.length === 0) {
        console.log(`  (No tables found in ${dbName})`);
        continue;
      }

      for (const tableObj of tables) {
        const tableName = Object.values(tableObj)[0];
        const [rows] = await connection.query(`SELECT * FROM \`${dbName}\`.\`${tableName}\`;`);

        console.log(`\n  📄 Table: ${tableName} (${rows.length} rows)`);
        if (rows.length > 0) {
          console.table(rows);
        } else {
          console.log('     [Table is empty]');
        }
      }
    }

    await connection.end();
    console.log('\n===========================================================');
    console.log('✅ Printed records from all microservice databases!');
    console.log('===========================================================');
  } catch (error) {
    console.error('❌ Error reading MySQL data:', error.message);
  }
}

printAllData();
