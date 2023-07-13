import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "./Navbar";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      setDisplayName(docSnap.data().username);
      console.log(docSnap.data());
    };

    getUser();
  }, [currentUser.uid]);

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <Navbar />
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Hello, {displayName} </strong>
          <br></br>
          <strong>Email: </strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-success w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2 underline">
        <Button variant="link" className="text-success" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
}
