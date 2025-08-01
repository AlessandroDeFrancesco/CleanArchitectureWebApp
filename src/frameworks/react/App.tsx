import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./pages/SignInPage";
import { loggedProtection } from "./components/common/ProtectedRoute";
import { MainPage } from "./pages/MainPage";
import { DefaultDependenciesContainer } from "../../dependencies/DefaultDependenciesContainer";
import { dependencies, setDependenciesImplementation } from "../../dependencies/DependenciesContainer";
import { ReactRouterInitializer } from "./ReactRouterGateway";


export let navigateTo: (path: string) => void;
setDependenciesImplementation(new DefaultDependenciesContainer());

export default function App() {
  return (
    <BrowserRouter>
      <ReactRouterInitializer />
      <Routes>
        <Route path="/login" element={<SignInPage presenter={dependencies.signInPresenter} controller={dependencies.signInController} />} />
        <Route path="/" element={loggedProtection(<MainPage presenter={dependencies.mainPresenter} mainController={dependencies.mainController} optionsController={dependencies.optionsController} />)} />
        <Route path="/main" element={loggedProtection(<MainPage presenter={dependencies.mainPresenter} mainController={dependencies.mainController} optionsController={dependencies.optionsController} />)} />
      </Routes>
    </BrowserRouter>
  );
}