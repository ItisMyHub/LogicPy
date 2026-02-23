import type {
  Example,
  Challenge,
  ConceptLevel,
  ConceptInfo,
  WhyThisWorksCard,
  ProTip,
  GuidedStarter,
  OutOfScopeCard,
} from '@/types';

// For backward compat — re-export as ExampleCategory
export type { ConceptLevel as ExampleCategory } from '@/types';

// =============================================================================
// CONCEPT INFO — The 7 levels, display metadata
// =============================================================================

export const conceptInfoMap: Record<ConceptLevel, ConceptInfo> = {
  print: {
    level: 1,
    id: 'print',
    label: 'Output / Input',
    icon: '💬',
    tagline: 'print() text on screen and read input() from users',
    color: 'blue',
  },
  variables: {
    level: 2,
    id: 'variables',
    label: 'Data Types',
    icon: '🧩',
    tagline: 'int, float, str, bool — store and convert values',
    color: 'cyan',
  },
  math: {
    level: 3,
    id: 'math',
    label: 'Operators',
    icon: '⚙️',
    tagline: 'Arithmetic, comparison, and logical operators',
    color: 'red',
  },
  conditions: {
    level: 4,
    id: 'conditions',
    label: 'Control Flow',
    icon: '🔀',
    tagline: 'if, elif, else — steer your program',
    color: 'purple',
  },
  loops: {
    level: 5,
    id: 'loops',
    label: 'Looping',
    icon: '🔁',
    tagline: 'for and while — repeat code blocks',
    color: 'pink',
  },
  lists: {
    level: 6,
    id: 'lists',
    label: 'Collections',
    icon: '🗂️',
    tagline: 'list, tuple, dict — group related data',
    color: 'green',
  },
  functions: {
    level: 7,
    id: 'functions',
    label: 'Functions',
    icon: '🔧',
    tagline: 'def — write once, call anywhere',
    color: 'orange',
  },
};

/** Ordered array of all 7 concepts */
export const conceptOrder: ConceptLevel[] = [
  'print',
  'variables',
  'math',
  'conditions',
  'loops',
  'lists',
  'functions',
];

// =============================================================================
// EXAMPLES — Only things the engine ACTUALLY handles
// =============================================================================

