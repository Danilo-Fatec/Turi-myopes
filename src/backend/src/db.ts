import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',        
  database: 'focos',   
  password: "gustavo@1",   
  port: 5432,               
});

export default pool;