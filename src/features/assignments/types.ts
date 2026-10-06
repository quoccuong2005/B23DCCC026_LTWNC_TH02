export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

export interface AssignmentDraft {
  title: string;
  subject: string;
  dueDate: string;
}

export interface AssignmentStats {
  total: number;
  completed: number;
  overdue: number;
  bySubject: Record<string, number>;
}
