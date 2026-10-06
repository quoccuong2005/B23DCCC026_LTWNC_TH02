import type { Assignment } from './types';
import { initialAssignments } from './utils';

export async function getAssignments(): Promise<Assignment[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 180));
  return initialAssignments;
}
