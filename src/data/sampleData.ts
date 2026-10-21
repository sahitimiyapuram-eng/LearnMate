import {
  StudentProfile,
  WeakTopic,
  StrongTopic,
  StudyTask,
  StudyPlan,
  NoteItem,
  Flashcard,
  AIRecommendation,
  SubjectName
} from '../types';

export const INITIAL_STUDENT: StudentProfile = {
  name: 'Aarav Sharma',
  age: 18,
  level: 'Undergraduate',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
  subjects: ['Mathematics', 'Physics', 'Computer Science', 'English'],
  goal: 'Prepare efficiently for upcoming exams while improving weak topics.',
  streakDays: 7,
  weeklyStudyHours: '4h 35m',
  overallAccuracy: 82,
  topicsMasteredCount: 12,
};

export const SUBJECT_PROGRESS: Record<SubjectName, { score: number; color: string; topicsCount: number; target: number }> = {
  Mathematics: { score: 78, color: '#3B82F6', topicsCount: 18, target: 90 },
  Physics: { score: 71, color: '#6366F1', topicsCount: 15, target: 85 },
  'Computer Science': { score: 88, color: '#10B981', topicsCount: 22, target: 95 },
  English: { score: 91, color: '#EC4899', topicsCount: 14, target: 95 },
};

export const INITIAL_WEAK_TOPICS: WeakTopic[] = [
  {
    id: 'wt-1',
    subject: 'Mathematics',
    name: 'Calculus',
    score: 58,
    status: 'critical',
    lastStudied: '2 days ago',
  },
  {
    id: 'wt-2',
    subject: 'Physics',
    name: 'Electromagnetism',
    score: 64,
    status: 'needs_work',
    lastStudied: '3 days ago',
  },
  {
    id: 'wt-3',
    subject: 'Computer Science',
    name: 'Trees',
    score: 67,
    status: 'improving',
    lastStudied: 'Yesterday',
  },
];

export const INITIAL_STRONG_TOPICS: StrongTopic[] = [
  { id: 'st-1', subject: 'Mathematics', name: 'Algebra', score: 92 },
  { id: 'st-2', subject: 'Computer Science', name: 'Programming Fundamentals', score: 94 },
  { id: 'st-3', subject: 'English', name: 'Grammar & Syntax', score: 91 },
];

export const INITIAL_TODAY_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    time: '09:00',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    durationMinutes: 30,
    completed: true,
    type: 'practice',
  },
  {
    id: 'task-2',
    time: '11:00',
    subject: 'Physics',
    topic: "Newton's Laws",
    durationMinutes: 25,
    completed: true,
    type: 'learn',
  },
  {
    id: 'task-3',
    time: '17:00',
    subject: 'Computer Science',
    topic: 'Data Structures',
    durationMinutes: 40,
    completed: false,
    type: 'quiz',
  },
];

