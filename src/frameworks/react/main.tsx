import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootswatch/dist/darkly/bootstrap.min.css';
import './custom.scss';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-vh-100">
      <App />
    </div>
  </StrictMode>
)
