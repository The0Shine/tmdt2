'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardOverview } from '@/services/apiDashboard.service'

interface RecentOrdersProps {
    data: DashboardOverview['recent']['orders']
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-500'
        case 'pending':
            return 'bg-yellow-500'
        case 'processing':
            return 'bg-blue-500'
        case 'cancelled':
            return 'bg-red-500'
        default:
            return 'bg-gray-500'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'completed':
            return 'Hoàn thành'
        case 'pending':
            return 'Chờ xử lý'
        case 'processing':
            return 'Đang xử lý'
        case 'cancelled':
            return 'Đã hủy'
        default:
            return status
    }
}

export function RecentOrders({ data }: RecentOrdersProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <CardDescription>Các đơn hàng mới nhất</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">
                                        {order.customer}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(order.status)}>
                                    {getStatusText(order.status)}
                                </Badge>
                                <p className="text-sm font-medium">
                                    {formatCurrency(order.total)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
