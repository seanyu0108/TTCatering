const { formatDateTime, formatPrice } = require('../../utils/format')
const { getOrder } = require('../../utils/orders')

Page({
  data: {
    order: null,
    created: false
  },

  onLoad(options) {
    const order = getOrder(options.id)
    if (!order) {
      this.setData({
        order: null
      })
      return
    }

    this.setData({
      created: options.created === '1',
      order: {
        ...order,
        createdAtText: formatDateTime(order.createdAt),
        pickupNumber: order.id.slice(-4),
        subtotalText: formatPrice(order.subtotal),
        statusSteps: [
          { label: '已下单', done: true },
          { label: '制作中', done: false },
          { label: '已完成', done: false }
        ]
      }
    })
  },

  goMenu() {
    wx.redirectTo({
      url: `/pages/menu/index?tableNo=${encodeURIComponent(
        this.data.order ? this.data.order.tableNo : ''
      )}`
    })
  },

  goOrders() {
    wx.redirectTo({
      url: '/pages/orders/index'
    })
  }
})

