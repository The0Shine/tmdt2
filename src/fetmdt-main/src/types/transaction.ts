// Frontend interfaces for Transaction Management (CHỈ XEM - KHÔNG TẠO THỦ CÔNG)

export interface ITransaction {
    _id?: string
    transactionNumber?: string
    type: 'income' | 'expense' // Chỉ thu và chi
    category: 'order' | 'stock' // Chỉ đơn hàng và kho
    amount: number
    description: string
    paymentMethod:
        | 'cash'
        | 'bank_transfer'
        | 'credit_card'
        | 'e_wallet'
        | 'other'
    relatedOrder?:
        | {
              _id: string
              orderNumber: string
              totalAmount: number
          }
        | string
    relatedVoucher?:
        | {
              _id: string
              voucherNumber: string
              type: string
          }
        | string
    relatedCustomer?:
        | {
              _id: string
              name: string
              email: string
              phone: string
          }
        | string
    createdBy:
        | {
              lastName: string
              _id: string
              email: string
          }
        | string
    transactionDate: string
    notes?: string
    metadata?: {
        orderNumber?: string
        voucherNumber?: string
        voucherType?: string
        customerInfo?: string
        autoCreated?: boolean
    }
    createdAt: string
    updatedAt: string
}

// Query parameters (CHỈ ĐỂ LỌC VÀ XEM)
export interface TransactionQueryParams {
    page?: number
    limit?: number
    search?: string
    type?: 'income' | 'expense'
    category?: 'order' | 'stock'
    paymentMethod?:
        | 'cash'
        | 'bank_transfer'
        | 'credit_card'
        | 'e_wallet'
        | 'other'
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
    createdBy?: string
    autoCreated?: boolean
}

// Response interfaces
export interface TransactionResponse {
    success: boolean
    count: number
    total: number
    pagination: {
        page: number
        limit: number
        totalPages: number
    }
    summary?: TransactionSummary
    data: ITransaction[]
}

export interface SingleTransactionResponse {
    success: boolean
    data: ITransaction
}

// Transaction summary
export interface TransactionSummary {
    totalIncome: number
    totalExpense: number
    netAmount: number
    transactionCount: number
    incomeCount: number
    expenseCount: number
    averageTransaction: number
    orderIncome: number // Thu từ đơn hàng
    stockExpense: number // Chi cho kho
}

// Dashboard stats
export interface TransactionStats {
    today: TransactionSummary
    thisWeek: TransactionSummary
    thisMonth: TransactionSummary
    thisYear: TransactionSummary
    recentTransactions: ITransaction[]
    categoryBreakdown: Array<{
        category: string
        income: number
        expense: number
        count: number
    }>
}

// Filter interfaces (CHỈ ĐỂ LỌC)
export interface TransactionFilters {
    search: string
    type: 'all' | 'income' | 'expense'
    category: 'all' | 'order' | 'stock'
    paymentMethod:
        | 'all'
        | 'cash'
        | 'bank_transfer'
        | 'credit_card'
        | 'e_wallet'
        | 'other'
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
    autoCreated?: 'all' | 'true' | 'false'
}
