import type {
  TranslationResponse,
  AIConfig,
  ConceptLevel,
} from '@/types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_OLLAMA_MODEL = 'llama3.2';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
const DEFAULT_ANTHROPIC_MODEL = 'claude-3-haiku-20240307';

// ============================================================================
// SYSTEM PROMPT
// Instructs the LLM to act as LogicPy and return strict JSON.
// ============================================================================

const SYSTEM_PROMPT = `You are LogicPy, a Python teaching assistant for absolute beginners.
Your job: translate plain-English descriptions into correct, minimal Python 3 code and explain it step by step.

CURRICULUM (7 concepts — stay within these):
1. Output / Input  — print(), input(), f-strings
2. Data Types      — int, float, str, bool, type(), int(), float(), str()
3. Operators       — arithmetic (+,-,*,/,//,%,**), comparison (==,!=,<,>,<=,>=), logical (and,or,not), augmented (+=,-=,*=,/=)
4. Control Flow    — if, elif, else (nested conditions are fine)
5. Looping         — for with range(), while, break, continue
6. Collections     — list [], tuple (), dict {} with common methods
7. Functions       — def, parameters, default parameters, return

RULES:
- Produce runnable Python 3 code only. No markdown, no explanations outside JSON.
- Keep code beginner-friendly: no list comprehensions, no lambdas, no decorators.
- If the request is outside these 7 concepts (classes, files, async, etc.), set outOfScope to true and explain what to learn first.
- Map each key natural-language phrase to its Python equivalent in "mappings".
- Provide at least one alternative approach when meaningful.

RESPONSE FORMAT — respond with valid JSON only (no markdown fences, no extra text):
{
  "pythonCode": "<runnable Python 3 code as a string, use \\n for newlines>",
  "explanation": "<one or two beginner-friendly sentences about what the code does>",
  "mappings": [
    {
      "logicWord": "<phrase from the user input>",
      "pythonEquivalent": "<corresponding Python syntax>",
      "lineNumber": 1,
      "explanation": "<why this Python syntax works>",
      "educationalNote": "<one beginner tip about this concept>"
    }
  ],
  "alternatives": [
    {
      "description": "<short name of the alternative>",
      "pythonCode": "<alternative Python code>",
      "reason": "<when to prefer this>"
    }
  ],
  "confidence": "high",
  "suggestions": ["<follow-up thing to try 1>", "<follow-up thing to try 2>"],
  "concepts": ["<subset of: print, variables, math, conditions, loops, lists, functions>"],
  "outOfScope": false
}`;

// ============================================================================
// LLM PROVIDER CALLS
// ============================================================================

async function callOllama(
  model: string,
  userMessage: string,
  baseUrl: string = DEFAULT_OLLAMA_URL
): Promise<string> {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      format: 'json',
      stream: false,
      options: { temperature: 0.1 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama responded with ${response.status}: ${text}`);
  }

  const data = await response.json() as { message?: { content?: string } };
  return data.message?.content ?? '';
}

async function callOpenAI(
  apiKey: string,
  model: string,
  userMessage: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI responded with ${response.status}: ${text}`);
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? '';
}