export const examples: Example[] = [
  // ── OUTPUT / INPUT (Level 1) ─────────────────────────────────────────────
  {
    id: 'hello-world',
    title: 'Hello World',
    logic: 'print Hello World',
    description: 'The classic first program — displays text on screen',
    category: 'print',
    difficulty: 'beginner',
  },
  {
    id: 'multiple-print',
    title: 'Multiple Lines',
    logic: 'print Hello\nprint World\nprint How are you',
    description: 'Print several lines of text, one after another',
    category: 'print',
    difficulty: 'beginner',
  },
  {
    id: 'print-number',
    title: 'Print a Number',
    logic: 'print 42',
    description: 'Numbers don\'t need quotes — just print them',
    category: 'print',
    difficulty: 'beginner',
  },
  {
    id: 'print-fstring',
    title: 'Print with Variable',
    logic: 'store Alice in name then print Hello name using an f-string',
    description: 'Combine text and variables with an f-string',
    category: 'print',
    difficulty: 'beginner',
  },
  {
    id: 'ask-user-name',
    title: 'Ask the User',
    logic: 'ask the user for their name and then print Hello followed by their name',
    description: 'Use input() to read text the user types',
    category: 'print',
    difficulty: 'beginner',
  },
  {
    id: 'ask-user-age',
    title: 'Ask for a Number',
    logic: 'ask the user for their age, convert it to an integer, then print You are followed by their age followed by years old',
    description: 'input() always returns text — use int() to convert it',
    category: 'print',
    difficulty: 'intermediate',
  },

  // ── DATA TYPES (Level 2) ─────────────────────────────────────────────────
  {
    id: 'integer-type',
    title: 'Integer',
    logic: 'create an integer variable called score with value 100 and print its type',
    description: 'int stores whole numbers — no decimal point',
    category: 'variables',
    difficulty: 'beginner',
  },
  {
    id: 'float-type',
    title: 'Float',
    logic: 'create a float variable called price with value 19.99 and print its type',
    description: 'float stores decimal numbers',
    category: 'variables',
    difficulty: 'beginner',
  },
  {
    id: 'string-type',
    title: 'String',
    logic: 'create a string variable called name with value Alice and print its type',
    description: 'str stores text — always in quotes',
    category: 'variables',
    difficulty: 'beginner',
  },
  {
    id: 'boolean-type',
    title: 'Boolean',
    logic: 'create a boolean variable called is_active with value True and print its type',
    description: 'bool is either True or False — used in conditions',
    category: 'variables',
    difficulty: 'beginner',
  },
  {
    id: 'type-conversion',
    title: 'Type Conversion',
    logic: 'convert the string "42" to an integer, then convert it to a float, then print all three',
    description: 'int(), float(), str() convert between data types',
    category: 'variables',
    difficulty: 'intermediate',
  },

  // ── OPERATORS (Level 3) ──────────────────────────────────────────────────
  {
    id: 'arithmetic-ops',
    title: 'Arithmetic Operators',
    logic: 'set a to 10 and b to 3, then print a plus b, a minus b, a times b, a divided by b',
    description: '+  −  *  /  — the four basic operators',
    category: 'math',
    difficulty: 'beginner',
  },
  {
    id: 'floor-modulo',
    title: 'Floor Division & Modulo',
    logic: 'set a to 10 and b to 3, then print floor division of a by b and the remainder',
    description: '// gives the whole part; % gives the remainder',
    category: 'math',
    difficulty: 'beginner',
  },
  {
    id: 'power',
    title: 'Exponent Operator',
    logic: 'set result to 2 to the power of 8 and print it',
    description: '** is the power operator — 2**8 = 256',
    category: 'math',
    difficulty: 'intermediate',
  },
  {
    id: 'comparison-ops',
    title: 'Comparison Operators',
    logic: 'set x to 5, then print whether x equals 5, x is not equal to 3, and x is greater than 2',
    description: '==  !=  <  >  <=  >= all return True or False',
    category: 'math',
    difficulty: 'beginner',
  },
  {
    id: 'logical-ops',
    title: 'Logical Operators',
    logic: 'set age to 20, print whether age is greater than 18 and age is less than 65',
    description: 'and / or / not combine boolean expressions',
    category: 'math',
    difficulty: 'intermediate',
  },
  {
    id: 'augmented-assign',
    title: 'Augmented Assignment',
    logic: 'set counter to 0, add 1 to counter three times using +=, then print counter',
    description: '+= -= *= /= update a variable in place',
    category: 'math',
    difficulty: 'intermediate',
  },

  // ── CONTROL FLOW (Level 4) ───────────────────────────────────────────────
  {
    id: 'simple-if',
    title: 'Simple if',
    logic: 'if score is less than 50 print Fail',
    description: 'Do something only when a condition is True',
    category: 'conditions',
    difficulty: 'beginner',
  },
  {
    id: 'if-else',
    title: 'if / else',
    logic: 'if score is greater than 90 print Excellent else print Keep trying',
    description: 'Handle both the True and False cases',
    category: 'conditions',
    difficulty: 'beginner',
  },
  {
    id: 'if-elif-else',
    title: 'if / elif / else',
    logic: 'set score to 85\nif score is greater than 90 print A\nelif score is greater than 70 print B\nelif score is greater than 50 print C\nelse print F',
    description: 'elif checks additional conditions when the first is False',
    category: 'conditions',
    difficulty: 'intermediate',
  },
  {
    id: 'not-equals',
    title: 'Not Equal',
    logic: 'if score is not equal to 100 print Not perfect yet',
    description: '!= means "is different from"',
    category: 'conditions',
    difficulty: 'beginner',
  },

  // ── LOOPING (Level 5) ────────────────────────────────────────────────────
  {
    id: 'for-loop',
    title: 'for Loop with range()',
    logic: 'loop 5 times and print Hello',
    description: 'for i in range(5): repeats exactly 5 times',
    category: 'loops',
    difficulty: 'beginner',
  },
  {
    id: 'for-loop-counter',
    title: 'Loop Counter',
    logic: 'loop from 1 to 5 and print each number',
    description: 'range(1, 6) produces 1, 2, 3, 4, 5',
    category: 'loops',
    difficulty: 'beginner',
  },
  {
    id: 'while-loop',
    title: 'while Loop',
    logic: 'set count to 0, while count is less than 5 print count then add 1 to count',
    description: 'while repeats as long as the condition stays True',
    category: 'loops',
    difficulty: 'intermediate',
  },
  {
    id: 'loop-break',
    title: 'break Statement',
    logic: 'loop from 0 to 9, if the number equals 5 stop the loop, otherwise print it',
    description: 'break exits the loop immediately',
    category: 'loops',
    difficulty: 'intermediate',
  },
  {
    id: 'loop-continue',
    title: 'continue Statement',
    logic: 'loop from 0 to 9, skip even numbers and print only odd numbers',
    description: 'continue skips the rest of the loop body for that iteration',
    category: 'loops',
    difficulty: 'intermediate',
  },

  // ── COLLECTIONS (Level 6) ────────────────────────────────────────────────
  {
    id: 'create-list',
    title: 'Create a List',
    logic: 'create a list called fruits with apple, banana, cherry and print it',
    description: 'Lists store multiple ordered items in square brackets',
    category: 'lists',
    difficulty: 'beginner',
  },
  {
    id: 'list-indexing',
    title: 'List Indexing',
    logic: 'create a list called colors with red, green, blue, then print the first and last items',
    description: 'Index starts at 0; use -1 for the last item',
    category: 'lists',
    difficulty: 'beginner',
  },
  {
    id: 'append-item',
    title: 'Append to List',
    logic: 'create a list called numbers with 1, 2, 3, add 4 to the end, then print the list',
    description: '.append() adds one item to the end',
    category: 'lists',
    difficulty: 'beginner',
  },
  {
    id: 'create-tuple',
    title: 'Create a Tuple',
    logic: 'create a tuple called dimensions with values 1920 and 1080 and print it',
    description: 'Tuples are like lists but cannot be changed — use () instead of []',
    category: 'lists',
    difficulty: 'intermediate',
  },
  {
    id: 'create-dict',
    title: 'Create a Dictionary',
    logic: 'create a dictionary called person with key name set to Alice and key age set to 25, then print the value for key name using person["name"]',
    description: 'Dicts store key-value pairs with {} and : — access values with dict["key"]',
    category: 'lists',
    difficulty: 'intermediate',
  },
  {
    id: 'loop-over-list',
    title: 'Loop Over a List',
    logic: 'create a list called fruits with apple, banana, cherry, then loop over each fruit and print it',
    description: 'for item in list: iterates over every element',
    category: 'lists',
    difficulty: 'intermediate',
  },

  // ── FUNCTIONS (Level 7) ─────────────────────────────────────────────────
  {
    id: 'define-function',
    title: 'Define a Function',
    logic: 'define a function called greet that prints Hello there',
    description: 'def creates a reusable block of code',
    category: 'functions',
    difficulty: 'beginner',
  },
  {
    id: 'function-parameter',
    title: 'Function with Parameter',
    logic: 'define a function called greet that takes a name parameter and prints Hello followed by the name',
    description: 'Parameters let you pass data into a function',
    category: 'functions',
    difficulty: 'beginner',
  },
  {
    id: 'function-return',
    title: 'Function with Return',
    logic: 'define a function called add that takes two numbers a and b and returns their sum, then call it with 3 and 5 and print the result',
    description: 'return sends a value back to whoever called the function',
    category: 'functions',
    difficulty: 'intermediate',
  },
  {
    id: 'function-default-param',
    title: 'Default Parameter',
    logic: 'define a function called greet with a name parameter whose default value is the string "World", then call it with Alice and call it again with no arguments',
    description: 'Default parameters make arguments optional',
    category: 'functions',
    difficulty: 'intermediate',
  },
];

