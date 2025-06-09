import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom' // Sử dụng useLocation và useNavigate từ React Router
import { User, Lock, ShoppingBag, Heart, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'

const AccountSidebar: React.FC = () => {
    const location = useLocation() // Lấy thông tin đường dẫn hiện tại
    const navigate = useNavigate() // Sử dụng useNavigate để điều hướng
    const { logout } = useAuth()

    const isActive = (path: string) => {
        return location.pathname === path // Kiểm tra xem đường dẫn có khớp với đường dẫn hiện tại không
    }

    const menuItems = [
        {
            label: 'Thông tin cá nhân',
            href: '/account',
            icon: <User size={18} />,
        },
        {
            label: 'Đổi mật khẩu',
            href: '/account/password',
            icon: <Lock size={18} />,
        },
        {
            label: 'Đơn hàng của tôi',
            href: '/account/orders',
            icon: <ShoppingBag size={18} />,
        },
        {
            label: 'Sản phẩm yêu thích',
            href: '/account/wishlist',
            icon: <Heart size={18} />,
        },
    ]

    const handleNavigation = (href: string) => {
        navigate(href) // Dùng navigate để chuyển hướng
    }

    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Tài khoản của tôi</h2>
            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)} // Điều hướng khi nhấn vào item
                        className={`flex items-center rounded-md px-3 py-2 ${
                            isActive(item.href)
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={logout}
                    className="flex w-full items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                    <span className="mr-3">
                        <LogOut size={18} />
                    </span>
                    <span>Đăng xuất</span>
                </button>
            </nav>
        </div>
    )
}

export default AccountSidebar
