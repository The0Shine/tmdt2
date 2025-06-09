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

export interface CategoryResponse {
    success: boolean
    data: ICategory
}

export interface CategoriesResponse {
    success: boolean
    count: number
    data: ICategory[]
}

export interface CategoryWithChildren extends ICategory {
    children?: ICategory[]
}
