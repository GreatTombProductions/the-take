import { useState, useRef, useEffect } from 'react';

interface Props {
  value: number | string;
  displayValue?: string;
  onChange: (value: number | string) => void;
  type?: 'number' | 'text' | 'percent' | 'currency';
  className?: string;
  inputClassName?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function EditableCell({
  value,
  displayValue,
  onChange,
  type = 'number',
  className = '',
  inputClassName = '',
  min,
  max,
  step,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => {
    if (type === 'percent') {
      setDraft(String(Math.round((value as number) * 1000) / 10));
    } else {
      setDraft(String(value));
    }
    setEditing(true);
  };

  const commit = () => {
    setEditing(false);
    if (type === 'number' || type === 'currency') {
      const n = parseFloat(draft);
      if (!isNaN(n)) onChange(n);
    } else if (type === 'percent') {
      const n = parseFloat(draft);
      if (!isNaN(n)) onChange(n / 100);
    } else {
      onChange(draft);
    }
  };

  const cancel = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') cancel();
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type === 'text' ? 'text' : 'number'}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        step={step ?? (type === 'percent' ? 0.1 : 1)}
        className={`editable-cell-input ${inputClassName}`}
      />
    );
  }

  const display = displayValue ?? String(value);

  return (
    <span
      onClick={startEdit}
      className={`editable-cell ${className}`}
      title="Click to edit"
    >
      {display}
    </span>
  );
}
