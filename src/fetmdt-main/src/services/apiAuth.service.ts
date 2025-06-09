import { mainRepository } from '../utils/Repository'

export const registerApi = async (data: {
    firstName: string
    lastName: string
    username: string
    password: string
}) => {
    const response = await mainRepository.post('/api/auth/register', data)
    return response.data
}
export const loginApi = async (data: {
    username: string
    password: string
}) => {
    return mainRepository.post('/api/auth/login', data)
}

export const getMe = async () => {
    const res = await mainRepository.get('/api/auth/me')
    return res.data // nếu backend trả { data: user }
}
