'use client'

import { useState } from 'react'
import { mainRepository } from '../../../../utils/Repository'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OrderProcessingProps {
    orderId: string
    currentStatus: 'pending' | 'processing' | 'completed' | 'cancelled'
    onStatusChange: (
        status: 'pending' | 'processing' | 'completed' | 'cancelled',
    ) => void
}

interface StatusResponse {
    success: boolean
    message?: string
    data?: any
}

export default function OrderProcessing({
    orderId,
    currentStatus,
    onStatusChange,
}: OrderProcessingProps) {
    const [loading, setLoading] = useState(false)

    const updateOrderStatus = async (
        status: 'pending' | 'processing' | 'completed' | 'cancelled',
    ) => {
        if (status === currentStatus) return

        try {
            setLoading(true)

            const response = await mainRepository.put(
                `/api/orders/${orderId}/status`,
                {
                    status: status,
                },
            )

            if (response) {
                onStatusChange(status)
                toast.success(
                    `Đã cập nhật trạng thái đơn hàng thành "${getStatusText(status)}"`,
                )
            } else {
                toast.error('Không thể cập nhật trạng thái đơn hàng')
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            toast.error('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng')
        } finally {
            setLoading(false)
        }
    }

    const getStatusText = (status: string) => {
        const statusMap = {
            pending: 'Chờ xác nhận',
            processing: 'Đang xử lý',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
        }
        return statusMap[status as keyof typeof statusMap] || status
    }

    const getStatusBadge = (status: string, isActive: boolean) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-100 text-yellow-700' },
            processing: { className: 'bg-blue-100 text-blue-700' },
            completed: { className: 'bg-green-100 text-green-700' },
            cancelled: { className: 'bg-red-100 text-red-700' },
        }

        const config = statusConfig[status as keyof typeof statusConfig]
        return (
            <Badge
                className={`${config.className} ${!isActive ? 'opacity-50' : ''}`}
            >
                {getStatusText(status)}
            </Badge>
        )
    }

    const steps = [
        {
            id: 'pending',
            name: 'Chờ xác nhận',
            description: 'Đơn hàng đã được tạo',
        },
        {
            id: 'processing',
            name: 'Đang xử lý',
            description: 'Đơn hàng đang được chuẩn bị',
        },
        {
            id: 'completed',
            name: 'Hoàn thành',
            description: 'Đơn hàng đã giao thành công',
        },
    ]

    const getStepStatus = (stepId: string) => {
        const statusOrder = ['pending', 'processing', 'completed']
        const currentIndex = statusOrder.indexOf(currentStatus)
        const stepIndex = statusOrder.indexOf(stepId)

        if (currentStatus === 'cancelled') {
            return 'cancelled'
        }

        if (stepIndex <= currentIndex) {
            return 'completed'
        }

        return 'pending'
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Trạng thái đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>

                    <div className="space-y-6">
                        {steps.map((step, index) => {
                            const stepStatus = getStepStatus(step.id)
                            const isActive = stepStatus === 'completed'
                            const isCurrentStep = currentStatus === step.id
                            const canUpdate =
                                !loading &&
                                currentStatus !== 'cancelled' &&
                                step.id !== currentStatus

                            return (
                                <div key={step.id} className="relative">
                                    <div
                                        className={`absolute top-0 left-4 mt-1.5 -ml-2 h-4 w-4 rounded-full border-2 ${
                                            isActive
                                                ? 'border-teal-500 bg-teal-500'
                                                : 'border-gray-300 bg-white'
                                        }`}
                                    ></div>

                                    <div className="ml-10">
                                        <div className="flex items-center space-x-3">
                                            <h3
                                                className={`text-base font-semibold ${isActive ? 'text-teal-600' : 'text-gray-500'}`}
                                            >
                                                {step.name}
                                            </h3>
                                            {isCurrentStep && (
                                                <Badge className="bg-blue-100 text-blue-700">
                                                    Hiện tại
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {step.description}
                                        </p>

                                        {canUpdate && (
                                            <Button
                                                onClick={() =>
                                                    updateOrderStatus(
                                                        step.id as any,
                                                    )
                                                }
                                                disabled={loading}
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                            >
                                                {loading
                                                    ? 'Đang cập nhật...'
                                                    : `Chuyển sang ${step.name}`}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Cancelled status */}
                        <div className="relative">
                            <div
                                className={`absolute top-0 left-4 mt-1.5 -ml-2 h-4 w-4 rounded-full border-2 ${
                                    currentStatus === 'cancelled'
                                        ? 'border-red-500 bg-red-500'
                                        : 'border-gray-300 bg-white'
                                }`}
                            ></div>

                            <div className="ml-10">
                                <div className="flex items-center space-x-3">
                                    <h3
                                        className={`text-base font-semibold ${
                                            currentStatus === 'cancelled'
                                                ? 'text-red-600'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        Đã hủy
                                    </h3>
                                    {currentStatus === 'cancelled' && (
                                        <Badge className="bg-red-100 text-red-700">
                                            Hiện tại
                                        </Badge>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Đơn hàng đã bị hủy
                                </p>

                                {currentStatus !== 'cancelled' &&
                                    currentStatus !== 'completed' && (
                                        <Button
                                            onClick={() =>
                                                updateOrderStatus('cancelled')
                                            }
                                            disabled={loading}
                                            variant="destructive"
                                            size="sm"
                                            className="mt-2"
                                        >
                                            {loading
                                                ? 'Đang cập nhật...'
                                                : 'Hủy đơn hàng'}
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
