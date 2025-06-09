'use client'

import { useState } from 'react'
import { ChevronLeft, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { useCart } from '../../contexts/cart-context'
import CheckoutForm from './checkout-form'
import OrderSummary from './order-summary'
import { useNavigate, Link } from 'react-router-dom'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { createPayment } from '../../../services/apiPayment.service'

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Phí vận chuyển cố định
    const shippingFee = items.length > 0 ? 30000 : 0

    // Tổng tiền đơn hàng
    const orderTotal = totalPrice + shippingFee

    const validateStock = () => {
        const outOfStockItems = items.filter((item) => {
            const stock = (item as any).stock || 0
            return item.quantity > stock
        })

        if (outOfStockItems.length > 0) {
            const errorMessage = `Các sản phẩm sau không đủ tồn kho: ${outOfStockItems
                .map(
                    (item) =>
                        `${item.name} (yêu cầu: ${item.quantity}, còn lại: ${(item as any).stock || 0})`,
                )
                .join(', ')}`
            setError(errorMessage)
            return false
        }

        setError(null)
        return true
    }

    // Xử lý đặt hàng với logic mới
    const handlePlaceOrder = async (formData: any) => {
        // Kiểm tra tồn kho trước khi đặt hàng
        if (!validateStock()) {
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // Chuẩn bị dữ liệu đơn hàng
            const orderItems = items.map((item) => ({
                name: item.name,
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
            }))

            const orderData = {
                orderItems,
                shippingAddress: {
                    address: formData.fullAddress,
                    city: formData.shippingAddress.city,
                    district: formData.shippingAddress.district,
                    ward: formData.shippingAddress.ward,
                },
                paymentMethod: formData.paymentMethod,
                totalPrice: orderTotal,
                customerInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                },
                note: formData.note,
                orderInfo: `Thanh toan don hang `,
            }

            console.log('📦 Preparing order data:', orderData)

            // Gọi API tạo thanh toán với orderData

            const paymentData = {
                orderData: orderData,
                paymentMethod: formData.paymentMethod,
            }

            console.log('💳 Creating payment...')

            const paymentResult = await createPayment(paymentData)
            console.log('💳 Payment result:', paymentResult)

            if (paymentResult.success) {
                if (
                    formData.paymentMethod === 'vnpay' &&
                    paymentResult.paymentUrl
                ) {
                    // VNPay - chuyển hướng đến trang thanh toán
                    console.log(
                        '🔄 Redirecting to VNPay:',
                        paymentResult.paymentUrl,
                    )
                    setSuccess(
                        'Đang chuyển hướng đến trang thanh toán VNPay...',
                    )

                    // Lưu paymentId để tracking
                    localStorage.setItem(
                        'pendingPaymentId',
                        paymentResult.paymentId!,
                    )

                    // Delay để user thấy thông báo
                    setTimeout(() => {
                        window.location.href = paymentResult.paymentUrl!
                    }, 1500)
                } else if (formData.paymentMethod === 'cod') {
                    // COD - order đã được tạo, xóa giỏ hàng và chuyển đến trang thành công
                    console.log('✅ COD order created, clearing cart')
                    await clearCart()
                    navigate(
                        `/checkout/success?orderId=${paymentResult.orderId}`,
                    )
                }
            } else {
                setError(
                    paymentResult.message || 'Có lỗi xảy ra khi tạo thanh toán',
                )
            }
        } catch (error: any) {
            console.error('❌ Error placing order:', error)

            let errorMessage = 'Có lỗi xảy ra khi tạo đơn hàng'

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail
            } else if (error.message) {
                errorMessage = error.message
            }

            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="mx-auto max-w-md">
                    <div className="mb-6 text-gray-400">
                        <svg
                            className="mx-auto h-24 w-24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">
                        Giỏ hàng của bạn đang trống
                    </h2>
                    <p className="mb-8 text-gray-600">
                        Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh
                        toán.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700"
                    >
                        <ChevronLeft size={16} className="mr-2" />
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        to="/cart"
                        className="flex items-center text-gray-600 transition-colors hover:text-teal-600"
                    >
                        <ChevronLeft size={16} />
                        <span className="ml-1">Quay lại giỏ hàng</span>
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Thanh toán
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Vui lòng kiểm tra thông tin và hoàn tất đơn hàng của bạn
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                            {success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Security Notice */}

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <CheckoutForm
                            onSubmit={handlePlaceOrder}
                            loading={loading}
                            total={orderTotal}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <OrderSummary
                                items={items}
                                subtotal={totalPrice}
                                shipping={shippingFee}
                                total={orderTotal}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
