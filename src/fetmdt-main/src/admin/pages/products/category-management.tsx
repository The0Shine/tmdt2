'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    Search,
    Plus,
    Edit,
    Trash2,
    X,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
    getCategories,
    getSubcategories,
    deleteCategory,
    updateCategory,
    createCategory,
} from '../../../services/apiCategory.service'
import type { ICategory } from '../../../types/category'

interface CategoryModalProps {
    isOpen: boolean
    onClose: () => void
    category: ICategory | null
    onSave: (category: ICategory) => void
    parentCategories: ICategory[]
}

export default function CategoryManagement() {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [parentCategories, setParentCategories] = useState<ICategory[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(
        null,
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [expandedCategories, setExpandedCategories] = useState<
        Record<string, boolean>
    >({})
    const [subcategoriesMap, setSubcategoriesMap] = useState<
        Record<string, ICategory[]>
    >({})
    const [currentPage, setCurrentPage] = useState(1)

    // Tải danh sách danh mục
    const loadCategories = async () => {
        setLoading(true)
        setError(null)
        try {
            // Tải tất cả danh mục với phân trang
            const allCategoriesResponse = await getCategories({
                page: currentPage,
                search: searchTerm || undefined,
                sort: 'name,asc',
            })

            // Tải danh mục cha - sử dụng parent: null để lấy danh mục gốc
            const parentCategoriesResponse = await getCategories({
                parent: null,
            })

            if (allCategoriesResponse && parentCategoriesResponse) {
                setCategories(allCategoriesResponse.data)
                // Lọc danh mục cha từ response (những category không có parent)
                const parentCats = parentCategoriesResponse.data.filter(
                    (cat) => !cat.parent,
                )
                setParentCategories(parentCats)

                // Load subcategories for each parent category
                const subcatMap: Record<string, ICategory[]> = {}
                for (const parent of parentCats) {
                    const subcatsResponse = await getSubcategories(parent._id)
                    if (subcatsResponse) {
                        subcatMap[parent._id] = subcatsResponse.data
                    }
                }
                setSubcategoriesMap(subcatMap)
            } else {
                setError('Không có danh mục nào được tìm thấy.')
            }
        } catch (err) {
            setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.')
            console.error('Error loading categories:', err)
        } finally {
            setLoading(false)
        }
    }

    // Tải dữ liệu khi component mount hoặc khi trang thay đổi
    useEffect(() => {
        loadCategories()
    }, [currentPage, searchTerm])

    // Xử lý tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset về trang 1 khi tìm kiếm
    }

    // Xử lý tìm kiếm khi nhấn Enter
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            loadCategories()
        }
    }

    // Lọc danh mục theo từ khóa tìm kiếm
    const filteredParentCategories = parentCategories.filter((category) => {
        if (!searchTerm) return true

        const matchesName = category.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        const matchesDescription = category.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        const matchesSubcategory = subcategoriesMap[category._id]?.some((sub) =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        return matchesName || matchesDescription || matchesSubcategory
    })

    // Mở modal thêm danh mục mới
    const handleAddCategory = () => {
        setEditingCategory(null)
        setIsModalOpen(true)
    }

    // Mở modal chỉnh sửa danh mục
    const handleEditCategory = (category: ICategory) => {
        setEditingCategory(category)
        setIsModalOpen(true)
    }

    // Xử lý xóa danh mục
    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            try {
                await deleteCategory(id)
                loadCategories() // Tải lại danh sách danh mục
            } catch (err: any) {
                console.error('Error deleting category:', err)
                // Hiển thị lỗi từ API nếu có
                if (err.response?.data?.error) {
                    setError(err.response.data.error)
                } else {
                    setError('Không thể xóa danh mục. Vui lòng thử lại.')
                }
            }
        }
    }

    // Xử lý lưu danh mục (thêm mới hoặc cập nhật)
    const handleSaveCategory = async (category: ICategory) => {
        try {
            if (category._id) {
                // Cập nhật danh mục hiện có
                await updateCategory(category._id, category)
            } else {
                // Thêm danh mục mới
                await createCategory(category)
            }
            setIsModalOpen(false)
            loadCategories() // Tải lại danh sách danh mục
        } catch (err: any) {
            console.error('Error saving category:', err)
            // Hiển thị lỗi từ API nếu có
            if (err.response?.data?.error) {
                setError(err.response.data.error)
            } else {
                setError('Không thể lưu danh mục. Vui lòng thử lại.')
            }
        }
    }

    // Tạo màu ngẫu nhiên cho danh mục
    const getRandomColor = () => {
        const colors = [
            'bg-blue-100',
            'bg-green-100',
            'bg-red-100',
            'bg-yellow-100',
            'bg-purple-100',
            'bg-pink-100',
            'bg-indigo-100',
            'bg-teal-100',
            'bg-orange-100',
            'bg-amber-100',
            'bg-lime-100',
            'bg-emerald-100',
            'bg-cyan-100',
            'bg-gray-100',
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    // Xử lý mở rộng/thu gọn danh mục
    const toggleCategoryExpand = (categoryId: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }))
    }

    // Xử lý chuyển trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Danh mục sản phẩm
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:text-teal-500">
                        Trang chủ
                    </Link>
                    <span className="mx-2">•</span>
                    <Link to="/products" className="hover:text-teal-500">
                        Sản phẩm
                    </Link>
                    <span className="mx-2">•</span>
                    <span>Danh mục sản phẩm</span>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div className="relative w-80">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            placeholder="Tìm kiếm danh mục"
                            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>
                    <button
                        className="flex items-center rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                        onClick={handleAddCategory}
                    >
                        <Plus size={16} className="mr-1" /> Thêm danh mục
                    </button>
                </div>

                {error && (
                    <div className="mb-6 flex items-center rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                        <AlertCircle size={18} className="mr-2" />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-500">
                            Đang tải danh mục...
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredParentCategories.length === 0 ? (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                Không tìm thấy danh mục nào
                            </div>
                        ) : (
                            filteredParentCategories.map((category) => {
                                const subcategories =
                                    subcategoriesMap[category._id] || []
                                const isExpanded =
                                    expandedCategories[category._id]

                                return (
                                    <div
                                        key={category._id}
                                        className={`${getRandomColor()} relative overflow-hidden rounded-lg border border-gray-200 p-4`}
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex items-center">
                                                <span className="mr-2 text-2xl">
                                                    {category.icon || '📁'}
                                                </span>
                                                <div>
                                                    <h3 className="text-lg font-medium">
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {category.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-1">
                                                <button
                                                    className="rounded-full p-1 hover:bg-white"
                                                    onClick={() =>
                                                        handleEditCategory(
                                                            category,
                                                        )
                                                    }
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit
                                                        size={16}
                                                        className="text-gray-600"
                                                    />
                                                </button>
                                                <button
                                                    className="rounded-full p-1 hover:bg-white"
                                                    onClick={() =>
                                                        handleDeleteCategory(
                                                            category._id,
                                                        )
                                                    }
                                                    title="Xóa"
                                                >
                                                    <Trash2
                                                        size={16}
                                                        className="text-gray-600"
                                                    />
                                                </button>
                                                {subcategories.length > 0 && (
                                                    <button
                                                        className="rounded-full p-1 hover:bg-white"
                                                        onClick={() =>
                                                            toggleCategoryExpand(
                                                                category._id,
                                                            )
                                                        }
                                                        title={
                                                            isExpanded
                                                                ? 'Thu gọn'
                                                                : 'Mở rộng'
                                                        }
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp
                                                                size={16}
                                                                className="text-gray-600"
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={16}
                                                                className="text-gray-600"
                                                            />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <span className="font-medium">
                                                {subcategories.length}
                                            </span>{' '}
                                            danh mục con
                                        </div>

                                        {/* Danh sách danh mục con */}
                                        {isExpanded &&
                                            subcategories.length > 0 && (
                                                <div className="mt-3 border-t border-gray-200 pt-3">
                                                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                                                        Danh mục con:
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {subcategories.map(
                                                            (subcategory) => (
                                                                <div
                                                                    key={
                                                                        subcategory._id
                                                                    }
                                                                    className="flex items-center justify-between rounded-md bg-white/50 p-2"
                                                                >
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2 text-sm">
                                                                            {subcategory.icon ||
                                                                                '📄'}
                                                                        </span>
                                                                        <div>
                                                                            <span className="text-sm font-medium">
                                                                                {
                                                                                    subcategory.name
                                                                                }
                                                                            </span>
                                                                            <span className="ml-2 text-xs text-gray-500">
                                                                                (
                                                                                {
                                                                                    subcategory.slug
                                                                                }

                                                                                )
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex space-x-1">
                                                                        <button
                                                                            className="rounded-full p-1 hover:bg-white"
                                                                            onClick={() =>
                                                                                handleEditCategory(
                                                                                    subcategory,
                                                                                )
                                                                            }
                                                                            title="Chỉnh sửa"
                                                                        >
                                                                            <Edit
                                                                                size={
                                                                                    12
                                                                                }
                                                                                className="text-gray-600"
                                                                            />
                                                                        </button>
                                                                        <button
                                                                            className="rounded-full p-1 hover:bg-white"
                                                                            onClick={() =>
                                                                                handleDeleteCategory(
                                                                                    subcategory._id,
                                                                                )
                                                                            }
                                                                            title="Xóa"
                                                                        >
                                                                            <Trash2
                                                                                size={
                                                                                    12
                                                                                }
                                                                                className="text-gray-600"
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}

                {/* Phân trang */}
            </div>

            {isModalOpen && (
                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    category={editingCategory}
                    onSave={handleSaveCategory}
                    parentCategories={parentCategories}
                />
            )}
        </div>
    )
}

function CategoryModal({
    isOpen,
    onClose,
    category,
    onSave,
    parentCategories,
}: CategoryModalProps) {
    const [formData, setFormData] = useState<Partial<ICategory>>(
        category || {
            name: '',
            slug: '',
            description: '',
            icon: '📁',
            parent: undefined,
        },
    )
    const [formError, setFormError] = useState<string | null>(null)

    // Reset form khi category thay đổi
    useEffect(() => {
        if (category) {
            setFormData(category)
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: '📁',
                parent: undefined,
            })
        }
        setFormError(null)
    }, [category])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: name === 'parent' && value === '' ? undefined : value,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.name) {
            setFormError('Tên danh mục không được để trống')
            return
        }

        // Tạo slug từ tên nếu không có
        const slug =
            formData.slug ||
            formData.name?.toLowerCase().replace(/\s+/g, '-') ||
            ''
        onSave({ ...(formData as ICategory), slug })
    }

    if (!isOpen) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-xl font-semibold">
                        {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 p-6">
                        {formError && (
                            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {formError}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Tên danh mục{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Nhập tên danh mục"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="slug"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Tự động tạo từ tên nếu để trống"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Slug sẽ được sử dụng trong URL. Nếu để trống, hệ
                                thống sẽ tự động tạo từ tên.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Nhập mô tả danh mục"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="icon"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Icon
                            </label>
                            <input
                                type="text"
                                id="icon"
                                name="icon"
                                value={formData.icon || '📁'}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Emoji hoặc tên icon"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Bạn có thể sử dụng emoji (📁, 📱, 💻, ...) hoặc
                                tên icon.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="parent"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Danh mục cha
                            </label>
                            <select
                                id="parent"
                                name="parent"
                                value={formData.parent?.toString() || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            >
                                <option value="">
                                    Không có (Danh mục gốc)
                                </option>
                                {parentCategories
                                    .filter(
                                        (parent) => parent._id !== formData._id,
                                    ) // Loại bỏ chính nó khỏi danh sách cha
                                    .map((parent) => (
                                        <option
                                            key={parent._id}
                                            value={parent._id}
                                        >
                                            {parent.name}
                                        </option>
                                    ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Để trống nếu đây là danh mục gốc
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t p-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                        >
                            {category ? 'Cập nhật' : 'Thêm danh mục'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
