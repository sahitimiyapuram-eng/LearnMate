import { TutoringMode, SubjectName, DifficultyLevel, QuizQuestion, NoteSummary, Flashcard, StudyPlan, AIRecommendation } from '../types';

export async function askAiTutor(
  message: string,
  context: { subject: SubjectName; topic: string; difficulty: DifficultyLevel },
  mode: TutoringMode
): Promise<{ reply: string; mode: TutoringMode; source: string }> {
  try {
    const res = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, mode }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error, using client fallback:', err);
    return {
      reply: getClientTutorFallback(message, context, mode),
      mode,
      source: 'offline-demo',
    };
  }
}

export async function generateQuizFromAi(
  subject: SubjectName,
  topic: string,
  difficulty: DifficultyLevel,
  count: number = 5,
  questionType: string = 'all'
): Promise<{ title: string; subject: string; topic: string; difficulty: string; questions: QuizQuestion[]; source: string }> {
  try {
    const res = await fetch('/api/ai/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic, difficulty, count, questionType }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error, using client fallback for quiz:', err);
    return getClientQuizFallback(subject, topic, difficulty, count);
  }
}

export async function summarizeNotesWithAi(
  notes: string,
  subject: SubjectName,
  topic: string
): Promise<NoteSummary & { source?: string }> {
  try {
    const res = await fetch('/api/ai/summarize-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, subject, topic }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error, using client fallback for notes:', err);
    return getClientNotesFallback(notes, subject, topic);
  }
}

export async function generateFlashcardsWithAi(
  subject: SubjectName,
  topic: string,
  notes?: string,
  count: number = 6
): Promise<{ flashcards: Flashcard[]; source?: string }> {
  try {
    const res = await fetch('/api/ai/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic, notes, count }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error, using client fallback for flashcards:', err);
    return { flashcards: getClientFlashcardsFallback(subject, topic, count), source: 'offline-demo' };
  }
}

export async function generateStudyPlanWithAi(
  examDate: string,
  subjects: SubjectName[],
  hoursPerDay: number,
  preferredTime: string,
  weakTopics: string[]
): Promise<StudyPlan & { source?: string }> {
  try {
    const res = await fetch('/api/ai/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examDate, subjects, hoursPerDay, preferredTime, weakTopics }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error, using client fallback for study plan:', err);
    return getClientStudyPlanFallback(hoursPerDay);
  }
}

export async function getAiRecommendation(
  weakTopics: any[],
  streak: number,
  accuracy: number
): Promise<AIRecommendation & { source?: string }> {
  try {
    const res = await fetch('/api/ai/recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName: 'Aarav', weakTopics, streak, accuracy }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      headline: 'Focus on Quadratic Foundations before Calculus',
      message: "You've improved significantly in Algebra this week (92% accuracy). Your quiz diagnostics indicate that spending 25 minutes solidifying Quadratic Equations and factoring will unlock full mastery before tackling Calculus derivatives.",
      recommendedAction: {
        type: 'quiz',
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        suggestedMinutes: 25,
        buttonText: 'Start 25m Practice',
      },
      secondaryAction: {
        type: 'tutor',
        subject: 'Mathematics',
        topic: 'Calculus',
        buttonText: 'Ask AI Tutor',
      },
      source: 'offline-demo',
    };
  }
}

