import { Display } from './Display';
import { CalcButton } from './CalcButton';
import { HistoryPanel } from './HistoryPanel';
import { useCalculator } from '../hooks/useCalculator';
import { useKeyboardInput } from '../hooks/useKeyboardInput';

export function Calculator() {
  const {
    state,
    appendDigit,
    appendOperator,
    appendFunction,
    appendConstant,
    decimal,
    equals,
    clear,
    clearHistory,
    backspace,
    toggleSign,
    toggleAngleMode,
    percent,
    memoryStore,
    memoryRecall,
    memoryClear,
    memoryAdd,
  } = useCalculator();

  useKeyboardInput({
    appendDigit,
    appendOperator,
    decimal,
    equals,
    clear,
    backspace,
    percent,
  });

  return (
    <div className="flex gap-4 w-full max-w-2xl mx-auto">
      <div
        className="w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden"
        role="application"
        aria-label="Scientific Calculator"
      >
        <Display
          expression={state.expression}
          display={state.display}
          angleMode={state.angleMode}
          memory={state.memory}
          isError={state.isError}
        />

        <div className="bg-gray-900 p-3 grid grid-cols-5 gap-2">
          {/* Row 1: Memory */}
          <CalcButton label="MC" variant="memory" onClick={memoryClear} ariaLabel="Memory Clear" />
          <CalcButton label="MR" variant="memory" onClick={memoryRecall} ariaLabel="Memory Recall" />
          <CalcButton label="M+" variant="memory" onClick={memoryAdd} ariaLabel="Memory Add" />
          <CalcButton label="MS" variant="memory" onClick={memoryStore} ariaLabel="Memory Store" />
          <CalcButton
            label={state.angleMode === 'deg' ? 'DEG' : 'RAD'}
            variant="function"
            onClick={toggleAngleMode}
            ariaLabel="Toggle angle mode"
            testId="btn-angle-mode"
          />

          {/* Row 2: Scientific functions */}
          <CalcButton label="sin" variant="function" onClick={() => appendFunction('sin')} />
          <CalcButton label="cos" variant="function" onClick={() => appendFunction('cos')} />
          <CalcButton label="tan" variant="function" onClick={() => appendFunction('tan')} />
          <CalcButton label="log" variant="function" onClick={() => appendFunction('log')} ariaLabel="log base 10" />
          <CalcButton label="ln" variant="function" onClick={() => appendFunction('ln')} ariaLabel="natural log" />

          {/* Row 3: More functions */}
          <CalcButton label="asin" variant="function" onClick={() => appendFunction('asin')} />
          <CalcButton label="acos" variant="function" onClick={() => appendFunction('acos')} />
          <CalcButton label="atan" variant="function" onClick={() => appendFunction('atan')} />
          <CalcButton label="√" variant="function" onClick={() => appendFunction('sqrt')} ariaLabel="square root" testId="btn-sqrt" />
          <CalcButton label="xʸ" variant="function" onClick={() => appendOperator('^')} ariaLabel="power" testId="btn-power" />

          {/* Row 4: Constants + x! + ( ) */}
          <CalcButton label="π" variant="function" onClick={() => appendConstant('π', 'π')} ariaLabel="pi" />
          <CalcButton label="e" variant="function" onClick={() => appendConstant('e', 'e')} ariaLabel="Euler's number" />
          <CalcButton label="x!" variant="function" onClick={() => appendOperator('!')} ariaLabel="factorial" testId="btn-factorial" />
          <CalcButton label="(" variant="function" onClick={() => appendOperator('(')} ariaLabel="open parenthesis" />
          <CalcButton label=")" variant="function" onClick={() => appendOperator(')')} ariaLabel="close parenthesis" />

          {/* Row 5: C, ±, %, ÷ */}
          <CalcButton label="C" variant="clear" onClick={clear} ariaLabel="Clear" testId="btn-clear" />
          <CalcButton label="±" variant="function" onClick={toggleSign} ariaLabel="Toggle sign" />
          <CalcButton label="%" variant="function" onClick={percent} ariaLabel="Percent" />
          <CalcButton label="⌫" variant="function" onClick={backspace} ariaLabel="Backspace" testId="btn-backspace" />
          <CalcButton label="÷" variant="operator" onClick={() => appendOperator('/')} ariaLabel="divide" testId="btn-divide" />

          {/* Row 6 */}
          <CalcButton label="7" variant="number" onClick={() => appendDigit('7')} />
          <CalcButton label="8" variant="number" onClick={() => appendDigit('8')} />
          <CalcButton label="9" variant="number" onClick={() => appendDigit('9')} />
          <div />{/* spacer */}
          <CalcButton label="×" variant="operator" onClick={() => appendOperator('*')} ariaLabel="multiply" testId="btn-multiply" />

          {/* Row 7 */}
          <CalcButton label="4" variant="number" onClick={() => appendDigit('4')} />
          <CalcButton label="5" variant="number" onClick={() => appendDigit('5')} />
          <CalcButton label="6" variant="number" onClick={() => appendDigit('6')} />
          <div />{/* spacer */}
          <CalcButton label="−" variant="operator" onClick={() => appendOperator('-')} ariaLabel="subtract" testId="btn-subtract" />

          {/* Row 8 */}
          <CalcButton label="1" variant="number" onClick={() => appendDigit('1')} />
          <CalcButton label="2" variant="number" onClick={() => appendDigit('2')} />
          <CalcButton label="3" variant="number" onClick={() => appendDigit('3')} />
          <div />{/* spacer */}
          <CalcButton label="+" variant="operator" onClick={() => appendOperator('+')} ariaLabel="add" testId="btn-add" />

          {/* Row 9 */}
          <CalcButton label="0" variant="number" wide onClick={() => appendDigit('0')} />
          <CalcButton label="." variant="number" onClick={decimal} ariaLabel="decimal point" />
          <div />{/* spacer */}
          <CalcButton label="=" variant="equals" onClick={equals} ariaLabel="equals" testId="btn-equals" />
        </div>
      </div>

      <div className="w-64 hidden md:block">
        <HistoryPanel entries={state.history} onClear={clearHistory} />
      </div>
    </div>
  );
}
