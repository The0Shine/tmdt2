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

// Dữ liệu địa chỉ Việt Nam (mẫu)
const vietnamProvinces = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' },
]

const districts = {
    hanoi: [
        { value: 'cau-giay', label: 'Cầu Giấy' },
        { value: 'hai-ba-trung', label: 'Hai Bà Trưng' },
        { value: 'hoan-kiem', label: 'Hoàn Kiếm' },
        { value: 'dong-da', label: 'Đống Đa' },
        { value: 'ba-dinh', label: 'Ba Đình' },
    ],
    hcm: [
        { value: 'quan-1', label: 'Quận 1' },
        { value: 'quan-3', label: 'Quận 3' },
        { value: 'quan-7', label: 'Quận 7' },
        { value: 'binh-thanh', label: 'Bình Thạnh' },
        { value: 'thu-duc', label: 'Thủ Đức' },
    ],
    danang: [
        { value: 'hai-chau', label: 'Hải Châu' },
        { value: 'thanh-khe', label: 'Thanh Khê' },
        { value: 'son-tra', label: 'Sơn Trà' },
        { value: 'ngu-hanh-son', label: 'Ngũ Hành Sơn' },
    ],
}

const wards = {
    'cau-giay': [
        { value: 'dich-vong', label: 'Dịch Vọng' },
        { value: 'dich-vong-hau', label: 'Dịch Vọng Hậu' },
        { value: 'quan-hoa', label: 'Quan Hoa' },
        { value: 'nghia-do', label: 'Nghĩa Đô' },
    ],
    'hai-ba-trung': [
        { value: 'bach-khoa', label: 'Bách Khoa' },
        { value: 'dong-tam', label: 'Đồng Tâm' },
        { value: 'pho-hue', label: 'Phố Huế' },
    ],
}

const ProfileForm: React.FC = () => {
    const { user, updateProfile } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
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

    const [selectedCity, setSelectedCity] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [availableDistricts, setAvailableDistricts] = useState<any[]>([])
    const [availableWards, setAvailableWards] = useState<any[]>([])

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
            setSelectedCity(user.city || '')
            setSelectedDistrict(user.district || '')
        }
    }, [user])

    useEffect(() => {
        if (selectedCity && districts[selectedCity as keyof typeof districts]) {
            setAvailableDistricts(
                districts[selectedCity as keyof typeof districts],
            )
            setSelectedDistrict('')
            setAvailableWards([])
        } else {
            setAvailableDistricts([])
            setAvailableWards([])
        }
    }, [selectedCity])

    useEffect(() => {
        if (selectedDistrict && wards[selectedDistrict as keyof typeof wards]) {
            setAvailableWards(wards[selectedDistrict as keyof typeof wards])
        } else {
            setAvailableWards([])
        }
    }, [selectedDistrict])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))

        if (field === 'city') {
            setSelectedCity(value)
            setFormData((prev) => ({ ...prev, district: '', ward: '' }))
        }

        if (field === 'district') {
            setSelectedDistrict(value)
            setFormData((prev) => ({ ...prev, ward: '' }))
        }
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

            const success = await updateProfile(filteredData)
            if (success) {
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
                                    value={formData.city}
                                    onValueChange={(value) =>
                                        handleChange('city', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vietnamProvinces.map((province) => (
                                            <SelectItem
                                                key={province.value}
                                                value={province.value}
                                            >
                                                {province.label}
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
                                    value={formData.district}
                                    onValueChange={(value) =>
                                        handleChange('district', value)
                                    }
                                    disabled={!selectedCity}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn quận/huyện" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableDistricts.map((district) => (
                                            <SelectItem
                                                key={district.value}
                                                value={district.value}
                                            >
                                                {district.label}
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
                                    value={formData.ward}
                                    onValueChange={(value) =>
                                        handleChange('ward', value)
                                    }
                                    disabled={!selectedDistrict}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phường/xã" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableWards.map((ward) => (
                                            <SelectItem
                                                key={ward.value}
                                                value={ward.value}
                                            >
                                                {ward.label}
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
                                <Save className="h-4 w-4" />
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
