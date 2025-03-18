import "./assets/scss/styles.scss";
import { renderTestList } from "./components/TestList";
import { renderTestRunner } from "./components/TestRunner";
import { RenderResultViewer } from "./components/ResultViewer";
import { Test } from './models/Test';
import { Result } from './models/Result';

const app = document.getElementById("app") as HTMLElement;

app.innerHTML = `
  <div class="layout">
    <aside class="sidebar sidebar--collapsed" id="sidebar">
      <button
        class="sidebar__toggle sidebar__toggle--open"
        id="sidebarToggleOpen"
        aria-label="Открыть меню"
        aria-controls="sidebar"
      >
        <i class="fa-solid fa-bars"></i>
      </button>

      <div class="sidebar__content">
        <header class="sidebar__header">
          <button
            class="sidebar__toggle sidebar__toggle--close"
            id="sidebarToggleClose"
            aria-label="Закрыть меню"
            aria-controls="sidebar"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>

          <h2 class="sidebar__title">Тесты</h2>
        </header>

        <nav>
          <ul class="sidebar__list" id="testMenuList">
          </ul>
        </nav>
      </div>
    </aside>

    <main class="main-content" id="mainContent">
    </main>
  </div>
`;

const sidebar = document.getElementById("sidebar") as HTMLElement;
const toggleOpen = document.getElementById("sidebarToggleOpen") as HTMLElement;
const toggleClose = document.getElementById("sidebarToggleClose") as HTMLElement;

toggleOpen.addEventListener("click", () => {
  sidebar.classList.remove("sidebar--collapsed");
  document.querySelector('.layout')?.classList.add('sidebar-open');
});

toggleClose.addEventListener("click", () => {
  sidebar.classList.add("sidebar--collapsed");
  document.querySelector('.layout')?.classList.remove('sidebar-open');
});

function showTestList(selectedTestId: number | null = null): void {
  renderTestList(
    document.getElementById("mainContent")!,
    runTest,
    selectedTestId
  );
}

function runTest(test: Test): void {
  renderTestRunner(
    document.getElementById("mainContent")!,
    test,
    (result: Result, remainingTime: number) => {
      const timeSpentInSeconds = test.timeLimit - remainingTime;

      RenderResultViewer(
        document.getElementById("mainContent")!,
        result,
        test,
        (selectedTestId: number | null) => {
          showTestList(selectedTestId);
        }
      );
    }
  );
}

showTestList();