// =============================================================================
// CHALLENGES — Only covering the 7 concepts
// =============================================================================

export const challenges: Challenge[] = [
  {
    id: 'fix-print',
    title: 'Fix the Print',
    description: 'This code should print "Hello World" but has a syntax error.',
    brokenCode: 'print(Hello World)',
    hint: 'Text needs to be wrapped in quotes.',
    expectedOutput: 'Hello World',
    difficulty: 'easy',
    category: 'print',
    xpReward: 10,
  },
  {
    id: 'fix-variable',
    title: 'Invalid Variable Name',
    description: 'This variable name is not valid Python.',
    brokenCode: '2name = "Alice"\nprint(2name)',
    hint: 'Variable names cannot start with a number.',
    expectedOutput: 'Alice',
    difficulty: 'easy',
    category: 'variables',
    xpReward: 10,
  },
  {
    id: 'fix-indentation',
    title: 'Indentation Error',
    description: 'The if statement is missing proper indentation.',
    brokenCode: 'if x > 5:\nprint("x is big")',
    hint: 'Python uses indentation (4 spaces) to show what belongs inside the if.',
    expectedOutput: 'x is big',
    difficulty: 'easy',
    category: 'conditions',
    xpReward: 15,
  },
  {
    id: 'fix-loop',
    title: 'Loop Range Backwards',
    description: 'This loop should print 0 to 4, but prints nothing.',
    brokenCode: 'for i in range(5, 0):\n    print(i)',
    hint: 'range(start, stop) — stop must be larger than start. Try range(5).',
    expectedOutput: '0\n1\n2\n3\n4',
    difficulty: 'medium',
    category: 'loops',
    xpReward: 20,
  },
  {
    id: 'fix-list-index',
    title: 'List Index Out of Range',
    description: 'Trying to get the last item, but it crashes.',
    brokenCode: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[3])',
    hint: 'Indices start at 0. A 3-item list has indices 0, 1, 2.',
    expectedOutput: 'cherry',
    difficulty: 'medium',
    category: 'lists',
    xpReward: 20,
  },
  {
    id: 'fix-string-concat',
    title: 'String + Number',
    description: 'Cannot glue a string and number together directly.',
    brokenCode: 'age = 25\nprint("I am " + age + " years old")',
    hint: 'Convert the number to a string with str(), or use an f-string.',
    expectedOutput: 'I am 25 years old',
    difficulty: 'medium',
    category: 'print',
    xpReward: 20,
  },
  {
    id: 'fix-infinite-loop',
    title: 'Infinite Loop',
    description: 'This loop never stops! Can you fix it?',
    brokenCode: 'x = 0\nwhile x < 5:\n    print(x)',
    hint: 'The variable x never changes inside the loop. Add x = x + 1.',
    expectedOutput: '0\n1\n2\n3\n4',
    difficulty: 'medium',
    category: 'loops',
    xpReward: 25,
  },
];

