import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Container, Row, Col, Card } from "react-bootstrap";
import type { SignInController } from "../../../adapters/controllers/SignInController";
import type { SignInPresenter } from "../../../adapters/presenters/SignInPresenter";

interface SignInPageProps {
  presenter: SignInPresenter;
  controller: SignInController;
}

export const SignInPage: React.FC<SignInPageProps> = ({ presenter, controller }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(presenter.IsLoading.value);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubLoading = presenter.IsLoading.subscribe(setIsLoading);
    const unsubError = presenter.ErrorEvent.subscribe(setErrorMessage);

    return () => {
      unsubLoading();
      unsubError();
    };
  }, [presenter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    await controller.signIn(email, password);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="mb-4">Sign In</h2>

              {errorMessage && (
                <div
                  style={{
                    border: "1px solid #dc3545",
                    backgroundColor: "#f8d7da",
                    color: "#842029",
                    padding: "12px",
                    borderRadius: "4px",
                    marginBottom: "20px",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" disabled={isLoading} className="w-100">
                  {isLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      {" "}Loading...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
