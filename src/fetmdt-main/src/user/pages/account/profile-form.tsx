'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    Camera,
    Save,
    Mail,
    Phone,
    MapPin,
    Building,
    Home,
    User,
    Loader2,
} from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import type { User as UserType } from '../../../types/user'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select'
import { mainRepository } from '../../../utils/Repository'

// Interfaces cho dữ liệu địa chỉ
interface Province {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
}

interface District {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
    province_code: string
}

interface Ward {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
    district_code: string
}

const ProfileForm: React.FC = () => {
    const { user, updateProfile } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const [formData, setFormData] = useState<Partial<UserType>>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        avatar: '',
    })

    // Address data states
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const [selectedProvinceCode, setSelectedProvinceCode] = useState('')
    const [selectedDistrictCode, setSelectedDistrictCode] = useState('')

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                district: user.district || '',
                ward: user.ward || '',
                avatar: user.avatar || '',
            })
        }
    }, [user])

    // Fetch provinces on component mount
    useEffect(() => {
        fetchProvinces()
    }, [])

    const fetchProvinces = async () => {
        try {
            setIsLoadingAddress(true)
            const response = await fetch('https://provinces.open-api.vn/api/p/')
            const data = await response.json()
            setProvinces(data)
        } catch (error) {
            console.error('Error fetching provinces:', error)
            setMessage({
                type: 'error',
                text: 'Không thể tải danh sách tỉnh thành',
            })
        } finally {
            setIsLoadingAddress(false)
        }
    }

    const fetchDistricts = async (provinceCode: string) => {
        try {
            setIsLoadingAddress(true)
            const response = await fetch(
                `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`,
            )
            const data = await response.json()
            setDistricts(data.districts || [])
            setWards([])
        } catch (error) {
            console.error('Error fetching districts:', error)
            setMessage({
                type: 'error',
                text: 'Không thể tải danh sách quận/huyện',
            })
        } finally {
            setIsLoadingAddress(false)
        }
    }

    const fetchWards = async (districtCode: string) => {
        try {
            setIsLoadingAddress(true)
            const response = await fetch(
                `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`,
            )
            const data = await response.json()
            setWards(data.wards || [])
        } catch (error) {
            console.error('Error fetching wards:', error)
            setMessage({
                type: 'error',
                text: 'Không thể tải danh sách phường/xã',
            })
        } finally {
            setIsLoadingAddress(false)
        }
    }

    const handleProvinceChange = (provinceCode: string) => {
        const selectedProvince = provinces.find((p) => p.code === provinceCode)
        if (selectedProvince) {
            setSelectedProvinceCode(provinceCode)
            setFormData((prev) => ({
                ...prev,
                city: selectedProvince.name,
                district: '',
                ward: '',
            }))
            setSelectedDistrictCode('')
            fetchDistricts(provinceCode)
        }
    }

    const handleDistrictChange = (districtCode: string) => {
        const selectedDistrict = districts.find((d) => d.code === districtCode)
        if (selectedDistrict) {
            setSelectedDistrictCode(districtCode)
            setFormData((prev) => ({
                ...prev,
                district: selectedDistrict.name,
                ward: '',
            }))
            fetchWards(districtCode)
        }
    }

    const handleWardChange = (wardCode: string) => {
        const selectedWard = wards.find((w) => w.code === wardCode)
        if (selectedWard) {
            setFormData((prev) => ({
                ...prev,
                ward: selectedWard.name,
            }))
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Kiểm tra kích thước file (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({
                    type: 'error',
                    text: 'Kích thước ảnh không được vượt quá 5MB',
                })
                return
            }

            // Kiểm tra định dạng file
            if (!file.type.startsWith('image/')) {
                setMessage({
                    type: 'error',
                    text: 'Vui lòng chọn file ảnh hợp lệ',
                })
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setFormData((prev) => ({ ...prev, avatar: result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const validateForm = () => {
        if (!formData.name?.trim()) {
            setMessage({ type: 'error', text: 'Vui lòng nhập họ tên' })
            return false
        }

        if (!formData.email?.trim()) {
            setMessage({ type: 'error', text: 'Vui lòng nhập email' })
            return false
        }

        if (
            formData.phone &&
            !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))
        ) {
            setMessage({ type: 'error', text: 'Số điện thoại không hợp lệ' })
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        setMessage(null)

        try {
            // Lọc bỏ các field trống để tránh ghi đè với giá trị rỗng
            const filteredData = Object.fromEntries(
                Object.entries(formData).filter(
                    ([_, value]) =>
                        value !== '' && value !== null && value !== undefined,
                ),
            )

            // Call API updateDetails
            const response = await mainRepository.put(
                '/api/auth/updatedetails',
                filteredData,
            )

            if (response && response.data) {
                setMessage({
                    type: 'success',
                    text: 'Thông tin cá nhân đã được cập nhật thành công!',
                })
            } else {
                setMessage({
                    type: 'error',
                    text: 'Có lỗi xảy ra khi cập nhật thông tin.',
                })
            }
        } catch (error) {
            console.error('Update profile error:', error)
            setMessage({
                type: 'error',
                text: 'Có lỗi xảy ra khi cập nhật thông tin.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Cập nhật hồ sơ cá nhân
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message && (
                            <Alert
                                className={
                                    message.type === 'success'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-red-500 bg-red-50'
                                }
                            >
                                <AlertDescription
                                    className={
                                        message.type === 'success'
                                            ? 'text-green-700'
                                            : 'text-red-700'
                                    }
                                >
                                    {message.text}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg">
                                    <img
                                        src={
                                            formData.avatar ||
                                            '/placeholder.svg?height=128&width=128'
                                        }
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
                                >
                                    <Camera className="h-4 w-4" />
                                </label>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                Nhấp vào biểu tượng camera để thay đổi ảnh đại
                                diện
                            </p>
                        </div>

                        {/* Personal Information */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Họ và tên *
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange('name', e.target.value)
                                    }
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center gap-2"
                                >
                                    <Mail className="h-4 w-4" />
                                    Email *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleChange('email', e.target.value)
                                    }
                                    placeholder="Nhập địa chỉ email"
                                    disabled
                                    className="bg-gray-100"
                                />
                                <p className="text-xs text-gray-500">
                                    Email không thể thay đổi
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="flex items-center gap-2"
                                >
                                    <Phone className="h-4 w-4" />
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleChange('phone', e.target.value)
                                    }
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="address"
                                    className="flex items-center gap-2"
                                >
                                    <Home className="h-4 w-4" />
                                    Địa chỉ cụ thể
                                </Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleChange('address', e.target.value)
                                    }
                                    placeholder="Số nhà, tên đường..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="city"
                                    className="flex items-center gap-2"
                                >
                                    <Building className="h-4 w-4" />
                                    Tỉnh/Thành phố
                                </Label>
                                <Select
                                    onValueChange={handleProvinceChange}
                                    disabled={isLoadingAddress}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                isLoadingAddress
                                                    ? 'Đang tải...'
                                                    : 'Chọn tỉnh/thành phố'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((province) => (
                                            <SelectItem
                                                key={province.code}
                                                value={province.code}
                                            >
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="district"
                                    className="flex items-center gap-2"
                                >
                                    <MapPin className="h-4 w-4" />
                                    Quận/Huyện
                                </Label>
                                <Select
                                    onValueChange={handleDistrictChange}
                                    disabled={
                                        !selectedProvinceCode ||
                                        isLoadingAddress
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                isLoadingAddress
                                                    ? 'Đang tải...'
                                                    : 'Chọn quận/huyện'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((district) => (
                                            <SelectItem
                                                key={district.code}
                                                value={district.code}
                                            >
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label
                                    htmlFor="ward"
                                    className="flex items-center gap-2"
                                >
                                    <MapPin className="h-4 w-4" />
                                    Phường/Xã
                                </Label>
                                <Select
                                    onValueChange={handleWardChange}
                                    disabled={
                                        !selectedDistrictCode ||
                                        isLoadingAddress
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                isLoadingAddress
                                                    ? 'Đang tải...'
                                                    : 'Chọn phường/xã'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wards.map((ward) => (
                                            <SelectItem
                                                key={ward.code}
                                                value={ward.code}
                                            >
                                                {ward.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {isLoading
                                    ? 'Đang cập nhật...'
                                    : 'Cập nhật thông tin'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProfileForm
