export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }
  
  export interface Test {
    id: number;
    title: string;
    timeLimit: number;
    questions: Question[];
  }
  
  export interface Result {
    testId: number;
    correctCount: number;
    answers: {
      questionId: number;
      selectedAnswer: number;
      isCorrect: boolean;
    }[];
    date: string;
  }
  