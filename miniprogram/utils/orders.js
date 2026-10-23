const ORDERS_KEY = 'scan_order_orders_v1'

function getOrders() {
  try {
    const orders = wx.getStorageSync(ORDERS_KEY)
    return Array.isArray(orders) ? orders : []
  } catch (error) {
    return []
  }
}

function saveOrder(order) {
  const orders = getOrders()
  orders.unshift(order)
  wx.setStorageSync(ORDERS_KEY, orders.slice(0, 30))
  return order
}

function getOrder(id) {
  return getOrders().find((order) => order.id === id) || null
}

module.exports = {
  getOrder,
  getOrders,
  saveOrder
}