export const INITIAL_RECOMMENDATION: AIRecommendation = {
  headline: 'Focus on Quadratic Foundations before Calculus',
  message:
    "You've improved significantly in Algebra this week. Your quiz results suggest spending another 25 minutes on Quadratic Equations before moving to Calculus.",
  recommendedAction: {
    type: 'quiz',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    suggestedMinutes: 25,
    buttonText: 'Start Practice',
  },
  secondaryAction: {
    type: 'tutor',
    subject: 'Mathematics',
    topic: 'Calculus',
    buttonText: 'Ask AI Tutor',
  },
  suggestedMinutes: 25,
} as any;

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: "Newton's Laws of Motion & Dynamics",
    subject: 'Physics',
    topic: "Newton's Laws",
    updatedAt: 'Today at 11:25 AM',
    content: `Newton's laws of motion describe the relationship between force, mass, and acceleration.

Newton's First Law (Law of Inertia): An object at rest stays at rest, and an object in motion continues in motion with the same speed and in the same direction unless acted upon by an unbalanced external force.

Newton's Second Law: The acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass. Mathematically:
F = ma
Where F is net force in Newtons (N), m is mass in kg, and a is acceleration in m/s².

Key points:
- Force causes acceleration, not velocity.
- Greater force produces greater acceleration.
- Greater mass requires more force for the same acceleration.
- Force and acceleration are vectors and share the exact same direction.

Newton's Third Law: For every action, there is an equal and opposite reaction. Action and reaction forces act on different bodies.`,
    summary: {
      summary: "Newton's laws establish the core framework for classical mechanics, quantifying how forces dictate changes in an object's momentum and motion.",
      keyIdea: 'F = ma governs dynamic response: net force causes acceleration in the exact direction of the unbalanced force.',
      keyConcepts: [
        {
          title: 'Inertia & Resistance',
          description: 'Mass measures how tenaciously an object resists changes to its current velocity state.',
        },
        {
          title: 'Direct vs Inverse Scaling',
          description: 'Acceleration scales proportionally with applied force and inversely with mass.',
        },
      ],
      definitions: [
        { term: 'Newton (N)', definition: 'The SI unit of force: 1 N = 1 kg·m/s².' },
        { term: 'Net Force', definition: 'The vector sum of all external forces acting on a body.' },
      ],
      formulas: [
        { formula: 'F_net = m · a', context: 'Used when mass is invariant and acceleration is constant.' },
        { formula: 'p = m · v', context: 'Linear momentum definition.' },
      ],
      examQuestions: [
        {
          question: 'Why do action-reaction pairs in Newton’s third law never cancel each other out?',
          answerKey: 'Because they act on two different, distinct physical bodies, not the same body.',
        },
        {
          question: 'If net force is doubled and mass is tripled, what is the new acceleration ratio?',
          answerKey: 'a_new = (2F) / (3m) = (2/3) a_original.',
        },
      ],
      difficultConcepts: [
        'Confusing velocity with acceleration: an object can have high velocity with zero net force.',
      ],
      examTip: 'Remember that force and acceleration ALWAYS have the exact same directional vector sign.',
    },
  },
  {
    id: 'note-2',
    title: 'Quadratic Equations & Parabolic Roots',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    updatedAt: 'Today at 09:30 AM',
    content: `A quadratic equation is a second-order polynomial equation of the form:
ax² + bx + c = 0, where a ≠ 0.

Standard Quadratic Formula:
x = (-b ± √(b² - 4ac)) / (2a)

The discriminant Δ = b² - 4ac determines root nature:
1. If Δ > 0: Two distinct real roots (parabola crosses x-axis twice).
2. If Δ = 0: One repeated real root (vertex touches x-axis).
3. If Δ < 0: Two complex conjugate roots (no real x-intercepts).

Vertex coordinates:
x_v = -b / (2a)
y_v = c - (b² / 4a)

Factoring techniques:
Look for pairs of numbers that multiply to ac and add to b.`,
  },
  {
    id: 'note-3',
    title: 'Binary Search Trees & Traversal',
    subject: 'Computer Science',
    topic: 'Trees',
    updatedAt: 'Yesterday',
    content: `A Binary Search Tree (BST) is a hierarchical tree data structure where each node has at most two children, satisfying the BST invariant:
- All keys in the left subtree are strictly LESS than the node's key.
- All keys in the right subtree are strictly GREATER than the node's key.

Time Complexities:
- Search: O(log n) average, O(n) worst-case (skewed linked-list tree).
- Insertion: O(log n) average.
- Deletion: O(log n) average.

Tree Traversals:
1. In-Order: Left -> Root -> Right (produces sorted order).
2. Pre-Order: Root -> Left -> Right (used for serialization/cloning).
3. Post-Order: Left -> Right -> Root (used for bottom-up cleanup/freeing memory).
4. Level-Order (BFS): Uses a FIFO queue.`,
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: "What is Newton's Second Law of Motion?",
    back: 'F = ma (Net Force = Mass × Acceleration). Force and acceleration share the same direction vector.',
    subject: 'Physics',
    topic: "Newton's Laws",
    difficulty: 'Beginner',
    status: 'mastered',
  },
  {
    id: 'fc-2',
    front: 'What is the Power Rule for differentiation?',
    back: 'd/dx (xⁿ) = n·xⁿ⁻¹. For example, the derivative of x² is 2x.',
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty: 'Beginner',
    status: 'review',
  },
  {
    id: 'fc-3',
    front: 'What is the time complexity of searching a balanced Binary Search Tree?',
    back: 'O(log n) on average. If unbalanced (skewed), it degrades to O(n).',
    subject: 'Computer Science',
    topic: 'Trees',
    difficulty: 'Intermediate',
    status: 'review',
  },
  {
    id: 'fc-4',
    front: 'What does Lenz’s Law state about induced electromagnetic current?',
    back: 'The direction of an induced current always opposes the change in magnetic flux that caused it.',
    subject: 'Physics',
    topic: 'Electromagnetism',
    difficulty: 'Intermediate',
    status: 'review',
  },
  {
    id: 'fc-5',
    front: 'What does the discriminant (b² - 4ac) < 0 signify for a quadratic equation?',
    back: 'It indicates that there are two complex conjugate roots and no real x-axis intercepts.',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    difficulty: 'Beginner',
    status: 'mastered',
  },
  {
    id: 'fc-6',
    front: 'What is the key difference between a Stack and a Queue in Computer Science?',
    back: 'Stack is LIFO (Last-In, First-Out); Queue is FIFO (First-In, First-Out).',
    subject: 'Computer Science',
    topic: 'Data Structures',
    difficulty: 'Beginner',
    status: 'mastered',
  },
  {
    id: 'fc-7',
    front: 'What is the Product Rule for differentiating f(x) · g(x)?',
    back: 'd/dx [f(x) · g(x)] = f\'(x)g(x) + f(x)g\'(x).',
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty: 'Intermediate',
    status: 'review',
  },
  {
    id: 'fc-8',
    front: 'In English grammar, what is an active vs passive voice sentence?',
    back: 'Active: The subject performs the action ("Aarav solved the equation"). Passive: The subject receives the action ("The equation was solved by Aarav").',
    subject: 'English',
    topic: 'Grammar',
    difficulty: 'Beginner',
    status: 'mastered',
  },
];

