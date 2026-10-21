import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Cross-Origin headers for any device and webview access
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize GoogleGenAI instance safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI with GEMINI_API_KEY:', err);
  }
}

// -------------------------------------------------------------
// Helper: Clean JSON response from Gemini markdown code blocks
// -------------------------------------------------------------
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'LearnMate AI',
    hasApiKey: Boolean(ai),
    model: 'gemini-3.8-flash',
  });
});

// AI Tutor chat endpoint
app.post('/api/ai/tutor', async (req: Request, res: Response) => {
  const { message, context, mode, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const subject = context?.subject || 'General Academic';
  const topic = context?.topic || 'General Science & Math';
  const difficulty = context?.difficulty || 'Intermediate';
  const tutoringMode = mode || 'explain';

  const systemInstruction = `
You are LearnMate AI, an exceptional, empathetic, and rigorous personal AI tutor for high school and undergraduate students (aged 15-22).
Your pedagogical goals:
1. Understand the student's question deeply.
2. Adapt to knowledge level: Difficulty is ${difficulty}, Subject is ${subject}, Topic is ${topic}.
3. The student selected Tutoring Mode: "${tutoringMode}".
   - "explain": Provide a crystal-clear conceptual explanation with an everyday intuitive analogy, formal reasoning, and a quick check question.
   - "example": Provide 2 concrete, step-by-step solved real-world examples with clear formulas and explanations.
   - "hint": Give a gentle Socratic hint that guides the student to the answer without revealing the entire solution.
   - "simplify": Explain like the student is 12 years old (ELIF), using no jargon, simple everyday metaphors, and fundamental intuition.
   - "step-by-step": Walk through the mathematical or logical derivation step by step, numbered clearly (Step 1, Step 2, Step 3).
   - "quiz-me": Give a quick concept check question followed by 4 multiple-choice options (A, B, C, D) to test their understanding immediately.
4. Structure complex explanations into:
   - 📌 **Core Concept**
   - 💡 **Simple Explanation / Intuition**
   - 🔬 **Real-World Example**
   - 📐 **Step-by-Step Breakdown / Formula** (if applicable)
   - ❓ **Quick Check Question** (to verify comprehension and encourage thinking)
5. Tone: Encouraging, supportive, clear, academic without being intimidating or dry. Avoid unnecessary jargon.
6. Text Formatting & Formulas:
   - Use **bold** liberally on key concepts, important terms, variable names, and takeaway conclusions so they stand out prominently.
   - Present mathematical formulas clearly as they are (e.g. $$F = ma$$, $$a = F / m$$, $$d/dx(x^n) = n · x^{n-1}$$, $$ax² + bx + c = 0$$). Use standard readable mathematical symbols (like ×, ·, ÷, ±, √, ², ³, →) so formulas appear natural, clean, and distinct.
`;

  if (ai) {
    try {
      // Build conversation contents
      const conversationPrompt = `
Context: Subject: ${subject}, Topic: ${topic}, Difficulty: ${difficulty}, Mode: ${tutoringMode}.
Student's question: "${message}"

Please respond as LearnMate AI following the system instruction.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'I understood your question. Let me walk you through it...';
      return res.json({ reply, mode: tutoringMode, source: 'gemini-3.8-flash' });
    } catch (error: any) {
      console.warn('Gemini API call failed, falling back to smart demo response:', error?.message);
    }
  }

  // Smart fallback response if AI key is missing or errored
  const fallbackReply = generateFallbackTutorResponse(message, subject, topic, difficulty, tutoringMode);
  return res.json({ reply: fallbackReply, mode: tutoringMode, source: 'demo-curriculum' });
});

// AI Quiz Generator endpoint
app.post('/api/ai/quiz', async (req: Request, res: Response) => {
  const { subject, topic, difficulty, count = 5, questionType = 'all' } = req.body;

  const numQuestions = Math.min(Math.max(Number(count) || 5, 3), 15);
  const prompt = `
Generate ${numQuestions} educational quiz questions for a student studying ${subject}, specifically on the topic "${topic}".
Difficulty level: ${difficulty || 'Intermediate'}.
Question formats: ${questionType === 'all' ? 'Mix of multiple-choice, true/false, and short answer' : questionType}.

Return ONLY a valid JSON object with the following exact structure:
{
  "title": "${subject} — ${topic} Diagnostic Quiz",
  "subject": "${subject}",
  "topic": "${topic}",
  "difficulty": "${difficulty || 'Intermediate'}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "type": "multiple_choice", // "multiple_choice" | "true_false" | "short_answer"
      "options": ["Option A", "Option B", "Option C", "Option D"], // empty array for short_answer
      "correctAnswer": "Option B", // exact text matching correct option or key phrase
      "explanation": "Clear explanation of why this answer is correct and why other options are incorrect.",
      "hint": "A subtle clue to help if the student gets stuck."
    }
  ]
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const cleaned = cleanJsonOutput(response.text || '{}');
      const data = JSON.parse(cleaned);
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        return res.json({ ...data, source: 'gemini-3.8-flash' });
      }
    } catch (error: any) {
      console.warn('Gemini Quiz generation failed, falling back:', error?.message);
    }
  }

  // High-quality subject-specific fallback
  const fallbackQuiz = generateFallbackQuiz(subject, topic, difficulty, numQuestions);
  return res.json({ ...fallbackQuiz, source: 'demo-curriculum' });
});

