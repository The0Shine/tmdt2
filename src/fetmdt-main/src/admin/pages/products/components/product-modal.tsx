'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import ProductForm from './product-form'
import { Product, ProductFormData } from '../../../../types/product'
import { ICategory } from '@/types/category'

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    product: Product | null
    onSave: (product: Product) => void
    categories: ICategory[]
}

const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    product,
    onSave,
    categories,
}) => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        category: categories[0] || '',
        unit: 'Chiếc',
        price: 0,
        quantity: 0,
        status: 'in-stock',
        image: '',
        description: '',
        barcode: '',
        costPrice: 0,
    })

    // Cập nhật form khi product thay đổi
    useEffect(() => {
        if (product) {
            setFormData(product)
        } else {
            setFormData({
                name: '',
                category: categories[0] || '',
                unit: 'Chiếc',
                price: 0,
                quantity: 0,
                status: 'in-stock',
                image: '',
                description: '',
                barcode: '',
                costPrice: 0,
            })
        }
    }, [product, categories])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'price' || name === 'costPrice'
                    ? Number(value)
                    : value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData as Product)
    }

    if (!isOpen) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[93vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-xl font-semibold">
                        {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div
                    className="overflow-y-auto p-6"
                    style={{ maxHeight: 'calc(90vh - 130px)' }}
                >
                    <ProductForm
                        formData={formData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        categories={categories}
                        onImagesChange={function (
                            mainImage: string,
                            additionalImages: string[],
                        ): void {
                            throw new Error('Function not implemented.')
                        }}
                        isEditing={false}
                    />
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
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                    >
                        {product ? 'Cập nhật' : 'Thêm sản phẩm'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
