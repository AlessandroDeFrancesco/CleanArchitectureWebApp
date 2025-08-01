import { useNavigate } from "react-router-dom";
import type { RouterService } from "../../application/services/RouterService";
import { useEffect } from "react";

export class ReactRouterAdapter implements RouterService {
  static navigate: (path: string) => void;

  async goTo(path: string): Promise<void> {
    ReactRouterAdapter.navigate(path);
  }
}

export function ReactRouterInitializer() {
  const navigate = useNavigate();

  useEffect(() => {
    ReactRouterAdapter.navigate = navigate;
  }, [navigate]);

  return <></>;
}