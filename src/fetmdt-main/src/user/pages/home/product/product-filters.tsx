'use client'

import type React from 'react'
import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

interface ProductFiltersProps {
    searchTerm?: string
    onSearchChange?: (value: string) => void
    priceRange?: [number, number]
    onPriceRangeChange?: (range: [number, number]) => void
    onlyInStock?: boolean
    onInStockChange?: (value: boolean) => void
    sortBy?: string
    onSortChange?: (value: string) => void
    onFilterApply?: () => void
    onFilterReset?: () => void
    // Thêm các props mới để tương thích với cách gọi trong category-page.tsx
    sortOption?: string
    onPriceChange?: (range: [number, number]) => void
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    searchTerm = '',
    onSearchChange = () => {},
    priceRange = [0, 100000000],
    onPriceRangeChange = () => {},
    onlyInStock = false,
    onInStockChange = () => {},
    sortBy = 'featured',
    onSortChange = () => {},
    onFilterApply = () => {},
    onFilterReset = () => {},
    // Sử dụng các props mới nếu được cung cấp
    sortOption,
    onPriceChange,
}) => {
    const [localPriceRange, setLocalPriceRange] =
        useState<[number, number]>(priceRange)
    const [showFilters, setShowFilters] = useState(false)

    // Sử dụng các props mới nếu được cung cấp
    const effectiveSortBy = sortOption || sortBy
    const effectiveOnSortChange = (value: string) => {
        if (onSortChange) onSortChange(value)
        if (sortOption !== undefined && onPriceChange) onSortChange(value)
    }

    const handlePriceChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: 0 | 1,
    ) => {
        const value = Number.parseInt(e.target.value) || 0
        const newRange = [...localPriceRange] as [number, number]
        newRange[index] = value
        setLocalPriceRange(newRange)
    }

    const applyPriceFilter = () => {
        if (onPriceRangeChange) onPriceRangeChange(localPriceRange)
        if (onPriceChange) onPriceChange(localPriceRange)
    }

    const handleReset = () => {
        onFilterReset()
        setLocalPriceRange([0, 100000000])
    }

    return (
        <div className="mb-8">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={effectiveSortBy}
                        onChange={(e) => effectiveOnSortChange(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="featured">Nổi bật</option>
                        <option value="newest">Mới nhất</option>
                        <option value="price-asc">Giá: Thấp đến cao</option>
                        <option value="price-desc">Giá: Cao đến thấp</option>
                        <option value="name-asc">Tên: A-Z</option>
                        <option value="name-desc">Tên: Z-A</option>
                    </select>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                        <Filter size={18} />
                        <span>Bộ lọc</span>
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">
                            Lọc sản phẩm
                        </h3>
                        <button
                            onClick={handleReset}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            <X size={14} className="mr-1" />
                            Đặt lại
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <h4 className="mb-2 font-medium text-gray-700">
                                Khoảng giá
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        value={localPriceRange[0]}
                                        onChange={(e) =>
                                            handlePriceChange(e, 0)
                                        }
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        value={localPriceRange[1]}
                                        onChange={(e) =>
                                            handlePriceChange(e, 1)
                                        }
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={applyPriceFilter}
                                    className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-2 font-medium text-gray-700">
                                Trạng thái
                            </h4>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="in-stock"
                                    checked={onlyInStock}
                                    onChange={(e) =>
                                        onInStockChange(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="in-stock"
                                    className="ml-2 text-gray-700"
                                >
                                    Chỉ hiển thị sản phẩm còn hàng
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onFilterApply}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Áp dụng tất cả
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductFilters
