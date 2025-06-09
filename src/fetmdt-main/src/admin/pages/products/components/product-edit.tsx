'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react'
import { getCategories } from '../../../../services/apiCategory.service'
import {
    getProductById,
    updateProduct,
    deleteProduct,
} from '../../../../services/apiProduct.service'
import type { Product } from '../../../../types/product'
import ProductForm from './product-form'
import type { ICategory } from '@/types/category'

export default function ProductEdit() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [product, setProduct] = useState<Product | null>(null)
    const [categories, setCategories] = useState<ICategory[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Tải thông tin sản phẩm và danh mục
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError(null)
            try {
                // Tải thông tin sản phẩm
                if (id) {
                    const productResponse = await getProductById(id)

                    if (productResponse) {
                        setProduct({
                            ...productResponse.data,
                            // Đảm bảo các trường boolean được xử lý đúng
                            featured: productResponse.data.featured || false,
                            recommended:
                                productResponse.data.recommended || false,
                            hot: productResponse.data.hot || false,
                            new: productResponse.data.new || false,
                            published: productResponse.data.published !== false, // Mặc định là true nếu không có
                            // Đảm bảo mảng hình ảnh
                            images: productResponse.data.images || [],
                        })
                    } else {
                        setProduct(null)
                        setError('Không tìm thấy sản phẩm với ID này.')
                        navigate('/admin/products')
                    }
                }

                // Tải danh sách danh mục
                const categoriesResponse = await getCategories()
                if (categoriesResponse) {
                    setCategories(categoriesResponse.data)
                } else {
                    setCategories([])
                    setError('Không thể tải danh mục sản phẩm.')
                }
            } catch (err) {
                setError(
                    'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.',
                )
                console.error('Error loading product data:', err)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [id, navigate])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target as HTMLInputElement

        // Không cho phép thay đổi stock

        setProduct((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                [name]:
                    type === 'checkbox'
                        ? (e.target as HTMLInputElement).checked
                        : name === 'price' ||
                            name === 'costPrice' ||
                            name === 'oldPrice'
                          ? Number(value)
                          : value,
            }
        })
    }

    const handleImagesChange = (
        mainImage: string,
        additionalImages: string[],
    ) => {
        setProduct((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                image: mainImage,
                images: additionalImages,
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!product || !id) return

        setSaving(true)
        setError(null)
        try {
            // Đảm bảo stock luôn là 0 khi lưu
            await updateProduct(id, { ...product })
            navigate('/admin/products')
        } catch (err) {
            setError('Không thể cập nhật sản phẩm. Vui lòng thử lại sau.')
            console.error('Error updating product:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!id) return
        if (window.confirm('Bạn có chắc ch���n muốn xóa sản phẩm này không?')) {
            try {
                await deleteProduct(id)
                navigate('/admin/products')
            } catch (err) {
                setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.')
                console.error('Error deleting product:', err)
            }
        }
    }

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-500">
                        Đang tải thông tin sản phẩm...
                    </p>
                </div>
            </div>
        )
    }

    if (!product && !loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500" />
                    <h2 className="mt-2 text-xl font-semibold">
                        Không tìm thấy sản phẩm
                    </h2>
                    <p className="mt-1 text-gray-500">
                        Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                    <Link
                        to="/admin/products"
                        className="mt-4 inline-block text-teal-500 hover:underline"
                    >
                        Quay lại danh sách sản phẩm
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center">
                                <Link
                                    to="/admin/products"
                                    className="mr-2 text-gray-500 hover:text-teal-500"
                                >
                                    <ArrowLeft size={20} />
                                </Link>
                                <h1 className="text-2xl font-semibold text-gray-800">
                                    Chỉnh sửa sản phẩm
                                </h1>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Link
                                    to="/admin/dashboard"
                                    className="hover:text-teal-500"
                                >
                                    Trang chủ
                                </Link>
                                <span className="mx-2">•</span>
                                <Link
                                    to="/admin/products"
                                    className="hover:text-teal-500"
                                >
                                    Sản phẩm
                                </Link>
                                <span className="mx-2">•</span>
                                <span>Chỉnh sửa</span>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleDelete}
                                className="flex items-center rounded-md border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
                            >
                                <Trash2 size={16} className="mr-1" /> Xóa
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className={`flex items-center rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 ${
                                    saving
                                        ? 'cursor-not-allowed opacity-70'
                                        : ''
                                }`}
                            >
                                <Save size={16} className="mr-1" />{' '}
                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                            <AlertCircle size={18} className="mr-2" />
                            {error}
                        </div>
                    )}

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        {product && (
                            <ProductForm
                                formData={product}
                                onChange={handleChange}
                                onImagesChange={handleImagesChange}
                                onSubmit={handleSubmit}
                                categories={categories}
                                isEditing={true}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
