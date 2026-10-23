import { request } from './client'
import type { CreateOrderPayload, Order } from '@/types/order'

export function createOrder(payload: CreateOrderPayload, idempotencyKey = createIdempotencyKey()) {
  return request<Order>('/orders', {
    method: 'POST',
    data: payload,
    header: {
      'Idempotency-Key': idempotencyKey
    }
  })
}

export function fetchOrder(orderNo: string) {
  return request<Order>(`/orders/${encodeURIComponent(orderNo)}`)
}

export function fetchOrders(tableNo: string) {
  return request<Order[]>(`/orders?tableNo=${encodeURIComponent(tableNo)}`)
}

function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

