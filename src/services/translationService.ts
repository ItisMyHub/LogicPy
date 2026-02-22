import type {
  TranslationResponse,
  AIConfig,
  LogicMapping,
  AlternativeTranslation,
  ConceptLevel,
} from '@/types';

type Confidence = TranslationResponse['confidence'];

// ============================================================================
// SECTION 1: EDUCATIONAL NOTES (7-concept focused)
// ============================================================================

const EDU: Record<string, string> = {
  assignment: 'Use `=` to assign. Example: `x = 5`.',
  print: '`print(...)` displays output.',
  string: 'Strings need quotes: `"hello"`.',
  variable: 'A variable stores a value by name.',
  number: 'Numbers: `42` (int), `3.14` (float).',
  math: 'Precedence: `*`/`/` before `+`/`-`.',
  round: '`round(value, digits)` rounds decimals.',
  condition: 'Comparisons: `>`, `<`, `==`, `!=`.',
  else_branch: '`else:` runs when the `if` condition is False.',
  loop: '`for i in range(n):` repeats n times.',
  while_loop: '`while cond:` repeats while true.',
  indentation: 'Python uses 4-space indentation for blocks.',
  list: 'Lists: `[1, 2, 3]` — ordered, mutable.',
  dict: 'Dicts: `{"key": "val"}` — key-value pairs.',
  function: '`def name(args):` defines a reusable block.',
  input_fn: '`input("prompt")` reads user text.',
  sort: '`sorted(list)` returns sorted copy; `list.sort()` sorts in place.',
  len: '`len(x)` returns the length/size.',
  range: '`range(n)` generates 0..n-1.',
  append: '`list.append(item)` adds to end.',
  remove: '`list.remove(item)` removes first match.',
  index: '`list[i]` accesses item at position i.',
  string_ops:
    'Strings support `+` (concat), `*` (repeat), `.upper()`, `.lower()`, etc.',
  f_string: 'f-strings: `f"Hello {name}"` embed variables in text.',
  type_conv: '`int()`, `float()`, `str()` convert types.',
  import_mod: '`import math` brings in a library.',
  return_stmt: '`return value` sends a result back from a function.',
};

// ============================================================================
// SECTION 2: UTILITIES
// ============================================================================

function esc(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function isIdent(s: string): boolean {
  return /^[a-z_]\w*$/i.test(s.trim());
}

function isNum(s: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(s.trim());
}

function pad(code: string, spaces = 4): string {
  const p = ' '.repeat(spaces);
  return code
    .split('\n')
    .map((l) => (l.trim().length ? p + l : ''))
    .join('\n');
}

function m(
  logicWord: string,
  pythonEquivalent: string,
  lineNumber: number,
  explanation: string,
  educationalNote?: string
): LogicMapping {
  return { logicWord, pythonEquivalent, lineNumber, explanation, educationalNote };
}

function confRank(c: Confidence): number {
  return c === 'high' ? 2 : c === 'medium' ? 1 : 0;
}

function minConf(a: Confidence, b: Confidence): Confidence {
  return confRank(a) <= confRank(b) ? a : b;
}

function splitLines(input: string): string[] {
  return input.split(/\r?\n|;/g).map((s) => s.trim()).filter(Boolean);
}

// ============================================================================
// SECTION 3: TOKENIZER + NORMALIZER
// ============================================================================

type TT =
  | 'num'
  | 'id'
  | 'str'
  | 'op'
  | 'lp'
  | 'rp'
  | 'lbr'
  | 'rbr'
  | 'comma'
  | 'colon'
  | 'eof';

type Tok = { type: TT; value: string; raw?: string };

/**
 * NORMALIZER
 * - Preserves quoted strings
 * - Lowercases everything else
 * - Normalizes English comparisons/operators into canonical Python-ish forms
 */
function normalize(input: string): string {
  let s = ' ' + input + ' ';

  // Preserve quoted strings by replacing them with placeholders
  const strings: string[] = [];
  s = s.replace(/"([^"]*)"|'([^']*)'/g, (_m, d, si) => {
    strings.push(d ?? si ?? '');
    return `__STR${strings.length - 1}__`;
  });

  s = s.toLowerCase();

  // "the current number/count..." → i (loop counter)
  s = s.replace(/\bthe current (?:number|count|index|value|iteration)\b/g, ' i ');

  // Comparison operators
  s = s.replace(/\bis greater than or equal to\b/g, ' >= ');
  s = s.replace(/\bis less than or equal to\b/g, ' <= ');
  s = s.replace(/\bis not equal to\b/g, ' != ');
  s = s.replace(/\bis equal to\b/g, ' == ');
  s = s.replace(/\bis greater than\b/g, ' > ');
  s = s.replace(/\bis less than\b/g, ' < ');
  s = s.replace(/\bis over than\b/g, ' > ');
  s = s.replace(/\bis over\b/g, ' > ');
  s = s.replace(/\bis under\b/g, ' < ');
  s = s.replace(/\bis above\b/g, ' > ');
  s = s.replace(/\bis below\b/g, ' < ');
  s = s.replace(/\bis at least\b/g, ' >= ');
  s = s.replace(/\bis at most\b/g, ' <= ');
  s = s.replace(/\bgreater than or equal to\b/g, ' >= ');
  s = s.replace(/\bless than or equal to\b/g, ' <= ');
  s = s.replace(/\bnot equal to\b/g, ' != ');
  s = s.replace(/\bequal to\b/g, ' == ');
  s = s.replace(/\bgreater than\b/g, ' > ');
  s = s.replace(/\bless than\b/g, ' < ');
  s = s.replace(/\bover than\b/g, ' > ');
  s = s.replace(/\bmore than\b/g, ' > ');
  s = s.replace(/\bfewer than\b/g, ' < ');
  s = s.replace(/\bequals\b/g, ' == ');

  // Arithmetic operators
  s = s.replace(/\bdivided by\b/g, ' / ');
  s = s.replace(/\bmultiplied by\b/g, ' * ');
  s = s.replace(/\bplus\b/g, ' + ');
  s = s.replace(/\bminus\b/g, ' - ');
  s = s.replace(/\btimes\b/g, ' * ');
  s = s.replace(/\bover\b(?!\s*(?:than))/g, ' / ');
  s = s.replace(/\bmodulo\b/g, ' % ');
  s = s.replace(/\bmod\b/g, ' % ');
  s = s.replace(/\bto the power of\b/g, ' ** ');
  s = s.replace(/\braised to\b/g, ' ** ');
  s = s.replace(/\bsquared\b/g, ' ** 2 ');
  s = s.replace(/\bcubed\b/g, ' ** 3 ');

  // Math phrases → Python
  s = s.replace(
    /\bsquare root of\s+(.+?)(?=\s*$|\s+(?:and|or|then|print|show|display|\+|-|\*|\/|>|<|==|!=|>=|<=))/g,
    (_m, arg) => ` math.sqrt(${arg.trim()}) `
  );
  s = s.replace(
    /\babsolute value of\s+(.+?)(?=\s*$|\s+(?:and|or|then|print|show|display|\+|-|\*|\/|>|<|==|!=|>=|<=))/g,
    (_m, arg) => ` abs(${arg.trim()}) `
  );

  // Constants
  s = s.replace(/\bpi\b/g, ' math.pi ');
  s = s.replace(/\beuler\b/g, ' math.e ');

  // Boolean operators
  s = s.replace(/\band\b/g, ' and ');
  s = s.replace(/\bor\b/g, ' or ');
  s = s.replace(/\bnot\b/g, ' not ');

  // Number words → digits (small set)
  const numWords: Record<string, string> = {
    zero: '0',
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
    ten: '10',
    eleven: '11',
    twelve: '12',
    thirteen: '13',
    fourteen: '14',
    fifteen: '15',
    sixteen: '16',
    seventeen: '17',
    eighteen: '18',
    nineteen: '19',
    twenty: '20',
  };

  for (const [word, digit] of Object.entries(numWords)) {
    s = s.replace(new RegExp(`\\b${word}\\b`, 'g'), digit);
  }

  // Restore strings
  s = s.replace(/__STR(\d+)__/g, (_m, idx) => `"${strings[parseInt(idx, 10)]}"`);

  return s.replace(/\s+/g, ' ').trim();
}

