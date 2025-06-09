import type React from 'react'
import { ChevronRight, Link } from 'lucide-react'
import { Product } from '../../../../types/product'
import ProductGrid from '../product/product-grid'

interface ProductSectionProps {
    title: string
    subtitle?: string
    products: Product[]
    viewAllLink?: string
    onAddToCart: (product: Product) => void
    onAddToWishlist?: (product: Product) => void
    columns?: 2 | 3 | 4 | 5
}

const ProductSection: React.FC<ProductSectionProps> = ({
    title,
    subtitle,
    products,
    viewAllLink,
    onAddToCart,
    onAddToWishlist,
    columns = 4,
}) => {
    return (
        <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-1 text-gray-600">{subtitle}</p>
                    )}
                </div>
                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        Xem tất cả
                        <ChevronRight size={16} className="ml-1" />
                    </Link>
                )}
            </div>

            <ProductGrid
                products={products}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                columns={columns}
            />
        </section>
    )
}

export default ProductSection
