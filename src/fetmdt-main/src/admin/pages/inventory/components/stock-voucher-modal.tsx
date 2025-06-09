'use client'
import { useState, useEffect } from 'react'
import {
    X,
    Plus,
    Trash2,
    Search,
    Package,
    Save,
    AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getProducts } from '../../../../services/apiProduct.service'
import { createStockVoucher } from '../../../../services/apiStock.service'
import type { IProduct } from '../../../interfaces/product.interface'
import type {
    StockVoucherFormData,
    IStockItem,
} from '../../../interfaces/stock.interface'
import { formatCurrency } from '@/utils/Format'
import { toast } from 'sonner'

interface StockVoucherModalProps {
    isOpen: boolean
    onClose: () => void
    voucher: any
    onSave: (voucher: any) => void
    products: IProduct[]
}

export default function StockVoucherModal({
    isOpen,
    onClose,
    voucher,
    onSave,
}: StockVoucherModalProps) {
    const [formData, setFormData] = useState<StockVoucherFormData>({
        type: voucher?.type || 'import',
        reason: voucher?.reason || '',
        items: voucher?.items || [],
        notes: voucher?.notes || '',
        status: 'approved',
    })

    // State cho việc tìm kiếm và chọn sản phẩm
    const [allProducts, setAllProducts] = useState<IProduct[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)
    const [showProductSearch, setShowProductSearch] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])

    // Load tất cả sản phẩm khi modal mở
    useEffect(() => {
        if (isOpen) {
            loadAllProducts()
        }
    }, [isOpen])

    const loadAllProducts = async () => {
        try {
            setIsLoadingProducts(true)
            const response = await getProducts({
                limit: 1000,
            })
            if (response) {
                setAllProducts(response.data)
            }
        } catch (error) {
            console.error('Error loading products:', error)
            toast.error('Không thể tải danh sách sản phẩm')
        } finally {
            setIsLoadingProducts(false)
        }
    }

    // Lọc sản phẩm theo từ khóa tìm kiếm
    const filteredProducts = allProducts.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Validate form data
    const validateForm = (): string[] => {
        const errors: string[] = []

        if (!formData.reason.trim()) {
            errors.push('Vui lòng nhập lý do tạo phiếu')
        }

        if (formData.items.length === 0) {
            errors.push('Vui lòng thêm ít nhất một sản phẩm')
        }

        formData.items.forEach((item, index) => {
            if (!item.quantity || item.quantity <= 0) {
                errors.push(
                    `Số lượng sản phẩm "${item.productName}" phải lớn hơn 0`,
                )
            }

            if (formData.type === 'export') {
                const product = allProducts.find((p) => p._id === item.product)
                if (product && product.quantity < item.quantity) {
                    errors.push(
                        `Không đủ tồn kho cho sản phẩm "${item.productName}". Tồn kho: ${product.quantity}, yêu cầu: ${item.quantity}`,
                    )
                }
            }

            if (
                formData.type === 'import' &&
                (!item.costPrice || item.costPrice < 0)
            ) {
                errors.push(
                    `Giá vốn sản phẩm "${item.productName}" phải lớn hơn hoặc bằng 0`,
                )
            }
        })

        return errors
    }

    // Thêm sản phẩm vào danh sách
    const handleAddProduct = (product: IProduct) => {
        const existingItemIndex = formData.items.findIndex(
            (item) => item.product === product._id,
        )

        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            const updatedItems = [...formData.items]
            updatedItems[existingItemIndex].quantity += 1
            setFormData({ ...formData, items: updatedItems })
        } else {
            // Thêm sản phẩm mới
            const newItem: IStockItem = {
                product: product._id || '',
                productName: product.name,
                quantity: 1,
                unit: product.unit,
                costPrice: product.costPrice || 0,
                note: '',
            }
            setFormData({
                ...formData,
                items: [...formData.items, newItem],
            })
        }
        setShowProductSearch(false)
        setSearchTerm('')
    }

    // Xóa sản phẩm khỏi danh sách
    const handleRemoveProduct = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        })
    }

    // Cập nhật thông tin sản phẩm
    const handleUpdateProduct = (
        index: number,
        field: keyof IStockItem,
        value: any,
    ) => {
        const updatedItems = [...formData.items]
        updatedItems[index] = { ...updatedItems[index], [field]: value }
        setFormData({ ...formData, items: updatedItems })
    }

    // Xử lý lưu phiếu kho
    const handleSave = async () => {
        const errors = validateForm()
        setValidationErrors(errors)

        if (errors.length > 0) {
            return
        }

        setIsSubmitting(true)

        try {
            // Gọi API tạo phiếu kho
            const response = await createStockVoucher(formData)
            console.log('Creating stock voucher with data:', formData)

            if (response) {
                toast.success(
                    `Tạo phiếu ${formData.type === 'import' ? 'nhập' : 'xuất'} kho thành công!`,
                )
                console.log('Stock voucher created:', response.data)
                // Callback để parent component cập nhật danh sách
                onSave(response.data)

                // Đóng modal
                onClose()

                // Reset form
                setFormData({
                    type: 'import',
                    reason: '',
                    items: [],
                    notes: '',
                })
                setValidationErrors([])
            }
        } catch (error: any) {
            console.error('Error creating stock voucher:', error)
            const errorMessage =
                error?.response?.data?.message ||
                'Có lỗi xảy ra khi tạo phiếu kho'
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Tính tổng giá trị
    const totalValue = formData.items.reduce(
        (total, item) => total + item.costPrice * item.quantity,
        0,
    )

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {formData.type === 'import'
                            ? 'Tạo phiếu nhập kho'
                            : 'Tạo phiếu xuất kho'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 transition-colors hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div
                    className="overflow-y-auto p-6"
                    style={{ maxHeight: 'calc(90vh - 130px)' }}
                >
                    <div className="space-y-6">
                        {/* Validation Errors */}
                        {validationErrors.length > 0 && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    <ul className="list-inside list-disc space-y-1">
                                        {validationErrors.map(
                                            (error, index) => (
                                                <li key={index}>{error}</li>
                                            ),
                                        )}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Thông tin cơ bản */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label
                                    htmlFor="type"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Loại phiếu
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(
                                        value: 'import' | 'export',
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            type: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
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

                        <div>
                            <Label
                                htmlFor="reason"
                                className="text-sm font-medium text-gray-700"
                            >
                                Lý do <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="Nhập lý do tạo phiếu kho..."
                                className="mt-1"
                                value={formData.reason}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        reason: e.target.value,
                                    })
                                }
                                rows={3}
                            />
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <Label className="text-sm font-medium text-gray-700">
                                    Danh sách sản phẩm{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setShowProductSearch(!showProductSearch)
                                    }
                                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm sản phẩm
                                </Button>
                            </div>

                            {/* Tìm kiếm sản phẩm */}
                            {showProductSearch && (
                                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="relative mb-3">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            placeholder="Tìm sản phẩm theo tên hoặc mã vạch..."
                                            className="pl-10"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="max-h-60 overflow-y-auto">
                                        {isLoadingProducts ? (
                                            <div className="space-y-2">
                                                {Array.from({ length: 3 }).map(
                                                    (_, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-3 p-2"
                                                        >
                                                            <Skeleton className="h-10 w-10 rounded" />
                                                            <div className="flex-1">
                                                                <Skeleton className="mb-1 h-4 w-32" />
                                                                <Skeleton className="h-3 w-24" />
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : filteredProducts.length > 0 ? (
                                            <div className="space-y-1">
                                                {filteredProducts.map(
                                                    (product) => (
                                                        <div
                                                            key={product._id}
                                                            className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50"
                                                            onClick={() =>
                                                                handleAddProduct(
                                                                    product,
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                                                                    <Package className="h-5 w-5 text-gray-500" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {
                                                                            product.category
                                                                        }{' '}
                                                                        • Tồn
                                                                        kho:{' '}
                                                                        {
                                                                            product.quantity
                                                                        }{' '}
                                                                        {
                                                                            product.unit
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium text-gray-900">
                                                                    {formatCurrency(
                                                                        product.price,
                                                                    )}
                                                                </p>
                                                                {product.costPrice && (
                                                                    <p className="text-sm text-gray-500">
                                                                        Giá vốn:{' '}
                                                                        {formatCurrency(
                                                                            product.costPrice,
                                                                        )}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-gray-500">
                                                {searchTerm
                                                    ? 'Không tìm thấy sản phẩm nào'
                                                    : 'Nhập từ khóa để tìm kiếm sản phẩm'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Bảng sản phẩm đã chọn */}
                            {formData.items.length > 0 ? (
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead className="font-semibold text-gray-700">
                                                    Sản phẩm
                                                </TableHead>
                                                <TableHead className="font-semibold text-gray-700">
                                                    Số lượng
                                                </TableHead>
                                                {formData.type === 'import' && (
                                                    <TableHead className="font-semibold text-gray-700">
                                                        Giá vốn
                                                    </TableHead>
                                                )}
                                                <TableHead className="font-semibold text-gray-700">
                                                    Thành tiền
                                                </TableHead>
                                                <TableHead className="font-semibold text-gray-700">
                                                    Ghi chú
                                                </TableHead>
                                                <TableHead className="w-16"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.items.map(
                                                (item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-medium">
                                                            {item.productName}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    value={
                                                                        item.quantity
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleUpdateProduct(
                                                                            index,
                                                                            'quantity',
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        )
                                                                    }
                                                                    className="w-20"
                                                                />
                                                                <span className="text-sm text-gray-500">
                                                                    {item.unit}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        {formData.type ===
                                                            'import' && (
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    value={
                                                                        item.costPrice
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleUpdateProduct(
                                                                            index,
                                                                            'costPrice',
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        )
                                                                    }
                                                                    className="w-32"
                                                                />
                                                            </TableCell>
                                                        )}
                                                        <TableCell className="font-medium">
                                                            {formatCurrency(
                                                                item.costPrice *
                                                                    item.quantity,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                placeholder="Ghi chú..."
                                                                value={
                                                                    item.note ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleUpdateProduct(
                                                                        index,
                                                                        'note',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-32"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleRemoveProduct(
                                                                        index,
                                                                    )
                                                                }
                                                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Chưa có sản phẩm nào được thêm
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Nhấn "Thêm sản phẩm" để bắt đầu
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Ghi chú */}
                        <div>
                            <Label
                                htmlFor="notes"
                                className="text-sm font-medium text-gray-700"
                            >
                                Ghi chú
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Ghi chú thêm..."
                                className="mt-1"
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        notes: e.target.value,
                                    })
                                }
                                rows={2}
                            />
                        </div>

                        {/* Tổng kết */}
                        {formData.items.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">
                                        Tổng giá trị:
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                        {formatCurrency(totalValue)}
                                    </span>
                                </div>
                                <div className="mt-1 text-sm text-gray-600">
                                    Tổng số sản phẩm: {formData.items.length}{' '}
                                    loại
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Lưu phiếu kho
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
