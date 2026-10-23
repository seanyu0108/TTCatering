const { getTableNo, setTableNo } = require('../../utils/cart')

Page({
  data: {
    tableInput: '',
    activeTable: ''
  },

  onLoad(options) {
    const tableFromLink = options.tableNo ? decodeURIComponent(options.tableNo) : ''
    if (tableFromLink) {
      this.openMenu(tableFromLink.toUpperCase())
      return
    }

    this.setData({
      activeTable: getTableNo()
    })
  },

  onInputTable(event) {
    this.setData({
      tableInput: event.detail.value.toUpperCase()
    })
  },

  onScan() {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (result) => {
        const tableNo = this.extractTableNo(result.result)
        if (!tableNo) {
          wx.showToast({
            title: '未识别到有效桌号',
            icon: 'none'
          })
          return
        }
        this.openMenu(tableNo)
      }
    })
  },

  extractTableNo(value) {
    const content = String(value || '').trim()
    if (!content) {
      return ''
    }

    if (/^https?:\/\//i.test(content)) {
      const query = content.split('?')[1] || ''
      const match = query.match(/(?:tableNo|table)=([^&]+)/i)
      return match ? decodeURIComponent(match[1]).toUpperCase() : ''
    }

    return /^[a-z0-9-]{1,12}$/i.test(content) ? content.toUpperCase() : ''
  },

  startDemo() {
    this.openMenu('A08')
  },

  submitTable() {
    const tableNo = this.data.tableInput.trim().toUpperCase()
    if (!tableNo) {
      wx.showToast({
        title: '请先输入桌号',
        icon: 'none'
      })
      return
    }
    this.openMenu(tableNo)
  },

  openMenu(tableNo) {
    setTableNo(tableNo)
    wx.navigateTo({
      url: `/pages/menu/index?tableNo=${encodeURIComponent(tableNo)}`
    })
  },

  openOrders() {
    wx.navigateTo({
      url: '/pages/orders/index'
    })
  }
})

