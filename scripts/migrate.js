const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const MIGRATIONS_TABLE = '_sqlx_migrations';
const MIGRATIONS_DIR = path.join(__dirname, '..', 'src', 'database', 'migrations');

async function getClient() {
    const client = new Client({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB_NAME,
    });
    await client.connect();
    return client;
}

async function getRanMigrations(client) {
    const result = await client.query(`SELECT version FROM ${MIGRATIONS_TABLE} WHERE success = true`);
    return result.rows.map((row) => row.version);
}

function extractVersionFromFilename(filename) {
    // Extract version from filename like "20240336000000_add_type_to_users_table.sql"
    return filename.split('_')[0];
}

function extractDescriptionFromFilename(filename) {
    // Extract description from filename like "20240336000000_add_type_to_users_table.sql"
    const parts = filename.split('_');
    parts.shift(); // Remove version part
    return parts.join('_').replace('.sql', '').replace(/_/g, ' ');
}

function generateChecksum(content) {
    return crypto.createHash('sha256').update(content).digest();
}

async function runMigrations() {
    const client = await getClient();
    try {
        console.log('Connected to database.');

        const ranMigrations = await getRanMigrations(client);
        console.log('Already run migrations:', ranMigrations.length > 0 ? ranMigrations : 'None');

        const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).filter((file) => file.endsWith('.sql')).sort();

        // Filter pending migrations based on version comparison
        const pendingMigrations = migrationFiles.filter(file => {
            const version = extractVersionFromFilename(file);
            return !ranMigrations.includes(version);
        });

        if (pendingMigrations.length === 0) {
            console.log('No new migrations to run. Database is up to date.');
            return;
        }

        console.log('Pending migrations:', pendingMigrations);

        for (const migrationFile of pendingMigrations) {
            console.log(`Running migration: ${migrationFile}`);
            const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
            const sql = fs.readFileSync(migrationPath, 'utf8');

            const version = extractVersionFromFilename(migrationFile);
            const description = extractDescriptionFromFilename(migrationFile);
            const checksum = generateChecksum(sql);

            await client.query('BEGIN');
            try {
                const startTime = process.hrtime.bigint();

                // Execute the migration SQL
                await client.query(sql);

                const endTime = process.hrtime.bigint();
                const executionTime = (endTime - startTime).toString();

                // Record the migration in sqlx format
                await client.query(`
                    INSERT INTO ${MIGRATIONS_TABLE} (version, description, installed_on, success, checksum, execution_time) 
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [version, description, new Date(), true, checksum, executionTime]);

                await client.query('COMMIT');
                console.log(`Migration ${migrationFile} executed and recorded successfully.`);
            } catch (err) {
                await client.query('ROLLBACK');
                console.error(`Failed to run migration ${migrationFile}. Rolling back.`);
                throw err;
            }
        }

        console.log('All new migrations have been run successfully.');
    } catch (error) {
        console.error('Migration process failed:', error);
        process.exit(1);
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

runMigrations(); 