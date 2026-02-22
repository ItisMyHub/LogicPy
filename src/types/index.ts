// Types for LogicPy v4 — 7-Concept Focused Learning System
// "You think it. I show you how Python writes it. Then I teach you why."

// =============================================================================
// CORE: The 7 Concepts — Ordered by pain level (from the research)
// =============================================================================

/**
 * The 7 foundational concepts every beginner must master.
 * Ordered from lowest fear threshold to highest.
 * This replaces the old 10-category system.
 */
export type ConceptLevel =
  | 'print'       // Level 1: Zero fear. Everyone starts here.
  | 'variables'   // Level 2: "input() returns string" pain point
  | 'math'        // Level 3: Operators, precedence, round()
  | 'conditions'  // Level 4: = vs ==, forgetting :, indentation
  | 'loops'       // Level 5: Counter confusion, off-by-one
  | 'lists'       // Level 6: First data structure
  | 'functions';  // Level 7: "I copy code but can't reuse it"

/** Concept metadata — display info for each of the 7 concepts */
export interface ConceptInfo {
  level: number;              // 1–7
  id: ConceptLevel;
  label: string;              // e.g. "Show Something"
  icon: string;               // emoji: 🖨️ 📦 🔢 ❓ 🔁 📋 🔧
  tagline: string;            // e.g. "Print text or numbers"
  color: string;              // Tailwind color class stem, e.g. "blue"
}

// =============================================================================
// TRANSLATION: Engine input/output types
// =============================================================================

export interface TranslationResponse {
  pythonCode: string;
  explanation: string;
  mappings: LogicMapping[];
  alternatives?: AlternativeTranslation[];
  confidence: 'high' | 'medium' | 'low';
  suggestions?: string[];
  /** Which concept(s) this translation exercises */
  concepts?: ConceptLevel[];
  /** Whether the input was out-of-scope for the 7 concepts */
  outOfScope?: boolean;
}

export interface AlternativeTranslation {
  description: string;
  pythonCode: string;
  reason: string;
}

export interface LogicMapping {
  logicWord: string;
  pythonEquivalent: string;
  lineNumber: number;
  explanation: string;
  educationalNote?: string;
}

export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

// =============================================================================
// EXAMPLES: Curated examples per concept
// =============================================================================

/**
 * Old ExampleCategory — kept as alias for backward compatibility
 * during migration. Will be removed once all files are updated.
 * @deprecated Use ConceptLevel instead
 */
export type ExampleCategory = ConceptLevel;

export interface Example {
  id: string;
  title: string;
  logic: string;
  description: string;
  category: ConceptLevel;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// =============================================================================
// EDUCATIONAL: "Why This Works" cards, Pro Tips, Guided Starters
// =============================================================================

/**
 * "Why This Works" — post-translation micro-lesson.
 * One per concept. Shows concept-specific explanations
 * that address the exact confusions the research found.
 */
export interface WhyThisWorksCard {
  concept: ConceptLevel;
  title: string;              // e.g. "🧠 You just used a for-loop with range()"
  points: WhyPoint[];         // 2–4 explanatory points
  deepDiveUrl?: string;       // e.g. W3Schools link
  deepDiveLabel?: string;     // e.g. "Python For Loops"
}

export interface WhyPoint {
  question: string;           // e.g. "Why the colon :?"
  answer: string;             // e.g. "Python uses : to say 'a block starts here.'"
}

/**
 * "Pro Way" — curated "how a pro would write this" variant.
 * Pre-written per pattern, not AI-generated.
 */
export interface ProTip {
  id: string;
  concept: ConceptLevel;
  /** The pattern this applies to, e.g. "for-loop-basic" */
  pattern: string;
  proCode: string;            // The improved version
  changes: ProChange[];       // What changed and why
}

export interface ProChange {
  from: string;               // e.g. "i"
  to: string;                 // e.g. "count"
  reason: string;             // e.g. "Meaningful variable names make code readable"
}

/**
 * Guided Starters — "What do you want to do?" buttons.
 * Kill blank-screen syndrome.
 */
export interface GuidedStarter {
  concept: ConceptLevel;
  icon: string;               // emoji
  label: string;              // e.g. "Repeat something"
  templates: StarterTemplate[];
}

export interface StarterTemplate {
  text: string;               // e.g. "loop ___ times print ___"
  placeholder: string;        // pre-filled version: "loop 5 times print hello"
}

/**
 * Out-of-Scope cards — graceful boundary handling.
 * When user asks for classes, files, lambda, etc.
 */
export interface OutOfScopeCard {
  /** Keywords that trigger this card */
  triggers: string[];
  /** The advanced topic name */
  topic: string;
  /** Friendly explanation of what it is */
  whatItIs: string;
  /** Why we don't cover it */
  whyNotHere: string;
  /** What to learn first (from our 7 concepts) */
  learnFirst: ConceptLevel[];
  /** External resource link */
  resourceUrl?: string;
  resourceLabel?: string;
}

// =============================================================================
// CHALLENGES: "Fix My Mistake" mode
// =============================================================================

export interface Challenge {
  id: string;
  title: string;
  description: string;
  brokenCode: string;
  hint: string;
  expectedOutput: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: ConceptLevel;
  xpReward: number;
}

// =============================================================================
// USER PROGRESS: Gamification
// =============================================================================

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedExamples: string[];
  completedChallenges: string[];
  unlockedFeatures: Feature[];
  /** Which of the 7 concepts the user has tried */
  conceptsExplored: ConceptLevel[];
  streakDays: number;
  lastActiveDate: string;
}

export type Feature =
  | 'basic-translation'
  | 'code-editing'
  | 'challenges'
  | 'export'
  | 'advanced-patterns'
  | 'custom-functions';

// =============================================================================
// APP SETTINGS
// =============================================================================

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model?: string;
  enabled: boolean;
}

export interface AppSettings {
  aiConfig: AIConfig;
  theme: 'light' | 'dark' | 'auto';
  autoTranslate: boolean;
  showHints: boolean;
  soundEnabled: boolean;
}