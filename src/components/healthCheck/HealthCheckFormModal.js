import { useMemo, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function HealthCheckFormModal({ show, handleSubmit, handleClose }) {
  const defaultValues = useMemo(() => JSON.parse(localStorage.getItem("healthCheck")) ?? {}, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Financial Health Check</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormHeader>Assets session:</FormHeader>
          <FormSubheader>(simply answer the question to help you calculate the asset you have)</FormSubheader>
          <FormTextField
            label="Fixed Properties"
            hint="Please enter the total value of your fixed properties, including lands, houses, apartments, and condos."
            defaultValues={defaultValues}
            name="propValue"
          />
          <FormTextField
            label="Vehicles"
            hint="Please enter the total value of your vehicles, including cars, motorcycles, and other vehicles."
            defaultValues={defaultValues}
            name="vehicle"
          />

          <Form.Label>Cash and Savings</Form.Label>
          <div className="border p-3 rounded mb-3 pb-0">
            <div className="d-flex gap-3 align-items-center">
              <div className="mb-3" style={{ width: "200px" }}>
                Cash:
              </div>
              <FormTextField
                defaultValues={defaultValues}
                hint="Please enter the total amount of cash you have on hand."
                name="cashAmount"
                style={{ width: "100%" }}
              />
            </div>
            <div className="d-flex gap-3 align-items-center">
              <div className="mb-3" style={{ width: "200px" }}>
                Bank Savings:
              </div>
              <FormTextField
                defaultValues={defaultValues}
                hint="Please enter the total balance in your bank savings account."
                name="bankSavings"
                style={{ width: "100%" }}
              />
            </div>
            <div className="d-flex gap-3 align-items-center">
              <div className="mb-3" style={{ width: "200px" }}>
                eWallet Balance:
              </div>
              <FormTextField
                defaultValues={defaultValues}
                hint="Please enter the total balance in your eWallet account(s)."
                name="eWalletBalance"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Stocks, Mutual Funds, or Bonds */}
          <FormTextField
            label="Investment"
            hint="If you invest in stocks, mutual funds, or bonds, please enter the total invested amount. If not, enter 0."
            defaultValues={defaultValues}
            name="investAmount"
          />
          <FormHeader>Debts</FormHeader>
          <FormTextField
            label="Mortgages"
            hint="Please enter the total loan amount for your mortgage(s)."
            defaultValues={defaultValues}
            name="mortgages"
          />
          <FormTextField
            label="Car or Other Vehicle Loans"
            hint="Please enter the total amount of your car loan or loans for other vehicles. If none, enter 0."
            defaultValues={defaultValues}
            name="carLoan"
          />
          <FormTextField
            label="Credit Card Debt"
            hint="Please enter the total amount of your credit card debt."
            defaultValues={defaultValues}
            name="cardDebt"
          />
          <FormTextField
            label="Other Loans"
            hint="Please enter the total amount of your other loans, such as student loans or personal loans."
            defaultValues={defaultValues}
            name="othersLoan"
          />

          <FormHeader>Other Information</FormHeader>

          <FormTextField
            label="Monthly Loan Payment"
            hint="Please enter the total amount of your monthly loan payment, including mortgage and car loan payments. If none, enter 0."
            defaultValues={defaultValues}
            name="monthlyLoanPayment"
          />
          <FormTextField
            label="Emergency Fund"
            hint="Please enter the amount you have saved in your emergency fund."
            defaultValues={defaultValues}
            name="emerFund"
          />
          <FormTextField
            label="Monthly Income"
            hint="Please enter your total monthly income."
            defaultValues={defaultValues}
            name="income"
          />
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

const FormHeader = ({ children }) => {
  return <div className="fs-5 fw-bold mt-4">{children}</div>;
};

const FormSubheader = ({ children }) => {
  return <div className="text-secondary mb-2">{children}</div>;
};

const FormTextField = ({ label, hint, defaultValues, name, number = true, style }) => {
  return (
    <Form.Group className="mb-3" controlId={name} style={style}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        name={name}
        type={number ? "number" : "text"}
        required
        defaultValue={defaultValues[name]}
        placeholder={hint}
      />
    </Form.Group>
  );
};
