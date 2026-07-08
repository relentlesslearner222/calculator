import { useState, useCallback } from 'react';
import { add, subtract } from './lib/calculator';
import { HistoryPanel } from './components/HistoryPanel';
import { HistoryEntry } from './lib/historyStore';
import './App.css';

type Operation = '+' | '-' | null;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [operand, setOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(
    () => window.matchMedia('(min-width: 768px)').matches
  );
  const [newEntry, setNewEntry] = useState<Omit<HistoryEntry, 'id' | 'timestamp'> | null>(null);

  const handleDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const handleOperation = useCallback((op: '+' | '-') => {
    const current = parseFloat(display);
    setOperand(current);
    setOperation(op);
    setWaitingForOperand(true);
  }, [display]);

  const handleEquals = useCallback(() => {
    if (operand === null || operation === null) return;
    const current = parseFloat(display);
    let result: number;
    if (operation === '+') {
      result = add(operand, current);
    } else {
      result = subtract(operand, current);
    }
    const expression = `${operand} ${operation} ${current}`;
    const resultStr = String(result);
    setDisplay(resultStr);
    setOperand(null);
    setOperation(null);
    setWaitingForOperand(false);
    setNewEntry({ expression, result: resultStr });
  }, [display, operand, operation]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setOperand(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const handleReplay = useCallback((result: string) => {
    setDisplay(result);
  }, []);

  const digits = ['7','8','9','4','5','6','1','2','3','0'];

  return (
    <div className={`app-layout${isPanelOpen ? ' app-layout--panel-open' : ''}`}>
      <div className="calculator">
        <div className="calculator__toolbar">
          <span className="calculator__title">Calc</span>
          <button
            className={`calculator__history-toggle${isPanelOpen ? ' active' : ''}`}
            onClick={() => setIsPanelOpen((v) => !v)}
            aria-label="Toggle history panel"
          >
            History
          </button>
        </div>
        <div className="calculator__display">
          <div className="calculator__operation-display">
            {operand !== null && operation ? `${operand} ${operation}` : ''}
          </div>
          <div className="calculator__main-display">{display}</div>
        </div>
        <div className="calculator__buttons">
          <button
            className="calculator__btn calculator__btn--wide calculator__btn--clear"
            onClick={handleClear}
          >
            AC
          </button>
          <button
            className="calculator__btn calculator__btn--op"
            onClick={() => handleOperation('-')}
          >
            −
          </button>
          <button
            className="calculator__btn calculator__btn--op"
            onClick={() => handleOperation('+')}
          >
            +
          </button>
          {digits.map((d) => (
            <button
              key={d}
              className={`calculator__btn${d === '0' ? ' calculator__btn--wide' : ''}`}
              onClick={() => handleDigit(d)}
            >
              {d}
            </button>
          ))}
          <button
            className="calculator__btn"
            onClick={handleDecimal}
          >
            .
          </button>
          <button
            className="calculator__btn calculator__btn--equals"
            onClick={handleEquals}
          >
            =
          </button>
        </div>
      </div>
      <div className={`sidebar${isPanelOpen ? ' sidebar--open' : ''}`}>
        <HistoryPanel onReplay={handleReplay} newEntry={newEntry} />
      </div>
    </div>
  );
}