// AI Notes Summarization endpoint
app.post('/api/ai/summarize-notes', async (req: Request, res: Response) => {
  const { notes, subject, topic } = req.body;

  if (!notes || typeof notes !== 'string') {
    return res.status(400).json({ error: 'Notes content is required' });
  }

  const prompt = `
You are an expert academic tutor. Analyze the following student study notes on ${subject || 'General'} (${topic || 'Core Concept'}):

"""
${notes}
"""

Extract and generate a structured study breakdown in strict JSON:
{
  "summary": "Concise 2-3 sentence executive summary of the notes.",
  "keyIdea": "The single most fundamental principle or overarching takeaway.",
  "keyConcepts": [
    { "title": "Concept Name", "description": "Crisp explanation with real-world relevance" }
  ],
  "definitions": [
    { "term": "Technical Term", "definition": "Precise, student-friendly definition" }
  ],
  "formulas": [
    { "formula": "Mathematical or formal expression", "context": "When and how to apply it" }
  ],
  "examQuestions": [
    { "question": "Probable exam question based on this text", "answerKey": "Key point needed to score full marks" }
  ],
  "difficultConcepts": [
    "Common student misconceptions or subtle points to watch out for"
  ],
  "examTip": "A memorable pro-tip for solving exam problems on this topic."
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const cleaned = cleanJsonOutput(response.text || '{}');
      const data = JSON.parse(cleaned);
      if (data && data.summary) {
        return res.json({ ...data, source: 'gemini-3.8-flash' });
      }
    } catch (err: any) {
      console.warn('Gemini note summarizer failed, falling back:', err?.message);
    }
  }

  const fallbackSummary = generateFallbackNotesSummary(notes, subject, topic);
  return res.json({ ...fallbackSummary, source: 'demo-curriculum' });
});

// AI Flashcards Generator endpoint
app.post('/api/ai/flashcards', async (req: Request, res: Response) => {
  const { topic, subject, notes, count = 6 } = req.body;
  const numCards = Math.min(Math.max(Number(count) || 6, 3), 12);

  const prompt = `
Create ${numCards} high-yield revision flashcards for ${subject || 'Science/Math'}, topic: "${topic || 'Key Concepts'}".
${notes ? `Based on these notes:\n"${notes}"` : ''}

Return ONLY valid JSON:
{
  "flashcards": [
    {
      "id": "fc-1",
      "front": "Clear question, prompt, or formula name",
      "back": "Clear, concise answer, formula, or concept explanation",
      "subject": "${subject || 'General'}",
      "topic": "${topic || 'General'}",
      "difficulty": "Intermediate"
    }
  ]
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const cleaned = cleanJsonOutput(response.text || '{}');
      const data = JSON.parse(cleaned);
      if (data && Array.isArray(data.flashcards)) {
        return res.json({ flashcards: data.flashcards, source: 'gemini-3.8-flash' });
      }
    } catch (err: any) {
      console.warn('Gemini flashcard generation failed, falling back:', err?.message);
    }
  }

  const fallbackCards = generateFallbackFlashcards(subject, topic, numCards);
  return res.json({ flashcards: fallbackCards, source: 'demo-curriculum' });
});

