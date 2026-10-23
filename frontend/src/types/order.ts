export type OrderType = 'DINE_IN' | 'TAKEAWAY'

export interface OrderLine {
  itemId: string
  name: string
  unitPriceFen: number
  quantity: number
  lineTotalFen: number
}

export interface Order {
  id: string
  orderNo: string
  tableNo: string
  orderType: OrderType
  status: string
  remark: string
  totalQuantity: number
  totalFen: number
  createdAt: string
  lines: OrderLine[]
}

export interface CreateOrderPayload {
  tableNo: string
  orderType: OrderType
  remark: string
  lines: Array<{
    itemId: string
    quantity: number
  }>
}

