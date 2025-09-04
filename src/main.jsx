import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './pages/App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App/>
  </HashRouter>
)
