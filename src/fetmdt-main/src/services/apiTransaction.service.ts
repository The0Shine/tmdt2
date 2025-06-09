import {
    TransactionQueryParams,
    TransactionResponse,
    SingleTransactionResponse,
    ITransaction,
    TransactionStats,
} from '@/types/transaction'
import { mainRepository } from '@/utils/Repository'

/**
 * Utility function to build query string from parameters
 */
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

/**
 * Generic error handler for API calls
 */
const handleApiError = (error: any, operation: string) => {
    console.error(`Error ${operation}:`, error)
    throw error
}

// ==================== TRANSACTIONS ====================

/**
 * Get transactions with pagination and filters
 */
export const getTransactions = async (
    params?: TransactionQueryParams,
): Promise<TransactionResponse> => {
    try {
        let url = '/api/transactions'
        if (params) {
            const queryString = buildQueryString(params)
            if (queryString) {
                url += `?${queryString}`
            }
        }
        const response = await mainRepository.get(url)
        return response
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return {
            success: false,
            count: 0,
            total: 0,
            pagination: {
                page: 1,
                limit: 10,
                totalPages: 0,
            },
            data: [],
        }
    }
}

/**
 * Get transaction by ID
 */
export const getTransactionById = async (
    id: string,
): Promise<SingleTransactionResponse> => {
    try {
        const response = await mainRepository.get(`/api/transactions/${id}`)
        return response.data
    } catch (error) {
        handleApiError(error, 'fetching transaction')
        throw error
    }
}

/**
 * Create a new transaction
 */

/**
 * Update transaction
 */
export const updateTransaction = async (
    id: string,
    transaction: Partial<ITransaction>,
): Promise<SingleTransactionResponse> => {
    try {
        const response = await mainRepository.put(
            `/api/transactions/${id}`,
            transaction,
        )
        return response.data
    } catch (error) {
        handleApiError(error, 'updating transaction')
        throw error
    }
}

/**
 * Delete transaction
 */
export const deleteTransaction = async (
    id: string,
): Promise<{ success: boolean }> => {
    try {
        const response = await mainRepository.delete(`/api/transactions/${id}`)
        return response.data
    } catch (error) {
        handleApiError(error, 'deleting transaction')
        throw error
    }
}

/**
 * Create refund transaction
 */

/**
 * Get transaction statistics
 */
export const getTransactionStats = async (): Promise<{
    success: boolean
    data: TransactionStats
}> => {
    try {
        const response = await mainRepository.get('/api/transactions/stats')
        return response.data
    } catch (error) {
        console.error('Error fetching transaction stats:', error)
        return {
            success: false,
            data: {
                today: {
                    totalIncome: 0,
                    totalExpense: 0,
                    netAmount: 0,
                    transactionCount: 0,
                    incomeCount: 0,
                    expenseCount: 0,
                    averageTransaction: 0,
                },
                thisWeek: {
                    totalIncome: 0,
                    totalExpense: 0,
                    netAmount: 0,
                    transactionCount: 0,
                    incomeCount: 0,
                    expenseCount: 0,
                    averageTransaction: 0,
                },
                thisMonth: {
                    totalIncome: 0,
                    totalExpense: 0,
                    netAmount: 0,
                    transactionCount: 0,
                    incomeCount: 0,
                    expenseCount: 0,
                    averageTransaction: 0,
                },
                thisYear: {
                    totalIncome: 0,
                    totalExpense: 0,
                    netAmount: 0,
                    transactionCount: 0,
                    incomeCount: 0,
                    expenseCount: 0,
                    averageTransaction: 0,
                },
                recentTransactions: [],
                topCategories: [],
            },
        }
    }
}

// ==================== EXPORT DEFAULT ====================

export default {
    // Main functions
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
}
