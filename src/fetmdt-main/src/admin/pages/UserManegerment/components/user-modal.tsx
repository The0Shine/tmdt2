'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, User, Mail, Phone, MapPin, Shield, Lock } from 'lucide-react'
import { RoleResponse } from '@/services/apiRole.service'
import {
    UserResponse,
    CreateUserRequest,
    UpdateUserRequest,
} from '@/services/apiUser.service'

interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    editingUser: UserResponse | null
    roles: RoleResponse[]
    onSave: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>
}

export function UserModal({
    isOpen,
    onClose,
    editingUser,
    roles,
    onSave,
}: UserModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<
        Partial<CreateUserRequest & UpdateUserRequest>
    >({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
        avatar: '',
        isActive: true,
    })

    useEffect(() => {
        if (editingUser) {
            setFormData({
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                email: editingUser.email,
                phone: editingUser.phone || '',
                address: editingUser.address || '',
                role: editingUser.role?._id || '',
                avatar: editingUser.avatar || '',
                isActive: editingUser.isActive,
            })
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                role: roles[0]?._id || '',
                avatar: '',
                isActive: true,
            })
        }
    }, [editingUser, roles, isOpen])

    const handleChange = (name: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await onSave(formData as CreateUserRequest | UpdateUserRequest)
            onClose()
        } catch (error) {
            console.error('Error saving user:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-teal-500" />
                        {editingUser
                            ? 'Chỉnh sửa người dùng'
                            : 'Thêm người dùng mới'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* First Name */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">
                                Họ <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName || ''}
                                    onChange={(e) =>
                                        handleChange(
                                            'firstName',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Nhập họ"
                                    className="pl-10"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName">
                                Tên <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName || ''}
                                    onChange={(e) =>
                                        handleChange('lastName', e.target.value)
                                    }
                                    placeholder="Nhập tên"
                                    className="pl-10"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) =>
                                        handleChange('email', e.target.value)
                                    }
                                    placeholder="Nhập email"
                                    className="pl-10"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password - Only for new users */}
                        {!editingUser && (
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Mật khẩu{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password || ''}
                                        onChange={(e) =>
                                            handleChange(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                        className="pl-10"
                                        required
                                        minLength={6}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <div className="relative">
                                <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    id="phone"
                                    type="text"
                                    value={formData.phone || ''}
                                    onChange={(e) =>
                                        handleChange('phone', e.target.value)
                                    }
                                    placeholder="Nhập số điện thoại"
                                    className="pl-10"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label htmlFor="role">
                                Vai trò <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Shield className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Select
                                    value={formData.role || ''}
                                    onValueChange={(value) =>
                                        handleChange('role', value)
                                    }
                                    disabled={loading}
                                >
                                    <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role._id}
                                                value={role._id}
                                            >
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <div className="relative">
                            <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                            <Textarea
                                id="address"
                                value={formData.address || ''}
                                onChange={(e) =>
                                    handleChange('address', e.target.value)
                                }
                                placeholder="Nhập địa chỉ"
                                className="min-h-[80px] pl-10"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Active Status - Only for editing */}
                    {editingUser && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive || false}
                                onCheckedChange={(checked) =>
                                    handleChange('isActive', checked)
                                }
                                disabled={loading}
                            />
                            <Label htmlFor="isActive">
                                Tài khoản hoạt động
                            </Label>
                        </div>
                    )}

                    {/* Password Info for new users */}
                    {!editingUser && (
                        <div className="rounded-md bg-yellow-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Lock className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Thông tin mật khẩu
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Người dùng sẽ nhận được email với
                                            thông tin đăng nhập. Họ sẽ được yêu
                                            cầu đổi mật khẩu khi đăng nhập lần
                                            đầu.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-teal-500 hover:bg-teal-600"
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {editingUser ? 'Cập nhật' : 'Thêm người dùng'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
