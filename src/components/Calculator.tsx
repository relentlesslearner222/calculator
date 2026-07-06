import { useReducer } from 'react';
import { calculatorReducer, initialState } from '../state/calculatorReducer';
import Display from './Display';
import Button from './Button';

function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <div
      style={{
        backgroundColor: '#000',
        borderRadius: '44px',
        padding: '24px 16px 16px',
        width: '320px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      }}
    >
      <Display value={state.displayValue} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 72px)',
          gap: '12px',
          marginTop: '16px',
          justifyContent: 'center',
        }}
      >
        {/* Row 1 */}
        <Button label="C" variant="action" onClick={() => dispatch({ type: 'CLEAR' })} />
        <Button label="+/-" variant="action" onClick={() => {
          const val = parseFloat(state.displayValue);
          if (!isNaN(val)) {
            dispatch({ type: 'DIGIT', payload: String(-val) });
          }
        }} />
        <Button label="%" variant="action" onClick={() => dispatch({ type: 'PERCENT' })} />
        <Button label="÷" variant="operator" onClick={() => dispatch({ type: 'OPERATOR', payload: '/' })} />

        {/* Row 2 */}
        <Button label="7" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '7' })} />
        <Button label="8" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '8' })} />
        <Button label="9" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '9' })} />
        <Button label="×" variant="operator" onClick={() => dispatch({ type: 'OPERATOR', payload: '*' })} />

        {/* Row 3 */}
        <Button label="4" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '4' })} />
        <Button label="5" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '5' })} />
        <Button label="6" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '6' })} />
        <Button label="−" variant="operator" onClick={() => dispatch({ type: 'OPERATOR', payload: '-' })} />

        {/* Row 4 */}
        <Button label="1" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '1' })} />
        <Button label="2" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '2' })} />
        <Button label="3" variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '3' })} />
        <Button label="+" variant="operator" onClick={() => dispatch({ type: 'OPERATOR', payload: '+' })} />

        {/* Row 5 */}
        <Button label="0" variant="digit" wide onClick={() => dispatch({ type: 'DIGIT', payload: '0' })} />
        <Button label="." variant="digit" onClick={() => dispatch({ type: 'DIGIT', payload: '.' })} />
        <Button label="=" variant="equals" onClick={() => dispatch({ type: 'EQUALS' })} />
      </div>
    </div>
  );
}

export default Calculator;
