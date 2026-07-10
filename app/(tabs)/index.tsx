import { useEffect, useRef } from 'react';
import { CalculatorProvider, useCalculator, useHistory } from '@/presentation/providers';
import { ScreenLayout } from '@/presentation/templates';
import { CalculatorLayout } from '@/presentation/templates';

function CalculatorWithHistory() {
  const { state, dispatch } = useCalculator();
  const { addEntry, consumePendingLoad } = useHistory();
  const lastExpr = useRef('');
  const loaded = useRef(false);

  useEffect(() => {
    const expr = state.expression;
    if (
      expr &&
      expr !== lastExpr.current &&
      expr.includes('=') &&
      !state.error &&
      state.operator === null
    ) {
      lastExpr.current = expr;
      const operation = expr.replace(/=$/, '').trim();
      addEntry(operation, state.displayValue);
    }
  }, [state.expression, state.displayValue, state.error, state.operator, addEntry]);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const pending = consumePendingLoad();
    if (pending !== null) {
      dispatch({ type: 'SET_DISPLAY_VALUE', value: pending });
    }
  }, [consumePendingLoad, dispatch]);

  return (
    <ScreenLayout>
      <CalculatorLayout />
    </ScreenLayout>
  );
}

export default function HomeScreen() {
  return (
    <CalculatorProvider>
      <CalculatorWithHistory />
    </CalculatorProvider>
  );
}
