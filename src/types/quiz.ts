export namespace Quiz {
  // === Quiz ===
  export interface QuizInfo {
    id: number;
    title: string;
    description: string;
    timeLimitSeconds?: number;
    isPublished: boolean;
    createdAt: string; // ISO timestamp
  }

  // === Question ===
  export type QuestionType = 'mcq' | 'short' | 'code';

  export interface Question {
    id: number;
    quizId: number;
    type: QuestionType;
    prompt: string;
    options?: string[]; // only for mcq
    correctAnswer?: string | number; // string for short/code, number for mcq index
    position: number;
  }

  // === Attempt ===
  export interface Attempt {
    id: number;
    quizId: number;
    startedAt: string;
    submittedAt?: string;
    answers: Answer[];
    score?: number;
    quizSnapshot: Omit<QuizInfo, 'isPublished' | 'createdAt'> & {
      questions: Omit<Question, 'correctAnswer'>[];
    };
  }

  export interface AttemptResult {
    score: number;
    details: {
      questionId: number;
      correct: boolean | null; // null for code/manual review
      expected?: string; // correct answer for feedback
    }[];
  }

  export interface Answer {
    questionId: number;
    value: string | number; // user input, can be text, code, or option index
  }
}