// AI Study Plan Generator endpoint
app.post('/api/ai/study-plan', async (req: Request, res: Response) => {
  const { examDate, subjects, hoursPerDay, preferredTime, weakTopics, confidenceLevel } = req.body;

  const prompt = `
Design a highly realistic, pedagogically balanced 7-day study plan for a student:
- Target Exam Date: ${examDate || 'in 4 weeks'}
- Subjects: ${Array.isArray(subjects) ? subjects.join(', ') : 'Mathematics, Physics, Computer Science'}
- Available study time: ${hoursPerDay || 2.5} hours/day
- Preferred study time: ${preferredTime || 'Evening'}
- Current Confidence: ${confidenceLevel || 'Moderate'}
- Weak Topics requiring priority focus: ${Array.isArray(weakTopics) ? weakTopics.join(', ') : 'Calculus, Electromagnetism, Trees'}

Principles:
1. Prioritize weak topics with spaced repetition.
2. Interleave practice with brief 10-minute breaks (Pomodoro technique).
3. Include active recall (Quizzing and Flashcards) every day.
4. Keep daily sessions achievable (avoid burnout).

Return strictly JSON:
{
  "overview": "Summary of plan strategy emphasizing weak topics first.",
  "weeklyTargetHours": ${Number(hoursPerDay || 2.5) * 7},
  "days": [
    {
      "day": "Monday",
      "focus": "Core Weakness Intervention",
      "sessions": [
        { "id": "s-1", "time": "09:00", "subject": "Mathematics", "topic": "Quadratic Equations & Roots", "duration": 40, "type": "learn", "completed": true },
        { "id": "s-2", "time": "11:00", "subject": "Physics", "topic": "Newton's Second Law & Momentum", "duration": 35, "type": "practice", "completed": true },
        { "id": "s-3", "time": "17:00", "subject": "Computer Science", "topic": "Binary Search Trees", "duration": 45, "type": "quiz", "completed": false }
      ]
    }
  ],
  "recommendations": [
    "Spend the first 15 minutes of each session reviewing yesterday's flashcards.",
    "Do a 10-question adaptive quiz after completing each topic."
  ]
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const cleaned = cleanJsonOutput(response.text || '{}');
      const data = JSON.parse(cleaned);
      if (data && Array.isArray(data.days)) {
        return res.json({ ...data, source: 'gemini-3.8-flash' });
      }
    } catch (err: any) {
      console.warn('Gemini study plan failed, falling back:', err?.message);
    }
  }

  const fallbackPlan = generateFallbackStudyPlan(subjects, hoursPerDay, weakTopics);
  return res.json({ ...fallbackPlan, source: 'demo-curriculum' });
});

// AI Recommendations endpoint
app.post('/api/ai/recommendation', async (req: Request, res: Response) => {
  const { studentName = 'Aarav', weakTopics, accuracy = 82, streak = 7 } = req.body;

  const prompt = `
Generate a personalized, encouraging AI learning recommendation for student ${studentName}:
- Current Streak: ${streak} days
- Overall Quiz Accuracy: ${accuracy}%
- Needs Attention on: ${Array.isArray(weakTopics) ? weakTopics.map((w: any) => `${w.subject}: ${w.name} (${w.score}%)`).join(', ') : 'Calculus (58%), Electromagnetism (64%), Trees (67%)'}

Return strictly JSON:
{
  "headline": "High-impact recommendation headline",
  "message": "2-3 sentences of supportive, actionable advice explaining why this recommendation was picked and what specific 20-30 minute action to take next.",
  "recommendedAction": {
    "type": "quiz", // "quiz" | "tutor" | "flashcards" | "notes"
    "subject": "Mathematics",
    "topic": "Quadratic Equations & Calculus Foundation",
    "suggestedMinutes": 25,
    "buttonText": "Start 25m Practice"
  },
  "secondaryAction": {
    "type": "tutor",
    "subject": "Mathematics",
    "topic": "Derivatives & Rate of Change",
    "buttonText": "Ask AI Tutor"
  }
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const cleaned = cleanJsonOutput(response.text || '{}');
      const data = JSON.parse(cleaned);
      if (data && data.headline) {
        return res.json({ ...data, source: 'gemini-3.8-flash' });
      }
    } catch (err: any) {
      console.warn('Gemini recommendation failed, falling back:', err?.message);
    }
  }

  return res.json({
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
      topic: 'Calculus — Differential Calculus Basics',
      buttonText: 'Ask AI Tutor',
    },
    source: 'demo-curriculum',
  });
});

