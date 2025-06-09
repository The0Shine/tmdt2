'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Upload, Plus, Trash2, Edit2, ImageIcon } from 'lucide-react'
import { uploadImage, uploadMultipleImages } from '../../../../utils/Upload'

interface ImageGalleryManagerProps {
    mainImage: string
    additionalImages?: string[]
    onImagesChange: (mainImage: string, additionalImages: string[]) => void
}

const ImageGalleryManager: React.FC<ImageGalleryManagerProps> = ({
    mainImage,
    additionalImages = [],
    onImagesChange,
}) => {
    const [previewMainImage, setPreviewMainImage] = useState<string>(
        mainImage || '',
    )
    const [previewAdditionalImages, setPreviewAdditionalImages] = useState<
        string[]
    >(additionalImages || [])
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [editingImageName, setEditingImageName] = useState<{
        index: number
        name: string
    } | null>(null)
    const [imageNames, setImageNames] = useState<string[]>(
        additionalImages.map((_, index) => `Hình ảnh phụ ${index + 1}`),
    )

    // Cập nhật previewMainImage khi mainImage thay đổi
    useEffect(() => {
        setPreviewMainImage(mainImage || '')
    }, [mainImage])

    // Cập nhật previewAdditionalImages khi additionalImages thay đổi
    useEffect(() => {
        setPreviewAdditionalImages(additionalImages || [])
        setImageNames(
            additionalImages.map((_, index) => `Hình ảnh phụ ${index + 1}`),
        )
    }, [additionalImages])

    const handleMainImageUpload = async (file: File) => {
        try {
            setIsUploading(true)
            setError(null)

            // Hiển thị preview trước khi tải lên
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setPreviewMainImage(result)
            }
            reader.readAsDataURL(file)

            // Tải lên hình ảnh lên Cloudinary
            const imageUrl = await uploadImage(file)
            setPreviewMainImage(imageUrl)
            onImagesChange(imageUrl, previewAdditionalImages)
        } catch (err) {
            setError('Không thể tải lên hình ảnh. Vui lòng thử lại.')
            console.error('Lỗi khi tải lên hình ảnh:', err)
        } finally {
            setIsUploading(false)
        }
    }

    const handleAdditionalImagesUpload = async (files: FileList) => {
        try {
            setIsUploading(true)
            setError(null)

            // Tạo mảng File từ FileList
            const fileArray = Array.from(files)

            // Hiển thị preview trước khi tải lên
            const previews: string[] = []
            for (const file of fileArray) {
                const reader = new FileReader()
                const preview = await new Promise<string>((resolve) => {
                    reader.onloadend = () => resolve(reader.result as string)
                    reader.readAsDataURL(file)
                })
                previews.push(preview)
            }

            // Cập nhật preview tạm thời
            const newPreviews = [...previewAdditionalImages, ...previews]
            setPreviewAdditionalImages(newPreviews)

            // Tạo tên mặc định cho hình ảnh mới
            const newNames = [...imageNames]
            for (let i = 0; i < files.length; i++) {
                newNames.push(
                    `Hình ảnh phụ ${previewAdditionalImages.length + i + 1}`,
                )
            }
            setImageNames(newNames)

            // Tải lên hình ảnh lên Cloudinary
            const imageUrls = await uploadMultipleImages(fileArray)

            // Cập nhật URL thực sau khi tải lên
            const newImages = [...previewAdditionalImages, ...imageUrls]
            setPreviewAdditionalImages(newImages)
            onImagesChange(previewMainImage, newImages)
        } catch (err) {
            setError('Không thể tải lên hình ảnh. Vui lòng thử lại.')
            console.error('Lỗi khi tải lên hình ảnh:', err)
        } finally {
            setIsUploading(false)
        }
    }

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleMainImageUpload(file)
        }
    }

    const handleAdditionalImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleAdditionalImagesUpload(files)
        }
    }

    const removeMainImage = () => {
        setPreviewMainImage('')
        onImagesChange('', previewAdditionalImages)
        setError(null)
    }

    const removeAdditionalImage = (index: number) => {
        const newImages = [...previewAdditionalImages]
        newImages.splice(index, 1)

        const newNames = [...imageNames]
        newNames.splice(index, 1)

        setPreviewAdditionalImages(newImages)
        setImageNames(newNames)
        onImagesChange(previewMainImage, newImages)
    }

    const setAsMainImage = (url: string, index: number) => {
        // Nếu đã có hình ảnh chính, chuyển nó thành hình ảnh phụ
        if (previewMainImage) {
            const newAdditionalImages = [...previewAdditionalImages]
            newAdditionalImages.push(previewMainImage)

            const newNames = [...imageNames]
            newNames.push('Hình ảnh phụ (trước đây là chính)')

            setPreviewAdditionalImages(newAdditionalImages)
            setImageNames(newNames)
        }

        // Đặt hình ảnh được chọn làm hình ảnh chính
        setPreviewMainImage(url)

        // Xóa hình ảnh đã chọn khỏi danh sách hình ảnh phụ
        const newImages = [...previewAdditionalImages]
        newImages.splice(index, 1)

        const newNames = [...imageNames]
        newNames.splice(index, 1)

        setPreviewAdditionalImages(newImages)
        setImageNames(newNames)

        onImagesChange(url, newImages)
    }

    const startEditImageName = (index: number) => {
        setEditingImageName({ index, name: imageNames[index] })
    }

    const saveImageName = () => {
        if (editingImageName) {
            const newNames = [...imageNames]
            newNames[editingImageName.index] = editingImageName.name
            setImageNames(newNames)
            setEditingImageName(null)
        }
    }

    return (
        <div className="space-y-6">
            {error && <div className="mb-2 text-sm text-red-500">{error}</div>}

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-700">
                        Hình ảnh chính
                    </h3>
                    <label className="flex cursor-pointer items-center rounded-md bg-teal-500 px-3 py-1.5 text-sm text-white hover:bg-teal-600">
                        <Plus size={16} className="mr-1" /> Tải lên
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </label>
                </div>

                {previewMainImage ? (
                    <div className="relative overflow-hidden rounded-md border border-gray-300">
                        <div className="relative aspect-video">
                            <img
                                src={previewMainImage || '/placeholder.svg'}
                                alt="Hình ảnh chính"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="border-t border-gray-200 bg-gray-50 p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <ImageIcon
                                        size={16}
                                        className="mr-2 text-gray-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Hình ảnh chính
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeMainImage}
                                    className="text-red-500 hover:text-red-700"
                                    disabled={isUploading}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        {isUploading && (
                            <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                                <div className="text-white">
                                    Đang tải lên...
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-teal-500 hover:bg-teal-50"
                        onClick={() =>
                            document
                                .getElementById('main-image-upload')
                                ?.click()
                        }
                    >
                        <Upload size={32} className="mb-2 text-gray-400" />
                        <p className="text-center text-sm text-gray-500">
                            <span className="font-medium text-teal-500">
                                Nhấp để tải lên
                            </span>{' '}
                            hoặc kéo và thả
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            PNG, JPG, GIF tối đa 5MB
                        </p>
                        <input
                            type="file"
                            id="main-image-upload"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-700">
                        Thư viện hình ảnh
                    </h3>
                    <label className="flex cursor-pointer items-center rounded-md bg-teal-500 px-3 py-1.5 text-sm text-white hover:bg-teal-600">
                        <Plus size={16} className="mr-1" /> Thêm hình ảnh
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAdditionalImageChange}
                            className="hidden"
                            disabled={isUploading}
                            multiple
                        />
                    </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {previewAdditionalImages.map((url, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-md border border-gray-300"
                        >
                            <div className="relative aspect-square">
                                <img
                                    src={url || '/placeholder.svg'}
                                    alt={imageNames[index]}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="border-t border-gray-200 bg-gray-50 p-3">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        {editingImageName &&
                                        editingImageName.index === index ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={
                                                        editingImageName.name
                                                    }
                                                    onChange={(e) =>
                                                        setEditingImageName({
                                                            ...editingImageName,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                                                    onBlur={saveImageName}
                                                    onKeyDown={(e) =>
                                                        e.key === 'Enter' &&
                                                        saveImageName()
                                                    }
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <ImageIcon
                                                    size={16}
                                                    className="mr-2 flex-shrink-0 text-gray-500"
                                                />
                                                <span className="truncate text-sm font-medium text-gray-700">
                                                    {imageNames[index]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-2 flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                startEditImageName(index)
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                            title="Đổi tên"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setAsMainImage(url, index)
                                            }
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Đặt làm ảnh chính"
                                        >
                                            <Plus size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeAdditionalImage(index)
                                            }
                                            className="text-red-500 hover:text-red-700"
                                            title="Xóa ảnh"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-teal-500 hover:bg-teal-50">
                        <Plus size={32} className="mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Thêm hình ảnh</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAdditionalImageChange}
                            className="hidden"
                            disabled={isUploading}
                            multiple
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}

export default ImageGalleryManager
