import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ensureAnonymousAuth } from './firebase'

async function bootstrap() {
  try {
    await ensureAnonymousAuth();
  } catch (e) {
    console.error('Auth init failed', e);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
}

bootstrap();
