import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test DB Connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Connected to Neon PostgreSQL database');
        release();
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('CipherSQLStudio Backend Running');
});

// Assignments API
app.get('/api/assignments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM assignments ORDER BY difficulty_level, title');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// AUTH API
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
            [name, email, password]
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
        const result = await pool.query(
            'SELECT id, name, email, role FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Execute Query API (Sandbox)
app.post('/api/execute', async (req, res) => {
    const { sql } = req.body;

    // BASIC SECURITY: Prevent destructive commands
    const forbidden = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'UPDATE', 'INSERT', 'GRANT', 'REVOKE'];
    const upperSql = sql.toUpperCase();

    if (forbidden.some(word => upperSql.includes(word))) {
        return res.status(400).json({ error: 'Only SELECT queries are allowed in this sandbox.' });
    }

    try {
        // In a real sandbox, user should have a read-only role
        const result = await pool.query(sql);

        // SAVE ATTEMPT
        const { user_email, assignment_id } = req.body;
        if (user_email && assignment_id) {
            await pool.query(
                'INSERT INTO attempts (user_email, assignment_id, query, is_success) VALUES ($1, $2, $3, $4)',
                [user_email, assignment_id, sql, true] // Simple success assumption if no error thrown
            );
        }

        res.json({ rows: result.rows, rowCount: result.rowCount });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET USER ATTEMPTS
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

// GET USER STATS
app.get('/api/user/stats/:email', async (req, res) => {
    try {
        const email = req.params.email;

        // Count unique solved assignments
        const solvedResult = await pool.query(
            'SELECT COUNT(DISTINCT assignment_id) FROM attempts WHERE user_email = $1 AND is_success = true',
            [email]
        );

        // Get all successful attempts for streak/heatmap
        const historyResult = await pool.query(
            'SELECT executed_at::date as date, COUNT(*) as count FROM attempts WHERE user_email = $1 GROUP BY executed_at::date ORDER BY date',
            [email]
        );

        const solvedCount = parseInt(solvedResult.rows[0].count);
        const xp = solvedCount * 500; // 500 XP per solved assignment

        // Calculate Rank
        let rank = 'Novice I';
        if (xp > 5000) rank = 'SQL Master';
        else if (xp > 2500) rank = 'Advanced';
        else if (xp > 1000) rank = 'Intermediate';
        else if (xp > 0) rank = 'Beginner';

        // Calculate Streak (simple version)
        let streak = 0;
        if (historyResult.rows.length > 0) {
            streak = historyResult.rows.length; // Number of unique days with activity
        }

        res.json({
            solvedCount,
            xp,
            rank,
            streak,
            history: historyResult.rows,
            progress: Math.min(100, Math.round((solvedCount / 4) * 100)) // Assuming 4 core assignments for now
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Hint API
app.post('/api/hint', async (req, res) => {
    // AI functionality disabled as per configuration
    return res.status(503).json({
        hint: "AI assistance is currently disabled in this environment. Please allow time for the administrator to configure the API key."
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
