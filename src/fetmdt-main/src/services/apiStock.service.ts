import type {
    StockVoucherFormData,
    IStockVoucher,
    StockQueryParams,
    StockHistoryQueryParams,
    SingleStockResponse,
    StockVouchersResponse,
    StockHistoryResponse,
} from '@/admin/interfaces/stock.interface'
import { mainRepository } from '@/utils/Repository'
import { status } from 'nprogress'

// Interfaces
interface Pagination {
    page: number
    limit: number
    totalPages: number
}

interface BasicResponse<T> {
    success: boolean
    data: T
}

interface ListResponse<T> {
    success: boolean
    count: number
    total: number
    pagination: Pagination
    data: T[]
}

// Utilities
const buildQueryString = (params: Record<string, any>): string => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== '' &&
            value !== 'all'
        ) {
            queryParams.append(key, String(value))
        }
    })
    return queryParams.toString()
}

export const convertVoucherToBackendModel = (
    voucher: StockVoucherFormData,
): any => ({
    type: voucher.type,
    reason: voucher.reason,
    items: voucher.items.map((item) => ({
        product: item.product,
        productName: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        costPrice: item.costPrice,
        note: item.note,
    })),
    notes: voucher.notes,
    relatedOrder: voucher.relatedOrder,
    status: voucher.status || 'pending',
})

// API Functions

export const getStockVouchers = async (
    params: StockQueryParams = {},
): Promise<StockVouchersResponse> => {
    const query = buildQueryString(params)
    const url = query ? `/api/stock?${query}` : '/api/stock'
    return await mainRepository.get(url)
}

export const getStockVoucherById = async (
    id: string,
): Promise<SingleStockResponse> => {
    return await mainRepository.get(`/api/stock/${id}`)
}

export const createStockVoucher = async (
    voucher: StockVoucherFormData,
): Promise<SingleStockResponse> => {
    const data = convertVoucherToBackendModel(voucher)
    return await mainRepository.post('/api/stock', data)
}

export const updateStockVoucher = async (
    id: string,
    voucher: Partial<IStockVoucher>,
): Promise<SingleStockResponse> => {
    return await mainRepository.put(`/api/stock/${id}`, voucher)
}

export const deleteStockVoucher = async (
    id: string,
): Promise<{ success: boolean }> => {
    return await mainRepository.delete(`/api/stock/${id}`)
}

export const approveStockVoucher = async (id: string) => {
    try {
        const response = await mainRepository.patch(`/api/stock/${id}/approve`)
        // Nếu muốn trả về data của response
        return response
    } catch (error) {
        console.error(`Error approving stock voucher with id ${id}:`, error)
        // Ném lỗi lên caller để caller bắt và xử lý
        throw error
    }
}

export const rejectStockVoucher = async (
    id: string,
    rejectionReason?: string,
): Promise<SingleStockResponse> => {
    return await mainRepository.patch(`/api/stock/${id}/reject`, {
        rejectionReason,
    })
}

export const cancelStockVoucher = async (
    id: string,
): Promise<SingleStockResponse> => {
    return await mainRepository.patch(`/api/stock/${id}/cancel`)
}

export const getStockHistory = async (
    params: StockHistoryQueryParams = {},
): Promise<StockHistoryResponse> => {
    const query = buildQueryString(params)
    const url = query ? `/api/stock/history?${query}` : '/api/stock/history'
    return await mainRepository.get(url)
}

// Bulk Actions
export const bulkApproveVouchers = async (
    ids: string[],
): Promise<{ success: boolean; results: any[] }> => {
    const results = await Promise.allSettled(
        ids.map((id) => approveStockVoucher(id)),
    )
    return {
        success: results.every((r) => r.status === 'fulfilled'),
        results: results.map((res, i) => ({
            id: ids[i],
            success: res.status === 'fulfilled',
            error: res.status === 'rejected' ? res.reason : null,
        })),
    }
}

export const bulkRejectVouchers = async (
    ids: string[],
    rejectionReason: string,
): Promise<{ success: boolean; results: any[] }> => {
    const results = await Promise.allSettled(
        ids.map((id) => rejectStockVoucher(id, rejectionReason)),
    )
    return {
        success: results.every((r) => r.status === 'fulfilled'),
        results: results.map((res, i) => ({
            id: ids[i],
            success: res.status === 'fulfilled',
            error: res.status === 'rejected' ? res.reason : null,
        })),
    }
}
