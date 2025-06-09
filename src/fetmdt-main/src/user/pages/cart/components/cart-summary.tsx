"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "../../../contexts/cart-context"
import { useAuth } from "../../../contexts/auth-context"
interface CartSummaryProps {
  subtotal: number
  shipping: number
  total: number
  itemCount: number
}

export default function CartSummary({ subtotal, shipping, total, itemCount }: CartSummaryProps) {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCreateOrder = async () => {
    if (!user) {
      navigate("/login?redirect=cart")
      return
    }

    if (items.length === 0) {
      setError("Giỏ hàng trống")
      return
    }

    // Kiểm tra tồn kho trước khi chuyển đến trang thanh toán
    const outOfStockItems = items.filter((item) => {
      const requestedQuantity = item.quantity
      const availableStock = item.stock || 0
      return requestedQuantity > availableStock
    })

    if (outOfStockItems.length > 0) {
      const errorMessages = outOfStockItems.map(
        (item) => `${item.name}: Yêu cầu ${item.quantity}, chỉ còn ${item.stock || 0} sản phẩm`,
      )
      setError(`Một số sản phẩm không đủ tồn kho:\n${errorMessages.join("\n")}`)
      return
    }

    // Nếu tất cả sản phẩm đều đủ tồn kho, chuyển đến trang thanh toán
    setError(null)
    navigate("/checkout")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart size={20} />
          Tóm tắt đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Thông tin đơn hàng */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính ({itemCount} sản phẩm)</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <Truck size={14} />
              Phí vận chuyển
            </span>
            <span className="font-medium">{shipping > 0 ? formatPrice(shipping) : "Miễn phí"}</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <span className="text-teal-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Thông báo lỗi */}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm text-red-600 whitespace-pre-line">{error}</div>
            </div>
          </div>
        )}

        {/* Nút xác nhận đơn hàng */}
        <div className="space-y-3">
          <Button
            onClick={handleCreateOrder}
            disabled={isCreatingOrder || itemCount === 0}
            className="w-full bg-teal-600 hover:bg-teal-700"
            size="lg"
          >
            {isCreatingOrder ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang xử lý...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard size={18} />
                Tiến hành thanh toán
              </div>
            )}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Bằng cách đặt hàng, bạn đồng ý với{" "}
            <a href="/terms" className="text-teal-600 hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            của chúng tôi
          </p>
        </div>

        {/* Thông tin thanh toán */}
        <div className="rounded-lg bg-gray-50 p-3">
          <h4 className="mb-2 text-sm font-medium">Phương thức thanh toán</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard size={16} />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </div>
        </div>

        {/* Thông tin vận chuyển */}
        <div className="rounded-lg bg-blue-50 p-3">
          <h4 className="mb-2 text-sm font-medium text-blue-800">Thông tin vận chuyển</h4>
          <div className="space-y-1 text-xs text-blue-600">
            <p>• Giao hàng trong 2-3 ngày làm việc</p>
            <p>• Miễn phí vận chuyển cho đơn hàng trên 500.000đ</p>
            <p>• Hỗ trợ đổi trả trong 7 ngày</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
