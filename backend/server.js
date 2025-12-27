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
        res.json({ rows: result.rows, rowCount: result.rowCount });
    } catch (err) {
        res.status(400).json({ error: err.message });
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
