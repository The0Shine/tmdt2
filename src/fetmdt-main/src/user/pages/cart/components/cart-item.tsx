'use client'

import React from 'react'

import { useState, useCallback, memo } from 'react'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../../utils/Format'
import type { CartItem as CartItemType } from '../../../contexts/cart-context'

interface CartItemProps {
    item: CartItemType
    onUpdateQuantity: (productId: string, quantity: number) => Promise<void>
    onRemove: (productId: string) => Promise<void>
}

const CartItem = memo(function CartItem({
    item,
    onUpdateQuantity,
    onRemove,
}: CartItemProps) {
    const [isUpdating, setIsUpdating] = useState(false)
    const [quantity, setQuantity] = useState(item.quantity)

    // Handle quantity change with debounce
    const handleQuantityChange = useCallback(
        async (newQuantity: number) => {
            if (newQuantity === quantity) return // Tránh update không cần thiết
            console.log(item)

            // Check if new quantity exceeds available stock
            if (item.stock && newQuantity > item.stock) {
                // Limit to maximum available stock
                newQuantity = item.stock
            }

            setQuantity(newQuantity)
            setIsUpdating(true)

            try {
                console.log(item._id, newQuantity)
                await onUpdateQuantity(item._id, newQuantity)
            } finally {
                setIsUpdating(false)
            }
        },
        [item._id, item.stock, onUpdateQuantity, quantity],
    )

    // Handle form submission
    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault()
            handleQuantityChange(quantity)
        },
        [handleQuantityChange, quantity],
    )

    // Handle direct input change
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value > 0) {
                // Limit input value to available stock if stock exists
                if (item.stock) {
                    setQuantity(Math.min(value, item.stock))
                } else {
                    setQuantity(value)
                }
            }
        },
        [item.stock],
    )

    // Handle increment/decrement
    const incrementQuantity = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()
            // Check if current quantity is less than available stock
            if (item.stock && quantity >= item.stock) {
                // Don't allow increasing beyond available stock
                return
            }
            handleQuantityChange(quantity + 1)
        },
        [handleQuantityChange, quantity, item.stock],
    )

    const decrementQuantity = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()
            if (quantity > 1) {
                handleQuantityChange(quantity - 1)
            }
        },
        [handleQuantityChange, quantity],
    )

    const handleRemove = useCallback(() => {
        onRemove(item._id)
    }, [onRemove, item._id])

    // Sync quantity with item.quantity when it changes from external source
    React.useEffect(() => {
        if (item.quantity !== quantity && !isUpdating) {
            setQuantity(item.quantity)
        }
    }, [item.quantity, quantity, isUpdating])

    return (
        <div className="mb-6 border-b border-gray-200 pb-6 last:mb-0 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                        src={
                            item.image || '/placeholder.svg?height=80&width=80'
                        }
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div className="flex flex-1 flex-col">
                    <h3 className="text-base font-medium text-gray-800">
                        {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {item.category?.name || 'Uncategorized'}
                    </p>
                    {item.stock && (
                        <p className="mt-1 text-xs text-gray-400">
                            Còn lại: {item.stock} sản phẩm
                        </p>
                    )}
                    <p className="mt-1 text-sm font-medium text-teal-600">
                        {formatCurrency(item.price)}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSubmit} className="flex items-center">
                        <button
                            type="button"
                            onClick={decrementQuantity}
                            className="flex h-8 w-8 items-center justify-center rounded-l border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            disabled={isUpdating || quantity <= 1}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={handleInputChange}
                            onBlur={() => handleQuantityChange(quantity)}
                            className="h-8 w-12 border-y border-gray-300 bg-white px-2 text-center text-sm focus:outline-none"
                            disabled={isUpdating}
                        />
                        <button
                            type="button"
                            onClick={incrementQuantity}
                            className="flex h-8 w-8 items-center justify-center rounded-r border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            disabled={isUpdating}
                        >
                            +
                        </button>
                    </form>
                    {item.stock && quantity >= item.stock && (
                        <div className="ml-2 text-xs text-red-500">
                            Max stock reached
                        </div>
                    )}

                    <div className="w-24 text-right font-medium">
                        {formatCurrency(item.price * item.quantity)}
                    </div>

                    <button
                        onClick={handleRemove}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                        disabled={isUpdating}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            {/* {isUpdating && (
                <div className="mt-2 text-right text-xs text-gray-500">
                    Đang cập nhật...
                </div>
            )} */}
        </div>
    )
})

export default CartItem
