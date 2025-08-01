import { useEffect, useState, type JSX, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import type { AuthUser } from "../../../../application/services/AuthService";
import { dependencies } from "../../../../dependencies/DependenciesContainer";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const authGateway = dependencies.authService;
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = authGateway.subscribe((_user: AuthUser | null) => {
      setLoggedIn(authGateway.isLoggedIn());
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function loggedProtection(element: JSX.Element): JSX.Element {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}