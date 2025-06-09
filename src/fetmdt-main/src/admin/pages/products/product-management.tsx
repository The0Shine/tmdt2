'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Tag,
    AlertCircle,
    Eye,
    EyeOff,
    FlameIcon as Fire,
    Star,
    Sparkles,
    ChevronDown,
    ChevronUp,
    MoreHorizontal,
} from 'lucide-react'
import ProductModal from './components/product-modal'
import { Link, useNavigate } from 'react-router-dom'
import {
    getCategories,
    getParentCategories,
} from '../../../services/apiCategory.service'
import {
    getProducts,
    updateProduct,
    createProduct,
    deleteProduct,
} from '../../../services/apiProduct.service'
import type { Product } from '../../../types/product'
import type { ICategory } from '@/types/category'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProductManagement() {
    const navigate = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<ICategory[]>([])
    const [parentCategories, setParentCategories] = useState<ICategory[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterCategory, setFilterCategory] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [filterPublished, setFilterPublished] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sortField, setSortField] = useState('createdAt')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    // Tải danh sách sản phẩm
    const loadProducts = async () => {
        setLoading(true)
        setError(null)
        try {
            const params: any = {
                page: currentPage,
                limit: perPage,
                sort: `${sortField},${sortDirection}`,
            }

            if (searchTerm) {
                params.search = searchTerm
            }

            if (filterStatus !== 'all') {
                params.status = filterStatus
            }

            if (filterCategory !== 'all') {
                params.category = filterCategory
            }

            if (filterPublished !== 'all') {
                params.published = filterPublished === 'published'
            }

            if (filterType !== 'all') {
                params[filterType] = true
            }

            const response = await getProducts(params)
            if (response) {
                setProducts(response.data)
                setTotalRows(response.total)
                setTotalPages(response.pagination.totalPages)
            } else {
                setError(
                    'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.',
                )
            }
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.')
            console.error('Error loading products:', err)
        } finally {
            setLoading(false)
        }
    }

    // Tải danh sách danh mục
    const loadCategories = async () => {
        try {
            const [allCategoriesResponse, parentCategoriesResponse] =
                await Promise.all([
                    getCategories({ limit: 100 }), // Tải tất cả danh mục với limit lớn
                    getParentCategories(),
                ])

            if (allCategoriesResponse && parentCategoriesResponse) {
                setCategories(allCategoriesResponse.data)
                setParentCategories(parentCategoriesResponse.data)
            } else {
                setError('Không thể tải danh mục. Vui lòng thử lại sau.')
            }
        } catch (err) {
            console.error('Error loading categories:', err)
            setError('Không thể tải danh mục. Vui lòng thử lại sau.')
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        loadProducts()
    }, [
        currentPage,
        perPage,
        filterStatus,
        filterCategory,
        filterType,
        filterPublished,
        sortField,
        sortDirection,
    ])

    const handleAddProduct = () => {
        setEditingProduct(null)
        setIsModalOpen(true)
    }

    const handleEditProduct = (product: Product) => {
        navigate(`/admin/products/edit/${product._id}`)
    }

    const handleSaveProduct = async (product: Product) => {
        try {
            if (product._id) {
                await updateProduct(product._id, product)
            } else {
                await createProduct(product)
            }
            setIsModalOpen(false)
            loadProducts()
        } catch (err) {
            console.error('Error saving product:', err)
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await deleteProduct(id)
                loadProducts()
            } catch (err) {
                console.error('Error deleting product:', err)
            }
        }
    }

    const handleTogglePublished = async (product: Product) => {
        try {
            await updateProduct(product._id as string, {
                ...product,
                published: !product.published,
            })
            loadProducts()
        } catch (err) {
            console.error('Error toggling product visibility:', err)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setCurrentPage(1)
            loadProducts()
        }
    }

    const handleFilterChange = () => {
        setCurrentPage(1)
        loadProducts()
    }

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const getCategoryName = (categoryId: string) => {
        const category = categories.find((cat) => cat._id === categoryId)
        return category ? category.name : categoryId
    }

    const renderProductBadges = (product: Product) => {
        const badges = []

        if (product.featured) {
            badges.push(
                <Badge
                    key="featured"
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                >
                    <Star size={12} className="mr-1" /> Nổi bật
                </Badge>,
            )
        }

        if (product.recommended) {
            badges.push(
                <Badge
                    key="recommended"
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                >
                    <Sparkles size={12} className="mr-1" /> Đề xuất
                </Badge>,
            )
        }

        if (product.hot) {
            badges.push(
                <Badge
                    key="hot"
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                >
                    <Fire size={12} className="mr-1" /> Hot
                </Badge>,
            )
        }

        if (product.new) {
            badges.push(
                <Badge
                    key="new"
                    variant="secondary"
                    className="bg-purple-100 text-purple-800"
                >
                    <Plus size={12} className="mr-1" /> Mới
                </Badge>,
            )
        }

        return badges
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto bg-[#F8F9FB] p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Sản phẩm
                        </h1>
                        <div className="flex items-center text-sm text-gray-500">
                            <span>Trang chủ</span>
                            <span className="mx-2">•</span>
                            <span>Sản phẩm</span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-medium">
                                Danh sách sản phẩm
                            </h2>
                            <div className="flex space-x-2">
                                <Link
                                    to="/admin/categories"
                                    className="flex items-center rounded-md border border-teal-500 bg-white px-4 py-2 text-teal-500 hover:bg-teal-50"
                                >
                                    <Tag size={16} className="mr-1" /> Quản lý
                                    danh mục
                                </Link>
                                <Button
                                    onClick={handleAddProduct}
                                    className="bg-teal-500 hover:bg-teal-600"
                                >
                                    <Plus size={16} className="mr-1" /> Tạo sản
                                    phẩm
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 flex items-center rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                                <AlertCircle size={18} className="mr-2" />
                                {error}
                            </div>
                        )}

                        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
                            <div className="relative w-full md:w-80">
                                <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                                    <Search size={16} />
                                </div>
                                <input
                                    placeholder="Tìm sản phẩm"
                                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm text-gray-500">
                                        Danh mục:
                                    </span>
                                    <select
                                        className="w-40 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        value={filterCategory}
                                        onChange={(e) => {
                                            setFilterCategory(e.target.value)
                                            handleFilterChange()
                                        }}
                                    >
                                        <option value="all">Tất cả</option>
                                        {parentCategories.map((category) => (
                                            <option
                                                key={category._id}
                                                value={category._id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm text-gray-500">
                                        Trạng thái:
                                    </span>
                                    <select
                                        className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value)
                                            handleFilterChange()
                                        }}
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="in-stock">
                                            Còn hàng
                                        </option>
                                        <option value="out-of-stock">
                                            Hết hàng
                                        </option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm text-gray-500">
                                        Hiển thị:
                                    </span>
                                    <select
                                        className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        value={filterPublished}
                                        onChange={(e) => {
                                            setFilterPublished(e.target.value)
                                            handleFilterChange()
                                        }}
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="published">
                                            Công khai
                                        </option>
                                        <option value="hidden">Ẩn</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm text-gray-500">
                                        Loại:
                                    </span>
                                    <select
                                        className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        value={filterType}
                                        onChange={(e) => {
                                            setFilterType(e.target.value)
                                            handleFilterChange()
                                        }}
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="featured">
                                            Nổi bật
                                        </option>
                                        <option value="recommended">
                                            Đề xuất
                                        </option>
                                        <option value="hot">Hot</option>
                                        <option value="new">Mới</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center">
                                                Sản phẩm
                                                {sortField === 'name' &&
                                                    (sortDirection === 'asc' ? (
                                                        <ChevronUp
                                                            size={16}
                                                            className="ml-1"
                                                        />
                                                    ) : (
                                                        <ChevronDown
                                                            size={16}
                                                            className="ml-1"
                                                        />
                                                    ))}
                                            </div>
                                        </TableHead>
                                        <TableHead>Danh mục</TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('price')}
                                        >
                                            <div className="flex items-center">
                                                Giá bán
                                                {sortField === 'price' &&
                                                    (sortDirection === 'asc' ? (
                                                        <ChevronUp
                                                            size={16}
                                                            className="ml-1"
                                                        />
                                                    ) : (
                                                        <ChevronDown
                                                            size={16}
                                                            className="ml-1"
                                                        />
                                                    ))}
                                            </div>
                                        </TableHead>
                                        <TableHead>Tồn kho</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">
                                            Thao tác
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center"
                                            >
                                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
                                                <p className="mt-2 text-gray-500">
                                                    Đang tải...
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : products.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                Không có sản phẩm nào
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map((product) => (
                                            <TableRow
                                                key={product._id}
                                                className="hover:bg-gray-50"
                                            >
                                                <TableCell>
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage
                                                            src={
                                                                product.image ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={product.name}
                                                        />
                                                        <AvatarFallback>
                                                            <Eye
                                                                size={16}
                                                                className="text-gray-400"
                                                            />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {product.name}
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {renderProductBadges(
                                                                product,
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {getCategoryName(
                                                                product.category,
                                                            )}
                                                        </div>
                                                        {product.subcategory && (
                                                            <div className="text-xs text-gray-500">
                                                                {getCategoryName(
                                                                    product.subcategory,
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {product.price.toLocaleString()}
                                                            đ
                                                        </div>
                                                        {product.oldPrice && (
                                                            <div className="text-xs text-gray-500 line-through">
                                                                {product.oldPrice.toLocaleString()}
                                                                đ
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {product.status ===
                                                    'in-stock' ? (
                                                        <span className="text-gray-700">
                                                            {product.quantity}
                                                        </span>
                                                    ) : (
                                                        <Badge variant="destructive">
                                                            Hết hàng
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {product.published ? (
                                                            <Badge
                                                                variant="default"
                                                                className="bg-green-100 text-green-800"
                                                            >
                                                                <Eye
                                                                    size={12}
                                                                    className="mr-1"
                                                                />{' '}
                                                                Công khai
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-gray-100 text-gray-800"
                                                            >
                                                                <EyeOff
                                                                    size={12}
                                                                    className="mr-1"
                                                                />{' '}
                                                                Ẩn
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <MoreHorizontal
                                                                    size={16}
                                                                />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleEditProduct(
                                                                        product,
                                                                    )
                                                                }
                                                            >
                                                                <Edit
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Chỉnh sửa
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleTogglePublished(
                                                                        product,
                                                                    )
                                                                }
                                                            >
                                                                {product.published ? (
                                                                    <>
                                                                        <EyeOff
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="mr-2"
                                                                        />
                                                                        Ẩn sản
                                                                        phẩm
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Eye
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="mr-2"
                                                                        />
                                                                        Hiện sản
                                                                        phẩm
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDeleteProduct(
                                                                        product._id as string,
                                                                    )
                                                                }
                                                                className="text-red-600"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                    className="mr-2"
                                                                />
                                                                Xóa
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Hiển thị{' '}
                                    {Math.min(
                                        (currentPage - 1) * perPage + 1,
                                        totalRows,
                                    )}{' '}
                                    đến{' '}
                                    {Math.min(currentPage * perPage, totalRows)}{' '}
                                    trong tổng số {totalRows} sản phẩm
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(1, currentPage - 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        Trước
                                    </Button>
                                    <span className="text-sm">
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages,
                                                    currentPage + 1,
                                                ),
                                            )
                                        }
                                        disabled={currentPage >= totalPages}
                                    >
                                        Sau
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal thêm sản phẩm mới */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
                onSave={handleSaveProduct}
                categories={categories}
            />
        </div>
    )
}
