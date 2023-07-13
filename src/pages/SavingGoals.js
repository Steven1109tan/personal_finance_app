import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AddGoalModal from "../components/goal/AddGoalModal";
import AddGoalDetailModal from "../components/goal/AddGoalDetailModal";
import ViewGoalDetailsModal from "../components/goal/ViewGoalDetailsModal";
import GoalCard from "../components/goal/GoalCard";
import { useState } from "react";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext";
import Navbar from "../components/Navbar";
import EditGoalModal from "../components/goal/EditGoalModal";

function SavingGoals() {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [editedValue, setEditedValue] = useState(null);
  const [showAddGoalDetailModal, setShowAddGoalDetailModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState();
  const { goals, getGoalDetails, deleteGoal, editGoal } = useBudgets();

  function openAddSavingModal(goal) {
    setShowAddGoalDetailModal(true);
    setEditedValue(goal);
  }

  function openEditGoalModal(goal) {
    setShowEditGoalModal(true);
    setEditedValue(goal);
  }

  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Saving Goals</h1>
          <Button variant="success" onClick={() => setShowAddGoalModal(true)}>
            Add Goals
          </Button>
        </Stack>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          {goals.map((goal) => {
            const amount = goal.savings.reduce((total, goalDetail) => total + goalDetail.amount, 0);
            return (
              <GoalCard
                key={goal.id}
                name={goal.name}
                amount={amount}
                max={goal.max}
                date={goal.date}
                onAddSaving={() => openAddSavingModal(goal)}
                onViewDetails={() => setViewDetailsModal(goal.id)}
                onEditGoal={() => openEditGoalModal(goal)}
                onDeleteGoal={() => deleteGoal(goal.id)}
              />
            );
          })}
        </div>
      </Container>
      <AddGoalModal show={showAddGoalModal} handleClose={() => setShowAddGoalModal(false)} />
      <EditGoalModal
        show={showEditGoalModal}
        value={editedValue}
        handleClose={() => {
          setShowEditGoalModal(false);
          setEditedValue(null);
        }}
      />
      <AddGoalDetailModal
        show={showAddGoalDetailModal}
        value={editedValue}
        handleClose={() => {
          setShowAddGoalDetailModal(false);
          setEditedValue(null);
        }}
      />
      <ViewGoalDetailsModal goalId={viewDetailsModal} handleClose={() => setViewDetailsModal()} />
    </>
  );
}

export default SavingGoals;