// -------------------------------------------------------------
// Fallback Generators (High quality academic demo generators)
// -------------------------------------------------------------
function generateFallbackTutorResponse(
  message: string,
  subject: string,
  topic: string,
  difficulty: string,
  mode: string
): string {
  const lower = message.toLowerCase();

  if (lower.includes('newton') || lower.includes('force') || topic.toLowerCase().includes('newton')) {
    if (mode === 'simplify') {
      return `### 💡 Think of it like a Shopping Cart

Imagine pushing an empty shopping cart. It glides forward effortlessly because it has very little mass. Now fill it with 50 kilograms of groceries. You have to push much harder to get it moving at the same speed!

That is **Newton's Second Law**:
- **Force** is how hard you push.
- **Mass** is how heavy or packed the cart is.
- **Acceleration** is how fast it speeds up.

**Formula in plain words:**
Pushing Force = Weight of Object × How Fast it Speeds Up ($F = ma$).

❓ **Quick check:**
If you double the force you push on the cart, what happens to how fast it accelerates?`;
    }

    if (mode === 'example') {
      return `### 🔬 Real-World Solved Examples: Newton's Second Law ($F = ma$)

#### Example 1: Rocket Launch
A small research rocket has a mass of $m = 1,200\\text{ kg}$. The thrusters exert an upward force of $F = 18,000\\text{ N}$.
$$a = \\frac{F}{m} = \\frac{18,000\\text{ N}}{1,200\\text{ kg}} = 15\\text{ m/s}^2$$
*Insight:* Because the acceleration ($15\\text{ m/s}^2$) exceeds Earth's gravitational acceleration ($9.8\\text{ m/s}^2$), the net upward acceleration is $5.2\\text{ m/s}^2$.

#### Example 2: Braking a Vehicle
A $1,500\\text{ kg}$ sedan decelerates at $-4\\text{ m/s}^2$ to stop before an obstacle.
$$F = (1,500\\text{ kg}) \\times (-4\\text{ m/s}^2) = -6,000\\text{ N}$$
The negative sign shows that the friction force opposes the direction of forward motion.

❓ **Quick check:**
If the car had twice the mass ($3,000\\text{ kg}$), how much braking force would be required for the same deceleration?`;
    }

    if (mode === 'step-by-step') {
      return `### 📐 Step-by-Step Derivation & Mechanics of Newton's 2nd Law

1. **Step 1: Define Momentum ($p$)**
   Momentum is the product of mass and velocity:
   $$p = m \\cdot v$$

2. **Step 2: Relate Force to Rate of Change of Momentum**
   Newton originally stated that force is the time derivative of linear momentum:
   $$F = \\frac{dp}{dt} = \\frac{d(mv)}{dt}$$

3. **Step 3: Apply the Product Rule (for constant mass)**
   Assuming mass $m$ does not change with time ($dm/dt = 0$):
   $$F = m \\cdot \\frac{dv}{dt}$$

4. **Step 4: Substitute Acceleration**
   Since acceleration is the rate of change of velocity ($a = dv/dt$):
   $$F = ma$$

❓ **Quick check:**
In what real-world vehicle does mass *change* significantly while it accelerates, making $F = dp/dt$ necessary? (Hint: Think space travel!)`;
    }

    if (mode === 'hint') {
      return `### 💡 Guiding Hint
To solve problems involving Newton's Second Law:
- First, draw a **Free-Body Diagram (FBD)** showing all forces acting on the object.
- Identify your coordinate axes (positive $x$ and $y$ directions).
- Calculate the **net external force** ($\Sigma F$) before plugging into $\Sigma F = ma$.

What forces are currently acting on the object in your problem?`;
    }

    if (mode === 'quiz-me') {
      return `### 🧠 Quick Concept Check: Newton's Second Law

A $5\\text{ kg}$ block is sliding on a frictionless horizontal table. Two forces act on it: $20\\text{ N}$ to the right and $5\\text{ N}$ to the left.

What is the acceleration of the block?
A) $3\\text{ m/s}^2$ to the right
B) $5\\text{ m/s}^2$ to the right
C) $4\\text{ m/s}^2$ to the left
D) $15\\text{ m/s}^2$ to the right

*Reply with your choice, and I'll explain the exact physics!*`;
    }

    // Default explain mode
    return `### 📌 Core Concept: Newton's Second Law of Motion

Newton's Second Law describes the quantitative relationship between the **net force** applied to an object, its **mass**, and the resulting **acceleration**.

### 💡 Simple Explanation
Think of acceleration as the direct result of pushing something:
- The harder you push (**Force** $\\uparrow$), the faster it speeds up (**Acceleration** $\\uparrow$).
- The heavier the object (**Mass** $\\uparrow$), the harder it resists speeding up (**Acceleration** $\\downarrow$).

### 🔬 Real-World Analogy
Kicking a soccer ball versus kicking a solid bowling ball with identical effort. The soccer ball flies across the pitch at high speed (low mass $\\rightarrow$ high acceleration), while the bowling ball barely budges (high mass $\\rightarrow$ low acceleration).

### 📐 The Mathematical Formula
$$F_{\\text{net}} = m \\cdot a$$
Where:
- $F_{\\text{net}}$ = Net force acting on the body (measured in Newtons, $\\text{N} = \\text{kg}\\cdot\\text{m/s}^2$)
- $m$ = Mass of the object (in kilograms, $\\text{kg}$)
- $a$ = Acceleration (in meters per second squared, $\\text{m/s}^2$)

### ❓ Quick Check Question
If an unbalanced force of $24\\text{ N}$ acts on a $6\\text{ kg}$ object on a frictionless surface, what will its acceleration be?`;
  }

  if (lower.includes('derivative') || lower.includes('calculus') || topic.toLowerCase().includes('calculus')) {
    return `### 📌 Core Concept: Understanding Derivatives

A derivative simply measures **how fast something is changing at an exact instant in time**.

### 💡 The Speedometer Intuition
If you drive from New York to Philadelphia, your **average speed** might be $60\\text{ mph}$ over 2 hours. But when you glance down at your speedometer at exactly 2:15 PM, it might read $72\\text{ mph}$.
- Average rate of change = $\\frac{\\Delta y}{\\Delta x}$
- Instantaneous rate of change = **The Derivative** $\\frac{dy}{dx} = \\lim_{\\Delta x \\to 0} \\frac{\\Delta y}{\\Delta x}$

### 📐 The Fundamental Power Rule
For any polynomial function $f(x) = x^n$:
$$\\frac{d}{dx}(x^n) = n \\cdot x^{n-1}$$

#### Quick Walkthrough:
If $f(x) = x^2$:
1. Bring the power down: $2$
2. Decrease power by 1: $x^{2-1} = x^1 = x$
3. Result: $f'(x) = 2x$

At $x = 3$, the slope of the tangent line is $2(3) = 6$.

### ❓ Quick Check
Using the power rule, what is the derivative of $f(x) = x^3$?`;
  }

  // General fallback structured response
  return `### 📌 Core Concept: ${topic} (${subject})

Great question! Let's examine **${topic}** with a focus on deep conceptual understanding.

### 💡 Intuition & Core Principle
In ${subject}, this concept serves as a key pillar for intermediate and advanced problem-solving. When you break it down into first principles, every complex scenario is composed of fundamental interactions that obey consistent laws.

### 🔬 Practical Application
Consider where this occurs in practice: whether analyzing physical systems, algorithmic structures, or mathematical relationships, identifying the governing constraints allows you to predict outcomes with precision.

### 📐 Key Formulation & Rules
- Always verify units and domain boundaries before computing.
- Separate independent variables from dependent variables.
- Check edge conditions (e.g., zero, infinity, or boundary limits).

### ❓ Quick Check Question
Can you explain in your own words what happens when the primary parameter is increased by a factor of 2? Take a moment to think, and type your answer!`;
}

