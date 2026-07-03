import { CalculationEntry } from '@/types';
import { getRelativeTime } from '@/utils/time';

interface HistoryEntryProps {
  entry: CalculationEntry;
  isActive: boolean;
  onClick: (entry: CalculationEntry) => void;
  now: Date;
}

export function HistoryEntry({ entry, isActive, onClick, now }: HistoryEntryProps) {
  const relTime = getRelativeTime(entry.timestamp, now);
  const absTime = entry.timestamp.toLocaleString();

  return (
    <button
      onClick={() => onClick(entry)}
      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-amber-100 border border-amber-400'
          : 'hover:bg-gray-100 border border-transparent'
      }`}
      title={absTime}
      aria-label={`${entry.expression} = ${entry.result}, ${relTime}`}
    >
      <div className="flex justify-between items-baseline gap-2">
        <span className="text-gray-700 text-sm font-mono truncate">{entry.expression}</span>
        <span className="text-amber-600 font-semibold text-sm shrink-0">= {entry.result}</span>
      </div>
      <div className="text-xs text-gray-400 mt-0.5">{relTime}</div>
    </button>
  );
}
