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
    label: 'Show Something',
    icon: '🖨️',
    tagline: 'Display text or numbers on screen',
    color: 'blue',
  },
  variables: {
    level: 2,
    id: 'variables',
    label: 'Remember a Value',
    icon: '📦',
    tagline: 'Store data so you can use it later',
    color: 'cyan',
  },
  math: {
    level: 3,
    id: 'math',
    label: 'Do Math',
    icon: '🔢',
    tagline: 'Calculate, round, compare numbers',
    color: 'red',
  },
  conditions: {
    level: 4,
    id: 'conditions',
    label: 'Make a Decision',
    icon: '❓',
    tagline: 'If this, do that — otherwise do something else',
    color: 'purple',
  },
  loops: {
    level: 5,
    id: 'loops',
    label: 'Repeat Something',
    icon: '🔁',
    tagline: 'Do it N times, or while something is true',
    color: 'pink',
  },
  lists: {
    level: 6,
    id: 'lists',
    label: 'Organize Data',
    icon: '📋',
    tagline: 'Group items together — add, remove, count',
    color: 'green',
  },
  functions: {
    level: 7,
    id: 'functions',
    label: 'Reuse Your Code',
    icon: '🔧',
    tagline: 'Define it once, call it anywhere',
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
  // ── PRINT (Level 1) ──────────────────────────────────────────────────────
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
    id: 'print-decimal',
    title: 'Print a Decimal',
    logic: 'print 3.14',
    description: 'Decimals (floats) work the same way',
    category: 'print',
    difficulty: 'beginner',
  },

  // ── VARIABLES (Level 2) ──────────────────────────────────────────────────
  {
    id: 'create-variable',
    title: 'Create a Variable',
    logic: 'set score to 100',
    description: 'Store a number in a named container',
    category: 'variables',
    difficulty: 'beginner',
  },
  {
    id: 'string-variable',
    title: 'Store Text',
    logic: 'set name to Alice',
    description: 'Variables can hold text (strings) too',
    category: 'variables',
    difficulty: 'beginner',
  },
  {
    id: 'decimal-variable',
    title: 'Store a Decimal',
    logic: 'set price to 19.99',
    description: 'Store decimal numbers in a variable',
    category: 'variables',
    difficulty: 'beginner',
  },
  {
    id: 'boolean-variable',
    title: 'True or False',
    logic: 'set is_active to True',
    description: 'Booleans store yes/no, on/off values',
    category: 'variables',
    difficulty: 'beginner',
  },
  {
    id: 'multiple-variables',
    title: 'Use Multiple Variables',
    logic: 'set x to 10\nset y to 20\nset sum to x plus y',
    description: 'Create several variables and combine them',
    category: 'variables',
    difficulty: 'intermediate',
  },

  // ── MATH (Level 3) ──────────────────────────────────────────────────────
  {
    id: 'basic-math',
    title: 'Basic Arithmetic',
    logic: 'set result to 10 plus 5 times 2',
    description: 'Add, subtract, multiply, divide — with precedence',
    category: 'math',
    difficulty: 'beginner',
  },
  {
    id: 'power',
    title: 'Power / Exponent',
    logic: 'set result to 2 to the power of 8',
    description: 'Calculate 2⁸ = 256',
    category: 'math',
    difficulty: 'intermediate',
  },
  {
    id: 'square-root',
    title: 'Square Root',
    logic: 'set result to square root of 16',
    description: 'Auto-imports math and uses math.sqrt()',
    category: 'math',
    difficulty: 'intermediate',
  },
  {
    id: 'round-number',
    title: 'Round a Number',
    logic: 'round 3.14159 to 2 decimal places',
    description: 'Round to a specific number of decimal places',
    category: 'math',
    difficulty: 'intermediate',
  },

  // ── CONDITIONS (Level 4) ─────────────────────────────────────────────────
  {
    id: 'simple-if',
    title: 'Simple If',
    logic: 'if score is less than 50 print fail',
    description: 'Do something only when a condition is true',
    category: 'conditions',
    difficulty: 'beginner',
  },
  {
    id: 'if-else',
    title: 'If / Else',
    logic: 'if score is greater than 90 print excellent else print keep trying',
    description: 'Handle both the true and false cases',
    category: 'conditions',
    difficulty: 'beginner',
  },
  {
    id: 'equals-check',
    title: 'Equality Check',
    logic: 'if name equals Alice print Hello Alice',
    description: 'Check if two values are the same',
    category: 'conditions',
    difficulty: 'beginner',
  },
  {
    id: 'not-equals',
    title: 'Not Equal',
    logic: 'if score is not equal to 100 print not perfect',
    description: 'Check if two values are different',
    category: 'conditions',
    difficulty: 'intermediate',
  },

  // ── LOOPS (Level 5) ─────────────────────────────────────────────────────
  {
    id: 'for-loop',
    title: 'Count to 5',
    logic: 'loop 5 times print Hello',
    description: 'Repeat something a specific number of times',
    category: 'loops',
    difficulty: 'beginner',
  },
  {
    id: 'for-loop-counter',
    title: 'Loop with Counter',
    logic: 'loop 3 times print the current number',
    description: 'Access the loop counter variable i',
    category: 'loops',
    difficulty: 'beginner',
  },
  {
    id: 'while-loop',
    title: 'While Loop',
    logic: 'while count is less than 10 print counting',
    description: 'Keep repeating while a condition is true',
    category: 'loops',
    difficulty: 'intermediate',
  },

  // ── LISTS (Level 6) ─────────────────────────────────────────────────────
  {
    id: 'create-list',
    title: 'Create a List',
    logic: 'create list with apple, banana, cherry',
    description: 'Store multiple items in order',
    category: 'lists',
    difficulty: 'beginner',
  },
  {
    id: 'number-list',
    title: 'Number List',
    logic: 'create list with 10, 20, 30, 40, 50',
    description: 'Lists can hold numbers too',
    category: 'lists',
    difficulty: 'beginner',
  },
  {
    id: 'append-item',
    title: 'Add to List',
    logic: 'add orange to my_list',
    description: 'Append an item to the end of a list',
    category: 'lists',
    difficulty: 'beginner',
  },
  {
    id: 'remove-item',
    title: 'Remove from List',
    logic: 'remove banana from my_list',
    description: 'Remove the first matching item',
    category: 'lists',
    difficulty: 'intermediate',
  },
  {
    id: 'sort-list',
    title: 'Sort a List',
    logic: 'sort my_list',
    description: 'Put items in order (ascending)',
    category: 'lists',
    difficulty: 'intermediate',
  },

  // ── FUNCTIONS (Level 7) ─────────────────────────────────────────────────
  {
    id: 'define-function',
    title: 'Define a Function',
    logic: 'define function greet print hello there',
    description: 'Create a reusable block of code',
    category: 'functions',
    difficulty: 'beginner',
  },
  {
    id: 'function-call',
    title: 'Call a Function',
    logic: 'call greet with Alice',
    description: 'Execute a function you defined',
    category: 'functions',
    difficulty: 'beginner',
  },
  {
    id: 'function-parameter',
    title: 'Function with Input',
    logic: 'define function greet with name print Hello name',
    description: 'Functions can accept values (parameters)',
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
    title: '🧠 You just used print()',
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
        question: 'What if I forget the quotes?',
        answer: 'Python will think your text is a variable name and throw a NameError.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/ref_func_print.asp',
    deepDiveLabel: 'Python print() — W3Schools',
  },
  {
    concept: 'variables',
    title: '🧠 You just created a variable',
    points: [
      {
        question: 'What does = mean?',
        answer: 'In Python, = means "store this value." It\'s assignment, not math equality.',
      },
      {
        question: 'Can I name it anything?',
        answer: 'Almost! Names must start with a letter or underscore. No spaces, no starting with numbers.',
      },
      {
        question: 'What\'s the difference between 42 and "42"?',
        answer: '42 is a number (you can do math). "42" is text (a string). Quotes make it text.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_variables.asp',
    deepDiveLabel: 'Python Variables — W3Schools',
  },
  {
    concept: 'math',
    title: '🧠 You just did math in Python',
    points: [
      {
        question: 'Does Python follow order of operations?',
        answer: 'Yes! * and / happen before + and -. Use parentheses to override: (10 + 5) * 2.',
      },
      {
        question: 'What\'s the difference between / and //?',
        answer: '/ gives a decimal (5/2 = 2.5). // gives a whole number (5//2 = 2).',
      },
      {
        question: 'What does ** mean?',
        answer: '** is "to the power of." So 2 ** 8 means 2⁸ = 256.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_operators.asp',
    deepDiveLabel: 'Python Operators — W3Schools',
  },
  {
    concept: 'conditions',
    title: '🧠 You just wrote an if-statement',
    points: [
      {
        question: 'Why == instead of =?',
        answer: '= stores a value (assignment). == checks if two things are equal (comparison).',
      },
      {
        question: 'Why the colon :?',
        answer: 'Python uses : to say "a block of code starts on the next line." Always indent after :.',
      },
      {
        question: 'What happens if the condition is False?',
        answer: 'The indented code is skipped. If you have an else: block, that runs instead.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_conditions.asp',
    deepDiveLabel: 'Python If...Else — W3Schools',
  },
  {
    concept: 'loops',
    title: '🧠 You just wrote a loop',
    points: [
      {
        question: 'What does range(5) actually produce?',
        answer: 'The numbers 0, 1, 2, 3, 4. It starts at 0 and stops BEFORE 5.',
      },
      {
        question: 'Why does it start at 0?',
        answer: 'Convention! Almost all programming languages count from 0. You\'ll get used to it.',
      },
      {
        question: 'What\'s the difference between for and while?',
        answer: 'for repeats a known number of times. while repeats until a condition becomes False.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_for_loops.asp',
    deepDiveLabel: 'Python For Loops — W3Schools',
  },
  {
    concept: 'lists',
    title: '🧠 You just used a list',
    points: [
      {
        question: 'Why square brackets []?',
        answer: 'Square brackets create a list. Round brackets () are for function calls. Curly braces {} make dictionaries.',
      },
      {
        question: 'Why does my_list[0] give the first item?',
        answer: 'Lists are "zero-indexed." Position 0 is first, 1 is second, and so on.',
      },
      {
        question: 'What does .append() do?',
        answer: 'It adds one item to the END of the list. The list grows by one.',
      },
    ],
    deepDiveUrl: 'https://www.w3schools.com/python/python_lists.asp',
    deepDiveLabel: 'Python Lists — W3Schools',
  },
  {
    concept: 'functions',
    title: '🧠 You just defined a function',
    points: [
      {
        question: 'What does def mean?',
        answer: '"def" is short for "define." It tells Python: "remember this block of code under this name."',
      },
      {
        question: 'Why do I need to call it separately?',
        answer: 'def only CREATES the function. It doesn\'t run it. You must call it: greet() to actually execute it.',
      },
      {
        question: 'What are parameters?',
        answer: 'Parameters are inputs your function accepts. def greet(name) means "this function needs a name to work."',
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
    icon: '🖨️',
    label: 'Show something on screen',
    templates: [
      { text: 'print ___', placeholder: 'print Hello World' },
      { text: 'print ___ then print ___', placeholder: 'print Hello\nprint World' },
    ],
  },
  {
    concept: 'variables',
    icon: '📦',
    label: 'Remember a value',
    templates: [
      { text: 'set ___ to ___', placeholder: 'set score to 100' },
      { text: 'set ___ to ___ plus ___', placeholder: 'set total to price plus tax' },
    ],
  },
  {
    concept: 'math',
    icon: '🔢',
    label: 'Calculate something',
    templates: [
      { text: 'set result to ___ plus/times ___', placeholder: 'set result to 10 plus 5 times 2' },
      { text: 'round ___ to ___ decimal places', placeholder: 'round 3.14159 to 2 decimal places' },
      { text: 'set result to square root of ___', placeholder: 'set result to square root of 16' },
    ],
  },
  {
    concept: 'conditions',
    icon: '❓',
    label: 'Make a decision',
    templates: [
      { text: 'if ___ is greater than ___ print ___', placeholder: 'if score is greater than 90 print excellent' },
      { text: 'if ___ equals ___ print ___', placeholder: 'if name equals Alice print Hello Alice' },
    ],
  },
  {
    concept: 'loops',
    icon: '🔁',
    label: 'Repeat something',
    templates: [
      { text: 'loop ___ times print ___', placeholder: 'loop 5 times print Hello' },
      { text: 'while ___ is less than ___ print ___', placeholder: 'while count is less than 10 print counting' },
    ],
  },
  {
    concept: 'lists',
    icon: '📋',
    label: 'Organize items',
    templates: [
      { text: 'create list with ___, ___, ___', placeholder: 'create list with apple, banana, cherry' },
      { text: 'add ___ to ___', placeholder: 'add orange to my_list' },
      { text: 'sort ___', placeholder: 'sort my_list' },
    ],
  },
  {
    concept: 'functions',
    icon: '🔧',
    label: 'Make reusable code',
    templates: [
      { text: 'define function ___ print ___', placeholder: 'define function greet print hello there' },
      { text: 'define function ___ with ___ print ___', placeholder: 'define function greet with name print Hello name' },
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