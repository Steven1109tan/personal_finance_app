import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext";
import { Button, Card, Stack, ListGroup } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { currencyFormatter } from "../utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = [
  "#F7464A",
  "#46BFBD",
  "#FDB45C",
  "#949FB1",
  "#4ee5a3",
  "#ffc0d0",
  "#9592f5",
  "#511c0a",
  "#d35920",
];
// const randomColors = budgets.map(() => randomColor());

export default function Analytics() {
  const { expenses, budgets, loading } = useBudgets();
  const [SelectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [SelectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState(0);

  const [chartData, setChartData] = useState(null);

  const [listGroupData, setListGroupData] = useState([]);
  const [overviewData, setOverviewData] = useState(null);
  Chart.register(CategoryScale);
  Chart.register(LinearScale);
  Chart.register(PointElement);
  Chart.register(LineElement);
  Chart.register(BarElement);

  const getMonthYear = (time) => {
    const dateTime = time?.split(", ");
    const date = dateTime[0].split("/");
    const newDateTime = `${date[2]}-${date[1]}-${date[0]}T${dateTime[1]}`;
    const expenseDate = new Date(newDateTime);
    return [expenseDate.getMonth(), expenseDate.getFullYear()];
  };

  const buildChart = () => {
    let totalAmount = 0;
    let uncategorizedAmount = 0;
    const budgetNames = budgets.map(({ name }) => name);
    const budgetIds = budgets.map(({ id }) => id);
    expenses.forEach((expense) => {
      const [month, year] = getMonthYear(expense?.time);
      if (month === SelectedMonth && year === SelectedYear) {
        if (budgetIds?.includes(expense.budgetId)) {
          totalAmount += expense.amount;
        } else {
          uncategorizedAmount += expense.amount;
          totalAmount += expense.amount;
        }
      }
    });
    setAmount(totalAmount);
    const countPercentage = (amount, total) => {
      const _total = total ?? 0;
      if (_total === 0) return 0;
      return ((amount ?? 0) / _total) * 100;
    };

    let budgetAmounts = budgets.map((budget) => {
      let amount = 0;
      expenses.forEach((expense) => {
        if (expense.budgetId === budget.id) {
          const [month, year] = getMonthYear(expense?.time);
          if (month === SelectedMonth && year === SelectedYear) {
            amount += expense.amount;
          }
        }
      });
      return {
        name: budget.name,
        amount: amount,
        percentage: countPercentage(amount, totalAmount).toFixed(2),
      };
    });
    setListGroupData([
      ...budgetAmounts,
      {
        name: "Uncategorized",
        amount: uncategorizedAmount,
        percentage: countPercentage(uncategorizedAmount, totalAmount).toFixed(2),
      },
    ]);

    setChartData({
      labels: [...budgetNames, "Uncategorized"],
      datasets: [
        {
          data: [...budgetAmounts.map((budget) => budget.amount), uncategorizedAmount],
          backgroundColor: colors,
          hoverBackgroundColor: colors,
        },
      ],
    });
  };

  useEffect(async () => {
    if (!loading) {
      let obj = {};
      expenses.forEach((expense) => {
        const [month, year] = getMonthYear(expense?.time);
        obj = { ...obj, [`${month}/${year}`]: (obj[`${month}/${year}`] ?? 0) + expense.amount };
      });

      buildChart();

      console.log({
        labels: Object.entries(obj).map(([label]) => label),
        datasets: [
          {
            label: "Dataset 1",
            data: Object.entries(obj).map(([_, amount]) => amount),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });

      setOverviewData({
        labels: Object.entries(obj).map(([label]) => label),
        datasets: [
          {
            label: "Expanses",
            data: Object.entries(obj).map(([_, amount]) => amount),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });
    }
  }, [loading, SelectedMonth, SelectedYear]);

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    legend: {
      position: "right",
      align: "center",
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    center: [`Total: ${amount}`, 20],
  };

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const handlePreviousClick = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((v) => v - 1);
      setSelectedMonth(11);
      setSelectedYear((v) => v - 1);
    } else {
      setCurrentMonth((v) => v - 1);
      setSelectedMonth((v) => v - 1);
    }
  };

  const handleNextClick = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((v) => v + 1);
      setSelectedMonth(0);
      setSelectedYear((v) => v + 1);
    } else {
      setCurrentMonth((v) => v + 1);
      setSelectedMonth((v) => v + 1);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <Button variant="success" onClick={handlePreviousClick}>
            &lt;
          </Button>
          <h1 className="text-center">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </h1>
          <Button variant="success" onClick={handleNextClick}>
            &gt;
          </Button>
        </Stack>
        <div className="d-flex justify-content-center mb-4">
          <div style={{ width: "400px", height: "400px" }}>
            {chartData != null && <Doughnut data={chartData ?? {}} options={options} />}
          </div>
        </div>

        <Card>
          <Card.Body>
            <Card.Title>Total Expense</Card.Title>
            <Card.Text>{currencyFormatter.format(amount)}</Card.Text>
            <ListGroup>
              {listGroupData
                .sort((a, b) => b?.percentage - a?.percentage)
                .map((budgetAmount, index) => (
                  <ListGroup.Item key={index}>
                    {budgetAmount.name} - {"MYR " + budgetAmount?.amount ?? 0} -{" "}
                    {budgetAmount?.percentage ?? 0} %
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card.Body>
        </Card>

        <h2 className="text-center mt-5 mb-2">Expenses Overview</h2>
        <div className="d-flex justify-content-center">
          {overviewData != null && (
            <Bar className="w-75" data={overviewData ?? {}} options={{ responsive: true }} />
          )}
        </div>
      </Container>
    </>
  );
}
