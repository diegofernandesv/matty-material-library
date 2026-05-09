import express from "express";
import cors from "cors";
import OpenAI from "openai";
import sql from "./db.js";
import { requireAuth } from "./auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MATTY_BASE_PROMPT = `You are Matty, an expert AI assistant for Bestseller's Material Library.
You help product teams, designers, and sourcing teams explore and understand fabric materials.

You have access to the LIVE materials database (provided below as JSON).
Always answer based on this real data — never guess or make up material details.

Rules:
- When asked to find materials, list matching ones with their key attributes as bullet points.
- When asked to compare two or more materials, ALWAYS produce a markdown table (| Col | Col |) with one row per attribute.
- When showing a single material's full details, use a two-column markdown table (| Attribute | Value |).
- When asked for counts or summaries, compute from the database and answer concisely.
- Use **bold** for material names or key terms when inline.
- Never expose raw JSON — always present data in a readable, human-friendly format.
- Keep responses concise and scannable.`;

async function getMaterialsContext() {
  try {
    const materials = await sql`
      SELECT
        material_number, name, category, subcategory, material_state,
        composition, weight, width, technical_construction, manufacture_detail,
        warp_weft, finish, dyeing_method, brand, library,
        country_of_origin, lead_time_days, moq, price_per_unit, currency,
        certifications, recycled_content_pct, is_sustainable,
        care_instructions, end_of_life, risk_level, risk_comments,
        suitable_for, season, tags
      FROM materials
      ORDER BY material_number
    `;
    return JSON.stringify(materials, null, 2);
  } catch (err) {
    console.error("Failed to fetch materials for AI context:", err.message);
    return "[]";
  }
}

async function buildSystemPrompt() {
  const materialsJson = await getMaterialsContext();
  return `${MATTY_BASE_PROMPT}

--- MATERIALS DATABASE (${JSON.parse(materialsJson).length} records) ---
${materialsJson}
--- END OF DATABASE ---`;
}

// In production (Vercel experimentalServices) both services share the same
// domain so no CORS is needed. In development we allow localhost:5173.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Matty Material Library API", version: "1.0.0" });
});

// ── Threads ──────────────────────────────────────────────────────────────────

app.get("/api/threads", requireAuth, async (req, res) => {
  try {
    const threads = await sql`
      SELECT id, title, user_id, created_at
      FROM threads
      WHERE user_id = ${req.userId}
      ORDER BY created_at DESC
    `;
    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

app.get("/api/threads/:id", requireAuth, async (req, res) => {
  try {
    const threads = await sql`
      SELECT id, title, user_id, created_at
      FROM threads
      WHERE id = ${req.params.id} AND user_id = ${req.userId}
    `;
    if (threads.length === 0) return res.status(404).json({ error: "Thread not found" });
    res.json(threads[0]);
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

app.get("/api/threads/:id/messages", requireAuth, async (req, res) => {
  try {
    const threads = await sql`
      SELECT id FROM threads WHERE id = ${req.params.id} AND user_id = ${req.userId}
    `;
    if (threads.length === 0) return res.json([]);

    const messages = await sql`
      SELECT id, thread_id, type, content, created_at
      FROM messages
      WHERE thread_id = ${req.params.id}
      ORDER BY created_at ASC
    `;
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Create thread + first user message + immediate AI response
app.post("/api/threads", requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Both 'title' and 'content' are required" });
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return res.status(400).json({ error: "Title and content cannot be empty" });
    }

    const threads = await sql`
      INSERT INTO threads (title, user_id)
      VALUES (${trimmedTitle}, ${req.userId})
      RETURNING id, title, user_id, created_at
    `;
    const thread = threads[0];

    const userMessages = await sql`
      INSERT INTO messages (thread_id, type, content)
      VALUES (${thread.id}, 'user', ${trimmedContent})
      RETURNING id, thread_id, type, content, created_at
    `;
    const userMessage = userMessages[0];

    // Generate AI response to the first message
    let botMessage = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        const systemPrompt = await buildSystemPrompt();
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: trimmedContent },
          ],
        });

        const aiContent = aiResponse.choices[0].message.content;

        const botMessages = await sql`
          INSERT INTO messages (thread_id, type, content)
          VALUES (${thread.id}, 'bot', ${aiContent})
          RETURNING id, thread_id, type, content, created_at
        `;
        botMessage = botMessages[0];
      } catch (aiError) {
        console.error("AI generation error:", aiError.message);
      }
    }

    res.status(201).json({ thread, userMessage, botMessage });
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

// Send message in existing thread + get AI response
app.post("/api/threads/:id/messages", requireAuth, async (req, res) => {
  try {
    const threadId = req.params.id;
    const { type, content } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: "Both 'type' and 'content' are required" });
    }
    if (type !== "user" && type !== "bot") {
      return res.status(400).json({ error: "Type must be 'user' or 'bot'" });
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) return res.status(400).json({ error: "Content cannot be empty" });

    const threads = await sql`
      SELECT id FROM threads WHERE id = ${threadId} AND user_id = ${req.userId}
    `;
    if (threads.length === 0) return res.status(404).json({ error: "Thread not found" });

    const userMessages = await sql`
      INSERT INTO messages (thread_id, type, content)
      VALUES (${threadId}, ${type}, ${trimmedContent})
      RETURNING id, thread_id, type, content, created_at
    `;
    const userMessage = userMessages[0];

    const allMessages = await sql`
      SELECT type, content FROM messages
      WHERE thread_id = ${threadId}
      ORDER BY created_at ASC
    `;

    const formattedMessages = allMessages.map((msg) => ({
      role: msg.type === "bot" ? "assistant" : "user",
      content: msg.content,
    }));

    if (!process.env.OPENAI_API_KEY) {
      return res.status(201).json(userMessage);
    }

    const systemPrompt = await buildSystemPrompt();
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedMessages,
      ],
    });

    const aiContent = aiResponse.choices[0].message.content;

    const botMessages = await sql`
      INSERT INTO messages (thread_id, type, content)
      VALUES (${threadId}, 'bot', ${aiContent})
      RETURNING id, thread_id, type, content, created_at
    `;

    res.status(201).json({ userMessage, botMessage: botMessages[0] });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

app.patch("/api/threads/:id", requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = await sql`
      UPDATE threads
      SET title = ${title.trim()}
      WHERE id = ${req.params.id} AND user_id = ${req.userId}
      RETURNING id, title, user_id, created_at
    `;

    if (result.length === 0) return res.status(404).json({ error: "Thread not found" });
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating thread:", error);
    res.status(500).json({ error: "Failed to update thread" });
  }
});

app.delete("/api/threads/:id", requireAuth, async (req, res) => {
  try {
    const result = await sql`
      DELETE FROM threads
      WHERE id = ${req.params.id} AND user_id = ${req.userId}
      RETURNING id
    `;
    if (result.length === 0) return res.status(404).json({ error: "Thread not found" });
    res.json({ message: "Thread deleted successfully", deletedId: result[0].id });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Matty API running on http://localhost:${PORT}`);
});
