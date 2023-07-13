import React, { useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { db, getDocuments } from "../firebase";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { random6digit } from "../components/budget/AddBudgetModal";
import { useAuth } from "./AuthContext";

const time = new Date().toLocaleString();

const BudgetsContext = React.createContext();

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized";

export const useBudgets = () => useContext(BudgetsContext);

export const BudgetsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [goalDetails, setGoalDetails] = useState([]);
  const { currentUser } = useAuth();
  const [lastUserId, setLastUserId] = useState();
  useEffect(() => {
    if (currentUser?.uid && lastUserId != currentUser?.uid) {
      fetchData();
      setLastUserId(currentUser?.uid);
    }
  }, [currentUser]);

  const fetchData = async () => {
    await getExpense();
    await getBudget();
    await getGoal();
    setLoading(false);
  };

  // BUDGET =================================================================

  const getTotalBudget = useMemo(() => budgets.reduce((total, budget) => total + budget.max, 0), [budgets]);
  const getBudgetExpenses = (budgetId) => expenses.filter((expense) => expense.budgetId === budgetId);

  const getBudget = async () => setBudgets(await getDocuments("budgets", currentUser.uid));

  const addBudget = async ({ name, max }) => {
    await setDoc(doc(db, "budgets", random6digit()), {
      time: new Date().toLocaleString(),
      name,
      max,
      userId: currentUser.uid,
    });
    await getBudget();
  };

  const editBudget = async (id, { name, max }) => {
    await updateDoc(doc(db, "budgets", id), { name, max });
    await getBudget();
  };

  const deleteBudget = async (id) => {
    await deleteDoc(doc(db, "budgets", id));
    await getBudget();
  };

  const _budget = { getBudget, getBudgetExpenses, getTotalBudget, addBudget, editBudget, deleteBudget };

  // GOAL =================================================================

  const getGoal = async () => setGoals(await getDocuments("goals", currentUser.uid));
  const getGoalDetails = (goalDetailsId) =>
    goalDetails.filter((goalDetails) => goalDetails.goalId === goalDetailsId);

  const addGoal = async ({ name, max, date }) => {
    await setDoc(doc(db, "goals", random6digit()), { name, max, date, userId: currentUser.uid, savings: [] });
    await getGoal();
  };

  const addGoalDetail = async (value, { description, amount }) => {
    await editGoal(value.id, {
      ...value,
      savings: [...value.savings, { id: random6digit(), description, amount }],
    });
    await getGoal();
  };

  const editGoal = async (id, { name, max, date, savings }) => {
    await updateDoc(doc(db, "goals", id), { name, max, date, savings });
    await getGoal();
  };

  const deleteGoal = async (id) => {
    await deleteDoc(doc(db, "goals", id));
    await getGoal();
  };

  const deleteGoalDetail = async (targeId, value) => {
    await editGoal(value.id, {
      ...value,
      savings: value?.savings?.filter(({ id }) => id !== targeId),
    });
    await getGoal();
  };

  const _goal = { getGoal, getGoalDetails, addGoal, addGoalDetail, editGoal, deleteGoal, deleteGoalDetail };

  // EXPENSE =================================================================

  const totalExpense = useMemo(
    () => expenses.reduce((total, expense) => total + expense.amount, 0),
    [expenses]
  );
  const monthlyExpense = useMemo(() => {
    let arr = [];
    // to get number of month
    for (const expense of expenses) {
      const date = expense.time.split(",")[0].split("/");
      const monthYear = `${date[1]}/${date[2]}`;
      if (!arr.includes(monthYear)) arr.push(monthYear);
    }
    return totalExpense / arr.length;
  }, [expenses]);

  const getExpense = async () =>
    setExpenses(
      (await getDocuments("expenses", currentUser.uid)).sort((a, b) => new Date(b.time) - new Date(a.time))
    );

  const addExpense = async ({ description, amount, budgetId }) => {
    console.log(currentUser);
    await setDoc(doc(db, "expenses", random6digit()), {
      description,
      amount,
      budgetId,
      userId: currentUser.uid,
      time: new Date().toLocaleString(),
    });
    await getExpense();
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    await getExpense();
  };

  const _expense = { totalExpense, monthlyExpense, addExpense, deleteExpense };

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        goals,
        ..._budget,
        ..._expense,
        ..._goal,
        loading,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};
