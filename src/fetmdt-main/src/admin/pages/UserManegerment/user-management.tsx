'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    Search,
    Plus,
    Edit,
    Trash2,
    RefreshCw,
    Loader2,
    AlertCircle,
    Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomPagination } from '@/components/ui/custom-pagination'
import {
    apiUserService,
    type UserResponse,
    type CreateUserRequest,
    type UpdateUserRequest,
} from '../../../services/apiUser.service'
import {
    apiRoleService,
    type RoleResponse,
} from '../../../services/apiRole.service'
import { toast } from 'sonner'
import { UserModal } from './components/user-modal'

interface ExtendedUserResponse extends UserResponse {
    canDelete: boolean
    canEdit: boolean
}

export default function UserManagement() {
    const [users, setUsers] = useState<ExtendedUserResponse[]>([])
    const [roles, setRoles] = useState<RoleResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<ExtendedUserResponse | null>(
        null,
    )
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean
        user: ExtendedUserResponse | null
    }>({
        open: false,
        user: null,
    })

    // Fetch users from API
    const fetchUsers = async (page = 1, limit = 10, search = '', role = '') => {
        try {
            setLoading(true)
            const params: any = { page, limit }

            if (search) params.search = search
            if (role && role !== 'all') params.role = role

            const response = await apiUserService.getUsers(params)
            setUsers(response.data as ExtendedUserResponse[])
            setTotalRows(response.meta.total)
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Không thể tải danh sách người dùng')
        } finally {
            setLoading(false)
        }
    }

    // Fetch roles
    const fetchRoles = async () => {
        try {
            const response = await apiRoleService.getRoles({
                page: 1,
                limit: 100,
            })
            setRoles(response.data)
        } catch (error) {
            console.error('Error fetching roles:', error)
            toast.error('Không thể tải danh sách vai trò')
        }
    }

    useEffect(() => {
        fetchUsers(currentPage, perPage, searchTerm, filterRole)
        fetchRoles()
    }, [currentPage, perPage, filterRole])

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
            fetchUsers(1, perPage, searchTerm, filterRole)
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleAddUser = () => {
        setEditingUser(null)
        setIsModalOpen(true)
    }

    const handleEditUser = (user: ExtendedUserResponse) => {
        if (!user.canEdit) {
            toast.error('Không thể chỉnh sửa người dùng này')
            return
        }
        setEditingUser(user)
        setIsModalOpen(true)
    }

    const handleDeleteUser = (user: ExtendedUserResponse) => {
        if (!user.canDelete) {
            toast.error('Không thể xóa người dùng này')
            return
        }
        setDeleteDialog({ open: true, user })
    }

    const confirmDeleteUser = async () => {
        if (!deleteDialog.user) return

        try {
            await apiUserService.deleteUser(deleteDialog.user._id)
            toast.success('Đã xóa người dùng thành công')
            fetchUsers(currentPage, perPage, searchTerm, filterRole)
        } catch (error: any) {
            console.error('Error deleting user:', error)
            toast.error(
                error.response?.data?.message || 'Không thể xóa người dùng',
            )
        } finally {
            setDeleteDialog({ open: false, user: null })
        }
    }

    const handleResetPassword = async (userId: string) => {
        try {
            await apiUserService.resetPassword(userId)
            toast.success('Đã gửi email đặt lại mật khẩu')
        } catch (error: any) {
            console.error('Error resetting password:', error)
            toast.error(
                error.response?.data?.message || 'Không thể đặt lại mật khẩu',
            )
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSaveUser = async (
        userData: CreateUserRequest | UpdateUserRequest,
    ) => {
        try {
            if (editingUser) {
                const res = await apiUserService.updateUser(
                    editingUser._id,
                    userData as UpdateUserRequest,
                )
                if (res) {
                    toast.success('Đã cập nhật người dùng thành công')
                }
            } else {
                const res = await apiUserService.createUser(
                    userData as CreateUserRequest,
                )
                if (res) {
                    toast.success('Đã thêm người dùng thành công')
                }
            }
            setIsModalOpen(false)
            fetchUsers(currentPage, perPage, searchTerm, filterRole)
        } catch (error: any) {
            console.error('Error saving user:', error)
            toast.error(
                error.response?.data?.message || 'Không thể lưu người dùng',
            )
            throw error
        }
    }

    const totalPages = Math.ceil(totalRows / perPage)

    if (loading && users.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                <span className="ml-2">Đang tải...</span>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Quản lý người dùng
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Quản lý người dùng</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            Danh sách người dùng ({totalRows})
                        </CardTitle>
                        <Button
                            onClick={handleAddUser}
                            className="bg-teal-500 hover:bg-teal-600"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm người dùng
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm người dùng..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select
                                value={filterRole}
                                onValueChange={setFilterRole}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tất cả vai trò
                                    </SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role._id}
                                            value={role._id}
                                        >
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead className="text-right">
                                        Thao tác
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center"
                                        >
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-teal-500" />
                                            <span className="ml-2">
                                                Đang tải...
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-gray-500"
                                        >
                                            <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                                            <p>Không có người dùng nào</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <div className="flex items-center py-2">
                                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                                                        <span className="text-sm font-medium text-teal-600">
                                                            {user.firstName.charAt(
                                                                0,
                                                            )}
                                                            {user.lastName.charAt(
                                                                0,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 font-medium">
                                                            {user.firstName}{' '}
                                                            {user.lastName}
                                                            {user.role?.name ===
                                                                'Super Admin' && (
                                                                <Crown className="h-4 w-4 text-yellow-500" />
                                                            )}
                                                            {!user.canDelete && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-yellow-100 text-yellow-600"
                                                                >
                                                                    Không thể
                                                                    xóa
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        user.role?.name ===
                                                        'Super Admin'
                                                            ? 'bg-yellow-100 text-yellow-600'
                                                            : 'bg-blue-100 text-blue-600'
                                                    }
                                                >
                                                    {user.role?.name ||
                                                        'Chưa có vai trò'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.phone || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    user.createdAt,
                                                ).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditUser(user)
                                                        }
                                                        disabled={!user.canEdit}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleResetPassword(
                                                                user._id,
                                                            )
                                                        }
                                                        disabled={
                                                            user.role?.name ===
                                                            'Super Admin'
                                                        }
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user,
                                                            )
                                                        }
                                                        disabled={
                                                            !user.canDelete
                                                        }
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                showInfo
                                totalItems={totalRows}
                                itemsPerPage={perPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingUser={editingUser}
                roles={roles}
                onSave={handleSaveUser}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, user: null })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Xác nhận xóa người dùng
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa người dùng{' '}
                            <span className="font-medium">
                                {deleteDialog.user?.firstName}{' '}
                                {deleteDialog.user?.lastName}
                            </span>
                            ? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteUser}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
