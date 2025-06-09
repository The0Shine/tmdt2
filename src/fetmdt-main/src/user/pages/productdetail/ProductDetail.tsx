import { useParams } from 'react-router-dom'
import ProductDetail from '../home/product/product-detail'

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    if (!id) return null
    return <ProductDetail productId={id} />
}

export default ProductDetailPage
