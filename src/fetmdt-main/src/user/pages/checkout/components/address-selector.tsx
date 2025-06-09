'use client'

import { useState, useEffect, useCallback } from 'react'
import { Label } from '../../../../components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../../components/ui/select'
import { Loader2 } from 'lucide-react'
import {
    getProvinces,
    getDistrictsByProvince,
    getWardsByDistrict,
    type Province,
    type District,
    type Ward,
} from '../../../../services/apiAddress.service'

interface AddressSelectorProps {
    onAddressChange: (address: {
        province: { code: string; name: string }
        district: { code: string; name: string }
        ward: { code: string; name: string }
    }) => void
    errors?: {
        province?: string
        district?: string
        ward?: string
    }
    defaultValues?: {
        province?: string
        district?: string
        ward?: string
    }
}

export default function AddressSelector({
    onAddressChange,
    errors = {},
    defaultValues = {},
}: AddressSelectorProps) {
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])

    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('')
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>('')
    const [selectedWardCode, setSelectedWardCode] = useState<string>('')
    const handleAddressChange = useCallback(onAddressChange, [])
    const [loading, setLoading] = useState({
        provinces: false,
        districts: false,
        wards: false,
    })

    // Load provinces on mount
    useEffect(() => {
        const loadProvinces = async () => {
            setLoading((prev) => ({ ...prev, provinces: true }))
            try {
                const data = await getProvinces()
                setProvinces(data)
                console.log('Loaded provinces:', data.length)
            } catch (error) {
                console.error('Error loading provinces:', error)
            } finally {
                setLoading((prev) => ({ ...prev, provinces: false }))
            }
        }

        loadProvinces()
    }, [])

    // Load districts when province changes
    useEffect(() => {
        if (selectedProvinceCode) {
            const loadDistricts = async () => {
                setLoading((prev) => ({ ...prev, districts: true }))
                try {
                    const data =
                        await getDistrictsByProvince(selectedProvinceCode)
                    setDistricts(data)
                    setWards([]) // Reset wards
                    setSelectedDistrictCode('')
                    setSelectedWardCode('')
                    console.log('Loaded districts:', data.length)
                } catch (error) {
                    console.error('Error loading districts:', error)
                    setDistricts([])
                } finally {
                    setLoading((prev) => ({ ...prev, districts: false }))
                }
            }

            loadDistricts()
        } else {
            setDistricts([])
            setWards([])
            setSelectedDistrictCode('')
            setSelectedWardCode('')
        }
    }, [selectedProvinceCode])

    // Load wards when district changes
    useEffect(() => {
        if (selectedDistrictCode) {
            const loadWards = async () => {
                setLoading((prev) => ({ ...prev, wards: true }))
                try {
                    const data = await getWardsByDistrict(selectedDistrictCode)
                    setWards(data)
                    setSelectedWardCode('')
                    console.log('Loaded wards:', data.length)
                } catch (error) {
                    console.error('Error loading wards:', error)
                    setWards([])
                } finally {
                    setLoading((prev) => ({ ...prev, wards: false }))
                }
            }

            loadWards()
        } else {
            setWards([])
            setSelectedWardCode('')
        }
    }, [selectedDistrictCode])

    // Notify parent when all address parts are selected
    useEffect(() => {
        if (selectedProvinceCode && selectedDistrictCode && selectedWardCode) {
            const province = provinces.find(
                (p) => String(p.code) === selectedProvinceCode,
            )
            const district = districts.find(
                (d) => String(d.code) === selectedDistrictCode,
            )
            const ward = wards.find((w) => String(w.code) === selectedWardCode)

            if (province && district && ward) {
                handleAddressChange({
                    province: { code: province.code, name: province.name },
                    district: { code: district.code, name: district.name },
                    ward: { code: ward.code, name: ward.name },
                })
            }
        }
    }, [
        selectedProvinceCode,
        selectedDistrictCode,
        selectedWardCode,
        provinces,
        districts,
        wards,
        handleAddressChange, // dùng hàm đã memoized
    ])

    const handleProvinceChange = (value: string) => {
        console.log('Province selected:', value)
        setSelectedProvinceCode(value)
    }

    const handleDistrictChange = (value: string) => {
        console.log('District selected:', value)
        setSelectedDistrictCode(value)
    }

    const handleWardChange = (value: string) => {
        console.log('Ward selected:', value)
        setSelectedWardCode(value)
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Province */}
            <div className="space-y-2">
                <Label htmlFor="province">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={selectedProvinceCode}
                    onValueChange={handleProvinceChange}
                    disabled={loading.provinces}
                >
                    <SelectTrigger
                        className={errors.province ? 'border-red-500' : ''}
                    >
                        <SelectValue
                            placeholder={
                                loading.provinces ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Đang tải...
                                    </div>
                                ) : (
                                    'Chọn tỉnh/thành phố'
                                )
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map((province) => (
                            <SelectItem
                                key={province.code}
                                value={String(province.code)}
                            >
                                {province.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.province && (
                    <p className="text-sm text-red-500">{errors.province}</p>
                )}
            </div>

            {/* District */}
            <div className="space-y-2">
                <Label htmlFor="district">
                    Quận/Huyện <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={selectedDistrictCode}
                    onValueChange={handleDistrictChange}
                    disabled={!selectedProvinceCode || loading.districts}
                >
                    <SelectTrigger
                        className={errors.district ? 'border-red-500' : ''}
                    >
                        <SelectValue
                            placeholder={
                                loading.districts ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Đang tải...
                                    </div>
                                ) : !selectedProvinceCode ? (
                                    'Chọn tỉnh/thành phố trước'
                                ) : (
                                    'Chọn quận/huyện'
                                )
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map((district) => (
                            <SelectItem
                                key={district.code}
                                value={String(district.code)}
                            >
                                {district.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.district && (
                    <p className="text-sm text-red-500">{errors.district}</p>
                )}
            </div>

            {/* Ward */}
            <div className="space-y-2">
                <Label htmlFor="ward">
                    Phường/Xã <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={selectedWardCode}
                    onValueChange={handleWardChange}
                    disabled={!selectedDistrictCode || loading.wards}
                >
                    <SelectTrigger
                        className={errors.ward ? 'border-red-500' : ''}
                    >
                        <SelectValue
                            placeholder={
                                loading.wards ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Đang tải...
                                    </div>
                                ) : !selectedDistrictCode ? (
                                    'Chọn quận/huyện trước'
                                ) : (
                                    'Chọn phường/xã'
                                )
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {wards.map((ward) => (
                            <SelectItem
                                key={ward.code}
                                value={String(ward.code)}
                            >
                                {ward.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.ward && (
                    <p className="text-sm text-red-500">{errors.ward}</p>
                )}
            </div>
        </div>
    )
}
