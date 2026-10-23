const { categories } = require('../../data/menu')
const {
  getCart,
  getCartSummary,
  getTableNo,
  setTableNo,
  updateItem
} = require('../../utils/cart')
const { formatPrice } = require('../../utils/format')

Page({
  data: {
    categories,
    activeCategory: 'signature',
    visibleItems: [],
    tableNo: '',
    totalQuantity: 0,
    subtotalText: '0.00'
  },

  onLoad(options) {
    const tableNo = options.tableNo
      ? decodeURIComponent(options.tableNo)
      : getTableNo()
    if (tableNo) {
      setTableNo(tableNo)
    }

    this.setData({ tableNo: tableNo || 'A08' })
    this.refreshMenu()
  },

  onShow() {
    this.refreshMenu()
  },

  refreshMenu() {
    const cart = getCart()
    const summary = getCartSummary(categories)
    const activeItems = categories.find(
      (category) => category.id === this.data.activeCategory
    ).items

    const visibleItems = activeItems.map((item) => ({
      ...item,
      quantity: cart[item.id] || 0,
      priceText: formatPrice(item.price)
    }))

    this.setData({
      visibleItems,
      totalQuantity: summary.totalQuantity,
      subtotalText: formatPrice(summary.subtotal)
    })
  },

  selectCategory(event) {
    this.setData({
      activeCategory: event.currentTarget.dataset.id
    })
    this.refreshMenu()
  },

  changeQuantity(event) {
    const { id, delta } = event.currentTarget.dataset
    updateItem(id, Number(delta))
    this.refreshMenu()
  },

  openCheckout() {
    if (!this.data.totalQuantity) {
      wx.showToast({
        title: '请先选择菜品',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/checkout/index'
    })
  }
})

