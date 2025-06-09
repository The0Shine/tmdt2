'use client'
import { useState, useEffect, useMemo } from 'react'
import {
    Search,
    Filter,
    Calendar,
    Download,
    MoreVertical,
    Eye,
    CreditCard,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { mainRepository } from '../../../utils/Repository'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
    id: number
    orderNumber: string
    date: string
    customer: string
    total: number
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
    paymentStatus: 'paid' | 'unpaid'
}

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPayment, setFilterPayment] = useState('all')
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [updatingPayment, setUpdatingPayment] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                const response = await mainRepository.get('/api/orders')

                if (response) {
                    console.log('Fetched orders:', response.data)

                    const formattedOrders = response.data.map((order: any) => {
                        return {
                            id: order._id,
                            orderNumber: order.orderNumber,
                            date: order.createdAt
                                ? new Date(order.createdAt).toLocaleString(
                                      'vi-VN',
                                  )
                                : 'N/A',
                            customer: order.user?.name || 'Khách hàng',
                            total: order.totalPrice,
                            status: order.status,
                            paymentStatus: order.isPaid ? 'paid' : 'unpaid',
                        }
                    })

                    setOrders(formattedOrders)
                } else {
                    setError('Không thể tải danh sách đơn hàng')
                    toast.error('Không thể tải danh sách đơn hàng')
                }
            } catch (err) {
                console.error('Error fetching orders:', err)
                setError('Đã xảy ra lỗi khi tải danh sách đơn hàng')
                toast.error('Đã xảy ra lỗi khi tải danh sách đơn hàng')
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    // Cập nhật trạng thái thanh toán
    const updatePaymentStatus = async (
        orderId: string,
        newPaymentStatus: 'paid' | 'unpaid',
    ) => {
        try {
            setUpdatingPayment(orderId)

            const response = await mainRepository.put(
                `/api/orders/${orderId}/pay`,
                {
                    isPaid: newPaymentStatus === 'paid',
                },
            )

            if (response) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id.toString() === orderId
                            ? { ...order, paymentStatus: newPaymentStatus }
                            : order,
                    ),
                )
                toast.success(
                    `Đã cập nhật trạng thái thanh toán thành ${newPaymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}`,
                )
            } else {
                toast.error('Không thể cập nhật trạng thái thanh toán')
            }
        } catch (error) {
            console.error('Error updating payment status:', error)
            toast.error('Đã xảy ra lỗi khi cập nhật trạng thái thanh toán')
        } finally {
            setUpdatingPayment(null)
        }
    }

    // Lọc dữ liệu dựa trên trạng thái và tìm kiếm
    const filteredData = useMemo(() => {
        let filtered = [...orders]

        if (filterStatus !== 'all') {
            filtered = filtered.filter((order) => order.status === filterStatus)
        }

        if (filterPayment !== 'all') {
            filtered = filtered.filter(
                (order) => order.paymentStatus === filterPayment,
            )
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (order) =>
                    order.orderNumber.toLowerCase().includes(searchLower) ||
                    order.customer.toLowerCase().includes(searchLower) ||
                    order.date.toLowerCase().includes(searchLower),
            )
        }

        return filtered
    }, [orders, filterStatus, filterPayment, searchTerm])

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = filteredData.slice(startIndex, endIndex)

    // Handle row selection
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(currentData.map((order) => order.id.toString()))
        } else {
            setSelectedRows([])
        }
    }

    const handleSelectRow = (orderId: string, checked: boolean) => {
        if (checked) {
            setSelectedRows((prev) => [...prev, orderId])
        } else {
            setSelectedRows((prev) => prev.filter((id) => id !== orderId))
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: {
                variant: 'secondary' as const,
                text: 'Chờ xử lý',
                className: 'bg-yellow-100 text-yellow-700',
            },
            processing: {
                variant: 'default' as const,
                text: 'Đang xử lý',
                className: 'bg-blue-100 text-blue-700',
            },
            completed: {
                variant: 'default' as const,
                text: 'Hoàn thành',
                className: 'bg-green-100 text-green-700',
            },
            cancelled: {
                variant: 'destructive' as const,
                text: 'Đã hủy',
                className: 'bg-red-100 text-red-700',
            },
        }

        const config = statusConfig[status as keyof typeof statusConfig]
        return <Badge className={config.className}>{config.text}</Badge>
    }

    const getPaymentBadge = (paymentStatus: string) => {
        return paymentStatus === 'paid' ? (
            <Badge className="bg-green-100 text-green-700">Đã thanh toán</Badge>
        ) : (
            <Badge className="bg-red-100 text-red-700">Chưa thanh toán</Badge>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Đơn hàng
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Đơn hàng</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Danh sách đơn hàng</CardTitle>
                        <div className="flex space-x-2">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Xuất Excel
                            </Button>
                            <Button>In đơn hàng</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Tìm theo mã đơn/tên khách hàng"
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                    Trạng thái:
                                </span>
                                <Select
                                    value={filterStatus}
                                    onValueChange={setFilterStatus}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tất cả
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Chờ xử lý
                                        </SelectItem>
                                        <SelectItem value="processing">
                                            Đang xử lý
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Hoàn thành
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Đã hủy
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                    Thanh toán:
                                </span>
                                <Select
                                    value={filterPayment}
                                    onValueChange={setFilterPayment}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tất cả
                                        </SelectItem>
                                        <SelectItem value="paid">
                                            Đã thanh toán
                                        </SelectItem>
                                        <SelectItem value="unpaid">
                                            Chưa thanh toán
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="outline">
                                <Calendar className="mr-2 h-4 w-4" />
                                Thời gian
                            </Button>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Lọc khác
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            Đang tải dữ liệu...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={
                                                        selectedRows.length ===
                                                            currentData.length &&
                                                        currentData.length > 0
                                                    }
                                                    onCheckedChange={
                                                        handleSelectAll
                                                    }
                                                />
                                            </TableHead>
                                            <TableHead>Mã đơn hàng</TableHead>
                                            <TableHead>Ngày đặt</TableHead>
                                            <TableHead>Khách hàng</TableHead>
                                            <TableHead>Tổng tiền</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Thanh toán</TableHead>
                                            <TableHead className="w-32">
                                                Thao tác
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentData.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={8}
                                                    className="py-8 text-center text-gray-500"
                                                >
                                                    Không có đơn hàng nào
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            currentData.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedRows.includes(
                                                                order.id.toString(),
                                                            )}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                handleSelectRow(
                                                                    order.id.toString(),
                                                                    checked as boolean,
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {order.orderNumber}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.date}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.customer}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.total.toLocaleString()}
                                                        đ
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            order.status,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            {getPaymentBadge(
                                                                order.paymentStatus,
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    updatePaymentStatus(
                                                                        order.id.toString(),
                                                                        order.paymentStatus ===
                                                                            'paid'
                                                                            ? 'unpaid'
                                                                            : 'paid',
                                                                    )
                                                                }
                                                                disabled={
                                                                    updatingPayment ===
                                                                    order.id.toString()
                                                                }
                                                                className="h-6 w-6 p-0"
                                                            >
                                                                <CreditCard className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    to={`/admin/orders/${order.id}`}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    >
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        asChild
                                                                    >
                                                                        <Link
                                                                            to={`/admin/orders/${order.id}`}
                                                                        >
                                                                            Xem
                                                                            chi
                                                                            tiết
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        In đơn
                                                                        hàng
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        Xuất PDF
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Hiển thị {startIndex + 1} đến{' '}
                                        {Math.min(
                                            endIndex,
                                            filteredData.length,
                                        )}{' '}
                                        trong tổng số {filteredData.length} đơn
                                        hàng
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1),
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            Trước
                                        </Button>
                                        <div className="flex items-center space-x-1">
                                            {Array.from(
                                                { length: totalPages },
                                                (_, i) => i + 1,
                                            ).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={
                                                        currentPage === page
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        setCurrentPage(page)
                                                    }
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Sau
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
