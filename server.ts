import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import { exec } from "child_process";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Configuração do Pool do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Memória volátil caso o banco não esteja disponível
let memoryHabits: any[] = [];
let memoryLogs: any[] = [];
let dbConnected = false;

// Inicialização do Banco de Dados (Tabelas)
const initDb = async () => {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL com sucesso!");
    dbConnected = true;
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS habits (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(50),
        target_value VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS habit_logs (
        id SERIAL PRIMARY KEY,
        habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
        completed_at DATE NOT NULL,
        value FLOAT DEFAULT 1.0,
        UNIQUE(habit_id, completed_at)
      );
    `);
    client.release();
  } catch (err) {
    console.error("Erro ao conectar ou inicializar o PostgreSQL:", err);
    console.log("AVISO: Usando memória temporária (dados serão perdidos ao reiniciar o servidor).");
    dbConnected = false;
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  await initDb();

  // --- API ROUTES ---

  // Listar todos os hábitos com status de hoje
  app.get("/api/habits", async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    if (dbConnected) {
      try {
        const result = await pool.query(`
          SELECT h.*, 
                 (SELECT COUNT(*) FROM habit_logs hl WHERE hl.habit_id = h.id AND hl.completed_at = $1) > 0 as completed_today
          FROM habits h
          ORDER BY h.created_at DESC
        `, [today]);
        return res.json(result.rows);
      } catch (err) {
        console.error("Erro no DB, alternando para memória...");
        dbConnected = false;
      }
    }
    
    // Fallback para memória
    const detailedHabits = memoryHabits.map(h => ({
      ...h,
      completed_today: memoryLogs.some(l => l.habit_id === h.id && l.completed_at === today)
    }));
    res.json(detailedHabits.sort((a,b) => b.id - a.id));
  });

  // Criar novo hábito
  app.post("/api/habits", async (req, res) => {
    const { title, description, icon, color, target_value } = req.body;
    if (dbConnected) {
      try {
        const result = await pool.query(
          "INSERT INTO habits (title, description, icon, color, target_value) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [title, description, icon, color, target_value]
        );
        return res.status(201).json(result.rows[0]);
      } catch (err) {
        dbConnected = false;
      }
    }

    // Fallback para memória
    const newHabit = {
      id: memoryHabits.length + 1,
      title,
      description,
      icon,
      color,
      target_value,
      created_at: new Date().toISOString(),
      completed_today: false
    };
    memoryHabits.push(newHabit);
    res.status(201).json(newHabit);
  });

  // Marcar/Desmarcar hábito como concluído hoje
  app.post("/api/habits/:id/toggle", async (req, res) => {
    const { id } = req.params;
    const habitId = parseInt(id);
    const today = new Date().toISOString().split('T')[0];
    
    if (dbConnected) {
      try {
        const checkResult = await pool.query(
          "SELECT * FROM habit_logs WHERE habit_id = $1 AND completed_at = $2",
          [habitId, today]
        );

        if (checkResult.rows.length > 0) {
          await pool.query("DELETE FROM habit_logs WHERE habit_id = $1 AND completed_at = $2", [habitId, today]);
          return res.json({ completed: false });
        } else {
          await pool.query("INSERT INTO habit_logs (habit_id, completed_at) VALUES ($1, $2)", [habitId, today]);
          return res.json({ completed: true });
        }
      } catch (err) {
        dbConnected = false;
      }
    }

    // Fallback para memória
    const logIndex = memoryLogs.findIndex(l => l.habit_id === habitId && l.completed_at === today);
    if (logIndex > -1) {
      memoryLogs.splice(logIndex, 1);
      res.json({ completed: false });
    } else {
      memoryLogs.push({ habit_id: habitId, completed_at: today });
      res.json({ completed: true });
    }
  });

  // Estatísticas semanais
  app.get("/api/stats/weekly", async (req, res) => {
    if (dbConnected) {
      try {
        const result = await pool.query(`
          SELECT completed_at as date, COUNT(*) as count
          FROM habit_logs
          WHERE completed_at >= CURRENT_DATE - INTERVAL '6 days'
          GROUP BY completed_at
          ORDER BY completed_at ASC
        `);
        return res.json(result.rows);
      } catch (err) {
        dbConnected = false;
      }
    }
    
    // Mock para memória
    res.json([]);
  });

  // Deletar hábito
  app.delete("/api/habits/:id", async (req, res) => {
    const { id } = req.params;
    const habitId = parseInt(id);
    if (dbConnected) {
      try {
        await pool.query("DELETE FROM habits WHERE id = $1", [habitId]);
        return res.json({ message: "Hábito deletado com sucesso" });
      } catch (err) {
        dbConnected = false;
      }
    }

    // Fallback para memória
    memoryHabits = memoryHabits.filter(h => h.id !== habitId);
    memoryLogs = memoryLogs.filter(l => l.habit_id !== habitId);
    res.json({ message: "Hábito deletado com sucesso" });
  });

  // Atualizar hábito
  app.put("/api/habits/:id", async (req, res) => {
    const { id } = req.params;
    const habitId = parseInt(id);
    const { title, description, icon, color, target_value } = req.body;
    if (dbConnected) {
      try {
        const result = await pool.query(
          "UPDATE habits SET title = $1, description = $2, icon = $3, color = $4, target_value = $5 WHERE id = $6 RETURNING *",
          [title, description, icon, color, target_value, habitId]
        );
        if (result.rows.length > 0) return res.json(result.rows[0]);
      } catch (err) {
        dbConnected = false;
      }
    }

    // Fallback para memória
    const index = memoryHabits.findIndex(h => h.id === habitId);
    if (index === -1) return res.status(404).json({ error: "Hábito não encontrado" });
    
    memoryHabits[index] = { ...memoryHabits[index], title, description, icon, color, target_value };
    res.json(memoryHabits[index]);
  });

  // Resetar tudo
  app.delete("/api/habits/reset/all", async (req, res) => {
    if (dbConnected) {
      try {
        await pool.query("TRUNCATE habits CASCADE");
        return res.json({ message: "Todos os dados foram resetados" });
      } catch (err) {
        dbConnected = false;
      }
    }

    // Fallback para memória
    memoryHabits = [];
    memoryLogs = [];
    res.json({ message: "Todos os dados foram resetados" });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Servidor rodando em ${url}`);
    
    // Abre o Microsoft Edge automaticamente em ambiente de desenvolvimento
    if (process.env.NODE_ENV !== "production") {
      exec(`start msedge ${url}`, (err) => {
        if (err) {
          // Fallback para o comando 'start' padrão se msedge falhar
          exec(`start ${url}`);
        }
      });
    }
  });
}

startServer();