export const INITIAL_STUDY_PLAN: StudyPlan = {
  overview: 'Personalized 7-Day Exam Acceleration Plan designed around high-yield weak topic remediation (Calculus, Electromagnetism, Trees) with active recall quizzes and structured rest intervals.',
  weeklyTargetHours: 17.5,
  days: [
    {
      day: 'Monday',
      date: 'Today',
      focus: 'Mathematics & Mechanics Remediation',
      sessions: [
        { id: 's1-1', time: '09:00', subject: 'Mathematics', topic: 'Quadratic Equations & Roots', durationMinutes: 30, completed: true, type: 'practice' },
        { id: 's1-2', time: '11:00', subject: 'Physics', topic: "Newton's Laws & Force Vectors", durationMinutes: 25, completed: true, type: 'learn' },
        { id: 's1-3', time: '17:00', subject: 'Computer Science', topic: 'Data Structures & Binary Search Trees', durationMinutes: 40, completed: false, type: 'quiz' }
      ]
    },
    {
      day: 'Tuesday',
      date: 'Tomorrow',
      focus: 'Deep Dive: Weak Area (Calculus Derivatives)',
      sessions: [
        { id: 's2-1', time: '09:30', subject: 'Mathematics', topic: 'Differential Calculus & Power Rule', durationMinutes: 40, completed: false, type: 'learn' },
        { id: 's2-2', time: '11:30', subject: 'Mathematics', topic: 'Product & Quotient Rules Practice', durationMinutes: 35, completed: false, type: 'practice' },
        { id: 's2-3', time: '16:30', subject: 'English', topic: 'Advanced Academic Vocabulary & Tone', durationMinutes: 25, completed: false, type: 'flashcards' }
      ]
    },
    {
      day: 'Wednesday',
      date: 'Oct 20',
      focus: 'Physics Electromagnetism Mastery',
      sessions: [
        { id: 's3-1', time: '10:00', subject: 'Physics', topic: 'Magnetic Fields & Faraday’s Law', durationMinutes: 45, completed: false, type: 'learn' },
        { id: 's3-2', time: '14:00', subject: 'Physics', topic: 'Electromagnetism Diagnostic Quiz', durationMinutes: 25, completed: false, type: 'quiz' },
        { id: 's3-3', time: '17:00', subject: 'Computer Science', topic: 'BST Traversal Algorithms (In-Order, BFS)', durationMinutes: 35, completed: false, type: 'practice' }
      ]
    },
    {
      day: 'Thursday',
      date: 'Oct 21',
      focus: 'Computer Science Trees & Recursion',
      sessions: [
        { id: 's4-1', time: '09:00', subject: 'Computer Science', topic: 'Balanced Trees & AVL Concepts', durationMinutes: 40, completed: false, type: 'learn' },
        { id: 's4-2', time: '11:30', subject: 'Mathematics', topic: 'Calculus Applications (Tangent Lines & Rates)', durationMinutes: 35, completed: false, type: 'practice' },
        { id: 's4-3', time: '16:00', subject: 'Revision', topic: 'Spaced Repetition Flashcard Review', durationMinutes: 20, completed: false, type: 'flashcards' }
      ]
    },
    {
      day: 'Friday',
      date: 'Oct 22',
      focus: 'Synthesis & Interleaved Problem Solving',
      sessions: [
        { id: 's5-1', time: '10:00', subject: 'Physics', topic: 'Newtonian Dynamics Multi-Step Problems', durationMinutes: 40, completed: false, type: 'practice' },
        { id: 's5-2', time: '14:30', subject: 'Computer Science', topic: 'Binary Search Tree Coding Exercises', durationMinutes: 35, completed: false, type: 'practice' },
        { id: 's5-3', time: '17:00', subject: 'Mathematics', topic: 'Calculus Mixed Problem Set', durationMinutes: 30, completed: false, type: 'quiz' }
      ]
    },
    {
      day: 'Saturday',
      date: 'Oct 23',
      focus: 'Comprehensive Diagnostic Simulation',
      sessions: [
        { id: 's6-1', time: '10:00', subject: 'Mathematics', topic: 'Full Mock Quiz: Algebra & Calculus', durationMinutes: 45, completed: false, type: 'quiz' },
        { id: 's6-2', time: '14:00', subject: 'Physics', topic: 'Full Mock Quiz: Mechanics & EM', durationMinutes: 45, completed: false, type: 'quiz' },
        { id: 's6-3', time: '16:30', subject: 'Review', topic: 'AI Tutor Diagnostic Error Analysis', durationMinutes: 30, completed: false, type: 'learn' }
      ]
    },
    {
      day: 'Sunday',
      date: 'Oct 24',
      focus: 'Weekly Retrospective & Confidence Reset',
      sessions: [
        { id: 's7-1', time: '11:00', subject: 'All Subjects', topic: 'High-Yield Flashcard Blitz', durationMinutes: 30, completed: false, type: 'flashcards' },
        { id: 's7-2', time: '15:00', subject: 'Planner', topic: 'Review Weak Topic Score Shifts & Next Week Goals', durationMinutes: 20, completed: false, type: 'review' }
      ]
    }
  ],
  recommendations: [
    'Prioritize your 58% Calculus score: 35 minutes daily creates compounding gains.',
    'Complete the 10-minute flashcard review before bedtime for memory consolidation.',
    'Take a mandatory 5-minute movement break between every 35-minute block.'
  ]
};

