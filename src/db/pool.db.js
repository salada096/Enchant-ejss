import pg from 'pg';

const pool = new pg.Pool({
    connectionString: `postgresql://postgres.xztrvvpxhccackzoaalz:enchantDB@2025@aws-1-sa-east-1.pooler.supabase.com:6543/postgres`
});

export default pool;