import { Button, Card, ProgressBar, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Fragment, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { FaGrinWink, FaFrown } from "react-icons/fa";

import { checkActionCode, reauthenticateWithPopup } from "firebase/auth";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import HealthCheckFormModal from "../components/healthCheck/HealthCheckFormModal";
import { useBudgets } from "../contexts/BudgetsContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const recommendation = [
  (v, p) =>
    v ? (
      <div>
        This ratio represents your ability to deal with an emergency. The emergency fund is a savings account
        expressly designated for unanticipated needs, after checking your current ratio value is{" "}
        <span style={{ color: "red" }}>{p} months</span> this represent you have enough emergency funds{" "}
        <span style={{ color: "red" }}>({p} MONTH )</span>.
      </div>
    ) : (
      <div>
        This ratio represents your ability to deal with an emergency. The emergency fund is a savings account
        expressly designated for unanticipated needs, after checking your current ratio value is{" "}
        <span style={{ color: "red" }}>{p} months</span> this represent you don't have enough emergency
        funds。
      </div>
    ),
  (v, p) =>
    v ? (
      <div>
        This ratio counts your actual net worth, after checking your net worth is{" "}
        <span style={{ color: "red" }}> RM {p}</span>. This means you have more assets than liabilities, which
        is good.
      </div>
    ) : (
      <div>
        This ratio counts your actual net worth, after checking your net worth is RM{" "}
        <span style={{ color: "red" }}>${p}</span> . This means you have more liabilities than your assets. Be
        aware and control your liabilities.
      </div>
    ),
  (v, p) =>
    v ? (
      <div>
        This ratio calculates the percentage of your assets that are cash or cash equivalents. It also tells
        you if you are in an "asset-rich, cash-poor" situation. After checking, your ratio value is{" "}
        <span style={{ color: "red" }}>{p} %</span>. This means <span style={{ color: "red" }}>{p} %</span> of
        your net worth belongs to cash or cash equivalents assets, which is acceptable, you have a larger
        buffer against temporary income loss. But do remember that if the ratio is over 50% , that would be
        too high, which can be an indicator of a lack of diversification in an individual's portfolio and
        could imply missing out on potential returns from long-term investments.
      </div>
    ) : (
      <div>
        This ratio calculates the percentage of your assets that are cash or cash equivalents. It also tells
        you if you are in a "asset-rich, cash-poor" situation. After checking, your ratio value is{" "}
        <span style={{ color: "red" }}>{p} %</span>. This means <span style={{ color: "red" }}>{p} %</span> of
        your net worth belongs to cash, which is too low, you might not be able to cover short-term debt
        obligations or other emergency scenarios because of the shortage of cash or cash equivalents assets.
      </div>
    ),
  (v, p) =>
    v ? (
      <div>
        This ratio reveals how much of your net income goes towards servicing debt, after checking your debt
        servicing ratio is <span style={{ color: "red" }}> {p}%</span> , this means{" "}
        <span style={{ color: "red" }}>{p}% </span>
        of your income is used to pay debt, which is accepatble but remember that the lower the better..
      </div>
    ) : (
      <div>
        This ratio reveals how much of your net income goes towards servicing debt, after checking your debt
        servicing ratio is <span style={{ color: "red" }}> {p}%</span> , this means{" "}
        <span style={{ color: "red" }}>{p}%</span> of your income is used to pay debt, which is too much.
      </div>
    ),
  (v, p) =>
    v ? (
      <div>
        This ratio reveals how much is coming in vs going out of your accounts each month, after checking you
        personal cash flow per month is <span style={{ color: "red" }}>RM {p}</span> .This represents you have
        a positive cash flow in this (month) which is healthy.
      </div>
    ) : (
      <div>
        This ratio reveals how much is coming in vs going out of your accounts each month, after checking you
        personal cash flow per month is <span style={{ color: "red" }}>RM {p}</span> .This represents you have
        a negative cash flow in this (month) which is not healthy.You should start budgeting and control your
        expenses.
      </div>
    ),
];

