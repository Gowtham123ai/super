import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: { background: '#1e293b', color: 'white', border: '1px solid #334155' },
                    success: { iconTheme: { primary: '#34d399', secondary: '#0f172a' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
                }}
            />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
)
