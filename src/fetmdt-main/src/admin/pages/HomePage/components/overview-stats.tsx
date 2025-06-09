'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardOverview } from '@/services/apiDashboard.service'
import {
    TrendingUp,
    TrendingDown,
    Users,
    Package,
    ShoppingCart,
    DollarSign,
} from 'lucide-react'

interface OverviewStatsProps {
    data: DashboardOverview['stats']
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

export function OverviewStats({ data }: OverviewStatsProps) {
    const stats = [
        {
            title: 'Tổng doanh thu',
            value: formatCurrency(data.totalRevenue),
            icon: DollarSign,
            trend: {
                value: data.revenueGrowth,
                isPositive: data.revenueGrowth > 0,
            },
            description: `${data.revenueGrowth > 0 ? '+' : ''}${data.revenueGrowth}% so với tháng trước`,
        },
        {
            title: 'Đơn hàng',
            value: data.totalOrders.toLocaleString(),
            icon: ShoppingCart,
            description: `${data.todayOrders} đơn hôm nay`,
        },
        {
            title: 'Sản phẩm',
            value: data.totalProducts.toLocaleString(),
            icon: Package,
            description: 'Tổng số sản phẩm',
        },
        {
            title: 'Khách hàng',
            value: data.totalUsers.toLocaleString(),
            icon: Users,
            description: 'Tổng số người dùng',
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-muted-foreground text-xs">
                            {stat.trend ? (
                                <span
                                    className={`flex items-center ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {stat.trend.isPositive ? (
                                        <TrendingUp className="mr-1 h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="mr-1 h-3 w-3" />
                                    )}
                                    {stat.description}
                                </span>
                            ) : (
                                stat.description
                            )}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
