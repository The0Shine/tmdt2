'use client'

import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { RevenueChartData } from '@/services/apiDashboard.service'
import { mainRepository } from '@/utils/Repository'

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
}

export function RevenueChart() {
    const [period, setPeriod] = useState('7days')
    const [data, setData] = useState<RevenueChartData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchRevenueChart = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await mainRepository.get<RevenueChartData>(
                `/api/dashboard/revenue-chart?period=${period}`,
            )
            console.log('Revenue chart data:', response)

            setData(response.data)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch revenue chart data',
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRevenueChart()
    }, [period])

    if (loading) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Biểu đồ doanh thu</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[350px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Biểu đồ doanh thu</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[350px] items-center justify-center text-red-500">
                        Lỗi: {error}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Biểu đồ doanh thu</CardTitle>
                    <CardDescription>Doanh thu theo thời gian</CardDescription>
                </div>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7days">7 ngày qua</SelectItem>
                        <SelectItem value="30days">30 ngày qua</SelectItem>
                        <SelectItem value="12months">12 tháng qua</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data?.chartData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return period === '12months'
                                    ? `${date.getMonth() + 1}/${date.getFullYear()}`
                                    : `${date.getDate()}/${date.getMonth() + 1}`
                            }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                name === 'revenue'
                                    ? formatCurrency(value)
                                    : value,
                                name === 'revenue' ? 'Doanh thu' : 'Đơn hàng',
                            ]}
                            labelFormatter={(value) =>
                                `Ngày: ${formatDate(value)}`
                            }
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
