import { useState, useContext, use, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    ShoppingCart,
    User,
    Search,
    Menu,
    X,
    Heart,
    LogIn,
    LogOut,
} from 'lucide-react'
import { AuthContext } from '../../contexts/auth-context'
import { CartContext } from '../../contexts/cart-context'
export default function ShopHeader() {
    const { pathname } = useLocation() // Sử dụng useLocation để lấy pathname trong React Router
    const { totalItems } = useContext(CartContext) // Lấy thông tin giỏ hàng từ CartContext
    const { user, isAuthenticated, logout } = useContext(AuthContext) // Lấy thông tin user từ AuthContext
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Implement search functionality
        console.log('Searching for:', searchTerm)
    }

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`)
    }
    useEffect(() => {
        console.log(isAuthenticated)
    }, [])
    return (
        <header className="sticky top-0 z-10 bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                                <span className="font-semibold text-white">
                                    T
                                </span>
                            </div>
                            <span className="ml-2 text-xl font-semibold text-gray-800">
                                TechZone
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-8 md:flex">
                        <Link
                            to="/"
                            className={`text-gray-600 hover:text-blue-600 ${isActive('/') && !isActive('/shop') && !isActive('/cart') && !isActive('/account') ? 'font-medium text-blue-600' : ''}`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to="/shop"
                            className={`text-gray-600 hover:text-blue-600 ${isActive('/shop') ? 'font-medium text-blue-600' : ''}`}
                        >
                            Cửa hàng
                        </Link>
                        <Link
                            to="/about"
                            className={`text-gray-600 hover:text-blue-600 ${isActive('/about') ? 'font-medium text-blue-600' : ''}`}
                        >
                            Giới thiệu
                        </Link>
                        <Link
                            to="/contact"
                            className={`text-gray-600 hover:text-blue-600 ${isActive('/contact') ? 'font-medium text-blue-600' : ''}`}
                        >
                            Liên hệ
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <form
                            onSubmit={handleSearch}
                            className="relative hidden items-center md:flex"
                        >
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-64 rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search
                                size={18}
                                className="absolute left-3 text-gray-400"
                            />
                        </form>

                        <Link
                            to="/wishlist"
                            className="relative text-gray-600 hover:text-blue-600"
                        >
                            <Heart size={20} />
                        </Link>

                        <Link
                            to="/cart"
                            className="relative text-gray-600 hover:text-blue-600"
                        >
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="group relative">
                                <Link
                                    to="/account"
                                    className="flex items-center p-2 text-gray-600 hover:text-blue-600"
                                >
                                    <User size={20} />
                                </Link>
                                <div className="absolute right-0 z-10 hidden w-48 rounded-md bg-white pt-2 shadow-lg group-hover:block">
                                    <div className="py-1">
                                        <Link
                                            to="/account"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Tài khoản của tôi
                                        </Link>
                                        <Link
                                            to="/account/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Đơn hàng
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <LogIn size={20} />
                            </Link>
                        )}

                        <button
                            className="text-gray-600 md:hidden"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="border-t border-gray-200 bg-white md:hidden">
                    <div className="container mx-auto px-4 py-2">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <Search
                                    size={18}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                                />
                            </div>
                        </form>
                        <nav className="flex flex-col space-y-3 py-3">
                            <Link
                                to="/"
                                className={`py-2 text-gray-600 hover:text-blue-600 ${isActive('/') && !isActive('/shop') ? 'font-medium text-blue-600' : ''}`}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to="/shop"
                                className={`py-2 text-gray-600 hover:text-blue-600 ${isActive('/shop') ? 'font-medium text-blue-600' : ''}`}
                            >
                                Cửa hàng
                            </Link>
                            <Link
                                to="/about"
                                className={`py-2 text-gray-600 hover:text-blue-600 ${isActive('/about') ? 'font-medium text-blue-600' : ''}`}
                            >
                                Giới thiệu
                            </Link>
                            <Link
                                to="/contact"
                                className={`py-2 text-gray-600 hover:text-blue-600 ${isActive('/contact') ? 'font-medium text-blue-600' : ''}`}
                            >
                                Liên hệ
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/account"
                                        className={`py-2 text-gray-600 hover:text-blue-600 ${isActive('/account') ? 'font-medium text-blue-600' : ''}`}
                                    >
                                        Tài khoản của tôi
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="flex items-center py-2 text-left text-gray-600 hover:text-blue-600"
                                    >
                                        <LogOut size={18} className="mr-2" />
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`flex items-center py-2 text-gray-600 hover:text-blue-600 ${isActive('/login') ? 'font-medium text-blue-600' : ''}`}
                                >
                                    <LogIn size={18} className="mr-2" />
                                    Đăng nhập
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}
