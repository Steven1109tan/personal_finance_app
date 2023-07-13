import { useState, useMemo } from "react";
import { Modal, Button, Stack } from "react-bootstrap";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../../contexts/BudgetsContext";
import { currencyFormatter } from "../../utils";
import EditGoalModal from "./EditGoalModal";

export default function ViewGoalDetailsModal({ goalId, handleClose }) {
  const { goals, deleteGoalDetail } = useBudgets();

  const goal = useMemo(() => goals?.find(({ id }) => id === goalId), [goals, goalId]);

  return (
    <Modal show={goalId != null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap="2">
            <div>Savings - {goal?.name}</div>
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap="3">
          {goal?.savings.map((goalDetail) => (
            <Stack direction="horizontal" gap="2" key={goalDetail.id}>
              <div className="me-auto fs-4">{goalDetail.description}</div>
              <div className="fs-5">{currencyFormatter.format(goalDetail.amount)}</div>
              <Button
                onClick={() => deleteGoalDetail(goalDetail.id, goal)}
                size="sm"
                variant="outline-danger"
              >
                &times;
              </Button>
            </Stack>
          ))}
        </Stack>
      </Modal.Body>
      {/* <EditGoalModal
        show={showEditGoalModal}
        goalId={goal}
        handleClose={() => setShowEditGoalModal(false)}
      /> */}
    </Modal>
  );
}
