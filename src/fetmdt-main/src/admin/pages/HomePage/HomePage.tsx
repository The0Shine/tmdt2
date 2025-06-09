'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { DashboardOverview } from '@/services/apiDashboard.service'
import { mainRepository } from '@/utils/Repository'
import { LowStockAlerts } from './components/low-stock-alerts'
import { OrderStatusChart } from './components/order-status-chart'
import { OverviewStats } from './components/overview-stats'
import { RecentOrders } from './components/recent-order'
import { RevenueChart } from './components/revenue-chart'
import { TopProductsChart } from './components/top-products-chart'

export const HomePage = () => {
    const [data, setData] = useState<DashboardOverview | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await mainRepository.get<DashboardOverview>(
                '/api/dashboard/overview',
            )
            console.log('Dashboard data:', response.data)

            setData(response.data)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch dashboard data',
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="mb-4 text-red-500">Lỗi: {error}</p>
                    <Button onClick={fetchDashboardData}>Thử lại</Button>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Không có dữ liệu</p>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchDashboardData}
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        Làm mới
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                {/* <TabsList>
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="analytics">Phân tích</TabsTrigger>
                    <TabsTrigger value="reports">Báo cáo</TabsTrigger>
                </TabsList> */}

                <TabsContent value="overview" className="space-y-4">
                    {/* Stats Cards */}
                    <OverviewStats data={data.stats} />

                    {/* Charts */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <RevenueChart />
                        <OrderStatusChart data={data.charts.orderStatus} />
                    </div>

                    {/* Recent Activity & Alerts */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <RecentOrders data={data.recent.orders} />
                        <LowStockAlerts data={data.alerts.lowStockProducts} />
                    </div>

                    {/* Top Products */}
                    <TopProductsChart data={data.charts.topProducts} />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Tính năng phân tích đang được phát triển...
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                    <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Tính năng báo cáo đang được phát triển...
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
