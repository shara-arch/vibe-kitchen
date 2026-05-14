import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* add BrowserRouter to main.jsx for navigation support */}
    {/* Integrates the history API wrapper to allow for declarative routing across the component tree. */}
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
