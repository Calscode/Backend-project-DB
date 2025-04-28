const db = require('./connection')
const seedPage = require('./seeds/seed')
const index = require('./data/development-data/index')

db.query('SELECT * FROM users;')
.then((response) => {
    console.log('\n1. All users:');
    console.table(response.rows);
})