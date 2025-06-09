'use client'

import { useSearchParams, Link } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function CheckoutFailed() {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId')
    const message = searchParams.get('message') || 'Thanh toán thất bại'

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center space-x-2 text-red-600">
                            <XCircle className="h-8 w-8" />
                            <span>Thanh toán thất bại</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-gray-600">
                                {decodeURIComponent(message)}
                            </p>

                            {orderId && (
                                <p className="text-sm text-gray-500">
                                    Mã đơn hàng:{' '}
                                    <span className="font-mono">{orderId}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">
                                Đơn hàng của bạn chưa được thanh toán. Bạn có
                                thể thử lại hoặc chọn phương thức thanh toán
                                khác.
                            </p>

                            <div className="flex flex-col space-y-2">
                                <Button
                                    asChild
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    <Link to="/cart">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Thử lại thanh toán
                                    </Link>
                                </Button>

                                <Button variant="outline" asChild>
                                    <Link to="/shop">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Tiếp tục mua sắm
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="border-t pt-4 text-xs text-gray-400">
                            <p>
                                Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ
                                khách hàng
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