function generateFallbackQuiz(subject: string, topic: string, difficulty: string, count: number) {
  const questionsBank: Record<string, any[]> = {
    Mathematics: [
      {
        id: 'm1',
        question: 'What is the derivative of f(x) = x² with respect to x?',
        type: 'multiple_choice',
        options: ['x', '2x', 'x²', '2'],
        correctAnswer: '2x',
        explanation: 'The power rule states that d/dx(xⁿ) = n·xⁿ⁻¹. Here, with n=2, we bring down 2 and subtract 1 from the exponent to get 2x¹ = 2x.',
        hint: 'Apply the power rule by bringing the exponent forward and reducing the power by 1.'
      },
      {
        id: 'm2',
        question: 'For the quadratic equation ax² + bx + c = 0, what does the discriminant (b² - 4ac) < 0 signify?',
        type: 'multiple_choice',
        options: ['Two distinct real roots', 'One repeated real root', 'Two complex conjugate roots', 'Infinitely many roots'],
        correctAnswer: 'Two complex conjugate roots',
        explanation: 'When b² - 4ac < 0, the square root in the quadratic formula yields an imaginary number, producing two complex conjugate solutions with no real x-intercepts.',
        hint: 'Think about what happens when you take the square root of a negative number in the quadratic formula.'
      },
      {
        id: 'm3',
        question: 'True or False: The derivative of a constant function f(x) = c is always 0.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'A constant function produces a horizontal line with a slope of zero everywhere. Since derivative measures slope, d/dx(c) = 0.',
        hint: 'What is the slope of a flat horizontal line on an xy-plane?'
      },
      {
        id: 'm4',
        question: 'What is the limit of (sin x) / x as x approaches 0?',
        type: 'multiple_choice',
        options: ['0', '1', 'Undefined', 'Infinity'],
        correctAnswer: '1',
        explanation: 'Using the squeeze theorem or L’Hôpital’s Rule (lim cos(x)/1 as x->0 = 1), lim(x->0) [sin(x)/x] equals 1.',
        hint: 'Consider L’Hôpital’s rule: take derivative of numerator and denominator.'
      },
      {
        id: 'm5',
        question: 'If a matrix has a determinant of 0, it is called a non-invertible or ________ matrix.',
        type: 'short_answer',
        options: [],
        correctAnswer: 'singular',
        explanation: 'A square matrix is singular if and only if its determinant is zero, meaning its columns are linearly dependent and it has no inverse.',
        hint: 'Begins with the letter "s" and rhymes with modular.'
      }
    ],
    Physics: [
      {
        id: 'p1',
        question: 'According to Newton’s Second Law, if you double the net force on an object of constant mass, its acceleration will:',
        type: 'multiple_choice',
        options: ['Halve', 'Stay the same', 'Double', 'Quadruple'],
        correctAnswer: 'Double',
        explanation: 'Since F = ma and mass m is constant, acceleration a is directly proportional to net force F (a = F/m). Doubling F doubles a.',
        hint: 'Look at the linear relation in F = ma.'
      },
      {
        id: 'p2',
        question: 'What is the SI unit of electric potential difference (electromotive force)?',
        type: 'multiple_choice',
        options: ['Ampere', 'Volt', 'Ohm', 'Coulomb'],
        correctAnswer: 'Volt',
        explanation: 'The Volt (V) is the SI unit of electrical potential, defined as 1 Joule of energy per Coulomb of charge (1 V = 1 J/C).',
        hint: 'Named after the Italian physicist Alessandro Volta.'
      },
      {
        id: 'p3',
        question: 'True or False: Magnetic monopoles have been observed and isolated in laboratory experiments.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Gauss’s law for magnetism (∇·B = 0) indicates there are no magnetic monopoles. Every magnet has both a north and a south pole.',
        hint: 'Can you cut a bar magnet in half and get only an isolated North pole?'
      },
      {
        id: 'p4',
        question: 'In electromagnetic induction, Faraday’s Law states that induced electromotive force equals the negative rate of change of magnetic _______ through a loop.',
        type: 'short_answer',
        options: [],
        correctAnswer: 'flux',
        explanation: 'Faraday’s law of induction is ε = -dΦ/dt, where Φ represents magnetic flux.',
        hint: 'A four-letter word beginning with "f" measuring the field passing through an area.'
      },
      {
        id: 'p5',
        question: 'Which of the following electromagnetic waves has the highest frequency?',
        type: 'multiple_choice',
        options: ['Radio waves', 'Microwaves', 'Visible light', 'Gamma rays'],
        correctAnswer: 'Gamma rays',
        explanation: 'Gamma rays have the shortest wavelength and therefore the highest frequency and photon energy in the electromagnetic spectrum.',
        hint: 'Think of the radiation produced in radioactive decay and nuclear reactions.'
      }
    ],
    'Computer Science': [
      {
        id: 'cs1',
        question: 'What is the average time complexity for searching a balanced Binary Search Tree (BST) with n nodes?',
        type: 'multiple_choice',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 'O(log n)',
        explanation: 'In a balanced BST, each comparison halves the remaining search space, giving an average time complexity of O(log n).',
        hint: 'Every step eliminates approximately half of the remaining subtrees.'
      },
      {
        id: 'cs2',
        question: 'In an in-order traversal of a Binary Search Tree, elements are visited in:',
        type: 'multiple_choice',
        options: ['Descending order', 'Ascending sorted order', 'Level-by-level order', 'Random order'],
        correctAnswer: 'Ascending sorted order',
        explanation: 'In-order traversal visits (Left Subtree -> Root -> Right Subtree). Since all left elements are smaller and right are larger, this yields ascending sorted order.',
        hint: 'Left < Root < Right.'
      },
      {
        id: 'cs3',
        question: 'True or False: A queue follows the Last-In, First-Out (LIFO) principle.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'A queue follows First-In, First-Out (FIFO), like a line of people waiting. Stacks follow LIFO.',
        hint: 'Think of standing in a grocery checkout line.'
      },
      {
        id: 'cs4',
        question: 'What data structure is typically used to implement Breadth-First Search (BFS) in a graph or tree?',
        type: 'multiple_choice',
        options: ['Stack', 'Queue', 'Priority Heap', 'Hash Set'],
        correctAnswer: 'Queue',
        explanation: 'BFS explores vertices level by level, requiring a FIFO Queue to process nodes in the exact order they were discovered.',
        hint: 'First discovered nodes are explored first (FIFO).'
      },
      {
        id: 'cs5',
        question: 'The process of a function calling itself directly or indirectly is known as ________.',
        type: 'short_answer',
        options: [],
        correctAnswer: 'recursion',
        explanation: 'Recursion is a programming technique where a function solves a problem by breaking it into smaller instances and calling itself until reaching a base case.',
        hint: 'Requires a base case to avoid stack overflow.'
      }
    ]
  };

  const pool = questionsBank[subject] || questionsBank['Mathematics'];
  const questions = pool.slice(0, count);

  return {
    title: `${subject} — ${topic} Diagnostic Quiz`,
    subject,
    topic,
    difficulty: difficulty || 'Intermediate',
    questions
  };
}

