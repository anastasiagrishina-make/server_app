import pg from 'pg'
import express from "express";
import Router from "../routes/routes.js";
import 'dotenv/config';

const { Pool } = pg
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    port: process.env.POSTGRES_PORT
});

function connectPostgres(PORT) {

    pool.connect().then(() => {
        //Routes
        const app = express();
        app.use(Router)

        app.listen(PORT, () => {
            console.log(`Postgres. Example app listening on port ${PORT}`)
        });

        // pool.query('SELECT tasks.id,tasks.name,tasks.description,tasks."createdAt",tasks."modifiedAt",tasks.author,authors.firstname,authors.lastname,authors."createdAt",authors."modifiedAt"\n' +
        //     'FROM tasks JOIN authors ON tasks.author=authors.id', (err, res) => {
        //     console.log(res.rows)
        //     pool.end()
        // });
    }).catch((err) => console.error('connection error', err.stack));
}

const db = {
    async query(text, params) {
        const start = Date.now()
        const res = await pool.query(text, params)
        const duration = Date.now() - start
        console.log('executed query', { text, duration })
        return res
    }
}

export {
    connectPostgres,
    db
}
