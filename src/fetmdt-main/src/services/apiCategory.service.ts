import type {
    CategoriesResponse,
    CategoryResponse,
    ICategory,
} from '@/types/category'
import { mainRepository } from '../utils/Repository'

interface CategoryQueryParams {
    page?: number
    limit?: number
    search?: string
    parent?: string | null
    sort?: string
}

// Lấy danh sách danh mục với các tùy chọn lọc và phân trang
export const getCategories = async (params: CategoryQueryParams = {}) => {
    const queryParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            // Xử lý đặc biệt cho parent parameter
            if (key === 'parent' && value === 'null') {
                // Không thêm parent vào query nếu giá trị là 'null'
                return
            }
            queryParams.append(key, String(value))
        }
    })

    const queryString = queryParams.toString()
    const url = queryString
        ? `/api/categories?${queryString}`
        : '/api/categories'

    return await mainRepository.get<CategoriesResponse>(url)
}

// Lấy danh mục cha (không có parent) - sửa lại để không gửi parent=null
export const getParentCategories = async () => {
    // Không gửi parent=null, thay vào đó backend sẽ tự động lọc những category không có parent
    return await mainRepository.get<CategoriesResponse>(
        '/api/categories?parentOnly=true',
    )
}

// Lấy danh mục con theo parent ID
export const getSubcategories = async (parentId: string) => {
    return await mainRepository.get<CategoriesResponse>(
        `/api/categories?parent=${parentId}`,
    )
}

// Lấy danh mục theo ID
export const getCategoryById = async (id: string) => {
    return await mainRepository.get<CategoryResponse>(`/api/categories/${id}`)
}

// Tạo danh mục mới
export const createCategory = async (category: Partial<ICategory>) => {
    return await mainRepository.post<CategoryResponse>(
        '/api/categories',
        category,
    )
}

// Cập nhật danh mục
export const updateCategory = async (
    id: string,
    category: Partial<ICategory>,
) => {
    return await mainRepository.put<CategoryResponse>(
        `/api/categories/${id}`,
        category,
    )
}

// Xóa danh mục
export const deleteCategory = async (id: string) => {
    return await mainRepository.delete<{ success: boolean }>(
        `/api/categories/${id}`,
    )
}
