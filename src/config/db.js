const pgp = require('pg-promise')()

require('dotenv').config({
  override: true,
  path:  '.env',
  //debug: true,
  encoding: 'utf-8'
});

const db = pgp("postgres://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_HOST+":"+process.env.DB_PORT+"/"+process.env.DB_NAME+"");

//TESTE
//db.query('select * from companies').then((result) => console.log(result));

module.exports = db;