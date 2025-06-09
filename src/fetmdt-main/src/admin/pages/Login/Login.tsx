'use client'

import type React from 'react'

import { useState, useCallback, useMemo } from 'react'
import { useAuth } from '../../../user/contexts/auth-context'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Alert, AlertDescription } from '../../../components/ui/alert'

export const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

    // Validation
    const validation = useMemo(() => {
        const errors: string[] = []

        if (formData.username && formData.username.length < 3) {
            errors.push('Tên đăng nhập phải có ít nhất 3 ký tự')
        }

        if (formData.password && formData.password.length < 6) {
            errors.push('Mật khẩu phải có ít nhất 6 ký tự')
        }

        return {
            isValid:
                formData.username.length >= 3 && formData.password.length >= 6,
            errors,
        }
    }, [formData])

    const handleInputChange = useCallback(
        (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }))
            if (error) setError('') // Clear error when user types
        },
        [error],
    )

    const handleLogin = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()

            if (!validation.isValid) {
                setError(validation.errors[0])
                return
            }

            setIsLoading(true)
            setError('')

            try {
                await login(formData.username, formData.password)
            } catch (err: any) {
                console.error('Login failed:', err)
                setError(
                    err.response?.data?.message ||
                        'Đăng nhập thất bại. Vui lòng thử lại.',
                )
            } finally {
                setIsLoading(false)
            }
        },
        [formData, validation, login],
    )

    const handleGoogleLogin = useCallback(async () => {
        // TODO: Implement Google OAuth
        console.log('Google login clicked')
    }, [])

    const handleFacebookLogin = useCallback(async () => {
        // TODO: Implement Facebook OAuth
        console.log('Facebook login clicked')
    }, [])

    const handleZaloLogin = useCallback(async () => {
        // TODO: Implement Zalo OAuth
        console.log('Zalo login clicked')
    }, [])

    return (
        <div className="flex min-h-screen">
            {/* Left Section - Background */}
            <div className="flex w-[650px] flex-col bg-[url('/image/bgloginleft.png')] bg-cover bg-bottom"></div>

            {/* Right Section - Form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12">
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
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                            Đăng nhập
                        </h2>
                        <p className="text-gray-600">
                            Bạn chưa có tài khoản?{' '}
                            <a
                                href="/signup"
                                className="font-medium text-blue-600 hover:text-blue-700"
                            >
                                Đăng ký ngay
                            </a>
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
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
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
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
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>

                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                            disabled={isLoading || !validation.isValid}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang đăng nhập...
                                </>
                            ) : (
                                'Đăng nhập'
                            )}
                        </Button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    Hoặc đăng nhập với
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <img
                                    src="https://img.icons8.com/color/20/000000/google-logo.png"
                                    alt="Google"
                                    className="mr-2"
                                />
                                Đăng nhập với Google
                            </Button>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleFacebookLogin}
                                    disabled={isLoading}
                                >
                                    <img
                                        src="https://img.icons8.com/color/20/000000/facebook-new.png"
                                        alt="Facebook"
                                        className="mr-2"
                                    />
                                    Facebook
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleZaloLogin}
                                    disabled={isLoading}
                                >
                                    <img
                                        src="https://img.icons8.com/color/20/000000/zalo.png"
                                        alt="Zalo"
                                        className="mr-2"
                                    />
                                    Zalo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
