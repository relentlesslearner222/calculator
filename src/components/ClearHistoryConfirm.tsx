interface ClearHistoryConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ClearHistoryConfirm({ onConfirm, onCancel }: ClearHistoryConfirmProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-700">Are you sure? This cannot be undone.</p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
          aria-label="Confirm clear history"
        >
          Clear
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1.5 rounded bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-colors"
          aria-label="Cancel clear history"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
