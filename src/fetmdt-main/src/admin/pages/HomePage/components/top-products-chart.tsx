'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { DashboardOverview } from '@/services/apiDashboard.service'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface TopProductsChartProps {
    data: DashboardOverview['charts']['topProducts']
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

export function TopProductsChart({ data }: TopProductsChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
                <CardDescription>
                    Top sản phẩm có doanh số cao nhất
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                name === 'revenue'
                                    ? formatCurrency(value)
                                    : value,
                                name === 'revenue' ? 'Doanh thu' : 'Đã bán',
                            ]}
                        />
                        <Bar dataKey="sold" fill="#8884d8" name="sold" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