function tokenize(input: string): Tok[] {
  const s = input;
  const tokens: Tok[] = [];
  let i = 0;

  const peek = () => s[i] ?? '';
  const next = () => s[i++] ?? '';
  const isWs = (c: string) => /\s/.test(c);
  const isDig = (c: string) => /[0-9]/.test(c);
  const isAl = (c: string) => /[a-z_]/i.test(c);

  while (i < s.length) {
    const c = peek();
    if (isWs(c)) {
      next();
      continue;
    }
    if (c === '(') {
      next();
      tokens.push({ type: 'lp', value: '(' });
      continue;
    }
    if (c === ')') {
      next();
      tokens.push({ type: 'rp', value: ')' });
      continue;
    }
    if (c === '[') {
      next();
      tokens.push({ type: 'lbr', value: '[' });
      continue;
    }
    if (c === ']') {
      next();
      tokens.push({ type: 'rbr', value: ']' });
      continue;
    }
    if (c === ',') {
      next();
      tokens.push({ type: 'comma', value: ',' });
      continue;
    }
    if (c === ':') {
      next();
      tokens.push({ type: 'colon', value: ':' });
      continue;
    }

    // Quoted strings
    if (c === '"' || c === "'") {
      const q = next();
      let out = '';
      while (i < s.length && peek() !== q) {
        const ch = next();
        if (ch === '\\' && i < s.length) out += ch + next();
        else out += ch;
      }
      if (peek() === q) next();
      tokens.push({ type: 'str', value: out });
      continue;
    }

    // Numbers
    if (isDig(c) || (c === '.' && isDig(s[i + 1] ?? ''))) {
      let out = '';
      let dot = 0;
      while (i < s.length) {
        const ch = peek();
        if (ch === '.') {
          if (isDig(s[i + 1] ?? '')) {
            dot++;
            if (dot > 1) break;
            out += next();
          } else {
            break;
          }
        } else if (isDig(ch)) {
          out += next();
        } else {
          break;
        }
      }
      tokens.push({ type: 'num', value: out });
      continue;
    }

    // 2-char ops
    const two = s.slice(i, i + 2);
    if (two === '>=' || two === '<=' || two === '==' || two === '!=' || two === '**') {
      i += 2;
      tokens.push({ type: 'op', value: two });
      continue;
    }

    // 1-char ops
    if ('+-*/%><'.includes(c)) {
      next();
      tokens.push({ type: 'op', value: c });
      continue;
    }

    // Identifiers / keywords — dotted access allowed
    if (isAl(c)) {
      let out = '';
      while (i < s.length && /[a-z0-9_]/i.test(peek())) out += next();

      while (peek() === '.' && i + 1 < s.length && isAl(s[i + 1]!)) {
        out += next(); // '.'
        while (i < s.length && /[a-z0-9_]/i.test(peek())) out += next();
      }

      if (out === 'and' || out === 'or' || out === 'not') {
        tokens.push({ type: 'op', value: out });
      } else if (out === 'true') {
        tokens.push({ type: 'id', value: 'True' });
      } else if (out === 'false') {
        tokens.push({ type: 'id', value: 'False' });
      } else if (out === 'none') {
        tokens.push({ type: 'id', value: 'None' });
      } else {
        tokens.push({ type: 'id', value: out });
      }
      continue;
    }

    next();
  }

  tokens.push({ type: 'eof', value: '' });
  return tokens;
}

