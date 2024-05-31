import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import "../App.css";
import OAuth from "../components/OAuth";
import Spinner from "react-bootstrap/Spinner";
import LoadingButton from "../components/LoadingButton";

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setError("Please fill out all fields");
    }
    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.post(`${VITE_API_URL}/auth/register`, {
        email: formData.email,
        password: formData.password,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);

      onLogin();
      navigate("/");
    } catch (error) {
      setError("Registration failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={8} md={6} lg={4}>
          <div className="login-form">
            <div>
              <h2 className="pb-1">
                Two <span className="forty">Forty</span> Two
              </h2>
            </div>
            <div>
              <p className="motto">
                Empowering Your World with Cutting-Edge Electronics
              </p>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <Spinner animation="border" />}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter email"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                />
                <a href="/login" className="notice">
                  <span className="notice2">Already have an account?</span> Sign
                  in here
                </a>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              {isLoading ? (
                <LoadingButton className="w-100" />
              ) : (
                <Button
                  className="w-100"
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Register
                </Button>
              )}
              <div className="oauth-container">
                <OAuth onLogin={onLogin} />
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
