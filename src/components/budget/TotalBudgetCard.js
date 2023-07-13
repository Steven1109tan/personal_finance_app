import { useBudgets } from "../../contexts/BudgetsContext";
import BudgetCard from "./BudgetCard";

export default function TotalBudgetCard() {
  const { totalExpense, budgets } = useBudgets();
  const max = budgets.reduce((total, budget) => total + budget.max, 0);

  return <BudgetCard amount={totalExpense ?? 0} name="Total" gray max={max ?? 0} hideButtons />;
}