function generateFallbackNotesSummary(notes: string, subject?: string, topic?: string) {
  return {
    summary: 'The provided notes articulate the fundamental mechanics and governing principles of the topic. They highlight the core relationships between driving forces, system parameters, and observable outputs, providing a strong basis for exam preparation.',
    keyIdea: 'System behavior is governed by invariant relationships: understanding the root equation unlocks both qualitative conceptual questions and multi-step computational problems.',
    keyConcepts: [
      {
        title: 'Core Governing Principle',
        description: 'The fundamental law defining how the primary variables interact and balance within the domain.'
      },
      {
        title: 'System Invariants & Boundaries',
        description: 'Constraints such as conservation laws, continuity requirements, or algorithmic termination conditions.'
      },
      {
        title: 'Direct vs Inverse Proportionality',
        description: 'Predicting how changes in one parameter dynamically scale the response of dependent variables.'
      }
    ],
    definitions: [
      {
        term: 'State Variable',
        definition: 'A quantifiable property that describes the physical or logical condition of the system at a specific moment.'
      },
      {
        term: 'Equilibrium / Convergence',
        definition: 'The stable condition reached when opposing forces or iterative processes achieve balance.'
      }
    ],
    formulas: [
      {
        formula: 'F = ma (or Governing Relationship)',
        context: 'Apply when calculating dynamic response to net external excitation under standard boundary conditions.'
      }
    ],
    examQuestions: [
      {
        question: 'Explain what happens to the output when the primary input is doubled while holding the system parameter constant.',
        answerKey: 'Demonstrate linear scaling and state the exact formula connecting the input and output variables.'
      },
      {
        question: 'State two conditions under which this relationship would fail or require correction.',
        answerKey: 'Identify boundary breakdown (e.g. non-inertial frames, relativistic speeds, or stack limits).'
      }
    ],
    difficultConcepts: [
      'Confusing average rate of change with instantaneous value at a specific point.',
      'Forgetting vector direction when summing opposing components.'
    ],
    examTip: 'Always sketch a quick diagram or free-body representation before writing down equations — 70% of exam errors stem from misidentified signs or missed boundary conditions.'
  };
}

