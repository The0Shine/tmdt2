'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { User, MapPin, CreditCard } from 'lucide-react'
import PaymentMethods from './payment-methods'
import AddressSelector from './components/address-selector'
import { useAuth } from '../../contexts/auth-context'

interface CheckoutFormProps {
    onSubmit: (data: any) => void
    loading: boolean
    total: number
}

interface FormData {
    name: string
    email: string
    phone: string
    address: string
    note: string
    paymentMethod: string
}

interface AddressData {
    province: { code: string; name: string }
    district: { code: string; name: string }
    ward: { code: string; name: string }
}

export default function CheckoutForm({
    onSubmit,
    loading,
    total,
}: CheckoutFormProps) {
    const { user } = useAuth()
    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [addressData, setAddressData] = useState<AddressData | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
    } = useForm<FormData>({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: '',
            note: '',
            paymentMethod: 'cod',
        },
    })

    const handleFormSubmit = (data: FormData) => {
        // Validate address selection
        console.log('Address data:', addressData)

        if (!addressData) {
            setError('address', {
                type: 'required',
                message: 'Vui lòng chọn đầy đủ địa chỉ',
            })
            return
        }

        const fullAddress = `${data.address}, ${addressData.ward.name}, ${addressData.district.name}, ${addressData.province.name}`

        onSubmit({
            ...data,
            paymentMethod,
            fullAddress,
            shippingAddress: {
                address: data.address,
                ward: addressData.ward.name,
                district: addressData.district.name,
                city: addressData.province.name,
                wardCode: addressData.ward.code,
                districtCode: addressData.district.code,
                provinceCode: addressData.province.code,
            },
        })
    }

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method)
        setValue('paymentMethod', method)
    }

    const handleAddressChange = (address: AddressData) => {
        console.log('Selected address:', address)

        setAddressData(address)
        clearErrors('address')
    }

    return (
        <div className="space-y-6">
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
            >
                {/* Thông tin khách hàng */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                                <User className="h-4 w-4 text-teal-600" />
                            </div>
                            Thông tin khách hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Họ và tên{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    {...register('name', {
                                        required: 'Vui lòng nhập họ và tên',
                                        minLength: {
                                            value: 2,
                                            message:
                                                'Họ tên phải có ít nhất 2 ký tự',
                                        },
                                    })}
                                    placeholder="Nhập họ và tên đầy đủ"
                                    className={`transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-teal-500'}`}
                                />
                                {errors.name && (
                                    <p className="flex items-center gap-1 text-sm text-red-500">
                                        <span className="text-xs">⚠</span>
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-sm font-medium"
                                >
                                    Số điện thoại{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    {...register('phone', {
                                        required: 'Vui lòng nhập số điện thoại',
                                        pattern: {
                                            value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                                            message:
                                                'Số điện thoại không hợp lệ (VD: 0901234567)',
                                        },
                                    })}
                                    placeholder="Nhập số điện thoại"
                                    className={`transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-teal-500'}`}
                                />
                                {errors.phone && (
                                    <p className="flex items-center gap-1 text-sm text-red-500">
                                        <span className="text-xs">⚠</span>
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email', {
                                    required: 'Vui lòng nhập email',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Email không hợp lệ',
                                    },
                                })}
                                placeholder="Nhập địa chỉ email"
                                className={`transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-teal-500'}`}
                            />
                            {errors.email && (
                                <p className="flex items-center gap-1 text-sm text-red-500">
                                    <span className="text-xs">⚠</span>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Địa chỉ giao hàng */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                            Địa chỉ giao hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Address Selector */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Chọn địa chỉ{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <AddressSelector
                                onAddressChange={handleAddressChange}
                                errors={{
                                    province: errors.address?.message,
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="address"
                                className="text-sm font-medium"
                            >
                                Địa chỉ cụ thể{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="address"
                                {...register('address', {
                                    required: 'Vui lòng nhập địa chỉ cụ thể',
                                    minLength: {
                                        value: 10,
                                        message:
                                            'Địa chỉ phải có ít nhất 10 ký tự',
                                    },
                                })}
                                placeholder="Số nhà, tên đường, khu vực..."
                                className={`transition-colors ${errors.address ? 'border-red-500 focus:border-red-500' : 'focus:border-teal-500'}`}
                            />
                            {errors.address && (
                                <p className="flex items-center gap-1 text-sm text-red-500">
                                    <span className="text-xs">⚠</span>
                                    {errors.address.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="note"
                                className="text-sm font-medium"
                            >
                                Ghi chú giao hàng (tùy chọn)
                            </Label>
                            <Textarea
                                id="note"
                                {...register('note')}
                                placeholder="Ghi chú thêm cho người giao hàng (thời gian giao, vị trí cụ thể...)"
                                rows={3}
                                className="resize-none focus:border-teal-500"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Phương thức thanh toán */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                <CreditCard className="h-4 w-4 text-green-600" />
                            </div>
                            Phương thức thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PaymentMethods
                            selectedMethod={paymentMethod}
                            onMethodChange={handlePaymentMethodChange}
                            onSubmit={handleSubmit(handleFormSubmit)}
                            loading={loading}
                            total={total}
                        />
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
