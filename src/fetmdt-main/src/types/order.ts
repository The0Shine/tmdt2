export interface OrderItem {
    _id: string
    name: string
    price: number
    quantity: number
    total: number
}

export interface OrderData {
    _id: string
    date: string
    customer: {
        email: string
        phone: string
        address: string
    }
    items: OrderItem[]
    subtotal: number
    shipping: number
    shippingAddress: {
        address: string
        city: string
    }
    tax: number
    total: number
    paymentMethod: string
    note: string
}

// Thêm export interface cho API response
export interface OrderResponse {
    data: Order
}
export interface Order {
    _id: string
    orderNumber?: string
    createdAt: string
    user: {
        _id: string
        email: string
    }
    orderItems: Array<{
        _id: string
        product: {
            _id: string
            name: string
            price: number
            image: string
        }
        quantity: number
    }>
    shippingAddress: {
        address: string
        city: string
    }
    paymentMethod: string
    itemsPrice: number
    totalPrice: number
    isPaid: boolean
    paidAt?: string
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
    updatedAt: string
    paymentResult?: {
        id: string
        status: string
        update_time: string
        email_address: string
    }
}
