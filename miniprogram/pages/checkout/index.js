const { categories } = require('../../data/menu')
const {
  clearCart,
  getCartSummary,
  getTableNo
} = require('../../utils/cart')
const { formatPrice } = require('../../utils/format')
const { saveOrder } = require('../../utils/orders')

Page({
  data: {
    lines: [],
    tableNo: '',
    orderType: '堂食',
    remark: '',
    totalQuantity: 0,
    subtotalText: '0.00',
    submitting: false
  },

  onShow() {
    this.refreshSummary()
  },

  refreshSummary() {
    const summary = getCartSummary(categories)
    this.setData({
      lines: summary.lines.map((item) => ({
        ...item,
        priceText: formatPrice(item.price),
        lineTotalText: formatPrice(item.lineTotal)
      })),
      tableNo: getTableNo() || 'A08',
      totalQuantity: summary.totalQuantity,
      subtotalText: formatPrice(summary.subtotal)
    })
  },

  selectOrderType(event) {
    this.setData({
      orderType: event.currentTarget.dataset.type
    })
  },

  onRemarkInput(event) {
    this.setData({
      remark: event.detail.value
    })
  },

  submitOrder() {
    if (!this.data.lines.length || this.data.submitting) {
      return
    }

    this.setData({ submitting: true })

    const now = Date.now()
    const order = {
      id: `SO${String(now).slice(-10)}`,
      createdAt: now,
      tableNo: this.data.tableNo,
      orderType: this.data.orderType,
      remark: this.data.remark.trim(),
      lines: this.data.lines,
      totalQuantity: this.data.totalQuantity,
      subtotal: this.data.lines.reduce((sum, item) => sum + item.lineTotal, 0),
      status: '已下单'
    }

    try {
      saveOrder(order)
      clearCart()
      wx.redirectTo({
        url: `/pages/order/index?id=${order.id}&created=1`
      })
    } catch (error) {
      this.setData({ submitting: false })
      wx.showToast({
        title: '下单失败，请重试',
        icon: 'none'
      })
    }
  }
})

