import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "agrosense_db",
  password: "nicolas1912",
  port: 5432,
});

pool.connect()
  .then(() => console.log("✅ Conexión a PostgreSQL exitosa"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL:", err));

export default pool;