// ============================================================================
// SECTION 4: EXPRESSION PARSER (Pratt)
// ============================================================================

type Expr =
  | { kind: 'num'; value: string }
  | { kind: 'id'; name: string }
  | { kind: 'str'; value: string }
  | { kind: 'bool'; value: string }
  | { kind: 'none' }
  | { kind: 'unary'; op: string; right: Expr }
  | { kind: 'binary'; left: Expr; op: string; right: Expr }
  | { kind: 'call'; name: string; args: Expr[] }
  | { kind: 'index'; obj: Expr; idx: Expr }
  | { kind: 'list'; items: Expr[] }
  | { kind: 'dict'; pairs: Array<{ key: Expr; val: Expr }> }
  | { kind: 'fstring'; parts: Array<string | Expr> };

function exprToPy(e: Expr): string {
  switch (e.kind) {
    case 'num':
      return e.value;
    case 'id':
      return e.name;
    case 'str':
      return `"${esc(e.value)}"`;
    case 'bool':
      return e.value;
    case 'none':
      return 'None';
    case 'unary':
      return e.op === 'not' ? `not ${exprToPy(e.right)}` : `(${e.op}${exprToPy(e.right)})`;
    case 'binary':
      return `${exprToPy(e.left)} ${e.op} ${exprToPy(e.right)}`;
    case 'call':
      return `${e.name}(${e.args.map(exprToPy).join(', ')})`;
    case 'index':
      return `${exprToPy(e.obj)}[${exprToPy(e.idx)}]`;
    case 'list':
      return `[${e.items.map(exprToPy).join(', ')}]`;
    case 'dict':
      return `{${e.pairs.map((p) => `${exprToPy(p.key)}: ${exprToPy(p.val)}`).join(', ')}}`;
    case 'fstring': {
      const inner = e.parts.map((p) => (typeof p === 'string' ? p : `{${exprToPy(p)}}`)).join('');
      return `f"${inner}"`;
    }
  }
}

class ExprParser {
  private tokens: Tok[];
  private pos = 0;

  constructor(tokens: Tok[]) {
    this.tokens = tokens;
  }

  private cur(): Tok {
    return this.tokens[this.pos]!;
  }

  private adv(): Tok {
    const t = this.cur();
    this.pos++;
    return t;
  }

  private expect(type: TT, value?: string): Tok {
    const t = this.cur();
    if (t.type !== type) throw new Error(`Expected ${type}, got ${t.type}:${t.value}`);
    if (value !== undefined && t.value !== value) throw new Error(`Expected ${value}, got ${t.value}`);
    return this.adv();
  }

  private lbp(t: Tok): number {
    if (t.type !== 'op') return 0;
    switch (t.value) {
      case 'or':
        return 10;
      case 'and':
        return 20;
      case '==':
      case '!=':
      case '>':
      case '<':
      case '>=':
      case '<=':
        return 30;
      case '+':
      case '-':
        return 40;
      case '*':
      case '/':
      case '%':
        return 50;
      case '**':
        return 60;
      default:
        return 0;
    }
  }

  parse(rbp = 0): Expr {
    let left = this.nud();
    while (rbp < this.lbp(this.cur())) {
      left = this.led(left);
    }
    return left;
  }

  private nud(): Expr {
    const t = this.adv();

    if (t.type === 'num') return { kind: 'num', value: t.value };
    if (t.type === 'str') return { kind: 'str', value: t.value };

    if (t.type === 'id') {
      if (t.value === 'True' || t.value === 'False') return { kind: 'bool', value: t.value };
      if (t.value === 'None') return { kind: 'none' };

      // call
      if (this.cur().type === 'lp') {
        const name = t.value;
        this.adv(); // (
        const args: Expr[] = [];
        if (this.cur().type !== 'rp') {
          args.push(this.parse(0));
          while (this.cur().type === 'comma') {
            this.adv();
            args.push(this.parse(0));
          }
        }
        this.expect('rp');
        return { kind: 'call', name, args };
      }

      // index
      if (this.cur().type === 'lbr') {
        this.adv();
        const idx = this.parse(0);
        this.expect('rbr');
        return { kind: 'index', obj: { kind: 'id', name: t.value }, idx };
      }

      return { kind: 'id', name: t.value };
    }

    // unary
    if (t.type === 'op' && (t.value === '+' || t.value === '-' || t.value === 'not')) {
      return { kind: 'unary', op: t.value, right: this.parse(65) };
    }

    // parens
    if (t.type === 'lp') {
      const e = this.parse(0);
      this.expect('rp');
      return e;
    }

    // list literal
    if (t.type === 'lbr') {
      const items: Expr[] = [];
      if (this.cur().type !== 'rbr') {
        items.push(this.parse(0));
        while (this.cur().type === 'comma') {
          this.adv();
          items.push(this.parse(0));
        }
      }
      this.expect('rbr');
      return { kind: 'list', items };
    }

    throw new Error(`Unexpected: ${t.type}:${t.value}`);
  }

