'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Shield,
    Loader2,
    AlertCircle,
    Users,
    Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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
    apiRoleService,
    type RoleResponse,
    type CreateRoleRequest,
    type UpdateRoleRequest,
} from '../../../services/apiRole.service'
import { toast } from 'sonner'

interface ExtendedRoleResponse extends RoleResponse {
    canDelete: boolean
    canEdit: boolean
}

export default function RoleManagement() {
    const [roles, setRoles] = useState<ExtendedRoleResponse[]>([])
    const [permissions, setPermissions] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<ExtendedRoleResponse | null>(
        null,
    )
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean
        role: ExtendedRoleResponse | null
    }>({
        open: false,
        role: null,
    })

    // Fetch roles from API
    const fetchRoles = async (page = 1, limit = 10, search = '') => {
        try {
            setLoading(true)
            const params: any = { page, limit }

            if (search) params.search = search

            const response = await apiRoleService.getRoles(params)
            console.log(response)

            setRoles(response.data as ExtendedRoleResponse[])
            setTotalRows(response.meta.total)
        } catch (error) {
            console.error('Error fetching roles:', error)
            toast.error('Không thể tải danh sách vai trò')
        } finally {
            setLoading(false)
        }
    }

    // Fetch permissions
    const fetchPermissions = async () => {
        try {
            const response = await apiRoleService.getPermissions()
            setPermissions(response.data)
        } catch (error) {
            console.error('Error fetching permissions:', error)
            toast.error('Không thể tải danh sách quyền')
        }
    }

    useEffect(() => {
        fetchRoles(currentPage, perPage, searchTerm)
        fetchPermissions()
    }, [currentPage, perPage])

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
            fetchRoles(1, perPage, searchTerm)
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleAddRole = () => {
        setEditingRole(null)
        setIsModalOpen(true)
    }

    const handleEditRole = (role: ExtendedRoleResponse) => {
        if (!role.canEdit) {
            toast.error('Không thể chỉnh sửa vai trò này')
            return
        }
        setEditingRole(role)
        setIsModalOpen(true)
    }

    const handleDeleteRole = (role: ExtendedRoleResponse) => {
        if (!role.canDelete) {
            toast.error('Không thể xóa vai trò này')
            return
        }
        setDeleteDialog({ open: true, role })
    }

    const confirmDeleteRole = async () => {
        if (!deleteDialog.role) return

        try {
            await apiRoleService.deleteRole(deleteDialog.role._id)
            toast.success('Đã xóa vai trò thành công')
            fetchRoles(currentPage, perPage, searchTerm)
        } catch (error: any) {
            console.error('Error deleting role:', error)
            toast.error(
                error.response?.data?.message || 'Không thể xóa vai trò',
            )
        } finally {
            setDeleteDialog({ open: false, role: null })
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const totalPages = Math.ceil(totalRows / perPage)

    if (loading && roles.length === 0) {
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
                    Quản lý quyền truy cập
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Quản lý quyền</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Danh sách vai trò ({totalRows})</CardTitle>
                        <Button
                            onClick={handleAddRole}
                            className="bg-teal-500 hover:bg-teal-600"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm vai trò
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm vai trò..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên vai trò</TableHead>
                                    <TableHead>Mô tả</TableHead>
                                    <TableHead>Số người dùng</TableHead>
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
                                ) : roles.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-8 text-center text-gray-500"
                                        >
                                            <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                                            <p>Không có vai trò nào</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.map((role) => (
                                        <TableRow key={role._id}>
                                            <TableCell>
                                                <div className="flex items-center py-2">
                                                    {role.name ===
                                                    'Super Admin' ? (
                                                        <Crown
                                                            className="mr-2 text-yellow-500"
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <Shield
                                                            className="mr-2 text-teal-500"
                                                            size={16}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2 font-medium">
                                                            {role.name}
                                                            {role.name ===
                                                                'Super Admin' && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-yellow-100 text-yellow-600"
                                                                >
                                                                    Không thể
                                                                    xóa
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {
                                                                role.permissions
                                                                    .length
                                                            }{' '}
                                                            quyền
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {role.description || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                                                    <Badge
                                                        variant="outline"
                                                        className="border-blue-200 bg-blue-50 text-blue-600"
                                                    >
                                                        {role.userCount}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    role.createdAt,
                                                ).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditRole(role)
                                                        }
                                                        disabled={!role.canEdit}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteRole(
                                                                role,
                                                            )
                                                        }
                                                        disabled={
                                                            !role.canDelete
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
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Role Modal */}
            {isModalOpen && permissions && (
                <RoleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    role={editingRole}
                    onSave={async (roleData) => {
                        try {
                            if (editingRole) {
                                await apiRoleService.updateRole(
                                    editingRole._id,
                                    roleData,
                                )
                                toast.success('Đã cập nhật vai trò thành công')
                            } else {
                                await apiRoleService.createRole(
                                    roleData as CreateRoleRequest,
                                )
                                toast.success('Đã thêm vai trò thành công')
                            }
                            setIsModalOpen(false)
                            fetchRoles(currentPage, perPage, searchTerm)
                        } catch (error: any) {
                            console.error('Error saving role:', error)
                            toast.error(
                                error.response?.data?.message ||
                                    'Không thể lưu vai trò',
                            )
                        }
                    }}
                    permissions={permissions}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, role: null })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Xác nhận xóa vai trò
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa vai trò{' '}
                            <span className="font-medium">
                                {deleteDialog.role?.name}
                            </span>
                            ?
                            {deleteDialog.role?.userCount &&
                                deleteDialog.role.userCount > 0 && (
                                    <span className="text-red-600">
                                        {' '}
                                        Hiện có {
                                            deleteDialog.role.userCount
                                        }{' '}
                                        người dùng đang sử dụng vai trò này.
                                    </span>
                                )}{' '}
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteRole}
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

interface RoleModalProps {
    isOpen: boolean
    onClose: () => void
    role: ExtendedRoleResponse | null
    onSave: (role: CreateRoleRequest | UpdateRoleRequest) => Promise<void>
    permissions: any
}

function RoleModal({
    isOpen,
    onClose,
    role,
    onSave,
    permissions,
}: RoleModalProps) {
    const [formData, setFormData] = useState<
        Partial<CreateRoleRequest & UpdateRoleRequest>
    >(
        role
            ? {
                  name: role.name,
                  description: role.description || '',
                  permissions: role.permissions,
              }
            : {
                  name: '',
                  description: '',
                  permissions: [],
              },
    )
    const [loading, setLoading] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handlePermissionChange = (permission: string, checked: boolean) => {
        const currentPermissions = formData.permissions || []
        if (checked) {
            setFormData({
                ...formData,
                permissions: [...currentPermissions, permission],
            })
        } else {
            setFormData({
                ...formData,
                permissions: currentPermissions.filter((p) => p !== permission),
            })
        }
    }

    const handleSelectAllForModule = (
        modulePermissions: string[],
        checked: boolean,
    ) => {
        const currentPermissions = formData.permissions || []
        if (checked) {
            const newPermissions = [
                ...new Set([...currentPermissions, ...modulePermissions]),
            ]
            setFormData({
                ...formData,
                permissions: newPermissions,
            })
        } else {
            setFormData({
                ...formData,
                permissions: currentPermissions.filter(
                    (p) => !modulePermissions.includes(p),
                ),
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSave(formData as CreateRoleRequest | UpdateRoleRequest)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const currentPermissions = formData.permissions || []

    // Permission labels mapping
    const permissionLabels: Record<string, string> = {
        // Products
        'products.create': 'Thêm sản phẩm',
        'products.edit': 'Sửa sản phẩm',
        'products.delete': 'Xóa sản phẩm',

        // Categories
        'categories.create': 'Thêm danh mục',
        'categories.edit': 'Sửa danh mục',
        'categories.delete': 'Xóa danh mục',

        // Orders
        'orders.view_all': 'Xem tất cả đơn hàng',
        'orders.update_payment': 'Cập nhật thanh toán',
        'orders.update_delivery': 'Cập nhật giao hàng',
        'orders.update_status': 'Cập nhật trạng thái',

        // Stock
        'stock.create': 'Tạo phiếu kho',
        'stock.edit': 'Sửa phiếu kho',
        'stock.delete': 'Xóa phiếu kho',
        'stock.approve': 'Duyệt phiếu kho',
        'stock.reject': 'Từ chối phiếu kho',
        'stock.cancel': 'Hủy phiếu kho',

        // Transactions
        'transactions.view': 'Xem giao dịch',
        'transactions.stats': 'Thống kê giao dịch',

        // Users
        'users.view': 'Xem người dùng',
        'users.create': 'Thêm người dùng',
        'users.edit': 'Sửa người dùng',
        'users.delete': 'Xóa người dùng',

        // Roles
        'roles.view': 'Xem vai trò',
        'roles.create': 'Thêm vai trò',
        'roles.edit': 'Sửa vai trò',
        'roles.delete': 'Xóa vai trò',

        // Admin
        'admin.all': 'Toàn quyền admin',
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-teal-500" />
                        {role ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Tên vai trò{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Nhập tên vai trò"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Nhập mô tả vai trò"
                                rows={2}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">
                                Phân quyền ({currentPermissions.length}/
                                {permissions.all.length})
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(permissions.grouped).map(
                                    ([moduleKey, moduleData]: [
                                        string,
                                        any,
                                    ]) => {
                                        const modulePermissions =
                                            moduleData.permissions
                                        const selectedCount =
                                            modulePermissions.filter(
                                                (p: string) =>
                                                    currentPermissions.includes(
                                                        p,
                                                    ),
                                            ).length
                                        const isAllSelected =
                                            selectedCount ===
                                            modulePermissions.length
                                        const isPartialSelected =
                                            selectedCount > 0 &&
                                            selectedCount <
                                                modulePermissions.length

                                        return (
                                            <div
                                                key={moduleKey}
                                                className="rounded-lg border border-gray-200 p-4"
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={
                                                                isAllSelected
                                                            }
                                                            ref={(el) => {
                                                                if (
                                                                    el &&
                                                                    'indeterminate' in
                                                                        el
                                                                ) {
                                                                    ;(
                                                                        el as HTMLInputElement
                                                                    ).indeterminate =
                                                                        isPartialSelected
                                                                }
                                                            }}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                handleSelectAllForModule(
                                                                    modulePermissions,
                                                                    Boolean(
                                                                        checked,
                                                                    ),
                                                                )
                                                            }
                                                            disabled={loading}
                                                        />
                                                        <Label className="font-medium text-gray-900">
                                                            {moduleData.name}
                                                        </Label>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {selectedCount}/
                                                        {
                                                            modulePermissions.length
                                                        }
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                                    {modulePermissions.map(
                                                        (
                                                            permission: string,
                                                        ) => {
                                                            return (
                                                                <div
                                                                    key={
                                                                        permission
                                                                    }
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <Checkbox
                                                                        checked={currentPermissions.includes(
                                                                            permission,
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            handlePermissionChange(
                                                                                permission,
                                                                                Boolean(
                                                                                    checked,
                                                                                ),
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            loading
                                                                        }
                                                                    />
                                                                    <Label className="text-sm text-gray-700">
                                                                        {permissionLabels[
                                                                            permission
                                                                        ] ||
                                                                            permission}
                                                                    </Label>
                                                                </div>
                                                            )
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    },
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-teal-500 hover:bg-teal-600"
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {role ? 'Cập nhật' : 'Thêm vai trò'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
