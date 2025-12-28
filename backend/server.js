import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Connected to Neon PostgreSQL database');
        release();
    }
});

app.get('/', (req, res) => {
    res.send('CipherSQLStudio Backend Running');
});

app.get('/api/assignments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM assignments ORDER BY difficulty_level, title');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Hash password before storing
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Fetch user with password hash
        const result = await pool.query(
            'SELECT id, name, email, role, password FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password using bcrypt
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/execute', async (req, res) => {
    const { sql } = req.body;

    const forbidden = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE', 'INSERT', 'GRANT', 'REVOKE'];
    const upperSql = sql.toUpperCase();

    if (forbidden.some(word => upperSql.includes(word))) {
        return res.status(400).json({ error: 'Only SELECT queries are allowed in this sandbox.' });
    }

    try {
        const result = await pool.query(sql);

        const { user_email, assignment_id } = req.body;
        if (user_email && assignment_id) {
            await pool.query(
                'INSERT INTO attempts (user_email, assignment_id, query, is_success) VALUES ($1, $2, $3, $4)',
                [user_email, assignment_id, sql, true]
            );
        }

        res.json({ rows: result.rows, rowCount: result.rowCount });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/attempts/:email', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM attempts WHERE user_email = $1 ORDER BY executed_at DESC',
            [req.params.email]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/stats/:email', async (req, res) => {
    try {
        const email = req.params.email;

        const solvedResult = await pool.query(
            'SELECT COUNT(DISTINCT assignment_id) FROM attempts WHERE user_email = $1 AND is_success = true',
            [email]
        );

        const historyResult = await pool.query(
            'SELECT executed_at::date as date, COUNT(*) as count FROM attempts WHERE user_email = $1 GROUP BY executed_at::date ORDER BY date',
            [email]
        );

        const solvedCount = parseInt(solvedResult.rows[0].count);
        const xp = solvedCount * 500;

        let rank = 'Novice I';
        if (xp > 5000) rank = 'SQL Master';
        else if (xp > 2500) rank = 'Advanced';
        else if (xp > 1000) rank = 'Intermediate';
        else if (xp > 0) rank = 'Beginner';

        let streak = 0;
        if (historyResult.rows.length > 0) {
            streak = historyResult.rows.length;
        }

        res.json({
            solvedCount,
            xp,
            rank,
            streak,
            history: historyResult.rows,
            progress: Math.min(100, Math.round((solvedCount / 4) * 100))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/hint', async (req, res) => {
    res.status(200).json({
        hint: "AI hint feature is currently disabled."
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
