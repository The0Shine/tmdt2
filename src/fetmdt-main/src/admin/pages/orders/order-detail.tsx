'use client'

import { useState, useEffect } from 'react'
import {
    ArrowLeft,
    Printer,
    Download,
    User,
    Phone,
    MapPin,
    CreditCard,
    Package,
    Mail as Email,
} from 'lucide-react'
import OrderProcessing from './components/order-processing'
import { Link, useParams } from 'react-router-dom'
import { mainRepository } from '../../../utils/Repository'
import { OrderData, OrderResponse } from '../../../types/order'
import { getOrderById, updateOrderStatus } from '@/services/apiOrder.service'
import { get } from 'http'

export default function OrderDetail() {
    const [orderStatus, setOrderStatus] = useState<
        'pending' | 'processing' | 'completed' | 'cancelled'
    >('pending')
    const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>(
        'unpaid',
    )
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { orderId } = useParams<{ orderId: string }>()

    useEffect(() => {
        // Sửa hàm fetchOrderDetails
        const fetchOrderDetails = async () => {
            if (!orderId) return

            try {
                setLoading(true)
                const response = await getOrderById(orderId)

                // Kiểm tra kiểu dữ liệu response
                {
                    if (response) {
                        const order = response

                        // Transform the data to match our frontend structure
                        const mappedOrder: OrderData = {
                            _id: order._id,
                            date: order.createdAt,
                            customer: {
                                email: order.user.email,
                                phone: '', // chưa có dữ liệu phone
                                address: '', // chưa có dữ liệu address
                            },
                            items: order.orderItems.map((item: any) => ({
                                // map từng order item theo interface OrderItem
                                // bạn cần xác định OrderItem type cụ thể
                                ...item,
                            })),
                            subtotal: order.itemsPrice,
                            shippingAddress: {
                                address: order.shippingAddress.address,
                                city: order.shippingAddress.city, // chưa có dữ liệu thành phố
                            },
                            shipping: 0, // chưa có thông tin phí vận chuyển
                            tax: 0, // chưa có thông tin thuế
                            total: order.totalPrice,
                            paymentMethod: order.paymentMethod,
                            note: '', // chưa có thông tin ghi chú
                        }

                        setOrderData(mappedOrder)
                        console.log(mappedOrder)

                        setOrderStatus(order.status)
                        setPaymentStatus(order.isPaid ? 'paid' : 'unpaid')
                    }
                }
            } catch (err) {
                console.error('Error fetching order details:', err)
                setError('Đã xảy ra lỗi khi tải thông tin đơn hàng')
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetails()
    }, [orderId])

    // Sửa hàm handleStatusChange
    const handleStatusChange = async (
        status: 'pending' | 'processing' | 'completed' | 'cancelled',
    ) => {
        try {
            interface StatusResponse {
                success: boolean
                message?: string
            }

            if (!orderId) {
                alert('Không tìm thấy mã đơn hàng')
                return
            }
            const response = await updateOrderStatus(orderId, status)
            console.log('Update response:', response)

            if (response) {
                setOrderStatus(status)
                // If order is completed, update payment status to paid
                if (status === 'completed') {
                    setPaymentStatus('paid')
                }
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            alert('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng')
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center p-6">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-teal-500"></div>
                    <p className="mt-4 text-gray-600">
                        Đang tải thông tin đơn hàng...
                    </p>
                </div>
            </div>
        )
    }

    if (error || !orderData) {
        return (
            <div className="p-6">
                <div className="rounded-md bg-red-50 p-4">
                    <h2 className="font-medium text-red-800">Lỗi</h2>
                    <p className="text-red-600">
                        {error || 'Không thể tải thông tin đơn hàng'}
                    </p>
                    <Link
                        to="/admin/orders"
                        className="mt-4 inline-flex items-center text-teal-500 hover:text-teal-600"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Quay lại danh
                        sách đơn hàng
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Chi tiết đơn hàng #{orderId}
                        </h1>
                        <div className="flex items-center text-sm text-gray-500">
                            <Link
                                to="/admin/orders"
                                className="flex items-center text-teal-500 hover:text-teal-600"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Quay
                                lại danh sách đơn hàng
                            </Link>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
                            <Printer size={16} className="mr-1" /> In đơn hàng
                        </button>
                    </div>
                </div>
            </div>

            <OrderProcessing
                orderId={orderId ?? ''}
                currentStatus={orderStatus}
                onStatusChange={handleStatusChange}
            />

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-lg font-medium">
                        <User size={18} className="mr-2 text-teal-500" /> Thông
                        tin khách hàng
                    </h2>
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            <Email size={16} className="mr-1 text-gray-400" />{' '}
                            {orderData.customer.email}
                        </p>
                        <p className="flex items-center text-gray-600">
                            <Phone size={16} className="mr-1 text-gray-400" />{' '}
                            {orderData.customer.phone ||
                                'Chưa có số điện thoại'}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-lg font-medium">
                        <MapPin size={18} className="mr-2 text-teal-500" /> Địa
                        chỉ giao hàng
                    </h2>
                    <div className="space-y-1 text-gray-600">
                        <p>{orderData.shippingAddress.address}</p>
                        <p>{orderData.shippingAddress.city}</p>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-lg font-medium">
                        <CreditCard size={18} className="mr-2 text-teal-500" />{' '}
                        Thông tin thanh toán
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phương thức:</span>
                            <span className="font-medium">
                                {orderData.paymentMethod}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    paymentStatus === 'paid'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                }`}
                            >
                                {paymentStatus === 'paid'
                                    ? 'Đã thanh toán'
                                    : 'Chưa thanh toán'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center text-lg font-medium">
                    <Package size={18} className="mr-2 text-teal-500" /> Sản
                    phẩm đặt hàng
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Sản phẩm
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Đơn giá
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Số lượng
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Thành tiền
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {orderData.items.map((item) => (
                                <tr key={item._id}>
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500">
                                        {item.price}đ
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                        {item.total}đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="font-medium">
                            {orderData.shipping}đ
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Thuế (10%):</span>
                        <span className="font-medium">{orderData.tax}đ</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-teal-600">
                            {orderData.total}đ
                        </span>
                    </div>
                </div>

                {orderData.note && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="mb-2 font-medium">Ghi chú đơn hàng:</h3>
                        <p className="text-gray-600">{orderData.note}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
