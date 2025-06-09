export interface Subcategory {
    _id: string
    name: string
    slug: string
}

export interface Category {
    _id: string
    name: string
    slug: string
    description?: string
    icon?: string
    parent?: string | Category | null
    createdAt?: string
    updatedAt?: string
    color?: string // Trường bổ sung cho UI
    productCount?: number // Trường bổ sung cho UI
    subcategories?: Subcategory[] // Thêm trường subcategories
}

export interface CategoryResponse {
    success: boolean
    data: Category
}

export interface CategoriesResponse {
    pagination: any
    success: boolean
    count: number
    data: Category[]
}

// Interface cho ICategory từ backend
export interface ICategory {
    _id: string
    name: string
    slug: string
    description?: string
    icon?: string
    parent?: string | ICategory | null
    createdAt?: string
    updatedAt?: string
}
