import { useState, type FormEvent } from 'react';
import type { AssignmentDraft } from './types';

interface AssignmentFormProps {
  onSubmit: (draft: AssignmentDraft) => void;
}

export function AssignmentForm({ onSubmit }: AssignmentFormProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !subject.trim() || !dueDate) {
      setError('Vui lòng nhập đầy đủ tên bài, môn học và hạn nộp.');
      return;
    }
    onSubmit({ title: title.trim(), subject: subject.trim(), dueDate });
    setTitle('');
    setSubject('');
    setDueDate('');
    setError('');
  }

  return (
    <form className="assignment-form" onSubmit={handleSubmit} noValidate>
      <label>
        Tên bài tập
        <input
          aria-label="Tên bài tập"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ví dụ: Ôn tập chương 3"
        />
      </label>
      <label>
        Môn học
        <input
          aria-label="Môn học"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Ví dụ: Toán học"
        />
      </label>
      <label>
        Hạn nộp
        <input
          aria-label="Hạn nộp"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="button">Thêm bài tập</button>
    </form>
  );
}
