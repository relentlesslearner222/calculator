import { useCalculator } from '../../hooks/useCalculator.js';
import { ACTIONS } from '../../engine/calculatorReducer.js';
import Display from '../Display/Display.jsx';
import ButtonGrid from '../ButtonGrid/ButtonGrid.jsx';
import ModeToggle from '../ModeToggle/ModeToggle.jsx';
import AngleToggle from '../AngleToggle/AngleToggle.jsx';
import styles from './Calculator.module.css';

export default function Calculator() {
  const { state, dispatch } = useCalculator();

  function handleSetMode(mode) {
    dispatch({ type: ACTIONS.SET_MODE, payload: mode });
  }

  function handleSetAngleUnit(unit) {
    dispatch({ type: ACTIONS.SET_ANGLE_UNIT, payload: unit });
  }

  return (
    <main className={styles.calculator} aria-label="Calculator">
      <div className={styles.topBar}>
        <ModeToggle mode={state.mode} onSetMode={handleSetMode} />
        {state.mode === 'scientific' && (
          <AngleToggle angleUnit={state.angleUnit} onSetAngleUnit={handleSetAngleUnit} />
        )}
      </div>
      <Display expression={state.expression} display={state.display} />
      <ButtonGrid mode={state.mode} dispatch={dispatch} activeKey={state.activeKey} />
    </main>
  );
}
