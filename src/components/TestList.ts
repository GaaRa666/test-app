import { Test } from '../models/Test';
import tests from '../data/tests.json';
import { loadResultByTestId } from '../utils/storage';
import { RenderResultViewer } from './ResultViewer';


export function renderTestList(
  container: HTMLElement,
  onSelectTest: (test: Test) => void,
  selectedTestId: number | null = null
): void {

  if (!selectedTestId) {
    container.innerHTML = `
      <div class="test-selection">
        <p class="test-selection__prompt">Выберите тест из списка</p>
      </div>
    `;
  } else {
    const test = tests.find(t => t.id === selectedTestId);
    if (!test) return;

    const finishedResult = loadResultByTestId(test.id);

    if (finishedResult) {
      RenderResultViewer(container, finishedResult, test, () => {
        renderTestList(container, onSelectTest);
      });
    } else {
      container.innerHTML = `
        <div class="test-info">
          <div class="test-info__line-container">
            <h2 class="test-info__title">Описание</h2>
          </div>
          <div class="test-info__container">
          <div class="test-info__description">
            <p>${test.description}</p>
          </div>
          <div class="test-info__time">
            <p><strong>Время на выполнение:</strong> ${test.timeLimit} секунд</p>
          </div>
          <div class="test-info__buttons">
            <button class="test-info__button test-info__button--start">Начать</button>
            <button class="test-info__button test-info__button--cancel">Отмена</button>
          </div>
          </div>
        </div>
      `;

      const startBtn = container.querySelector('.test-info__button--start') as HTMLElement;
      startBtn.addEventListener('click', () => {
        onSelectTest(test);
      });

      const cancelBtn = container.querySelector('.test-info__button--cancel') as HTMLElement;
      cancelBtn.addEventListener('click', () => {
        renderTestList(container, onSelectTest);
        updateSidebarTestMenu(onSelectTest, null);
      });
    }
  }

  updateSidebarTestMenu(onSelectTest, selectedTestId);
}

function updateSidebarTestMenu(
  onSelectTest: (test: Test) => void,
  selectedTestId: number | null
): void {
  const menuList = document.getElementById('testMenuList') as HTMLElement;

  if (!menuList) return;

  menuList.innerHTML = tests.map(test => {
    const finishedResult = loadResultByTestId(test.id);
    const isActive = selectedTestId === test.id;
    const isFinished = !!finishedResult;

    return `
      <li>
        <button
          class="sidebar__test-btn ${isActive ? 'sidebar__test-btn--active' : ''}"
          data-id="${test.id}"
        >
          ${test.title}
          ${isFinished ? '<span class="sidebar__test-status">✔</span>' : ''}
        </button>
      </li>
    `;
  }).join('');

  menuList.querySelectorAll('.sidebar__test-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt((button as HTMLElement).dataset.id || '', 10);
      const selectedTest = tests.find(t => t.id === id);
      if (selectedTest) {
        renderTestList(document.getElementById('mainContent')!, onSelectTest, id);
      }
    });
  });
}
