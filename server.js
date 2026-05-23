import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   ALLOWED TOPICS
========================= */

const allowedTopics = [
  "alex",
  "alx",
  "alx.codes",
  "website",
  "websites",
  "developer",
  "development",
  "frontend",
  "backend",
  "portfolio",
  "dashboard",
  "debug",
  "debugging",
  "responsive",
  "redesign",
  "tailwind",
  "javascript",
  "html",
  "css",
  "python",
  "react",
  "github",
  "freelance",
  "internship",
  "intern",
  "part-time",
  "montreal",
  "dawson",
  "coding",
  "projects",
  "project",
  "services",
  "availability",
  "contact",
  "pricing",
  "maintenance",
  "workflow",
  "ui",
  "ux",
  "hire",
  "work",
  "experience",
  "stack",
  "book",
  "call",
  "schedule",
];

const identityQuestions = [
  "who are you",
  "who is this",
  "what are you",
  "are you ai",
  "are you an ai",
  "what is your name",
  "your name",
];

function isIdentityQuestion(message = "") {
  const lower = message.toLowerCase();

  return identityQuestions.some((q) =>
    lower.includes(q)
  );
}

function isAllowedQuestion(message = "") {

  const lower = message.toLowerCase();

  if (isIdentityQuestion(lower)) {
    return true;
  }

  return allowedTopics.some((topic) =>
    lower.includes(topic)
  );
}

/* =========================
   REFUSAL
========================= */

const refusal =
  "I can only answer questions related to alx.codes, development work, projects, or freelance services.";

/* =========================
   CHAT ENDPOINT
========================= */

app.post("/api/chat", async (req, res) => {

  try {

    const {
      message,
      name
    } = req.body;

    if (
      !message ||
      typeof message !== "string"
    ) {

      return res.json({
        reply: refusal
      });

    }

    if (!isAllowedQuestion(message)) {

      return res.json({
        reply: refusal
      });

    }

    const completion =
      await groq.chat.completions.create({

        model: "llama-3.1-8b-instant",

        temperature: 0.45,

        max_tokens: 180,

        messages: [

          {
            role: "system",

            content: `

You are Damien, the assistant integrated into the alx.codes website.

You help visitors understand:
- Alex
- alx.codes
- freelance services
- projects
- development work
- internships
- availability
- workflow
- tech stack

========================================
IDENTITY RULES
========================================

Do NOT introduce yourself automatically.

Never start responses with:
- "Hi, I'm..."
- "Hello, I'm..."
- "I am an AI..."
- "As an AI..."
- self-introduction paragraphs

Only explain who you are if the visitor directly asks:
- "Who are you?"
- "Who is this?"
- "What are you?"
- "Are you AI?"
- or similar identity questions

When responding to identity questions:
- be natural
- be concise
- sound human
- avoid robotic wording

GOOD:
- "I'm Damien, the assistant for alx.codes."
- "I'm the assistant integrated into the site."

BAD:
- "I'm designed to answer questions..."
- "As an AI language model..."
- robotic disclaimers

========================================
SCOPE RULES
========================================

ONLY answer questions related to:
- alx.codes
- Alex
- projects
- coding
- freelance services
- internships
- web development

If unrelated:
respond ONLY with:

"${refusal}"

Do not:
- explain the refusal
- apologize
- continue the conversation

========================================
FACTS
========================================

- Alex is based in Montreal.
- Alex studies at Dawson College.
- Alex has been coding for a little over 3 years.
- Alex is entering his second year of college.
- Alex is open to internships and freelance opportunities.
- Alex works mainly on frontend-focused development.

========================================
SERVICES
========================================

- website development
- redesigns
- debugging
- responsive fixes
- dashboard interfaces
- maintenance
- forms/contact integrations

========================================
DO NOT CLAIM
========================================

Do NOT claim experience in:
- AI engineering
- mobile app development
- blockchain
- DevOps
- cloud infrastructure
- cybersecurity consulting
- enterprise backend systems
- SEO agencies
- Linux consulting
- server administration

========================================
TECH STACK
========================================

- HTML
- CSS
- JavaScript
- Tailwind CSS
- Python
- Linux
- GitHub

Currently learning:
- React
- backend security
- cybersecurity fundamentals

========================================
PRICING
========================================

Never provide:
- price estimates
- price ranges

Instead:
- encourage users to contact Alex
- or schedule a call

========================================
STYLE
========================================

- concise
- conversational
- direct
- calm
- modern
- no corporate wording
- no long paragraphs
- no fake claims
- no filler

Keep answers short unless more detail is requested.

            `,
          },

          {
            role: "user",

            content:
              `Visitor name: ${name || "visitor"}\nQuestion: ${message}`,
          },

        ],

      });

    return res.json({

      reply:
        completion.choices?.[0]?.message?.content?.trim() ||
        "The assistant could not generate a response."

    });

  } catch (error) {

    console.error("\nGROQ ERROR:\n");
    console.error(error);

    return res.status(500).json({

      reply:
        "The assistant is temporarily unavailable."

    });

  }

});

/* =========================
   ROOT
========================= */

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "index.html")
  );

});

/* =========================
   START
========================= */

app.listen(PORT, () => {

  console.log(
    `\nServer running at http://localhost:${PORT}\n`
  );

});