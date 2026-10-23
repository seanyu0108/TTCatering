import { defineStore } from 'pinia'
import type { MenuItem } from '@/types/menu'

export interface CartLine extends MenuItem {
  quantity: number
}

interface CartState {
  tableNo: string
  lines: CartLine[]
}

const CART_KEY = 'scan_order_cart_v2'

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    tableNo: '',
    lines: []
  }),

  getters: {
    totalQuantity: (state) => state.lines.reduce((sum, line) => sum + line.quantity, 0),
    totalFen: (state) =>
      state.lines.reduce((sum, line) => sum + line.priceFen * line.quantity, 0)
  },

  actions: {
    restore() {
      const saved = uni.getStorageSync(CART_KEY) as CartState | ''
      if (saved && Array.isArray(saved.lines)) {
        this.tableNo = saved.tableNo || ''
        this.lines = saved.lines
      }
    },

    setTableNo(tableNo: string) {
      this.tableNo = tableNo.trim().toUpperCase()
      this.persist()
    },

    add(item: MenuItem) {
      const existing = this.lines.find((line) => line.id === item.id)
      if (existing) {
        if (existing.quantity < 99) {
          existing.quantity += 1
        }
      } else {
        this.lines.push({ ...item, quantity: 1 })
      }
      this.persist()
    },

    decrease(itemId: string) {
      const line = this.lines.find((entry) => entry.id === itemId)
      if (!line) {
        return
      }
      line.quantity -= 1
      if (line.quantity <= 0) {
        this.lines = this.lines.filter((entry) => entry.id !== itemId)
      }
      this.persist()
    },

    quantityOf(itemId: string) {
      return this.lines.find((line) => line.id === itemId)?.quantity || 0
    },

    clear() {
      this.lines = []
      this.persist()
    },

    persist() {
      uni.setStorageSync(CART_KEY, {
        tableNo: this.tableNo,
        lines: this.lines
      })
    }
  }
})
