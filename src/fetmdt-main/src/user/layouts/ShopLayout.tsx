import type React from 'react'
import { Outlet } from 'react-router-dom'
import ShopHeader from './components/Header'
import ShopFooter from './components/Footer'

const ShopLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <ShopHeader />
            <main className="flex-grow">
                <Outlet />
            </main>
            <ShopFooter />
        </div>
    )
}

export default ShopLayout
