'use client'

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react'
import {
    ChevronDown,
    ChevronRight,
    Laptop,
    Smartphone,
    Tablet,
    Monitor,
    Headphones,
    Mouse,
    Keyboard,
    Speaker,
    Camera,
    Watch,
} from 'lucide-react'
import { categories } from '../../../data/categories'
import { Link } from 'react-router-dom'

interface CategorySidebarProps {
    selectedCategory?: string
}

export default function CategorySidebar({
    selectedCategory,
}: CategorySidebarProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        )
    }

    const getCategoryIcon = (icon?: string) => {
        switch (icon) {
            case 'laptop':
                return <Laptop size={18} />
            case 'smartphone':
                return <Smartphone size={18} />
            case 'tablet':
                return <Tablet size={18} />
            case 'monitor':
                return <Monitor size={18} />
            case 'headphones':
                return <Headphones size={18} />
            case 'mouse':
                return <Mouse size={18} />
            case 'keyboard':
                return <Keyboard size={18} />
            case 'speaker':
                return <Speaker size={18} />
            case 'camera':
                return <Camera size={18} />
            case 'watch':
                return <Watch size={18} />
            default:
                return <ChevronRight size={18} />
        }
    }

    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Các danh mục</h2>
            <ul className="space-y-1">
                {categories.map((category) => (
                    <li key={category.id}>
                        <div className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100">
                            <Link
                                to={`/shop/category/${category.slug}`}
                                className={`flex flex-grow items-center ${
                                    selectedCategory === category.id
                                        ? 'font-medium text-blue-600'
                                        : 'text-gray-700'
                                }`}
                            >
                                <span className="mr-2">
                                    {getCategoryIcon(category.icon)}
                                </span>
                                <span>{category.name}</span>
                            </Link>
                            {category.subcategories &&
                                category.subcategories.length > 0 && (
                                    <button
                                        onClick={() =>
                                            toggleCategory(category.id)
                                        }
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {expandedCategories.includes(
                                            category.id,
                                        ) ? (
                                            <ChevronDown size={18} />
                                        ) : (
                                            <ChevronRight size={18} />
                                        )}
                                    </button>
                                )}
                        </div>
                        {category.subcategories &&
                            expandedCategories.includes(category.id) && (
                                <ul className="mt-1 ml-6 space-y-1">
                                    {category.subcategories.map(
                                        (subcategory: { id: Key | null | undefined; slug: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                                            <li key={subcategory.id}>
                                                <Link
                                                    to={`/shop/category/${subcategory.slug}`}
                                                    className={`block rounded-md px-3 py-1.5 hover:bg-gray-100 ${
                                                        selectedCategory ===
                                                        subcategory.id
                                                            ? 'font-medium text-blue-600'
                                                            : 'text-gray-600'
                                                    }`}
                                                >
                                                    {subcategory.name}
                                                </Link>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
