import { Button, Card, ProgressBar, Stack } from "react-bootstrap";
import { currencyFormatter } from "../../utils";
import MenuButton from "../MenuButton";
import { FaCog } from "react-icons/fa";

export default function BudgetCard({
  name,
  amount,
  max,
  gray,
  hideButtons,
  onAddExpense,
  onViewExpenses,
  onDeleteBudget,
  onEditBudget,
  className
}) {
  let classNames = [];

  if (amount > max) classNames = [...classNames, "bg-danger", "bg-opacity-10"];
  else if (gray) classNames = [...classNames, "bg-light"];

  const percentage = (amount / max) * 100;

  return (
    <Card className={`${classNames.join(" ")} h-100`}>
      <Card.Body style={{ minHeight: "110px" }} className="d-flex h-100 w-100 flex-column">
        <div className="d-flex flex-column justify-content-between flex-grow-1">
          <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
            <div className="me-2">{name}</div>

            {!hideButtons && (
              <MenuButton
                items={{
                  "Add Expense": onAddExpense,
                  "View Expenses": onViewExpenses,
                  "Edit Budget": onEditBudget,
                  "Delete Budget": onDeleteBudget,
                }}
              >
                <FaCog size={12} />
              </MenuButton>
            )}
          </Card.Title>
          {max && (
            <ProgressBar
              className="rounded-pill mb-3"
              variant={getProgressBarVariant(amount, max)}
              min={0}
              max={max}
              now={amount}
              label={percentage.toFixed(2) + "%"}
            />
          )}
        </div>
        <div className="d-flex align-items-baseline justify-content-end">
          {currencyFormatter.format(amount)}
          {max && <span className="text-muted fs-6 ms-1">/ {currencyFormatter.format(max)}</span>}
        </div>
      </Card.Body>
    </Card>
  );
}

function getProgressBarVariant(amount, max) {
  const ratio = amount / max;
  if (ratio < 0.5) return "primary";
  if (ratio < 0.75) return "warning";
  return "danger";
}