const advices = [
  (p) => (
    <div>
      <p>
        {" "}
        After checking your Emergency Funds Ratio are <span style={{ color: "red" }}> {p} months </span>,
        which is not healthy. You should start saving for emergencies and we suggest your emergency funds
        should cover at least 6 months of your monthly living expenses.
      </p>
      <h5> Quick steps to do:</h5>
      <ul>
        <li>Step 1: Go to the analytics page of this app to check how much you spend a month.</li>
        <li>
          Step 2: Add a saving goal named as "Emergency funds" in our app and set the goal as the amount you
          need.
        </li>
        <li>Step 3: Start saving!</li>
      </ul>
    </div>
  ),
  (p) => (
    <div>
      After checking, your Net worth is <span style={{ color: "red" }}>RM {p}</span>, your debt is more than
      your asset. You should start to control your debt, don’t add more loans recently, and be aware when you
      make your next big purchases on other assets by loan.
    </div>
  ),
  (p) => (
    <div>
      <p>
        After checking, you don’t have enough cash or cash equivalent assets in your net worth portfolio and
        might not be able to cover short-term debt obligations or other emergency scenarios.{" "}
      </p>
      <ul>
        <li>
          Determine which assets are illiquid and assess opportunities to convert some into liquid assets.
        </li>
        <li>
          Increase liquid assets by building up cash reserves or maintaining higher balances in
          checking/savings accounts.
        </li>
        <li>
          Consider reallocating investments from illiquid assets to more liquid ones, like easily tradable
          securities.
        </li>
        <li>
          Review and adjust your investment portfolio to include more liquid assets such as stocks or bonds.
        </li>
        <li>Implement effective cash flow management practices, including budgeting and expense tracking.</li>
        <li>
          Optimize your income sources to ensure sufficient funds for everyday expenses and emergencies.
        </li>
      </ul>
    </div>
  ),
  (p) => (
    <div>
      After checking , <span style={{ color: "red" }}> {p}% </span>of your net income is used to pay debt
      monthly, which is too much.
      <ul>
        <li>
          {" "}
          Start to control or reduce your monthly debt. Determine which debts have the highest interest rates
          or the most severe consequences for non-payment. Prioritize these debts and allocate more of your
          resources towards paying them off first. Additionally, consider consolidating multiple debts into a
          single loan or credit facility with more favorable terms, such as lower interest rates or longer
          repayment periods.
        </li>
        <li>
          {" "}
          Increase your income or income sources. Explore opportunities to boost your income, such as taking
          on a part-time job or freelance work, starting a side business, or seeking a promotion or raise in
          your current job. The additional income can be dedicated towards debt repayment, improving your debt
          servicing ratio.
        </li>
        <li>
          {" "}
          Review your budget to sssess your income and expenses to gain a clear understanding of your
          financial situation. Create a detailed budget that accounts for all your income sources and
          accurately tracks your expenses. Identify areas where you can reduce discretionary spending and
          allocate more funds toward debt repayment.
        </li>
        <li>
          {" "}
          Identify expenses that are not essential and consider cutting back on them. This could include
          reducing dining out, entertainment expenses, subscriptions, or non-essential purchases. Redirect the
          money saved towards debt repayment.
        </li>
      </ul>
    </div>
  ),
  (p) => (
    <div>
      <p>
        {" "}
        After checking, you have a negative cash flow <span style={{ color: "red" }}> (RM {p} ) </span> so
        far, which is not healthy. Start to record the expenses and use budgeting tools from us to get back
        control of your money.
      </p>
      <ol>
        <li>Create budgets based on your daily needs and categorize them.</li>
        <li>Set a budget for each category.</li>
        <li>Start recording your expenses when you spend your money.</li>
        <li>Go to the analytics page to view how you spend your money then cut the unneccesary expenses.</li>
      </ol>
    </div>
  ),
];