export const STARTUP_ORGANIZATION = {
  name: 'LearnMate AI Inc.',
  structure: {
    lead: 'Founder / Product Lead',
    teams: [
      { name: 'Engineering', count: 5, role: 'Full-stack & Frontend Developers' },
      { name: 'AI & Data', count: 1, role: 'AI Engineer (Prompt Engineering & Model Fine-tuning)' },
      { name: 'Product Design', count: 1, role: 'UX/UI Designer' },
      { name: 'Growth', count: 1, role: 'Marketing Manager' },
      { name: 'Operations', count: 2, role: 'Finance Manager & HR Manager' },
      { name: 'Trust & Safety', count: 1, role: 'Cybersecurity Specialist' },
      { name: 'Customer Success', count: 1, role: 'Customer Service Manager' }
    ]
  },
  roadmap: [
    {
      month: 'Month 1',
      title: 'MVP & Core Learning Loop',
      items: ['AI Tutor chat with pedagogical modes', 'Diagnostic quiz generator & instant feedback', 'Notes summarizer & flashcards', 'Personalized student dashboard']
    },
    {
      month: 'Month 3',
      title: 'Pilot & Adaptive Refinement',
      items: ['Pilot trial with 100-300 high school & university students', 'Model fine-tuning on academic misconceptions', 'Advanced student retention analytics', 'User experience polish']
    },
    {
      month: 'Month 6',
      title: 'Public Launch & Pro Tier',
      items: ['Official commercial launch', 'Subscription tier with unlimited AI queries', 'Marketing campaigns across student communities', 'Comprehensive security audits & SOC-2 compliance']
    },
    {
      month: 'Month 12',
      title: 'Enterprise & School Scale',
      items: ['School partnership program & LMS integration', 'Teacher & Parent oversight dashboards', 'AI Voice Tutor for interactive spoken practice', 'Multilingual curriculum expansion']
    }
  ],
  futureFeatures: [
    { title: 'Teacher Dashboard', desc: 'Real-time classroom diagnostic insights, assignment tracking, and automated intervention triggers.' },
    { title: 'Parent Dashboard', desc: 'Weekly progress digests and positive reinforcement alerts.' },
    { title: 'AI Voice Tutor', desc: 'Real-time conversational voice tutor with natural interruption and pronunciation coaching.' },
    { title: 'School Management & LMS', desc: 'Single-sign-on (SSO) integration with Canvas, Google Classroom, and Blackboard.' },
    { title: 'Multilingual Learning', desc: 'Instant explanations in Spanish, Hindi, French, German, Mandarin, and Arabic.' },
    { title: 'Peer Study Rooms', desc: 'Collaborative study sessions with shared flashcard competitions.' }
  ]
};
