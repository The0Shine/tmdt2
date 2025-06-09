'use client'

import { useEffect, useState } from 'react'
import { useCart } from '../../contexts/cart-context'
import { getCategories } from '../../../services/apiCategory.service'
import { getProducts } from '../../../services/apiProduct.service'
import CategoryGrid from './components/category-grid'
import HeroBanner from './components/hero-banner'
import ProductSection from './components/product-section'
import SecondaryBanner from './components/secondary-banner'
import { banners } from '../../data/banners'
import type { Product } from '../../../types/product'
import type { Category } from '../../../types/category'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Button } from '../../../components/ui/button'
import { Loader2 } from 'lucide-react'

export default function ShopHomePage() {
    const { addItem } = useCart()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // State cho dữ liệu từ API
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [hotProducts, setHotProducts] = useState<Product[]>([])
    const [newProducts, setNewProducts] = useState<Product[]>([])
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(
        [],
    )
    const [categories, setCategories] = useState<Category[]>([])

    // Lấy banner chính
    const mainBanner = banners.find((banner) => banner.position === 'main')

    // Lấy các banner phụ
    const secondaryBanners = banners.filter(
        (banner) => banner.position === 'secondary',
    )

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Fetch danh mục từ API thật
                try {
                    const categoriesResponse = await getCategories()
                    if (
                        categoriesResponse?.success &&
                        categoriesResponse.data
                    ) {
                        setCategories(categoriesResponse.data)
                    }
                } catch (err) {
                    console.error('Error fetching categories:', err)
                }

                // Fetch sản phẩm nổi bật từ API thật
                try {
                    const featuredResponse = await getProducts({
                        featured: true,
                        limit: 8,
                        page: 1,
                    })
                    if (featuredResponse?.success && featuredResponse.data) {
                        setFeaturedProducts(featuredResponse.data)
                    }
                } catch (err) {
                    console.error('Error fetching featured products:', err)
                }

                // Fetch sản phẩm hot từ API thật
                try {
                    const hotResponse = await getProducts({
                        hot: true,
                        limit: 8,
                        page: 1,
                    })
                    if (hotResponse?.success && hotResponse.data) {
                        setHotProducts(hotResponse.data)
                    }
                } catch (err) {
                    console.error('Error fetching hot products:', err)
                }

                // Fetch sản phẩm mới từ API thật
                try {
                    const newResponse = await getProducts({
                        new: true,
                        limit: 8,
                        page: 1,
                    })
                    if (newResponse?.success && newResponse.data) {
                        setNewProducts(newResponse.data)
                    }
                } catch (err) {
                    console.error('Error fetching new products:', err)
                }

                // Fetch sản phẩm đề xuất từ API thật
                try {
                    const recommendedResponse = await getProducts({
                        recommended: true,
                        limit: 8,
                        page: 1,
                    })
                    if (
                        recommendedResponse?.success &&
                        recommendedResponse.data
                    ) {
                        setRecommendedProducts(recommendedResponse.data)
                    }
                } catch (err) {
                    console.error('Error fetching recommended products:', err)
                }
            } catch (err) {
                console.error('Error fetching data:', err)
                setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (product: Product) => {
        addItem(product, 1)
    }

    // Hiển thị trạng thái loading
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
                        <p className="text-lg text-gray-600">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Hiển thị lỗi nếu có
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                        {error}
                    </AlertDescription>
                </Alert>
                <div className="mt-4 text-center">
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Banner */}
            {mainBanner && (
                <div className="mb-8">
                    <HeroBanner banner={mainBanner} />
                </div>
            )}

            {/* Danh mục sản phẩm */}
            {categories.length > 0 && (
                <section className="mb-12">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">
                        Danh mục sản phẩm
                    </h2>
                    <CategoryGrid categories={categories} />
                </section>
            )}

            {/* Sản phẩm nổi bật */}
            {featuredProducts.length > 0 && (
                <ProductSection
                    title="Sản phẩm nổi bật"
                    subtitle="Những sản phẩm được khách hàng yêu thích nhất"
                    products={featuredProducts}
                    viewAllLink="/shop?featured=true"
                    onAddToCart={handleAddToCart}
                />
            )}

            {/* Banner phụ */}
            {secondaryBanners.length > 0 && (
                <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {secondaryBanners.map((banner) => (
                        <SecondaryBanner key={banner.id} banner={banner} />
                    ))}
                </div>
            )}

            {/* Sản phẩm hot */}
            {hotProducts.length > 0 && (
                <ProductSection
                    title="Sản phẩm hot"
                    subtitle="Đang được tìm kiếm nhiều nhất"
                    products={hotProducts}
                    viewAllLink="/shop?hot=true"
                    onAddToCart={handleAddToCart}
                />
            )}

            {/* Sản phẩm mới */}
            {newProducts.length > 0 && (
                <ProductSection
                    title="Sản phẩm mới"
                    subtitle="Vừa ra mắt tại TechZone"
                    products={newProducts}
                    viewAllLink="/shop?new=true"
                    onAddToCart={handleAddToCart}
                />
            )}

            {/* Sản phẩm đề xuất */}
            {recommendedProducts.length > 0 && (
                <ProductSection
                    title="Có thể bạn sẽ thích"
                    products={recommendedProducts}
                    viewAllLink="/shop?recommended=true"
                    onAddToCart={handleAddToCart}
                />
            )}

            {/* Hiển thị thông báo nếu không có dữ liệu */}
            {!isLoading &&
                categories.length === 0 &&
                featuredProducts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="mb-4 text-gray-500">
                            Hiện tại chưa có sản phẩm nào. Vui lòng quay lại
                            sau.
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Tải lại trang
                        </Button>
                    </div>
                )}
        </div>
    )
}
