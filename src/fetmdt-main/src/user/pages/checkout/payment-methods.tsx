'use client'
import { Button } from '../../../components/ui/button'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group'
import { Label } from '../../../components/ui/label'
import { Card, CardContent } from '../../../components/ui/card'
import { Separator } from '../../../components/ui/separator'
import {
    CreditCard,
    Truck,
    Shield,
    Clock,
    CheckCircle,
    Loader2,
} from 'lucide-react'

interface PaymentMethodsProps {
    selectedMethod: string
    onMethodChange: (method: string) => void
    onSubmit: () => void
    loading: boolean
    total: number
}

export default function PaymentMethods({
    selectedMethod,
    onMethodChange,
    onSubmit,
    loading,
    total,
}: PaymentMethodsProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price)
    }

    const paymentMethods = [
        {
            id: 'cod',
            name: 'Thanh toán khi nhận hàng (COD)',
            description: 'Thanh toán bằng tiền mặt khi nhận được hàng',
            icon: <Truck className="h-5 w-5" />,
            features: [
                'Thanh toán khi nhận hàng',
                'Kiểm tra hàng trước khi thanh toán',
                'Không mất phí giao dịch',
            ],
            recommended: false,
        },
        {
            id: 'vnpay',
            name: 'Thanh toán online qua VNPay',
            description: 'Thanh toán qua thẻ ATM, Internet Banking, QR Code',
            icon: <CreditCard className="h-5 w-5" />,
            features: [
                'Thanh toán ngay lập tức',
                'Bảo mật cao với VNPay',
                'Hỗ trợ nhiều ngân hàng',
            ],
            recommended: true,
        },
    ]

    return (
        <div className="space-y-6">
            <RadioGroup
                value={selectedMethod}
                onValueChange={onMethodChange}
                className="space-y-4"
            >
                {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                        <Label htmlFor={method.id} className="cursor-pointer">
                            <Card
                                className={`transition-all duration-200 hover:shadow-md ${
                                    selectedMethod === method.id
                                        ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <RadioGroupItem
                                            value={method.id}
                                            id={method.id}
                                            className="mt-1"
                                        />

                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                        method.id === 'vnpay'
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-orange-100 text-orange-600'
                                                    }`}
                                                >
                                                    {method.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {method.name}
                                                        </h3>
                                                        {method.recommended && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                                <CheckCircle className="h-3 w-3" />
                                                                Khuyến nghị
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {method.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Features */}
                                            <div className="ml-13 space-y-1">
                                                {method.features.map(
                                                    (feature, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-2 text-sm text-gray-600"
                                                        >
                                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                                            {feature}
                                                        </div>
                                                    ),
                                                )}
                                            </div>

                                            {/* Additional info for VNPay */}
                                            {method.id === 'vnpay' && (
                                                <div className="ml-13 flex items-center gap-4 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Shield className="h-3 w-3" />
                                                        Bảo mật SSL
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Xử lý tức thì
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <Separator />

            {/* Order Summary */}
            <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Tổng thanh toán:</span>
                    <span className="text-teal-600">{formatPrice(total)}</span>
                </div>
                {selectedMethod === 'cod' && (
                    <p className="mt-2 text-sm text-gray-600">
                        💡 Bạn sẽ thanh toán {formatPrice(total)} khi nhận hàng
                    </p>
                )}
                {selectedMethod === 'vnpay' && (
                    <p className="mt-2 text-sm text-gray-600">
                        🔒 Thanh toán an toàn qua cổng VNPay
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-teal-600 py-3 text-base font-semibold hover:bg-teal-700 disabled:opacity-50"
                size="lg"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang xử lý...
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {selectedMethod === 'vnpay' ? (
                            <>
                                <CreditCard className="h-4 w-4" />
                                Thanh toán ngay {formatPrice(total)}
                            </>
                        ) : (
                            <>
                                <Truck className="h-4 w-4" />
                                Đặt hàng - Thanh toán khi nhận
                            </>
                        )}
                    </div>
                )}
            </Button>

            {/* Security notice */}
            <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Thông tin của bạn được bảo mật và mã hóa
                </div>
            </div>
        </div>
    )
}
