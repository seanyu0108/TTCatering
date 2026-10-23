<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const tableInput = ref('')

onLoad((options) => {
  const tableNo = options?.tableNo
  if (tableNo) {
    openMenu(decodeURIComponent(tableNo))
  } else if (cart.tableNo) {
    tableInput.value = cart.tableNo
  }
})

function extractTableNo(value: string) {
  const content = value.trim()
  if (!content) {
    return ''
  }

  if (/^https?:\/\//i.test(content)) {
    const query = content.split('?')[1] || ''
    const match = query.match(/(?:tableNo|table)=([^&]+)/i)
    return match ? decodeURIComponent(match[1]).toUpperCase() : ''
  }

  return /^[a-z0-9-]{1,12}$/i.test(content) ? content.toUpperCase() : ''
}

function scanTable() {
  uni.scanCode({
    onlyFromCamera: true,
    scanType: ['qrCode'],
    success: (result) => {
      const tableNo = extractTableNo(result.result)
      if (!tableNo) {
        uni.showToast({ title: '未识别到有效桌号', icon: 'none' })
        return
      }
      openMenu(tableNo)
    },
    fail: () => {
      uni.showToast({ title: '扫码未完成，可手动输入桌号', icon: 'none' })
    }
  })
}

function submitTable() {
  const tableNo = tableInput.value.trim().toUpperCase()
  if (!tableNo) {
    uni.showToast({ title: '请先输入桌号', icon: 'none' })
    return
  }
  openMenu(tableNo)
}

function openMenu(tableNo: string) {
  cart.setTableNo(tableNo)
  uni.navigateTo({
    url: `/pages/menu/index?tableNo=${encodeURIComponent(tableNo)}`
  })
}

function openOrders() {
  uni.navigateTo({ url: '/pages/orders/index' })
}
</script>

<template>
  <view class="home-page">
    <view class="topbar">
      <view>
        <view class="brand-mark">灶边</view>
        <view class="brand-subtitle">ZAOBIAN KITCHEN</view>
      </view>
      <button class="history-button" hover-class="button-hover" @tap="openOrders">
        <text class="history-icon">◷</text>
        <text>历史订单</text>
      </button>
    </view>

    <view class="hero-card">
      <view class="hero-decor hero-decor-one"></view>
      <view class="hero-decor hero-decor-two"></view>
      <view class="hero-content">
        <view class="section-label hero-label">SCAN · ORDER · ENJOY</view>
        <view class="hero-title">坐下，慢慢吃。</view>
        <view class="hero-copy">扫一扫桌角二维码，热腾腾的好味道马上就来。</view>

        <button class="scan-button" hover-class="scan-button-hover" @tap="scanTable">
          <view class="scan-icon">
            <view class="scan-corner corner-tl"></view>
            <view class="scan-corner corner-tr"></view>
            <view class="scan-corner corner-bl"></view>
            <view class="scan-corner corner-br"></view>
            <view class="scan-line"></view>
          </view>
          <view class="scan-text">
            <text class="scan-title">扫桌码开始点餐</text>
            <text class="scan-subtitle">请扫描桌角的专属二维码</text>
          </view>
          <text class="scan-arrow">›</text>
        </button>

        <view class="table-divider">
          <view class="divider-line"></view>
          <text>或手动输入桌号</text>
          <view class="divider-line"></view>
        </view>

        <view class="table-entry">
          <view class="table-input-wrap">
            <text class="table-prefix">桌</text>
            <input
              v-model="tableInput"
              class="table-input"
              maxlength="12"
              placeholder="例如 A08"
              placeholder-class="input-placeholder"
              confirm-type="go"
              @confirm="submitTable"
            />
          </view>
          <button class="table-submit" hover-class="button-hover" @tap="submitTable">进入</button>
        </view>
      </view>
    </view>

    <view class="demo-row">
      <view class="demo-copy">
        <text class="demo-title">先看看菜单？</text>
        <text class="demo-subtitle">使用体验桌号 A08</text>
      </view>
      <button class="demo-button" hover-class="button-hover" @tap="openMenu('A08')">
        体验点餐
      </button>
    </view>

    <view class="feature-grid">
      <view class="feature-card">
        <text class="feature-emoji">🥢</text>
        <text class="feature-title">现点现做</text>
        <text class="feature-copy">下单后厨房立即接单</text>
      </view>
      <view class="feature-card feature-card-warm">
        <text class="feature-emoji">⏱</text>
        <text class="feature-title">无需等待</text>
        <text class="feature-copy">桌边下单，更快开餐</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  padding: calc(env(safe-area-inset-top) + 28rpx) 32rpx 48rpx;
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.brand-mark {
  color: #2e2923;
  font-family: 'Songti SC', 'STSong', serif;
  font-size: 44rpx;
  font-weight: 700;
  letter-spacing: 6rpx;
}

.brand-subtitle {
  margin-top: 2rpx;
  color: #a0846b;
  font-size: 17rpx;
  font-weight: 600;
  letter-spacing: 3rpx;
}