// =============================================================================
// "WHY THIS WORKS" CARDS — One per concept
// =============================================================================

export const whyThisWorksCards: WhyThisWorksCard[] = [
  {
    concept: 'print',
    title: '🧠 Output / Input — print() and input()',
    points: [
      {
        question: 'Why the parentheses?',
        answer: 'print() is a function. In Python, you always call functions with ().',
      },
      {
        question: 'Why quotes around text?',
        answer: 'Python needs quotes to know something is text (a "string"), not a variable name.',
      },
      {
        question: 'What does input() return?',
        answer: 'input() always returns a string. If you need a number, convert it: int(input("Age: ")).',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/ref_func_print.asp',
    deepDiveLabel: 'Python print() — W3Schools',
  },
  {
    concept: 'variables',
    title: '🧠 Data Types — int, float, str, bool',
    points: [
      {
        question: 'How do I know what type a value is?',
        answer: 'Use type(value). For example, type(42) returns <class \'int\'>.',
      },
      {
        question: 'What\'s the difference between 42 and "42"?',
        answer: '42 is a number (int). "42" is text (str). You can do math with 42, but not with "42".',
      },
      {
        question: 'How do I convert between types?',
        answer: 'int("42") → 42, float("3.14") → 3.14, str(100) → "100". Type conversion is called casting.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_datatypes.asp',
    deepDiveLabel: 'Python Data Types — W3Schools',
  },
  {
    concept: 'math',
    title: '🧠 Operators — arithmetic, comparison, logical',
    points: [
      {
        question: 'What is // and %?',
        answer: '// is floor division (whole number result). % is modulo (the remainder). 10 // 3 = 3, 10 % 3 = 1.',
      },
      {
        question: 'Why == instead of = for comparison?',
        answer: '= assigns a value. == checks equality. if x = 5 is an error; if x == 5 is correct.',
      },
      {
        question: 'What do and / or / not do?',
        answer: 'They combine boolean expressions. age > 18 and age < 65 is True only when both sides are True.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_operators.asp',
    deepDiveLabel: 'Python Operators — W3Schools',
  },
  {
    concept: 'conditions',
    title: '🧠 Control Flow — if, elif, else',
    points: [
      {
        question: 'What is elif?',
        answer: 'elif means "else if" — check another condition when the first one is False. You can have as many as you need.',
      },
      {
        question: 'Why the colon :?',
        answer: 'Python uses : to say "a block of code starts on the next line." Always indent 4 spaces after :.',
      },
      {
        question: 'Can I nest if statements?',
        answer: 'Yes! An if inside another if is called nested. But keep it simple — more than 2 levels is hard to read.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_conditions.asp',
    deepDiveLabel: 'Python If...Else — W3Schools',
  },
  {
    concept: 'loops',
    title: '🧠 Looping — for, while, break, continue',
    points: [
      {
        question: 'What does range(5) produce?',
        answer: '0, 1, 2, 3, 4 — starts at 0, stops BEFORE 5. Use range(1, 6) to get 1 through 5.',
      },
      {
        question: 'When do I use for vs while?',
        answer: 'for when you know the number of iterations. while when you repeat until something changes.',
      },
      {
        question: 'What do break and continue do?',
        answer: 'break exits the loop entirely. continue skips the rest of the current iteration and moves to the next.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_for_loops.asp',
    deepDiveLabel: 'Python For Loops — W3Schools',
  },
  {
    concept: 'lists',
    title: '🧠 Collections — list, tuple, dict',
    points: [
      {
        question: 'What is the difference between list and tuple?',
        answer: 'Lists [] can be changed (mutable). Tuples () cannot be changed (immutable). Use tuples for fixed data.',
      },
      {
        question: 'How do dictionaries work?',
        answer: 'Dicts {} store key-value pairs: {"name": "Alice", "age": 25}. Access values with dict["key"].',
      },
      {
        question: 'Why does list[0] give the first item?',
        answer: 'Lists are zero-indexed. Position 0 is first, 1 is second. Use -1 for the last item.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_lists.asp',
    deepDiveLabel: 'Python Collections — W3Schools',
  },
  {
    concept: 'functions',
    title: '🧠 Functions — def, parameters, return',
    points: [
      {
        question: 'What does def mean?',
        answer: '"def" is short for "define." It creates a named, reusable block of code.',
      },
      {
        question: 'What is the difference between a parameter and an argument?',
        answer: 'Parameter is the name in the definition: def greet(name). Argument is the value you pass: greet("Alice").',
      },
      {
        question: 'Why use return?',
        answer: 'return sends a result back. Without it, the function returns None. Use return when you need the result elsewhere.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_functions.asp',
    deepDiveLabel: 'Python Functions — W3Schools',
  },
];

// =============================================================================
// PRO TIPS — "How would a pro write this?"
// =============================================================================

export const proTips: ProTip[] = [
  {
    id: 'pro-print-fstring',
    concept: 'print',
    pattern: 'print-with-variable',
    proCode: 'name = "Alice"\nage = 25\nprint(f"Hello {name}, you are {age} years old")',
    changes: [
      {
        from: 'print("Hello " + name)',
        to: 'print(f"Hello {name}")',
        reason: 'f-strings are cleaner, faster, and easier to read than string concatenation.',
      },
    ],
  },
  {
    id: 'pro-variable-naming',
    concept: 'variables',
    pattern: 'variable-assignment',
    proCode: 'player_score = 100\nmax_health = 200\nis_alive = True',
    changes: [
      {
        from: 'x = 100',
        to: 'player_score = 100',
        reason: 'Descriptive names make code readable. Future-you will thank present-you.',
      },
      {
        from: 'a = True',
        to: 'is_alive = True',
        reason: 'Booleans often start with is_, has_, or can_ to signal they are True/False.',
      },
    ],
  },
  {
    id: 'pro-math-parentheses',
    concept: 'math',
    pattern: 'arithmetic',
    proCode: 'total = (base_price + tax) * quantity\ndiscount = total * 0.1\nfinal = total - discount',
    changes: [
      {
        from: 'result = 10 + 5 * 2',
        to: 'total = (base_price + tax) * quantity',
        reason: 'Use parentheses to make intent clear, even when precedence already gives the right answer.',
      },
    ],
  },
  {
    id: 'pro-condition-guard',
    concept: 'conditions',
    pattern: 'if-statement',
    proCode: 'if not username:\n    print("Please enter a username")\n    return\n\n# rest of the code runs safely',
    changes: [
      {
        from: 'if score > 90 ...',
        to: 'if not username: return',
        reason: 'Pros handle the "bad case" first and exit early. This keeps the main logic un-nested.',
      },
    ],
  },
  {
    id: 'pro-loop-enumerate',
    concept: 'loops',
    pattern: 'for-loop-basic',
    proCode: 'fruits = ["apple", "banana", "cherry"]\nfor index, fruit in enumerate(fruits):\n    print(f"{index + 1}. {fruit}")',
    changes: [
      {
        from: 'for i in range(len(fruits)):',
        to: 'for index, fruit in enumerate(fruits):',
        reason: 'enumerate() gives you both the index AND the item. No more fruits[i].',
      },
    ],
  },
  {
    id: 'pro-list-comprehension',
    concept: 'lists',
    pattern: 'list-creation',
    proCode: 'numbers = [1, 2, 3, 4, 5]\ndoubled = [n * 2 for n in numbers]\nprint(doubled)  # [2, 4, 6, 8, 10]',
    changes: [
      {
        from: 'Loop + append',
        to: '[n * 2 for n in numbers]',
        reason: 'List comprehensions build a new list in one line. Pythonistas love them.',
      },
    ],
  },
  {
    id: 'pro-function-docstring',
    concept: 'functions',
    pattern: 'function-definition',
    proCode: 'def calculate_area(width, height):\n    """Calculate the area of a rectangle."""\n    return width * height',
    changes: [
      {
        from: 'def greet(): print("hello")',
        to: 'def calculate_area(width, height):\n    """..."""\n    return width * height',
        reason: 'Pros add docstrings, use return values, and give functions one clear job.',
      },
    ],
  },
];

// =============================================================================
// GUIDED STARTERS — "What do you want to do?" buttons
// =============================================================================

export const guidedStarters: GuidedStarter[] = [
  {
    concept: 'print',
    icon: '💬',
    label: 'Output / Input',
    templates: [
      { text: 'print a message', placeholder: 'print Hello World' },
      { text: 'print a variable with an f-string', placeholder: 'store Alice in name then print Hello name using an f-string' },
      { text: 'ask the user for their name', placeholder: 'ask the user for their name and then print Hello followed by their name' },
      { text: 'ask for a number and convert it', placeholder: 'ask the user for their age, convert it to an integer, then print You are X years old' },
    ],
  },
  {
    concept: 'variables',
    icon: '🧩',
    label: 'Data Types',
    templates: [
      { text: 'create an integer variable', placeholder: 'create an integer variable called score with value 100 and print its type' },
      { text: 'create a string variable', placeholder: 'create a string variable called name with value Alice and print its type' },
      { text: 'create a boolean variable', placeholder: 'create a boolean variable called is_active with value True and print its type' },
      { text: 'convert between types', placeholder: 'convert the string "42" to an integer, then convert it to a float, then print all three' },
    ],
  },
  {
    concept: 'math',
    icon: '⚙️',
    label: 'Operators',
    templates: [
      { text: 'use arithmetic operators', placeholder: 'set a to 10 and b to 3, then print a plus b, a minus b, a times b, a divided by b' },
      { text: 'use floor division and modulo', placeholder: 'set a to 10 and b to 3, then print floor division of a by b and the remainder' },
      { text: 'use comparison operators', placeholder: 'set x to 5, then print whether x equals 5, x is not equal to 3, and x is greater than 2' },
      { text: 'use logical operators', placeholder: 'set age to 20, print whether age is greater than 18 and age is less than 65' },
    ],
  },
  {
    concept: 'conditions',
    icon: '🔀',
    label: 'Control Flow',
    templates: [
      { text: 'simple if statement', placeholder: 'if score is less than 50 print Fail' },
      { text: 'if / else', placeholder: 'if score is greater than 90 print Excellent else print Keep trying' },
      { text: 'if / elif / else', placeholder: 'set score to 85\nif score is greater than 90 print A\nelif score is greater than 70 print B\nelif score is greater than 50 print C\nelse print F' },
    ],
  },
  {
    concept: 'loops',
    icon: '🔁',
    label: 'Looping',
    templates: [
      { text: 'for loop with range', placeholder: 'loop 5 times and print Hello' },
      { text: 'for loop with counter', placeholder: 'loop from 1 to 5 and print each number' },
      { text: 'while loop', placeholder: 'set count to 0, while count is less than 5 print count then add 1 to count' },
      { text: 'loop with break', placeholder: 'loop from 0 to 9, if the number equals 5 stop the loop, otherwise print it' },
    ],
  },
  {
    concept: 'lists',
    icon: '🗂️',
    label: 'Collections',
    templates: [
      { text: 'create and use a list', placeholder: 'create a list called fruits with apple, banana, cherry and print it' },
      { text: 'loop over a list', placeholder: 'create a list called fruits with apple, banana, cherry, then loop over each fruit and print it' },
      { text: 'create a dictionary', placeholder: 'create a dictionary called person with name Alice and age 25, then print the name' },
      { text: 'create a tuple', placeholder: 'create a tuple called dimensions with values 1920 and 1080 and print it' },
    ],
  },
  {
    concept: 'functions',
    icon: '🔧',
    label: 'Functions',
    templates: [
      { text: 'define and call a function', placeholder: 'define a function called greet that prints Hello there' },
      { text: 'function with a parameter', placeholder: 'define a function called greet that takes a name parameter and prints Hello followed by the name' },
      { text: 'function with return value', placeholder: 'define a function called add that takes two numbers a and b and returns their sum, then call it with 3 and 5 and print the result' },
      { text: 'function with default parameter', placeholder: 'define a function called greet with a name parameter that defaults to World, call it once with Alice and once without arguments' },
    ],
  },
];

// =============================================================================
// OUT-OF-SCOPE CARDS — Graceful boundaries
// =============================================================================

export const outOfScopeCards: OutOfScopeCard[] = [
  {
    triggers: ['class', 'object', 'method', 'self', 'inheritance', '__init__'],
    topic: 'Classes & Objects',
    whatItIs: 'Classes let you create your own data types with built-in behavior — like a blueprint for objects.',
    whyNotHere: 'Classes build on ALL 7 concepts here. Master these first, and classes will click naturally.',
    learnFirst: ['variables', 'functions'],
    resourceUrl: 'https://www.w3schools.com/python/python_classes.asp',
    resourceLabel: 'Python Classes — W3Schools',
  },
  {
    triggers: ['file', 'open', 'read file', 'write file', 'csv', 'json file'],
    topic: 'File I/O',
    whatItIs: 'Reading and writing files lets your program save data permanently and load external data.',
    whyNotHere: 'File operations need variables, functions, and error handling. Get comfortable with those first.',
    learnFirst: ['variables', 'functions'],
    resourceUrl: 'https://www.w3schools.com/python/python_file_handling.asp',
    resourceLabel: 'Python File Handling — W3Schools',
  },
  {
    triggers: ['try', 'except', 'error handling', 'exception', 'raise', 'finally'],
    topic: 'Error Handling',
    whatItIs: 'try/except lets you catch errors gracefully instead of crashing.',
    whyNotHere: 'You need to understand functions and conditions first — errors happen inside those structures.',
    learnFirst: ['conditions', 'functions'],
    resourceUrl: 'https://www.w3schools.com/python/python_try_except.asp',
    resourceLabel: 'Python Try Except — W3Schools',
  },
  {
    triggers: ['lambda', 'anonymous function', 'arrow function'],
    topic: 'Lambda Functions',
    whatItIs: 'Lambdas are tiny, one-line functions without a name — like shorthand.',
    whyNotHere: 'You need to be comfortable with regular functions first. Lambda is just a shortcut.',
    learnFirst: ['functions'],
    resourceUrl: 'https://www.w3schools.com/python/python_lambda.asp',
    resourceLabel: 'Python Lambda — W3Schools',
  },
  {
    triggers: ['comprehension', 'list comprehension', 'dict comprehension'],
    topic: 'Comprehensions',
    whatItIs: 'A concise way to create lists/dicts in one line — like a loop squeezed into brackets.',
    whyNotHere: 'You need loops and lists first. Comprehensions are just a shorter way to write those.',
    learnFirst: ['loops', 'lists'],
    resourceUrl: 'https://www.w3schools.com/python/python_lists_comprehension.asp',
    resourceLabel: 'List Comprehension — W3Schools',
  },
  {
    triggers: ['recursion', 'recursive', 'factorial', 'fibonacci'],
    topic: 'Recursion',
    whatItIs: 'A function that calls itself to solve smaller pieces of the same problem.',
    whyNotHere: 'Recursion requires solid understanding of functions, conditions, and return values.',
    learnFirst: ['functions', 'conditions'],
    resourceUrl: 'https://www.w3schools.com/python/gloss_python_function_recursion.asp',
    resourceLabel: 'Python Recursion — W3Schools',
  },
];

// =============================================================================
// UTILITY FUNCTIONS — Backward compatible exports
// =============================================================================

/** Get examples filtered by concept */
export function getExamplesByCategory(category: ConceptLevel): Example[] {
  return examples.filter((e) => e.category === category);
}

/** Get examples filtered by difficulty */
export function getExamplesByDifficulty(
  difficulty: Example['difficulty']
): Example[] {
  return examples.filter((e) => e.difficulty === difficulty);
}

/** Get challenges filtered by difficulty */
export function getChallengesByDifficulty(
  difficulty: Challenge['difficulty']
): Challenge[] {
  return challenges.filter((c) => c.difficulty === difficulty);
}

/** Get all concept categories with their example counts */
export function getCategories(): {
  id: ConceptLevel;
  label: string;
  count: number;
}[] {
  return conceptOrder.map((id) => ({
    id,
    label: conceptInfoMap[id].label,
    count: examples.filter((e) => e.category === id).length,
  }));
}

/** Get the WhyThisWorks card for a concept */
export function getWhyCard(
  concept: ConceptLevel
): WhyThisWorksCard | undefined {
  return whyThisWorksCards.find((c) => c.concept === concept);
}

/** Get ProTips for a concept */
export function getProTips(concept: ConceptLevel): ProTip[] {
  return proTips.filter((p) => p.concept === concept);
}

/** Get the GuidedStarter for a concept */
export function getStarter(
  concept: ConceptLevel
): GuidedStarter | undefined {
  return guidedStarters.find((s) => s.concept === concept);
}

/** Check if input text matches any out-of-scope topic */
export function matchOutOfScope(input: string): OutOfScopeCard | undefined {
  const lower = input.toLowerCase();
  return outOfScopeCards.find((card) =>
    card.triggers.some((trigger) => lower.includes(trigger))
  );
}