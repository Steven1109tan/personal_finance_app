import { useRef } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import "../style.css";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";

function Navbar() {
  const navRef = useRef();
  const [displayName, setDisplayName] = useState("");
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      setDisplayName(docSnap.data().username);
      console.log(docSnap.data());
    };

    getUser();
  }, [currentUser.uid]);

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  return (
    <header>
      <div className="d-flex align-items-center gap-2">
        <img src={require("../logo.png")} alt="Logo" width="70" height="70" />
        <nav ref={navRef} data-testid="navbar">
          <a href="/expense">Expense</a>
          <a href="/budget">Budget</a>
          <a href="/saving-goals">Saving Goal</a>
          <a href="/analytics">Analytics</a>
          <a href="/check">Health Check</a>
          <button className="nav-btn nav-close-btn" onClick={showNavbar}>
            <FaTimes />
          </button>
        </nav>
      </div>
      <div className="d-flex align-items-center gap-2">
        <a className="usericon" href="/dashboard">
          <FaUser />
        </a>
        <strong>{displayName} </strong>
        <button className="nav-btn" data-testid="hamburger-menu" onClick={showNavbar}>
          <FaBars />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
