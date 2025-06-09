'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
    ChevronLeft,
    Plus,
    Minus,
    Heart,
    ShoppingCart,
    Star,
    Truck,
    Shield,
    RotateCcw,
    Check,
} from 'lucide-react'
import { useCart } from '../../../contexts/cart-context'
import { Product } from '../../../../types/product'
import {
    getProductById,
    getProducts,
} from '../../../../services/apiProduct.service'

const ProductDetail: React.FC<{ productId: string }> = ({ productId }) => {
    const id = productId
    const navigate = useNavigate()
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('description')
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [product, setProduct] = useState<Product | null>(null)
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(
        [],
    )
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!id) return

            setIsLoading(true)
            setError(null)

            try {
                console.log('Fetching product with ID:', id)
                const response = await getProductById(id)
                console.log('Product API response:', response)

                if (response && response.data) {
                    setProduct(response.data)

                    // Fetch recommended products from the same category
                    if (response.data.category) {
                        try {
                            const recommendedResponse = await getProducts({
                                limit: 4,
                                category: response.data.category,
                                sort: '-createdAt',
                            })

                            if (recommendedResponse) {
                                // Filter out the current product from recommendations
                                const filteredProducts =
                                    recommendedResponse.data.filter(
                                        (p) => p._id !== id,
                                    )
                                setRecommendedProducts(filteredProducts)
                            }
                        } catch (err) {
                            console.error(
                                'Error fetching recommended products:',
                                err,
                            )
                        }
                    }
                } else {
                    setError('Không thể tải thông tin sản phẩm')
                }
            } catch (err) {
                console.error('Error fetching product details:', err)
                setError('Có lỗi xảy ra khi tải thông tin sản phẩm')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProductDetails()
    }, [id])

    // Handle image URL
    const getImageUrl = (imageUrl: string | undefined) => {
        if (!imageUrl) return '/placeholder.svg?height=384&width=384'

        // If it's a full URL (starts with http or https), use it directly
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl
        }

        // If it's a relative path, add the API base URL
        const API_BASE_URL =
            import.meta.env.VITE_API_URL || 'http://localhost:5000'
        return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    }

    // Handle quantity change
    const handleQuantityChange = (value: number) => {
        if (product && value >= 1 && value <= product.quantity) {
            setQuantity(value)
        }
    }

    // Handle add to cart
    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity)
        }
    }

    // Handle buy now
    const handleBuyNow = () => {
        if (product) {
            addItem(product, quantity)
            navigate('/cart')
        }
    }

    // Display loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-600"></div>
                        <p className="text-lg text-gray-600">
                            Đang tải thông tin sản phẩm...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Display error message
    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    {error || 'Không tìm thấy sản phẩm'}
                </h2>
                <p className="mb-8 text-gray-600">
                    Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mr-4 inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >
                    Thử lại
                </button>
                <Link
                    to="/shop"
                    className="inline-flex items-center rounded-md bg-gray-200 px-6 py-3 text-gray-700 hover:bg-gray-300"
                >
                    <ChevronLeft size={16} className="mr-2" />
                    Quay lại cửa hàng
                </Link>
            </div>
        )
    }

    // Prepare image list
    const productImages =
        product.images && product.images.length > 0
            ? product.images
            : product.image
              ? [product.image]
              : ['/placeholder.svg?height=384&width=384']

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    to="/shop"
                    className="flex items-center text-gray-600 hover:text-blue-600"
                >
                    <ChevronLeft size={16} />
                    <span className="ml-1">Quay lại cửa hàng</span>
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                    {/* Product images */}
                    <div>
                        <div className="relative mb-4 h-80 rounded-lg bg-gray-100 md:h-96">
                            <img
                                src={
                                    getImageUrl(
                                        productImages[activeImageIndex],
                                    ) || '/placeholder.svg'
                                }
                                alt={product.name}
                                className="h-full w-full object-contain p-4"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    // Check to avoid infinite loop
                                    if (
                                        !target.src.includes('placeholder.svg')
                                    ) {
                                        target.src =
                                            '/placeholder.svg?height=384&width=384'
                                    }
                                    // Prevent onError from triggering again
                                    target.onerror = null
                                }}
                            />
                        </div>
                        {productImages.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setActiveImageIndex(index)
                                        }
                                        className={`relative h-20 w-20 overflow-hidden rounded-md border-2 ${
                                            activeImageIndex === index
                                                ? 'border-blue-500'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <img
                                            src={
                                                getImageUrl(image) ||
                                                '/placeholder.svg'
                                            }
                                            alt={`${product.name} - Ảnh ${index + 1}`}
                                            className="h-full w-full object-contain p-1"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement
                                                if (
                                                    !target.src.includes(
                                                        'placeholder.svg',
                                                    )
                                                ) {
                                                    target.src =
                                                        '/placeholder.svg?height=80&width=80'
                                                }
                                                target.onerror = null
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product information */}
                    <div>
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">
                            {product.name}
                        </h1>

                        <div className="mb-4 flex items-center">
                            {product.rating && (
                                <div className="flex items-center">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={
                                                    i <
                                                    Math.floor(
                                                        product.rating ?? 0,
                                                    )
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-500">
                                        {product.rating} ({product.reviews || 0}{' '}
                                        đánh giá)
                                    </span>
                                </div>
                            )}

                            <span className="mx-3 text-gray-300">|</span>

                            <span
                                className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </span>

                            {product.barcode && (
                                <>
                                    <span className="mx-3 text-gray-300">
                                        |
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Mã SP: {product.barcode}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-bold text-blue-600">
                                {product.price?.toLocaleString()}đ
                            </span>
                            {product.oldPrice &&
                                product.oldPrice > product.price && (
                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                        {product.oldPrice.toLocaleString()}đ
                                    </span>
                                )}

                            {product.oldPrice &&
                                product.oldPrice > product.price && (
                                    <span className="ml-2 rounded bg-red-500 px-2 py-1 text-sm text-white">
                                        Tiết kiệm{' '}
                                        {(
                                            product.oldPrice - product.price
                                        ).toLocaleString()}
                                        đ
                                    </span>
                                )}
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">
                                {product.description}
                            </p>
                        </div>

                        {product.quantity > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center">
                                    <span className="mr-4 text-gray-700">
                                        Số lượng:
                                    </span>
                                    <div className="flex items-center rounded-md border border-gray-300">
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    quantity - 1,
                                                )
                                            }
                                            disabled={quantity <= 1}
                                            className={`px-3 py-1 ${quantity <= 1 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    Number.parseInt(
                                                        e.target.value,
                                                    ) || 1,
                                                )
                                            }
                                            className="w-12 border-x border-gray-300 py-1 text-center"
                                        />
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    quantity + 1,
                                                )
                                            }
                                            disabled={
                                                quantity >= product.quantity
                                            }
                                            className={`px-3 py-1 ${
                                                quantity >= product.quantity
                                                    ? 'text-gray-300'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <span className="ml-4 text-sm text-gray-500">
                                        Còn {product.quantity}{' '}
                                        {product.unit || 'sản phẩm'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.quantity <= 0}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-6 py-3 font-medium ${
                                    product.quantity > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'cursor-not-allowed bg-gray-200 text-gray-400'
                                }`}
                            >
                                <ShoppingCart size={18} />
                                <span>Thêm vào giỏ</span>
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={product.quantity <= 0}
                                className={`flex-1 rounded-md px-6 py-3 font-medium ${
                                    product.quantity > 0
                                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                                        : 'cursor-not-allowed bg-gray-200 text-gray-400'
                                }`}
                            >
                                Mua ngay
                            </button>

                            <button className="rounded-md border border-gray-300 p-3 text-gray-500 hover:border-red-500 hover:text-red-500">
                                <Heart size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <Truck
                                    size={18}
                                    className="mt-0.5 mr-2 flex-shrink-0 text-blue-600"
                                />
                                <div>
                                    <p className="text-sm font-medium">
                                        Giao hàng miễn phí
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Cho đơn hàng từ 500.000đ
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Shield
                                    size={18}
                                    className="mt-0.5 mr-2 flex-shrink-0 text-blue-600"
                                />
                                <div>
                                    <p className="text-sm font-medium">
                                        Bảo hành chính hãng
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        12 tháng tại trung tâm bảo hành
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <RotateCcw
                                    size={18}
                                    className="mt-0.5 mr-2 flex-shrink-0 text-blue-600"
                                />
                                <div>
                                    <p className="text-sm font-medium">
                                        Đổi trả dễ dàng
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        7 ngày đổi trả miễn phí
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Check
                                    size={18}
                                    className="mt-0.5 mr-2 flex-shrink-0 text-blue-600"
                                />
                                <div>
                                    <p className="text-sm font-medium">
                                        Sản phẩm chính hãng
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        100% hàng chính hãng
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="border-b">
                    <div className="flex">
                        <button
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'description'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                            onClick={() => setActiveTab('description')}
                        >
                            Mô tả sản phẩm
                        </button>
                        <button
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'specifications'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                            onClick={() => setActiveTab('specifications')}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'reviews'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Đánh giá ({product.reviews || 0})
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'description' && (
                        <div className="prose max-w-none">
                            <p>{product.description}</p>
                        </div>
                    )}

                    {activeTab === 'specifications' && (
                        <div className="overflow-x-auto">
                            {product.specifications &&
                            Object.keys(product.specifications).length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        {Object.entries(
                                            product.specifications,
                                        ).map(([key, value]) => (
                                            <tr key={key}>
                                                <td className="w-1/3 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                                                    {key}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">
                                    Không có thông số kỹ thuật cho sản phẩm này.
                                </p>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {product.reviews && product.reviews > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                                <span className="font-medium text-gray-600">
                                                    KH
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="flex items-center">
                                                <span className="font-medium text-gray-800">
                                                    Khách hàng
                                                </span>
                                                <span className="mx-2 text-gray-400">
                                                    •
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    2 ngày trước
                                                </span>
                                            </div>
                                            <div className="mt-1 mb-2 flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={
                                                            i < 5
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-700">
                                                Sản phẩm rất tốt, đúng như mô
                                                tả. Giao hàng nhanh, đóng gói
                                                cẩn thận. Sẽ ủng hộ shop lần
                                                sau.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    Chưa có đánh giá nào cho sản phẩm này.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Recommended products */}
            {recommendedProducts.length > 0 && (
                <div className="mt-12">
                    <h2 className="mb-6 text-xl font-bold text-gray-800">
                        Sản phẩm tương tự
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {recommendedProducts.map((product) => (
                            <div
                                key={product._id}
                                className="overflow-hidden rounded-lg bg-white shadow-sm"
                            >
                                <Link
                                    to={`/shop/product/${product._id}`}
                                    className="relative block h-48"
                                >
                                    <img
                                        src={
                                            getImageUrl(product.image) ||
                                            '/placeholder.svg'
                                        }
                                        alt={product.name}
                                        className="h-full w-full object-contain p-4"
                                        onError={(e) => {
                                            const target =
                                                e.target as HTMLImageElement
                                            if (
                                                !target.src.includes(
                                                    'placeholder.svg',
                                                )
                                            ) {
                                                target.src =
                                                    '/placeholder.svg?height=192&width=192'
                                            }
                                            target.onerror = null
                                        }}
                                    />
                                </Link>
                                <div className="p-4">
                                    <Link
                                        to={`/shop/product/${product._id}`}
                                        className="block"
                                    >
                                        <h3 className="line-clamp-2 h-14 text-lg font-medium text-gray-800">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-lg font-bold text-blue-600">
                                            {product.price?.toLocaleString()}đ
                                        </span>
                                        <button
                                            onClick={() => addItem(product, 1)}
                                            className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetail
