import { Form, Modal, Button } from "react-bootstrap";
import { useRef } from "react";
import { useBudgets } from "../../contexts/BudgetsContext";

export default function AddGoalDetailModal({ show, handleClose, value, defaultGoalId }) {
  const descriptionRef = useRef();
  const amountRef = useRef();
  const { addGoalDetail } = useBudgets();

  async function handleSubmit(e) {
    e.preventDefault();
    addGoalDetail(value, {
      description: descriptionRef.current.value,
      amount: parseFloat(amountRef.current.value),
    });
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>New Saving</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control ref={descriptionRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control ref={amountRef} type="number" required min={0} step={1} />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="success" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
