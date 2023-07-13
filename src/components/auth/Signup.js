import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displayNameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    const WEEK_PASSWORD = "auth/weak-password";
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      console.log(emailRef.current.value, passwordRef.current.value, displayNameRef.current.value);
      await signup(emailRef.current.value, passwordRef.current.value, displayNameRef.current.value);
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.code == WEEK_PASSWORD) setError("Password should be at least 6 characters");
      else setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 gap-5">
      <img src={require("../../logo.png")} alt="Logo" width="180" height="180" />
      <div className="w-100" style={{ maxWidth: "600px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" ref={displayNameRef} required />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              </Form.Group>
              <br></br>
              <Button disabled={loading} variant="success" className="w-100" type="submit">
                Sign Up
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-success">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