  private led(left: Expr): Expr {
    const t = this.adv();
    if (t.type !== 'op') throw new Error(`Unexpected infix: ${t.type}:${t.value}`);
    const bp = this.lbp(t);
    const assoc = t.value === '**' ? bp - 1 : bp;
    const right = this.parse(assoc);
    return { kind: 'binary', left, op: t.value, right };
  }

  atEnd(): boolean {
    return this.cur().type === 'eof';
  }
}

function tryParseExpr(text: string): Expr | null {
  try {
    const norm = normalize(text);
    const toks = tokenize(norm);
    const p = new ExprParser(toks);
    const e = p.parse(0);
    if (!p.atEnd()) return null;
    return e;
  } catch {
    return null;
  }
}

// ============================================================================
// SECTION 5: AST / IR — Statement nodes
// ============================================================================

type Stmt =
  | { kind: 'assign'; target: string; value: Expr }
  | { kind: 'print'; value: Expr }
  | { kind: 'if'; cond: Expr; body: Stmt[]; elifs: Array<{ cond: Expr; body: Stmt[] }>; elseBody: Stmt[] }
  | { kind: 'for_range'; var_: string; count: Expr; body: Stmt[] }
  | { kind: 'while'; cond: Expr; body: Stmt[] }
  | { kind: 'func_def'; name: string; params: string[]; body: Stmt[] }
  | { kind: 'return'; value: Expr | null }
  | { kind: 'call_stmt'; expr: Expr }
  | { kind: 'list_create'; name: string; items: Expr[] }
  | { kind: 'dict_create'; name: string; pairs: Array<{ key: Expr; val: Expr }> }
  | { kind: 'sort'; target: string; order: 'asc' | 'desc'; inPlace: boolean }
  | { kind: 'append'; target: string; value: Expr }
  | { kind: 'remove'; target: string; value: Expr }
  | { kind: 'import'; module: string; items?: string[] }
  | { kind: 'input'; target: string; prompt: string }
  | { kind: 'comment'; text: string }
  | { kind: 'clarify'; input: string; explanation: string; questions: string[] };

// ============================================================================
// SECTION 6: STATEMENT PARSER (English → AST)
// ============================================================================

type StmtParser = (normalized: string, original?: string) => Stmt | null;

function parseItemList(text: string): string[] {
  const cleaned = text.replace(/\band\b/gi, ',').replace(/\s*,\s*/g, ',');
  return cleaned.split(',').map((s) => s.trim()).filter(Boolean);
}

function parseNameAndItems(text: string): { name: string; items: string[] } | null {
  let match = text.match(/^(?:of\s+)?(\w+)\s*:\s*(.+)$/i);
  if (match) return { name: match[1], items: parseItemList(match[2]) };

  match = text.match(/^(?:called|named)\s+(\w+)\s+(?:with|containing|having)\s+(.+)$/i);
  if (match) return { name: match[1], items: parseItemList(match[2]) };

  match = text.match(/^of\s+(\w+)\s+(?:with|containing|having)\s+(.+)$/i);
  if (match) return { name: match[1], items: parseItemList(match[2]) };

  match = text.match(/^(\w+)\s+(?:=|with|containing)\s+(.+)$/i);
  if (match) return { name: match[1], items: parseItemList(match[2]) };

  match = text.match(/^of\s+(.+)$/i);
  if (match) return { name: 'my_list', items: parseItemList(match[1]) };

  return null;
}

const stmtParsers: StmtParser[] = [];

// ---- ROUND ----
stmtParsers.push((raw) => {
  const match =
    raw.match(/^round\s+(.+?)\s+to\s+(\d+)\s*(?:decimal\s*places?|decimals?|dp|digits?)?\s*$/i) ??
    raw.match(/^round\s+(.+?)\s+to\s+(\d+)\s*$/i);
  if (!match) return null;
  const expr = tryParseExpr(match[1]);
  if (!expr) return null;
  const places = parseInt(match[2], 10);
  return {
    kind: 'assign',
    target: 'result',
    value: { kind: 'call', name: 'round', args: [expr, { kind: 'num', value: String(places) }] },
  };
});

// ---- IF / ELSE (single-line) ----
stmtParsers.push((normalized) => {
  // Explicit then/else
  let elseMatch = normalized.match(/^if\s+(.+?)\s+then\s+(.+?)\s+else\s+(.+)$/i);

  // Action-keyword split else
  if (!elseMatch) {
    elseMatch = normalized.match(
      /^if\s+(.+?)\s+((?:print|show|display|say|set|let|make|return|loop|repeat)\s+.+?)\s+else\s+(.+)$/i
    );
  }

  if (elseMatch) {
    const condExpr = tryParseExpr(elseMatch[1]);
    if (!condExpr) return null;
    const bodyStmt = parseLine(elseMatch[2]);
    const elseStmt = parseLine(elseMatch[3]);
    return { kind: 'if', cond: condExpr, body: [bodyStmt], elifs: [], elseBody: [elseStmt] };
  }

  // if ... then ...
  let match = normalized.match(/^if\s+(.+?)\s+then\s+(.+)$/i);

  // Split on action keywords
  if (!match) {
    match = normalized.match(
      /^if\s+(.+?)\s+((?:print|show|display|say|set|let|make|return|loop|repeat)\s+.+)$/i
    );
  }

  if (!match) return null;
  const condExpr = tryParseExpr(match[1]);
  if (!condExpr) return null;
  const bodyStmt = parseLine(match[2]);
  return { kind: 'if', cond: condExpr, body: [bodyStmt], elifs: [], elseBody: [] };
});

