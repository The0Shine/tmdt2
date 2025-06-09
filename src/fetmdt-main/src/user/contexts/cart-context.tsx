'use client'

import type React from 'react'
import {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
    useCallback,
} from 'react'
import type { Product } from '../../types/product'
import { useNavigate } from 'react-router-dom'
import { mainRepository } from '../../utils/Repository'
import { useAuth } from './auth-context'

export interface CartItem extends Product {
    stock: number
    productId: any
    quantity: number
    _id: string // ID của CartItem từ server
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Product, quantity?: number) => Promise<void>
    removeItem: (productId: string) => Promise<void>
    updateQuantity: (productId: string, quantity: number) => Promise<void>
    clearCart: () => Promise<void>
    totalItems: number
    totalPrice: number
    loading: boolean
    error: string | null
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [items, setItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Memoize tính toán để tránh re-render không cần thiết
    const cartStats = useMemo(() => {
        const totalItems = items.reduce(
            (total, item) => total + item.quantity,
            0,
        )
        const totalPrice = items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        )
        return { totalItems, totalPrice }
    }, [items])

    // Chuyển hướng đến trang đăng nhập

    // Lấy giỏ hàng từ API khi đã đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            setItems([])
            return
        }

        const fetchCart = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await mainRepository.get<{
                    data: {
                        items: Array<{
                            _id: string
                            product: Product
                            quantity: number
                        }>
                        totalPrice: number
                    }
                }>('api/cart')

                if (response) {
                    console.log(response.data)

                    // Chuyển đổi dữ liệu từ API sang định dạng CartItem
                    const cartItems = response.data.items.map((item) => ({
                        ...item.product,
                        quantity: item.quantity, // Cart quantity
                        stock: item.product.quantity, // Preserve original product stock
                        productId: item.product._id,
                        _id: item._id,
                    }))
                    setItems(cartItems)
                    console.log('Giỏ hàng đã được tải:', cartItems)
                }
            } catch (error) {
                console.error('Lỗi khi lấy giỏ hàng:', error)
                setError('Không thể tải giỏ hàng')
            } finally {
                setLoading(false)
            }
        }

        fetchCart()
    }, [isAuthenticated, user])

    // Thêm sản phẩm vào giỏ hàng
    const addItem = useCallback(
        async (product: Product, quantity = 1) => {
            // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập

            setError(null)
            setLoading(true)

            try {
                const response = await mainRepository.post<{
                    data: {
                        items: Array<{
                            _id: string
                            product: Product
                            quantity: number
                        }>
                    }
                }>('api/cart', {
                    productId: product._id,
                    quantity,
                })

                if (response) {
                    const cartItems = response.data.items.map((item) => ({
                        ...item.product,
                        quantity: item.quantity, // Cart quantity
                        stock: item.product.quantity, // Preserve original product stock
                        productId: item.product._id,
                        _id: item._id,
                    }))
                    console.log(
                        'Sản phẩm đã được thêm vào giỏ hàng:',
                        cartItems,
                    )

                    setItems(cartItems)
                }
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error)
                setError('Không thể thêm sản phẩm vào giỏ hàng')
            } finally {
                setLoading(false)
            }
        },
        [isAuthenticated],
    )

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = useCallback(
        async (productId: string) => {
            setError(null)

            // Tìm cartItemId từ productId
            const cartItem = items.find((item) => item._id === productId)
            if (!cartItem || !cartItem._id) return

            setLoading(true)
            try {
                const response = await mainRepository.delete<{
                    data: {
                        items: Array<{
                            _id: string
                            product: Product
                            quantity: number
                        }>
                    }
                }>(`api/cart/${cartItem._id}`)

                if (response) {
                    const cartItems = response.data.items.map((item) => ({
                        ...item.product,
                        quantity: item.quantity, // Cart quantity
                        stock: item.product.quantity, // Preserve original product stock
                        productId: item.product._id,
                        _id: item._id,
                    }))
                    setItems(cartItems)
                }
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error)
                setError('Không thể xóa sản phẩm khỏi giỏ hàng')
            } finally {
                setLoading(false)
            }
        },
        [isAuthenticated, items],
    )

    // Cập nhật số lượng sản phẩm
    const updateQuantity = useCallback(
        async (productId: string, quantity: number) => {
            setError(null)

            if (quantity <= 0) {
                return removeItem(productId)
            }

            // Tìm cartItemId từ productId
            const cartItem = items.find((item) => item._id === productId)
            if (!cartItem || !cartItem._id) return

            // Optimistically update the UI first
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === productId ? { ...item, quantity } : item,
                ),
            )

            try {
                const response = await mainRepository.put<{
                    data: {
                        items: Array<{
                            _id: string
                            product: Product
                            quantity: number
                        }>
                    }
                }>(`api/cart/${cartItem._id}`, {
                    quantity,
                })

                if (response) {
                    const cartItems = response.data.items.map((item) => ({
                        ...item.product,
                        quantity: item.quantity, // Cart quantity
                        stock: item.product.quantity, // Preserve original product stock
                        productId: item.product._id,
                        _id: item._id,
                    }))
                    setItems(cartItems)
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật số lượng sản phẩm:', error)
                setError('Không thể cập nhật số lượng sản phẩm')

                // Revert to original quantity on error
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item._id === productId
                            ? { ...item, quantity: cartItem.quantity }
                            : item,
                    ),
                )
            }
        },
        [isAuthenticated, items, removeItem],
    )

    // Xóa toàn bộ giỏ hàng
    const clearCart = useCallback(async () => {
        setError(null)
        setLoading(true)

        try {
            await mainRepository.delete('api/cart')
            setItems([])
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error)
            setError('Không thể xóa giỏ hàng')
        } finally {
            setLoading(false)
        }
    }, [isAuthenticated])

    // Memoize context value để tránh re-render không cần thiết
    const contextValue = useMemo(
        () => ({
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems: cartStats.totalItems,
            totalPrice: cartStats.totalPrice,
            loading,
            error,
        }),
        [
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            cartStats.totalItems,
            cartStats.totalPrice,
            loading,
            error,
        ],
    )

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = (): CartContextType => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart phải được sử dụng trong CartProvider')
    }
    return context
}
