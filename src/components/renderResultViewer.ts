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
        <article class="result-question">
        <h3 class="result-question__title">${index + 1}. ${q.question}</h3>

        <dl class="result-question__details">
          <div class="result-question__correct">
            <dt>Правильный ответ:</dt>
            <dd><strong>${q.options[q.correctAnswerIndex]}</strong></dd>
          </div>

          <div class="result-question__user">
            <dt>Ваш ответ:</dt>
            <dd><strong>${userAnswerText}</strong></dd>
          </div>
        </dl>
      </article>
      `;
    }).join('');
  };

  container.innerHTML = `
    <main class="test-container">
    <header class="test-header">
      <button class="test-header__exit" aria-label="Выйти из теста">Выход</button>

      <h2 class="test-header__title">${test.title}</h2>

      <nav class="test-header__controls" aria-label="Панель управления тестом">
        <button type="button" class="test-header__reset">Сбросить все ответы</button>
        
        <div class="test-header__answers" aria-label="Количество ответов">
          ${result.answers.length}/${totalQuestions}
        </div>
        
        <time class="test-header__timer" datetime="${formatTime(timeSpentInSeconds)}" aria-label="Время прохождения теста">
          ${formatTime(timeSpentInSeconds)}
        </time>
      </nav>
    </header>

    <section class="test-body">
      <div class="test-finish">
        <h3 class="test-finish__title">Тест завершён</h3>
        <p class="test-finish__subtitle">Вы ответили правильно на ${correctCount} из ${totalQuestions}</p>
      </div>

      <section class="result-questions">
        ${renderQuestions()}
      </section>
    </section>

    <footer class="test-footer">
      <button type="button" class="test-footer__restart">Пройти ещё раз</button>
    </footer>

  </main>

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
