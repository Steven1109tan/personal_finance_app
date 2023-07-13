import { useEffect, useMemo, useState } from "react";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../../contexts/BudgetsContext";
import BudgetCard from "./BudgetCard";

export default function UncategorizedBudgetCard(props) {
  const { expenses, loading, budgets } = useBudgets();

  const amount = useMemo(() => {
    let amount = 0;
    const budgetIds = budgets.map(({ id }) => id);
    for (let expense of expenses) {
      if (!budgetIds.includes(expense.budgetId)) amount += expense.amount;
    }
    return amount;
  }, [expenses, budgets]);

  return <BudgetCard amount={amount} name="Uncategorized" gray {...props} />;
}
