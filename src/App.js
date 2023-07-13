import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Signup from "./components/auth/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import Expense from "./pages/Expense";
import React from "react";
import Analytics from "./pages/Analytics";
import SavingGoals from "./pages/SavingGoals";
import Budget from "./pages/Budget";
import Check from "./pages/Check";
import { BudgetsProvider } from "./contexts/BudgetsContext";

function App() {
  return (
    <Container className="d-flex justify-content-center p-0" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "1000px" }}>
        <Router>
          <AuthProvider>
            <BudgetsProvider>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <PrivateRoute>
                      <Expense />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/expense"
                  element={
                    <PrivateRoute>
                      <Expense />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/budget"
                  element={
                    <PrivateRoute>
                      <Budget />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute>
                      <Analytics />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/update-profile"
                  element={
                    <PrivateRoute>
                      <UpdateProfile />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/saving-goals"
                  element={
                    <PrivateRoute>
                      <SavingGoals />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/check"
                  element={
                    <PrivateRoute>
                      <Check />
                    </PrivateRoute>
                  }
                />

                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </BudgetsProvider>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