// -------------------------------------------------------------
// Client Fallbacks
// -------------------------------------------------------------
function getClientTutorFallback(
  message: string,
  context: { subject: SubjectName; topic: string; difficulty: DifficultyLevel },
  mode: TutoringMode
): string {
  const q = message.toLowerCase();
  if (q.includes('newton') || context.topic.toLowerCase().includes('newton')) {
    if (mode === 'simplify') {
      return `### 💡 Think of it like a Shopping Cart

Imagine pushing an empty cart down the supermarket aisle. It moves with a slight touch. Now imagine it loaded with 50 kg of heavy groceries. You have to push with all your strength to get it moving at the same pace!

That is **Newton's Second Law**:
- **Force** is your push.
- **Mass** is the groceries inside.
- **Acceleration** is how fast it gains speed.

👉 Formula: $F = ma$

❓ **Quick check:** What happens if you double your push force while mass stays the same?`;
    }
    return `### 📌 Core Concept: Newton's Second Law of Motion

Newton's Second Law quantifies how an object accelerates when subjected to an external net force:
$$F_{\\text{net}} = m \\cdot a$$

### 💡 Simple Explanation
- **Force causes acceleration**: An object won't accelerate unless an unbalanced force pushes or pulls it.
- **Mass resists acceleration**: Heavier objects require greater net force for the exact same acceleration.
- **Direction alignment**: The acceleration vector points in the exact direction of the net force vector.

### 🔬 Real-World Example
A soccer ball ($m = 0.45\\text{ kg}$) kicked with $90\\text{ N}$ of force experiences:
$$a = \\frac{90\\text{ N}}{0.45\\text{ kg}} = 200\\text{ m/s}^2$$
If you kicked a $6\\text{ kg}$ bowling ball with that same force, acceleration would only be $15\\text{ m/s}^2$!

### ❓ Quick Check Question
If a constant net force of $30\\text{ N}$ acts on a $5\\text{ kg}$ skateboard, what is its acceleration?`;
  }

  return `### 📌 Core Concept: ${context.topic} (${context.subject})

Here is a clear breakdown of **${context.topic}** tailored for ${context.difficulty} level.

### 💡 Intuition & Core Principle
In ${context.subject}, this topic establishes how variables govern dynamic changes. By focusing on fundamental rules rather than memorizing isolated formulas, you can solve both conceptual and calculation problems with ease.

### 🔬 Practical Application
Consider where this occurs in daily life or standard exam questions: isolate known quantities, write down governing constraints, and compute step-by-step.

### ❓ Quick Check Question
What would happen if the primary input variable is doubled while system parameters stay constant? Give it a thought!`;
}

function getClientQuizFallback(subject: SubjectName, topic: string, difficulty: DifficultyLevel, count: number) {
  const mathQuestions: QuizQuestion[] = [
    {
      id: 'cq-1',
      question: 'What is the derivative of f(x) = x² with respect to x?',
      type: 'multiple_choice',
      options: ['x', '2x', 'x²', '2'],
      correctAnswer: '2x',
      explanation: 'By the power rule: d/dx(xⁿ) = n·xⁿ⁻¹. For n=2, we obtain 2·x¹ = 2x.',
      hint: 'Bring down the exponent and reduce the power by 1.',
    },
    {
      id: 'cq-2',
      question: 'For ax² + bx + c = 0, what does discriminant b² - 4ac < 0 mean?',
      type: 'multiple_choice',
      options: ['Two distinct real roots', 'One repeated real root', 'Two complex conjugate roots', 'Zero roots of any kind'],
      correctAnswer: 'Two complex conjugate roots',
      explanation: 'A negative discriminant produces an imaginary square root term, giving two complex conjugate roots and no real x-intercepts.',
      hint: 'Recall the square root term in the quadratic formula.',
    },
    {
      id: 'cq-3',
      question: 'True or False: The derivative of any constant c is always 0.',
      type: 'true_false',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'A constant function produces a horizontal line with a slope of 0 everywhere.',
      hint: 'Consider the slope of y = 5.',
    },
    {
      id: 'cq-4',
      question: 'What is the limit of (sin x)/x as x approaches 0?',
      type: 'multiple_choice',
      options: ['0', '1', 'Undefined', 'Infinity'],
      correctAnswer: '1',
      explanation: 'Via L’Hôpital’s rule or geometric squeeze theorem, lim (sin x)/x as x->0 equals 1.',
      hint: 'Differentiate numerator and denominator at 0.',
    },
    {
      id: 'cq-5',
      question: 'A square matrix with a determinant equal to zero is called a ________ matrix.',
      type: 'short_answer',
      options: [],
      correctAnswer: 'singular',
      explanation: 'A matrix with zero determinant cannot be inverted and is termed singular.',
      hint: 'Rhymes with angular.',
    },
  ];

  const physicsQuestions: QuizQuestion[] = [
    {
      id: 'cpq-1',
      question: 'According to Newton’s Second Law, doubling the net force on an object of constant mass results in:',
      type: 'multiple_choice',
      options: ['Halved acceleration', 'Constant acceleration', 'Doubled acceleration', 'Quadrupled acceleration'],
      correctAnswer: 'Doubled acceleration',
      explanation: 'Because a = F/m, acceleration is directly proportional to net force for constant mass.',
      hint: 'F and a are directly proportional.',
    },
    {
      id: 'cpq-2',
      question: 'What is the SI unit of electrical potential difference?',
      type: 'multiple_choice',
      options: ['Ampere', 'Volt', 'Ohm', 'Joule'],
      correctAnswer: 'Volt',
      explanation: 'The Volt is defined as 1 Joule per Coulomb (1 V = 1 J/C).',
      hint: 'Named after Alessandro Volta.',
    },
    {
      id: 'cpq-3',
      question: 'True or False: Isolated magnetic monopoles exist in classical electromagnetism.',
      type: 'true_false',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'Gauss’s law for magnetism (∇·B = 0) states magnetic poles always come in north-south dipole pairs.',
      hint: 'Cutting a magnet in half creates two new magnets with both poles.',
    },
  ];

  const pool = subject === 'Physics' ? physicsQuestions : mathQuestions;
  return {
    title: `${subject} — ${topic} Diagnostic Quiz`,
    subject,
    topic,
    difficulty,
    questions: pool.slice(0, count),
    source: 'offline-curriculum',
  };
}