// ---- WHILE LOOP ----
stmtParsers.push((normalized) => {
  let match = normalized.match(/^while\s+(.+?)\s+do\s+(.+)$/i);
  if (!match) {
    match = normalized.match(/^while\s+(.+?)\s+((?:print|show|display|say|set|let|make|return)\s+.+)$/i);
  }
  if (!match) return null;

  const cond = tryParseExpr(match[1]);
  if (!cond) return null;

  const body = parseLine(match[2]);
  return { kind: 'while', cond, body: [body] };
});

// ---- FOR / LOOP / REPEAT ----
stmtParsers.push((normalized) => {
  // loop 5 times print Hello
  let match = normalized.match(/^(?:loop|repeat|for)\s+(.+?)\s+times?\s+(?:and\s+|then\s+)?(.+)$/i);

  // loop 5 times
  if (!match) {
    const countOnly = normalized.match(/^(?:loop|repeat|for)\s+(.+?)\s+times?\s*$/i);
    if (!countOnly) return null;

    const countExpr = tryParseExpr(countOnly[1]);
    if (!countExpr) return null;

    return {
      kind: 'for_range',
      var_: 'i',
      count: countExpr,
      body: [{ kind: 'print', value: { kind: 'id', name: 'i' } }],
    };
  }

  const countExpr = tryParseExpr(match[1]);
  if (!countExpr) return null;

  const bodyStmt = parseLine(match[2]);
  return { kind: 'for_range', var_: 'i', count: countExpr, body: [bodyStmt] };
});

// ---- FUNCTION DEFINITION (basic) ----
stmtParsers.push((normalized, _original) => {
  const match = normalized.match(
    /^(?:define|create|make)\s+(?:a\s+)?function\s+(?:called\s+)?(\w+)\s*(?:with|taking)?\s*([a-z_,\s]*)?\s*(?:that\s+|which\s+)?(.+)?$/i
  );
  if (!match) return null;

  const name = match[1];
  if (!name) return null; // satisfies noUncheckedIndexedAccess

  const paramsRaw = (match[2] ?? '').trim();
  const bodyText = (match[3] ?? '').trim();

  const params =
    paramsRaw.length > 0
      ? parseItemList(paramsRaw).map((p) => p.trim()).filter((p) => isIdent(p))
      : [];

  const bodyStmt: Stmt =
    bodyText.length > 0
      ? parseLine(bodyText)
      : { kind: 'print', value: { kind: 'str', value: `${name} called` } };

  return { kind: 'func_def', name, params, body: [bodyStmt] };
});

// ---- LIST CREATION ----
stmtParsers.push((normalized) => {
  // create list with apple, banana, cherry
  let match = normalized.match(/^(?:create|make|define|build)\s+(?:a\s+)?(?:list|array)\s+(.+)$/i);

  // create list with ...
  if (!match) {
    match = normalized.match(/^(?:create|make|define|build)\s+(?:list|array)\s+(?:with|containing|having)\s+(.+)$/i);
    if (!match) return null;

    const items = parseItemList(match[1]);
    if (items.length === 0) return null;

    const exprItems: Expr[] = items.map((item) =>
      isNum(item) ? ({ kind: 'num', value: item } as const) : ({ kind: 'str', value: item } as const)
    );

    return { kind: 'list_create', name: 'my_list', items: exprItems };
  }

  const info = parseNameAndItems(match[1]);
  if (!info || info.items.length === 0) return null;

  const items: Expr[] = info.items.map((item) => {
    if (isNum(item)) return { kind: 'num', value: item };
    return { kind: 'str', value: item };
  });

  return { kind: 'list_create', name: info.name, items };
});

// ---- DICT CREATION ----
stmtParsers.push((raw) => {
  const match = raw.match(
    /^(?:create|make|define|build)\s+(?:a\s+)?(?:dictionary|dict|map)\s+(?:called\s+)?(\w+)\s*(?:with|containing|:)\s*(.+)$/i
  );
  if (!match) return null;

  const name = match[1];
  const pairStrs = parseItemList(match[2]);
  const pairs: Array<{ key: Expr; val: Expr }> = [];

  for (const ps of pairStrs) {
    const kv = ps.match(/^(\w+)\s*(?:=|is|:)\s*(.+)$/);
    if (kv) {
      const valText = kv[2].trim();
      const val = isNum(valText) ? ({ kind: 'num', value: valText } as const) : ({ kind: 'str', value: valText } as const);
      pairs.push({ key: { kind: 'str', value: kv[1] }, val });
    }
  }

  if (pairs.length === 0) return null;
  return { kind: 'dict_create', name, pairs };
});

// ---- SORT ----
stmtParsers.push((raw) => {
  const match = raw.match(/^sort\s+(\w+)\s*(?:in\s+)?(ascending|descending|asc|desc)?(?:\s+order)?$/i);
  if (!match) {
    if (/^sort\b/i.test(raw) && !/^sort\s+\w+/.test(raw)) {
      return {
        kind: 'clarify',
        input: raw,
        explanation: 'What should I sort?',
        questions: [
          'What is the variable name to sort? (example: sort my_list)',
          'Ascending or descending? (example: sort my_list descending)',
        ],
      };
    }
    return null;
  }

  const target = match[1];
  const orderRaw = (match[2] ?? 'ascending').toLowerCase();
  const order = orderRaw.startsWith('desc') ? ('desc' as const) : ('asc' as const);
  return { kind: 'sort', target, order, inPlace: true };
});

