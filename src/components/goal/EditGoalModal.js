import { Form, Modal, Button } from "react-bootstrap";
import { useBudgets } from "../../contexts/BudgetsContext";

export default function EditGoalModal({ show, value, handleClose }) {
  const { editGoal } = useBudgets();

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
    editGoal(value.id, {
      name: e.target.name.value,
      max: parseFloat(e.target.max.value),
      date: e.target.date.value,
      savings: value?.savings ?? [],
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
            <Form.Control name="name" type="text" required defaultValue={value?.name} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Target Amount</Form.Label>
            <Form.Control name="max" type="number" required min={0} step={1} defaultValue={value?.max} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Expected Date</Form.Label>
            <Form.Control name="date" type="date" min={minDate} required defaultValue={value?.date} />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="success" type="submit">
              Save
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
