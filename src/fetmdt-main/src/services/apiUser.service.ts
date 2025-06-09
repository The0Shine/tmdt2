import { mainRepository } from '../utils/Repository'

export interface UserResponse {
    _id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
    phone?: string
    address?: string
    role?: {
        _id: string
        name: string
    }
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface CreateUserRequest {
    firstName: string
    lastName: string
    email: string
    password: string
    avatar?: string
    phone?: string
    address?: string
    role?: string
    isActive?: boolean
}

export interface UpdateUserRequest {
    firstName?: string
    lastName?: string
    email?: string
    avatar?: string
    phone?: string
    address?: string
    role?: string
    isActive?: boolean
}

export interface UsersListResponse {
    data: UserResponse[]
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

export interface UserDetailResponse {
    data: UserResponse
}

class ApiUserService {
    async getUsers(params?: {
        page?: number
        limit?: number
        search?: string
        role?: string
        isActive?: boolean
        sort?: string
    }): Promise<UsersListResponse> {
        let url = '/api/users'
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

    async getUserById(id: string): Promise<UserDetailResponse> {
        const response = await mainRepository.get(`/api/users/${id}`)
        return response
    }

    async createUser(data: CreateUserRequest): Promise<UserDetailResponse> {
        const response = await mainRepository.post('/api/users', data)
        return response
    }

    async updateUser(
        id: string,
        data: UpdateUserRequest,
    ): Promise<UserDetailResponse> {
        const response = await mainRepository.put(`/api/users/${id}`, data)
        return response
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        const response = await mainRepository.delete(`/api/users/${id}`)
        return response
    }

    async resetPassword(id: string): Promise<{ message: string }> {
        const response = await mainRepository.post(
            `/api/users/${id}/reset-password`,
        )
        return response
    }
}

export const apiUserService = new ApiUserService()
