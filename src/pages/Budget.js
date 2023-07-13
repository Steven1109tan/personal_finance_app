import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AddBudgetModal from "../components/budget/AddBudgetModal";
import EditBudgetModal from "../components/budget/EditBudgetModal";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import ViewExpensesModal from "../components/expense/ViewExpensesModal";
import BudgetCard from "../components/budget/BudgetCard";
import UncategorizedBudgetCard from "../components/budget/UncategorizedBudgetCard";
import TotalBudgetCard from "../components/budget/TotalBudgetCard";
import { useState } from "react";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext";
import Navbar from "../components/Navbar";

function Budget() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [editedBudget, setEditedBudget] = useState(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState();
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState();
  const { budgets, getBudgetExpenses, deleteBudget } = useBudgets();

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true);
    setAddExpenseModalBudgetId(budgetId);
  }

  function openEditBudgetModal(budget) {
    setEditedBudget(budget);
    setShowEditBudgetModal(true);
  }

  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Budgets</h1>
          <Button variant="success" onClick={() => setShowAddBudgetModal(true)}>
            Add Budget
          </Button>
          <Button variant="outline-success" onClick={openAddExpenseModal}>
            Add Expense
          </Button>
        </Stack>
        <div className="d-flex flex-column gap-3">
          <div className="row g-3">
            {budgets.map((budget) => {
              const amount = getBudgetExpenses(budget.id).reduce(
                (total, expense) => total + expense.amount,
                0
              );
              return (
                <div className="col-12 col-sm-6 col-md-4">
                  <BudgetCard
                    key={budget.id}
                    name={budget.name}
                    amount={amount}
                    max={budget.max}
                    onAddExpense={() => openAddExpenseModal(budget.id)}
                    onViewExpenses={() => setViewExpensesModalBudgetId(budget.id)}
                    onDeleteBudget={() => deleteBudget(budget.id)}
                    onEditBudget={() => openEditBudgetModal(budget)}
                  />
                </div>
              );
            })}
            <div className="col-12 col-sm-6 col-md-4">
              <UncategorizedBudgetCard
                onAddExpense={openAddExpenseModal}
                onViewExpenses={() => setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)}
              />
            </div>
          </div>
          <TotalBudgetCard />
        </div>
      </Container>
      <AddBudgetModal show={showAddBudgetModal} handleClose={() => setShowAddBudgetModal(false)} />
      <EditBudgetModal
        show={showEditBudgetModal}
        value={editedBudget}
        handleClose={() => {
          setShowEditBudgetModal(false);
          setEditedBudget(null);
        }}
      />
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

export default Budget;
