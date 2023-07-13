import { Form, Modal, Button } from "react-bootstrap";
import { useRef } from "react";
import { useBudgets } from "../../contexts/BudgetsContext";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AddGoalModal({ show, handleClose }) {
  const nameRef = useRef();
  const maxRef = useRef();
  const dateRef = useRef();
  const { addGoal } = useBudgets();

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  const minDate = yyyy + "-" + mm + "-" + dd;

  async function handleSubmit(e) {
    e.preventDefault();
    addGoal({
      name: nameRef.current.value,
      max: parseFloat(maxRef.current.value),
      date: dateRef.current.value,
    });
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>New Saving Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Title</Form.Label>
            <Form.Control ref={nameRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Target Amount</Form.Label>
            <Form.Control ref={maxRef} type="number" required min={0} step={1} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Expected Date</Form.Label>
            <Form.Control ref={dateRef} type="date" min={minDate} required />
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
