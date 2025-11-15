// /backend/db.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config(); // -> carga .env en process.env

const { Pool } = pkg;

// DEBUG: muestro qué variables está leyendo Node (muy importante)
console.log("▶️ ENV LEÍDAS POR NODE:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? '[HAY_PASSWORD]' : '[SIN_PASSWORD]');
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? '[HAY_DATABASE_URL]' : '[SIN_DATABASE_URL]');

// Preferimos usar DATABASE_URL (con la contraseña ya codificada) si existe,
// porque evita problemas con caracteres especiales y con poolers.
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      ssl: { rejectUnauthorized: false }
    };

const pool = new Pool(poolConfig);

// Intenta conectar y muestra error si hay alguno
pool.connect()
  .then(() => console.log("✅ Conectado correctamente a PostgreSQL (Supabase)"))
  .catch((err) => console.error("❌ Error de conexión:", err));

export default pool;