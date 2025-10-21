import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext, AuthProvider } from '../context/AuthContext.jsx'
import { MessageProvider } from '../context/messagesContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <MessageProvider>
      <App />
    </MessageProvider>
  </AuthProvider>
  </BrowserRouter>,
)
