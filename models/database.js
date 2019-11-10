const Knex   = require('knex');
const dotenv = require('dotenv').config({ path: `${__dirname}/../.env` })

const knex = Knex({
	client: 'mysql',
	useNullAsDefault: true,
	connection: {
		host     : process.env.DB_HOST,
		database : process.env.DB_NAME,
		user     : process.env.DB_USER,
		password : process.env.DB_PASS,
		supportBigNumbers: true
	}
});

module.exports = knex