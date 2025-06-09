export interface Product {
    published: any
    _id: string
    name: string
    description: string
    price: number
    oldPrice?: number
    category: string
    subcategory?: string
    quantity: number
    status: 'in-stock' | 'out-of-stock'
    image?: string
    images?: string[]
    barcode?: string
    unit: string
    costPrice?: number
    featured?: boolean
    recommended?: boolean
    hot?: boolean
    new?: boolean
    specifications?: Map<string, string>
    rating?: number
    reviews?: number
    createdAt?: string
    updatedAt?: string
}

export type ProductFormData = Partial<Product>
