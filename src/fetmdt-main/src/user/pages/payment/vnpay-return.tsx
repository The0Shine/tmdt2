'use client'

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '../../../components/ui/card'
import { useCart } from '../../contexts/cart-context'

export default function VNPayReturn() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { clearCart } = useCart()
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
        'loading',
    )
    const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...')
    const [orderId, setOrderId] = useState('')

    useEffect(() => {
        const processPaymentReturn = async () => {
            try {
                // Lấy kết quả từ URL params (đã được backend xử lý)
                const success = searchParams.get('success')
                const messageParam = searchParams.get('message')
                const orderIdParam = searchParams.get('orderId')
                const paymentIdParam = searchParams.get('paymentId')

                console.log('🔄 Processing VNPay return with params:', {
                    success,
                    messageParam,
                    orderIdParam,
                    paymentIdParam,
                })

                if (success === 'true') {
                    setStatus('success')
                    setMessage(messageParam || 'Thanh toán thành công!')
                    setOrderId(orderIdParam || '')

                    // Xóa giỏ hàng khi thanh toán thành công
                    await clearCart()

                    // Xóa paymentId khỏi localStorage
                    localStorage.removeItem('pendingPaymentId')

                    console.log('✅ Payment successful, cart cleared')

                    // Chuyển hướng đến trang success sau 2 giây
                    setTimeout(() => {
                        navigate(
                            `/checkout/success?orderId=${orderIdParam}&paymentMethod=vnpay&paymentStatus=paid`,
                        )
                    }, 2000)
                } else {
                    setStatus('failed')
                    setMessage(messageParam || 'Thanh toán thất bại')

                    console.log('❌ Payment failed:', messageParam)

                    // Chuyển hướng đến trang failed sau 3 giây
                    setTimeout(() => {
                        navigate(
                            `/checkout/failed?reason=${encodeURIComponent(messageParam || 'Payment failed')}`,
                        )
                    }, 3000)
                }
            } catch (error: any) {
                console.error('❌ Error processing VNPay return:', error)
                setStatus('failed')
                setMessage('Có lỗi xảy ra khi xử lý kết quả thanh toán')

                setTimeout(() => {
                    navigate('/checkout/failed?reason=processing_error')
                }, 3000)
            }
        }

        processPaymentReturn()
    }, [searchParams, navigate, clearCart])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                    <div className="mb-6">
                        {status === 'loading' && (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                                    <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-blue-200"></div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Đang xử lý thanh toán
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Vui lòng đợi trong giây lát...
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <CheckCircle className="h-16 w-16 text-green-500" />
                                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-green-700">
                                        Thanh toán thành công!
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Đơn hàng của bạn đã được tạo thành công
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <XCircle className="h-16 w-16 text-red-500" />
                                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-red-700">
                                        Thanh toán thất bại
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Đơn hàng không được tạo
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <p className="font-medium text-gray-700">{message}</p>

                        {orderId && (
                            <div className="rounded-lg bg-gray-50 p-3">
                                <p className="mb-1 text-xs text-gray-500">
                                    Mã đơn hàng
                                </p>
                                <p className="font-mono text-sm font-medium text-gray-800">
                                    {orderId}
                                </p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-3">
                                <div className="flex items-center justify-center space-x-2 text-green-700">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        Đơn hàng đã được tạo
                                    </span>
                                </div>
                                <div className="flex items-center justify-center space-x-2 text-green-700">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        Giỏ hàng đã được xóa
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-green-600">
                                    Đang chuyển hướng đến trang chi tiết đơn
                                    hàng...
                                </p>
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="text-xs text-red-600">
                                    Đang chuyển hướng đến trang lỗi...
                                </p>
                            </div>
                        )}

                        {status === 'loading' && (
                            <div className="flex justify-center space-x-1">
                                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                                <div
                                    className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                                    style={{ animationDelay: '0.1s' }}
                                ></div>
                                <div
                                    className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                                    style={{ animationDelay: '0.2s' }}
                                ></div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
