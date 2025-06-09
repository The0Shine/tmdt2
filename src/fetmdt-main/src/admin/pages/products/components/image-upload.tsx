'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { uploadImage } from '../../../../utils/Upload'

interface ImageUploadProps {
    currentImage: string
    onImageChange: (imageUrl: string) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImage,
    onImageChange,
}) => {
    const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '')
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Sử dụng useRef để theo dõi component có được mount hay không
    const isMounted = useRef(true)

    // Dọn dẹp khi unmount
    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    // Cập nhật previewUrl chỉ khi currentImage thay đổi
    useEffect(() => {
        // Chỉ cập nhật nếu giá trị khác nhau để tránh vòng lặp
        if (currentImage !== previewUrl) {
            setPreviewUrl(currentImage || '')
        }
    }, [currentImage])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                setIsUploading(true)
                setError(null)

                // Hiển thị preview ngay lập tức
                const reader = new FileReader()
                reader.onloadend = () => {
                    const result = reader.result as string
                    setPreviewUrl(result)
                }
                reader.readAsDataURL(file)

                // Tải lên hình ảnh lên Cloudinary
                const imageUrl = await uploadImage(file)

                // Kiểm tra xem component còn được mount không trước khi cập nhật state
                if (isMounted.current) {
                    onImageChange(imageUrl)
                }
            } catch (err) {
                if (isMounted.current) {
                    setError('Không thể tải lên hình ảnh. Vui lòng thử lại.')
                    console.error('Lỗi khi tải lên hình ảnh:', err)
                }
            } finally {
                if (isMounted.current) {
                    setIsUploading(false)
                }
            }
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            try {
                setIsUploading(true)
                setError(null)

                // Hiển thị preview ngay lập tức
                const reader = new FileReader()
                reader.onloadend = () => {
                    const result = reader.result as string
                    setPreviewUrl(result)
                }
                reader.readAsDataURL(file)

                // Tải lên hình ảnh lên Cloudinary
                const imageUrl = await uploadImage(file)

                // Kiểm tra xem component còn được mount không trước khi cập nhật state
                if (isMounted.current) {
                    onImageChange(imageUrl)
                }
            } catch (err) {
                if (isMounted.current) {
                    setError('Không thể tải lên hình ảnh. Vui lòng thử lại.')
                    console.error('Lỗi khi tải lên hình ảnh:', err)
                }
            } finally {
                if (isMounted.current) {
                    setIsUploading(false)
                }
            }
        }
    }

    const removeImage = () => {
        setPreviewUrl('')
        onImageChange('')
        setError(null)
    }

    return (
        <div className="space-y-2">
            {error && <div className="mb-2 text-sm text-red-500">{error}</div>}

            {previewUrl ? (
                <div className="relative h-48 overflow-hidden rounded-md border border-gray-300">
                    <img
                        src={previewUrl || '/placeholder.svg'}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                    {isUploading && (
                        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                            <div className="text-white">Đang tải lên...</div>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
                        disabled={isUploading}
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed ${
                        isDragging
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-300'
                    } flex h-48 cursor-pointer flex-col items-center justify-center rounded-md p-6 ${
                        isUploading ? 'pointer-events-none opacity-50' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                        document.getElementById('file-upload')?.click()
                    }
                >
                    <Upload size={24} className="mb-2 text-gray-400" />
                    <p className="text-center text-sm text-gray-500">
                        <span className="font-medium text-teal-500">
                            Nhấp để tải lên
                        </span>{' '}
                        hoặc kéo và thả
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        PNG, JPG, GIF tối đa 5MB
                    </p>
                    {isUploading && (
                        <p className="mt-2 text-sm text-teal-500">
                            Đang tải lên...
                        </p>
                    )}
                </div>
            )}
            <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />
        </div>
    )
}

export default ImageUpload
