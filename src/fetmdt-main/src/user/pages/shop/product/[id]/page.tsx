import ProductDetail from '../../../home/product/product-detail'

export default function ProductDetailPage({
    params,
}: {
    params: { id: string }
}) {
    return <ProductDetail productId={params.id} />
}
