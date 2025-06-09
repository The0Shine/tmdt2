import { mainRepository } from '@/utils/Repository'

export interface DashboardOverview {
    stats: {
        totalUsers: number
        totalProducts: number
        totalOrders: number
        totalRevenue: number
        todayOrders: number
        monthlyRevenue: number
        revenueGrowth: number
    }
    charts: {
        orderStatus: Array<{ _id: string; count: number }>
        topProducts: Array<{ name: string; sold: number; revenue: number }>
    }
    alerts: {
        lowStockProducts: Array<{ id: string; name: string; quantity: number }>
    }
    recent: {
        orders: Array<{
            id: string
            customer: string
            total: number
            status: string
            createdAt: string
        }>
    }
}

export interface RevenueChartData {
    chartData: Array<{
        date: string
        revenue: number
        orders: number
    }>
    period: string
}

export interface ProductStats {
    overview: {
        totalProducts: number
        totalStock: number
        totalValue: number
        lowStock: number
        outOfStock: number
    }
    categories: Array<{
        _id: string
        count: number
        totalValue: number
    }>
    topSelling: Array<{
        id: string
        name: string
        sold: number
        revenue: number
        image?: string
    }>
    recentlyAdded: Array<{
        _id: string
        name: string
        price: number
        quantity: number
        createdAt: string
    }>
}

export interface InventoryStats {
    summary: {
        pendingVouchers: number
        monthlyImports: number
        monthlyExports: number
        criticalStockCount: number
    }
    recentMovements: Array<{
        id: string
        type: string
        voucherNumber: string
        status: string
        totalValue: number
        createdBy: string
        createdAt: string
    }>
    criticalStock: Array<{
        id: string
        name: string
        quantity: number
    }>
    monthlyStats: Array<{
        _id: string
        count: number
        totalValue: number
    }>
}

export const dashboardApi = {
    async getOverview() {
        const response = await mainRepository.get<DashboardOverview>(
            '/api/dashboard/overview',
        )
        return response
    },

    async getRevenueChart(period: string = '7days') {
        const response = await mainRepository.get<RevenueChartData>(
            `/api/dashboard/revenue-chart?period=${period}`,
        )
        return response
    },

    async getProductStats() {
        const response = await mainRepository.get<ProductStats>(
            '/api/dashboard/product-stats',
        )
        return response
    },

    async getInventoryStats() {
        const response = await mainRepository.get<InventoryStats>(
            '/api/dashboard/inventory-stats',
        )
        return response
    },
}
