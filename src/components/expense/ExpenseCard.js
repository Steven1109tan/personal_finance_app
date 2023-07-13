import { Button, Card } from "react-bootstrap";
import { currencyFormatter } from "../../utils";
import { useBudgets } from "../../contexts/BudgetsContext";
import { FaTrash } from "react-icons/fa";

export default function ExpenseCard({ id, date, name, desc, budget, amount }) {
  const { deleteExpense } = useBudgets();
  return (
    <Card>
      <Card.Body>
        <div>
          <Card.Title
            className="d-flex justify-content-between w-100 align-item-center"
            style={{ minHeight: "30px" }}
          >
            <div>
              <div>{name}</div>
              <div style={{ fontWeight: "bold" }}>{date}</div>
            </div>
            <Button size="sm" variant="danger" onClick={() => deleteExpense(id)} className="d-flex py-2">
              <FaTrash size={12} />
            </Button>
          </Card.Title>
          <div className="d-flex flex-column">
            <div>{"Description : " + desc}</div>
            <div>{"Budget : " + budget}</div>
            <div className="d-flex justify-content-end fs-5">{currencyFormatter.format(amount)}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
