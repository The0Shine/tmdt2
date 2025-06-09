import CategoryPage from '../../category/category-page'

export default function ShopCategoryPage({
    params,
}: {
    params: { category: string }
}) {
    return <CategoryPage category={params.category} />
}