function generateFallbackFlashcards(subject?: string, topic?: string, count: number = 6) {
  const cards = [
    {
      id: 'fc-1',
      front: "What is Newton's Second Law?",
      back: 'F = ma (Net Force = Mass × Acceleration). Force and acceleration share the same vector direction.',
      subject: subject || 'Physics',
      topic: topic || "Newton's Laws",
      difficulty: 'Beginner'
    },
    {
      id: 'fc-2',
      front: 'What is the Power Rule for differentiation?',
      back: 'd/dx (xⁿ) = n·xⁿ⁻¹. For example, the derivative of x² is 2x.',
      subject: subject || 'Mathematics',
      topic: topic || 'Calculus',
      difficulty: 'Beginner'
    },
    {
      id: 'fc-3',
      front: 'What is the time complexity of searching in a balanced Binary Search Tree?',
      back: 'O(log n) on average. In the worst case (unbalanced tree), it degrades to O(n).',
      subject: subject || 'Computer Science',
      topic: topic || 'Trees',
      difficulty: 'Intermediate'
    },
    {
      id: 'fc-4',
      front: 'What does Lenz’s Law state about induced current in electromagnetic induction?',
      back: 'The direction of an induced electromotive force/current always opposes the change in magnetic flux that produced it.',
      subject: subject || 'Physics',
      topic: topic || 'Electromagnetism',
      difficulty: 'Intermediate'
    },
    {
      id: 'fc-5',
      front: 'What is the discriminant of a quadratic equation ax² + bx + c = 0?',
      back: 'Δ = b² - 4ac. If Δ > 0: two real roots; if Δ = 0: one repeated root; if Δ < 0: two complex conjugate roots.',
      subject: subject || 'Mathematics',
      topic: topic || 'Algebra',
      difficulty: 'Beginner'
    },
    {
      id: 'fc-6',
      front: 'What is the key difference between a Stack and a Queue?',
      back: 'Stack is LIFO (Last-In, First-Out, e.g. undo history); Queue is FIFO (First-In, First-Out, e.g. printer queue).',
      subject: subject || 'Computer Science',
      topic: topic || 'Data Structures',
      difficulty: 'Beginner'
    }
  ];
  return cards.slice(0, count);
}

