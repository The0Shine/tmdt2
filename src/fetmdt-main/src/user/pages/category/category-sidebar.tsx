'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ICategory } from '../../../types/category'

interface CategorySidebarProps {
    selectedCategory?: string
    categories: ICategory[]
    activeCategory?: string
    loading?: boolean
    onCategorySelect?: (categoryId: string, categorySlug?: string) => void
}

export default function CategorySidebar({
    selectedCategory,
    categories,
    activeCategory,
    loading = false,
    onCategorySelect,
}: CategorySidebarProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])
    const [subcategoriesMap, setSubcategoriesMap] = useState<
        Record<string, ICategory[]>
    >({})

    // Tạo map của subcategories theo parent ID
    useEffect(() => {
        if (categories.length > 0) {
            // Tìm tất cả danh mục con và nhóm theo parent ID
            const subcatMap: Record<string, ICategory[]> = {}

            // Lọc ra các danh mục cha (không có parent)
            const parentCats = categories.filter((cat) => !cat.parent)

            // Lọc ra các danh mục con và nhóm theo parent ID
            categories.forEach((cat) => {
                if (cat.parent) {
                    const parentId =
                        typeof cat.parent === 'string'
                            ? cat.parent
                            : cat.parent._id
                    if (!subcatMap[parentId]) {
                        subcatMap[parentId] = []
                    }
                    subcatMap[parentId].push(cat)
                }
            })

            setSubcategoriesMap(subcatMap)
        }
    }, [categories])

    // Auto expand category nếu có active category
    useEffect(() => {
        if (activeCategory && categories.length > 0) {
            // Tìm active category
            const activeCat = categories.find(
                (cat) =>
                    cat._id === activeCategory || cat.slug === activeCategory,
            )

            // Nếu active category là danh mục con, mở rộng danh mục cha
            if (activeCat && activeCat.parent) {
                const parentId =
                    typeof activeCat.parent === 'string'
                        ? activeCat.parent
                        : activeCat.parent._id

                if (!expandedCategories.includes(parentId)) {
                    setExpandedCategories((prev) => [...prev, parentId])
                }
            }
        }
    }, [activeCategory, categories, expandedCategories])

    const activeCat = activeCategory || selectedCategory

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        )
    }

    const handleCategoryClick = (categoryId: string, categorySlug?: string) => {
        if (onCategorySelect) {
            onCategorySelect(categoryId, categorySlug)
        }
    }

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4 md:mb-6">
                    <div className="h-6 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-10 animate-pulse rounded-lg bg-gray-100"
                        ></div>
                    ))}
                </div>
            </div>
        )
    }

    // Lọc ra các danh mục cha (không có parent)
    const parentCategories = categories.filter((cat) => !cat.parent)

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 md:mb-6">
                <h2 className="text-lg font-bold text-gray-900 md:text-xl">
                    Danh mục sản phẩm
                </h2>
                <p className="mt-1 text-xs text-gray-500 md:text-sm">
                    Chọn danh mục để xem sản phẩm
                </p>
            </div>

            {/* All Products Link */}
            <div className="mb-4">
                <Link
                    to="/shop"
                    onClick={() => handleCategoryClick('', '')}
                    className={`block w-full rounded-lg px-3 py-2 text-left transition-all duration-200 md:px-4 md:py-3 ${
                        !activeCat
                            ? 'border-l-4 border-blue-500 bg-blue-50 font-semibold text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                >
                    <span className="text-sm md:text-base">
                        Tất cả sản phẩm
                    </span>
                    <div className="mt-1 text-xs text-gray-500">
                        Xem toàn bộ sản phẩm
                    </div>
                </Link>
            </div>

            <div className="border-t border-gray-100 pt-4">
                {parentCategories.length > 0 ? (
                    <ul className="space-y-2">
                        {parentCategories.map((category) => {
                            const isActive =
                                activeCat === category._id ||
                                activeCat === category.slug
                            const isExpanded = expandedCategories.includes(
                                category._id,
                            )
                            const subcategories =
                                subcategoriesMap[category._id] || []
                            const hasSubcategories = subcategories.length > 0

                            return (
                                <li key={category._id}>
                                    <div className="flex items-center">
                                        <Link
                                            to={`/shop/category/${category.slug}`}
                                            onClick={() =>
                                                handleCategoryClick(
                                                    category._id,
                                                    category.slug,
                                                )
                                            }
                                            className={`flex-1 rounded-lg px-3 py-2 transition-all duration-200 md:px-4 md:py-3 ${
                                                isActive
                                                    ? 'border-l-4 border-blue-500 bg-blue-50 font-semibold text-blue-700'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm md:text-base">
                                                        {category.name}
                                                    </span>
                                                    {category.description && (
                                                        <div className="mt-1 line-clamp-1 text-xs text-gray-500">
                                                            {
                                                                category.description
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                {hasSubcategories && (
                                                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                                        {subcategories.length}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>

                                        {hasSubcategories && (
                                            <button
                                                onClick={() =>
                                                    toggleCategory(category._id)
                                                }
                                                className="ml-1 p-1 text-gray-400 transition-colors hover:text-gray-600 md:ml-2 md:p-2"
                                                aria-label={
                                                    isExpanded
                                                        ? 'Thu gọn'
                                                        : 'Mở rộng'
                                                }
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Subcategories */}
                                    {hasSubcategories && isExpanded && (
                                        <div className="mt-1 ml-3 space-y-1 border-l-2 border-gray-100 pl-2 md:mt-2 md:ml-4 md:pl-4">
                                            {subcategories.map(
                                                (subcategory) => {
                                                    const isSubActive =
                                                        activeCat ===
                                                            subcategory._id ||
                                                        activeCat ===
                                                            subcategory.slug

                                                    return (
                                                        <Link
                                                            key={
                                                                subcategory._id
                                                            }
                                                            to={`/shop/category/${subcategory.slug}`}
                                                            onClick={() =>
                                                                handleCategoryClick(
                                                                    subcategory._id,
                                                                    subcategory.slug,
                                                                )
                                                            }
                                                            className={`block rounded-md px-2 py-1.5 text-xs transition-all duration-200 md:px-3 md:py-2 md:text-sm ${
                                                                isSubActive
                                                                    ? 'bg-blue-50 font-medium text-blue-600'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                                            }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <span className="truncate">
                                                                    {
                                                                        subcategory.name
                                                                    }
                                                                </span>
                                                            </div>
                                                            {subcategory.description && (
                                                                <div className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                                                                    {
                                                                        subcategory.description
                                                                    }
                                                                </div>
                                                            )}
                                                        </Link>
                                                    )
                                                },
                                            )}
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="py-6 text-center md:py-8">
                        <div className="mb-2 text-gray-400">
                            <svg
                                className="mx-auto h-8 w-8 md:h-12 md:w-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                        </div>
                        <p className="text-xs text-gray-500 md:text-sm">
                            Chưa có danh mục nào
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