function getClientNotesFallback(notes: string, subject: SubjectName, topic: string): NoteSummary {
  return {
    summary: `Structured academic breakdown for ${topic} in ${subject}. Core concepts emphasize fundamental equations, boundary invariants, and typical exam pitfalls.`,
    keyIdea: 'Mastering the governing equation and direction vectors ensures reliable answers for both qualitative concepts and multi-step math problems.',
    keyConcepts: [
      {
        title: 'Core Governing Law',
        description: 'The foundational relationship connecting input excitation to observable dynamic response.',
      },
      {
        title: 'Boundary Constraints',
        description: 'Assumptions under which the standard formula applies (e.g. constant mass, inertial frame).',
      },
    ],
    definitions: [
      {
        term: 'State Variable',
        definition: 'A quantifiable physical or mathematical property describing the system condition.',
      },
    ],
    formulas: [
      {
        formula: 'Governing Formula (e.g. F = ma or dy/dx = 2x)',
        context: 'Apply under standard baseline initial conditions.',
      },
    ],
    examQuestions: [
      {
        question: 'How does the primary response change if the driving parameter is doubled?',
        answerKey: 'Demonstrate proportional scaling using the explicit formula.',
      },
    ],
    difficultConcepts: [
      'Confusing rate of change at an exact point with total accumulated change.',
    ],
    examTip: 'Always draw a clear schematic diagram and check units before computing numerical values.',
  };
}

function getClientFlashcardsFallback(subject: SubjectName, topic: string, count: number): Flashcard[] {
  const cards: Flashcard[] = [
    {
      id: `cfc-${Date.now()}-1`,
      front: `What is the core formula for ${topic}?`,
      back: `F_net = m·a (or governing relationship for ${topic}). Ensure consistent SI units when solving.`,
      subject,
      topic,
      difficulty: 'Beginner',
      status: 'review',
    },
    {
      id: `cfc-${Date.now()}-2`,
      front: `What is the primary exam pitfall in ${topic}?`,
      back: 'Misidentifying vector signs or confusing rate of change with instantaneous value.',
      subject,
      topic,
      difficulty: 'Intermediate',
      status: 'learning',
    },
    {
      id: `cfc-${Date.now()}-3`,
      front: `How do you verify your solution in ${topic}?`,
      back: 'Perform dimensional analysis (unit check) and test extreme limiting cases (zero and infinity).',
      subject,
      topic,
      difficulty: 'Advanced',
      status: 'learning',
    },
  ];
  return cards.slice(0, count);
}

function getClientStudyPlanFallback(hoursPerDay: number): StudyPlan {
  return {
    overview: 'Personalized 7-Day Exam Acceleration Plan designed around high-yield weak topic remediation with active recall quizzes.',
    weeklyTargetHours: Number(hoursPerDay || 2.5) * 7,
    days: [
      {
        day: 'Monday',
        date: 'Today',
        focus: 'Mathematics & Mechanics Remediation',
        sessions: [
          { id: 'cs-1', time: '09:00', subject: 'Mathematics', topic: 'Quadratic Equations & Roots', durationMinutes: 30, completed: true, type: 'practice' },
          { id: 'cs-2', time: '11:00', subject: 'Physics', topic: "Newton's Laws & Force Vectors", durationMinutes: 25, completed: true, type: 'learn' },
          { id: 'cs-3', time: '17:00', subject: 'Computer Science', topic: 'Data Structures & Binary Search Trees', durationMinutes: 40, completed: false, type: 'quiz' }
        ]
      }
    ],
    recommendations: [
      'Spend 30 minutes daily on your 58% Calculus weak area.',
      'Review flashcards prior to sleep to consolidate active recall.',
    ],
  };
}
