import { CalculatorProvider } from '@/presentation/providers';
import { ScreenLayout } from '@/presentation/templates';
import { CalculatorLayout } from '@/presentation/templates';

export default function HomeScreen() {
  return (
    <CalculatorProvider>
      <ScreenLayout>
        <CalculatorLayout />
      </ScreenLayout>
    </CalculatorProvider>
  );
}
