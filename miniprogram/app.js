const { getCart } = require('./utils/cart')

App({
  globalData: {
    cart: {},
    tableNo: ''
  },

  onLaunch() {
    this.globalData.cart = getCart()
  }
})