function Check() {
  const [showHealthCheckFormModal, setShowHealthCheckFormModal] = useState(false);
  const [ratios, setRatios] = useState([]);
  const { monthlyExpense } = useBudgets();

  const data = useMemo(() => {
    const totalPositive = ratios.filter(({ value }) => value).length;

    return {
      labels: ["Unhealthy", "Healthy"],
      datasets: [
        {
          data: [ratios.length - totalPositive, totalPositive],
          backgroundColor: ["red", "green"],
        },
      ],
    };
  }, [ratios]);

  const options = {};

  const handleClose = () => setShowHealthCheckFormModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const toData = (options, pFunc, condition, ...v) => ({
      ...options,
      value: condition(pFunc(...v.map((e) => parseFloat(e)))),
      percentage: pFunc(...v.map((e) => parseFloat(e))),
    });
    const sum = (...v) =>
      v.reduce((total, v) => parseFloat(total) + parseFloat(v.hasOwnProperty("value") ? v.value : v), 0);

    const {
      emerFund: ef,
      propValue,
      cashAmount,
      bankSavings,
      eWalletBalance,
      investAmount,
      vehicle,
    } = e.target ?? {};
    const totalCash = sum(cashAmount, bankSavings, eWalletBalance);
    console.log(propValue, totalCash, investAmount, vehicle);
    const totalAssets = sum(propValue, totalCash, investAmount, vehicle);
    const { mortgages, carLoan, cardDebt, othersLoan, income, monthlyLoanPayment } = e.target ?? {};
    const totalLia = sum(mortgages, carLoan, cardDebt, othersLoan);

    localStorage.setItem(
      "healthCheck",
      JSON.stringify({
        vehicle: vehicle.value,
        bankSavings: bankSavings.value,
        eWalletBalance: eWalletBalance.value,
        monthlyLoanPayment: monthlyLoanPayment.value,
        emerFund: ef.value,
        propValue: propValue.value,
        cashAmount: cashAmount.value,
        investAmount: investAmount.value,
        mortgages: mortgages.value,
        carLoan: carLoan.value,
        cardDebt: cardDebt.value,
        othersLoan: othersLoan.value,
        income: income.value,
      })
    );

    setRatios([
      toData(
        { label: "Emergency fund Ratio", unit: "months", digit: 0 },
        (emerFund, monthlyexpenses) => Math.round(emerFund / monthlyexpenses),
        (v) => v >= 6,
        ef.value,
        monthlyExpense
      ),
      toData(
        { label: "Net Worth Ratio", unit: "RM" },
        (TotalAssets, TotalLia) => TotalAssets - TotalLia,
        (v) => v > 0,
        totalAssets,
        totalLia
      ),
      toData(
        { label: "Liquid Asset to Net Worth Ratio", unit: "%" },
        (cash, investment, networth) => (cash + investment) / networth,
        (v) => v >= 15,
        totalCash,
        investAmount.value,
        totalAssets - totalLia
      ),
      toData(
        { label: "Debt Servicing Ratio", unit: "%" },
        (debt, monthlyIncome) => (debt / monthlyIncome) * 100,
        (v) => v <= 50,
        monthlyLoanPayment.value,
        income.value
      ),
      toData(
        { label: "Personal Cash Flow Ratio", unit: "RM" },
        (monthlyIncome, monthlyexpenses) => monthlyIncome - monthlyexpenses,
        (v) => v > 0,
        income.value,
        monthlyExpense
      ),
    ]);
    handleClose();
  };

  return (
    <>
      <Navbar />
      <Container className="my-4">
        <h1 className="me-auto">Personal Financial Health Checking</h1>
        {/* //  <Button variant="success" onClick={() => setShowAddBudgetModal(true)}>  */}
        <Button variant="success" onClick={() => setShowHealthCheckFormModal(true)}>
          Start Check
        </Button>
        {ratios.length > 0 ? (
          <>
            <div
              style={{
                marginTop: "20px",
                display: "grid",
                //gap: "1rem",
                alignItems: "flex-start",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingBottom: "20px",
              }}
            >
              <h3> Results: </h3>
              <div className="row">
                <div style={{ fontSize: "20px", padding: "10px" }} className="col-5 col-sm-7">
                  Ratio
                </div>
                <div style={{ fontSize: "20px", padding: "10px" }} className="col-3 col-sm-2 text-center">
                  Pass/Fail
                </div>
                <div style={{ fontSize: "20px", padding: "10px" }} className="col-4 col-sm-3">
                  Result
                </div>
              </div>
              {ratios.map(({ label, value, percentage, unit, digit = 2 }, index) => (
                <Fragment key={`ratioRes${index}`}>
                  <hr></hr>
                  {/* ratio1 */}

                  <div className="row">
                    <div style={{ fontSize: "20px", padding: "10px" }} className="col-5 col-sm-7">
                      Ratio {index + 1}: {label}
                    </div>
                    <div className="d-flex align-items-center justify-content-center col-3 col-sm-2">
                      {value ? (
                        <FaGrinWink size="40px" color="green" className="my-icon mt-1" />
                      ) : (
                        <FaFrown size="40px" color="red" className="my-icon mt-1" />
                      )}
                    </div>
                    <div
                      style={{ color: "black", fontWeight: "bold", fontSize: "20px" }}
                      className="my-icon col-4 col-sm-3 d-flex align-items-center"
                    >
                      {unit == "RM" && unit} {percentage.toFixed(digit)} {unit != "RM" && unit}
                    </div>
                  </div>
                  <div className="bg-light mt-3 mb-1 w-80 px-3 py-2 rounded">
                    {recommendation[index](value, percentage.toFixed(digit))}
                  </div>
                </Fragment>
              ))}
              <hr></hr>
            </div>

            <div
              style={{
                marginTop: "20px",
                display: "grid",
                gap: "1rem",
                alignItems: "flex-start",
                border: "2px solid #969696",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <h3> Tips: </h3>
              <div
                style={{
                  maxWidth: "50%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Pie data={data} options={options}></Pie>
              </div>

              <p style={{ fontWeight: "bold", fontSize: "20px" }}>Failed ratio advices:</p>
              {<RatioRecommendation ratios={ratios} isPositive={false} />}
            </div>
          </>
        ) : (
          <div>
            <br></br>
            <p>
              This function is to allow you check your personal finance from many aspect, allow you to knowing
              your own finnancial status and get tips and advices to improve it!{" "}
            </p>
            <p>Instruction :</p>
            <p>Easy steps to use this feature.</p>
            <p>Step 1: Click the "Start Check" button.</p>
            <p>Step 2: Fill in every fields of the pop up form.</p>
            <p>Step 3: Click "Save button" at the end.</p>
            <p>Step 4: View your personal finance health result and tips.</p>
            <p></p>
          </div>
        )}
      </Container>
      <HealthCheckFormModal
        show={showHealthCheckFormModal}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Check;

const RatioRecommendation = ({ ratios, isPositive = true }) => {
  const arr = ratios.filter(({ value }) => value === isPositive);
  return arr.map(({ label, value, percentage, digit }, i) => {
    const index = ratios.findIndex(({ label: l }) => l == label);
    return (
      <Fragment key={`ratioRec${index}`}>
        <p style={{ fontWeight: "bold" }} className="mb-0">
          Ratio {index + 1}: {label}:
        </p>
        <div className="bg-light mb-1 w-80 px-3 py-2 rounded">
          <p>{advices[index](percentage.toFixed(digit))}</p>
        </div>
        {i + 1 != arr.length && <hr className="m-0" />}
      </Fragment>
    );
  });
};
