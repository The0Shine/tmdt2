'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducts } from '../../../services/apiProduct.service'
import { getCategories } from '../../../services/apiCategory.service'
import CategorySidebar from './category-sidebar'
import ProductFilters from '../home/product/product-filters'
import { Loader2, Grid, List, SlidersHorizontal, RotateCcw } from 'lucide-react'
import type { Product } from '../../../types/product'
import type { Category } from '../../../types/category'
import ProductGrid from '../home/product/product-grid'
import { useCart } from '../../contexts/cart-context'
import { Button } from '../../../components/ui/button'

interface CategoryPageProps {
    category?: string
}

export default function CategoryPage({
    category: propCategory,
}: CategoryPageProps) {
    const params = useParams()
    const navigate = useNavigate()
    const categorySlug = propCategory || params.category
    const { addItem } = useCart()

    // States
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [categoryInfo, setCategoryInfo] = useState<{
        name: string
        id: string
        description?: string
    }>({
        name: '',
        id: '',
    })

    // UI States
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)

    // Filter states
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
    const [sortOption, setSortOption] = useState<string>('newest')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true)
                const response = await getCategories()

                if (response?.success && response.data) {
                    setCategories(response.data)
                } else {
                    setCategories([])
                }
            } catch (err) {
                console.error('Error fetching categories:', err)
                setCategories([])
            } finally {
                setCategoriesLoading(false)
            }
        }

        fetchCategories()
    }, [])

    // Find category info from slug
    const categoryData = useMemo(() => {
        if (!categories.length || categoriesLoading) return null

        if (!categorySlug) {
            return {
                id: '',
                name: 'Tất cả sản phẩm',
                description: 'Xem tất cả sản phẩm có sẵn',
            }
        }

        // Tìm trong main categories
        const mainCategory = categories.find((cat) => cat.slug === categorySlug)
        if (mainCategory) {
            return {
                id: mainCategory._id,
                name: mainCategory.name,
                description: mainCategory.description,
            }
        }

        // Tìm trong subcategories
        for (const cat of categories) {
            if (cat.subcategories && cat.subcategories.length > 0) {
                const subcat = cat.subcategories.find(
                    (sub: any) => sub.slug === categorySlug,
                )
                if (subcat) {
                    return {
                        id: subcat._id,
                        name: subcat.name,
                        // description: subcat.description,
                    }
                }
            }
        }

        return null
    }, [categories, categorySlug, categoriesLoading])

    // Update category info when data changes
    useEffect(() => {
        if (categoryData) {
            setCategoryInfo(categoryData)
        }
    }, [categoryData])

    // Fetch products
    const fetchProducts = useCallback(async () => {
        if (categoriesLoading) return

        setLoading(true)
        setError(null)

        try {
            const params: any = {
                page: currentPage,
                limit: 12,
            }

            // Chỉ thêm price filter nếu khác giá trị mặc định
            if (priceRange[0] > 0 || priceRange[1] < 1000000) {
                params.minPrice = priceRange[0]
                params.maxPrice = priceRange[1]
            }

            // Thêm category filter nếu có
            if (categoryInfo.id) {
                params.category = categoryInfo.id
            }

            // Thêm sort option
            if (sortOption !== 'newest') {
                const sortMap: Record<string, string> = {
                    'price-asc': 'price,asc',
                    'price-desc': 'price,desc',
                    'name-asc': 'name,asc',
                    'name-desc': 'name,desc',
                }
                params.sort = sortMap[sortOption] || 'createdAt,desc'
            }

            const response = await getProducts(params)

            if (response?.success) {
                setProducts(response.data || [])
                setTotalPages(response.pagination?.totalPages || 1)
                setTotalProducts(response.total || 0)
            } else {
                setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
                setProducts([])
            }
        } catch (err) {
            console.error('Error fetching products:', err)
            setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [
        categoryInfo.id,
        currentPage,
        priceRange,
        sortOption,
        categoriesLoading,
    ])

    // Fetch products when dependencies change
    useEffect(() => {
        if (!categoriesLoading && categoryInfo.name) {
            fetchProducts()
        }
    }, [fetchProducts, categoriesLoading, categoryInfo])

    // Handle add to cart
    const handleAddToCart = useCallback(
        (product: Product) => {
            addItem(product, 1)
        },
        [addItem],
    )

    // Handle category selection
    const handleCategorySelect = useCallback(
        (categoryId: string, categorySlug?: string) => {
            setCurrentPage(1)

            if (categorySlug) {
                navigate(`/shop/category/${categorySlug}`)
            } else {
                navigate('/shop')
            }
        },
        [navigate],
    )

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [priceRange, sortOption])

    // Reset all filters including category
    const handleResetAllFilters = useCallback(() => {
        setPriceRange([0, 1000000])
        setSortOption('newest')
        setCurrentPage(1)
        // Điều hướng về trang tất cả sản phẩm (xóa category filter)
        navigate('/shop')
    }, [navigate])

    // Reset only price and sort filters (keep category)
    const handleResetPriceAndSort = useCallback(() => {
        setPriceRange([0, 1000000])
        setSortOption('newest')
        setCurrentPage(1)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {categoryInfo.name || 'Đang tải...'}
                            </h1>
                            {categoryInfo.description && (
                                <p className="mt-2 text-gray-600">
                                    {categoryInfo.description}
                                </p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                {loading
                                    ? 'Đang tải...'
                                    : `${totalProducts} sản phẩm có sẵn`}
                            </p>
                        </div>

                        {/* View Controls */}
                        <div className="flex items-center gap-3">
                            {/* Reset Filters Button */}
                            {(priceRange[0] > 0 ||
                                priceRange[1] < 1000000 ||
                                sortOption !== 'newest' ||
                                categoryInfo.id) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetAllFilters}
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    <RotateCcw size={16} className="mr-2" />
                                    Xóa tất cả bộ lọc
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden"
                            >
                                <SlidersHorizontal size={16} className="mr-2" />
                                Bộ lọc
                            </Button>

                            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`rounded-md p-2 transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`rounded-md p-2 transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <div
                        className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
                    >
                        <div className="space-y-6">
                            <CategorySidebar
                                activeCategory={categorySlug}
                                categories={categories}
                                loading={categoriesLoading}
                                onCategorySelect={handleCategorySelect}
                            />

                            <ProductFilters
                                priceRange={priceRange}
                                onPriceChange={setPriceRange}
                                sortOption={sortOption}
                                onSortChange={setSortOption}
                                onFilterReset={handleResetPriceAndSort}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white">
                                <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-500" />
                                <p className="text-gray-600">
                                    Đang tải sản phẩm...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                                <div className="mb-2 text-red-600">
                                    <svg
                                        className="mx-auto h-12 w-12"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>
                                <p className="font-medium text-red-700">
                                    {error}
                                </p>
                                <Button
                                    onClick={fetchProducts}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Thử lại
                                </Button>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="rounded-xl bg-white p-6">
                                <ProductGrid
                                    products={products}
                                    onAddToCart={handleAddToCart}
                                />

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.max(1, prev - 1),
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </Button>

                                            <span className="px-4 py-2 text-sm text-gray-600">
                                                Trang {currentPage} /{' '}
                                                {totalPages}
                                            </span>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.min(
                                                            totalPages,
                                                            prev + 1,
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
                            </div>
                        ) : (
                            <div className="rounded-xl bg-white p-12 text-center">
                                <div className="mb-4 text-gray-400">
                                    <svg
                                        className="mx-auto h-16 w-16"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    Không tìm thấy sản phẩm
                                </h3>
                                <p className="mb-4 text-gray-500">
                                    {categoryInfo.id
                                        ? 'Không có sản phẩm nào trong danh mục này hoặc phù hợp với bộ lọc của bạn.'
                                        : 'Không có sản phẩm nào phù hợp với bộ lọc của bạn.'}
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Button
                                        onClick={handleResetPriceAndSort}
                                        variant="outline"
                                    >
                                        Xóa bộ lọc giá
                                    </Button>
                                    <Button onClick={handleResetAllFilters}>
                                        Xem tất cả sản phẩm
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
