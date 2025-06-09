import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './user/contexts/auth-context.tsx'
import { CartProvider } from './user/contexts/cart-context.tsx'
import { Toast } from './components/ui/toast.tsx'
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <App />
                    <Toast />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