// ---- APPEND ----
stmtParsers.push((normalized) => {
  const match =
    normalized.match(/^(?:add|append|push)\s+(.+?)\s+to\s+(\w+)$/i) ??
    normalized.match(/^(?:add|append|push)\s+(.+?)\s+(?:into|onto)\s+(\w+)$/i);
  if (!match) return null;

  const target = match[2];
  const valRaw = match[1].trim();

  const expr = tryParseExpr(valRaw);
  if (expr && expr.kind !== 'id') {
    return { kind: 'append', target, value: expr };
  }

  // default: treat as string (orange, apple, Alice, etc.)
  return { kind: 'append', target, value: { kind: 'str', value: valRaw } };
});

// ---- REMOVE ----
stmtParsers.push((raw) => {
  const match = raw.match(/^(?:remove|delete)\s+(.+?)\s+from\s+(\w+)$/i);
  if (!match) return null;

  const valueExpr = tryParseExpr(match[1]) ?? { kind: 'str', value: match[1].trim() };
  return { kind: 'remove', target: match[2], value: valueExpr };
});

// ---- IMPORT ----
stmtParsers.push((raw) => {
  const match = raw.match(/^(?:import|load|use|bring in)\s+(\w+)$/i);
  if (!match) return null;
  return { kind: 'import', module: match[1] };
});

// ---- INPUT ----
stmtParsers.push((raw) => {
  const match = raw.match(
    /^(?:ask|get|read|input)\s+(?:the\s+)?(?:user\s+)?(?:for\s+)?(?:(?:a|an|the|their)\s+)?(\w+)(?:\s+(?:with|using)\s+(?:prompt|message)\s+(.+))?$/i
  );
  if (!match) return null;

  const target = match[1];
  const prompt = match[2] ?? `Enter ${target}: `;
  return { kind: 'input', target, prompt };
});

// ---- ASSIGNMENT ----
stmtParsers.push((raw) => {
  const match = raw.match(/^(?:set|let|make|create|define|store)\s+([a-z_]\w*)\s*(?:=|is|to|equals?|as)\s+(.+)$/i);
  if (!match) return null;

  const name = match[1];
  const rhsRaw = match[2].trim();

  const expr = tryParseExpr(rhsRaw);
  if (expr) return { kind: 'assign', target: name, value: expr };

  return { kind: 'assign', target: name, value: { kind: 'str', value: rhsRaw } };
});

// ---- PRINT ----
stmtParsers.push((normalized, original = normalized) => {
  const match = normalized.match(/^(?:print|show|display|output|say|echo|log|write)\s+(.+)$/i);
  if (!match) return null;

  const content = match[1].trim();

  const origMatch = original.match(/^(?:print|show|display|output|say|echo|log|write)\s+(.+)$/i);
  const origContent = (origMatch ? origMatch[1] : content).trim();

  if (isNum(content)) return { kind: 'print', value: { kind: 'num', value: content } };

  const expr = tryParseExpr(content);
  if (expr) {
    if (expr.kind !== 'id') return { kind: 'print', value: expr };

    // lowercase → variable; mixed/uppercase → string
    if (/^[a-z_][a-z0-9_]*$/.test(origContent)) {
      return { kind: 'print', value: { kind: 'id', name: origContent } };
    }
    return { kind: 'print', value: { kind: 'str', value: origContent } };
  }

  return { kind: 'print', value: { kind: 'str', value: origContent } };
});

// ---- RETURN ----
stmtParsers.push((raw) => {
  const match = raw.match(/^return\s+(.+)$/i);
  if (!match) return null;
  const expr = tryParseExpr(match[1]);
  return { kind: 'return', value: expr ?? { kind: 'str', value: match[1].trim() } };
});

// ---- CLARIFICATION ----
stmtParsers.push((raw) => {
  const s = raw.toLowerCase();

  if (/\b(make it faster|optimi[sz]e it|speed it up|improve it)\b/.test(s)) {
    return {
      kind: 'clarify',
      input: raw,
      explanation: 'You want to optimize something, but I need details.',
      questions: ['What code/function should be faster?', 'Optimize for runtime or memory?'],
    };
  }

  if (/\b(create|make|build)\b.*\b(program|app|application|software)\b.*\b(for|that)\b/.test(s)) {
    return {
      kind: 'clarify',
      input: raw,
      explanation: 'This request is broad. I can help if you specify the exact task.',
      questions: [
        'What does the program need to do (one sentence)?',
        'What inputs does it take?',
        'What output should it produce?',
      ],
    };
  }

  if (/\b(fix|debug|repair)\b.*\b(it|this|that|code)\b/.test(s) && s.length < 30) {
    return {
      kind: 'clarify',
      input: raw,
      explanation: 'What should I fix?',
      questions: ['Paste the code or describe what is wrong.', 'What error or wrong behavior do you see?'],
    };
  }

  return null;
});

// ---- parseLine ----
function parseLine(line: string): Stmt {
  const raw = line.trim();
  if (!raw) return { kind: 'comment', text: '(empty line)' };

  // commas at clause boundaries often break parsing: "... 18, print ..."
  const cleaned = raw
    .replace(/^[,;]+\s*/, '')
    .replace(/[,;]+\s*$/, '')
    .replace(/,\s+(?=print|show|display|say|set|let|loop|repeat|while|if|return)\b/gi, ' ');

  const normalized = normalize(cleaned);

  for (const parser of stmtParsers) {
    const result = parser(normalized, cleaned);
    if (result) return result;
  }

  const expr = tryParseExpr(normalized);
  if (expr) return { kind: 'call_stmt', expr };

  return { kind: 'print', value: { kind: 'str', value: raw } };
}

