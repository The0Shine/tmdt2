'use client'

import type React from 'react'

import { useState, useCallback, useMemo } from 'react'
import { registerApi } from '../../../services/apiAuth.service'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Alert, AlertDescription } from '../../../components/ui/alert'

export const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Validation
    const validation = useMemo(() => {
        const errors: string[] = []

        if (formData.firstName && formData.firstName.length < 2) {
            errors.push('Tên phải có ít nhất 2 ký tự')
        }

        if (formData.lastName && formData.lastName.length < 2) {
            errors.push('Họ phải có ít nhất 2 ký tự')
        }

        if (formData.username && formData.username.length < 3) {
            errors.push('Tên đăng nhập phải có ít nhất 3 ký tự')
        }

        if (formData.password && formData.password.length < 6) {
            errors.push('Mật khẩu phải có ít nhất 6 ký tự')
        }

        if (formData.password && !/\d/.test(formData.password)) {
            errors.push('Mật khẩu phải chứa ít nhất một chữ số')
        }

        if (formData.password && !/[A-Za-z]/.test(formData.password)) {
            errors.push('Mật khẩu phải chứa ít nhất một chữ cái')
        }

        if (
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword
        ) {
            errors.push('Mật khẩu xác nhận không khớp')
        }

        const isValid =
            formData.firstName.length >= 2 &&
            formData.lastName.length >= 2 &&
            formData.username.length >= 3 &&
            formData.password.length >= 6 &&
            /\d/.test(formData.password) &&
            /[A-Za-z]/.test(formData.password) &&
            formData.password === formData.confirmPassword

        return { isValid, errors }
    }, [formData])

    const handleInputChange = useCallback(
        (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }))
            if (error) setError('')
            if (success) setSuccess('')
        },
        [error, success],
    )

    const handleRegister = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()

            if (!validation.isValid) {
                setError(validation.errors[0])
                return
            }

            setIsLoading(true)
            setError('')
            setSuccess('')

            try {
                await registerApi({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    password: formData.password,
                })
                setSuccess(
                    'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.',
                )
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                })
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ||
                        'Đăng ký thất bại. Vui lòng thử lại.',
                )
            } finally {
                setIsLoading(false)
            }
        },
        [formData, validation],
    )

    const getPasswordStrength = useCallback((password: string) => {
        let strength = -1
        if (password.length >= 6) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[a-z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++

        return {
            score: strength,
            label:
                ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'][
                    strength
                ] || 'Rất yếu',
            color:
                [
                    'bg-red-500',
                    'bg-orange-500',
                    'bg-yellow-500',
                    'bg-blue-500',
                    'bg-green-500',
                ][strength] || 'bg-red-500',
        }
    }, [])

    const passwordStrength = useMemo(
        () => getPasswordStrength(formData.password),
        [formData.password, getPasswordStrength],
    )

    return (
        <div className="flex min-h-screen">
            {/* Left Section - Form */}
            <div className="flex flex-3 flex-col justify-center px-6 py-12 lg:px-12">
                <div className="mx-auto w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex items-center justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-teal-500">
                                <span className="text-xl font-bold text-white">
                                    S
                                </span>
                            </div>
                            <span className="ml-3 text-2xl font-bold text-gray-900">
                                SHOP
                            </span>
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            BẮT ĐẦU MIỄN PHÍ
                        </div>
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                            Tạo tài khoản
                        </h2>
                        <p className="text-gray-600">
                            Đã có tài khoản?{' '}
                            <a
                                href="/login"
                                className="font-medium text-blue-600 hover:text-blue-700"
                            >
                                Đăng nhập ngay
                            </a>
                        </p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="mb-6 border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700">
                                {success}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label
                                    htmlFor="firstName"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Tên
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleInputChange('firstName')}
                                    placeholder="Nhập tên"
                                    className="mt-1"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="lastName"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Họ
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleInputChange('lastName')}
                                    placeholder="Nhập họ"
                                    className="mt-1"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor="username"
                                className="text-sm font-medium text-gray-700"
                            >
                                Tên đăng nhập
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange('username')}
                                placeholder="Nhập tên đăng nhập"
                                className="mt-1"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                            >
                                Mật khẩu
                            </Label>
                            <div className="relative mt-1">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    placeholder="Nhập mật khẩu"
                                    className="pr-10"
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                                        <span>Độ mạnh mật khẩu</span>
                                        <span
                                            className={`font-medium ${passwordStrength.score >= 3 ? 'text-green-600' : 'text-orange-600'}`}
                                        >
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                            style={{
                                                width: `${(passwordStrength.score / 4) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-gray-700"
                            >
                                Xác nhận mật khẩu
                            </Label>
                            <div className="relative mt-1">
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange(
                                        'confirmPassword',
                                    )}
                                    placeholder="Nhập lại mật khẩu"
                                    className="pr-10"
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                            disabled={isLoading || !validation.isValid}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                'Tạo tài khoản'
                            )}
                        </Button>
                    </form>

                    {/* Social Registration */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    Hoặc đăng ký với
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                type="button"
                                className="rounded-lg border border-gray-300 p-2 transition-colors hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                <img
                                    src="https://img.icons8.com/color/24/000000/facebook-new.png"
                                    alt="Facebook"
                                />
                            </button>
                            <button
                                type="button"
                                className="rounded-lg border border-gray-300 p-2 transition-colors hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                <img
                                    src="https://img.icons8.com/color/24/000000/zalo.png"
                                    alt="Zalo"
                                />
                            </button>
                            <button
                                type="button"
                                className="rounded-lg border border-gray-300 p-2 transition-colors hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                <img
                                    src="https://img.icons8.com/color/24/000000/google-logo.png"
                                    alt="Google"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Background */}
            <div className="flex flex-2 bg-[url('/image/bgsignupright.png')] bg-cover bg-bottom"></div>
        </div>
    )
}
