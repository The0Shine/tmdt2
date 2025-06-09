'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomPagination } from '@/components/ui/custom-pagination'
import {
    Search,
    RefreshCw,
    FileDown,
    FileUp,
    Package,
    ClipboardList,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit,
    Trash2,
    Eye,
    ArrowUpDown,
    Download,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Clock,
    History,
} from 'lucide-react'
import { getProducts } from '../../../services/apiProduct.service'
import {
    getStockVouchers,
    approveStockVoucher,
    rejectStockVoucher,
    deleteStockVoucher,
    getStockHistory,
} from '../../../services/apiStock.service'
import type { IProduct } from '../../interfaces/product.interface'
import type {
    IStockVoucher,
    IStockHistory,
} from '../../interfaces/stock.interface'
import { toast } from 'sonner'
import StockVoucherDetailModal from './components/stock-voucher-detail-modal'
import StockVoucherModal from './components/stock-voucher-modal'

export default function InventoryManagement() {
    // Tab state
    const [activeTab, setActiveTab] = useState('products')

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN')
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    // Products state
    const [products, setProducts] = useState<IProduct[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterCategory, setFilterCategory] = useState('all')

    // Stock vouchers state
    const [stockVouchers, setStockVouchers] = useState<IStockVoucher[]>([])
    const [voucherSearchTerm, setVoucherSearchTerm] = useState('')
    const [voucherFilterType, setVoucherFilterType] = useState('all')
    const [voucherFilterStatus, setVoucherFilterStatus] = useState('all')
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
    const [currentVoucher, setCurrentVoucher] = useState<any | null>(null)
    const [isVoucherDetailModalOpen, setIsVoucherDetailModalOpen] =
        useState(false)
    const [selectedVoucher, setSelectedVoucher] =
        useState<IStockVoucher | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null)

    // Stock history state
    const [stockHistory, setStockHistory] = useState<IStockHistory[]>([])
    const [historySearchTerm, setHistorySearchTerm] = useState('')
    const [historyFilterType, setHistoryFilterType] = useState('all')

    // Pagination state
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalRows, setTotalRows] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    // Voucher pagination
    const [voucherPage, setVoucherPage] = useState(1)
    const [voucherLimit, setVoucherLimit] = useState(10)
    const [totalVouchers, setTotalVouchers] = useState(0)
    const [totalVoucherPages, setTotalVoucherPages] = useState(0)

    // History pagination
    const [historyPage, setHistoryPage] = useState(1)
    const [historyLimit, setHistoryLimit] = useState(10)
    const [totalHistory, setTotalHistory] = useState(0)
    const [totalHistoryPages, setTotalHistoryPages] = useState(0)

    // Loading and error states
    const [loading, setLoading] = useState(false)
    const [vouchersLoading, setVouchersLoading] = useState(false)
    const [historyLoading, setHistoryLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch products on component mount and when filters change
    useEffect(() => {
        if (activeTab === 'products') {
            loadProducts()
        }
    }, [page, limit, searchTerm, filterStatus, filterCategory, activeTab])

    // Fetch stock vouchers when tab changes or filters change
    useEffect(() => {
        if (activeTab === 'vouchers') {
            loadStockVouchers()
        }
    }, [
        voucherPage,
        voucherLimit,
        voucherSearchTerm,
        voucherFilterType,
        voucherFilterStatus,
        activeTab,
    ])

    // Fetch stock history when tab changes or filters change
    useEffect(() => {
        if (activeTab === 'history') {
            loadStockHistory()
        }
    }, [
        historyPage,
        historyLimit,
        historySearchTerm,
        historyFilterType,
        activeTab,
    ])

    const loadProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            const params: any = {
                page,
                limit,
                search: searchTerm || undefined,
            }

            if (filterStatus !== 'all') {
                params.status = filterStatus
            }
            if (filterCategory !== 'all') {
                params.category = filterCategory
            }

            const response = await getProducts(params)
            if (response) {
                setProducts(response.data)
                setTotalRows(response.total)
                setTotalPages(response.pagination.totalPages)
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Có lỗi xảy ra khi tải dữ liệu sản phẩm',
            )
            console.error('Error loading products:', err)
        } finally {
            setLoading(false)
        }
    }

    const loadStockVouchers = async () => {
        try {
            setVouchersLoading(true)
            setError(null)

            const params: any = {
                page: voucherPage,
                limit: voucherLimit,
                search: voucherSearchTerm || undefined,
            }

            if (voucherFilterType !== 'all') {
                params.type = voucherFilterType
            }

            if (voucherFilterStatus !== 'all') {
                params.status = voucherFilterStatus
            }

            const response = await getStockVouchers(params)

            setStockVouchers(response.data)
            setTotalVouchers(response.total)
            setTotalVoucherPages(response.pagination.totalPages)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Có lỗi xảy ra khi tải dữ liệu phiếu kho',
            )
            console.error('Error loading stock vouchers:', err)
        } finally {
            setVouchersLoading(false)
        }
    }

    const loadStockHistory = async () => {
        try {
            setHistoryLoading(true)
            setError(null)

            const params: any = {
                page: historyPage,
                limit: historyLimit,
                search: historySearchTerm || undefined,
            }

            if (historyFilterType !== 'all') {
                params.type = historyFilterType
            }

            const response = await getStockHistory(params)

            setStockHistory(response.data.data)
            setTotalHistory(response.data.total)
            setTotalHistoryPages(response.data.pagination.totalPages)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Có lỗi xảy ra khi tải lịch sử kho',
            )
            console.error('Error loading stock history:', err)
        } finally {
            setHistoryLoading(false)
        }
    }

    // Xử lý tìm kiếm sản phẩm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setPage(1)
    }

    // Xử lý tìm kiếm phiếu kho
    const handleVoucherSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setVoucherSearchTerm(value)
        setVoucherPage(1)
    }

    // Xử lý tìm kiếm lịch sử
    const handleHistorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setHistorySearchTerm(value)
        setHistoryPage(1)
    }

    // Lấy danh sách danh mục duy nhất
    const categories = useMemo(() => {
        const uniqueCategories = new Set(
            products.map((product) => product.category),
        )
        return Array.from(uniqueCategories)
    }, [products])

    // Mở modal nhập kho
    const handleOpenImportModal = () => {
        setCurrentVoucher({
            type: 'import',
            reason: '',
            items: [],
            status: 'pending',
        })
        setIsVoucherModalOpen(true)
    }

    // Mở modal xuất kho
    const handleOpenExportModal = () => {
        setCurrentVoucher({
            type: 'export',
            reason: '',
            items: [],
            status: 'pending',
        })
        setIsVoucherModalOpen(true)
    }

    // Xử lý lưu phiếu kho với real-time updates
    const handleSaveVoucher = async (voucher: any) => {
        try {
            // Đóng modal
            setIsVoucherModalOpen(false)

            // Reload data để phản ánh thay đổi
            await Promise.all([
                loadStockVouchers(),
                loadProducts(), // Reload products để cập nhật số lượng tồn kho nếu auto-approved
                loadStockHistory(), // Reload history nếu voucher được auto-approved
            ])
        } catch (err) {
            console.error('Error in handleSaveVoucher:', err)
            toast.error('Có lỗi xảy ra khi cập nhật dữ liệu')
        }
    }

    // Xử lý xem chi tiết phiếu kho
    const handleViewVoucherDetail = (voucher: IStockVoucher) => {
        setSelectedVoucher(voucher)
        setIsVoucherDetailModalOpen(true)
    }

    // Xử lý phê duyệt phiếu kho với real-time updates
    const handleApproveVoucher = async (voucherId: string) => {
        try {
            const response = await approveStockVoucher(voucherId)
            console.log('Approve response:', response)

            if (response) {
                toast.success('Phê duyệt phiếu kho thành công!')

                // Reload tất cả dữ liệu liên quan
                await Promise.all([
                    loadStockVouchers(),
                    loadProducts(), // Cập nhật số lượng sản phẩm
                    loadStockHistory(), // Cập nhật lịch sử
                ])
            }
        } catch (err) {
            console.error('Error approving voucher:', err)
            console.log(1111)
        }
    }

    // Xử lý từ chối phiếu kho
    const handleRejectVoucher = async (voucherId: string) => {
        try {
            await rejectStockVoucher(voucherId)
            toast.success('Từ chối phiếu kho thành công!')
            loadStockVouchers()
        } catch (err) {
            console.error('Error rejecting voucher:', err)
            toast.error('Có lỗi xảy ra khi từ chối phiếu')
        }
    }

    // Xử lý xóa phiếu kho
    const handleDeleteVoucher = async () => {
        if (!voucherToDelete) return

        try {
            await deleteStockVoucher(voucherToDelete)
            toast.success('Đã xóa phiếu kho')
            setIsDeleteDialogOpen(false)
            setVoucherToDelete(null)
            loadStockVouchers()
        } catch (err) {
            console.error('Error deleting voucher:', err)
            toast.error('Có lỗi xảy ra khi xóa phiếu')
        }
    }

    // Xử lý thay đổi trang
    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    // Xử lý thay đổi trang phiếu kho
    const handleVoucherPageChange = (newPage: number) => {
        setVoucherPage(newPage)
    }

    // Xử lý thay đổi trang lịch sử
    const handleHistoryPageChange = (newPage: number) => {
        setHistoryPage(newPage)
    }

    // Render badge trạng thái sản phẩm
    const renderStatusBadge = (status: string, quantity = 0, minStock = 0) => {
        if (quantity === 0) {
            return (
                <Badge className="border-red-200 bg-red-100 text-red-700 hover:bg-red-100">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Hết hàng
                </Badge>
            )
        } else if (quantity <= minStock) {
            return (
                <Badge className="border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    Sắp hết
                </Badge>
            )
        } else {
            return (
                <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Còn hàng
                </Badge>
            )
        }
    }

    // Render badge trạng thái phiếu kho
    const renderVoucherStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge className="border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100">
                        <Clock className="mr-1 h-3 w-3" />
                        Chờ duyệt
                    </Badge>
                )
            case 'approved':
                return (
                    <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Đã duyệt
                    </Badge>
                )
            case 'rejected':
                return (
                    <Badge className="border-red-200 bg-red-100 text-red-700 hover:bg-red-100">
                        <XCircle className="mr-1 h-3 w-3" />
                        Đã từ chối
                    </Badge>
                )
            case 'cancelled':
                return (
                    <Badge className="border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-100">
                        Đã hủy
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    // Render badge loại phiếu kho
    const renderVoucherTypeBadge = (type: string) => {
        switch (type) {
            case 'import':
                return (
                    <Badge className="border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <FileDown className="mr-1 h-3 w-3" />
                        Nhập kho
                    </Badge>
                )
            case 'export':
                return (
                    <Badge className="border-purple-200 bg-purple-100 text-purple-700 hover:bg-purple-100">
                        <FileUp className="mr-1 h-3 w-3" />
                        Xuất kho
                    </Badge>
                )
            default:
                return <Badge variant="outline">{type}</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Quản lý kho
                </h1>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Quản lý kho</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 flex items-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <AlertCircle className="mr-2" size={20} />
                    <span>{error}</span>
                </div>
            )}

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="mb-6 grid w-full grid-cols-3 rounded-lg border border-gray-200 bg-white p-1">
                    <TabsTrigger
                        value="products"
                        className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                        <Package size={16} />
                        <span>Kho sản phẩm</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="vouchers"
                        className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                        <ClipboardList size={16} />
                        <span>Phiếu kho</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                        <History size={16} />
                        <span>Lịch sử</span>
                    </TabsTrigger>
                </TabsList>

                {/* Tab Kho sản phẩm */}
                <TabsContent value="products">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b border-gray-100 bg-white pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-900">
                                        Danh sách sản phẩm trong kho
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Quản lý tồn kho và thông tin sản phẩm
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="bg-white p-6">
                            <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Tìm theo tên/mã vạch"
                                        className="border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={handleSearch}
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
                                            <SelectTrigger className="w-40 border-gray-300">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Tất cả
                                                </SelectItem>
                                                <SelectItem value="in-stock">
                                                    Còn hàng
                                                </SelectItem>
                                                <SelectItem value="out-of-stock">
                                                    Hết hàng
                                                </SelectItem>
                                                <SelectItem value="low-stock">
                                                    Sắp hết
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">
                                            Danh mục:
                                        </span>
                                        <Select
                                            value={filterCategory}
                                            onValueChange={setFilterCategory}
                                        >
                                            <SelectTrigger className="w-40 border-gray-300">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Tất cả
                                                </SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category}
                                                    >
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <Table>
                                    <TableHeader className="bg-[#F8F9FB]">
                                        <TableRow>
                                            <TableHead className="w-[250px] font-semibold text-gray-700">
                                                <div className="flex items-center space-x-1">
                                                    <span>Tên sản phẩm</span>
                                                    <ArrowUpDown className="h-3 w-3" />
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Danh mục
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Đơn vị
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Giá bán
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Giá vốn
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Tồn kho
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Trạng thái
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map(
                                                (_, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-[200px]" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-20" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-16" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-24" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-24" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-16" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-20" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-24" />
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )
                                        ) : products.length > 0 ? (
                                            products.map((product) => (
                                                <TableRow
                                                    key={product._id}
                                                    className="hover:bg-[#F8F9FB]"
                                                >
                                                    <TableCell className="font-medium text-gray-900">
                                                        {product.name}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {product.category}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {product.unit}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-900">
                                                        {formatCurrency(
                                                            product.price,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {formatCurrency(
                                                            product.costPrice ||
                                                                0,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-900">
                                                        {product.quantity}{' '}
                                                        {product.unit}
                                                    </TableCell>
                                                    <TableCell>
                                                        {renderStatusBadge(
                                                            product.status ||
                                                                'in-stock',
                                                            product.quantity,
                                                            10,
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={8}
                                                    className="h-24 text-center text-gray-500"
                                                >
                                                    Không có sản phẩm nào
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <CustomPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                className="mt-6"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab Phiếu kho */}
                <TabsContent value="vouchers">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b border-gray-100 bg-white pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-900">
                                        Phiếu kho
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Quản lý phiếu nhập, xuất kho và phê
                                        duyệt
                                    </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={handleOpenImportModal}
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Tạo phiếu nhập
                                    </Button>
                                    <Button
                                        onClick={handleOpenExportModal}
                                        className="bg-purple-600 text-white hover:bg-purple-700"
                                    >
                                        <FileUp className="mr-2 h-4 w-4" />
                                        Tạo phiếu xuất
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => loadStockVouchers()}
                                        className="border-gray-300 hover:bg-gray-50"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Làm mới
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="bg-white p-6">
                            <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Tìm theo mã phiếu/lý do"
                                        className="border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                                        value={voucherSearchTerm}
                                        onChange={handleVoucherSearch}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">
                                            Loại phiếu:
                                        </span>
                                        <Select
                                            value={voucherFilterType}
                                            onValueChange={setVoucherFilterType}
                                        >
                                            <SelectTrigger className="w-40 border-gray-300">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Tất cả
                                                </SelectItem>
                                                <SelectItem value="import">
                                                    Nhập kho
                                                </SelectItem>
                                                <SelectItem value="export">
                                                    Xuất kho
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">
                                            Trạng thái:
                                        </span>
                                        <Select
                                            value={voucherFilterStatus}
                                            onValueChange={
                                                setVoucherFilterStatus
                                            }
                                        >
                                            <SelectTrigger className="w-40 border-gray-300">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Tất cả
                                                </SelectItem>
                                                <SelectItem value="pending">
                                                    Chờ duyệt
                                                </SelectItem>
                                                <SelectItem value="approved">
                                                    Đã duyệt
                                                </SelectItem>
                                                <SelectItem value="rejected">
                                                    Đã từ chối
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Đã hủy
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <Table>
                                    <TableHeader className="bg-[#F8F9FB]">
                                        <TableRow>
                                            <TableHead className="font-semibold text-gray-700">
                                                Mã phiếu
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Loại phiếu
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Lý do
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Ngày tạo
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Người tạo
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Trạng thái
                                            </TableHead>
                                            <TableHead className="text-right font-semibold text-gray-700">
                                                Thao tác
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vouchersLoading ? (
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
                                                            <Skeleton className="h-6 w-40" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-24" />
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
                                                    </TableRow>
                                                ),
                                            )
                                        ) : stockVouchers.length > 0 ? (
                                            stockVouchers.map((voucher) => (
                                                <TableRow
                                                    key={voucher._id}
                                                    className="hover:bg-[#F8F9FB]"
                                                >
                                                    <TableCell className="font-medium text-gray-900">
                                                        {voucher.voucherNumber ||
                                                            `#${voucher._id?.substring(0, 8)}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {renderVoucherTypeBadge(
                                                            voucher.type,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate text-gray-600">
                                                        {voucher.reason}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {formatDate(
                                                            voucher.createdAt,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {typeof voucher.createdBy ===
                                                        'object'
                                                            ? voucher.createdBy
                                                                  .lastName
                                                            : 'Admin'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {renderVoucherStatusBadge(
                                                            voucher.status,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleViewVoucherDetail(
                                                                        voucher,
                                                                    )
                                                                }
                                                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                                title="Xem chi tiết"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>

                                                            {voucher.status ===
                                                                'pending' && (
                                                                <>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            handleApproveVoucher(
                                                                                voucher._id ||
                                                                                    '',
                                                                            )
                                                                        }
                                                                        className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                                        title="Phê duyệt"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            handleRejectVoucher(
                                                                                voucher._id ||
                                                                                    '',
                                                                            )
                                                                        }
                                                                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                        title="Từ chối"
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => {
                                                                            setVoucherToDelete(
                                                                                voucher._id ||
                                                                                    '',
                                                                            )
                                                                            setIsDeleteDialogOpen(
                                                                                true,
                                                                            )
                                                                        }}
                                                                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                        title="Xóa"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}

                                                            {voucher.status ===
                                                                'approved' && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                                                                    title="Tải xuống"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    className="h-24 text-center text-gray-500"
                                                >
                                                    Không có phiếu kho nào
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <CustomPagination
                                currentPage={voucherPage}
                                totalPages={totalVoucherPages}
                                onPageChange={handleVoucherPageChange}
                                className="mt-6"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab Lịch sử kho */}
                <TabsContent value="history">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b border-gray-100 bg-white pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-900">
                                        Lịch sử xuất nhập kho
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Theo dõi tất cả thay đổi tồn kho
                                    </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => loadStockHistory()}
                                        className="border-gray-300 hover:bg-gray-50"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Làm mới
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="bg-white p-6">
                            <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Tìm theo tên sản phẩm/mã phiếu"
                                        className="border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                                        value={historySearchTerm}
                                        onChange={handleHistorySearch}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">
                                            Loại:
                                        </span>
                                        <Select
                                            value={historyFilterType}
                                            onValueChange={setHistoryFilterType}
                                        >
                                            <SelectTrigger className="w-40 border-gray-300">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Tất cả
                                                </SelectItem>
                                                <SelectItem value="import">
                                                    Nhập kho
                                                </SelectItem>
                                                <SelectItem value="export">
                                                    Xuất kho
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <Table>
                                    <TableHeader className="bg-[#F8F9FB]">
                                        <TableRow>
                                            <TableHead className="font-semibold text-gray-700">
                                                Sản phẩm
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Loại
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Mã phiếu
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Tồn kho trước
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Thay đổi
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Tồn kho sau
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Lý do
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700">
                                                Thời gian
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {historyLoading ? (
                                            Array.from({ length: 5 }).map(
                                                (_, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-32" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-20" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-24" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-16" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-16" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-16" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-40" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-24" />
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )
                                        ) : stockHistory.length > 0 ? (
                                            stockHistory.map((history) => (
                                                <TableRow
                                                    key={history._id}
                                                    className="hover:bg-[#F8F9FB]"
                                                >
                                                    <TableCell className="font-medium text-gray-900">
                                                        {history.productName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {renderVoucherTypeBadge(
                                                            history.type,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-blue-600">
                                                        {history.voucherNumber}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {history.quantityBefore}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`font-medium ${
                                                                history.quantityChange >
                                                                0
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                            }`}
                                                        >
                                                            {history.quantityChange >
                                                            0
                                                                ? '+'
                                                                : ''}
                                                            {
                                                                history.quantityChange
                                                            }
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-900">
                                                        {history.quantityAfter}
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate text-gray-600">
                                                        {history.reason}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {formatDate(
                                                            history.createdAt,
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={8}
                                                    className="h-24 text-center text-gray-500"
                                                >
                                                    Không có lịch sử nào
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <CustomPagination
                                currentPage={historyPage}
                                totalPages={totalHistoryPages}
                                onPageChange={handleHistoryPageChange}
                                className="mt-6"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal phiếu kho */}
            {isVoucherModalOpen && (
                <StockVoucherModal
                    isOpen={isVoucherModalOpen}
                    onClose={() => setIsVoucherModalOpen(false)}
                    voucher={currentVoucher}
                    onSave={handleSaveVoucher}
                    products={products}
                />
            )}

            {/* Modal chi tiết phiếu kho */}
            {isVoucherDetailModalOpen && selectedVoucher && (
                <StockVoucherDetailModal
                    isOpen={isVoucherDetailModalOpen}
                    onClose={() => setIsVoucherDetailModalOpen(false)}
                    voucher={selectedVoucher}
                />
            )}

            {/* Dialog xác nhận xóa */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Xác nhận xóa phiếu kho
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa phiếu kho này? Hành động
                            này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteVoucher}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
