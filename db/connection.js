const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

let config = {}; 

if (ENV === "production") {
  config = {
    connectionString: process.env.DATABASE_URL,
    max: 2,
    ssl: {
      rejectUnauthorized: false,
    },
  };
  console.log(`Connected to production DB`);
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

const db = new Pool(config); 
module.exports = db;