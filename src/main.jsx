import React from 'react'
import { createRoot } from 'react-dom/client'
import './tokens.css'
import './devtools-phases.css' // the network phase colours, Chrome DevTools' own (C48)
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
