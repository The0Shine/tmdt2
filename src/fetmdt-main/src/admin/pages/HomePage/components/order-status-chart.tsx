'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { DashboardOverview } from '@/services/apiDashboard.service'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface OrderStatusChartProps {
    data: DashboardOverview['charts']['orderStatus']
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

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

export function OrderStatusChart({ data }: OrderStatusChartProps) {
    const chartData = data.map((item) => ({
        ...item,
        name: getStatusText(item._id),
        value: item.count,
    }))

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Trạng thái đơn hàng</CardTitle>
                <CardDescription>Phân bố trạng thái đơn hàng</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
