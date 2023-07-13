import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displayNameRef = useRef();
  const {
    currentUser,
    updatingPassword,
    updatingEmail,
    updateUsername,
    deleteThisUser,
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDisplayName, setDisplayName] = useState("");
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

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");
    if (displayNameRef.current.value !== currentDisplayName) {
      promises.push(
        updateUsername(currentUser.uid, displayNameRef.current.value)
      );
    }
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updatingEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatingPassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="text">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                ref={displayNameRef}
                required
                defaultValue={currentDisplayName}
              />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <br></br>
            <Button
              disabled={loading}
              className="w-100 bg-success"
              type="submit"
            >
              Update
            </Button>
          </Form>
          <Button
            disabled={loading}
            className="w-100 mt-5"
            variant="danger"
            type="submit"
            onClick={() => {
              deleteThisUser(currentUser.uid).then(() => {
                navigate("/")
                  .catch(() => {
                    setError("Failed to delete account");
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              });
            }}
          >
            Delete User
          </Button>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/" className="text-success">
          Cancel
        </Link>
      </div>
    </>
  );
}
