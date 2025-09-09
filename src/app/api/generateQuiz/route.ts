// File: src/app/api/generateQuiz/route.ts
import { NextResponse } from "next/server";
import type { Quiz } from "@/store/useQuizStore";

const CHAT_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.openai.com/v1/chat/completions";
const REQUEST_TIMEOUT = 20_000;
const lang = "English";

/* ─── Quiz Prompt Definitions ───────────────────────────────────────── */
type ParsedQuiz = {
  title?: string;
  description?: string;
  questions?: Quiz["questions"];
};

const QUIZ_RESPONSE_SCHEMA_PROMPT = `
Return EXACTLY one JSON object matching this schema:
{
  "title": string,
  "description": string,
  "questions": Array<{
    "id": number,
    "question": string,
    "options": string[],
    "correctOption": number
  }>
}

Rules:
- JSON only; no markdown fences.
- Provide unique, sequential numeric ids starting at 1.
- "options" must include at least 3 and at most 5 entries.
- "correctOption" is the 0-based index of the correct answer within "options".
- Ensure exactly one correctOption exists for each question.
- Keep the JSON minimal and strictly valid.
`.trim();

const QUIZ_POLICY = `
QUIZ POLICY
- Difficulty:
  - "easy": simple, factual, common-knowledge questions.
  - "medium": moderate challenge requiring reasoning.
  - "hard": advanced knowledge, tricky distractors.
- Category: all questions must match the requested subject area.
- Title: should summarize the quiz clearly.
- Description: should be 1-2 sentences introducing the theme.
- Language: all text must be in ${lang}.
- Respect the exact number of requested questions.
`.trim();

const QUIZ_SYSTEM = [
  "You are QUIZ MASTER — a specialized multiple-choice quiz generator.",
  "Purpose: create valid quizzes following schema + policy.",
  QUIZ_RESPONSE_SCHEMA_PROMPT,
  "",
  QUIZ_POLICY,
].join("\n\n");

/* ─── Prompt Builder ────────────────────────────────────────────────── */
function buildQuizMessages(
  category: string,
  difficulty: string,
  numQuestions: number
) {
  const userContent = [
    `Generate a quiz with the following parameters:`,
    `- Category: ${category}`,
    `- Difficulty: ${difficulty}`,
    `- Number of questions: ${numQuestions}`,
    "",
    "Output must fully comply with the schema and policy.",
  ].join("\n");

  return [
    { role: "system", content: QUIZ_SYSTEM },
    { role: "user", content: userContent },
  ];
}

/* ─── API Route ────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const { category, difficulty, numQuestions } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not set in server environment" },
        { status: 500 }
      );
    }

    const messages = buildQuizMessages(category, difficulty, numQuestions);

    const body = {
      model: "gpt-4.1-mini",
      messages,
      response_format: { type: "json_object" as const },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      return NextResponse.json(
        { error: `OpenAI request failed: ${resp.status} ${errText}` },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content ?? "{}";

    let parsed: unknown;
    try {
      parsed = JSON.parse(ensureJsonObject(stripCodeFences(raw)));
    } catch {
      parsed = null;
    }
    const pq = parsed as ParsedQuiz | null;
    const quiz: Quiz = {
      id: Date.now().toString(),
      category,
      title: pq?.title && typeof pq.title === "string" ? pq.title : "Untitled",
      description:
        pq?.description && typeof pq.description === "string"
          ? pq.description
          : "",
      questions: Array.isArray(pq?.questions) ? pq!.questions! : [],
    };

    return NextResponse.json({ quiz });
  } catch {
    return NextResponse.json(
      { error: "Quiz generation failed" },
      { status: 500 }
    );
  }
}

/* ─── Helpers ──────────────────────────────────────────────────────── */
function stripCodeFences(s: string): string {
  const fence = /^\s*```(?:json)?\s*([\s\S]*?)\s*```\s*$/i;
  const m = s.match(fence);
  return m ? m[1] : s;
}

function ensureJsonObject(s: string): string {
  if (s.trim().startsWith("{") && s.trim().endsWith("}")) return s.trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return s.slice(start, end + 1).trim();
  }
  return s.trim();
}
