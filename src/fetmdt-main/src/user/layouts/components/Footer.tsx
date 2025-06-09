import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ShopFooter() {
    return (
        <footer className="bg-gray-800 pt-12 pb-6 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <div className="mb-4 flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                                <span className="text-xl font-semibold text-white">
                                    T
                                </span>
                            </div>
                            <span className="ml-2 text-2xl font-bold">
                                TechZone
                            </span>
                        </div>
                        <p className="mb-4 text-gray-400">
                            Cung cấp các sản phẩm công nghệ chính hãng với giá
                            tốt nhất thị trường. Dịch vụ chăm sóc khách hàng tận
                            tâm.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            Danh mục sản phẩm
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/shop/category/laptop"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Laptop
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shop/category/dien-thoai"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Điện thoại
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shop/category/may-tinh-bang"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Máy tính bảng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shop/category/man-hinh"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Màn hình
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shop/category/phu-kien"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Phụ kiện
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            Thông tin
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/policy/shipping"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Chính sách vận chuyển
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/policy/return"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/policy/warranty"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Chính sách bảo hành
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin
                                    size={18}
                                    className="mt-1 mr-2 flex-shrink-0 text-gray-400"
                                />
                                <span className="text-gray-400">
                                    123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone
                                    size={18}
                                    className="mr-2 flex-shrink-0 text-gray-400"
                                />
                                <span className="text-gray-400">
                                    0123 456 789
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Mail
                                    size={18}
                                    className="mr-2 flex-shrink-0 text-gray-400"
                                />
                                <span className="text-gray-400">
                                    info@techzone.com
                                </span>
                            </li>
                        </ul>
                        <div className="mt-4">
                            <h4 className="mb-2 text-sm font-medium">
                                Đăng ký nhận tin
                            </h4>
                            <form className="flex">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="w-full rounded-l-md bg-gray-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Gửi
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} TechZone. Tất cả quyền
                        được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    )
}
