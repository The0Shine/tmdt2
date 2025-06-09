import { Outlet } from 'react-router-dom'
import { Header } from './components/Header'
import { Siderbar } from './components/Sidebar'

export const MainLayout = () => {
    return (
        <div className="flex min-h-screen max-w-[100vw] flex-col">
            <Header />
            <div className="page-content mt-[100px]">
                <div className="relative flex w-full">
                    <Siderbar />
                    <div className="w-[calc(100%-304px)] flex-auto rounded-lg py-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
