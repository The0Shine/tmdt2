'use client'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
import { Separator } from '../../../components/ui/separator'
import { Badge } from '../../../components/ui/badge'
import { ShoppingBag, Truck, Calculator } from 'lucide-react'

interface OrderSummaryProps {
    items: Array<{
        _id: string
        name: string
        price: number
        quantity: number
        image?: string
    }>
    subtotal: number
    shipping: number
    total: number
}

export default function OrderSummary({
    items,
    subtotal,
    shipping,
    total,
}: OrderSummaryProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price)
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                        <ShoppingBag className="h-4 w-4 text-purple-600" />
                    </div>
                    Tóm tắt đơn hàng
                    <Badge variant="secondary" className="ml-auto">
                        {items.length} sản phẩm
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Items List */}
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item._id} className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={
                                        item.image ||
                                        '/placeholder.svg?height=50&width=50'
                                    }
                                    alt={item.name}
                                    className="h-12 w-12 rounded-lg object-cover"
                                />
                                <Badge
                                    variant="secondary"
                                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                                >
                                    {item.quantity}
                                </Badge>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="truncate text-sm font-medium text-gray-900">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {formatPrice(item.price)} × {item.quantity}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-medium">
                            {formatPrice(subtotal)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                            <Truck className="h-3 w-3" />
                            Phí vận chuyển:
                        </div>
                        <span className="font-medium">
                            {shipping > 0 ? formatPrice(shipping) : 'Miễn phí'}
                        </span>
                    </div>

                    {/* Discount placeholder */}
                    <div className="flex items-center justify-between text-sm text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatPrice(0)}</span>
                    </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="rounded-lg bg-teal-50 p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-teal-600" />
                            <span className="font-semibold text-gray-900">
                                Tổng cộng:
                            </span>
                        </div>
                        <span className="text-xl font-bold text-teal-600">
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>

                {/* Savings notice */}
                {shipping === 0 && (
                    <div className="rounded-lg bg-green-50 p-3 text-center">
                        <p className="text-sm text-green-700">
                            🎉 Bạn được miễn phí vận chuyển!
                        </p>
                    </div>
                )}

                {/* Estimated delivery */}
                <div className="rounded-lg bg-blue-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Truck className="h-4 w-4" />
                        <div>
                            <p className="font-medium">Dự kiến giao hàng</p>
                            <p className="text-xs">2-3 ngày làm việc</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
