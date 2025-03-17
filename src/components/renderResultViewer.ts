import { Result, Test } from '../models/Test';
import { deleteResult } from '../utils/storage';


export function renderResultViewer(
  container: HTMLElement,
  result: Result,
  test: Test,
  onRestart: () => void,
  timeSpentInSeconds: number
): void {

  const correctCount = result.correctCount;
  const totalQuestions = test.questions.length;

  const renderQuestions = () => {
    return test.questions.map((q, index) => {
      const userAnswer = result.answers.find(a => a.questionId === q.id);
      const userAnswerText = userAnswer !== undefined && userAnswer.selectedAnswer !== undefined
        ? q.options[userAnswer.selectedAnswer]
        : 'Нет ответа';

      return `
        <div class="result-question">
          <div class="result-question__title">${index + 1}. ${q.question}</div>
          <div class="result-question__correct">Правильный ответ: <strong>${q.options[q.correctAnswerIndex]}</strong></div>
          <div class="result-question__user">Вы ответили: <strong>${userAnswerText}</strong></div>
        </div>
      `;
    }).join('');
  };

  container.innerHTML = `
    <div class="test-container">
      
      <!-- HEADER -->
      <header class="test-header">
        <button class="test-header__exit">Выход</button>
        <div class="test-header__title">${test.title}</div>
        <div class="test-header__controls">
          <button class="test-header__reset">Сбросить все ответы</button>
          <div class="test-header__answers">${result.answers.length}/${totalQuestions}</div>
          <div class="test-header__timer">${formatTime(timeSpentInSeconds)}</div>
        </div>
      </header>

      <!-- BODY -->
      <div class="test-body">
        <div class="test-finish">
          <h2 class="test-finish__title">Тест завершён</h2>
          <p class="test-finish__subtitle">Вы ответили правильно на ${correctCount} из ${totalQuestions}</p>
        </div>

        <div class="result-questions">
          ${renderQuestions()}
        </div>
      </div>

      <!-- FOOTER -->
      <footer class="test-footer">
        <button class="test-footer__restart">Пройти ещё раз</button>
      </footer>

    </div>
  `;


  container.querySelector('.test-footer__restart')?.addEventListener('click', () => {
    deleteResult(test.id);
    onRestart();
  });

  container.querySelector('.test-header__exit')?.addEventListener('click', () => {
    onRestart();
  });

  container.querySelector('.test-header__reset')?.addEventListener('click', () => {
    deleteResult(test.id);
    onRestart();
  });
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}
