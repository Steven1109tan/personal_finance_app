import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import ViewExpensesModal from "../components/expense/ViewExpensesModal";
import TotalBudgetCard from "../components/budget/TotalBudgetCard";
import { useEffect, useState } from "react";
import { useBudgets } from "../contexts/BudgetsContext";
import Navbar from "../components/Navbar";
import ExpenseCard from "../components/expense/ExpenseCard";
import "firebase/firestore";

function Expense() {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState();
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState();

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true);
    setAddExpenseModalBudgetId(budgetId);
  }

  const { expenses, budgets } = useBudgets();

  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Expense</h1>
          <Button variant="success" onClick={openAddExpenseModal}>
            Add Expense
          </Button>
        </Stack>
        <div className="d-flex gap-4 flex-column flex-sm-row">
          <div className="c-expenses">
            {expenses.map((expense) => (
              <ExpenseCard
                className="expenses"
                key={expense.id}
                id={expense.id}
                date={expense?.time?.split(",")[0]}
                budget={budgets.find(({ id }) => id == expense.budgetId)?.name ?? "Uncategorized"}
                desc={expense.description}
                amount={expense.amount}
              />
            ))}
          </div>
          <div className="w-100">
            <div>
              <TotalBudgetCard />
            </div>
          </div>
        </div>
      </Container>
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
      />

      <ViewExpensesModal
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId()}
      />
    </>
  );
}

export default Expense;
