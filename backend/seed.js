import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const CONSTANTS_DATA = [
    {
        id: '1',
        title: 'Customer Directory Cleanup',
        difficulty: 'Beginner',
        description: 'Help the marketing team get a list of all active users from specific regions.',
        requirements: [
            'Select the first name, last name, and email of all users.',
            'Only include users from the city "London".',
            'Order the results by last name alphabetically.'
        ],
        initialQuery: 'SELECT * FROM users;',
        schemas: [
            {
                tableName: 'users',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'firstname', type: 'VARCHAR' },
                    { name: 'lastname', type: 'VARCHAR' },
                    { name: 'email', type: 'VARCHAR' },
                    { name: 'city', type: 'VARCHAR' },
                    { name: 'status', type: 'VARCHAR' }
                ],
                sampleData: [
                    { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', city: 'London', status: 'active' },
                    { id: 2, firstname: 'Jane', lastname: 'Smith', email: 'jane@test.org', city: 'New York', status: 'active' },
                    { id: 3, firstname: 'Alice', lastname: 'Brown', email: 'alice@london.uk', city: 'London', status: 'inactive' },
                    { id: 4, firstname: 'Bob', lastname: 'Wilson', email: 'bob@corp.com', city: 'London', status: 'active' }
                ]
            }
        ]
    },
    {
        id: '1-2',
        title: 'Inventory Low-Stock Alert',
        difficulty: 'Beginner',
        description: 'The warehouse manager needs to know which electronics are running low on stock.',
        requirements: [
            'Select the product name and current stock quantity.',
            'Filter for products where the stock is less than 20.',
            'Include only products in the "Electronics" category.'
        ],
        initialQuery: 'SELECT * FROM products;',
        schemas: [
            {
                tableName: 'products',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'productname', type: 'VARCHAR' },
                    { name: 'category', type: 'VARCHAR' },
                    { name: 'stockquantity', type: 'INTEGER' }
                ],
                sampleData: [
                    { id: 1, productname: 'MacBook Pro', category: 'Electronics', stockquantity: 15 },
                    { id: 2, productname: 'Office Chair', category: 'Furniture', stockquantity: 5 },
                    { id: 3, productname: 'iPhone 15', category: 'Electronics', stockquantity: 45 },
                    { id: 4, productname: 'USB-C Cable', category: 'Electronics', stockquantity: 12 }
                ]
            }
        ]
    },
    {
        id: '2',
        title: 'High Value Orders Analysis',
        difficulty: 'Intermediate',
        description: 'Find orders that exceed a certain amount to identify top-tier customers.',
        requirements: [
            'Join the customers and orders tables.',
            'Show the customer name and total order amount.',
            'Only show orders where the total is greater than 500.',
            'Order by amount descending.'
        ],
        initialQuery: '-- Start your JOIN query here\nSELECT ',
        schemas: [
            {
                tableName: 'customers',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'name', type: 'VARCHAR' }
                ],
                sampleData: [
                    { id: 1, name: 'Alice' },
                    { id: 2, name: 'Bob' },
                    { id: 3, name: 'Charlie' }
                ]
            },
            {
                tableName: 'orders',
                columns: [
                    { name: 'orderid', type: 'INTEGER' },
                    { name: 'customerid', type: 'INTEGER' },
                    { name: 'amount', type: 'DECIMAL' },
                    { name: 'orderdate', type: 'DATE' }
                ],
                sampleData: [
                    { orderid: 101, customerid: 1, amount: 250.00, orderdate: '2023-01-01' },
                    { orderid: 102, customerid: 1, amount: 600.00, orderdate: '2023-01-05' },
                    { orderid: 103, customerid: 2, amount: 150.00, orderdate: '2023-02-10' },
                    { orderid: 104, customerid: 3, amount: 800.00, orderdate: '2023-02-15' }
                ]
            }
        ]
    },
    {
        id: '2-2',
        title: 'Employee Performance Review',
        difficulty: 'Intermediate',
        description: 'HR wants to see which departments have employees with top performance scores.',
        requirements: [
            'Join the employees and departments tables.',
            'Select employee name, department name, and score.',
            'Filter for employees with a score of 9 or higher.',
            'Exclude the "Internship" department.'
        ],
        initialQuery: 'SELECT ',
        schemas: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'name', type: 'VARCHAR' },
                    { name: 'deptid', type: 'INTEGER' },
                    { name: 'score', type: 'INTEGER' }
                ],
                sampleData: [
                    { id: 1, name: 'Sarah Connor', deptid: 1, score: 10 },
                    { id: 2, name: 'Kyle Reese', deptid: 1, score: 8 },
                    { id: 3, name: 'John Doe', deptid: 2, score: 9 },
                    { id: 4, name: 'Agent Smith', deptid: 3, score: 10 }
                ]
            },
            {
                tableName: 'departments',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'deptname', type: 'VARCHAR' }
                ],
                sampleData: [
                    { id: 1, deptname: 'Engineering' },
                    { id: 2, deptname: 'Marketing' },
                    { id: 3, deptname: 'Internship' }
                ]
            }
        ]
    }
];

async function seed() {
    try {
        console.log('Starting seed...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS assignments (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                description TEXT NOT NULL,
                requirements JSONB,
                initial_query TEXT,
                schemas JSONB,
                difficulty_level INTEGER GENERATED ALWAYS AS (
                    CASE difficulty 
                        WHEN 'Beginner' THEN 1 
                        WHEN 'Intermediate' THEN 2 
                        WHEN 'Advanced' THEN 3 
                        ELSE 4 
                    END
                ) STORED
            );

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'Free Member',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS attempts (
                id SERIAL PRIMARY KEY,
                user_email TEXT NOT NULL,
                assignment_id TEXT NOT NULL,
                query TEXT NOT NULL,
                is_success BOOLEAN DEFAULT false,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table assignments created/verified.');

        await pool.query('DELETE FROM assignments');
        console.log('Cleared existing data.');

        for (const assignment of CONSTANTS_DATA) {
            await pool.query(
                `INSERT INTO assignments (id, title, difficulty, description, requirements, initial_query, schemas)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    assignment.id,
                    assignment.title,
                    assignment.difficulty,
                    assignment.description,
                    JSON.stringify(assignment.requirements),
                    assignment.initialQuery,
                    JSON.stringify(assignment.schemas)
                ]
            );
        }
        console.log(`Inserted ${CONSTANTS_DATA.length} assignments.`);

        for (const assignment of CONSTANTS_DATA) {
            for (const schema of assignment.schemas) {
                await pool.query(`DROP TABLE IF EXISTS ${schema.tableName} CASCADE`);

                const cols = schema.columns.map(c => `${c.name} ${c.type}`).join(', ');
                await pool.query(`CREATE TABLE ${schema.tableName} (${cols})`);

                if (schema.sampleData.length > 0) {
                    const keys = Object.keys(schema.sampleData[0]).join(', ');
                    for (const row of schema.sampleData) {
                        const values = Object.values(row).map(v => typeof v === 'string' ? `'${v}'` : v).join(', ');
                        await pool.query(`INSERT INTO ${schema.tableName} (${keys}) VALUES (${values})`);
                    }
                }
            }
        }
        console.log('Created and populated sandbox tables.');

    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await pool.end();
    }
}

seed();
