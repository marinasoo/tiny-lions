import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/atkinson-hyperlegible-mono/400.css'
import '@fontsource/atkinson-hyperlegible-mono/400-italic.css'
import '@fontsource/atkinson-hyperlegible-mono/700.css'
import '@fontsource/atkinson-hyperlegible-mono/800.css'
import '@fontsource/betania-patmos-in/400.css'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
