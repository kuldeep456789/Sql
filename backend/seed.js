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
                    { name: 'first_name', type: 'VARCHAR' },
                    { name: 'last_name', type: 'VARCHAR' },
                    { name: 'email', type: 'VARCHAR' },
                    { name: 'city', type: 'VARCHAR' },
                    { name: 'status', type: 'VARCHAR' }
                ],
                sampleData: [
                    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', city: 'London', status: 'active' },
                    { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@test.org', city: 'New York', status: 'active' },
                    { id: 3, first_name: 'Alice', last_name: 'Brown', email: 'alice@london.uk', city: 'London', status: 'inactive' },
                    { id: 4, first_name: 'Bob', last_name: 'Wilson', email: 'bob@corp.com', city: 'London', status: 'active' }
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
                    { name: 'product_name', type: 'VARCHAR' },
                    { name: 'category', type: 'VARCHAR' },
                    { name: 'stock', type: 'INTEGER' }
                ],
                sampleData: [
                    { id: 1, product_name: 'MacBook Pro', category: 'Electronics', stock: 15 },
                    { id: 2, product_name: 'Office Chair', category: 'Furniture', stock: 5 },
                    { id: 3, product_name: 'iPhone 15', category: 'Electronics', stock: 45 },
                    { id: 4, product_name: 'USB-C Cable', category: 'Electronics', stock: 12 }
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
            'Join the users and orders tables.',
            'Show the user name and total order amount.',
            'Only show orders where the total is greater than 500.',
            'Order by amount descending.'
        ],
        initialQuery: '-- Start your JOIN query here\nSELECT ',
        schemas: [
            {
                tableName: 'users',
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
                    { name: 'order_id', type: 'INTEGER' },
                    { name: 'user_id', type: 'INTEGER' },
                    { name: 'amount', type: 'DECIMAL' },
                    { name: 'order_date', type: 'DATE' }
                ],
                sampleData: [
                    { order_id: 101, user_id: 1, amount: 250.00, order_date: '2023-01-01' },
                    { order_id: 102, user_id: 1, amount: 600.00, order_date: '2023-01-05' },
                    { order_id: 103, user_id: 2, amount: 150.00, order_date: '2023-02-10' },
                    { order_id: 104, user_id: 3, amount: 800.00, order_date: '2023-02-15' }
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
                    { name: 'dept_id', type: 'INTEGER' },
                    { name: 'score', type: 'INTEGER' }
                ],
                sampleData: [
                    { id: 1, name: 'Sarah Connor', dept_id: 1, score: 10 },
                    { id: 2, name: 'Kyle Reese', dept_id: 1, score: 8 },
                    { id: 3, name: 'John Doe', dept_id: 2, score: 9 },
                    { id: 4, name: 'Agent Smith', dept_id: 3, score: 10 }
                ]
            },
            {
                tableName: 'departments',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'dept_name', type: 'VARCHAR' }
                ],
                sampleData: [
                    { id: 1, dept_name: 'Engineering' },
                    { id: 2, dept_name: 'Marketing' },
                    { id: 3, dept_name: 'Internship' }
                ]
            }
        ]
    }
];

async function seed() {
    try {
        console.log('Starting seed...');

        // 1. Create table
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
        `);
        console.log('Table assignments created/verified.');

        // 2. Clear existing data
        await pool.query('DELETE FROM assignments');
        console.log('Cleared existing data.');

        // 3. Insert data
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


        // 4. Create actual tables for sandbox simulation (Optional but good for realism if using real DB for queries)
        // For now, the "execute" endpoint might just run queries. If we want them to actually work, we need these tables in the DB too.
        // Let's create the tables defined in schemas.

        for (const assignment of CONSTANTS_DATA) {
            for (const schema of assignment.schemas) {
                // Drop table if exists to reset
                await pool.query(`DROP TABLE IF EXISTS ${schema.tableName} CASCADE`);

                // Create table
                const cols = schema.columns.map(c => `${c.name} ${c.type}`).join(', ');
                await pool.query(`CREATE TABLE ${schema.tableName} (${cols})`);

                // Insert sample data
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