function generateFallbackStudyPlan(subjects?: string[], hoursPerDay: number = 2.5, weakTopics?: any[]) {
  return {
    overview: 'Personalized 7-Day Exam Acceleration Plan designed around high-yield weak topic remediation (Calculus, Electromagnetism, Trees) with active recall quizzes and structured rest intervals.',
    weeklyTargetHours: Number(hoursPerDay || 2.5) * 7,
    days: [
      {
        day: 'Monday',
        focus: 'Mathematics & Mechanics Remediation',
        sessions: [
          { id: 's1-1', time: '09:00', subject: 'Mathematics', topic: 'Quadratic Equations & Roots', duration: 30, type: 'learn', completed: true },
          { id: 's1-2', time: '11:00', subject: 'Physics', topic: "Newton's Laws & Force Vectors", duration: 25, type: 'practice', completed: true },
          { id: 's1-3', time: '17:00', subject: 'Computer Science', topic: 'Data Structures & Binary Search Trees', duration: 40, type: 'quiz', completed: false }
        ]
      },
      {
        day: 'Tuesday',
        focus: 'Deep Dive: Weak Area (Calculus Derivatives)',
        sessions: [
          { id: 's2-1', time: '09:30', subject: 'Mathematics', topic: 'Differential Calculus & Power Rule', duration: 40, type: 'learn', completed: false },
          { id: 's2-2', time: '11:30', subject: 'Mathematics', topic: 'Product & Quotient Rules Practice', duration: 35, type: 'practice', completed: false },
          { id: 's2-3', time: '16:30', subject: 'English', topic: 'Advanced Academic Vocabulary & Tone', duration: 25, type: 'flashcards', completed: false }
        ]
      },
      {
        day: 'Wednesday',
        focus: 'Physics Electromagnetism Mastery',
        sessions: [
          { id: 's3-1', time: '10:00', subject: 'Physics', topic: 'Magnetic Fields & Faraday’s Law', duration: 45, type: 'learn', completed: false },
          { id: 's3-2', time: '14:00', subject: 'Physics', topic: 'Electromagnetism Diagnostic Quiz', duration: 25, type: 'quiz', completed: false },
          { id: 's3-3', time: '17:00', subject: 'Computer Science', topic: 'BST Traversal Algorithms (In-Order, BFS)', duration: 35, type: 'practice', completed: false }
        ]
      },
      {
        day: 'Thursday',
        focus: 'Computer Science Trees & Recursion',
        sessions: [
          { id: 's4-1', time: '09:00', subject: 'Computer Science', topic: 'Balanced Trees & AVL Concepts', duration: 40, type: 'learn', completed: false },
          { id: 's4-2', time: '11:30', subject: 'Mathematics', topic: 'Calculus Applications (Tangent Lines & Rates)', duration: 35, type: 'practice', completed: false },
          { id: 's4-3', time: '16:00', subject: 'Revision', topic: 'Spaced Repetition Flashcard Review', duration: 20, type: 'flashcards', completed: false }
        ]
      },
      {
        day: 'Friday',
        focus: 'Synthesis & Interleaved Problem Solving',
        sessions: [
          { id: 's5-1', time: '10:00', subject: 'Physics', topic: 'Newtonian Dynamics Multi-Step Problems', duration: 40, type: 'practice', completed: false },
          { id: 's5-2', time: '14:30', subject: 'Computer Science', topic: 'Binary Search Tree Coding Exercises', duration: 35, type: 'practice', completed: false },
          { id: 's5-3', time: '17:00', subject: 'Mathematics', topic: 'Calculus Mixed Problem Set', duration: 30, type: 'quiz', completed: false }
        ]
      },
      {
        day: 'Saturday',
        focus: 'Comprehensive Diagnostic Simulation',
        sessions: [
          { id: 's6-1', time: '10:00', subject: 'Mathematics', topic: 'Full Mock Quiz: Algebra & Calculus', duration: 45, type: 'quiz', completed: false },
          { id: 's6-2', time: '14:00', subject: 'Physics', topic: 'Full Mock Quiz: Mechanics & EM', duration: 45, type: 'quiz', completed: false },
          { id: 's6-3', time: '16:30', subject: 'Review', topic: 'AI Tutor Diagnostic Error Analysis', duration: 30, type: 'tutor', completed: false }
        ]
      },
      {
        day: 'Sunday',
        focus: 'Weekly Retrospective & Confidence Reset',
        sessions: [
          { id: 's7-1', time: '11:00', subject: 'All Subjects', topic: 'High-Yield Flashcard Blitz', duration: 30, type: 'flashcards', completed: false },
          { id: 's7-2', time: '15:00', subject: 'Planner', topic: 'Review Weak Topic Score Shifts & Next Week Goals', duration: 20, type: 'learn', completed: false }
        ]
      }
    ],
    recommendations: [
      "Prioritize your 58% Calculus score: 35 minutes daily creates compounding gains.",
      "Complete the 10-minute flashcard review before bedtime for memory consolidation.",
      "Take a mandatory 5-minute movement break between every 35-minute block."
    ]
  };
}

// -------------------------------------------------------------
// Dev vs Production Server Setup
// -------------------------------------------------------------
async function startServer() {
  const distDir = path.join(__dirname, 'dist');
  const publicDir = path.join(__dirname, 'public');
  const hasDist = fs.existsSync(path.join(distDir, 'index.html'));

  // Always serve static assets from public/ (e.g. logo.svg, manifest.json, sw.js)
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  if (hasDist) {
    // Serve production static files from dist
    app.use(express.static(distDir, {
      maxAge: '1h',
      index: false,
    }));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
    console.log('Serving production static build from dist/');
  } else {
    // Development or fallback with Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Serving with Vite middleware mode');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LearnMate AI server running on http://0.0.0.0:${PORT}`);
    console.log(`Gemini API configured: ${Boolean(ai ? 'YES' : 'DEMO_MODE')}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start LearnMate AI server:', err);
  process.exit(1);
});
