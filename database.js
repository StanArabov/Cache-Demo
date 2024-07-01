import pkg from 'pg';
import 'dotenv/config';

// dotenv.config();
const { Pool } = pkg;

const database = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: `${process.env.PG_PASSWORD}`,
    port: process.env.PG_PORT
});

export default database;