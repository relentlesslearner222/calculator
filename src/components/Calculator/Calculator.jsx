import Display from '../Display/Display.jsx';
import ButtonGrid from '../ButtonGrid/ButtonGrid.jsx';
import ModeToggle from '../ModeToggle/ModeToggle.jsx';
import AngleToggle from '../AngleToggle/AngleToggle.jsx';
import { useCalculator } from '../../hooks/useCalculator.js';
import { ACTIONS } from '../../engine/calculatorReducer.js';
import styles from './Calculator.module.css';

export default function Calculator() {
  const { state, dispatch } = useCalculator();

  return (
    <div className={styles.shell} role="main" aria-label="Calculator">
      <header className={styles.header}>
        <ModeToggle
          mode={state.mode}
          onToggle={(m) => dispatch({ type: ACTIONS.SET_MODE, payload: m })}
        />
        {state.mode === 'scientific' && (
          <AngleToggle
            angleUnit={state.angleUnit}
            onToggle={(u) => dispatch({ type: ACTIONS.SET_ANGLE_UNIT, payload: u })}
          />
        )}
      </header>
      <Display expression={state.expression} display={state.display} />
      <div className={styles.body}>
        <ButtonGrid mode={state.mode} dispatch={dispatch} activeKey={state.activeKey} />
      </div>
    </div>
  );
}
