import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as Chakra} from "./components/ui/provider"
import App from './App.jsx'
import {BrowserRouter as Router } from "react-router-dom"
import { AppointmentProvider } from './Appointmentcontext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppointmentProvider>
    <Router>
    <Chakra>
    <App />
    </Chakra>
    </Router>
    </AppointmentProvider>
  </StrictMode>,
)
