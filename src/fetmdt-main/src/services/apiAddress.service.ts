// Service để lấy dữ liệu địa chỉ Việt Nam
export interface Province {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
}

export interface District {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
    province_code: string
}

export interface Ward {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
    district_code: string
}

// API Vietnam Administrative Units
const API_BASE_URL = 'https://provinces.open-api.vn/api'

export const getProvinces = async (): Promise<Province[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/p/`)
        if (!response.ok) {
            throw new Error('Failed to fetch provinces')
        }
        return await response.json()
    } catch (error) {
        console.error('Error fetching provinces:', error)
        throw error
    }
}

export const getDistrictsByProvince = async (
    provinceCode: string,
): Promise<District[]> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/p/${provinceCode}?depth=2`,
        )
        if (!response.ok) {
            throw new Error('Failed to fetch districts')
        }
        const data = await response.json()
        return data.districts || []
    } catch (error) {
        console.error('Error fetching districts:', error)
        throw error
    }
}

export const getWardsByDistrict = async (
    districtCode: string,
): Promise<Ward[]> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/d/${districtCode}?depth=2`,
        )
        if (!response.ok) {
            throw new Error('Failed to fetch wards')
        }
        const data = await response.json()
        return data.wards || []
    } catch (error) {
        console.error('Error fetching wards:', error)
        throw error
    }
}