// ============================================================================
// SECTION 7: CODE GENERATOR (AST → Python)
// ============================================================================

interface GenResult {
  code: string;
  mappings: LogicMapping[];
  confidence: Confidence;
  alternatives: AlternativeTranslation[];
  suggestions: string[];
  concepts: ConceptLevel[];
}

function generateStmt(stmt: Stmt, lineOffset = 1): GenResult {
  const mappings: LogicMapping[] = [];
  const alternatives: AlternativeTranslation[] = [];
  const suggestions: string[] = [];
  let confidence: Confidence = 'high';
  const concepts: ConceptLevel[] = [];

  switch (stmt.kind) {
    case 'assign': {
      const py = exprToPy(stmt.value);
      const code = `${stmt.target} = ${py}\nprint(${stmt.target})`;
      concepts.push('variables');

      if (stmt.value.kind === 'binary' || stmt.value.kind === 'call') concepts.push('math');

      mappings.push(m(stmt.target, stmt.target, lineOffset, 'Variable', EDU.assignment));
      mappings.push(m(py, py, lineOffset, 'Value/expression', EDU.math));

      alternatives.push({
        description: 'Print without storing',
        pythonCode: `print(${py})`,
        reason: 'Use when you do not need the value later.',
      });

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'print': {
      const py = exprToPy(stmt.value);
      const code = `print(${py})`;
      concepts.push('print');

      const isVar = stmt.value.kind === 'id';
      const noteKey = isVar ? 'variable' : stmt.value.kind === 'num' ? 'number' : 'string';

      mappings.push(m('print', 'print()', lineOffset, 'Output function', EDU.print));
      mappings.push(m(py, py, lineOffset, isVar ? 'Variable' : 'Value', EDU[noteKey]));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'if': {
      const pyCond = exprToPy(stmt.cond);
      const bodyResults = stmt.body.map((s, i) => generateStmt(s, lineOffset + 1 + i));
      const bodyCode = bodyResults.map((r) => r.code).join('\n');

      concepts.push('conditions');
      concepts.push(...bodyResults.flatMap((r) => r.concepts));

      let code = `if ${pyCond}:\n${pad(bodyCode)}`;

      mappings.push(m(pyCond, `if ${pyCond}:`, lineOffset, 'Condition', EDU.condition));
      mappings.push(m('indentation', '4 spaces', lineOffset + 1, 'Block indent', EDU.indentation));
      bodyResults.forEach((r) => mappings.push(...r.mappings));

      if (stmt.elseBody.length > 0) {
        const elseResults = stmt.elseBody.map((s, i) =>
          generateStmt(s, lineOffset + 2 + stmt.body.length + i)
        );
        const elseCode = elseResults.map((r) => r.code).join('\n');
        code += `\nelse:\n${pad(elseCode)}`;

        mappings.push(m('else', 'else:', lineOffset + 1 + stmt.body.length, 'Else branch', EDU.else_branch));
        elseResults.forEach((r) => mappings.push(...r.mappings));
        concepts.push(...elseResults.flatMap((r) => r.concepts));
      }

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'while': {
      const pyCond = exprToPy(stmt.cond);
      const bodyResults = stmt.body.map((s, i) => generateStmt(s, lineOffset + 1 + i));
      const bodyCode = bodyResults.map((r) => r.code).join('\n');

      concepts.push('loops');
      concepts.push(...bodyResults.flatMap((r) => r.concepts));

      const code = `while ${pyCond}:\n${pad(bodyCode)}`;
      mappings.push(m(pyCond, `while ${pyCond}:`, lineOffset, 'While condition', EDU.while_loop));
      bodyResults.forEach((r) => mappings.push(...r.mappings));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'for_range': {
      const pyCount = exprToPy(stmt.count);
      const bodyResults = stmt.body.map((s, i) => generateStmt(s, lineOffset + 1 + i));
      const bodyCode = bodyResults.map((r) => r.code).join('\n');

      concepts.push('loops');
      concepts.push(...bodyResults.flatMap((r) => r.concepts));

      const code = `for ${stmt.var_} in range(${pyCount}):\n${pad(bodyCode)}`;

      mappings.push(m(`loop ${pyCount} times`, `for ${stmt.var_} in range(${pyCount}):`, lineOffset, 'Loop', EDU.loop));
      bodyResults.forEach((r) => mappings.push(...r.mappings));

      alternatives.push({
        description: 'Start counting from 1',
        pythonCode: `for ${stmt.var_} in range(1, ${pyCount} + 1):\n${pad(bodyCode)}`,
        reason: 'When you want i = 1, 2, ..., n instead of 0, 1, ..., n-1.',
      });

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'func_def': {
      const params = stmt.params.join(', ');
      const bodyResults = stmt.body.map((s, i) => generateStmt(s, lineOffset + 1 + i));
      const bodyCode = bodyResults.map((r) => r.code).join('\n');

      concepts.push('functions');
      concepts.push(...bodyResults.flatMap((r) => r.concepts));

      const code = `def ${stmt.name}(${params}):\n${pad(bodyCode)}`;

      mappings.push(m(stmt.name, `def ${stmt.name}(${params}):`, lineOffset, 'Function definition', EDU.function));
      bodyResults.forEach((r) => mappings.push(...r.mappings));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'return': {
      const py = stmt.value ? exprToPy(stmt.value) : '';
      const code = stmt.value ? `return ${py}` : 'return';

      concepts.push('functions');
      mappings.push(m('return', code, lineOffset, 'Return from function', EDU.return_stmt));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'call_stmt': {
      const py = exprToPy(stmt.expr);
      return { code: py, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'list_create': {
      const items = stmt.items.map(exprToPy).join(', ');
      const code = `${stmt.name} = [${items}]\nprint(${stmt.name})`;

      concepts.push('lists');
      mappings.push(m(stmt.name, `${stmt.name} = [...]`, lineOffset, 'List variable', EDU.list));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'dict_create': {
      const pairs = stmt.pairs.map((p) => `${exprToPy(p.key)}: ${exprToPy(p.val)}`).join(', ');
      const code = `${stmt.name} = {${pairs}}\nprint(${stmt.name})`;

      concepts.push('variables');
      mappings.push(m(stmt.name, `${stmt.name} = {...}`, lineOffset, 'Dictionary', EDU.dict));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'sort': {
      const rev = stmt.order === 'desc' ? 'reverse=True' : '';
      const args = rev ? rev : '';
      const code = `${stmt.target}.sort(${args})\nprint(${stmt.target})`;

      concepts.push('lists');
      mappings.push(m(`sort ${stmt.target}`, `${stmt.target}.sort(...)`, lineOffset, 'Sort in place', EDU.sort));

      alternatives.push({
        description: 'Return a new sorted list',
        pythonCode: `sorted_${stmt.target} = sorted(${stmt.target}${stmt.order === 'desc' ? ', reverse=True' : ''})\nprint(sorted_${stmt.target})`,
        reason: 'Keeps the original list unchanged.',
      });

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'append': {
      const py = exprToPy(stmt.value);
      const code = `${stmt.target}.append(${py})\nprint(${stmt.target})`;

      concepts.push('lists');
      mappings.push(m(`add ${py} to ${stmt.target}`, `${stmt.target}.append(${py})`, lineOffset, 'Append to list', EDU.append));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'remove': {
      const py = exprToPy(stmt.value);
      const code = `${stmt.target}.remove(${py})\nprint(${stmt.target})`;

      concepts.push('lists');
      mappings.push(m(`remove ${py} from ${stmt.target}`, `${stmt.target}.remove(${py})`, lineOffset, 'Remove from list', EDU.remove));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'import': {
      const code = `import ${stmt.module}`;
      mappings.push(m(stmt.module, code, lineOffset, 'Import library', EDU.import_mod));
      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'input': {
      const prompt = `"${esc(stmt.prompt)}"`;
      const code = `${stmt.target} = input(${prompt})\nprint(${stmt.target})`;

      concepts.push('variables');
      mappings.push(m(stmt.target, `input(${prompt})`, lineOffset, 'User input', EDU.input_fn));

      return { code, mappings, confidence, alternatives, suggestions, concepts };
    }

    case 'comment':
      return { code: `# ${stmt.text}`, mappings, confidence, alternatives, suggestions, concepts };

    case 'clarify': {
      const pyLines = [
        '# Clarification needed',
        `# Original: ${esc(stmt.input)}`,
        '',
        `print("${esc(stmt.explanation)}")`,
        'print("")',
        'print("Please clarify:")',
        ...stmt.questions.map((q, i) => `print("${i + 1}) ${esc(q)}")`),
      ];
      confidence = 'low';
      suggestions.push(...stmt.questions);
      return { code: pyLines.join('\n'), mappings, confidence, alternatives, suggestions, concepts };
    }
  }
}

// ============================================================================
// SECTION 8: PUBLIC API
// ============================================================================

function detectImports(code: string): string[] {
  const imports: string[] = [];
  if (/\bmath\.\w+/.test(code)) imports.push('import math');
  return imports;
}

export async function translateLogicToPython(
  logic: string,
  _aiConfig?: AIConfig
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
        'Try: print Hello world',
        'Try: set result to 10 plus 5 times 2',
        'Try: create list with apple, banana, cherry',
      ],
    };
  }

  const lines = splitLines(trimmed);
  const stmts = lines.map(parseLine);
  const results = stmts.map((stmt, i) => generateStmt(stmt, i + 1));

  let pythonCode = results.map((r) => r.code).filter(Boolean).join('\n');
  const mappings: LogicMapping[] = results.flatMap((r) => r.mappings);

  const confidence: Confidence = results.reduce<Confidence>(
    (acc, r) => minConf(acc, r.confidence),
    'high'
  );

  const suggestions: string[] = Array.from(new Set(results.flatMap((r) => r.suggestions)));
  const alternatives: AlternativeTranslation[] = results.flatMap((r) => r.alternatives);

  const concepts: ConceptLevel[] = Array.from(new Set(results.flatMap((r) => r.concepts)));

  const imports = detectImports(pythonCode);
  if (imports.length > 0) {
    pythonCode = imports.join('\n') + '\n\n' + pythonCode;
    imports.forEach((imp) => {
      const mod = imp.replace('import ', '');
      mappings.unshift(m(mod, imp, 0, `Auto-imported ${mod} library`, EDU.import_mod));
    });
  }

  const structure = lines.length > 1 ? 'Sequence' : 'Single';

  return {
    pythonCode,
    explanation: `${structure} input. Translated ${lines.length} line(s).`,
    confidence,
    mappings,
    concepts,
    outOfScope: false,
    ...(alternatives.length ? { alternatives } : {}),
    ...(suggestions.length ? { suggestions } : {}),
  };
}