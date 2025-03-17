import { Result } from '../models/Test';

const STORAGE_KEY = 'test_results';

export function saveResult(result: Result): void {
  const results = loadResults();
  const updatedResults = results.filter(r => r.testId !== result.testId);
  updatedResults.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
}

export function loadResults(): Result[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function loadResultByTestId(testId: number): Result | null {
  const results = loadResults();
  return results.find(r => r.testId === testId) || null;
}

export function deleteResult(testId: number): void {
  const results = JSON.parse(localStorage.getItem('test_results') || '[]');
  const updatedResults: Result[] = results.filter((r: Result) => r.testId !== testId);
  localStorage.setItem('test_results', JSON.stringify(updatedResults));
}
