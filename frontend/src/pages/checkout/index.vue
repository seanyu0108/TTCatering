<script setup lang="ts">
import { computed, ref } from 'vue'
import { createOrder } from '@/api/orders'
import { useCartStore } from '@/stores/cart'
import type { OrderType } from '@/types/order'
import { formatFen } from '@/utils/format'

const cart = useCartStore()
const orderType = ref<OrderType>('DINE_IN')
const remark = ref('')
const submitting = ref(false)
const idempotencyKey = `web-${Date.now()}-${Math.random().toString(16).slice(2)}`

const tableNo = computed(() => cart.tableNo || 'A08')

async function submitOrder() {
  if (!cart.lines.length || submitting.value) {
    return
  }

  submitting.value = true
  try {
    const order = await createOrder(
      {
        tableNo: tableNo.value,
        orderType: orderType.value,
        remark: remark.value.trim(),
        lines: cart.lines.map((line) => ({
          itemId: line.id,
          quantity: line.quantity
        }))
      },
      idempotencyKey
    )

    cart.clear()
    uni.redirectTo({
      url: `/pages/order/index?orderNo=${encodeURIComponent(order.orderNo)}&created=1`
    })
  } catch (error) {
    uni.showToast({
      title: error instanceof Error ? error.message : '下单失败，请重试',
      icon: 'none',
      duration: 2600
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="checkout-page">
    <view class="checkout-heading">
      <view class="section-label">YOUR ORDER</view>
      <view class="checkout-title">确认一下，马上开做</view>
      <view class="checkout-subtitle">桌号 {{ tableNo }} · 共 {{ cart.totalQuantity }} 份</view>
    </view>

    <view v-if="cart.lines.length" class="content-stack">
      <view class="panel">
        <view class="panel-heading">
          <view class="panel-title">用餐方式</view>
          <view class="panel-caption">请选择</view>
        </view>
        <view class="order-type-grid">
          <button
            class="order-type-card"
            :class="{ 'order-type-active': orderType === 'DINE_IN' }"
            @tap="orderType = 'DINE_IN'"
          >
            <text class="order-type-icon">🥢</text>
            <text class="order-type-name">堂食</text>
            <text class="order-type-note">在店内享用</text>
          </button>
          <button
            class="order-type-card"
            :class="{ 'order-type-active': orderType === 'TAKEAWAY' }"
            @tap="orderType = 'TAKEAWAY'"
          >
            <text class="order-type-icon">📦</text>
            <text class="order-type-name">打包</text>
            <text class="order-type-note">打包带走</text>
          </button>
        </view>
      </view>

      <view class="panel">
        <view class="panel-heading">
          <view class="panel-title">菜品明细</view>
          <view class="panel-caption">{{ cart.totalQuantity }} 份</view>
        </view>
        <view v-for="line in cart.lines" :key="line.id" class="checkout-line">
          <view class="line-visual" :style="{ background: line.tone }">{{ line.emoji }}</view>
          <view class="line-copy">
            <view class="line-name">{{ line.name }}</view>
            <view class="line-meta">¥{{ formatFen(line.priceFen) }} × {{ line.quantity }}</view>
          </view>
          <view class="line-total">¥{{ formatFen(line.priceFen * line.quantity) }}</view>
        </view>
      </view>

      <view class="panel remark-panel">
        <view class="panel-heading">
          <view class="panel-title">口味备注</view>
          <view class="panel-caption">选填</view>
        </view>
        <textarea
          v-model="remark"
          class="remark-input"
          maxlength="120"
          auto-height
          placeholder="例如：少辣，不要香菜"
          placeholder-class="remark-placeholder"
        ></textarea>
      </view>

      <view class="summary-panel">
        <view class="summary-row">
          <text>菜品小计</text>
          <text>¥{{ formatFen(cart.totalFen) }}</text>
        </view>
        <view class="summary-row summary-total">
          <text>合计</text>
          <text><text class="summary-currency">¥</text>{{ formatFen(cart.totalFen) }}</text>
        </view>
        <view class="summary-note">价格由服务端重新计算，当前演示版本不产生实际扣款</view>
      </view>
    </view>

    <view v-else class="empty-state">
      <view class="empty-title">购物车还是空的</view>
      <view class="empty-copy">返回菜单挑选几道喜欢的菜吧</view>
    </view>

    <view class="checkout-footer">
      <view class="footer-total">
        <text class="footer-label">合计</text>
        <text class="footer-price"><text class="footer-currency">¥</text>{{ formatFen(cart.totalFen) }}</text>
      </view>
      <button
        class="submit-button"
        :disabled="!cart.lines.length || submitting"
        @tap="submitOrder"
      >
        {{ submitting ? '提交中…' : '确认下单' }}
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  padding: 26rpx 32rpx calc(150rpx + env(safe-area-inset-bottom));
}

.checkout-heading {
  padding: 12rpx 4rpx 28rpx;
}

.checkout-title {
  margin-top: 10rpx;
  color: #2d2823;
  font-family: 'Songti SC', 'STSong', serif;
  font-size: 46rpx;
  font-weight: 700;
}

.checkout-subtitle {
  margin-top: 9rpx;
  color: #8d7a6a;
  font-size: 22rpx;
}

.content-stack {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.panel {
  padding: 26rpx;
  background: #fffaf3;
  border: 2rpx solid #eee1d4;
  border-radius: 30rpx;
  box-shadow: 0 12rpx 30rpx rgba(91, 65, 43, 0.04);
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.panel-title {
  color: #3d332b;
  font-size: 28rpx;
  font-weight: 700;
}

.panel-caption {
  color: #a28d7c;
  font-size: 20rpx;
}

.order-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.order-type-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 152rpx;
  padding: 20rpx 22rpx;
  color: #57483c;
  text-align: left;
  background: #f7f1e9;
  border: 2rpx solid transparent;
  border-radius: 24rpx;
}

.order-type-active {
  color: #9f472d;
  background: #f8e7d8;
  border-color: #d65b36;
}

.order-type-icon {
  font-size: 32rpx;
}

.order-type-name {
  margin-top: 8rpx;
  font-size: 26rpx;
  font-weight: 700;
}

.order-type-note {
  margin-top: 4rpx;
  color: #9d8877;
  font-size: 19rpx;
}

.checkout-line {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-top: 1rpx solid #f0e6dc;
}

.checkout-line:first-of-type {
  padding-top: 0;
  border-top: 0;
}

.line-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86rpx;
  height: 86rpx;
  margin-right: 18rpx;
  font-size: 42rpx;
  border-radius: 20rpx;
}

.line-copy {
  flex: 1;
  min-width: 0;
}

.line-name {
  color: #40372f;
  font-size: 25rpx;
  font-weight: 650;
}

.line-meta {
  margin-top: 8rpx;
  color: #9a8777;
  font-size: 20rpx;
}

.line-total {
  margin-left: 18rpx;
  color: #473b31;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 26rpx;
  font-weight: 700;
}

.remark-input {
  width: 100%;
  min-height: 94rpx;
  padding: 20rpx;
  color: #44382f;
  font-size: 24rpx;
  line-height: 1.6;
  background: #f7f1e9;
  border-radius: 20rpx;
}

.remark-placeholder {
  color: #b8a391;
}

.summary-panel {
  padding: 12rpx 8rpx 20rpx;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 4rpx;
  color: #7e6d60;
  font-size: 24rpx;
}

.summary-total {
  align-items: baseline;
  margin-top: 8rpx;
  padding-top: 22rpx;
  color: #312a24;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 30rpx;
  font-weight: 700;
  border-top: 1rpx solid #e5d8ca;
}

.summary-currency,
.footer-currency {
  margin-right: 4rpx;
  font-family: sans-serif;
  font-size: 20rpx;
}

.summary-note {
  padding: 8rpx 4rpx 0;
  color: #ac9a8b;
  font-size: 19rpx;
}

.empty-state {
  padding: 100rpx 32rpx;
  text-align: center;
}

.empty-title {
  color: #4b3e34;
  font-size: 32rpx;
  font-weight: 650;
}

.empty-copy {
  margin-top: 10rpx;
  color: #968272;
  font-size: 22rpx;
}

.checkout-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 18rpx 32rpx calc(18rpx + env(safe-area-inset-bottom));
  background: rgba(255, 250, 243, 0.97);
  border-top: 1rpx solid #e8dacd;
}

.footer-total {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.footer-label {
  color: #988475;
  font-size: 20rpx;
}

.footer-price {
  margin-top: 2rpx;
  color: #c34b29;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 40rpx;
  font-weight: 700;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 330rpx;
  height: 96rpx;
  color: #fff9ef;
  font-size: 28rpx;
  font-weight: 700;
  background: #d95732;
  border-radius: 27rpx;
}

.submit-button[disabled] {
  color: rgba(255, 249, 239, 0.72);
  background: #c8a89a;
}
</style>
