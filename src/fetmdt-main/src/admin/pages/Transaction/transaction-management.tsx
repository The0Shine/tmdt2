'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomPagination } from '@/components/ui/custom-pagination'
import {
    Search,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Eye,
    AlertCircle,
    Download,
    Package,
    ShoppingCart,
    Info,
} from 'lucide-react'
import {
    getTransactions,
    getTransactionStats,
} from '@/services/apiTransaction.service'
import {
    ITransaction,
    TransactionStats,
    TransactionFilters,
} from '@/types/transaction'

export default function TransactionManagement() {
    // State management
    const [transactions, setTransactions] = useState<ITransaction[]>([])
    const [stats, setStats] = useState<TransactionStats | null>(null)
    const [filters, setFilters] = useState<TransactionFilters>({
        search: '',
        type: 'all',
        category: 'all',
        paymentMethod: 'all',
        autoCreated: 'all',
    })

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [totalRows, setTotalRows] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    // Loading and error states
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] =
        useState<ITransaction | null>(null)

    // Load data on component mount and when filters change
    useEffect(() => {
        loadTransactions()
    }, [currentPage, filters])

    useEffect(() => {
        loadStats()
    }, [])

    const loadTransactions = async () => {
        try {
            setLoading(true)
            setError(null)

            const params: any = {
                page: currentPage,
                limit: itemsPerPage,
                search: filters.search || undefined,
            }

            if (filters.type !== 'all') params.type = filters.type
            if (filters.category !== 'all') params.category = filters.category
            if (filters.paymentMethod !== 'all')
                params.paymentMethod = filters.paymentMethod
            if (filters.autoCreated !== 'all')
                params.autoCreated = filters.autoCreated
            if (filters.startDate) params.startDate = filters.startDate
            if (filters.endDate) params.endDate = filters.endDate
            if (filters.minAmount) params.minAmount = filters.minAmount
            if (filters.maxAmount) params.maxAmount = filters.maxAmount

            const response = await getTransactions(params)

            setTransactions(response.data)
            setTotalRows(response.total)
            setTotalPages(response.pagination.totalPages)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Có lỗi xảy ra khi tải dữ liệu giao dịch',
            )
            console.error('Error loading transactions:', err)
        } finally {
            setLoading(false)
        }
    }

    const loadStats = async () => {
        try {
            const response = await getTransactionStats()
            if (response) {
                setStats(response.data)
            }
        } catch (err) {
            console.error('Error loading transaction stats:', err)
        }
    }

    // Format functions
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN')
    }

    // Handle functions
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFilters({ ...filters, search: value })
        setCurrentPage(1)
    }

    const handleFilterChange = (
        key: keyof TransactionFilters,
        value: string,
    ) => {
        setFilters({ ...filters, [key]: value })
        setCurrentPage(1)
    }

    const handleViewDetail = (transaction: ITransaction) => {
        setSelectedTransaction(transaction)
        setIsDetailModalOpen(true)
    }

    // Render functions
    const renderTypeBadge = (type: string) => {
        switch (type) {
            case 'income':
                return (
                    <Badge className="border-green-200 bg-green-100 text-green-700">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Thu
                    </Badge>
                )
            case 'expense':
                return (
                    <Badge className="border-red-200 bg-red-100 text-red-700">
                        <TrendingDown className="mr-1 h-3 w-3" />
                        Chi
                    </Badge>
                )
            default:
                return <Badge variant="outline">{type}</Badge>
        }
    }

    const renderCategoryBadge = (category: string) => {
        switch (category) {
            case 'order':
                return (
                    <Badge className="border-blue-200 bg-blue-100 text-blue-700">
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Đơn hàng
                    </Badge>
                )
            case 'stock':
                return (
                    <Badge className="border-purple-200 bg-purple-100 text-purple-700">
                        <Package className="mr-1 h-3 w-3" />
                        Kho
                    </Badge>
                )
            default:
                return <Badge variant="outline">{category}</Badge>
        }
    }

    const renderPaymentMethodBadge = (method: string) => {
        const methods = {
            cash: 'Tiền mặt',
            bank_transfer: 'Chuyển khoản',
            credit_card: 'Thẻ tín dụng',
            e_wallet: 'Ví điện tử',
            other: 'Khác',
        }
        return (
            <Badge variant="outline">
                {methods[method as keyof typeof methods] || method}
            </Badge>
        )
    }

    const renderAutoCreatedBadge = (autoCreated?: boolean) => {
        if (autoCreated) {
            return (
                <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700">
                    <Info className="mr-1 h-3 w-3" />
                    Tự động
                </Badge>
            )
        }
        return (
            <Badge className="border-gray-200 bg-gray-100 text-gray-700">
                <Info className="mr-1 h-3 w-3" />
                Thủ công
            </Badge>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Quản lý giao dịch
                </h1>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Giao dịch</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 flex items-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <AlertCircle className="mr-2" size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Hôm nay
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(stats.today.netAmount)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {stats.today.transactionCount} giao dịch
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Thu từ đơn hàng
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(
                                            stats.thisMonth.orderIncome,
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Tháng này
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                    <ShoppingCart className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Chi cho kho
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(
                                            stats.thisMonth.stockExpense,
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Tháng này
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                                    <Package className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Lợi nhuận tháng
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(
                                            stats.thisMonth.netAmount,
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {stats.thisMonth.transactionCount} giao
                                        dịch
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Content */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100 bg-white pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl text-gray-900">
                                Danh sách giao dịch
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Xem tất cả giao dịch tự động từ đơn hàng và kho
                            </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={loadTransactions}
                                className="border-gray-300 hover:bg-gray-50"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Làm mới
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="bg-white p-6">
                    {/* Filters */}
                    <div className="mb-6 space-y-4">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Tìm theo mã giao dịch/mô tả"
                                    className="border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                                    value={filters.search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.type}
                                    onValueChange={(value) =>
                                        handleFilterChange('type', value)
                                    }
                                >
                                    <SelectTrigger className="w-32 border-gray-300">
                                        <SelectValue placeholder="Loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tất cả
                                        </SelectItem>
                                        <SelectItem value="income">
                                            Thu
                                        </SelectItem>
                                        <SelectItem value="expense">
                                            Chi
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.category}
                                    onValueChange={(value) =>
                                        handleFilterChange('category', value)
                                    }
                                >
                                    <SelectTrigger className="w-32 border-gray-300">
                                        <SelectValue placeholder="Danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tất cả
                                        </SelectItem>
                                        <SelectItem value="order">
                                            Đơn hàng
                                        </SelectItem>
                                        <SelectItem value="stock">
                                            Kho
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.autoCreated}
                                    onValueChange={(value) =>
                                        handleFilterChange('autoCreated', value)
                                    }
                                >
                                    <SelectTrigger className="w-32 border-gray-300">
                                        <SelectValue placeholder="Nguồn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tất cả
                                        </SelectItem>
                                        <SelectItem value="true">
                                            Tự động
                                        </SelectItem>
                                        <SelectItem value="false">
                                            Thủ công
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm text-gray-600">
                                    Từ ngày:
                                </Label>
                                <Input
                                    type="date"
                                    className="w-40 border-gray-300"
                                    value={filters.startDate || ''}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'startDate',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-sm text-gray-600">
                                    Đến ngày:
                                </Label>
                                <Input
                                    type="date"
                                    className="w-40 border-gray-300"
                                    value={filters.endDate || ''}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'endDate',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-sm text-gray-600">
                                    Từ:
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    className="w-32 border-gray-300"
                                    value={filters.minAmount || ''}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'minAmount',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-sm text-gray-600">
                                    Đến:
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    className="w-32 border-gray-300"
                                    value={filters.maxAmount || ''}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'maxAmount',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <Table>
                            <TableHeader className="bg-[#F8F9FB]">
                                <TableRow>
                                    <TableHead className="font-semibold text-gray-700">
                                        Mã giao dịch
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        Loại
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        Danh mục
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        Mô tả
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        Số tiền
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        Nguồn
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        Ngày giao dịch
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700">
                                        Thao tác
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-24" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-20" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-20" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-40" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-24" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-20" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-24" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-24" />
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )
                                ) : transactions.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <TableRow
                                            key={transaction._id}
                                            className="hover:bg-[#F8F9FB]"
                                        >
                                            <TableCell className="font-medium text-gray-900">
                                                {transaction.transactionNumber ||
                                                    `#${transaction._id?.substring(0, 8)}`}
                                            </TableCell>
                                            <TableCell>
                                                {renderTypeBadge(
                                                    transaction.type,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {renderCategoryBadge(
                                                    transaction.category,
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-gray-600">
                                                {transaction.description}
                                            </TableCell>
                                            <TableCell
                                                className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                                            >
                                                {transaction.type === 'income'
                                                    ? '+'
                                                    : '-'}
                                                {formatCurrency(
                                                    transaction.amount,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {renderAutoCreatedBadge(
                                                    transaction.metadata
                                                        ?.autoCreated,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {formatDate(
                                                    transaction.transactionDate,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleViewDetail(
                                                                transaction,
                                                            )
                                                        }
                                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-24 text-center text-gray-500"
                                        >
                                            Không có giao dịch nào
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="mt-6"
                    />
                </CardContent>
            </Card>

            {/* Transaction Detail Modal */}
            <Dialog
                open={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết giao dịch</DialogTitle>
                    </DialogHeader>

                    {selectedTransaction && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Mã giao dịch
                                    </Label>
                                    <p className="font-medium">
                                        {selectedTransaction.transactionNumber ||
                                            `#${selectedTransaction._id?.substring(0, 8)}`}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Loại giao dịch
                                    </Label>
                                    <div className="mt-1">
                                        {renderTypeBadge(
                                            selectedTransaction.type,
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Danh mục
                                    </Label>
                                    <div className="mt-1">
                                        {renderCategoryBadge(
                                            selectedTransaction.category,
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Nguồn tạo
                                    </Label>
                                    <div className="mt-1">
                                        {renderAutoCreatedBadge(
                                            selectedTransaction.metadata
                                                ?.autoCreated,
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Số tiền
                                    </Label>
                                    <p
                                        className={`text-lg font-bold ${
                                            selectedTransaction.type ===
                                            'income'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {selectedTransaction.type === 'income'
                                            ? '+'
                                            : '-'}
                                        {formatCurrency(
                                            selectedTransaction.amount,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Phương thức thanh toán
                                    </Label>
                                    <div className="mt-1">
                                        {renderPaymentMethodBadge(
                                            selectedTransaction.paymentMethod,
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm text-gray-600">
                                    Mô tả
                                </Label>
                                <p className="font-medium">
                                    {selectedTransaction.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Ngày giao dịch
                                    </Label>
                                    <p className="font-medium">
                                        {formatDate(
                                            selectedTransaction.transactionDate,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Ngày tạo
                                    </Label>
                                    <p className="font-medium">
                                        {formatDate(
                                            selectedTransaction.createdAt,
                                        )}
                                    </p>
                                </div>
                            </div>

                            {selectedTransaction.notes && (
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Ghi chú
                                    </Label>
                                    <p className="font-medium">
                                        {selectedTransaction.notes}
                                    </p>
                                </div>
                            )}

                            {selectedTransaction.relatedOrder && (
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Đơn hàng liên quan
                                    </Label>
                                    <p className="font-medium">
                                        {typeof selectedTransaction.relatedOrder ===
                                        'object'
                                            ? selectedTransaction.relatedOrder
                                                  .orderNumber
                                            : selectedTransaction.relatedOrder}
                                    </p>
                                </div>
                            )}

                            {selectedTransaction.relatedVoucher && (
                                <div>
                                    <Label className="text-sm text-gray-600">
                                        Phiếu kho liên quan
                                    </Label>
                                    <p className="font-medium">
                                        {typeof selectedTransaction.relatedVoucher ===
                                        'object'
                                            ? selectedTransaction.relatedVoucher
                                                  .voucherNumber
                                            : selectedTransaction.relatedVoucher}
                                    </p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm text-gray-600">
                                    Người tạo
                                </Label>
                                <p className="font-medium">
                                    {typeof selectedTransaction.createdBy ===
                                    'object'
                                        ? selectedTransaction.createdBy.lastName
                                        : 'Admin'}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDetailModalOpen(false)}
                        >
                            Đóng
                        </Button>
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">
                            <Download className="mr-2 h-4 w-4" />
                            Tải xuống
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
