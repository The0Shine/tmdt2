/**
 * Format a date string to a readable format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string): string => {
    if (!dateString) return '-'

    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
        return '-'
    }

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

/**
 * Format a number as currency
 * @param value Number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value)
}

/**
 * Format a number with commas
 * @param value Number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('vi-VN').format(value)
}
