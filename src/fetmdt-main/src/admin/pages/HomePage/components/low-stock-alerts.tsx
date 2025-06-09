'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import { DashboardOverview } from '@/services/apiDashboard.service'

interface LowStockAlertsProps {
    data: DashboardOverview['alerts']['lowStockProducts']
}

export function LowStockAlerts({ data }: LowStockAlertsProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                    Cảnh báo tồn kho
                </CardTitle>
                <CardDescription>Sản phẩm sắp hết hàng</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                            Không có sản phẩm nào sắp hết hàng
                        </p>
                    ) : (
                        data.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {product.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Còn lại: {product.quantity} sản phẩm
                                    </p>
                                </div>
                                <Badge variant="destructive">Sắp hết</Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
