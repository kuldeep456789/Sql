import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    try {
        const { assignmentContext, currentQuery } = req.body;
        console.log('--- HINT REQUEST ---');
        console.log('Target Assignment:', assignmentContext?.title);

        if (!assignmentContext) {
            return res.status(400).json({ error: 'Missing assignment context' });
        }

        if (!process.env.GEMINI_API_KEY ||
            process.env.GEMINI_API_KEY === 'your_gemini_api_key' ||
            process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return res.status(503).json({
                hint: "AI assistance is currently disabled. Please provide a valid GEMINI_API_KEY in the backend .env file."
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const reqs = Array.isArray(assignmentContext.requirements)
            ? assignmentContext.requirements.join(', ')
            : 'No specific requirements';

        const prompt = `
            You are an expert SQL tutor. Provide a helpful, conceptual hint for a student struggling with a SQL challenge.
            
            Challenge Title: ${assignmentContext.title}
            Description: ${assignmentContext.description}
            Requirements: ${reqs}
            
            Student's Current Query:
            \`\`\`sql
            ${currentQuery || '-- No query started yet'}
            \`\`\`
            
            GUIDELINES:
            1. DO NOT provide the full solution code.
            2. Point out specific syntax errors or logical gaps.
            3. Explain concepts (e.g., 'You might need a LEFT JOIN instead of an INNER JOIN').
            4. Keep the response concise (max 3 sentences).
        `;

        let hint;
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            console.log('Generating with gemini-1.5-flash...');
            const result = await model.generateContent(prompt);
            const response = await result.response;
            hint = response.text();
        } catch (flashError) {
            if (flashError.status === 404 || flashError.message?.includes('404')) {
                console.warn('gemini-1.5-flash not found, falling back to gemini-1.5-pro...');
                const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
                const result = await modelPro.generateContent(prompt);
                const response = await result.response;
                hint = response.text();
            } else {
                throw flashError;
            }
        }

        if (!hint) {
            throw new Error('Gemini returned an empty response');
        }

        console.log('Hint generated successfully');
        res.json({ hint });
    } catch (err) {
        console.error('FINAL Gemini Error:', {
            message: err.message,
            status: err.status,
            stack: err.stack?.substring(0, 200)
        });
        res.status(500).json({
            error: 'Failed to generate hint',
            details: err.message
        });
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
