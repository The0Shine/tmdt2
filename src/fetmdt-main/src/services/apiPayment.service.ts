import { mainRepository } from '@/utils/Repository'

export interface CreatePaymentRequest {
    orderData: {
        orderItems: any[]
        shippingAddress: any
        paymentMethod: string
        totalPrice: number
        customerInfo?: any
        note?: string
    }
    paymentMethod: 'vnpay' | 'cod'
}

export interface PaymentResponse {
    success: boolean
    paymentUrl?: string
    message: string
    paymentId?: string
    orderId?: string
    paymentMethod: string
}

export interface VNPayReturnResponse {
    success: boolean
    message: string
    paymentId?: string
    orderId?: string
    redirectUrl: string
}

// Tạo thanh toán - THAY ĐỔI API CALL
export const createPayment = async (
    paymentData: CreatePaymentRequest,
): Promise<PaymentResponse> => {
    try {
        console.log('🔄 Creating payment with orderData:', paymentData)

        const response = await mainRepository.post(
            '/api/payment/create',
            paymentData,
        )

        console.log('✅ Payment created:', response.data)
        return response.data
    } catch (error) {
        console.error('❌ Error creating payment:', error)
        throw error
    }
}

// Xử lý VNPay return - GỌI API BACKEND
export const handleVNPayReturn = async (
    params: Record<string, string>,
): Promise<VNPayReturnResponse> => {
    try {
        console.log('🔄 Calling backend VNPay return API with params:', params)

        // Gọi API backend để xử lý VNPay return
        const queryString = new URLSearchParams(params).toString()
        const url = `/api/payment/vnpay-return?${queryString}`
        const response = await mainRepository.get(url)

        console.log('✅ Backend VNPay return response:', response.data)
        return response.data
    } catch (error) {
        console.error('❌ Error handling VNPay return:', error)
        throw error
    }
}

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (orderId: string) => {
    try {
        const response = await mainRepository.get(
            `/api/payment/status/${orderId}`,
        )
        return response.data
    } catch (error) {
        console.error('Error checking payment status:', error)
        throw error
    }
}

// Kiểm tra order theo paymentId (cho VNPay processing)
export const checkOrderByPaymentId = async (paymentId: string) => {
    try {
        const response = await mainRepository.get(
            `/api/payment/check-order/${paymentId}`,
        )
        return response.data
    } catch (error) {
        console.error('Error checking order by paymentId:', error)
        throw error
    }
}
