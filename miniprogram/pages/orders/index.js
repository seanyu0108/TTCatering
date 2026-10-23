const { formatDateTime, formatPrice } = require('../../utils/format')
const { getOrders } = require('../../utils/orders')

Page({
  data: {
    orders: []
  },

  onShow() {
    const orders = getOrders().map((order) => ({
      ...order,
      createdAtText: formatDateTime(order.createdAt),
      subtotalText: formatPrice(order.subtotal),
      summary: order.lines
        .slice(0, 2)
        .map((item) => item.name)
        .join('、')
    }))

    this.setData({ orders })
  },

  openOrder(event) {
    wx.navigateTo({
      url: `/pages/order/index?id=${event.currentTarget.dataset.id}`
    })
  },

  goHome() {
    wx.reLaunch({
      url: '/pages/home/index'
    })
  }
})