async function callAnthropic(
  apiKey: string,
  model: string,
  userMessage: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic responded with ${response.status}: ${text}`);
  }

  const data = await response.json() as { content?: Array<{ text?: string }> };
  return data.content?.[0]?.text ?? '';
}

// ============================================================================
// JSON PARSER — robustly extracts TranslationResponse from LLM output
// ============================================================================

const VALID_CONCEPTS: ConceptLevel[] = [
  'print',
  'variables',
  'math',
  'conditions',
  'loops',
  'lists',
  'functions',
];

function parseTranslationJSON(raw: string): TranslationResponse {
  // Strip markdown code fences if the model added them despite instructions
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  return {
    pythonCode: String(parsed.pythonCode ?? ''),
    explanation: String(parsed.explanation ?? ''),
    confidence: (['high', 'medium', 'low'] as const).includes(
      parsed.confidence as 'high' | 'medium' | 'low'
    )
      ? (parsed.confidence as 'high' | 'medium' | 'low')
      : 'medium',
    mappings: Array.isArray(parsed.mappings)
      ? (parsed.mappings as Record<string, unknown>[]).map((entry) => ({
          logicWord: String(entry.logicWord ?? ''),
          pythonEquivalent: String(entry.pythonEquivalent ?? ''),
          lineNumber: Number(entry.lineNumber ?? 1),
          explanation: String(entry.explanation ?? ''),
          educationalNote: entry.educationalNote
            ? String(entry.educationalNote)
            : undefined,
        }))
      : [],
    alternatives: Array.isArray(parsed.alternatives)
      ? (parsed.alternatives as Record<string, unknown>[]).map((alt) => ({
          description: String(alt.description ?? ''),
          pythonCode: String(alt.pythonCode ?? ''),
          reason: String(alt.reason ?? ''),
        }))
      : undefined,
    suggestions: Array.isArray(parsed.suggestions)
      ? (parsed.suggestions as unknown[]).map(String)
      : undefined,
    concepts: Array.isArray(parsed.concepts)
      ? (parsed.concepts as unknown[]).filter((c): c is ConceptLevel =>
          VALID_CONCEPTS.includes(c as ConceptLevel)
        )
      : [],
    outOfScope: Boolean(parsed.outOfScope),
  };
}

// ============================================================================
// FALLBACK — returned when no LLM is reachable
// ============================================================================

function unavailableResponse(reason: string): TranslationResponse {
  return {
    pythonCode: `# ${reason}`,
    explanation: reason,
    confidence: 'low',
    mappings: [],
    concepts: [],
    outOfScope: false,
    suggestions: [
      'Install Ollama from https://ollama.com, then run: ollama pull llama3.2',
      'Or add an OpenAI / Anthropic API key in ⚙ Settings.',
    ],
  };
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Translate a plain-English logic description into Python code via LLM.
 *
 * Provider selection (checked in order):
 *   1. openai    — requires aiConfig.provider === 'openai' and a valid apiKey
 *   2. anthropic — requires aiConfig.provider === 'anthropic' and a valid apiKey
 *   3. local (Ollama) — default; no API key needed; expects Ollama at localhost:11434
 *
 * The model can be overridden with aiConfig.model.
 */
export async function translateLogicToPython(
  logic: string,
  aiConfig?: AIConfig
): Promise<TranslationResponse> {
  const trimmed = (logic ?? '').trim();

  if (!trimmed) {
    return {
      pythonCode: '',
      explanation: 'Describe what you want in plain English.',
      confidence: 'low',
      mappings: [],
      concepts: [],
      suggestions: [
        'Try: print Hello World',
        'Try: ask the user for their name and greet them',
        'Try: loop 5 times and print the counter',
        'Try: define a function that adds two numbers and returns the result',
      ],
    };
  }

  const userMessage = `Translate this plain-English description into Python:\n\n${trimmed}`;

  try {
    const provider = aiConfig?.provider ?? 'local';
    let raw: string;

    if (provider === 'openai' && aiConfig?.apiKey) {
      const model = aiConfig.model ?? DEFAULT_OPENAI_MODEL;
      raw = await callOpenAI(aiConfig.apiKey, model, userMessage);
    } else if (provider === 'anthropic' && aiConfig?.apiKey) {
      const model = aiConfig.model ?? DEFAULT_ANTHROPIC_MODEL;
      raw = await callAnthropic(aiConfig.apiKey, model, userMessage);
    } else {
      // Default: Ollama (local, no API key required)
      const model = aiConfig?.model ?? DEFAULT_OLLAMA_MODEL;
      try {
        raw = await callOllama(model, userMessage);
      } catch (ollamaErr) {
        const msg =
          ollamaErr instanceof Error ? ollamaErr.message : String(ollamaErr);
        // Network / connection errors mean Ollama is not running
        if (
          msg.includes('fetch') ||
          msg.includes('Failed to fetch') ||
          msg.includes('NetworkError') ||
          msg.includes('ECONNREFUSED') ||
          msg.includes('net::ERR')
        ) {
          return unavailableResponse(
            'Ollama is not running. Start it with: ollama serve  (then: ollama pull llama3.2)'
          );
        }
        throw ollamaErr;
      }
    }

    return parseTranslationJSON(raw);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return unavailableResponse(`Translation error: ${msg}`);
  }
}
