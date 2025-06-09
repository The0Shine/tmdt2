'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
    CheckCircle,
    Package,
    Truck,
    CreditCard,
    ArrowRight,
    Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getOrderById } from '../../../services/apiOrder.service'
import type { Order } from '../../../types/order'
import { Badge } from '@/components/ui/badge'

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('Không tìm thấy thông tin đơn hàng')
                setLoading(false)
                return
            }

            try {
                const orderData = await getOrderById(orderId)
                setOrder(orderData)
            } catch (error: any) {
                console.error('Lỗi khi lấy thông tin đơn hàng:', error)
                setError('Không thể tải thông tin đơn hàng')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto flex items-center justify-center px-4 py-16">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent"></div>
                    <p className="text-gray-600">
                        Đang tải thông tin đơn hàng...
                    </p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-md text-center">
                    <div className="mb-4 text-red-500">
                        <Package size={64} className="mx-auto" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">
                        Có lỗi xảy ra
                    </h1>
                    <p className="mb-6 text-gray-600">{error}</p>
                    <Link to="/shop">
                        <Button className="bg-teal-600 hover:bg-teal-700">
                            Tiếp tục mua sắm
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-2xl">
                {/* Header thành công */}
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle size={64} className="text-green-500" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-800">
                        Đặt hàng thành công!
                    </h1>
                    <p className="text-gray-600">
                        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của
                        bạn sớm nhất có thể.
                    </p>
                </div>

                {/* Thông tin đơn hàng */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package size={20} />
                            Thông tin đơn hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">
                                    Mã đơn hàng:
                                </span>
                                <p className="font-medium">
                                    {order.orderNumber || order._id}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">Ngày đặt:</span>
                                <p className="font-medium">
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">
                                    Trạng thái:
                                </span>
                                <p className="font-medium text-orange-600 capitalize">
                                    {order.status === 'pending'
                                        ? 'Chờ xử lý'
                                        : order.status}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">
                                    Thanh toán:
                                </span>
                                <p className="font-medium">
                                    {order.isPaid ? (
                                        <Badge className="border-green-200 bg-green-100 text-green-800">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Đã thanh toán
                                        </Badge>
                                    ) : (
                                        <Badge className="border-orange-200 bg-orange-100 text-orange-800">
                                            <Clock className="mr-1 h-3 w-3" />
                                            Chưa thanh toán
                                        </Badge>
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sản phẩm đã đặt */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Sản phẩm đã đặt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4"
                                >
                                    <img
                                        src={
                                            item.product.image ||
                                            '/placeholder.svg?height=60&width=60'
                                        }
                                        alt={item.product.name}
                                        className="h-15 w-15 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Số lượng: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {formatPrice(
                                                item.product.price *
                                                    item.quantity,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Tổng cộng:</span>
                                <span className="text-teal-600">
                                    {formatPrice(order.totalPrice)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Địa chỉ giao hàng */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck size={20} />
                            Địa chỉ giao hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            <p className="font-medium">{order.user.email}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Phương thức thanh toán */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard size={20} />
                            Phương thức thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{order.paymentMethod}</p>
                    </CardContent>
                </Card>

                {/* Các hành động */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link to="/account/orders" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Xem đơn hàng của tôi
                        </Button>
                    </Link>
                    <Link to="/shop" className="flex-1">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">
                            <span className="flex items-center gap-2">
                                Tiếp tục mua sắm
                                <ArrowRight size={16} />
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
