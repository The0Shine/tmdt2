"use client"
import { X, FileDown, FileUp, Package, Calendar, User, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { IStockVoucher } from "../../../interfaces/stock.interface"

interface StockVoucherDetailModalProps {
  isOpen: boolean
  onClose: () => void
  voucher: IStockVoucher
}

export default function StockVoucherDetailModal({ isOpen, onClose, voucher }: StockVoucherDetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const renderVoucherTypeBadge = (type: string) => {
    switch (type) {
      case "import":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <FileDown className="w-3 h-3 mr-1" />
            Nhập kho
          </Badge>
        )
      case "export":
        return (
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            <FileUp className="w-3 h-3 mr-1" />
            Xuất kho
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Chờ duyệt</Badge>
      case "approved":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Đã duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Đã từ chối</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">Chi tiết phiếu kho</h2>
            {renderVoucherTypeBadge(voucher.type)}
            {renderStatusBadge(voucher.status)}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 130px)" }}>
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Mã phiếu</p>
                    <p className="font-medium text-gray-900">
                      {voucher.voucherNumber || `#${voucher._id?.substring(0, 8)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="font-medium text-gray-900">{formatDate(voucher.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Người tạo</p>
                    <p className="font-medium text-gray-900">
                      {typeof voucher.createdBy === "object" ? voucher.createdBy.lastName : "Admin"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {voucher.status === "approved" && voucher.approvedBy && (
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-500">Người duyệt</p>
                      <p className="font-medium text-gray-900">
                        {typeof voucher.approvedBy === "object" ? voucher.approvedBy.name : "Admin"}
                      </p>
                      {voucher.approvedAt && (
                        <p className="text-sm text-gray-500">{formatDate(voucher.approvedAt)}</p>
                      )}
                    </div>
                  </div>
                )}

                {voucher.status === "rejected" && voucher.rejectedBy && (
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-sm text-gray-500">Người từ chối</p>
                      <p className="font-medium text-gray-900">
                        {typeof voucher.rejectedBy === "object" ? voucher.rejectedBy.name : "Admin"}
                      </p>
                      {voucher.rejectedAt && (
                        <p className="text-sm text-gray-500">{formatDate(voucher.rejectedAt)}</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Tổng giá trị</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(voucher.totalValue || 0)}</p>
                </div>
              </div>
            </div>

            {/* Lý do */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Lý do</p>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-gray-900">{voucher.reason}</p>
              </div>
            </div>

            {/* Lý do từ chối */}
            {voucher.status === "rejected" && voucher.rejectionReason && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">Lý do từ chối</p>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-red-900">{voucher.rejectionReason}</p>
                </div>
              </div>
            )}

            {/* Danh sách sản phẩm */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Danh sách sản phẩm</p>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Sản phẩm</TableHead>
                      <TableHead className="font-semibold text-gray-700">Số lượng</TableHead>
                      <TableHead className="font-semibold text-gray-700">Đơn giá</TableHead>
                      <TableHead className="font-semibold text-gray-700">Thành tiền</TableHead>
                      <TableHead className="font-semibold text-gray-700">Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voucher.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                              <Package className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p className="text-sm text-gray-500">Đơn vị: {item.unit}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.costPrice)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.costPrice * item.quantity)}</TableCell>
                        <TableCell className="text-gray-600">{item.note || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Ghi chú */}
            {voucher.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Ghi chú</p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-gray-900">{voucher.notes}</p>
                </div>
              </div>
            )}

            {/* Tổng kết */}
            <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tổng số loại</p>
                  <p className="text-lg font-bold text-gray-900">{voucher.items.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tổng số lượng</p>
                  <p className="text-lg font-bold text-gray-900">
                    {voucher.items.reduce((total, item) => total + item.quantity, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tổng giá trị</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(voucher.totalValue || 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {voucher.status === "approved" && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <FileDown className="mr-2 h-4 w-4" />
              Tải xuống PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}