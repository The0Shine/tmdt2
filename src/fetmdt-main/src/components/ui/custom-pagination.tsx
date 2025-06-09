'use client'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

interface CustomPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export function CustomPagination({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}: CustomPaginationProps) {
    if (totalPages <= 1) return null

    return (
        <Pagination className={`mt-4 ${className}`}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() =>
                            onPageChange(Math.max(1, currentPage - 1))
                        }
                        className={
                            currentPage === 1
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber: number

                    if (totalPages <= 5) {
                        pageNumber = i + 1
                    } else if (currentPage <= 3) {
                        pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                    } else {
                        pageNumber = currentPage - 2 + i
                    }

                    if (pageNumber > 0 && pageNumber <= totalPages) {
                        return (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    isActive={pageNumber === currentPage}
                                    onClick={() => onPageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    }
                    return null
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            onPageChange(Math.min(totalPages, currentPage + 1))
                        }
                        className={
                            currentPage === totalPages
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
