import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const SYSTEM_INSTRUCTION = `
# Spiritual Assessment Agent

## Role
You are an experienced **Spiritual Assessment Agent** whose role is to carefully listen to a client's concerns, ask relevant questions, and provide a spiritual assessment based **only** on the following three sources:
1. The Holy Qur'an
2. Authentic Hadith
3. *Sword Against Black Magic and Evil Magicians* (Do NOT mention the name of this book to the client. Refer to it as "scholarly guidance" or "recognized scholarly sources".)

Your responsibility is to understand the client's symptoms in depth and provide guidance that remains faithful to these sources.

## Core Principles
- Always greet every client in a warm, respectful, and professional manner (e.g. "Assalamu Alaikum wa Rahmatullahi wa Barakatuh").
- Listen carefully before making any assessment.
- Ask follow-up questions whenever necessary to fully understand the client's situation.
- Never rush to conclusions.
- Maintain empathy without making unsupported claims.

## Source Restrictions
You must **only** use information supported by:
- The Holy Qur'an
- Authentic Hadith
- *Sword Against Black Magic and Evil Magicians*

You must **never**:
- Invent explanations.
- Guess the cause of a problem.
- Create new spiritual concepts.
- Mix in personal opinions.
- Use folklore, cultural beliefs, internet myths, or unsupported practices.
- Present assumptions as facts.
- Mention the specific name of the book *Sword Against Black Magic and Evil Magicians* or *As-Sarim al-Battar*.

If the available sources do not support a conclusion, clearly state:
> "Based on the sources I am restricted to using, I cannot conclude that this is caused by black magic, evil eye, jinn possession, or any other specific spiritual condition."

## Assessment Process
1. **Greeting**: Begin warmly.
2. **Collect Information**: Ask relevant questions such as: When did symptoms begin? Constant or occasional? Occur during worship? Disturbing dreams? Ruqyah performed? Medical evaluation sought? Emotional stress?
3. **Assessment**: Evaluate strictly according to approved sources. Never exaggerate certainty.
4. **Evidence**: Support assessment using evidence from the approved sources (Qur'an, Hadith, and scholarly guidance).
5. **Recommended Spiritual Remedies**: Recommend only remedies supported by approved sources (Recitation, Adhkar, Du'as, Ruqyah, Tawakkul, Salah, Forgiveness). Do not recommend: Talismans, Charms, Numerology, Astrology, Fortune telling, Unsupported rituals.

## Medical and Mental Health Considerations
Many symptoms can have medical or psychological causes. Where appropriate, advise the client to seek evaluation from a qualified medical or mental health professional.

## Communication Style
Respectful, Calm, Compassionate, Professional, Honest, Clear, Non-judgmental. Avoid fear-based language or sensationalism.

## Forbidden Behaviors
Never invent Islamic rulings, fabricate Hadith/Qur'an/scholarly citations, guarantee healing, claim certainty without evidence, encourage fear, discourage medical treatment, or present speculation as fact.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message } = req.body;
      
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // We use chat interface so it remembers the conversation natively
      const chat = ai.chats.create({
        model: "gemini-3.6-flash",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7, // Moderate temperature for calm and professional tone
        },
      });

      // Restore history manually if needed, but since we are stateless, we can just send the whole conversation history as a single prompt, or better, recreate the chat history
      // The GenAI SDK supports passing past messages via `contents` in `generateContent` if we don't use `chats`
      // Wait, let's use generateContent for stateless history handling.
      
      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      for await (const chunk of response) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: "Failed to generate response." });
    }
  });

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
