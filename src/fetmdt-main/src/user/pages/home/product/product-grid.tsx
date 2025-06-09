import type React from 'react'
import type { Product } from '../../../../types/product'
import ProductCard from './product-card'

interface ProductGridProps {
    products: Product[]
    onAddToCart?: (product: Product) => void // Làm cho prop này optional
    onAddToWishlist?: (product: Product) => void
    columns?: 2 | 3 | 4 | 5
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    onAddToCart = () => {}, // Cung cấp giá trị mặc định
    onAddToWishlist,
    columns = 4,
}) => {
    const getGridCols = () => {
        switch (columns) {
            case 2:
                return 'grid-cols-1 sm:grid-cols-2'
            case 3:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            case 5:
                return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            case 4:
            default:
                return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }
    }

    return (
        <div className={`grid ${getGridCols()} gap-6`}>
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                />
            ))}
        </div>
    )
}

export default ProductGrid
