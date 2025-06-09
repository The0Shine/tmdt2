import { mainRepository } from '../utils/Repository'

export interface RoleResponse {
    _id: string
    name: string
    description?: string
    permissions: string[]
    isActive: boolean
    userCount: number // Thêm field userCount
    createdAt: string
    updatedAt: string
}

export interface CreateRoleRequest {
    name: string
    description?: string
    permissions: string[]
    isActive?: boolean
}

export interface UpdateRoleRequest {
    name?: string
    description?: string
    permissions?: string[]
    isActive?: boolean
}

export interface RolesListResponse {
    data: RoleResponse[]
    meta: {
        count: number
        total: number
        pagination: {
            page: number
            limit: number
            totalPages: number
        }
    }
}

export interface RoleDetailResponse {
    data: RoleResponse
}

export interface PermissionsResponse {
    data: {
        all: string[]
        grouped: Record<
            string,
            {
                name: string
                permissions: string[]
            }
        >
    }
}

class ApiRoleService {
    async getRoles(params?: {
        page?: number
        limit?: number
        search?: string
        isActive?: boolean
        sort?: string
    }): Promise<RolesListResponse> {
        let url = '/api/roles'
        if (params) {
            const query = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    query.append(key, String(value))
                }
            })
            const queryString = query.toString()
            if (queryString) {
                url += `?${queryString}`
            }
        }
        const response = await mainRepository.get(url)
        return response
    }

    async getRoleById(id: string): Promise<RoleDetailResponse> {
        const response = await mainRepository.get(`/api/roles/${id}`)
        return response
    }

    async createRole(data: CreateRoleRequest): Promise<RoleDetailResponse> {
        const response = await mainRepository.post('/api/roles', data)
        return response
    }

    async updateRole(
        id: string,
        data: UpdateRoleRequest,
    ): Promise<RoleDetailResponse> {
        const response = await mainRepository.put(`/api/roles/${id}`, data)
        return response
    }

    async deleteRole(id: string): Promise<{ message: string }> {
        const response = await mainRepository.delete(`/api/roles/${id}`)
        return response
    }

    async getPermissions(): Promise<PermissionsResponse> {
        const response = await mainRepository.get('/api/roles/permissions')
        return response
    }
}

export const apiRoleService = new ApiRoleService()
