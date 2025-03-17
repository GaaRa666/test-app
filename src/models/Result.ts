export interface Result {
    testId: number;
    correctCount: number;
    answers: Answer[];
    date: string; 
  }
  
  export interface Answer {
    questionId: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }
  