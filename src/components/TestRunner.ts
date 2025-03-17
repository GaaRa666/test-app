import { Test, Result } from '../models/Test';
import { saveResult } from '../utils/storage';

export function renderTestRunner(
  container: HTMLElement,
  test: Test,
  onFinish: (result: Result, remainingTime: number) => void
): void {
  let answers: Result['answers'] = [];
  let remainingTime = test.timeLimit;
  let timerInterval: number;

  const startTimer = () => {
    timerInterval = setInterval(() => {
      remainingTime--;
      updateTimerDisplay();

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        endTest();
      }
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const updateTimerDisplay = () => {
    const timerElement = container.querySelector('.test-header__timer') as HTMLElement;
    if (timerElement) {
      timerElement.textContent = formatTime(remainingTime);
    }
  };

  const updateAnswerCounter = () => {
    const answerCounter = container.querySelector('.test-header__answers') as HTMLElement;
    answerCounter.textContent = `${answers.length}/${test.questions.length}`;
  };

  const endTest = () => {
    clearInterval(timerInterval);

    const correctCount = answers.filter(a => a.isCorrect).length;

    const result: Result = {
      testId: test.id,
      correctCount,
      answers,
      date: new Date().toISOString()
    };

    saveResult(result);
    onFinish(result, remainingTime);
  };

  const resetAnswers = () => {
    answers = [];
    test.questions.forEach(q => {
      const selected = container.querySelector(`input[name="question-${q.id}"]:checked`) as HTMLInputElement;
      if (selected) {
        selected.checked = false;
      }
    });
    updateAnswerCounter();
  };

  const handleAnswer = (questionId: number, selectedIndex: number) => {
    const existing = answers.find(a => a.questionId === questionId);

    if (existing) {
      existing.selectedAnswer = selectedIndex;
      existing.isCorrect = test.questions.find(q => q.id === questionId)!.correctAnswerIndex === selectedIndex;
    } else {
      const isCorrect = test.questions.find(q => q.id === questionId)!.correctAnswerIndex === selectedIndex;
      answers.push({
        questionId,
        selectedAnswer: selectedIndex,
        isCorrect
      });
    }

    updateAnswerCounter();
  };

  const renderQuestions = () => {
    return test.questions.map((q, index) => `
      <div class="test-question">
        <div class="test-question__title">${index + 1}. ${q.question}</div>
        <div class="test-question__options">
          ${q.options.map((option, idx) => `
            <label class="test-option">
              <input type="radio" name="question-${q.id}" value="${idx}" class="test-option__input" />
              <span class="test-option__circle"></span>
              <span class="test-option__text">${option}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
  };

  const renderModal = () => {
    return `
      <div class="modal-overlay" style="display: none;">
        <div class="modal">
          <div class="modal__header">Вы уверены, что хотите выйти?</div>
          <div class="modal__subheader">Все результаты будут сброшены</div>
          <div class="modal__buttons">
            <button class="modal__button modal__button--exit">Выйти</button>
            <button class="modal__button modal__button--cancel">Отмена</button>
          </div>
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="test-container">
      <header class="test-header">
        <button class="test-header__exit">Выход</button>
        <div class="test-header__title">${test.title}</div>
        <div class="test-header__controls">
          <button class="test-header__reset">Сбросить все ответы</button>
          <div class="test-header__answers">0/${test.questions.length}</div>
          <div class="test-header__timer">${formatTime(remainingTime)}</div>
        </div>
      </header>

      <div class="test-body">
        ${renderQuestions()}
      </div>

      <footer class="test-footer">
        <button class="test-footer__finish">Завершить</button>
      </footer>
    </div>
  `;

  container.innerHTML += renderModal();

  startTimer();

  const modalOverlay = container.querySelector('.modal-overlay') as HTMLElement;
  const modalExitButton = modalOverlay.querySelector('.modal__button--exit') as HTMLElement;
  const modalCancelButton = modalOverlay.querySelector('.modal__button--cancel') as HTMLElement;

  container.querySelector('.test-header__exit')?.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
  });

  modalCancelButton.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
  });

  modalExitButton.addEventListener('click', () => {
    clearInterval(timerInterval);

    const result: Result = {
      testId: test.id,
      correctCount: 0,
      answers: [],
      date: new Date().toISOString()
    };

    onFinish(result, remainingTime);
  });

  container.querySelector('.test-header__reset')?.addEventListener('click', () => {
    resetAnswers();
  });

  container.querySelectorAll('.test-option__input').forEach(input => {
    input.addEventListener('change', () => {
      const target = input as HTMLInputElement;
      const questionId = parseInt(target.name.split('-')[1], 10);
      const selectedIndex = parseInt(target.value, 10);
      handleAnswer(questionId, selectedIndex);
    });
  });

  container.querySelector('.test-footer__finish')?.addEventListener('click', () => {
    endTest();
  });
}
