'use client'

import { useState, useEffect } from 'react'
import { useCart } from '../../contexts/cart-context'
import { getProducts } from '../../../services/apiProduct.service'
import { getCategories } from '../../../services/apiCategory.service'
import ProductFilters from '../home/product/product-filters'
import CategorySidebar from '../category/category-sidebar'
import ProductGrid from '../home/product/product-grid'
import type { Product } from '../../../types/product'
import type { Category } from '../../../types/category'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Button } from '../../../components/ui/button'
import { Loader2 } from 'lucide-react'

export default function ShopPage() {
    const { addItem } = useCart()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // State cho query parameters từ URL
    const [urlParams, setUrlParams] = useState({
        category: null as string | null,
        featured: null as boolean | null,
        hot: null as boolean | null,
        new: null as boolean | null,
        recommended: null as boolean | null,
        search: null as string | null,
    })

    // State cho bộ lọc
    const [filters, setFilters] = useState({
        searchTerm: '',
        priceRange: [0, 100000000] as [number, number],
        onlyInStock: false,
        sortBy: 'featured',
        limit: 12,
    })

    // Lấy tham số URL khi component mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setUrlParams({
            category: params.get('category'),
            featured: params.get('featured') === 'true' ? true : null,
            hot: params.get('hot') === 'true' ? true : null,
            new: params.get('new') === 'true' ? true : null,
            recommended: params.get('recommended') === 'true' ? true : null,
            search: params.get('search'),
        })

        // Lấy trang hiện tại từ URL nếu có
        const page = params.get('page')
        if (page) {
            setCurrentPage(Number.parseInt(page))
        }

        // Lấy search term từ URL
        const searchTerm = params.get('search')
        if (searchTerm) {
            setFilters((prev) => ({ ...prev, searchTerm }))
        }
    }, [])

    // Fetch danh mục từ API thật
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories()
                if (response?.success && response.data) {
                    setCategories(response.data)
                }
            } catch (err) {
                console.error('Error fetching categories:', err)
            }
        }

        fetchCategories()
    }, [])

    // Fetch sản phẩm từ API thật khi các tham số thay đổi
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Xây dựng tham số truy vấn cho API
                const queryParams: any = {
                    page: currentPage,
                    limit: filters.limit,
                }

                // Thêm sort parameter
                if (filters.sortBy) {
                    queryParams.sort = getSortParam(filters.sortBy)
                }

                // Thêm các tham số từ URL
                if (urlParams.category)
                    queryParams.category = urlParams.category
                if (urlParams.featured)
                    queryParams.featured = urlParams.featured
                if (urlParams.hot) queryParams.hot = urlParams.hot
                if (urlParams.new) queryParams.new = urlParams.new
                if (urlParams.recommended)
                    queryParams.recommended = urlParams.recommended

                // Thêm các tham số lọc
                if (filters.searchTerm || urlParams.search) {
                    queryParams.search = filters.searchTerm || urlParams.search
                }
                if (filters.onlyInStock) queryParams.inStock = true
                if (filters.priceRange[0] > 0)
                    queryParams.minPrice = filters.priceRange[0]
                if (filters.priceRange[1] < 100000000)
                    queryParams.maxPrice = filters.priceRange[1]

                console.log('Fetching products with params:', queryParams)

                const response = await getProducts(queryParams)

                if (response?.success) {
                    setProducts(response.data || [])
                    setTotalProducts(response.total || 0)
                    setTotalPages(response.pagination?.totalPages || 1)
                } else {
                    setError(
                        response?.message ||
                            'Không thể tải sản phẩm. Vui lòng thử lại sau.',
                    )
                }
            } catch (err: any) {
                console.error('Error fetching products:', err)
                setError(
                    err.message ||
                        'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.',
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [
        currentPage,
        filters.limit,
        filters.sortBy,
        filters.searchTerm,
        filters.onlyInStock,
        filters.priceRange,
        urlParams,
    ])

    // Chuyển đổi sortBy thành tham số sort cho API
    const getSortParam = (sortValue: string): string => {
        switch (sortValue) {
            case 'price-asc':
                return 'price'
            case 'price-desc':
                return '-price'
            case 'name-asc':
                return 'name'
            case 'name-desc':
                return '-name'
            case 'newest':
                return '-createdAt'
            case 'featured':
            default:
                return '-featured'
        }
    }

    const handleAddToCart = (product: Product) => {
        addItem(product, 1)
    }

    const handleFilterApply = () => {
        // Reset về trang 1 khi áp dụng bộ lọc mới
        setCurrentPage(1)

        // Cập nhật URL với search term
        if (filters.searchTerm) {
            const url = new URL(window.location.href)
            url.searchParams.set('search', filters.searchTerm)
            url.searchParams.delete('page')
            window.history.pushState({}, '', url.toString())
        }
    }

    const handleFilterReset = () => {
        setFilters({
            searchTerm: '',
            priceRange: [0, 100000000],
            onlyInStock: false,
            sortBy: 'featured',
            limit: 12,
        })
        setCurrentPage(1)

        // Reset URL
        const url = new URL(window.location.href)
        url.searchParams.delete('search')
        url.searchParams.delete('page')
        window.history.pushState({}, '', url.toString())
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Cập nhật URL với tham số page mới
        const url = new URL(window.location.href)
        url.searchParams.set('page', page.toString())
        window.history.pushState({}, '', url.toString())
        // Cuộn lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Hiển thị trạng thái loading
    if (isLoading && products.length === 0) {
        return (
            <div className="container mx-auto px-8 py-8">
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
                        <p className="text-lg text-gray-600">
                            Đang tải sản phẩm...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-8 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Cửa hàng</h1>

            {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <ProductFilters
                searchTerm={filters.searchTerm}
                onSearchChange={(value) =>
                    setFilters((prev) => ({ ...prev, searchTerm: value }))
                }
                priceRange={filters.priceRange}
                onPriceRangeChange={(value) =>
                    setFilters((prev) => ({ ...prev, priceRange: value }))
                }
                onlyInStock={filters.onlyInStock}
                onInStockChange={(value) =>
                    setFilters((prev) => ({ ...prev, onlyInStock: value }))
                }
                sortBy={filters.sortBy}
                onSortChange={(value) =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                }
                onFilterApply={handleFilterApply}
                onFilterReset={handleFilterReset}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <div className="lg:col-span-1">
                    <CategorySidebar
                        categories={categories}
                        selectedCategory={urlParams.category || undefined}
                    />
                </div>

                <div className="lg:col-span-3">
                    {products.length > 0 ? (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-gray-600">
                                    Hiển thị{' '}
                                    {(currentPage - 1) * filters.limit + 1}-
                                    {Math.min(
                                        currentPage * filters.limit,
                                        totalProducts,
                                    )}{' '}
                                    trên {totalProducts} sản phẩm
                                </p>
                                {isLoading && (
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                )}
                            </div>

                            <ProductGrid
                                products={products}
                                onAddToCart={handleAddToCart}
                            />

                            {/* Phân trang */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.max(
                                                        1,
                                                        currentPage - 1,
                                                    ),
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            &laquo; Trước
                                        </Button>

                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1,
                                        )
                                            .filter(
                                                (page) =>
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 &&
                                                        page <=
                                                            currentPage + 1),
                                            )
                                            .map((page, index, array) => {
                                                // Thêm dấu ... nếu có khoảng cách giữa các số trang
                                                if (
                                                    index > 0 &&
                                                    page - array[index - 1] > 1
                                                ) {
                                                    return (
                                                        <span
                                                            key={`ellipsis-${page}`}
                                                            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700"
                                                        >
                                                            ...
                                                        </span>
                                                    )
                                                }

                                                return (
                                                    <Button
                                                        key={page}
                                                        variant={
                                                            currentPage === page
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page,
                                                            )
                                                        }
                                                    >
                                                        {page}
                                                    </Button>
                                                )
                                            })}

                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.min(
                                                        totalPages,
                                                        currentPage + 1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Tiếp &raquo;
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : !isLoading ? (
                        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                            <p className="mb-4 text-gray-500">
                                Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                            </p>
                            <Button onClick={handleFilterReset}>
                                Đặt lại bộ lọc
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
