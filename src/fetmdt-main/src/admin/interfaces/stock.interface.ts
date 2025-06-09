// Frontend interfaces for Stock Management

export interface IStockAdjustmentProduct {
    productId: string
    quantity: number
    note?: string
    unit: string
    productName?: string
    costPrice?: number
}

export interface IStockItem {
    product: string
    productName: string
    quantity: number
    unit: string
    costPrice: number
    note?: string
}

export interface IStockVoucher {
    _id?: string
    voucherNumber?: string
    type: 'import' | 'export'
    reason: string
    items: IStockItem[]
    totalValue?: number
    status: 'pending' | 'approved' | 'rejected' | 'cancelled'
    createdBy?:
        | {
              lastName: string
              _id: string
              email: string
          }
        | string
    approvedBy?:
        | {
              _id: string
              name: string
              email: string
          }
        | string
    approvedAt?: string
    rejectedBy?:
        | {
              _id: string
              name: string
              email: string
          }
        | string
    rejectedAt?: string
    rejectionReason?: string
    relatedOrder?: string
    notes?: string
    createdAt: string
    updatedAt: string
}

export interface IStockHistory {
    _id?: string
    product: string
    productName: string
    type: 'import' | 'export'
    quantityBefore: number
    quantityChange: number
    quantityAfter: number
    reason: string
    relatedVoucher: string
    voucherNumber: string
    relatedOrder?: string
    createdBy:
        | {
              _id: string
              name: string
              email: string
          }
        | string
    notes?: string
    createdAt: string
    updatedAt: string
}

export interface IStockAdjustment {
    _id?: string
    voucherNumber?: string
    type: 'import' | 'export' | 'adjustment'
    reason: string
    products: IStockAdjustmentProduct[]
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'
    createdBy?: string
    date?: string
    createdAt?: string
    updatedAt?: string
}

// Query parameters
export interface StockQueryParams {
    page?: number
    limit?: number
    search?: string
    type?: 'import' | 'export'
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
    startDate?: string
    endDate?: string
    createdBy?: string
}

export interface StockHistoryQueryParams {
    page?: number
    limit?: number
    search?: string
    type?: 'import' | 'export'
    productId?: string
    voucherNumber?: string
    startDate?: string
    endDate?: string
}

export interface StockAdjustmentQueryParams {
    page?: number
    limit?: number
    search?: string
    sort?: string
    type?: 'import' | 'export' | 'adjustment'
    startDate?: string
    endDate?: string
}

export interface StockVoucherQueryParams {
    page?: number
    limit?: number
    search?: string
    sort?: string
    type?: 'import' | 'export'
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
    startDate?: string
    endDate?: string
}

// Response interfaces
export interface StockResponse {
    success: boolean
    count: number
    total: number
    pagination: {
        page: number
        limit: number
        totalPages: number
    }
    data: IStockVoucher[]
}

export interface StockHistoryResponse {
    data: {
        success: boolean
        count: number
        total: number
        pagination: {
            page: number
            limit: number
            totalPages: number
        }
        data: IStockHistory[]
    }
}

export interface StockAdjustmentResponse {
    success: boolean
    data: IStockAdjustment
}

export interface StockAdjustmentsResponse {
    success: boolean
    count: number
    total: number
    pagination: {
        page: number
        limit: number
        totalPages: number
    }
    data: IStockAdjustment[]
}

export interface StockVouchersResponse {
    success: boolean
    count: number
    total: number
    pagination: {
        page: number
        limit: number
        totalPages: number
    }
    data: IStockVoucher[]
}

export interface SingleStockResponse {
    success: boolean
    data: IStockVoucher
}

// Legacy/Utility interfaces
export interface StockVoucherItem {
    productId: string
    productName: string
    quantity: number
    costPrice: number
    totalValue: number
    note?: string
}

export interface StockHistory {
    id: string
    productId: string
    productName: string
    type: 'import' | 'export' | 'adjustment'
    quantity: number
    beforeStock: number
    afterStock: number
    voucherId?: string
    createdAt: string
    createdBy: string
    note?: string
}

// Form interfaces for components
export interface StockVoucherFormData {
    type: 'import' | 'export'
    reason: string
    items: IStockItem[]
    notes?: string
    relatedOrder?: string
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
}

export interface StockItemFormData {
    productId: string
    productName: string
    quantity: number
    unit: string
    costPrice: number
    note?: string
}

// Filter interfaces for UI
export interface StockFilters {
    search: string
    type: 'all' | 'import' | 'export'
    status: 'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'
    startDate?: string
    endDate?: string
}

export interface StockHistoryFilters {
    search: string
    type: 'all' | 'import' | 'export'
    startDate?: string
    endDate?: string
}
