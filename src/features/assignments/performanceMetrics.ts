import { isDevelopment } from '../../app/environment';

declare global {
  interface Window {
    __assignmentCardRenderCount?: number;
  }
}

export function recordAssignmentCardRender(): void {
  if (isDevelopment) {
    window.__assignmentCardRenderCount = (window.__assignmentCardRenderCount ?? 0) + 1;
  }
}

export function resetAssignmentCardRenderCount(): void {
  if (isDevelopment) window.__assignmentCardRenderCount = 0;
}
