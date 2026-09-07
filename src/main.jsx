import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CarePulseProvider } from './context/CarePulseContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarePulseProvider>
      <App />
    </CarePulseProvider>
  </StrictMode>,
)