.history-button {
  display: flex;
  gap: 8rpx;
  align-items: center;
  height: 68rpx;
  padding: 0 22rpx;
  color: #6c5948;
  font-size: 23rpx;
  background: rgba(255, 251, 245, 0.72);
  border: 2rpx solid #eadbcc;
  border-radius: 34rpx;
}

.history-icon {
  color: #b75634;
  font-size: 30rpx;
}

.hero-card {
  position: relative;
  overflow: hidden;
  background: #2d3027;
  border-radius: 42rpx;
  box-shadow: 0 28rpx 56rpx rgba(54, 44, 33, 0.16);
}

.hero-decor {
  position: absolute;
  border-radius: 50%;
}

.hero-decor-one {
  top: -90rpx;
  right: -100rpx;
  width: 310rpx;
  height: 310rpx;
  background: #6b7451;
}

.hero-decor-two {
  top: 130rpx;
  right: 42rpx;
  width: 90rpx;
  height: 90rpx;
  background: #e0ad68;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 48rpx 36rpx 38rpx;
}

.hero-label {
  color: #d9c1a8;
}

.hero-title {
  margin-top: 24rpx;
  color: #fff8eb;
  font-family: 'Songti SC', 'STSong', serif;
  font-size: 70rpx;
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: 2rpx;
}

.hero-copy {
  width: 86%;
  margin-top: 18rpx;
  color: rgba(255, 248, 235, 0.66);
  font-size: 25rpx;
  line-height: 1.75;
}

.scan-button {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 126rpx;
  margin-top: 38rpx;
  padding: 0 24rpx;
  color: #2c2823;
  text-align: left;
  background: #f7e7ce;
  border-radius: 28rpx;
}

.scan-icon {
  position: relative;
  flex: 0 0 68rpx;
  width: 68rpx;
  height: 68rpx;
  margin-right: 20rpx;
}

.scan-corner {
  position: absolute;
  width: 17rpx;
  height: 17rpx;
  border-color: #cf5b35;
  border-style: solid;
}

.corner-tl {
  top: 0;
  left: 0;
  border-width: 4rpx 0 0 4rpx;
}

.corner-tr {
  top: 0;
  right: 0;
  border-width: 4rpx 4rpx 0 0;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-width: 0 0 4rpx 4rpx;
}

.corner-br {
  right: 0;
  bottom: 0;
  border-width: 0 4rpx 4rpx 0;
}

.scan-line {
  position: absolute;
  top: 32rpx;
  left: 12rpx;
  width: 44rpx;
  height: 4rpx;
  background: #cf5b35;
  border-radius: 2rpx;
}

.scan-text {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.scan-title {
  font-size: 29rpx;
  font-weight: 700;
}

.scan-subtitle {
  margin-top: 7rpx;
  color: #8e735b;
  font-size: 21rpx;
}

.scan-arrow {
  color: #b46b4f;
  font-size: 48rpx;
}

.table-divider {
  display: flex;
  gap: 18rpx;
  align-items: center;
  margin: 32rpx 0 24rpx;
  color: rgba(255, 248, 235, 0.42);
  font-size: 21rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: rgba(255, 248, 235, 0.14);
}

.table-entry {
  display: flex;
  gap: 14rpx;
}

.table-input-wrap {
  display: flex;
  flex: 1;
  align-items: center;
  height: 86rpx;
  padding: 0 24rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 248, 235, 0.14);
  border-radius: 24rpx;
}

.table-prefix {
  margin-right: 14rpx;
  color: #c1a98f;
  font-size: 23rpx;
}

.table-input {
  flex: 1;
  height: 86rpx;
  color: #fff8eb;
  font-size: 27rpx;
  font-weight: 600;
}

.table-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 128rpx;
  color: #2d3027;
  font-size: 26rpx;
  font-weight: 700;
  background: #e8bc79;
  border-radius: 24rpx;
}

.demo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22rpx;
  padding: 24rpx 26rpx;
  background: rgba(255, 251, 245, 0.72);
  border: 2rpx solid #ecdfd2;
  border-radius: 26rpx;
}

.demo-copy {
  display: flex;
  flex-direction: column;
}

.demo-title {
  color: #483a2e;
  font-weight: 650;
}

.demo-subtitle {
  margin-top: 5rpx;
  color: #9a8572;
  font-size: 21rpx;
}

.demo-button {
  padding: 14rpx 22rpx;
  color: #ad4f31;
  font-size: 23rpx;
  font-weight: 650;
  background: #f8e7d6;
  border-radius: 18rpx;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
  margin-top: 22rpx;
}

.feature-card {
  display: flex;
  flex-direction: column;
  padding: 26rpx;
  background: #e6ead9;
  border-radius: 26rpx;
}

.feature-card-warm {
  background: #f1dcc6;
}

.feature-emoji {
  font-size: 36rpx;
}

.feature-title {
  margin-top: 14rpx;
  color: #433a30;
  font-weight: 650;
}

.feature-copy {
  margin-top: 6rpx;
  color: #817164;
  font-size: 20rpx;
}

.button-hover,
.scan-button-hover {
  opacity: 0.75;
}
</style>
