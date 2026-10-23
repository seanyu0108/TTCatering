const CART_KEY = 'scan_order_cart_v1'
const TABLE_KEY = 'scan_order_active_table'

function getCart() {
  try {
    const cart = wx.getStorageSync(CART_KEY)
    return cart && typeof cart === 'object' ? cart : {}
  } catch (error) {
    return {}
  }
}

function setCart(cart) {
  wx.setStorageSync(CART_KEY, cart)
  return cart
}

function updateItem(id, delta) {
  const cart = getCart()
  const nextQuantity = Math.max(0, Number(cart[id] || 0) + Number(delta))

  if (nextQuantity === 0) {
    delete cart[id]
  } else {
    cart[id] = nextQuantity
  }

  return setCart(cart)
}

function clearCart() {
  wx.removeStorageSync(CART_KEY)
}

function getCartSummary(categories) {
  const cart = getCart()
  const items = categories.flatMap((category) => category.items)
  const lines = items
    .filter((item) => cart[item.id])
    .map((item) => ({
      ...item,
      quantity: cart[item.id],
      lineTotal: item.price * cart[item.id]
    }))

  return {
    cart,
    lines,
    subtotal: lines.reduce((sum, item) => sum + item.lineTotal, 0),
    totalQuantity: lines.reduce((sum, item) => sum + item.quantity, 0)
  }
}

function getTableNo() {
  return wx.getStorageSync(TABLE_KEY) || ''
}

function setTableNo(tableNo) {
  wx.setStorageSync(TABLE_KEY, tableNo)
}

module.exports = {
  clearCart,
  getCart,
  getCartSummary,
  getTableNo,
  setTableNo,
  updateItem
}

