const fs = require('fs');
const path = require('path');
const { Client } = require(path.join(__dirname, '..', 'server', 'node_modules', 'pg'));

async function runMigration() {
  const sqlFilePath = path.join(__dirname, '..', 'supabase-complete-setup.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  console.log('Read SQL file, length:', sql.length, 'bytes');

  // Supabase project details
  const projectRef = process.env.SUPABASE_PROJECT_REF || 'quigqqhspdlqgojtqyuc';
  const password = process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD || '';

  // Possible connection configurations
  const configs = [
    {
      name: 'Direct Connection (db.quigqqhspdlqgojtqyuc.supabase.co:5432)',
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      user: 'postgres',
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Session Pooler ap-south-1 (aws-0-ap-south-1.pooler.supabase.com:5432)',
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 5432,
      user: `postgres.${projectRef}`,
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Session Pooler us-east-1 (aws-0-us-east-1.pooler.supabase.com:5432)',
      host: 'aws-0-us-east-1.pooler.supabase.com',
      port: 5432,
      user: `postgres.${projectRef}`,
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Transaction Pooler ap-south-1 (aws-0-ap-south-1.pooler.supabase.com:6543)',
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 6543,
      user: `postgres.${projectRef}`,
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Session Pooler ap-southeast-1 (aws-0-ap-southeast-1.pooler.supabase.com:5432)',
      host: 'aws-0-ap-southeast-1.pooler.supabase.com',
      port: 5432,
      user: `postgres.${projectRef}`,
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    }
  ];

  let connectedClient = null;

  for (const config of configs) {
    console.log(`\nAttempting connection to: ${config.name}...`);
    const client = new Client({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl,
      connectionTimeoutMillis: 8000
    });

    try {
      await client.connect();
      console.log(`>>> SUCCESS: Connected via ${config.name}!`);
      connectedClient = client;
      break;
    } catch (err) {
      console.log(`Failed with ${config.name}: ${err.message}`);
      await client.end().catch(() => {});
    }
  }

  if (!connectedClient) {
    console.error('\nCould not connect via direct connection or tested poolers.');
    process.exit(1);
  }

  try {
    console.log('\nExecuting supabase-complete-setup.sql...');
    await connectedClient.query(sql);
    console.log('>>> MIGRATION SUCCESSFUL! All tables and data created.');

    // Verify row counts
    const cats = await connectedClient.query('SELECT COUNT(*) FROM public.categories;');
    const prods = await connectedClient.query('SELECT COUNT(*) FROM public.products;');
    const settings = await connectedClient.query('SELECT COUNT(*) FROM public.site_settings;');
    
    console.log('\nVerification:');
    console.log(`- Categories table count: ${cats.rows[0].count}`);
    console.log(`- Products table count: ${prods.rows[0].count}`);
    console.log(`- Site settings count: ${settings.rows[0].count}`);
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await connectedClient.end();
  }
}

runMigration();
